import type { Task } from '~/types'

export const tasks: Task[] = [
  { id: 'tsk_01', title: 'Confirm Atlas visa sponsorship for Rafael', dueAt: '2026-09-15', priority: 'high', status: 'open', ownerId: 'usr_elena', candidateId: 'can_rafa', jobId: 'job_plat', clientId: 'cli_atlas' },
  { id: 'tsk_02', title: 'Close Ben Adler offer pack', dueAt: '2026-09-16', priority: 'high', status: 'in_progress', ownerId: 'usr_james', candidateId: 'can_ben', jobId: 'job_sec', clientId: 'cli_lumen' },
  { id: 'tsk_03', title: 'Helios 90 vs 95k decision — Sienna', dueAt: '2026-09-14', priority: 'high', status: 'open', ownerId: 'usr_elena', candidateId: 'can_sienna', jobId: 'job_pd', clientId: 'cli_helios' },
  { id: 'tsk_04', title: 'Chase Northwind interview slots for Marc', dueAt: '2026-09-14', priority: 'medium', status: 'open', ownerId: 'usr_james', candidateId: 'can_marc', jobId: 'job_ops', clientId: 'cli_northwind' },
  { id: 'tsk_05', title: 'Maya exception review — Iris 125k', dueAt: '2026-09-15', priority: 'high', status: 'open', ownerId: 'usr_maya', candidateId: 'can_iris', jobId: 'job_be', clientId: 'cli_meridian' },
  { id: 'tsk_06', title: 'Send Harbor Nuxt take-home to Yara', dueAt: '2026-09-15', priority: 'medium', status: 'open', ownerId: 'usr_elena', candidateId: 'can_yara', jobId: 'job_fe', clientId: 'cli_harbor' },
  { id: 'tsk_07', title: 'Prep Liam for Hana screen', dueAt: '2026-09-14', priority: 'medium', status: 'in_progress', ownerId: 'usr_james', candidateId: 'can_hana', jobId: 'job_ml', clientId: 'cli_quorum' },
  { id: 'tsk_08', title: '30-day placement check-in — Owen', dueAt: '2026-10-04', priority: 'low', status: 'open', ownerId: 'usr_james', candidateId: 'can_owen', jobId: 'job_de', clientId: 'cli_meridian' },
  { id: 'tsk_09', title: 'Chase overdue INV-1042', dueAt: '2026-09-13', priority: 'high', status: 'in_progress', ownerId: 'usr_tom', clientId: 'cli_meridian' },
  { id: 'tsk_10', title: 'Submit Luis as Harbor second name', dueAt: '2026-09-16', priority: 'medium', status: 'open', ownerId: 'usr_elena', candidateId: 'can_luis', jobId: 'job_fe', clientId: 'cli_harbor' },
  { id: 'tsk_11', title: 'Monthly pulse — Hugo / paused SRE', dueAt: '2026-09-19', priority: 'low', status: 'open', ownerId: 'usr_james', candidateId: 'can_hugo', jobId: 'job_sre', clientId: 'cli_northwind' },
  { id: 'tsk_12', title: 'Atlas equity brief for Leila', dueAt: '2026-09-15', priority: 'medium', status: 'in_progress', ownerId: 'usr_elena', candidateId: 'can_leila', jobId: 'job_em', clientId: 'cli_atlas' },
  { id: 'tsk_13', title: 'Reschedule Theo Grant screen', dueAt: '2026-09-17', priority: 'low', status: 'open', ownerId: 'usr_james', candidateId: 'can_theo', jobId: 'job_ops' },
  { id: 'tsk_14', title: 'Book Claire founder interview', dueAt: '2026-09-18', priority: 'medium', status: 'open', ownerId: 'usr_elena', candidateId: 'can_claire', jobId: 'job_pd', clientId: 'cli_helios' },
  { id: 'tsk_15', title: 'Clarify Ruby perm vs contract', dueAt: '2026-09-18', priority: 'medium', status: 'open', ownerId: 'usr_elena', candidateId: 'can_ruby', jobId: 'job_fe', clientId: 'cli_harbor' },
  { id: 'tsk_16', title: 'Q3 pipeline review deck', dueAt: '2026-09-20', priority: 'medium', status: 'open', ownerId: 'usr_priya' },
  { id: 'tsk_17', title: 'Update users: invite contractor researcher', dueAt: '2026-09-22', priority: 'low', status: 'open', ownerId: 'usr_maya' },
  { id: 'tsk_18', title: 'Felix technical prep pack', dueAt: '2026-09-13', priority: 'high', status: 'done', ownerId: 'usr_james', candidateId: 'can_felix', jobId: 'job_sec', clientId: 'cli_lumen' }
]
