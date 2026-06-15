"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AlexAvatar } from "./AlexAvatar";
import { Waveform } from "./Waveform";
import { TopBar } from "./TopBar";
import { markSessionEnded } from "@/lib/actions/get-session";
import type { SessionData } from "@/lib/actions/get-session";

type InterviewState =
  | "awaiting_start"
  | "loading"
  | "ai_speaking"   // ALEX talking — user CAN interrupt
  | "user_speaking" // user's turn (VAD active, recording when voice detected)
  | "processing"    // STT / LLM / TTS in flight — ignore mic
  | "ended";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const RMS_THRESHOLD           = 0.015; // normal turn: light threshold (user's turn to speak)
const INTERRUPT_RMS_THRESHOLD = 0.040; // interrupt: must be louder to cut off ALEX
const SPEAK_FRAMES_NEEDED     = 4;     // ~60ms at 60fps before we start recording (normal)
const INTERRUPT_FRAMES_NEEDED = 8;     // ~120ms to interrupt ALEX — avoids false triggers
const INTERRUPT_GRACE_MS      = 900;   // ignore interrupts for this long after ALEX starts
const SILENCE_DURATION_MS     = 700;
const MIN_BLOB_SIZE           = 2000;
const MAX_RECORD_MS           = 30_000;
const MAX_SESSION_SECONDS     = 45 * 60;

const ALEX_COLORS = ["#8B5CF6", "#EC4899", "#8B5CF6", "#EC4899"];
const USER_COLORS = ["#22D3EE", "#06B6D4", "#22D3EE", "#06B6D4"];

/* ─── User avatar ─────────────────────────────────────────────────────────── */

