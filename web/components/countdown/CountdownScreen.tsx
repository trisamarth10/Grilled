"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const TOTAL = 10;
const RADIUS = 124;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/* ─── Ambient particles ──────────────────────────────────────────────────────── */

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

const PARTICLE_COLORS = ["#A78BFA", "#22D3EE", "#FFFFFF"];

function AmbientParticles() {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 2,
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      duration: 1.5 + Math.random() * 2,
      delay: Math.random() * 3,
    }));
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1 }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          animate={{ opacity: [0.1, 0.6, 0.1] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: p.color,
          }}
        />
      ))}
    </div>
  );
}

/* ─── SVG ring ───────────────────────────────────────────────────────────────── */

function CountdownRing({ seconds, warning }: { seconds: number; warning: boolean }) {
  const progress = seconds / TOTAL;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <svg width="280" height="280" viewBox="0 0 280 280" style={{ transform: "rotate(-90deg)" }}>
      <defs>
        <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
        <filter id="ring-glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Track */}
      <circle
        cx="140" cy="140" r={RADIUS}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="6"
      />

      {/* Glow ring */}
      <circle
        cx="140" cy="140" r={RADIUS}
        fill="none"
        stroke={warning ? "#EF4444" : "url(#ring-grad)"}
        strokeWidth="24"
        strokeOpacity="0.25"
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={dashOffset}
        filter="url(#ring-glow)"
        style={{ transition: "stroke-dashoffset 1.2s ease-out, stroke 0.4s ease" }}
      />

      {/* Active arc */}
      <circle
        cx="140" cy="140" r={RADIUS}
        fill="none"
        stroke={warning ? "#EF4444" : "url(#ring-grad)"}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={dashOffset}
        style={{ transition: "stroke-dashoffset 1.2s ease-out, stroke 0.4s ease" }}
      />
    </svg>
  );
}

/* ─── Main screen ────────────────────────────────────────────────────────────── */

export function CountdownScreen({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [seconds, setSeconds] = useState(TOTAL);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const warning = seconds <= 15;

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSeconds((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, []);

  useEffect(() => {
    if (seconds === 0) {
      clearInterval(intervalRef.current!);
      router.push(`/interview?sessionId=${sessionId}`);
    }
  }, [seconds, sessionId, router]);

  return (
    <main
      style={{
        position: "relative",
        zIndex: 10,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "48px",
      }}
    >
      <AmbientParticles />

      {/* GET READY label */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="font-label"
        style={{ fontSize: "12px", color: "#CBD5E1", letterSpacing: "0.2em" }}
      >
        GET READY
      </motion.p>

      {/* Ring + center text */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{ position: "relative", width: 280, height: 280 }}
      >
        <CountdownRing seconds={seconds} warning={warning} />

        {/* Center content */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
          }}
        >
          <span
            className="font-label"
            style={{
              fontSize: "96px",
              fontWeight: 700,
              lineHeight: 1,
              color: warning ? "#EF4444" : "transparent",
              background: warning ? "none" : "linear-gradient(135deg, #7C3AED, #06B6D4)",
              WebkitBackgroundClip: warning ? "unset" : "text",
              WebkitTextFillColor: warning ? "#EF4444" : "transparent",
              transition: "color 0.4s, -webkit-text-fill-color 0.4s",
            }}
          >
            {seconds}
          </span>
          <span
            className="font-label"
            style={{ fontSize: "11px", color: "#64748B" }}
          >
            seconds remaining
          </span>
        </div>
      </motion.div>

      {/* ALEX card */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "12px 24px",
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(139,92,246,0.15)",
          borderRadius: "9999px",
          backdropFilter: "blur(16px)",
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            fontWeight: 700,
            color: "#ffffff",
            fontFamily: "var(--font-space-grotesk)",
            flexShrink: 0,
          }}
        >
          A
        </div>
        <span
          style={{
            fontSize: "14px",
            fontWeight: 500,
            color: "#ffffff",
            fontFamily: "var(--font-inter)",
          }}
        >
          Alex · AI Interviewer
        </span>
      </motion.div>
    </main>
  );
}
