# InterviewIQ — Product Requirements Document (PRD)

> This is the single source of truth for build status.
> Update this file as phases are completed.
> Full specs live in `IDEAS_V2.md`. Design specs live in `design.md`. Process rules live in `CLAUDE.md`.

---

## Product Summary

AI-powered mock interview simulator. User signs in with Google, uploads their resume, selects a difficulty level, and is interviewed by an animated AI named **ALEX** via real-time hands-free voice for 45 minutes. No DSA. No text chat. No push-to-talk. Resume-driven behavioral questions only. Ends with a detailed performance report downloadable as PDF.

---

## Overall Status

| Phase | Name | Status |
|---|---|---|
| 1 | Product Planning | ✅ Complete |
| 2 | UI & Experience Design | ✅ Complete |
| 3 | Core Platform Setup | ✅ Complete |
| 4 | Resume Upload & Analysis | ✅ Complete |
| 5 | Voice Interview Prototype | 🔄 In Progress |
| 6 | Interview Evaluation Engine | 🔲 Not Started |
| 7 | Reporting System | 🔲 Not Started |
| 8 | Production Hardening | 🔲 Not Started |

---

## Phase 1 — Product Planning ✅ Complete

**Goal:** Define what the product is before writing any code.

### Deliverables
- [x] Product vision document → `productVision.md`
- [x] Product specification (PRD/requirements) → `IDEAS_V2.md`
- [x] Design authority document → `design.md`
- [x] CLAUDE.md (project rules for Claude Code) → `CLAUDE.md`
- [x] This PRD → `PRD.md`

### Key Decisions Made
- Google OAuth only (no email/password)
- Desktop browser only for MVP
- Resume-based behavioral interviews only (no DSA, no coding)
- 45-minute interview, 60-second countdown
- AI persona: ALEX (animated avatar)
- Difficulty tiers: Internship · New Grad · Mid-Level · Senior
- Persistent user profile (resume + all reports saved)
- No billing or monetization needed
- Cost target: under $15 total during MVP testing

---

## Phase 2 — UI & Experience Design ✅ Complete

**Goal:** Define the visual language and screen-by-screen layouts before building.

### Deliverables
- [x] Full design system (colors, typography, spacing, shadows) → `design.md`
- [x] Screen 1: Landing page layout and components → `design.md`
- [x] Screen 2: Resume upload & config screen → `design.md`
- [x] Screen 3: Focus timer / pre-session countdown → `design.md`
- [x] Screen 4: Interview session (voice UI, ALEX avatar) → `design.md`
- [x] Screen 5: Report card → `design.md`
- [x] Shared background system (orbs, neural canvas, scanlines) → `design.md`
- [x] Animation cheatsheet → `design.md`

---

## Phase 3 — Core Platform Setup ✅ Complete

**Goal:** A working app shell. User can sign in, land on a dashboard, and navigate between screens. No voice or resume features yet.

### Deliverables
- [x] Project scaffold (framework, folder structure, routing)
- [x] Design system implementation (colors, fonts, global styles)
- [x] Shared background system (orbs, neural canvas, scanlines)
- [x] Screen 1: Landing page (full, matching `design.md`)
  - [x] Navbar (logo, Sign In button)
  - [x] Hero section (headline, typewriter subtitle, Google sign-in CTA)
  - [x] Feature section 1 — DFS-Style Questioning
  - [x] Feature section 2 — Voice-First. Real Pressure.
  - [x] Feature section 3 — Your Report Card, Instantly.
  - [x] Final CTA section
- [x] Google OAuth authentication (sign in, sign out)
- [x] Protected routes (redirect to landing if not authenticated)
- [x] Dashboard (authenticated home, empty state, "New Interview" CTA)
- [x] Database setup (Supabase — user table, session scaffolding)
- [x] User sync (store Clerk user in DB on first sign-in)

### Acceptance Criteria
- User can visit the landing page and see the full design.
- User can sign in with Google and be redirected to the dashboard.
- User can sign out and be redirected back to the landing page.
- Unauthenticated users cannot access the dashboard.
- Design matches `design.md` on desktop Chrome.

---

## Phase 4 — Resume Upload & Analysis 🔲 Not Started

**Goal:** User can upload a resume, the system extracts and analyzes it, and an interview plan is generated.

### Deliverables
- [x] Screen 2: Resume upload & config screen (matching `design.md`)
  - [x] Drag-and-drop upload zone
  - [x] File card (name, size, READY badge, dismiss)
  - [x] Difficulty level selector (Internship / New Grad / Mid-Level · Senior)
  - [x] Target company input (optional)
  - [x] "Begin Session" CTA
- [x] Resume file upload (PDF + DOCX, max 10MB)
- [x] Resume stored to Supabase Storage + resumes table
- [ ] Resume reuse option (deferred to Phase 8)
- [x] Resume text extraction pipeline (server-side, PDF + DOCX)
- [x] Resume analysis via LLM — GPT-4o-mini
- [x] Interview plan generation from resume analysis
- [x] Analysis stored per session in database (sessions table)

### Acceptance Criteria
- User can upload a PDF or DOCX resume via drag-and-drop or file picker.
- System extracts text and identifies key resume sections.
- System generates a personalized interview plan (visible in logs/debug, not necessarily in UI yet).
- Resume is saved to the user's profile.
- Returning user is offered the option to reuse their previous resume.

---

## Phase 5 — Voice Interview Prototype 🔲 Not Started

**Goal:** The core interview experience works end-to-end. ALEX speaks, user responds, conversation is natural and hands-free.

**Requires:** Provider decisions for STT, TTS, and LLM. These will be presented with cost estimates before implementation begins.

