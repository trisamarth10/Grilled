# Cleanup TODO

Small items deferred during development. Do these before shipping.

---

## Interview Screen

- [ ] Restore minimum session duration to 20 minutes (currently set to 0 for testing)
  - File: `web/components/interview/InterviewScreen.tsx` — change `const MIN_SESSION_SECONDS = 0` to `20 * 60`
  - File: `web/app/report/page.tsx` — restore the `duration_seconds < 20 * 60 → redirect("/dashboard")` guard inside `ReportContent`

- [ ] Restore countdown timer to 60 seconds before going live (currently kept at 10 — intentional for now)
  - File: `web/components/countdown/CountdownScreen.tsx`, line 7: `const TOTAL = 10`

- [ ] Remove mic debug display before going live (currently kept — intentional for now)
  - File: `web/components/interview/InterviewScreen.tsx` — remove `debugRms` state + the span that renders it

- [ ] Remove latency panel before going live (currently kept — intentional for now)
  - File: `web/components/interview/InterviewScreen.tsx` — remove `latencyPanel` state + the fixed panel div at the bottom of the return
  - Keep the `console.log` latency lines — just remove the on-screen UI

---

## General

- [ ] Remove all `[vad]`, `[dg-ws]`, `[turn N]`, `[latency]`, `[audio]` console logs before production
