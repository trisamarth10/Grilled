# InterviewIQ — Product Design Specification

> A resume-based AI voice interview system. The user uploads their resume, picks a difficulty tier, and gets interviewed by an animated AI interviewer (ALEX) for 45 minutes via voice only. No DSA categories, no text chat — pure behavioral and resume-driven questions, spoken out loud.

---

## Table of Contents
1. [Product Flow](#product-flow)
2. [Design System](#design-system)
3. [Screen 1 — Landing](#screen-1--landing)
4. [Screen 2 — Resume Upload & Config](#screen-2--resume-upload--config)
5. [Screen 3 — Focus Timer (Pre-Session)](#screen-3--focus-timer-pre-session)
6. [Screen 4 — Interview Session (Voice)](#screen-4--interview-session-voice)
7. [Screen 5 — Report Card](#screen-5--report-card)
8. [Shared Background System](#shared-background-system)
9. [Animations Cheatsheet](#animations-cheatsheet)
10. [Tech Stack](#tech-stack)

---

## Product Flow

```
Landing (Sign in with Google)
  ↓
Resume Upload + Config (PDF/DOCX, difficulty level, optional target company)
  ↓
Focus Timer (60-second countdown before session starts)
  ↓
Interview Session (45 min voice-only, animated AI avatar)
  ↓
Report Card (per-category scores, AI written feedback, downloadable)
```

---

## Design System

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-base` | `#040010` | Page background (near-black deep purple) |
| `--bg-surface` | `rgba(255,255,255,0.02)` | Cards, panels, frosted-glass surfaces |
| `--bg-surface-hover` | `rgba(255,255,255,0.05)` | Card hover state |
| `--border` | `rgba(255,255,255,0.08)` | Subtle borders |
| `--border-accent` | `rgba(139,92,246,0.15)` | Purple-tinted borders for accent panels |
| `--violet` | `#7C3AED` | Primary brand color |
| `--violet-light` | `#8B5CF6` | Lighter violet, text gradients |
| `--violet-pale` | `#A78BFA` | Label text, subtle accents |
| `--cyan` | `#06B6D4` | Secondary brand color |
| `--cyan-light` | `#22D3EE` | Lighter cyan |
| `--pink` | `#EC4899` | Tertiary accent, decorative |
| `--text-primary` | `#FFFFFF` | Headings |
| `--text-secondary` | `#CBD5E1` | Body text |
| `--text-muted` | `#64748B` | Labels, metadata |
| `--green` | `#10B981` | Success, "READY" badge |
| `--red` | `#EF4444` | Recording indicator, warning state |

**Brand gradient (used on CTAs, active states, score arcs):**
```css
background: linear-gradient(135deg, #7C3AED, #06B6D4);
```

**Hero text gradient:**
```css
background: linear-gradient(to right, #8B5CF6, #22D3EE, #EC4899);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

### Typography

| Role | Family | Weight | Size |
|------|--------|--------|------|
| Display / Hero headings | Space Grotesk | 800 | 5–8rem |
| Section headings | Space Grotesk | 700 | 2.5–4rem |
| Body copy | Inter | 300–400 | 1rem–1.125rem |
| Labels / metadata | JetBrains Mono | 400 | 0.6875rem–0.75rem, `letter-spacing: 0.12em`, `text-transform: uppercase` |
| Score numbers | JetBrains Mono | 700 | 2.5–6rem |

Load from Google Fonts:
```
Space+Grotesk:wght@500;600;700;800
Inter:wght@300;400;500
JetBrains+Mono:wght@400;500;700
```

### Spacing & Radii

- Card border-radius: `1rem` (16px)
- Button border-radius: `9999px` (pill)
- Input border-radius: `0.5rem` (8px)
- Upload zone border-radius: `0.75rem` (12px)
- Standard padding for cards: `24px`

### Shadows & Glow

Primary CTA button shadow:
```css
box-shadow: 0 0 40px rgba(124,58,237,0.5), 0 0 80px rgba(6,182,212,0.2);
```
On hover:
```css
box-shadow: 0 0 60px rgba(124,58,237,0.7), 0 0 100px rgba(6,182,212,0.3);
```

Card hover glow:
```css
box-shadow: 0 0 30px rgba(124,58,237,0.15);
```

---

## Screen 1 — Landing

### Purpose
Marketing / auth gate. User signs in with Google to get started.

### Layout
Full-viewport, dark background, two visual layers: ambient background + centered hero content. Feature sections below the fold (scrollable).

### Navbar
- Fixed, `backdrop-filter: blur(20px)`, `background: rgba(4,0,16,0.8)`, bottom border `rgba(255,255,255,0.04)`
- Left: "IQ" logo in Space Grotesk 800, gradient text (violet → cyan)
- Right: "Sign In" pill button — transparent background, `border: 1px solid rgba(255,255,255,0.12)`, white text, hover fills softly

### Hero Section
Centered vertically, `min-height: 100vh`

**Badge (above headline):**
```
● [AI INTERVIEW ENGINE]
```
Dark pill `background: rgba(255,255,255,0.05)`, cyan dot (pulsing `opacity: 1→0.3→1` on 1.5s loop), JetBrains Mono, 11px, tracked

**Headline (two lines):**
```
Get Grilled.
Get Hired.
```
- Line 1: "Get Grilled." — plain white, Space Grotesk 800, ~7rem
- Line 2: "Get Hired." — gradient text (violet → cyan → pink), each character subtly offset in color

**Typewriter subtitle** (below headline, cycles through 3 strings every ~3s with delete animation):
- "45-minute AI-powered interviews that feel like the real thing."
- "Questions that adapt depth-first through your knowledge."
- "Your weaknesses, found. Your strengths, confirmed."
- Style: Inter 300, 1.125rem, `#CBD5E1`, with a blinking cyan cursor block

**CTA button:**
```
[G] Sign in with Google
```
- Gradient fill (violet → cyan), pill shape, 16px 32px padding, 1.125rem text
- Shimmer overlay animation on loop (`linear-gradient` sweep left→right, `opacity: 0→0.3→0`, 3s)
- `whileHover: { scale: 1.02, y: -2 }`, `whileTap: { scale: 0.98 }`
- Glow shadow on base + stronger glow on hover

**HUD corners:** Four `[` `]` bracket glyphs in the corners of the viewport, JetBrains Mono, faint violet, very subtle

### Feature Sections (below fold, 3 sections)

Each section: `max-width: 1024px`, centered, `padding: 0 48px`, two-column grid (text + visual), `min-height: 70vh`

Separated by `1px` horizontal divider `rgba(255,255,255,0.08)` at `max-width: 768px`

**Feature 1 — DFS-Style Questioning**
- Text column (left): JetBrains Mono label "HOW IT WORKS" in `#8B5CF6` → h2 "DFS-Style Questioning" → body paragraph → 3 bullet points with violet dots
- Visual column (right): Animated SVG concept tree
  - Root node "Your Project" at top, branches to "Architecture", "Tradeoffs", "Edge Cases"
  - Nodes draw in sequentially (SVG `pathLength` from 0→1)
  - "Edge Cases" node at deepest level has a pulsing red/orange glow — marks the "weak point"
  - Edges animate opacity 0→1 on mount

**Feature 2 — Voice-First. Real Pressure.**
- Visual column (left): Live waveform mock + typewriter question card
  - 32 animated bars (violet → pink gradient), heights oscillating on loop
  - A frosted card below showing a sample AI question with typewriter cursor
  - 3 stat pills: `< 200ms latency`, `99.2% accuracy`, `real-time follow-ups`
- Text column (right): JetBrains Mono label "VOICE ENGINE" in `#06B6D4` → h2 → body → 3 bullets with cyan dots

**Feature 3 — Your Report Card, Instantly.**
- Text column (left): JetBrains Mono label "AFTER EVERY SESSION" in `#EC4899` → h2 → body → 3 bullets with pink dots
- Visual column (right): Animated score bars
  - 4 categories with label + score percentage + bar that fills left→right on scroll-into-view
  - Color: gradient from violet to cyan
  - Small AI feedback text below each bar in muted gray

### Final CTA Section
- h2 "Ready to get grilled?" centered, 4rem, Space Grotesk 800
- Same Google sign-in button
- "No DSA · No prep required · Just your resume" in JetBrains Mono muted below

---

## Screen 2 — Resume Upload & Config

### Purpose
Single-page form. User uploads resume PDF/DOCX, picks difficulty, optionally types a target company, then clicks Begin Session.

### Layout
Centered, `max-width: 640px`, vertical stack

**Step label (top):**
```
STEP 1 OF 2 · UPLOAD RESUME
```
JetBrains Mono, `#64748B`, 12px, tracked, centered

**Upload Drop Zone:**
- Height: `340px`, full width
- `border: 1px dashed rgba(139,92,246,0.3)`, hover: `rgba(139,92,246,0.6)` dashed border
- Background: `rgba(6,0,24,0.5)`, `backdrop-filter: blur(8px)`
- Centered: gradient upload icon (violet→cyan via SVG linearGradient), "Drop your resume here" (white, 1.25rem), "PDF or DOCX · Max 10MB" (JetBrains Mono, muted)
- On drag-over: border glows violet, background lightens
- On file selected: transitions to a File Card below

**File Card (shown after upload):**
```
[file-icon]  sample_resume_2024.pdf  284KB     [READY]  [×]
```
- `background: rgba(255,255,255,0.02)`, `border: 1px solid rgba(255,255,255,0.08)`, rounded-lg
- File icon in violet, filename in `#CBD5E1`, size in muted
- "READY" badge: `#10B981` text on `rgba(16,185,129,0.1)` background
- × dismiss button

**Configuration — Difficulty Level:**
Label: JetBrains Mono "DIFFICULTY LEVEL" muted uppercase

Four pill toggle buttons:
```
Internship  |  New Grad  |  Mid-Level  |  Senior
```
- Inactive: `background: rgba(255,255,255,0.02)`, `border: rgba(255,255,255,0.08)`, `color: #CBD5E1`
- Active: `background: linear-gradient(to right, #7C3AED, #06B6D4)`, white text, no border

**Configuration — Target Company (optional):**
Label: JetBrains Mono "TARGET COMPANY (OPTIONAL)" muted

Text input with a building icon inside left side:
- `background: rgba(255,255,255,0.02)`, `border: 1px solid rgba(255,255,255,0.08)`
- Placeholder `e.g. Stripe, Google...` in `#64748B`
- Focus: `border-color: #7C3AED`, background lightens slightly

**CTA button:**
```
Begin Session →
```
Full-width, same gradient pill button as landing. Arrow icon shifts right `4px` on hover (`motion.svg` `animate={{ x: hovered ? 4 : 0 }}`).

---

## Screen 3 — Focus Timer (Pre-Session Countdown)

### Purpose
60-second focus screen before the interview starts. No interaction needed — just breathe, the timer counts down and the session auto-begins.

### Layout
Single centered element, `min-height: 100vh`

**"GET READY" label** — JetBrains Mono, `#CBD5E1`, tracked, fades in on mount

**Circular countdown:**
- 280×280px SVG ring
- Track ring: `rgba(255,255,255,0.06)` stroke, 6px wide
- Active arc: gradient from `#7C3AED` to `#06B6D4`, 6px, `stroke-linecap: round`, starts at 12-o'clock (`rotate(-90)`)
- Glow ring: same gradient, 24px wide, `opacity: 0.25`, `feGaussianBlur stdDeviation=4`
- Center text: countdown number in JetBrains Mono 96px, gradient text; "seconds remaining" in 12px muted label below
- Warning state (≤15s): arc and number switch to solid `#EF4444`
- Arc animates from full → empty via `strokeDashoffset` over 1.2s `easeOut`

**Ambient particles:**
30 floating dots (colors: `#A78BFA`, `#22D3EE`, `#FFFFFF`), 2–4px, scattered across viewport, each pulsing opacity independently on a 1.5–3.5s loop

**Interviewer card (bottom-center):**
Slides up from below after 0.5s delay:
```
[A]  Alex · AI Interviewer
```
- Frosted pill: `background: rgba(255,255,255,0.02)`, `border: 1px solid rgba(139,92,246,0.15)`, `backdrop-filter: blur(16px)`
- Avatar: gradient circle (violet→cyan) with "A" letter inside
- Text: "Alex · AI Interviewer" in Inter 500, white, 14px

---

## Screen 4 — Interview Session (Voice Only)

### Purpose
The core experience. No text chat, no code editor, no press-to-speak button. The user and ALEX (the AI interviewer) take turns speaking. ALEX always listens — user can interrupt at any time.

### Layout
Full viewport, two vertical halves divided by a horizontal line:
- **Top half (58%):** ALEX's section — avatar, status, voice waveform
- **Bottom half (42%):** User's section — user avatar, always-listening indicator, user waveform, live caption bar

### Top Bar (fixed, 56px)
```
IQ · LIVE INTERVIEW          ● REC  38:42         [END SESSION]
```
- Left: "IQ" in gradient + "· LIVE INTERVIEW" in JetBrains Mono muted
- Center: Red pulsing dot `● REC` + cyan timer `38:42` in JetBrains Mono 700
- Right: "END SESSION" pill — transparent, `border: 1px solid rgba(239,68,68,0.35)`, muted red, hover fills softly red

### ALEX's Section (top half)

**Avatar — ALEX the AI interviewer:**

The avatar is a Memoji-style animated face, 240×272px, oval portrait (no circular crop):
- Face shape: CSS oval `border-radius: 48% 48% 44% 44% / 46% 46% 54% 54%`, `overflow: hidden`
- Skin tone: `linear-gradient(160deg, #FFE4D0, #FFCFB0, #ECA882, #D98866)`
- Hair: dark brown cap `linear-gradient(175deg, #271208, #3A1C0F, #4D2518)`, `border-radius: 50% 50% 42% 42% / 90% 90% 42% 42%`, two side wisps
- Eyes (×2): 50×40px white ovals `border-radius: 52% 52% 48% 48%`, hazel-green iris, dark pupil with two catchlights (bright + smaller), upper lid shadow. Six individual lash strands above each eye, angled outward
- Eyebrows: dark brown `#2A1408`, pill shape, 5px tall, rotated ±8°, animate top position up/down
- Nose: SVG button nose — bridge shadow, rounded tip ellipse, two nostril wings (slightly flared), tip highlight. All fills are direct colors, no gradient references
- Lips: SVG-drawn. Upper lip has cupid's bow (two humps, philtrum dip). Lower lip is fuller and rounder with a gloss highlight. Colors: upper `#C86050`, lower `#D4706A`
- Mouth cavity behind lips: dark `#6B1830`, shows white teeth strip + subtle tooth dividers when open

**Facial animation states:**

| State | Eyes | Brows | Mouth | Cheeks |
|-------|------|-------|-------|--------|
| AI Speaking | Open (blink every 2.5–6s) | Raise on ~40% of phonemes | Rapid open/close (0–24px height, 72–165ms intervals) | Pink blush `rgba(220,100,80,0.18)` visible |
| AI Listening | Open (blinking) | Neutral | Closed (height = 0) | No blush |
| Transitioning | Open | Neutral | Closed | No blush |

Ambient glow behind avatar (no hard ring): `radial-gradient` pulsing scale 1→1.07→1 when speaking

**Name label below avatar:**
```
ALEX · AI INTERVIEWER
```
JetBrains Mono, `#CBD5E1`, 11px, tracked

**Status indicator (animated, switches per state):**
- Speaking: `● SPEAKING` — purple pulsing dot + `#A78BFA` text
- Listening: `◌ LISTENING TO YOU` — slow-pulsing cyan dot + `#67E8F9` text
- Processing: `PROCESSING...` — static muted text

**AI Voice Waveform (visible only when ALEX is speaking):**
36 animated bars, `max-width: 400px`, height `52px`, alternating `#8B5CF6` and `#EC4899` colors. When active: bars oscillate between 12–90% height with staggered delays. When inactive: all collapse to 10%, opacity 0.15

### Divider
1px horizontal line: `linear-gradient(to right, transparent, rgba(139,92,246,0.2), rgba(6,182,212,0.2), transparent)`

### User's Section (bottom half)

**User avatar:** 72×72px circle
- Background: `linear-gradient(135deg, rgba(6,182,212,0.25), rgba(139,92,246,0.2))`
- Border: `1.5px solid rgba(6,182,212,0.35)`, animates to `0.7` opacity when user is speaking
- SVG silhouette of a person inside
- Outer glow pulse when user speaking: `radial-gradient` scale 1→1.1→1 at 0.9s loop

**User status:**
```
YOU
● ALWAYS LISTENING — INTERRUPT ANYTIME
```
JetBrains Mono, "YOU" in `#CBD5E1`, status line in `rgba(34,211,238,0.7)` with slowly-pulsing cyan dot

**User Voice Waveform:**
28 bars, `max-width: 320px`, alternating `#22D3EE` and `#06B6D4`. Active when user is speaking. Gently animated even when quiet (very low heights) to show "always on"

**Live Caption Bar (bottom of screen, appears when ALEX is speaking):**
- Frosted pill centered at bottom: `background: rgba(4,0,16,0.7)`, `backdrop-filter: blur(16px)`, `border: 1px solid rgba(139,92,246,0.15)`, `border-radius: 10px`
- Text typewriters in as ALEX "speaks": `#CBD5E1`, 13px, Inter
- Blinking violet cursor `|` at end while typing

### Interview State Machine (demo cycle)
```
ai_speaking  (5s) → transitioning (0.8s) → user_speaking (4.2s) → transitioning (1s) → ai_speaking ...
```

### Sample Questions (behavioral, resume-based only — NO DSA)
- "Tell me about a project from your resume that you're most proud of."
- "What was the biggest technical challenge you faced on that project?"
- "How did you approach disagreements within the team on technical decisions?"
- "Walk me through how you'd improve that system if you rebuilt it today."
- "Tell me about a time when you had to lead without formal authority."

---

## Screen 5 — Report Card

### Purpose
Post-session performance summary. Shown immediately after session ends. Scrollable page.

### Layout
`max-width: 900px`, centered, `padding: 64px 16px`, scrollable

### Header Row
Left side:
- JetBrains Mono label "SESSION COMPLETE" in `#64748B`
- h1 "Your Performance Report" — Space Grotesk 700, 3–5rem, white

Right side — Overall Score Ring:
- 200×200px SVG ring, 8px stroke
- Track: `rgba(255,255,255,0.06)`
- Arc: gradient `#7C3AED → #06B6D4`, glow layer `strokeWidth × 4`, `opacity: 0.25`, `feGaussianBlur stdDeviation=4`
- Arc animates from 0 → final position on mount (`duration: 1.5s, easeOut`)
- Center: score number `78/100` (JetBrains Mono 700, 64px, gradient text; `/100` in 24px muted)
- Below ring: "GOOD PERFORMANCE" in JetBrains Mono 10px tracked, then letter grade "B+" on gradient pill

### Category Score Cards (6 cards in 2-column grid)

Each card:
- `background: rgba(255,255,255,0.02)`, `border: 1px solid rgba(139,92,246,0.15)`, `border-radius: 16px`, `padding: 24px`, `backdrop-filter: blur(16px)`
- Hover: border → `rgba(139,92,246,0.4)`, lifts `y: -2px`, soft violet glow shadow
- JetBrains Mono category label in `#A78BFA`, 11px
- Score number in gradient text (violet → cyan), JetBrains Mono 700, 40px
- Progress bar: 6px tall, `border-radius: 9999px`, track `rgba(255,255,255,0.05)`, fill gradient. Animates width 0 → `{score}%` on mount, staggered 100ms per card
- AI comment text in `#64748B`, 14px, Inter 300

Default categories and scores:
| Category | Score |
|----------|-------|
| Technical Accuracy | 82 |
| Problem-Solving Approach | 76 |
| Communication Clarity | 88 |
| Depth of Knowledge | 70 |
| Edge Case Handling | 65 |
| Time Efficiency | 84 |

> **Note:** For a resume-based (non-DSA) implementation, rename categories to:  
> Behavioral Clarity · Communication · Self-Awareness · Leadership Examples · Technical Depth · Structured Thinking

### Insights Section (2-column)

**Strengths panel:**
- `border: 1px solid rgba(255,255,255,0.05)`, rounded-xl, `padding: 32px`
- Header: "STRENGTHS" in `#10B981`, JetBrains Mono, checkmark icon
- 3 bullet points in `#CBD5E1` with green `•`

**Areas to Improve panel:**
- Same styling
- Header: "AREAS TO IMPROVE" in `#A78BFA`, JetBrains Mono, info icon
- 3 bullet points with violet `•`

### AI Interviewer's Assessment
Full-width block:
- `background: rgba(124,58,237,0.05)`, `border-left: 2px solid #8B5CF6`, `padding: 32px`
- Label: "INTERVIEWER'S ASSESSMENT" in `#8B5CF6`, JetBrains Mono tracked
- Paragraph: `#CBD5E1`, 1rem, Inter 300, `line-height: 1.8`
- This is the free-form written summary from the AI about the user's overall performance

### Action Bar (bottom)
`border-top: 1px solid rgba(255,255,255,0.05)`, `padding-top: 32px`, flex row

- **Download Report** — gradient pill button (primary)
- **Start New Session** — ghost pill button (violet border, violet text)
- **Share icon** — 48×48px circle ghost icon button on the right

---

## Shared Background System

Every screen uses the same three-layer background stack:

### Layer 1 — Color Orbs (fixed, z-index: 0)
Three blurred circles that drift slowly:

| Orb | Color | Size | Position | Opacity |
|-----|-------|------|----------|---------|
| Violet | `#7C3AED` | 700×700px | top-left | 0.25 |
| Cyan | `#06B6D4` | 500×500px | bottom-right | 0.20 |
| Pink | `#EC4899` | 400×400px | top-right | 0.12 |

Each orb uses `filter: blur(140–160px)` and animates position:
```
animate={{ x: [0, 50, -30, 0], y: [0, -40, 20, 0] }}
transition={{ duration: 8–10s, repeat: Infinity, ease: "easeInOut" }}
```

### Layer 2 — Neural Canvas (fixed, z-index: 0, pointer-events: none)
`<canvas>` element covering the full viewport, drawn on every animation frame:
- 35 floating nodes (white, 1.5px radius, `opacity: 0.35`), drifting at ±0.5px/frame, bouncing off edges
- Edges drawn between nodes within 180px distance: opacity `(1 - dist/180) × 0.12`, color interpolates from `rgb(139,92,246)` at top to `rgb(6,182,212)` at bottom based on midpoint Y, lineWidth 0.8px

### Layer 3 — Scanline Overlay (fixed, z-index: 0, pointer-events: none)
```css
background: repeating-linear-gradient(
  0deg,
  transparent, transparent 2px,
  rgba(255,255,255,0.006) 2px, rgba(255,255,255,0.006) 4px
);
```

---

## Animations Cheatsheet

| Element | Animation | Duration |
|---------|-----------|----------|
| Page mount — any content block | `opacity: 0→1, y: 20→0` | 0.6–0.8s |
| Gradient orbs drifting | `x/y keyframe loop` | 8–10s, infinite |
| CTA button hover | `scale: 1.02, y: -2` | 0.2s |
| Badge cyan dot | `opacity: 1→0.3→1` | 1.5s, infinite |
| Typewriter text | Character-by-character, 50ms/char type, 30ms/char delete | — |
| Neural canvas nodes | 60fps canvas draw loop | — |
| Circular countdown arc | `strokeDashoffset` 0→final | 1.2s easeOut |
| Score arc on report card | `strokeDashoffset` 0→final | 1.5s easeOut |
| Score bar fill | `width: 0→{score}%` staggered | 1s per bar, 100ms stagger |
| Card hover | `y: -2px`, border opacity up, glow in | 0.2s |
| ALEX avatar speaking glow | `scale: 1→1.07→1` | 0.8s, infinite while speaking |
| Eye blink | `scaleY: 1→0.04→1` | 0.08s + 120ms hold |
| Eyebrow raise | `top` position shifts -3% | 0.12s |
| Mouth opening (lip sync) | `height: 0–24px` random phoneme steps | 72–165ms per step |
| Voice waveform bars | `height` keyframes, staggered delays | 0.45–0.93s, infinite |
| Status label switch | `opacity/y` AnimatePresence | 0.2s |
| Caption typewriter | 38ms/character | — |

---

## Tech Stack

### Frontend
- **Framework:** React 18 + TypeScript
- **Routing:** React Router v6 (or Next.js App Router)
- **Styling:** Tailwind CSS v3 + inline styles for dynamic values
- **Animation:** Framer Motion v11+
- **Font delivery:** Google Fonts (preconnect + stylesheet link)

### Auth
- **Provider:** Google OAuth via your preferred strategy (Clerk, NextAuth, Supabase Auth, or Firebase Auth)
- After login: store `userId`, `email`, `name`, `avatar` in session

### Voice Pipeline
- **TTS (ALEX speaking):** ElevenLabs streaming TTS — send question text → receive audio stream → play via Web Audio API
- **STT (user speaking):** OpenAI Whisper API — continuously capture microphone via `MediaRecorder`, chunk every ~1.5s, transcribe in real time
- **Interrupt detection:** When Whisper returns non-empty transcript while ALEX TTS is playing → stop current TTS audio, mark state as `user_speaking`
- **VAD (optional):** Use `@ricky0123/vad-web` or Silero VAD for local voice activity detection to reduce API calls

### Interview Intelligence
- **Model:** Claude 3.5 Sonnet (or Claude 3 Opus for depth)
- **Resume parsing:** Extract text from uploaded PDF/DOCX on server (use `pdf-parse` or Tika), send to Claude with system prompt
- **Question generation:** System prompt instructs Claude to:
  - Ask behavioral/resume-specific questions only (no DSA, no LeetCode)
  - Use depth-first follow-up: go deep on any vague answer before moving to next topic
  - Adapt difficulty to the selected tier (Internship / New Grad / Mid-Level / Senior)
  - Always speak as "Alex" — professional, direct, occasionally probing
  - Track topics covered to avoid repetition
- **Session memory:** Maintain rolling conversation history (user transcripts + ALEX responses) for context

### Backend API
- Express or Next.js API routes
- Endpoints:
  - `POST /api/session/start` — receive resume text + config → return initial question
  - `POST /api/session/respond` — receive user transcript + history → return next question or follow-up
  - `POST /api/session/end` — receive full transcript → return structured report card JSON
  - `GET /api/session/:id/report` — retrieve saved report

### Storage
- **Resume:** S3-compatible (Cloudflare R2, Supabase Storage, AWS S3) — store raw file + extracted text
- **Session history:** PostgreSQL or Supabase — store per-user session records, transcripts, report JSON
- **Reports:** Stored as JSONB in DB, downloadable as PDF via `react-pdf` or Puppeteer

### Report Card Schema
```typescript
interface SessionReport {
  sessionId: string;
  userId: string;
  timestamp: string;
  duration: number; // seconds
  difficulty: 'Internship' | 'New Grad' | 'Mid-Level' | 'Senior';
  targetCompany?: string;
  overallScore: number;       // 0–100
  letterGrade: string;        // A, B+, etc.
  categories: {
    name: string;
    score: number;            // 0–100
    feedback: string;
  }[];
  strengths: string[];
  areasToImprove: string[];;
  interviewerAssessment: string;  // free-form paragraph from Claude
  transcript: { role: 'alex' | 'user'; text: string; timestamp: number }[];
}
```

---

## Implementation Notes

1. **No press-to-speak button.** The mic is always open. Use VAD to gate Whisper calls — only transcribe when voice activity is detected.

2. **Interrupt logic.** When user speaks while ALEX is speaking: immediately call `audioElement.pause()` + clear TTS queue, set state to `user_speaking`, process the partial/full user response.

3. **Latency target.** ALEX → user transition: ElevenLabs first-chunk latency ~150–200ms + TTS start. User → ALEX: Whisper transcription (~300ms for 1.5s chunk) + Claude API (~500–800ms first token) + ElevenLabs TTS setup (~150ms). Total round-trip: aim for under 2 seconds.

4. **Session timer.** Front-end countdown from 45:00. At 0:00 gracefully end session (finish current exchange, then call `session/end`). Show a subtle warning at 5 minutes remaining.

5. **Report card scoring.** Claude grades each category on the full transcript. Use a structured output prompt with a JSON schema — one API call at session end that returns the full `SessionReport` minus `transcript`.

6. **Difficulty calibration:**
   - Internship: simple behavioral, straightforward project questions, very supportive tone
   - New Grad: standard behavioral, light technical depth, some probing
   - Mid-Level: probing follow-ups, expects concrete examples, pushes on impact and decisions
   - Senior: challenges assumptions, asks about scale/tradeoffs/leadership, expects architectural thinking
