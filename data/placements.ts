import type { Placement } from '~/types'

export const placements: Placement[] = [
  {
    id: 'plc_01',
    candidateId: 'can_nora',
    jobId: 'job_em',
    clientId: 'cli_atlas',
    salary: 142000,
    feePercent: 22,
    feeAmount: 31200,
    recruiterId: 'usr_elena',
    recruiterSharePercent: 40,
    recruiterCommission: 12480,
    invoiceId: 'INV-1011',
    placedAt: '2026-03-01',
    guaranteeUntil: '2026-05-30',
    status: 'cleared'
  },
  {
    id: 'plc_02',
    candidateId: 'can_ruby',
    jobId: 'job_fe',
    clientId: 'cli_harbor',
    salary: 92000,
    feePercent: 20,
    feeAmount: 18400,
    recruiterId: 'usr_elena',
    recruiterSharePercent: 40,
    recruiterCommission: 7360,
    invoiceId: 'INV-1028',
    placedAt: '2026-05-12',
    guaranteeUntil: '2026-08-10',
    status: 'cleared'
  },
  {
    id: 'plc_03',
    candidateId: 'can_owen',
    jobId: 'job_de',
    clientId: 'cli_meridian',
    salary: 105000,
    feePercent: 25,
    feeAmount: 26250,
    recruiterId: 'usr_james',
    recruiterSharePercent: 40,
    recruiterCommission: 10500,
    invoiceId: 'INV-1042',
    placedAt: '2026-08-04',
    guaranteeUntil: '2026-11-04',
    status: 'guarantee'
  }
]