function UserAvatar({ speaking }: { speaking: boolean }) {
  return (
    <motion.div
      animate={speaking ? { scale: [1, 1.1, 1] } : { scale: 1 }}
      transition={{ duration: 0.9, repeat: speaking ? Infinity : 0, ease: "easeInOut" }}
      style={{
        width: 72, height: 72, borderRadius: "50%",
        background: "linear-gradient(135deg, rgba(6,182,212,0.25), rgba(139,92,246,0.2))",
        border: `1.5px solid rgba(6,182,212,${speaking ? 0.7 : 0.35})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "border-color 0.3s",
      }}
    >
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="13" r="7" fill="rgba(203,213,225,0.5)" />
        <path d="M4 34c0-8 6.3-14 14-14s14 6 14 14" fill="rgba(203,213,225,0.35)" />
      </svg>
    </motion.div>
  );
}

/* ─── Begin overlay ───────────────────────────────────────────────────────── */

function BeginOverlay({ onStart, error }: { onStart: () => void; error: string | null }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 50,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      background: "rgba(4, 0, 16, 0.97)", gap: "28px",
    }}>
      <motion.div
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: 88, height: 88, borderRadius: "50%",
          background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "36px", fontWeight: 700, color: "#fff",
          fontFamily: "var(--font-space-grotesk)",
          boxShadow: "0 0 48px rgba(124,58,237,0.5)",
        }}
      >A</motion.div>

      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "8px" }}>
        <p style={{ fontSize: "1.25rem", fontWeight: 700, color: "#fff", fontFamily: "var(--font-space-grotesk)" }}>
          Ready to meet ALEX?
        </p>
        <p style={{ fontSize: "0.875rem", color: "#64748B", fontFamily: "var(--font-inter)" }}>
          Click below to allow microphone access and begin.
        </p>
      </div>

      {error && (
        <p style={{ fontSize: "0.8125rem", color: "#EF4444", textAlign: "center", maxWidth: 320, fontFamily: "var(--font-inter)" }}>
          {error}
        </p>
      )}

      <button
        onClick={onStart}
        style={{
          padding: "14px 44px", borderRadius: "9999px",
          background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
          color: "#fff", fontSize: "1rem", fontWeight: 600, border: "none",
          cursor: "pointer", fontFamily: "var(--font-inter)",
          boxShadow: "0 0 28px rgba(124,58,237,0.45)",
        }}
      >
        Begin Interview
      </button>
    </div>
  );
}

/* ─── Main component ──────────────────────────────────────────────────────── */

export function InterviewScreen({ session }: { session: SessionData }) {
  const router = useRouter();
  const [interviewState, setInterviewState] = useState<InterviewState>("awaiting_start");
  const [messages,       setMessages]       = useState<Message[]>([]);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [userSpeaking,   setUserSpeaking]   = useState(false);
  const [startError,     setStartError]     = useState<string | null>(null);
  const [sessionTooShort, setSessionTooShort] = useState(false);
  const [debugRms,       setDebugRms]       = useState(0);
  const [latencyPanel,   setLatencyPanel]   = useState<{
    turn: number; blobKb: number; upload: number; stt: number;
    llm: number; tts: number; total: number;
  } | null>(null);
  const turnRef = useRef(0);

  // Audio infrastructure
  const streamRef          = useRef<MediaStream | null>(null);
  const analyserRef        = useRef<AnalyserNode | null>(null);
  const audioContextRef    = useRef<AudioContext | null>(null);
  const currentAudioRef    = useRef<HTMLAudioElement | null>(null);
  const currentAudioUrlRef = useRef<string | null>(null); // so VAD can revoke on interrupt

  // Recording
  const mediaRecorderRef  = useRef<MediaRecorder | null>(null);
  const chunksRef         = useRef<Blob[]>([]);
  const isRecordingRef    = useRef(false); // true while MediaRecorder is active

  // VAD bookkeeping
  const hasSpokeRef      = useRef(false);  // user has produced sustained speech this turn
  const silenceTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxRecordTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const vadFrameRef      = useRef<number | null>(null);

  // State ref — VAD reads this without stale-closure risk
  const isRef            = useRef<InterviewState>("awaiting_start");

  // Session
  const sessionTimerRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const endedRef         = useRef(false);
  const messagesRef      = useRef<Message[]>([]);
  const lastLogRef       = useRef(0);
  messagesRef.current = messages;

  // Function refs — break alexSpeak ↔ handleRecordingDone circular dependency
  const alexSpeakRef           = useRef<((text: string, perf?: { turnStart: number; blobKb: number; upload: number; stt: number; llm: number }) => Promise<void>) | null>(null);
  const handleRecordingDoneRef = useRef<(() => Promise<void>) | null>(null);

  // Sentence-streaming pipeline: abort + stop-audio hooks for VAD interrupt
  const liveAbortRef        = useRef<AbortController | null>(null);
  const stopCurrentAudioRef = useRef<(() => void) | null>(null);

  // Deepgram streaming STT
  const dgTokenRef             = useRef<string>("");
  const dgWsRef                = useRef<WebSocket | null>(null);
  const streamingTranscriptRef = useRef<string>("");

  // Keeps interviewState and isRef in sync atomically
  const setIS = useCallback((s: InterviewState) => {
    isRef.current = s;
    setInterviewState(s);
  }, []);

  /* ── Session timer ──────────────────────────────────────────────────────── */

  useEffect(() => {
    sessionTimerRef.current = setInterval(() => setSessionSeconds((s) => s + 1), 1000);
    return () => clearInterval(sessionTimerRef.current!);
  }, []);

  useEffect(() => {
    if (sessionSeconds >= MAX_SESSION_SECONDS && !endedRef.current) handleEndSession();
  }, [sessionSeconds]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── End session ────────────────────────────────────────────────────────── */

  const MIN_SESSION_SECONDS = 0; // DEV: set to 20 * 60 before production

  const handleEndSession = useCallback(async () => {
    if (endedRef.current) return;
    endedRef.current = true;
    setIS("ended");
    clearInterval(sessionTimerRef.current!);
    if (vadFrameRef.current) cancelAnimationFrame(vadFrameRef.current);
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (maxRecordTimerRef.current) clearTimeout(maxRecordTimerRef.current);
    currentAudioRef.current?.pause();
    if (mediaRecorderRef.current?.state === "recording") mediaRecorderRef.current.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    try { audioContextRef.current?.close(); } catch {}

    const duration = sessionSeconds;
    await markSessionEnded(session.id, messagesRef.current, duration);

    if (duration < MIN_SESSION_SECONDS) {
      setSessionTooShort(true);
      setTimeout(() => router.push("/dashboard"), 4500);
      return;
    }

    router.push(`/report?sessionId=${session.id}`);
  }, [session.id, router, setIS, sessionSeconds]);

  /* ── ALEX speaks ────────────────────────────────────────────────────────── */

  const alexSpeak = useCallback(async (text: string, perf?: { turnStart: number; blobKb: number; upload: number; stt: number; llm: number }) => {
    setIS("processing");

    const handOff = () => {
      if (isRef.current === "ai_speaking" || isRef.current === "processing") {
        hasSpokeRef.current = false;
        setIS("user_speaking");
      }
    };

    const tTts = Date.now();
    try {
      const res = await fetch("/api/interview/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("TTS failed");

      const blob = await res.blob();
      const ttsMs = Date.now() - tTts;

      if (perf) {
        const totalMs = Date.now() - perf.turnStart;
        const panel = {
          turn: turnRef.current,
          blobKb: perf.blobKb,
          upload: perf.upload,
          stt: perf.stt,
          llm: perf.llm,
          tts: ttsMs,
          total: totalMs,
        };
        setLatencyPanel(panel);
        console.log(
          `\n┌─── TURN ${panel.turn} LATENCY ────────────────────┐\n` +
          `│  Audio blob  : ${panel.blobKb.toFixed(1)} KB\n` +
          `│  Upload      : ${panel.upload} ms\n` +
          `│  STT         : ${panel.stt} ms\n` +
          `│  LLM         : ${panel.llm} ms\n` +
          `│  TTS         : ${panel.tts} ms\n` +
          `│  ─────────────────────────────────\n` +
          `│  TOTAL       : ${panel.total} ms  (${(panel.total/1000).toFixed(2)}s)\n` +
          `└───────────────────────────────────────────┘`
        );
      } else {
        console.log(`[latency] TTS (intro): ${ttsMs}ms`);
      }

      const url = URL.createObjectURL(blob);
      currentAudioUrlRef.current = url;
      const audio = new Audio(url);
      currentAudioRef.current = audio;

      audio.addEventListener("play", () => setIS("ai_speaking"), { once: true });
      audio.addEventListener("ended", () => {
        currentAudioUrlRef.current = null;
        URL.revokeObjectURL(url);
        handOff();
      }, { once: true });
      audio.addEventListener("error", () => {
        currentAudioUrlRef.current = null;
        URL.revokeObjectURL(url);
        handOff();
      }, { once: true });

      await audio.play();
    } catch {
      handOff();
    }
  }, [setIS]);

  useEffect(() => { alexSpeakRef.current = alexSpeak; }, [alexSpeak]);

  /* ── Process user recording ─────────────────────────────────────────────── */
  // Pipeline: STT → LLM stream → sentence extractor → concurrent TTS fetches → ordered audio queue
  // Sentences start playing as soon as their TTS is ready, while the LLM is still generating.

  const handleRecordingDone = useCallback(async () => {
    if (silenceTimerRef.current)   { clearTimeout(silenceTimerRef.current); silenceTimerRef.current = null; }
    if (maxRecordTimerRef.current) { clearTimeout(maxRecordTimerRef.current); maxRecordTimerRef.current = null; }
    setUserSpeaking(false);
    if (endedRef.current) return;

    setIS("processing");
    const turnStart = Date.now();
    turnRef.current += 1;
    const turn = turnRef.current;

    // Per-turn AbortController — VAD interrupt aborts LLM stream + TTS fetches
    const abort = new AbortController();
    liveAbortRef.current = abort;

    const blob = new Blob(chunksRef.current, { type: "audio/webm" });
    const blobKb = blob.size / 1024;
    console.log(`[turn ${turn}] blob: ${blobKb.toFixed(1)} KB`);

    if (blob.size < MIN_BLOB_SIZE) {
      console.log(`[turn ${turn}] blob too small — back to listening`);
      hasSpokeRef.current = false;
      setIS("user_speaking");
      return;
    }

    try {
      // ── STT: close Deepgram WebSocket and collect streaming transcript ────
      const tStt = Date.now();
      const transcript = await new Promise<string>((resolve) => {
        const ws = dgWsRef.current;
        dgWsRef.current = null;

        if (!ws || ws.readyState === WebSocket.CLOSED || ws.readyState === WebSocket.CLOSING) {
          resolve(streamingTranscriptRef.current.trim());
          return;
        }

        // Wait for Deepgram to flush remaining final results then close
        const done = () => resolve(streamingTranscriptRef.current.trim());
        const timer = setTimeout(() => { try { ws.close(); } catch {} done(); }, 600);

        ws.onmessage = (e) => {
          try {
            const data = JSON.parse(e.data as string);
            if (data.type === "Results" && data.is_final) {
              const t = data.channel?.alternatives?.[0]?.transcript ?? "";
              if (t) streamingTranscriptRef.current += t + " ";
            }
          } catch {}
        };
        ws.onclose = () => { clearTimeout(timer); done(); };

        try {
          ws.send(JSON.stringify({ type: "CloseStream" }));
        } catch {
          clearTimeout(timer);
          try { ws.close(); } catch {}
          done();
        }
      });

      let finalTranscript = transcript;
      let sttMs = Date.now() - tStt;
      console.log(`[turn ${turn}] streaming STT: ${sttMs}ms → "${finalTranscript}"`);

      // Batch fallback: if streaming gave nothing (WebSocket failed/missed audio)
      if (!finalTranscript || finalTranscript.length < 3) {
        console.log(`[turn ${turn}] streaming empty — batch fallback`);
        const tBatch = Date.now();
        const fd = new FormData();
        fd.append("audio", blob, "recording.webm");
        const res = await fetch("/api/interview/transcribe", { method: "POST", body: fd, signal: abort.signal });
        const { text, whisperMs } = await res.json() as { text: string; whisperMs?: number };
        finalTranscript = text?.trim() ?? "";
        sttMs = whisperMs ?? (Date.now() - tBatch);
        console.log(`[turn ${turn}] batch fallback: ${sttMs}ms → "${finalTranscript}"`);
      }

      if (abort.signal.aborted) return;

      if (!finalTranscript || finalTranscript.length < 3) {
        hasSpokeRef.current = false;
        setIS("user_speaking");
        return;
      }

      const userMsg: Message = { role: "user", content: finalTranscript };
      const next = [...messagesRef.current, userMsg];
      setMessages(next);

      // ── Sentence-streaming pipeline ───────────────────────────────────────
      // urlQueue: ordered promises, each resolving to a blob URL (or null if aborted/failed)
      const urlQueue: Promise<string | null>[] = [];
      let streamDone  = false;
      let playerBusy  = false;
      let fullText    = "";
      let tFirstWord  = 0;

      // Fetch TTS for one sentence; runs concurrently across sentences
      const fetchSentenceTTS = async (sentence: string): Promise<string | null> => {
        try {
          const res = await fetch("/api/interview/speak", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: sentence }),
            signal: abort.signal,
          });
          if (!res.ok || abort.signal.aborted) return null;
          const audioBlob = await res.blob();
          return URL.createObjectURL(audioBlob);
        } catch {
          return null;
        }
      };

      // Play one URL; resolves when audio ends or is interrupted
      const playUrl = (url: string): Promise<void> =>
        new Promise((resolve) => {
          const audio = new Audio(url);
          currentAudioRef.current     = audio;
          currentAudioUrlRef.current  = url;
          stopCurrentAudioRef.current = () => { audio.pause(); resolve(); };

          audio.addEventListener("play", () => {
            if (!abort.signal.aborted) setIS("ai_speaking");
            if (!tFirstWord) {
              tFirstWord = Date.now();
              const toFirstWord = tFirstWord - turnStart;
              const ttsFirstMs  = toFirstWord - sttMs - llmFirstSentenceMs;
              console.log(`[turn ${turn}] ⚡ first word: ${toFirstWord}ms (stt:${sttMs} llm1st:${llmFirstSentenceMs} tts:${ttsFirstMs})`);
              setLatencyPanel({
                turn, blobKb,
                upload: sttMs,
                stt:    sttMs,
                llm:    llmFirstSentenceMs,
                tts:    ttsFirstMs,
                total:  toFirstWord,
              });
            }
          }, { once: true });
          audio.addEventListener("ended", () => {
            currentAudioRef.current     = null;
            currentAudioUrlRef.current  = null;
            stopCurrentAudioRef.current = null;
            URL.revokeObjectURL(url);
            resolve();
          }, { once: true });
          audio.addEventListener("error", () => {
            currentAudioRef.current     = null;
            stopCurrentAudioRef.current = null;
            URL.revokeObjectURL(url);
            resolve();
          }, { once: true });

          if (!abort.signal.aborted) audio.play().catch(() => resolve());
          else resolve();
        });

      // Drain the queue: plays sentences in order as their TTS resolves
      const drainQueue = async () => {
        if (playerBusy) return;
        playerBusy = true;

        while (urlQueue.length > 0 || !streamDone) {
          if (abort.signal.aborted) break;
          if (urlQueue.length === 0) {
            await new Promise((r) => setTimeout(r, 30)); // brief wait for next sentence
            continue;
          }
          const url = await urlQueue.shift()!;
          if (!url || abort.signal.aborted) continue;
          await playUrl(url);
        }

        playerBusy = false;

        if (!abort.signal.aborted && !endedRef.current) {
          hasSpokeRef.current = false;
          setIS("user_speaking");
        }
      };

      // Enqueue a sentence for concurrent TTS fetch + ordered playback
      const onSentence = (text: string) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        console.log(`[turn ${turn}] sentence → TTS: "${trimmed}"`);
        urlQueue.push(fetchSentenceTTS(trimmed));
        drainQueue(); // starts player if not already running (no-op if busy)
      };

      // ── LLM streaming ───────────────────────────────────────────────────
      const tLlm = Date.now();
      const llmRes = await fetch("/api/interview/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next,
          plan: session.interviewPlan,
          analysis: session.resumeAnalysis,
          difficulty: session.difficulty,
          company: session.targetCompany,
        }),
        signal: abort.signal,
      });

      const reader  = llmRes.body!.getReader();
      const decoder = new TextDecoder();
      let   sentBuf = "";
      let   llmFirstSentenceMs = 0;

      const flushSentences = (text: string, final: boolean): string => {
        if (final) {
          // At stream end, flush whatever is left
          if (text.trim()) {
            if (!llmFirstSentenceMs) llmFirstSentenceMs = Date.now() - tLlm;
            onSentence(text);
          }
          return "";
        }
        // Mid-stream: only extract sentences followed by actual whitespace.
        // A period at end-of-buffer might not be a sentence end (next chunk could be " more text").
        const regex = /(.+?[.!?])\s+/g;
        let match;
        let lastEnd = 0;
        while ((match = regex.exec(text)) !== null) {
          if (!llmFirstSentenceMs) {
            llmFirstSentenceMs = Date.now() - tLlm;
            console.log(`[turn ${turn}] LLM first sentence: ${llmFirstSentenceMs}ms`);
          }
          onSentence(match[1]);
          lastEnd = match.index + match[0].length;
        }
        return text.slice(lastEnd);
      };

      while (!abort.signal.aborted) {
        const { done, value } = await reader.read();
        if (done) {
          if (sentBuf.trim()) flushSentences(sentBuf, true); // flush remainder
          streamDone = true;
          console.log(`[turn ${turn}] LLM total: ${Date.now() - tLlm}ms | text: "${fullText.trim()}"`);
          break;
        }
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        sentBuf  += chunk;
        sentBuf   = flushSentences(sentBuf, false);
      }

      // Store full response in message history
      if (fullText.trim()) {
        setMessages((prev) => [...prev, { role: "assistant", content: fullText.trim() }]);
      }

    } catch (err) {
      if ((err as Error)?.name !== "AbortError") {
        console.error(`[turn ${turn}] pipeline error:`, err);
        hasSpokeRef.current = false;
        setIS("user_speaking");
      }
    }
  }, [session, setIS]);

  useEffect(() => { handleRecordingDoneRef.current = handleRecordingDone; }, [handleRecordingDone]);

  /* ── Always-on VAD ──────────────────────────────────────────────────────── */
  // Single rAF loop for the entire session. Two modes:
  //   user_speaking  — light threshold, 4 frames  → start recording
  //   ai_speaking    — higher threshold, 8 frames, 900ms grace → interrupt ALEX
  //
  // KEY: localFrames resets to 0 whenever state is NOT canAct (processing/loading/etc.)
  // This prevents stale frame counts from triggering an instant interrupt the moment
  // ai_speaking begins (which was the root cause of ALEX never being heard).

  const startContinuousVAD = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser || endedRef.current) return;

    const bufSize = analyser.fftSize;
    const tdData  = new Uint8Array(bufSize);
    let localFrames       = 0;
    let prevCanAct        = false;
    let alexSpeakStart    = 0; // timestamp when ai_speaking last began

    const tick = () => {
      if (endedRef.current) return;

      analyser.getByteTimeDomainData(tdData);
      let sum = 0;
      for (let i = 0; i < bufSize; i++) {
        const v = (tdData[i] - 128) / 128;
        sum += v * v;
      }
      const rms    = Math.sqrt(sum / bufSize);
      const iState = isRef.current;
      const canAct = iState === "ai_speaking" || iState === "user_speaking";

      // When transitioning INTO ai_speaking, stamp the start time
      if (iState === "ai_speaking" && prevCanAct === false) {
        alexSpeakStart = Date.now();
        console.log("[vad] ai_speaking started — grace period begins");
      }

      // When leaving a canAct state (e.g., ai_speaking → processing), reset frame count.
      // Without this, frames accumulated during processing would instantly trigger on re-entry.
      if (!canAct && prevCanAct) localFrames = 0;
      prevCanAct = canAct;

      // During ai_speaking: higher threshold + require grace period to have elapsed
      const isInterrupt  = iState === "ai_speaking";
      const threshold    = isInterrupt ? INTERRUPT_RMS_THRESHOLD : RMS_THRESHOLD;
      const framesNeeded = isInterrupt ? INTERRUPT_FRAMES_NEEDED : SPEAK_FRAMES_NEEDED;
      const graceOk      = !isInterrupt || (Date.now() - alexSpeakStart > INTERRUPT_GRACE_MS);
      const loud         = rms > threshold;

      // Throttled debug log
      const now = Date.now();
      if (now - lastLogRef.current > 500 && canAct) {
        lastLogRef.current = now;
        setDebugRms(Math.round(rms * 100));
        console.log(
          `[vad] rms=${rms.toFixed(4)} thr=${threshold} frames=${localFrames}/${framesNeeded}` +
          ` grace=${graceOk} rec=${isRecordingRef.current} state=${iState}`
        );
      }

      if (loud && canAct) {
        localFrames = Math.min(localFrames + 1, framesNeeded + 5);
      } else if (!canAct) {
        localFrames = 0;
      } else {
        if (localFrames > 0) localFrames--;
      }

      // Trigger: enough sustained loud frames AND grace period elapsed AND not already recording
      if (localFrames >= framesNeeded && canAct && graceOk && !isRecordingRef.current) {
        console.log(`[vad] trigger — ${isInterrupt ? "INTERRUPT" : "START RECORDING"}`);
        localFrames = 0; // reset so we don't re-trigger immediately

        if (isInterrupt) {
          // Abort the whole turn: LLM stream + pending TTS fetches + audio queue
          liveAbortRef.current?.abort();
          // Stop the currently playing sentence (resolves playUrl promise → drainQueue exits)
          if (stopCurrentAudioRef.current) {
            stopCurrentAudioRef.current();
            stopCurrentAudioRef.current = null;
          } else if (currentAudioRef.current) {
            currentAudioRef.current.pause();
          }
          currentAudioRef.current = null;
          if (currentAudioUrlRef.current) {
            URL.revokeObjectURL(currentAudioUrlRef.current);
            currentAudioUrlRef.current = null;
          }
        }

        if (streamRef.current) {
          hasSpokeRef.current          = false;
          chunksRef.current            = [];
          streamingTranscriptRef.current = "";
          isRecordingRef.current       = true;
          isRef.current                = "user_speaking";
          setInterviewState("user_speaking");

          // Open Deepgram streaming WebSocket.
          // Auth via subprotocol (browser WebSocket API can't set Authorization header).
          // Chunks are buffered until the socket is open so the WebM header is never missed.
          const pendingChunks: Blob[] = [];
          if (dgTokenRef.current) {
            try {
              if (dgWsRef.current && dgWsRef.current.readyState !== WebSocket.CLOSED) {
                dgWsRef.current.close();
              }
              const ws = new WebSocket(
                `wss://api.deepgram.com/v1/listen` +
                `?model=nova-2&language=en&smart_format=true&interim_results=true`,
                ["token", dgTokenRef.current]
              );
              dgWsRef.current = ws;

              ws.onopen = () => {
                console.log("[dg-ws] open — flushing", pendingChunks.length, "buffered chunks");
                pendingChunks.forEach((c) => ws.send(c));
                pendingChunks.length = 0;
              };
              ws.onmessage = (e) => {
                try {
                  const data = JSON.parse(e.data as string);
                  if (data.type === "Results" && data.is_final) {
                    const t = data.channel?.alternatives?.[0]?.transcript ?? "";
                    if (t) {
                      streamingTranscriptRef.current += t + " ";
                      console.log(`[dg-ws] final: "${t}"`);
                    }
                  }
                } catch {}
              };
              ws.onerror = (ev) => console.warn("[dg-ws] error:", ev);
              ws.onclose = (ev) => console.log(`[dg-ws] closed: ${ev.code} ${ev.reason}`);
            } catch (err) {
              console.warn("[dg-ws] failed to open:", err);
            }
          }

          const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
            ? "audio/webm;codecs=opus" : "audio/webm";
          const mr = new MediaRecorder(streamRef.current, { mimeType });
          mr.ondataavailable = (e) => {
            if (e.data.size > 0) {
              chunksRef.current.push(e.data);
              const ws = dgWsRef.current;
              if (ws) {
                if (ws.readyState === WebSocket.OPEN) {
                  ws.send(e.data);
                } else if (ws.readyState === WebSocket.CONNECTING) {
                  pendingChunks.push(e.data); // will be flushed in onopen
                }
              }
            }
          };
          mr.onstop = () => {
            isRecordingRef.current = false;
            handleRecordingDoneRef.current?.();
          };
          mr.start(100);
          mediaRecorderRef.current = mr;

          if (maxRecordTimerRef.current) clearTimeout(maxRecordTimerRef.current);
          maxRecordTimerRef.current = setTimeout(() => {
            if (mediaRecorderRef.current?.state === "recording") mediaRecorderRef.current.stop();
          }, MAX_RECORD_MS);
        }
      }

      // Visual feedback and silence detection
      if (loud && canAct) {
        setUserSpeaking(true);
        hasSpokeRef.current = true;
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }
      } else if (isRecordingRef.current) {
        setUserSpeaking(false);
        if (hasSpokeRef.current && !silenceTimerRef.current) {
          silenceTimerRef.current = setTimeout(() => {
            silenceTimerRef.current = null;
            if (mediaRecorderRef.current?.state === "recording") mediaRecorderRef.current.stop();
          }, SILENCE_DURATION_MS);
        }
      } else {
        setUserSpeaking(false);
      }

      vadFrameRef.current = requestAnimationFrame(tick);
    };

    vadFrameRef.current = requestAnimationFrame(tick);
  }, []);

  /* ── Begin Interview ─────────────────────────────────────────────────────── */

  const handleStart = useCallback(async () => {
    endedRef.current = false; // React Strict Mode cleanup sets this to true on fake-unmount
    setStartError(null);
    let ctx: AudioContext | null = null;

    try {
      // Step 1: AudioContext BEFORE getUserMedia — must happen while click is still active.
      // getUserMedia shows a dialog; by the time the user clicks "Allow" the ~5s transient
      // user-activation window can expire, leaving AudioContext permanently suspended.
      ctx = new AudioContext();
      audioContextRef.current = ctx;
      if (ctx.state !== "running") await ctx.resume();
      console.log("[audio] AudioContext:", ctx.state);

      // Step 2: mic permission (async — activation may expire here, that's OK now)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;

      // Step 3: wire stream into the already-running AudioContext
      const source   = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);

      // Chrome only evaluates nodes that reach ctx.destination.
      // Muted gain node = data flows through graph, nothing audible through speakers.
      const silentGain = ctx.createGain();
      silentGain.gain.value = 0;
      analyser.connect(silentGain);
      silentGain.connect(ctx.destination);

      analyserRef.current = analyser;
      console.log("[audio] analyser ready, ctx:", ctx.state);

      // Step 4: pre-fetch Deepgram token for streaming STT WebSocket
      try {
        const { key } = await fetch("/api/interview/stt-token").then(r => r.json()) as { key: string };
        dgTokenRef.current = key;
        console.log("[stt] Deepgram token ready");
      } catch {
        console.warn("[stt] failed to fetch Deepgram token — will fall back to batch");
      }

      // Step 5: start the always-on VAD (runs for the entire session)
      startContinuousVAD();

      // Step 5: kick off the interview
      setIS("loading");
      const company   = session.targetCompany ?? "a top technology company";
      const firstName = session.resumeAnalysis?.name?.split(" ")[0] ?? "";
      const openingQ  = session.interviewPlan?.openingQuestion ?? "Tell me about yourself.";
      const intro = `Hi${firstName ? ` ${firstName}` : ""}, I'm Alex, a senior interviewer at ${company}. I've reviewed your resume and I'm ready to begin. ${openingQ}`;
      setMessages([{ role: "assistant", content: intro }]);
      alexSpeakRef.current?.(intro);
    } catch (err) {
      ctx?.close();
      audioContextRef.current = null;
      console.error("[audio] handleStart error:", err);
      setStartError("Could not access microphone. Please allow microphone access and try again.");
    }
  }, [session, setIS, startContinuousVAD]);

  /* ── Cleanup ────────────────────────────────────────────────────────────── */

  useEffect(() => {
    return () => {
      endedRef.current = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (vadFrameRef.current) cancelAnimationFrame(vadFrameRef.current);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (maxRecordTimerRef.current) clearTimeout(maxRecordTimerRef.current);
      try { audioContextRef.current?.close(); } catch {}
    };
  }, []);

  /* ── Derived UI ─────────────────────────────────────────────────────────── */

  const alexFaceState =
    interviewState === "ai_speaking" ? "speaking" :
    interviewState === "processing"  ? "transitioning" : "listening";

  const statusLabel: { dot: string | null; label: string } =
    interviewState === "ai_speaking"    ? { dot: "#A78BFA", label: "SPEAKING" } :
    interviewState === "processing"     ? { dot: null,      label: "PROCESSING..." } :
    interviewState === "loading"        ? { dot: null,      label: "LOADING..." } :
    interviewState === "awaiting_start" ? { dot: null,      label: "" } :
                                          { dot: "#22D3EE", label: "LISTENING" };

  return (
    <div style={{ position: "relative", zIndex: 10, height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>

      {sessionTooShort && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: "rgba(4,0,16,0.97)", backdropFilter: "blur(8px)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: "16px", padding: "24px",
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.75rem",
          }}>
            ⏱
          </div>
          <h2 style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "1.5rem", fontWeight: 700, color: "#fff", margin: 0 }}>
            Session Too Short
          </h2>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "#94A3B8", textAlign: "center", maxWidth: 380, margin: 0, lineHeight: 1.65 }}>
            A minimum of <strong style={{ color: "#fff" }}>20 minutes</strong> of interview is required to generate a meaningful report. This session ran for {Math.floor(sessionSeconds / 60)} min {sessionSeconds % 60}s.
          </p>
          <p style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "11px", color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Returning to dashboard...
          </p>
        </div>
      )}

      {interviewState === "awaiting_start" && (
        <BeginOverlay onStart={handleStart} error={startError} />
      )}

      <TopBar onEndSession={handleEndSession} sessionSeconds={sessionSeconds} />

      {/* ALEX */}
      <div style={{ flex: "0 0 58vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", paddingTop: "56px" }}>
        <AlexAvatar state={alexFaceState} />
        <p className="font-label" style={{ fontSize: "11px", color: "#CBD5E1" }}>ALEX · AI INTERVIEWER</p>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {statusLabel.dot && (
            <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
              style={{ width: 7, height: 7, borderRadius: "50%", background: statusLabel.dot }} />
          )}
          {statusLabel.label && (
            <span className="font-label" style={{ fontSize: "11px", color: statusLabel.dot ?? "#64748B" }}>
              {statusLabel.label}
            </span>
          )}
        </div>
        <Waveform bars={36} colors={ALEX_COLORS} active={interviewState === "ai_speaking"} maxWidth={400} height={52} />
      </div>

      <div style={{ height: "1px", background: "linear-gradient(to right, transparent, rgba(139,92,246,0.2), rgba(6,182,212,0.2), transparent)", flexShrink: 0 }} />

      {/* User */}
      <div style={{ flex: "0 0 42vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px" }}>
        <UserAvatar speaking={userSpeaking} />
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "4px" }}>
          <p className="font-label" style={{ fontSize: "11px", color: "#CBD5E1" }}>YOU</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
            <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2.5, repeat: Infinity }}
              style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(34,211,238,0.7)" }} />
            <span className="font-label" style={{ fontSize: "11px", color: "rgba(34,211,238,0.7)" }}>
              {interviewState === "ai_speaking" ? "INTERRUPT ANYTIME — JUST SPEAK" : "ALWAYS LISTENING"}
            </span>
          </div>
          {(interviewState === "user_speaking" || interviewState === "ai_speaking") && (
            <span className="font-label" style={{ fontSize: "10px", color: "#64748B" }}>
              mic: {debugRms} / 100
            </span>
          )}
        </div>
        <Waveform bars={28} colors={USER_COLORS} active={userSpeaking} quiet={interviewState === "user_speaking"} maxWidth={320} height={40} />
      </div>

      {/* ── Latency debug panel ── */}
      {latencyPanel && (
        <div style={{
          position: "fixed", bottom: 16, right: 16, zIndex: 100,
          background: "rgba(4,0,16,0.92)", border: "1px solid rgba(124,58,237,0.3)",
          borderRadius: "10px", padding: "12px 16px", fontFamily: "var(--font-jetbrains)",
          fontSize: "11px", color: "#94A3B8", lineHeight: 1.7, minWidth: 210,
          backdropFilter: "blur(16px)",
        }}>
          <div style={{ color: "#A78BFA", fontWeight: 700, marginBottom: 4 }}>
            TURN {latencyPanel.turn} LATENCY
          </div>
          <div>blob&nbsp;&nbsp;&nbsp;&nbsp;{latencyPanel.blobKb.toFixed(1)} KB</div>
          <div>upload&nbsp;&nbsp;{latencyPanel.upload} ms</div>
          <div>whisper&nbsp;{latencyPanel.stt} ms</div>
          <div>llm&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{latencyPanel.llm} ms</div>
          <div>tts&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{latencyPanel.tts} ms</div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: 6, paddingTop: 6, color: "#22D3EE", fontWeight: 700 }}>
            total&nbsp;&nbsp;&nbsp;{latencyPanel.total} ms
          </div>
        </div>
      )}
    </div>
  );
}
