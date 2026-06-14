# Cleanup TODO

Small items deferred during development. Do these before shipping.

---

## Interview Screen

- [ ] Restore countdown timer to 60 seconds (currently set to 10 for testing)
  - File: `web/components/countdown/CountdownScreen.tsx`, line 7: `const TOTAL = 10`

- [ ] Remove mic debug display (`mic: X / 100` shown under user avatar during interview)
  - File: `web/components/interview/InterviewScreen.tsx` — remove `debugRms` state + the span that renders it

- [ ] Remove latency debug panel (bottom-right overlay showing turn latency)
  - File: `web/components/interview/InterviewScreen.tsx` — remove `latencyPanel` state + the fixed panel div at the bottom of the return
  - Keep the `console.log` latency lines — just remove the on-screen UI

---

## General

- [ ] Remove all `[vad]`, `[dg-ws]`, `[turn N]`, `[latency]`, `[audio]` console logs before production
