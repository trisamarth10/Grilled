# InterviewIQ — Product Specification V2

> Refined from `productVision.md` and `Ideas.md`.
> No architecture or technology decisions are made here.
> This document governs **what** the product does, not **how** it is built.

---

## 1. Product Overview

InterviewIQ is an AI-powered mock interview simulator that conducts realistic, voice-based interviews personalized to each candidate's resume.

The product is not a chatbot, quiz tool, or coaching assistant. It simulates the experience of speaking with an experienced interviewer from a top-tier technology company.

The primary value proposition is realism: candidates should finish a session feeling like they just completed a real interview, not an assessment exercise.

### Deployment Context

- Personal project, self-deployed.
- No end-user payments or billing features required.
- API usage costs (voice, LLM) are borne by the developer.
- The $15 total budget applies to MVP testing and validation only.

---

## 2. User Persona

**Primary User: Job Candidate**

- Preparing for software engineering or adjacent technical roles.
- Likely applying to mid-to-large technology companies.
- English-speaking, using a desktop browser.
- Has a resume in PDF format.
- May range from a new graduate to a senior engineer.

No other user types exist in MVP (no admin, no recruiter, no hiring manager view).

---

## 3. MVP Scope

The MVP covers the complete end-to-end interview flow for a single user.

### In Scope for MVP

| Area | Included |
|---|---|
| Authentication | Email/password signup, login, logout, password reset |
| Resume | Upload (PDF only), persistent storage per user account |
| Interview setup | Role selection, experience level selection |
| Interview type | Resume-based only |
| Prep screen | Countdown timer, microphone check, instructions |
| Voice interview | Hands-free, real-time, conversational |
| Evaluation report | On-screen display + PDF download |
| Interview history | View all past interview reports from dashboard |
| Platform | Desktop browser only |

### Explicitly Out of Scope for MVP

| Feature | Deferred To |
|---|---|
| Behavioral interview type | V1 |
| Technical interview type | V1 |
| System design interview type | Future |
| Leadership interview type | Future |
| Custom job description input | V1 |
| Shareable report links | V1 |
| .docx resume support | V1 |
| Mobile browser support | Future |
| Analytics / progress dashboard | Future |
| Practice mode with hints | Future |
| Third-party OAuth (Google, GitHub) | Future |
| Recruiter or team features | Future |
| Coding challenge integration | Future |

---

## 4. Core User Journeys

### Journey 1 — New User Onboarding

1. User lands on the home/marketing page.
2. User clicks "Get Started" or "Create Account."
3. User enters: full name, email address, password.
4. Account is created.
5. User is redirected to the dashboard (empty state — no interviews yet).
6. Dashboard displays a prompt to start their first interview.

**Success state:** User has an account and is on the dashboard.
**Failure states:** Invalid email format, password too short, email already registered.

---

### Journey 2 — Returning User Login

1. User lands on the home page.
2. User clicks "Log In."
3. User enters email and password.
4. User is redirected to the dashboard with their interview history.

**Success state:** User is authenticated and sees their past interviews.
**Failure states:** Wrong password, unrecognized email, account not found.

---

### Journey 3 — Password Reset

1. User clicks "Forgot Password" on the login page.
2. User enters their email address.
3. System sends a password reset email.
4. User clicks the link in the email and sets a new password.
5. User is redirected to login.

---

### Journey 4 — Starting an Interview

1. From the dashboard, user clicks "New Interview."
2. User is presented with the interview setup screen.
3. User uploads their resume (PDF only).
   - Resume is stored to their profile.
   - If the user has uploaded a resume before, they may reuse it or upload a new one.
4. User selects target role from a predefined list.
5. User selects experience level from a predefined list.
6. User clicks "Analyze Resume."
7. System displays a loading/analysis state (resume is being processed).
8. Once analysis is complete, user is taken to the preparation screen.

**Predefined roles (MVP):**
- Software Engineer
- Data Scientist
- Product Manager
- DevOps / Site Reliability Engineer
- Machine Learning Engineer

**Predefined experience levels (MVP):**
- New Graduate (0–1 year)
- Junior (1–3 years)
- Mid-Level (3–5 years)
- Senior (5–8 years)
- Staff / Principal (8+ years)

**Success state:** Resume analyzed, interview plan generated, user reaches prep screen.
**Failure states:** Unsupported file type, file too large, parsing failure, analysis timeout.

---

### Journey 5 — Interview Preparation Screen

1. User sees a full-screen preparation view.
2. Screen displays:
   - A countdown timer (45 seconds by default; acceptable range: 30–60 seconds).
   - Microphone status indicator (connected / not detected).
   - Brief interview instructions and expectations.
   - The selected role and experience level.
3. Countdown completes.
4. Interview begins automatically — no button press required.

**Purpose of this screen:** Give the user time to settle, verify their mic is working, and mentally prepare.

