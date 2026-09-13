# Rec Agency — Project Overview

Rec Agency is an internal operating desk for a small, experienced **technical recruitment** team. It is not a LinkedIn clone and not a heavy ATS. The product sells access to the right people, not a pile of CVs.

This repository is **phase 1**: a Nuxt 3 frontend with realistic mock data. No Laravel API, no database, and no live LinkedIn scraping.

**Also read**

- [Business cycle](business-cycle.md)
- [Product cycle](product-cycle.md)
- [العربية](../ar/README.md)

## What it does

The desk is two-sided, like a recruiter product rather than a CV pile:

1. **Find people for clients** — search the talent pool against a live brief, add them to the client pipeline.
2. **Send jobs to seekers** — match an open mandate to a person, send a mock email or LinkedIn note, track the reply.
3. **Collect the fee** — a hire raises the client invoice, the guarantee window, and the recruiter share.

The app maps that loop onto a compact dashboard:

| Area | Purpose |
|---|---|
| Dashboard | Weekly decisions: open jobs, interviews, offers, jobs sent, fees still out |
| Jobs | Mandates: brief, owner, pipeline, suggested talent, create / pause / close |
| Candidates | People we can represent, ranked jobs, send a brief |
| Clients | Companies, contacts, fees, placements |
| Sourcing | Recruiter-style search against a client job |
| Send jobs | Outreach queue: compose, send (mock), mark replied / declined |
| Commissions | Placements, invoices, guarantee, recruiter share |
| Pipeline | Sourced → Hired kanban — Hired raises the invoice |
| Interviews | Upcoming and past loops with feedback |
| Activities | One timeline for email, LinkedIn, calls, notes, status changes |
| Tasks | Due work tied to a client, job, or candidate — send creates a follow-up |
| Reports | Hires, conversion, workload, recruiter commission |
| Users | Roles and account activation (admin) |
| Settings | Workspace defaults |

## Stack

- Nuxt 3, Vue 3 Composition API, TypeScript
- Pinia for desk state
- Tailwind CSS
- Mock repositories in `data/` — replace later with Laravel APIs

## Run locally

```bash
npm install
npm run dev
```

Or `yarn install` then `yarn dev`. Open the URL printed in the terminal (often `http://localhost:3000/` or `http://localhost:3001/`).

## Sign in

Auth is mock. The signed-in **role is only a named permission set**. Screens and buttons check `can(resource, action)`.

| Name | Role | Email | Password |
|---|---|---|---|
| Maya Chen | Admin | maya@rec-agency.agency | Maya-Admin-26 |
| James Okonkwo | Recruiter | james@rec-agency.agency | James-Desk-26 |
| Elena Varga | Recruiter | elena@rec-agency.agency | Elena-Desk-26 |
| Priya Shah | Manager | priya@rec-agency.agency | Priya-Lead-26 |
| Tom Hale | Viewer | tom@rec-agency.agency | Tom-View-26 |

Admins can change another user’s role and activate or disable the account. The last active admin cannot be demoted or disabled.

## Permissions (current)

| | Admin | Manager | Recruiter | Viewer |
|---|---|---|---|---|
| Jobs / candidates / clients / pipeline | Full | View + edit | Create + edit | View |
| Sourcing / send jobs | Full | View + edit | Create + edit | View |
| Commissions | Full | View + collect | View | View |
| Reports | Yes | Yes | View | No |
| Users | Yes | No | No | No |
| Settings write | Yes | No | No | No |

## Delivery phases

1. **Now** — frontend + static data + route/action guards
2. **Next** — Laravel API, real auth, persist jobs/candidates/pipeline
3. **Then** — CV upload, AI recommendations, email/calendar
4. **Later** — approved LinkedIn/Recruiter and job-board integrations only. No scraping as the foundation.

## Repository map

```
pages/            Routes (desk screens + login)
components/       Shared UI and layout
stores/           Auth + agency mock state
data/             Consistent seed records
types/            TypeScript contracts
utils/            Pipeline stages, nav, permission matrix
docs/en/          English documentation
docs/ar/          Arabic documentation
01_BUSINESS_CYCLE.md   Original bilingual planning note
02_PRODUCT_CYCLE.md    Original product planning note
```
