import type { PipelineStage, Role } from '~/types'

export const PIPELINE_STAGES: { id: PipelineStage; label: string }[] = [
  { id: 'sourced', label: 'Sourced' },
  { id: 'contacted', label: 'Contacted' },
  { id: 'interested', label: 'Interested' },
  { id: 'screening', label: 'Screening' },
  { id: 'qualified', label: 'Qualified' },
  { id: 'submitted', label: 'Submitted' },
  { id: 'interview', label: 'Interview' },
  { id: 'offer', label: 'Offer' },
  { id: 'hired', label: 'Hired' }
]

export const ROLE_LABELS: Record<Role, string> = {
  admin: 'Admin',
  recruiter: 'Recruiter',
  manager: 'Manager',
  viewer: 'Viewer'
}

export const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: 'LayoutDashboard', group: 'Operate' },
  { to: '/jobs', label: 'Jobs', icon: 'Briefcase', group: 'Desk', resource: 'jobs', action: 'view' },
  { to: '/candidates', label: 'Candidates', icon: 'Users', group: 'Desk', resource: 'candidates', action: 'view' },
  { to: '/clients', label: 'Clients', icon: 'Building2', group: 'Desk', resource: 'clients', action: 'view' },
  { to: '/sourcing', label: 'Sourcing', icon: 'Search', group: 'Market', resource: 'sourcing', action: 'view' },
  { to: '/opportunities', label: 'Send jobs', icon: 'Send', group: 'Market', resource: 'opportunities', action: 'view' },
  { to: '/placements', label: 'Commissions', icon: 'Banknote', group: 'Market', resource: 'placements', action: 'view' },
  { to: '/pipeline', label: 'Pipeline', icon: 'Kanban', group: 'Operate', resource: 'pipeline', action: 'view' },
  { to: '/interviews', label: 'Interviews', icon: 'CalendarDays', group: 'Schedule', resource: 'interviews', action: 'view' },
  { to: '/activities', label: 'Activities', icon: 'Activity', group: 'Schedule', resource: 'activities', action: 'view' },
  { to: '/tasks', label: 'Tasks', icon: 'CheckSquare', group: 'Schedule', resource: 'tasks', action: 'view' },
  { to: '/reports', label: 'Reports', icon: 'BarChart3', group: 'Insight', resource: 'reports', action: 'view' },
  { to: '/users', label: 'Users', icon: 'Shield', group: 'Admin', resource: 'users', action: 'view' },
  { to: '/settings', label: 'Settings', icon: 'Settings', group: 'Admin', resource: 'settings', action: 'view' }
] as const

export const RECRUITER_SHARE_PERCENT = 40
export const GUARANTEE_DAYS = 90

export const TODAY = '2026-09-13'
export const WEEK_START = '2026-09-08'
export const WEEK_END = '2026-09-14'