**Failure states:**
- Microphone not detected: User is shown a clear warning before the countdown ends with instructions to resolve it.
- Microphone permission denied: User is shown an explanation and prompt to grant access before proceeding.

---

### Journey 6 — Real-Time Voice Interview

This is the core product experience.

1. Interview begins with the AI interviewer introducing itself and setting context.
2. The conversation is entirely voice-based. No text chat or input fields.
3. No push-to-talk button is required. The system handles turn-taking automatically.
4. The AI asks questions, listens to responses, and reacts dynamically.
5. The interview continues for approximately 30–45 minutes or until the AI concludes it.
6. The user may end the interview early via a clearly visible but non-intrusive UI control.
7. Upon interview completion (by AI or by user), the system transitions to report generation.

**Turn-taking behavior:**
- The system detects when the AI is speaking and when the user is speaking.
- The system handles natural pauses (user thinking) without cutting them off.
- The system handles user silence beyond a defined threshold (see edge cases).
- The user may interrupt the AI, and the AI should handle this gracefully.

**AI behavior during the interview:**
- Asks questions naturally, without reading from a script.
- Reacts to responses with follow-up questions.
- Challenges vague or shallow answers.
- Probes for technical depth, trade-offs, and decision-making.
- Validates claimed ownership and contributions.
- Tests consistency of earlier statements.
- Maintains a professional, unbiased, evaluative tone.
- Does not coach, hint, or reveal whether answers are correct.
- Does not provide excessive praise or reassurance.

See Section 6 for the full AI behavior specification.

**Failure states:**
- Microphone disconnects mid-interview: System attempts to detect and notify the user.
- Network drop: Behavior to be defined (see open questions).
- AI generates an inappropriate or off-topic response: System should recover and redirect.

---

### Journey 7 — Post-Interview Report

1. After the interview ends, the system generates the evaluation report.
2. User sees a loading/generation state while the report is being created.
3. User is presented with the full report on screen.
4. User can download the report as a PDF.
5. The report is saved to the user's profile and accessible from the dashboard at any time.

**Report sections (required for MVP):**
- Overall Hiring Recommendation (Hire / Lean Hire / Lean No Hire / No Hire)
- Technical Assessment
- Communication Assessment
- Project Depth Assessment
- Resume Credibility Assessment
- Key Strengths
- Key Weaknesses
- Areas for Improvement
- Suggested Next Steps

**Report requirements:**
- The report must reference specific moments, answers, or claims from the interview.
- The report must not be generic. It must feel like personalized hiring committee feedback.
- PDF download must be available immediately after report generation.

**Failure states:**
- Report generation fails: User sees an error with an option to retry.
- Interview ended too early (< 5 minutes): Report may be partial; user is informed.

---

### Journey 8 — Dashboard & Interview History

1. Returning user logs in and lands on the dashboard.
2. Dashboard displays:
   - A "New Interview" call-to-action.
   - A list of past interviews, sorted by date (most recent first).
   - For each past interview: date, role, experience level, overall recommendation.
3. User can click any past interview to view its full report.
4. PDF download is available from the past report view as well.

**Empty state:** If no interviews exist, the dashboard shows a prompt to start the first one.

---

## 5. Resume Handling Requirements

- **Accepted format (MVP):** PDF only.
- **File size limit:** To be defined (suggested: 5 MB maximum).
- **Resume is stored** to the user's profile after upload.
- **Resume reuse:** When starting a new interview, the user should have the option to use their previously uploaded resume or upload a new one.
- **Resume replacement:** Uploading a new resume does not delete the old one; it is associated with the new session only. Past interviews retain the resume that was used for that session.
- **Resume language:** English only for MVP.

**Resume analysis must extract:**
- Projects (name, description, technologies, scope)
- Work experience (company, role, duration, responsibilities, impact)
- Technologies and tools
- Education
- Research (if any)
- Achievements and measurable outcomes
- Leadership or team contributions

**Resume analysis must identify:**
- Strong areas worth validating
- Potentially vague or exaggerated claims requiring deeper investigation
- Topics requiring deeper technical exploration
- Areas where experience may be limited

The interview plan must be generated from this analysis. Every interview must feel personalized to the specific resume.

---

## 6. AI Interviewer Behavior Specification

This section defines the product behavior requirements for the AI persona. These are functional requirements, not implementation decisions.

### Persona

The AI must behave as an experienced interviewer from a top-tier technology company (e.g., Google, Meta, Amazon, Stripe, Databricks, or similar). It maintains a professional, rigorous, and evaluative demeanor throughout.

The AI is not:
- A tutor, coach, friend, or assistant.
- A chatbot making small talk.

The AI is:
- A hiring manager or senior engineer whose objective is to accurately assess whether the candidate meets the bar.

### Professional Conduct

