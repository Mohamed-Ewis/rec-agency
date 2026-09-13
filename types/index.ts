export type Role = 'admin' | 'recruiter' | 'manager' | 'viewer'

export type JobStatus = 'draft' | 'open' | 'paused' | 'filled' | 'closed'
export type JobPriority = 'low' | 'medium' | 'high' | 'urgent'
export type WorkMode = 'remote' | 'hybrid' | 'onsite'

export type PipelineStage =
  | 'sourced'
  | 'contacted'
  | 'interested'
  | 'screening'
  | 'qualified'
  | 'submitted'
  | 'interview'
  | 'offer'
  | 'hired'

export type SideStage = 'rejected' | 'withdrawn' | 'on_hold'

export type InterviewStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show'
export type InterviewStage = 'screening' | 'technical' | 'hiring_manager' | 'final' | 'offer'

export type ActivityType =
  | 'email'
  | 'linkedin'
  | 'call'
  | 'note'
  | 'interview'
  | 'task'
  | 'status_change'

export type TaskStatus = 'open' | 'in_progress' | 'done' | 'cancelled'
export type TaskPriority = 'low' | 'medium' | 'high'

export type InvoiceStatus = 'draft' | 'sent' | 'outstanding' | 'paid' | 'overdue'

export type OutreachChannel = 'email' | 'linkedin'
export type OpportunityStatus = 'drafted' | 'sent' | 'replied' | 'declined'

export type PlacementStatus = 'guarantee' | 'cleared' | 'replaced'

export type Availability = 'immediate' | '2_weeks' | '1_month' | 'notice' | 'passive'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  title: string
  avatarHue: number
  active: boolean
}

export interface ClientContact {
  id: string
  name: string
  title: string
  email: string
  phone: string
  isPrimary: boolean
}

export interface Client {
  id: string
  name: string
  industry: string
  website: string
  location: string
  feePercent: number
  agreement: string
  ownerId: string
  notes: string
  contacts: ClientContact[]
  createdAt: string
}

export interface Job {
  id: string
  title: string
  clientId: string
  status: JobStatus
  priority: JobPriority
  seniority: string
  location: string
  workMode: WorkMode
  salaryMin: number
  salaryMax: number
  currency: 'GBP'
  ownerId: string
  openedAt: string
  targetHireDate: string
  mustHave: string[]
  niceToHave: string[]
  description: string
  headcount: number
}

export interface AiMatch {
  score: number
  matchedSkills: string[]
  missingSkills: string[]
  explanation: string
  nextAction: string
}

export interface Candidate {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  location: string
  linkedinUrl: string
  cvSummary: string
  skills: string[]
  yearsExperience: number
  currentTitle: string
  salaryExpectation: number
  availability: Availability
  source: string
  tags: string[]
  ownerId: string
  notes: string
  createdAt: string
}

export interface PipelineEntry {
  id: string
  candidateId: string
  jobId: string
  stage: PipelineStage
  sideStage?: SideStage
  ownerId: string
  updatedAt: string
  submittedAt?: string
  aiMatch: AiMatch
}

export interface Interview {
  id: string
  candidateId: string
  jobId: string
  interviewer: string
  startsAt: string
  durationMin: number
  stage: InterviewStage
  status: InterviewStatus
  feedback?: string
  ownerId: string
}

export interface Activity {
  id: string
  type: ActivityType
  title: string
  body: string
  at: string
  actorId: string
  candidateId?: string
  jobId?: string
  clientId?: string
}

export interface Task {
  id: string
  title: string
  dueAt: string
  priority: TaskPriority
  status: TaskStatus
  ownerId: string
  candidateId?: string
  jobId?: string
  clientId?: string
}

export interface Invoice {
  id: string
  clientId: string
  jobId: string
  candidateId: string
  amount: number
  currency: 'GBP'
  status: InvoiceStatus
  issuedAt: string
  dueAt: string
  paidAt?: string
}

export interface Opportunity {
  id: string
  candidateId: string
  jobId: string
  channel: OutreachChannel
  subject: string
  body: string
  status: OpportunityStatus
  sentAt: string
  actorId: string
}

export interface Placement {
  id: string
  candidateId: string
  jobId: string
  clientId: string
  salary: number
  feePercent: number
  feeAmount: number
  recruiterId: string
  recruiterSharePercent: number
  recruiterCommission: number
  invoiceId: string
  placedAt: string
  guaranteeUntil: string
  status: PlacementStatus
}

export type PermissionResource =
  | 'jobs'
  | 'candidates'
  | 'clients'
  | 'pipeline'
  | 'interviews'
  | 'activities'
  | 'tasks'
  | 'reports'
  | 'users'
  | 'settings'
  | 'sourcing'
  | 'opportunities'
  | 'placements'

export type PermissionActionName = 'view' | 'create' | 'edit' | 'delete' | 'manage'

export type PermissionKey = `${PermissionResource}:${PermissionActionName}`

export interface PermissionAction {
  resource: PermissionResource
  action: PermissionActionName
}

export interface UserCredential {
  email: string
  password: string
  userId: string
}
