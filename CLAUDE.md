# CLAUDE.md — InterviewIQ Project Instructions

This file governs how Claude Code works on this project. Read it at the start of every session before making any decision.

---

## What This Project Is

InterviewIQ is an AI-powered mock interview simulator. Users sign in, upload their resume, and are interviewed by an animated AI interviewer named **ALEX** via real-time voice — no text chat, no push-to-talk, no DSA. The interview is 45 minutes of hands-free, resume-driven, behavioral questioning. At the end, the user receives a detailed performance report they can download as PDF.

This is a personal project. There are no paying users. No billing or subscription features are needed.

---

## Authority Documents

Three documents define this project. Always consult the relevant one before acting.

| Document | Governs |
|---|---|
| `design.md` | All UI, UX, visual, layout, animation, and interaction decisions. **Treated as a requirement, not a suggestion.** |
| `productVision.md` | Product behavior, development philosophy, phase-by-phase process, and approval requirements. |
| `IDEAS_V2.md` | Product requirements, MVP scope, user journeys, edge cases, risks, and open questions. |

**Conflict resolution:**
- `design.md` beats `IDEAS_V2.md` on UI, UX, and screen-level decisions.
- `productVision.md` beats everything on process and development philosophy.
- If a conflict exists, flag it and ask for clarification. Never silently resolve conflicts.

---

## Decisions Already Made

Do not re-open these. Do not ask about them. They are final.

| Decision | Value |
|---|---|
| Authentication | Google OAuth only (Sign in with Google) |
| Platform | Desktop browser only. Mobile is out of scope. |
| Interview type (MVP) | Resume-based behavioral only. No DSA, no LeetCode, no coding challenges. |
| AI interviewer name | ALEX |
| Interview duration | 45 minutes |
| Pre-interview countdown | 60 seconds |
| Difficulty levels | Internship · New Grad · Mid-Level · Senior |
| User data model | Persistent profile. Resume and all past reports saved per user. |
| Cost target | Under $15 total during MVP testing |
| Monetization | None. No billing, no payments, no subscription logic. |
| Resume formats | PDF and DOCX |
| Voice interaction | Hands-free. No push-to-talk. Mic is always open. |
| Report download | PDF |

---

## Open Questions (Must Be Resolved Before Relevant Phase)

These are unresolved. Do not assume answers. Raise them when the relevant phase begins.

1. Behavior when the user is silent for an extended period mid-interview.
2. Behavior when the browser tab closes or network drops mid-interview — is the session recoverable?
3. Minimum interview duration required to generate a valid report.
4. Maximum resume file size (suggestion: 10MB per design.md).
5. Data retention policy — how long are reports and resumes kept.
6. Account deletion — can the user delete their account and all data.
7. Whether the user can start a second interview session while one is in progress.
8. Whether a post-report notification (email or in-app) is needed.

---

## Development Rules (Non-Negotiable)

These rules come from `productVision.md` and apply to every session.

### 1. Plan before building
Never implement a feature without a clear plan reviewed and approved by the user. Propose, explain trade-offs, wait for approval, then build.

### 2. Phase-by-phase only
Do not implement systems that belong to a future phase. If Phase 3 (core platform) is in progress, do not touch voice functionality (Phase 5).

### 3. Never make major decisions silently
Architecture, framework selection, database choice, API provider selection, cost-impacting decisions, and scope changes all require presenting options, explaining trade-offs, recommending an approach, and waiting for approval.

### 4. Match the design exactly
Build UI to match `design.md` specifications. Do not introduce alternative styles, redesign approved screens, or change layouts, colors, typography, spacing, or animations without explicit approval. Reference `design.md` before touching any UI code.

### 5. Smallest working version first
Build the minimum that satisfies the current phase. Do not add features, abstractions, or error handling for scenarios that are not in scope for the current phase.

### 6. No premature API or model decisions
Model and provider decisions (STT, TTS, LLM) are only discussed when the phase that requires them begins. The tech stack in `design.md` is a reference — confirm before committing to any provider.

---

## Phase Status

| Phase | Name | Status |
|---|---|---|
| 1 | Product Planning | Complete — `IDEAS_V2.md` is the PRD |
| 2 | UI & Experience Design | Complete — `design.md` is the approved design |
| 3 | Core Platform Setup | **Next** — frontend scaffold, auth, database, user management |
| 4 | Resume Upload & Analysis | Not started |
| 5 | Voice Interview Prototype | Not started |
| 6 | Interview Evaluation Engine | Not started |
| 7 | Reporting System | Not started |
| 8 | Production Hardening | Not started |

**Current focus: Phase 3.** Do not implement anything from Phase 4 or later until Phase 3 is approved and stable.

---

## MVP Scope (Phase 3–7 Combined)

### In Scope
- Google OAuth authentication
- Resume upload (PDF + DOCX), stored per user
- Resume reuse option when starting a new interview
- Role selection (Software Engineer, Data Scientist, Product Manager, DevOps/SRE, Machine Learning Engineer)
- Difficulty level selection (Internship, New Grad, Mid-Level, Senior)
- Resume analysis pipeline — personalized interview plan generation
- 60-second pre-interview countdown screen (ALEX card, mic status, instructions)
- 45-minute hands-free real-time voice interview (ALEX persona, behavioral/resume-based only)
- Post-interview evaluation report (all sections per `IDEAS_V2.md` Section 4 Journey 7)
- PDF report download
- Dashboard with interview history (all past reports accessible)
- Desktop browser only

### Out of Scope for MVP
- Behavioral, technical, system design, or leadership interview types
- DSA / coding challenges
- Custom job description input
- Shareable report links
- Mobile support
- Analytics / progress tracking dashboard
- Practice mode with hints
- Account deletion UI (can be added later)
- Email notifications

---

## AI Interviewer Behavior (ALEX)

ALEX is not a chatbot, tutor, or assistant. ALEX is an experienced interviewer from a top-tier technology company whose job is to evaluate whether the candidate meets the hiring bar.

**During the interview, ALEX:**
- Asks questions dynamically from the resume analysis — no predefined script.
- Adapts difficulty to the selected difficulty tier.
- Asks follow-up questions to probe technical depth and authenticity.
- Challenges vague, shallow, or inconsistent answers.
- Investigates why decisions were made, what trade-offs existed, what impact was measured.
- Does not coach, hint, reveal answer quality, or provide encouragement mid-interview.
- Maintains professional, direct, evaluative tone throughout.
- Continuously builds an internal assessment toward a final hiring recommendation.

Full behavioral specification is in `IDEAS_V2.md` Section 6.

---

## Design Quick Reference

| Token | Value |
|---|---|
| Background | `#040010` |
| Brand gradient | `linear-gradient(135deg, #7C3AED, #06B6D4)` |
| Primary font | Space Grotesk (headings), Inter (body), JetBrains Mono (labels/mono) |
| Card radius | `1rem` |
| Button radius | `9999px` (pill) |
| Violet | `#7C3AED` |
| Cyan | `#06B6D4` |
| Text primary | `#FFFFFF` |
| Text secondary | `#CBD5E1` |
| Text muted | `#64748B` |

All screen layouts, component specs, animation values, and interaction patterns are in `design.md`. Always read the relevant screen section before building any UI component.

---

## Cost Discipline

- The target budget for all MVP testing is under $15 total.
- Prefer lower-cost providers during development. Introduce expensive providers only after validation.
- When a phase requires an external API (STT, TTS, LLM), present options with cost estimates before committing.
- Avoid making API calls during development that are not necessary for testing the current phase.
