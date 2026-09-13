import type { Invoice } from '~/types'

export const invoices: Invoice[] = [
  {
    id: 'INV-1011',
    clientId: 'cli_atlas',
    jobId: 'job_em',
    candidateId: 'can_nora',
    amount: 31200,
    currency: 'GBP',
    status: 'paid',
    issuedAt: '2026-03-12',
    dueAt: '2026-04-11',
    paidAt: '2026-04-02'
  },
  {
    id: 'INV-1028',
    clientId: 'cli_harbor',
    jobId: 'job_fe',
    candidateId: 'can_ruby',
    amount: 18400,
    currency: 'GBP',
    status: 'paid',
    issuedAt: '2026-05-20',
    dueAt: '2026-06-19',
    paidAt: '2026-06-10'
  },
  {
    id: 'INV-1042',
    clientId: 'cli_meridian',
    jobId: 'job_de',
    candidateId: 'can_owen',
    amount: 26250,
    currency: 'GBP',
    status: 'overdue',
    issuedAt: '2026-08-06',
    dueAt: '2026-09-05'
  },
  {
    id: 'INV-1048',
    clientId: 'cli_helios',
    jobId: 'job_pd',
    candidateId: 'can_sienna',
    amount: 22500,
    currency: 'GBP',
    status: 'draft',
    issuedAt: '2026-09-12',
    dueAt: '2026-10-12'
  }
]
