import type { User, UserCredential } from '~/types'

export const users: User[] = [
  { id: 'usr_maya', name: 'Maya Chen', email: 'maya@rec-agency.agency', role: 'admin', title: 'Managing Partner', avatarHue: 210, active: true },
  { id: 'usr_james', name: 'James Okonkwo', email: 'james@rec-agency.agency', role: 'recruiter', title: 'Senior Recruiter', avatarHue: 160, active: true },
  { id: 'usr_elena', name: 'Elena Varga', email: 'elena@rec-agency.agency', role: 'recruiter', title: 'Technical Recruiter', avatarHue: 28, active: true },
  { id: 'usr_priya', name: 'Priya Shah', email: 'priya@rec-agency.agency', role: 'manager', title: 'Delivery Manager', avatarHue: 280, active: true },
  { id: 'usr_tom', name: 'Tom Hale', email: 'tom@rec-agency.agency', role: 'viewer', title: 'Finance Partner', avatarHue: 200, active: true }
]

export const credentials: UserCredential[] = [
  { email: 'maya@rec-agency.agency', password: 'Maya-Admin-26', userId: 'usr_maya' },
  { email: 'james@rec-agency.agency', password: 'James-Desk-26', userId: 'usr_james' },
  { email: 'elena@rec-agency.agency', password: 'Elena-Desk-26', userId: 'usr_elena' },
  { email: 'priya@rec-agency.agency', password: 'Priya-Lead-26', userId: 'usr_priya' },
  { email: 'tom@rec-agency.agency', password: 'Tom-View-26', userId: 'usr_tom' }
]