- Respectful, objective, and unbiased at all times.
- Professional business-like tone.
- Concise, well-structured questions.
- Does not praise, coach, hint, or reveal answer quality mid-interview.
- Does not stray off-topic.

### Interview Strategy

- Questions are generated dynamically from the resume analysis. No predefined script.
- The AI adapts in real time based on what the candidate says.
- The AI selects follow-up questions to reduce uncertainty about the candidate's true skill level.
- The AI probes until it can confidently assess technical depth and authenticity.

### What the AI Investigates

When discussing projects, experience, or any claimed skill:
- Why specific technical decisions were made.
- What alternatives were considered.
- Trade-offs involved.
- Architecture and design choices.
- Scalability and performance considerations.
- Failure scenarios and lessons learned.
- Individual contribution versus team contribution.
- Measurable outcomes and impact.

### Pressure and Realism

The AI simulates realistic interview pressure without being hostile:
- Asks unexpected follow-up questions.
- Challenges assumptions.
- Revisits earlier statements if inconsistencies appear.
- Explores edge cases.
- Requests clarification of ambiguous answers.

### Internal Evaluation

Throughout the interview, the AI continuously builds an internal assessment of:
- Technical depth
- Problem-solving ability
- Communication skills
- Clarity of thought
- Ownership and impact
- Engineering judgment
- Handling of ambiguity
- Resume credibility
- Knowledge authenticity

This internal state drives the final evaluation report.

---

## 7. Missing Requirements (Flagged Gaps)

The following are requirements not yet defined in the source documents. These must be resolved before or during implementation planning.

| # | Gap | Impact |
|---|---|---|
| 1 | Maximum resume file size not defined | Needed for upload validation |
| 2 | Behavior when the user is silent for an extended period | Critical for interview flow |
| 3 | Behavior when network drops mid-interview | Critical for reliability |
| 4 | Behavior when browser tab is closed mid-interview | Is the session recoverable? |
| 5 | Whether a user can pause an interview and resume it later | Scope decision |
| 6 | Maximum number of past interviews stored per user | Affects storage planning |
| 7 | Data retention policy — how long are reports and resumes kept | Privacy and storage |
| 8 | Account deletion — can the user delete their account and all data | Required for any public deployment |
| 9 | Email verification on signup — required or not | Security and deliverability |
| 10 | Whether the user can start a new interview while one is already in progress | Session conflict handling |
| 11 | Minimum interview duration to generate a valid report | Needed for partial-session handling |
| 12 | Whether the AI interviewer has a name, voice, or persona identity | Experience design decision |
| 13 | Whether the user sees any visual representation of the AI during the interview | Screen design decision |
| 14 | Countdown timer duration — 30 seconds, 45 seconds, or 60 seconds | Minor, but needs a final value |
| 15 | Whether the user receives any notification or email after the report is ready | UX decision |

---

## 8. Assumptions

The following assumptions are made based on the source documents and answered questions. If any are incorrect, the spec must be updated.

1. All users and resumes are in English. Multilingual support is not a requirement.
2. The product is self-deployed. There is one administrator (the developer). No multi-tenant user management is needed.
3. Desktop browsers with microphone support are the only required environment for MVP. Mobile is explicitly excluded.
4. Internet connectivity is assumed. No offline mode is required.
5. Email/password authentication is sufficient for MVP. Social login is not required.
6. Each user has a single active profile. There is no concept of teams or shared accounts.
7. A user can only be in one interview session at a time.
8. The AI interviewer represents a generic top-tier technology company, not a specific named company.
9. Reports are generated entirely after the interview ends. Real-time scoring during the interview is not required for MVP.
10. Resume storage is per-user. A user's resume is accessible to the system when analyzing their history.
11. The interview does not require video — audio only.
12. No accessibility requirements (screen readers, closed captioning) are defined for MVP.

---

## 9. Risks

| Risk | Likelihood | Impact | Notes |
|---|---|---|---|
| Voice turn-taking feels unnatural — AI cuts off the user or waits too long | High | High | Core to the experience. Must be validated early. |
| STT accuracy is low enough to confuse the AI | Medium | High | Poor transcription leads to irrelevant follow-ups |
| Resume parsing fails on non-standard PDF layouts | Medium | High | Results in a generic, non-personalized interview |
| AI loses conversational coherence over a 45-minute session | Medium | High | Long context management is non-trivial |
| Latency between user finishing and AI responding feels awkward | High | Medium | Even 1–2 seconds of dead silence degrades the experience |
| $15 budget is exhausted by a small number of test sessions | High | Medium | 30–45 min sessions with voice + LLM could be expensive |
| AI challenges genuine experience as exaggerated, frustrating the user | Low | Medium | Calibration of the credibility assessment is tricky |
| Browser microphone API behaves inconsistently across Chrome/Firefox/Safari | Medium | Medium | Should be limited to one browser for MVP testing |
| Report feels generic even with resume-personalized questions | Low | High | Undermines the core value proposition |
| Incomplete interviews (user closes tab) leave orphaned data | Medium | Low | Needs graceful handling but not a blocker |