### Deliverables
- [ ] Screen 3: Focus timer / pre-session countdown (matching `design.md`)
  - [ ] 60-second SVG countdown ring
  - [ ] ALEX interviewer card (slides up)
  - [ ] Ambient floating particles
  - [ ] Microphone status indicator
  - [ ] Auto-advance to interview screen at 0
- [ ] Screen 4: Interview session screen (matching `design.md`)
  - [ ] ALEX animated avatar (all facial states: speaking, listening, transitioning)
  - [ ] AI voice waveform (active when ALEX speaking)
  - [ ] User avatar and waveform (always-listening indicator)
  - [ ] Live caption bar (appears when ALEX speaks)
  - [ ] Top bar (logo, REC indicator, session timer, END SESSION button)
  - [ ] Divider line between ALEX and user sections
- [ ] STT integration (real-time transcription of user speech)
- [ ] TTS integration (ALEX speaks questions and follow-ups)
- [ ] LLM integration (generates questions, follow-ups, adapts to user responses)
- [ ] Hands-free turn-taking (no push-to-talk, VAD or equivalent)
- [ ] Interrupt handling (user speaks while ALEX is speaking → ALEX stops)
- [ ] Session timer (counts up from 00:00, warning at 40:00, auto-end at 45:00)
- [ ] Conversation history maintained for context across the full session
- [ ] "End Session" button (ends interview early, proceeds to report)
- [ ] Silence detection (define behavior when user is silent for extended period)

### Acceptance Criteria
- ALEX asks an opening question using the user's name and role.
- User can speak freely without pressing any button.
- ALEX responds within 2 seconds of the user finishing.
- User can interrupt ALEX and ALEX stops speaking.
- Conversation remains coherent and personalized to the resume for 45 minutes.
- Session ends gracefully (by timer or by user) and transitions to report generation.

---

## Phase 6 — Interview Evaluation Engine 🔲 Not Started

**Goal:** The full session transcript is evaluated and a structured performance report is generated.

### Deliverables
- [ ] Scoring framework (evaluate transcript against all report categories)
- [ ] Report categories (for resume-based interviews):
  - [ ] Behavioral Clarity
  - [ ] Communication
  - [ ] Self-Awareness
  - [ ] Leadership Examples
  - [ ] Technical Depth
  - [ ] Structured Thinking
- [ ] Overall score (0–100) and letter grade
- [ ] Overall hiring recommendation (Hire / Lean Hire / Lean No Hire / No Hire)
- [ ] Strengths (3 bullet points)
- [ ] Areas to Improve (3 bullet points)
- [ ] ALEX's free-form written assessment paragraph
- [ ] Report stored to database (linked to user + session)
- [ ] Report references specific moments from the transcript (not generic)

### Acceptance Criteria
- Report is generated within a reasonable time after session ends.
- Every category score has a specific AI-written feedback comment.
- Strengths and weaknesses reference actual things the user said.
- The interviewer assessment reads like real hiring committee feedback.

---

## Phase 7 — Reporting System 🔲 Not Started

**Goal:** User can view, download, and revisit their reports.

### Deliverables
- [ ] Screen 5: Report card screen (matching `design.md`)
  - [ ] Header row (SESSION COMPLETE label, h1, overall score ring)
  - [ ] 6 category score cards (score, progress bar, AI comment)
  - [ ] Strengths panel
  - [ ] Areas to Improve panel
  - [ ] ALEX's interviewer assessment block
  - [ ] Action bar (Download Report, Start New Session, Share icon)
- [ ] PDF generation and download
- [ ] Report saved to user profile (accessible from dashboard)
- [ ] Dashboard updated to list past interviews (date, role, difficulty, overall score)
- [ ] Past report view (click any past interview from dashboard to view full report)

### Acceptance Criteria
- Report card matches `design.md` Screen 5 specification.
- PDF downloads immediately and contains all report sections.
- Dashboard shows all past interviews sorted by date (most recent first).
- Clicking a past interview loads its full report.

---

## Phase 8 — Production Hardening 🔲 Not Started

**Goal:** The app is stable, observable, and safe to share.

### Deliverables
- [ ] Error tracking (unhandled errors captured and logged)
- [ ] Logging (API calls, session events, failures)
- [ ] Monitoring (uptime, latency alerts)
- [ ] Performance optimization (page load, voice latency)
- [ ] Security review (auth, file uploads, API exposure)
- [ ] Browser compatibility check (Chrome, Safari, Firefox on desktop)
- [ ] Edge case handling (all cases from `IDEAS_V2.md` Section 10 addressed)
- [ ] Resume upload validation (file type, size, content check)
- [ ] Graceful degradation for microphone permission denial

### Acceptance Criteria
- App handles all edge cases from `IDEAS_V2.md` Section 10 without crashing.
- Errors are logged and do not surface as blank screens to the user.
- Page load time is acceptable on a standard broadband connection.

---

## Open Questions

These must be resolved before the relevant phase begins. See `IDEAS_V2.md` Section 12 for full context.

| # | Question | Needed For |
|---|---|---|
| 1 | Behavior when user is silent for an extended period mid-interview | Phase 5 |
| 2 | Session recovery if browser tab closes mid-interview | Phase 5 |
| 3 | Minimum interview duration to generate a valid report | Phase 6 |
| 4 | Maximum resume file size (design.md suggests 10MB) | Phase 4 |
| 5 | Data retention policy for reports and resumes | Phase 8 |
| 6 | Account deletion — can the user delete their account and all data | Phase 8 |
| 7 | Behavior if a second interview session is started while one is in progress | Phase 5 |
| 8 | Post-report notification (email or in-app) when report is ready | Phase 7 |
