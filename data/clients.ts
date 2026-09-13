import type { Client } from '~/types'

export const clients: Client[] = [
  {
    id: 'cli_meridian',
    name: 'Meridian Health',
    industry: 'Healthtech',
    website: 'https://meridian.health',
    location: 'London, UK',
    feePercent: 25,
    agreement: 'Exclusive 90-day retained search, 3-month replacement guarantee.',
    ownerId: 'usr_james',
    notes: 'Hiring freeze lifted in August. CTO wants backend and data first.',
    createdAt: '2025-11-04',
    contacts: [
      { id: 'cc_m1', name: 'Dr. Hannah Reid', title: 'CTO', email: 'hannah.reid@meridian.health', phone: '+44 20 7946 1101', isPrimary: true },
      { id: 'cc_m2', name: 'Owen Blake', title: 'People Partner', email: 'owen.blake@meridian.health', phone: '+44 20 7946 1108', isPrimary: false }
    ]
  },
  {
    id: 'cli_atlas',
    name: 'Atlas Payments',
    industry: 'Fintech',
    website: 'https://atlaspay.io',
    location: 'London, UK',
    feePercent: 22,
    agreement: 'Contingent, 20% rebate in first 8 weeks.',
    ownerId: 'usr_elena',
    notes: 'Series C. Platform team is the bottleneck. Fast interview loops.',
    createdAt: '2026-01-15',
    contacts: [
      { id: 'cc_a1', name: 'Sofia Alvarez', title: 'VP Engineering', email: 'sofia@atlaspay.io', phone: '+44 20 3880 2210', isPrimary: true }
    ]
  },
  {
    id: 'cli_northwind',
    name: 'Northwind Cloud',
    industry: 'Infrastructure',
    website: 'https://northwind.cloud',
    location: 'Manchester, UK',
    feePercent: 20,
    agreement: 'Contingent, 3-month guarantee.',
    ownerId: 'usr_james',
    notes: 'On-call load is high. SRE role paused pending budget reforecast.',
    createdAt: '2025-09-22',
    contacts: [
      { id: 'cc_n1', name: 'Callum Price', title: 'Head of Infra', email: 'callum@northwind.cloud', phone: '+44 161 496 0182', isPrimary: true }
    ]
  },
  {
    id: 'cli_helios',
    name: 'Helios Mobility',
    industry: 'EV / Automotive',
    website: 'https://heliosmobility.com',
    location: 'Oxford, UK',
    feePercent: 25,
    agreement: 'Exclusive 60-day for design + mobile.',
    ownerId: 'usr_elena',
    notes: 'Design system rebuild. Founder interviews every candidate.',
    createdAt: '2026-03-02',
    contacts: [
      { id: 'cc_h1', name: 'Amira Soltani', title: 'Head of Product', email: 'amira@heliosmobility.com', phone: '+44 1865 334 190', isPrimary: true }
    ]
  },
  {
    id: 'cli_quorum',
    name: 'Quorum Labs',
    industry: 'AI / ML',
    website: 'https://quorumlabs.ai',
    location: 'Cambridge, UK',
    feePercent: 28,
    agreement: 'Retained search for ML, 12-week exclusive.',
    ownerId: 'usr_james',
    notes: 'Need production ML, not research-only profiles.',
    createdAt: '2026-04-18',
    contacts: [
      { id: 'cc_q1', name: 'Prof. Liam Cho', title: 'Chief Scientist', email: 'liam@quorumlabs.ai', phone: '+44 1223 778 014', isPrimary: true }
    ]
  },
  {
    id: 'cli_harbor',
    name: 'Harbor Retail',
    industry: 'Commerce',
    website: 'https://harborretail.com',
    location: 'Leeds, UK',
    feePercent: 20,
    agreement: 'Contingent frontend + storefront.',
    ownerId: 'usr_elena',
    notes: 'Replatforming to headless. Wants Vue/Nuxt experience.',
    createdAt: '2026-02-09',
    contacts: [
      { id: 'cc_hb1', name: 'Nate Cowan', title: 'Engineering Manager', email: 'nate@harborretail.com', phone: '+44 113 496 2201', isPrimary: true }
    ]
  },
  {
    id: 'cli_lumen',
    name: 'Lumen Security',
    industry: 'Cybersecurity',
    website: 'https://lumensec.io',
    location: 'London, UK',
    feePercent: 25,
    agreement: 'Contingent + success bonus after 90 days.',
    ownerId: 'usr_james',
    notes: 'SC cleared profiles preferred. Architect role closed after internal hire.',
    createdAt: '2025-12-11',
    contacts: [
      { id: 'cc_l1', name: 'Rebecca Shaw', title: 'CISO', email: 'rebecca@lumensec.io', phone: '+44 20 7946 4412', isPrimary: true }
    ]
  }
]
