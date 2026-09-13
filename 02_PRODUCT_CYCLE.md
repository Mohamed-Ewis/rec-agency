# Recruitment Agency Dashboard — Product Cycle

## الهدف
Dashboard واحد يدير عمليات الوكالة بدون تعقيد.

## Core Modules
- Dashboard
- Jobs
- Candidates
- Clients
- Pipeline
- Interviews
- Activities
- Documents/CVs
- Tasks
- Reports
- Users & Roles
- Settings

## العلاقات
Client → Jobs → Candidates → Screening/Submission → Interviews → Offer → Hire → Invoice

Candidate ↔ Jobs علاقة many-to-many.

## Job
Title, Client, Description, Requirements, Must-have, Nice-to-have, Seniority, Salary, Location, Remote, Priority, Status, Owner, Dates.

## Candidate
Name, Contact, Location, LinkedIn, CV, Skills, Experience, Salary Expectation, Availability, Source, Owner, Tags, Status, Notes.

## Client
Company, Contacts, Industry, Website, Location, Contract/Fee, Jobs, Notes, Activities.

## Activity Timeline
Call, Email, LinkedIn, Note, Interview, Status Change, Task, System Event.

## AI Layer
- JD parsing
- CV parsing
- Match score + reasons
- Skill gap
- Screening questions
- Outreach draft
- Candidate summary
- Interview summary
- Next-action suggestion

AI output = recommendation, not automatic hiring decision.

## Integrations — later
LinkedIn/Recruiter official capabilities, Gmail, Calendar, job boards, n8n, AI provider.

لا نبني scraping أو automated LinkedIn behavior كأساس للنظام.

## Users
Admin: كل شيء.
Recruiter: Jobs/Candidates/Clients/Pipeline/Activities.
Manager: Reports + team visibility.
Viewer: قراءة فقط.

## MVP
Dashboard + Jobs + Candidates + Clients + Pipeline + Activities + Users/Roles + Static data.

بعدها: Laravel API → Auth/permissions → CV upload → AI → Email/Calendar → approved integrations.
