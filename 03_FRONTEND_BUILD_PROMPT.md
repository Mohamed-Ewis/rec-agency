# Prompt — Recruitment Agency Dashboard Frontend

Build a production-quality Recruitment Agency Dashboard using **Nuxt 3 + Vue 3 + TypeScript** with **static/mock data only** for the first phase.

## Product Vision
Create a premium internal operating dashboard for a highly experienced technical recruitment agency. It should feel like a mature enterprise recruitment product, but remain simple enough for a 2-person team.

The product is NOT a LinkedIn clone and NOT an over-engineered ATS.

## Required UX
Use the available **UI/UX Pro Max** and **Anthropic dashboard-building skills** as design/engineering guidance.

Principles:
- clean, premium, professional B2B SaaS
- information-dense but not crowded
- excellent hierarchy
- fast scanning
- minimal clicks
- responsive
- accessible
- consistent empty/loading/error states
- keyboard-friendly where practical
- reusable components
- avoid unnecessary animations
- avoid huge sidebars and complicated navigation
- desktop-first, responsive on tablet/mobile

## Main Navigation
1. Dashboard
2. Jobs
3. Candidates
4. Clients
5. Pipeline
6. Interviews
7. Activities
8. Tasks
9. Reports
10. Users
11. Settings

## Dashboard
Show:
- Open Jobs
- Active Candidates
- Interviews this week
- Offers
- Hires
- Revenue
- Outstanding invoices
- Recent activity
- Upcoming interviews
- Jobs needing attention
- Recruiter workload
- Pipeline snapshot

Use useful cards/tables/charts only. Do not create decorative charts.

## Jobs
List + search + filters.
Job details:
- client
- status
- priority
- requirements
- salary/location/remote
- assigned recruiter
- candidate count
- pipeline
- activity timeline

Actions:
Edit, Duplicate, Pause, Close, Add Candidate.

## Candidates
List + filters + search.
Candidate profile:
- basic information
- CV
- LinkedIn URL
- skills
- experience
- salary expectation
- availability
- source
- tags
- notes
- activity timeline
- jobs applied/submitted to
- pipeline status

Include a clear AI Match area with:
Score, matched skills, missing skills, explanation, recommended next action.

Use mock AI results; do NOT call an API.

## Clients
Client list and profile:
- company information
- contacts
- active jobs
- placements
- fee/agreement summary
- activity timeline
- notes

## Pipeline
Kanban:
Sourced → Contacted → Interested → Screening → Qualified → Submitted → Interview → Offer → Hired

Allow mock drag/drop state changes if easy, but persistence is not required.

## Interviews
Upcoming/past interviews:
candidate, job, client, interviewer, date/time, stage, status, feedback.

## Activities
Unified timeline:
Email, LinkedIn, Call, Note, Interview, Task, Status Change.

## Tasks
Simple task list:
Due date, priority, related client/job/candidate, owner, status.

## Reports
Keep simple:
- hires by month
- jobs by status
- pipeline conversion
- recruiter workload
- revenue summary

## Users & Roles
Create mock users and role-based UI:
- Admin
- Recruiter
- Manager
- Viewer

Frontend route/action guards should demonstrate permissions using static auth state.

## Static Data
Create realistic mock data:
- 8–12 jobs
- 25–40 candidates
- 5–8 clients
- interviews
- activities
- tasks
- users
- pipeline records

Data must be consistent across pages and relationships.

## Architecture
Use:
- Nuxt 3
- Vue 3 Composition API
- TypeScript
- Pinia for state
- Tailwind CSS or the selected UI system
- reusable composables
- reusable table/filter/modal/drawer/card components

Suggested structure:
pages/
components/
components/ui/
components/jobs/
components/candidates/
components/clients/
components/pipeline/
composables/
stores/
types/
data/
utils/

Do not build Laravel/backend yet.
Do not build database.
Do not build authentication backend.
Do not build LinkedIn scraping.
Do not build microservices.

## Important UX Details
- Global search
- consistent filters
- saved-looking filter UI (static is fine)
- status badges
- priority badges
- avatars
- breadcrumbs where useful
- detail drawer/page depending on complexity
- confirmation for destructive actions
- toast feedback
- skeleton/loading states
- empty states
- realistic error states
- pagination
- sorting
- bulk selection UI where valuable

## Design Direction
Premium recruitment SaaS.
Avoid generic admin-template appearance.
Use a restrained visual system, strong typography, subtle borders, clear spacing, professional tables and cards.

Do not overload the interface with gradients, glassmorphism, excessive rounded cards, giant headings, or unnecessary charts.

## Deliverable
Build the frontend completely with static data.
Every main navigation item must have a useful working page.
Interactions should feel real even though data is mocked.
Keep the code clean and ready to replace mock repositories with Laravel APIs later.

Before coding:
1. Define the information architecture.
2. Define types/interfaces.
3. Define mock data and relationships.
4. Define reusable UI components.
5. Then implement pages.

After implementation:
- verify routes
- verify responsive layout
- verify TypeScript
- verify no broken links
- verify consistent mock relationships
- verify role-based visibility
