import { defineStore } from 'pinia'
import {
  activities as seedActivities,
  candidates as seedCandidates,
  clients as seedClients,
  interviews as seedInterviews,
  invoices as seedInvoices,
  jobs as seedJobs,
  opportunities as seedOpportunities,
  pipeline as seedPipeline,
  placements as seedPlacements,
  tasks as seedTasks,
  users as seedUsers
} from '~/data'
import type {
  Activity,
  Candidate,
  Client,
  Interview,
  Invoice,
  Job,
  JobStatus,
  Opportunity,
  OpportunityStatus,
  OutreachChannel,
  PipelineEntry,
  PipelineStage,
  Placement,
  PlacementStatus,
  Role,
  Task,
  User
} from '~/types'
import { GUARANTEE_DAYS, PIPELINE_STAGES, RECRUITER_SHARE_PERCENT, TODAY } from '~/utils/constants'
import { scoreMatch } from '~/utils/matching'

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2, 10)}`
}

function addDays(isoDate: string, days: number) {
  const next = new Date(`${isoDate.slice(0, 10)}T00:00:00Z`)
  next.setUTCDate(next.getUTCDate() + days)
  return next.toISOString().slice(0, 10)
}

function nextInvoiceId(existing: Invoice[]) {
  const nums = existing
    .map(item => Number(item.id.replace(/\D/g, '')))
    .filter(value => Number.isFinite(value))
  return `INV-${(nums.length ? Math.max(...nums) : 1000) + 1}`
}

export const useAgencyStore = defineStore('agency', () => {
  const jobs = ref<Job[]>(clone(seedJobs))
  const candidates = ref<Candidate[]>(clone(seedCandidates))
  const clients = ref<Client[]>(clone(seedClients))
  const pipeline = ref<PipelineEntry[]>(clone(seedPipeline))
  const interviews = ref<Interview[]>(clone(seedInterviews))
  const activities = ref<Activity[]>(clone(seedActivities))
  const tasks = ref<Task[]>(clone(seedTasks))
  const invoices = ref<Invoice[]>(clone(seedInvoices))
  const opportunities = ref<Opportunity[]>(clone(seedOpportunities))
  const placements = ref<Placement[]>(clone(seedPlacements))
  const users = ref<User[]>(clone(seedUsers))

  const jobById = computed(() => Object.fromEntries(jobs.value.map(job => [job.id, job])))
  const candidateById = computed(() => Object.fromEntries(candidates.value.map(item => [item.id, item])))
  const clientById = computed(() => Object.fromEntries(clients.value.map(item => [item.id, item])))
  const userById = computed(() => Object.fromEntries(users.value.map(item => [item.id, item])))

  const activeAdmins = computed(() => users.value.filter(user => user.active && user.role === 'admin'))

  function userName(id: string) {
    return userById.value[id]?.name ?? 'Unknown'
  }

  function candidateName(id: string) {
    const candidate = candidateById.value[id]
    return candidate ? `${candidate.firstName} ${candidate.lastName}` : 'Unknown'
  }

  function entriesForJob(jobId: string) {
    return pipeline.value.filter(entry => entry.jobId === jobId && !entry.sideStage)
  }

  function entriesForCandidate(candidateId: string) {
    return pipeline.value.filter(entry => entry.candidateId === candidateId)
  }

  function addActivity(partial: Omit<Activity, 'id' | 'at'> & { at?: string }) {
    activities.value.unshift({
      id: uid('act'),
      at: partial.at ?? new Date().toISOString(),
      ...partial
    })
  }

  function setJobStatus(jobId: string, status: JobStatus, actorId: string) {
    const job = jobs.value.find(item => item.id === jobId)
    if (!job) return
    const previous = job.status
    job.status = status
    addActivity({
      type: 'status_change',
      title: `${job.title} set to ${status}`,
      body: `Previous status: ${previous}.`,
      actorId,
      jobId,
      clientId: job.clientId
    })
  }

  function duplicateJob(jobId: string, actorId: string) {
    const job = jobs.value.find(item => item.id === jobId)
    if (!job) return null
    const copy: Job = {
      ...clone(job),
      id: uid('job'),
      title: `${job.title} (Copy)`,
      status: 'draft',
      openedAt: new Date().toISOString().slice(0, 10)
    }
    jobs.value.unshift(copy)
    addActivity({
      type: 'note',
      title: `Duplicated ${job.title}`,
      body: 'New draft created for intake edits.',
      actorId,
      jobId: copy.id,
      clientId: job.clientId
    })
    return copy
  }

  function createJob(input: Omit<Job, 'id' | 'openedAt' | 'currency'> & Partial<Pick<Job, 'openedAt' | 'currency'>>, actorId: string) {
    const job: Job = {
      ...input,
      id: uid('job'),
      currency: input.currency ?? 'GBP',
      openedAt: input.openedAt ?? new Date().toISOString().slice(0, 10)
    }
    jobs.value.unshift(job)
    addActivity({
      type: 'status_change',
      title: `Opened ${job.title}`,
      body: `New mandate for ${clientById.value[job.clientId]?.name ?? 'a client'}.`,
      actorId,
      jobId: job.id,
      clientId: job.clientId
    })
    return job
  }

  function updateJob(jobId: string, patch: Partial<Job>) {
    const job = jobs.value.find(item => item.id === jobId)
    if (!job) return
    Object.assign(job, patch)
  }

  function addCandidateToJob(jobId: string, candidateId: string, actorId: string) {
    const exists = pipeline.value.find(entry => entry.jobId === jobId && entry.candidateId === candidateId)
    if (exists) return exists
    const job = jobById.value[jobId]
    const candidate = candidateById.value[candidateId]
    const entry: PipelineEntry = {
      id: uid('pip'),
      candidateId,
      jobId,
      stage: 'sourced',
      ownerId: actorId,
      updatedAt: new Date().toISOString(),
      aiMatch: candidate && job
        ? scoreMatch(candidate, job)
        : {
            score: 50,
            matchedSkills: [],
            missingSkills: job?.mustHave ?? [],
            explanation: 'Mock match generated from overlapping must-have skills. Review before treating as a decision.',
            nextAction: 'Source complete — send a personalised first touch.'
          }
    }
    pipeline.value.unshift(entry)
    addActivity({
      type: 'status_change',
      title: `Added ${candidateName(candidateId)} to ${job?.title ?? 'job'}`,
      body: 'Stage set to Sourced.',
      actorId,
      candidateId,
      jobId,
      clientId: job?.clientId
    })
    return entry
  }

  function movePipeline(entryId: string, stage: PipelineStage, actorId: string) {
    const entry = pipeline.value.find(item => item.id === entryId)
    if (!entry) return
    const previous = entry.stage
    entry.stage = stage
    entry.updatedAt = new Date().toISOString()
    if (stage === 'submitted' && !entry.submittedAt) {
      entry.submittedAt = new Date().toISOString().slice(0, 10)
    }
    addActivity({
      type: 'status_change',
      title: `${candidateName(entry.candidateId)} → ${PIPELINE_STAGES.find(item => item.id === stage)?.label}`,
      body: `Moved from ${previous} on ${jobById.value[entry.jobId]?.title ?? 'job'}.`,
      actorId,
      candidateId: entry.candidateId,
      jobId: entry.jobId,
      clientId: jobById.value[entry.jobId]?.clientId
    })
    if (stage === 'hired' && previous !== 'hired') {
      return placeHire(entry, actorId)
    }
    return { placement: null }
  }

  function updateTask(taskId: string, patch: Partial<Task>) {
    const task = tasks.value.find(item => item.id === taskId)
    if (!task) return
    Object.assign(task, patch)
  }

  function addTask(task: Omit<Task, 'id'>) {
    const created = { ...task, id: uid('tsk') }
    tasks.value.unshift(created)
    return created
  }

  function updateUserRole(userId: string, role: Role, actorId: string) {
    const user = users.value.find(item => item.id === userId)
    if (!user) return { ok: false as const, error: 'User not found.' }
    if (user.role === role) return { ok: true as const }
    if (user.role === 'admin' && role !== 'admin' && activeAdmins.value.length <= 1) {
      return { ok: false as const, error: 'Keep at least one active admin on the desk.' }
    }
    const previous = user.role
    user.role = role
    addActivity({
      type: 'status_change',
      title: `${user.name} role set to ${role}`,
      body: `Previous role: ${previous}. Permissions now follow the ${role} set.`,
      actorId
    })
    return { ok: true as const }
  }

  function setUserActive(userId: string, active: boolean, actorId: string) {
    const user = users.value.find(item => item.id === userId)
    if (!user) return { ok: false as const, error: 'User not found.' }
    if (user.active === active) return { ok: true as const }
    if (user.role === 'admin' && user.active && !active && activeAdmins.value.length <= 1) {
      return { ok: false as const, error: 'Keep at least one active admin on the desk.' }
    }
    user.active = active
    addActivity({
      type: 'status_change',
      title: `${user.name} ${active ? 'activated' : 'disabled'}`,
      body: active ? 'Account can sign in again.' : 'Account can no longer sign in.',
      actorId
    })
    return { ok: true as const }
  }

  function addNote(body: string, actorId: string, links: { candidateId?: string; jobId?: string; clientId?: string }) {
    addActivity({
      type: 'note',
      title: 'Note added',
      body,
      actorId,
      ...links
    })
  }

  function matchFor(candidateId: string, jobId: string) {
    const candidate = candidateById.value[candidateId]
    const job = jobById.value[jobId]
    if (!candidate || !job) return null
    return scoreMatch(candidate, job)
  }

  function feePreview(candidateId: string, jobId: string) {
    const candidate = candidateById.value[candidateId]
    const job = jobById.value[jobId]
    const client = job ? clientById.value[job.clientId] : undefined
    if (!candidate || !job || !client) return null
    const salary = candidate.salaryExpectation
    const feePercent = client.feePercent
    const feeAmount = Math.round((salary * feePercent) / 100)
    return {
      salary,
      feePercent,
      feeAmount,
      recruiterSharePercent: RECRUITER_SHARE_PERCENT,
      recruiterCommission: Math.round((feeAmount * RECRUITER_SHARE_PERCENT) / 100),
      clientName: client.name
    }
  }

  function talentForJob(jobId: string) {
    const job = jobById.value[jobId]
    if (!job) return []
    return candidates.value
      .map((candidate) => {
        const onJob = pipeline.value.some(entry => entry.jobId === jobId && entry.candidateId === candidate.id)
        const lastSent = opportunities.value.find(item => item.jobId === jobId && item.candidateId === candidate.id)
        return {
          candidate,
          job,
          match: scoreMatch(candidate, job),
          onJob,
          lastSent
        }
      })
      .sort((a, b) => b.match.score - a.match.score)
  }

  function jobsForCandidate(candidateId: string) {
    const candidate = candidateById.value[candidateId]
    if (!candidate) return []
    return jobs.value
      .filter(job => job.status === 'open' || job.status === 'paused')
      .map((job) => {
        const onJob = pipeline.value.some(entry => entry.jobId === job.id && entry.candidateId === candidateId)
        const lastSent = opportunities.value.find(item => item.jobId === job.id && item.candidateId === candidateId)
        return {
          candidate,
          job,
          match: scoreMatch(candidate, job),
          onJob,
          lastSent
        }
      })
      .sort((a, b) => b.match.score - a.match.score)
  }

  function sendOpportunity(
    input: { candidateId: string; jobId: string; channel: OutreachChannel; subject: string; body: string },
    actorId: string
  ) {
    const job = jobById.value[input.jobId]
    const candidate = candidateById.value[input.candidateId]
    if (!job || !candidate) return null

    const opportunity: Opportunity = {
      id: uid('opp'),
      candidateId: input.candidateId,
      jobId: input.jobId,
      channel: input.channel,
      subject: input.subject,
      body: input.body,
      status: 'sent',
      sentAt: new Date().toISOString(),
      actorId
    }
    opportunities.value.unshift(opportunity)

    addActivity({
      type: input.channel,
      title: `Sent ${job.title} to ${candidateName(input.candidateId)}`,
      body: input.subject,
      actorId,
      candidateId: input.candidateId,
      jobId: input.jobId,
      clientId: job.clientId
    })

    const entry = addCandidateToJob(input.jobId, input.candidateId, actorId)
    if (entry && entry.stage === 'sourced') {
      entry.stage = 'contacted'
      entry.updatedAt = new Date().toISOString()
    }

    addTask({
      title: `Follow up ${candidateName(input.candidateId)} on ${job.title}`,
      dueAt: addDays(TODAY, 3),
      priority: 'medium',
      status: 'open',
      ownerId: actorId,
      candidateId: input.candidateId,
      jobId: input.jobId,
      clientId: job.clientId
    })

    return opportunity
  }

  function setOpportunityStatus(opportunityId: string, status: OpportunityStatus, actorId: string) {
    const opportunity = opportunities.value.find(item => item.id === opportunityId)
    if (!opportunity || opportunity.status === status) return
    opportunity.status = status
    addActivity({
      type: 'status_change',
      title: `${candidateName(opportunity.candidateId)} ${status} ${jobById.value[opportunity.jobId]?.title ?? 'job'}`,
      body: `Outreach marked ${status}.`,
      actorId,
      candidateId: opportunity.candidateId,
      jobId: opportunity.jobId,
      clientId: jobById.value[opportunity.jobId]?.clientId
    })
  }

  function placeHire(entry: PipelineEntry, actorId: string) {
    const existing = placements.value.find(item => item.candidateId === entry.candidateId && item.jobId === entry.jobId)
    if (existing) return { placement: existing }

    const job = jobById.value[entry.jobId]
    const candidate = candidateById.value[entry.candidateId]
    const client = job ? clientById.value[job.clientId] : undefined
    const preview = feePreview(entry.candidateId, entry.jobId)
    if (!job || !candidate || !client || !preview) return { placement: null }

    let invoice = invoices.value.find(item => item.candidateId === entry.candidateId && item.jobId === entry.jobId)
    if (!invoice) {
      invoice = {
        id: nextInvoiceId(invoices.value),
        clientId: client.id,
        jobId: job.id,
        candidateId: candidate.id,
        amount: preview.feeAmount,
        currency: 'GBP',
        status: 'outstanding',
        issuedAt: TODAY,
        dueAt: addDays(TODAY, 30)
      }
      invoices.value.unshift(invoice)
    } else if (invoice.status === 'draft') {
      invoice.status = 'outstanding'
      invoice.amount = preview.feeAmount
    }

    const placement: Placement = {
      id: uid('plc'),
      candidateId: candidate.id,
      jobId: job.id,
      clientId: client.id,
      salary: preview.salary,
      feePercent: preview.feePercent,
      feeAmount: preview.feeAmount,
      recruiterId: entry.ownerId || actorId,
      recruiterSharePercent: preview.recruiterSharePercent,
      recruiterCommission: preview.recruiterCommission,
      invoiceId: invoice.id,
      placedAt: TODAY,
      guaranteeUntil: addDays(TODAY, GUARANTEE_DAYS),
      status: 'guarantee'
    }
    placements.value.unshift(placement)

    addActivity({
      type: 'status_change',
      title: `Invoice ${invoice.id} raised for ${candidateName(candidate.id)}`,
      body: `${preview.feePercent}% of ${preview.salary.toLocaleString('en-GB')} = ${preview.feeAmount.toLocaleString('en-GB')} fee. Recruiter share ${preview.recruiterSharePercent}%.`,
      actorId,
      candidateId: candidate.id,
      jobId: job.id,
      clientId: client.id
    })

    const hiredCount = pipeline.value.filter(item => item.jobId === job.id && item.stage === 'hired').length
    if (hiredCount >= job.headcount && job.status === 'open') {
      setJobStatus(job.id, 'filled', actorId)
    }

    return { placement }
  }

  function markInvoicePaid(invoiceId: string, actorId: string) {
    const invoice = invoices.value.find(item => item.id === invoiceId)
    if (!invoice || invoice.status === 'paid') return { ok: false as const, error: 'Invoice not found or already paid.' }
    invoice.status = 'paid'
    invoice.paidAt = TODAY
    const placement = placements.value.find(item => item.invoiceId === invoiceId)
    if (placement && placement.status === 'guarantee' && placement.guaranteeUntil <= TODAY) {
      placement.status = 'cleared'
    }
    addActivity({
      type: 'status_change',
      title: `${invoice.id} marked paid`,
      body: `Collected ${invoice.amount.toLocaleString('en-GB')} ${invoice.currency}.`,
      actorId,
      candidateId: invoice.candidateId,
      jobId: invoice.jobId,
      clientId: invoice.clientId
    })
    return { ok: true as const }
  }

  function setPlacementStatus(placementId: string, status: PlacementStatus, actorId: string) {
    const placement = placements.value.find(item => item.id === placementId)
    if (!placement || placement.status === status) return
    placement.status = status
    addActivity({
      type: 'status_change',
      title: `Placement ${status} for ${candidateName(placement.candidateId)}`,
      body: `Guarantee window ${placement.guaranteeUntil}.`,
      actorId,
      candidateId: placement.candidateId,
      jobId: placement.jobId,
      clientId: placement.clientId
    })
  }

  const openJobs = computed(() => jobs.value.filter(job => job.status === 'open'))
  const activeCandidateIds = computed(() => new Set(pipeline.value.filter(entry => !entry.sideStage && entry.stage !== 'hired').map(entry => entry.candidateId)))
  const offers = computed(() => pipeline.value.filter(entry => entry.stage === 'offer' && !entry.sideStage))
  const hires = computed(() => pipeline.value.filter(entry => entry.stage === 'hired'))
  const outstandingInvoices = computed(() => invoices.value.filter(item => item.status === 'outstanding' || item.status === 'overdue'))
  const paidRevenue = computed(() => invoices.value.filter(item => item.status === 'paid').reduce((sum, item) => sum + item.amount, 0))
  const outstandingRevenue = computed(() => outstandingInvoices.value.reduce((sum, item) => sum + item.amount, 0))
  const sentThisWeek = computed(() =>
    opportunities.value.filter(item => item.sentAt.slice(0, 10) >= '2026-09-08' && item.status !== 'drafted').length
  )
  const awaitingReply = computed(() => opportunities.value.filter(item => item.status === 'sent').length)
  const placementsInGuarantee = computed(() => placements.value.filter(item => item.status === 'guarantee'))
  const recruiterCommissionYtd = computed(() =>
    placements.value.reduce((sum, item) => sum + item.recruiterCommission, 0)
  )
  const outstandingCommission = computed(() =>
    placements.value
      .filter((item) => {
        const invoice = invoices.value.find(inv => inv.id === item.invoiceId)
        return invoice && (invoice.status === 'outstanding' || invoice.status === 'overdue')
      })
      .reduce((sum, item) => sum + item.feeAmount, 0)
  )

  return {
    users,
    jobs,
    candidates,
    clients,
    pipeline,
    interviews,
    activities,
    tasks,
    invoices,
    opportunities,
    placements,
    jobById,
    candidateById,
    clientById,
    userById,
    userName,
    candidateName,
    entriesForJob,
    entriesForCandidate,
    addActivity,
    setJobStatus,
    duplicateJob,
    createJob,
    updateJob,
    addCandidateToJob,
    movePipeline,
    updateTask,
    addTask,
    addNote,
    updateUserRole,
    setUserActive,
    matchFor,
    feePreview,
    talentForJob,
    jobsForCandidate,
    sendOpportunity,
    setOpportunityStatus,
    placeHire,
    markInvoicePaid,
    setPlacementStatus,
    activeAdmins,
    openJobs,
    activeCandidateIds,
    offers,
    hires,
    outstandingInvoices,
    paidRevenue,
    outstandingRevenue,
    sentThisWeek,
    awaitingReply,
    placementsInGuarantee,
    recruiterCommissionYtd,
    outstandingCommission
  }
})
