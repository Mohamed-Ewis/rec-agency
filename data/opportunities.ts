import type { Opportunity } from '~/types'

export const opportunities: Opportunity[] = [
  {
    id: 'opp_01',
    candidateId: 'can_ethan',
    jobId: 'job_fe',
    channel: 'email',
    subject: 'Frontend Engineer at Harbor Retail — thought of you',
    body: 'Sent the Harbor Nuxt brief. Ethan is React-first; asked if he will ramp.',
    status: 'sent',
    sentAt: '2026-09-02T10:15:00Z',
    actorId: 'usr_elena'
  },
  {
    id: 'opp_02',
    candidateId: 'can_ruby',
    jobId: 'job_fe',
    channel: 'linkedin',
    subject: 'Harbor perm seat — re-engage',
    body: 'Asked Ruby if she would take perm at 100–105k.',
    status: 'replied',
    sentAt: '2026-09-04T16:10:00Z',
    actorId: 'usr_elena'
  },
  {
    id: 'opp_03',
    candidateId: 'can_kate',
    jobId: 'job_be',
    channel: 'email',
    subject: 'Senior Backend Engineer at Meridian Health',
    body: 'Outlined event-driven services. Kate asked for a screen.',
    status: 'replied',
    sentAt: '2026-08-30T09:20:00Z',
    actorId: 'usr_james'
  },
  {
    id: 'opp_04',
    candidateId: 'can_sofia',
    jobId: 'job_ml',
    channel: 'linkedin',
    subject: 'ML Engineer at Quorum — production only',
    body: 'Flagged that Quorum does not want research-only. No reply yet.',
    status: 'sent',
    sentAt: '2026-08-03T11:00:00Z',
    actorId: 'usr_james'
  },
  {
    id: 'opp_05',
    candidateId: 'can_malik',
    jobId: 'job_mob',
    channel: 'email',
    subject: 'Mobile Engineer at Helios Mobility',
    body: 'Maps/offline brief. Malik declined — wants consumer social.',
    status: 'declined',
    sentAt: '2026-08-12T14:40:00Z',
    actorId: 'usr_elena'
  },
  {
    id: 'opp_06',
    candidateId: 'can_theo',
    jobId: 'job_ops',
    channel: 'email',
    subject: 'DevOps Engineer at Northwind Cloud',
    body: 'Actions migration story. Waiting on a reply after the no-show.',
    status: 'sent',
    sentAt: '2026-09-06T08:10:00Z',
    actorId: 'usr_james'
  },
  {
    id: 'opp_07',
    candidateId: 'can_paul',
    jobId: 'job_plat',
    channel: 'linkedin',
    subject: 'Staff Platform at Atlas Payments',
    body: 'Asked about recent Go. Paul said he will think overnight.',
    status: 'replied',
    sentAt: '2026-09-12T08:35:00Z',
    actorId: 'usr_elena'
  }
]