---

## 10. Edge Cases and Failure Scenarios

### Resume Upload
- User uploads a file that is not a PDF (e.g., .png, .mp3, .exe).
- User uploads a corrupted or password-protected PDF.
- User uploads a document that is not a resume (e.g., a research paper, a cover letter).
- User uploads a resume with no meaningful content (e.g., blank pages, only an image scan).
- User uploads an extremely short resume (one page, student with no experience).
- User uploads an extremely long resume (10+ pages, dense formatting).
- User uploads a resume in a language other than English.

### Interview Setup
- User tries to start an interview without uploading a resume.
- Resume analysis fails (timeout, parsing error). User should be shown a clear error and allowed to retry.
- User selects a role/level combination that doesn't match their resume.

### Preparation Screen
- User denies microphone permission in the browser.
- User has no microphone connected (desktop without a mic).
- Microphone is detected but produces no audio (muted at OS level).
- User stays on the prep screen and does nothing (session idle timeout).

### During the Interview
- User is completely silent for 30+ consecutive seconds.
- User speaks continuously for an unusually long time without pausing.
- User attempts to interrupt the AI while it is speaking.
- User asks the AI a question about itself ("Are you a real person?").
- User speaks in a language other than English.
- User's audio quality is extremely poor (background noise, echo, low volume).
- User closes the browser tab mid-interview.
- User's network connection drops mid-interview.
- User's microphone disconnects mid-interview.
- User attempts to open a second interview session in another tab.
- AI generates a response that is off-topic, inappropriate, or repetitive.
- Interview reaches 60+ minutes without a natural conclusion.

### Post-Interview
- Report generation fails after a completed interview.
- User navigates away from the report page before the PDF is downloaded.
- User ends the interview within the first 2–3 minutes (insufficient data for a meaningful report).
- Report is generated but lacks specific references to the interview (feels generic).
- User tries to re-download a past report that was generated from a now-deleted resume.

### Authentication
- User attempts to register with an already-registered email.
- User enters wrong password multiple times (rate limiting or lockout behavior needed).
- Password reset link expires before the user clicks it.
- User attempts to access a protected page (dashboard, interview) while logged out.

---

## 11. Feature Tiers

### MVP

- Email/password authentication (signup, login, logout, password reset)
- Resume upload: PDF only, stored to user profile
- Option to reuse previous resume when starting a new interview
- Predefined role selection (5 roles)
- Predefined experience level selection (5 levels)
- Resume analysis pipeline
- Interview type: Resume-based only
- Prep/countdown screen with mic status indicator and instructions
- Real-time hands-free voice interview
- AI interviewer with full evaluation behavior (see Section 6)
- Post-interview evaluation report (all 9 sections)
- PDF report download
- Interview history on dashboard (view past reports)
- Desktop browser only

---

### V1 (Post-MVP Validation)

- Behavioral interview type
- Technical interview type
- Custom job description input (instead of or in addition to predefined roles)
- Resume format: .docx support
- Shareable report links
- Multiple resumes per user (resume library)
- Interview comparison view (compare two interview reports)

---

### Future

- System design interview type
- Leadership interview type
- Mobile browser support
- Analytics dashboard (score trends, improvement over time)
- Practice mode (hints enabled, coaching during interview)
- Third-party OAuth (Google, GitHub login)
- Closed captions during the interview (accessibility)
- Multi-language resume support
- Progress tracking and improvement metrics
- Recruiter or team features

---

## 12. Open Questions

These questions must be answered before or during Phase 1 planning.

1. **Session recovery:** If the user's browser closes mid-interview, should the system attempt to resume the session when they return, or treat it as a terminated interview?

2. **Minimum interview length for a valid report:** What is the minimum interview duration below which a report should not be generated (or should be marked as incomplete)?

3. **Silence handling:** If the user is silent for an extended period, should the AI wait, prompt the user, or conclude the interview?

4. **AI persona identity:** Does the AI interviewer have a name, a defined voice style, or a persona identity (e.g., "Alex from Acme Corp"), or is it intentionally anonymous?

5. **Visual representation during interview:** Does the AI have any visual presence on the interview screen (avatar, waveform, name badge), or is the screen minimal?

6. **Countdown timer:** Final value: 30, 45, or 60 seconds?

7. **Data retention:** How long should interview reports and uploaded resumes be retained in the system?

8. **Account deletion:** Should the user be able to delete their account and all associated data from within the app?

9. **Concurrent session prevention:** Should the system block a second interview session from starting if one is already in progress, or simply warn the user?

10. **Report notification:** Should the user receive any notification (in-app or email) when their report is ready?
