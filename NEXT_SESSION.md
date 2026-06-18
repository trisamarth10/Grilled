# Next Session Handoff

Pick up here when resuming work on Grilled.

---

## Current State

- **Deployed at**: `grilled-psi.vercel.app`
- **Repo**: `trisamarth10/Grilled` (main branch, latest commit `c4f0fcf`)
- **Everything working on localhost**: auth, resume upload, interview, report, dashboard

---

## What Was Done This Session

- **LLM**: switched from `gpt-4o-mini` → Groq `llama-3.3-70b-versatile` (~800ms vs 3.5s)
- **TTS**: MediaSource streaming so audio plays on first byte (not after full download)
- **TTS**: dual-provider setup — one line switches between ElevenLabs and Deepgram
- **STT**: upgraded Deepgram Nova-2 → Nova-3
- **VAD**: raised RMS threshold `0.015 → 0.022` (fan/ambient noise), silence cooldown `700 → 1000ms`
- **Cursor glow**: moved from landing page only → root layout (all pages)
- **TTS currently set to**: `deepgram` (safe for Vercel deployment)

---

## Important: Before Testing on Localhost

In `web/app/api/interview/speak/route.ts`, line 2:
```ts
const TTS_PROVIDER: "elevenlabs" | "deepgram" = "deepgram"; // ← change to "elevenlabs" for localhost
```
ElevenLabs (friend's account) sounds much better. Deepgram is for Vercel deployment to avoid flagging.

---

## Vercel Environment Variables Needed

`GROQ_API_KEY` must be added to Vercel → Settings → Environment Variables.
Without it, the interview LLM will fail on the deployed site.

---

## Pending / Not Done Yet

### High Priority
- [ ] **Comma-breaking for TTS** — currently sentences sent to TTS at `.!?` only. Breaking at `,` too would reduce TTS variance (5000ms outliers → ~1500ms). Discussed, agreed to do, not implemented.
- [ ] **GROQ_API_KEY on Vercel** — add to environment variables and redeploy.
- [ ] **Vercel/Clerk deployment explanation** — user asked for detailed explanation of what changes needed for Clerk + Vercel to work for all users (not just localhost). Do this before going public.

### Medium Priority
- [ ] **ElevenLabs for Vercel** — friend's free account key may get flagged by ElevenLabs fraud detection on Vercel cloud IPs. Long-term fix: purchase ElevenLabs Starter ($5/month). Explain options to user.
- [ ] **Upload vs Whisper duplicate metric** — both show the same number in the latency panel. `upload` should show HTTP POST time, `whisper` should show STT processing time. Quick fix.
- [ ] **ALEX doesn't start sometimes** — intermittent bug, mostly fixed by reliable TTS, but no retry logic added. If it still happens, add a retry in `handleStart`.

### CLEANUP.md (do before going public)
- Restore countdown to 60s (`web/components/countdown/CountdownScreen.tsx`, line 7: `TOTAL = 10`)
- Restore `MIN_SESSION_SECONDS` to `20 * 60` (`InterviewScreen.tsx` + `report/page.tsx`)
- Remove mic debug display (debugRms span)
- Remove latency panel UI (keep console logs)
- Remove all `[vad]`, `[dg-ws]`, `[turn N]` console logs

### Deferred / Future
- [ ] **Code walkthrough** — user wants to understand the full codebase end to end. Plan a dedicated session for this.
- [ ] **ASSESSMENT.md** — user has a job assignment from ollive.ai, wants help. Separate session.
- [ ] **Light theme** — declined for now, may revisit.
- [ ] **Custom domain** — needed for Clerk production instance if app goes fully public (`.vercel.app` not supported for Clerk production).

---

## Key Files Reference

| What | File |
|---|---|
| TTS provider switch | `web/app/api/interview/speak/route.ts` line 2 |
| LLM (Groq) | `web/app/api/interview/respond/route.ts` |
| VAD constants | `web/components/interview/InterviewScreen.tsx` lines 25-31 |
| MSE streaming helper | `web/components/interview/InterviewScreen.tsx` — `createStreamingAudioUrl()` |
| Cursor glow | `web/components/landing/CursorGlow.tsx` (loaded in `web/app/layout.tsx`) |
| Countdown duration | `web/components/countdown/CountdownScreen.tsx` line 7 |
| Cleanup checklist | `CLEANUP.md` |

---

## Tech Stack Summary (for reference)

| Layer | Provider | Notes |
|---|---|---|
| Auth | Clerk (dev instance) | Dev keys work on Vercel with fallback host set |
| Database | Supabase | Sessions, resumes, reports |
| STT | Deepgram Nova-3 | WebSocket streaming |
| LLM (interview) | Groq llama-3.3-70b-versatile | Fast, ~800ms |
| LLM (report eval) | OpenAI gpt-4o | `web/lib/report/generate.ts` |
| LLM (resume analysis) | OpenAI gpt-4o | `web/lib/resume/analyze-resume.ts` |
| TTS | ElevenLabs Flash v2.5 (localhost) / Deepgram Aura (Vercel) | One-line switch |
| Hosting | Vercel | `grilled-psi.vercel.app` |
