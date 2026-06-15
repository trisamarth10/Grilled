"use client";

import { useMemo, useState, useEffect } from "react";
import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import { GoogleSignInButton } from "@/components/ui/GoogleSignInButton";

/* ─── Shared ─────────────────────────────────────────────────────────────────── */

function Divider() {
  return (
    <div
      style={{
        maxWidth: "768px",
        margin: "0 auto",
        height: "1px",
        background: "rgba(255,255,255,0.08)",
      }}
    />
  );
}

const SECTION: CSSProperties = {
  maxWidth: "1024px",
  margin: "0 auto",
  padding: "80px 48px",
  minHeight: "70vh",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "80px",
  alignItems: "center",
};

/* ─── Feature 1 visual — animated DFS tree ───────────────────────────────────── */

function DFSTree() {
  const lines = [
    { d: "M170,44 L57,112", delay: 0.2 },
    { d: "M170,44 L170,112", delay: 0.4 },
    { d: "M170,44 L285,112", delay: 0.6 },
    { d: "M285,142 L285,202", delay: 0.9 },
  ];

  const nodes = [
    { x: 110, y: 12, w: 120, h: 32, rx: 16, label: "Your Project", danger: false, delay: 0.1 },
    { x: 10,  y: 112, w: 94, h: 30, rx: 15, label: "Architecture",  danger: false, delay: 0.4 },
    { x: 122, y: 112, w: 96, h: 30, rx: 15, label: "Trade-offs",    danger: false, delay: 0.6 },
    { x: 240, y: 112, w: 90, h: 30, rx: 15, label: "Edge Cases",    danger: true,  delay: 0.8 },
    { x: 237, y: 202, w: 96, h: 30, rx: 15, label: "Failure Modes", danger: true,  delay: 1.1 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true, margin: "-80px" }}
      style={{ width: "100%", maxWidth: "360px", margin: "0 auto" }}
    >
      <svg viewBox="0 0 340 248" style={{ width: "100%", overflow: "visible" }}>
        <defs>
          <filter id="danger-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Connector lines */}
        {lines.map((line, i) => (
          <motion.path
            key={i}
            d={line.d}
            fill="none"
            stroke="rgba(139,92,246,0.35)"
            strokeWidth={1.5}
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: line.delay }}
            viewport={{ once: true, margin: "-80px" }}
          />
        ))}

        {/* Nodes */}
        {nodes.map((node, i) => {
          const cx = node.x + node.w / 2;
          const cy = node.y + node.h / 2;
          return (
            <motion.g
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: node.delay }}
              viewport={{ once: true, margin: "-80px" }}
              style={{ transformOrigin: `${cx}px ${cy}px` }}
            >
              {/* Pulsing glow behind danger nodes */}
              {node.danger && (
                <motion.rect
                  x={node.x - 7} y={node.y - 7}
                  width={node.w + 14} height={node.h + 14}
                  rx={node.rx + 5}
                  fill="rgba(239,68,68,0.22)"
                  filter="url(#danger-glow)"
                  animate={{ opacity: [0.35, 0.9, 0.35] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
              <rect
                x={node.x} y={node.y}
                width={node.w} height={node.h}
                rx={node.rx}
                fill={node.danger ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.03)"}
                stroke={node.danger ? "rgba(239,68,68,0.6)" : "rgba(139,92,246,0.3)"}
                strokeWidth={1}
              />
              <text
                x={cx} y={cy + 4}
                textAnchor="middle"
                style={{
                  fill: node.danger ? "#FCA5A5" : "#CBD5E1",
                  fontSize: "10px",
                  fontFamily: "var(--font-jetbrains-mono)",
                  letterSpacing: "0.05em",
                }}
              >
                {node.label}
              </text>
            </motion.g>
          );
        })}
      </svg>
    </motion.div>
  );
}

/* ─── Question typewriter card ───────────────────────────────────────────────── */

const QUESTION_FULL = "Tell me about the architectural trade-offs you considered when designing the caching layer. Why that approach over the alternatives?";

function QuestionCard() {
  const [visible, setVisible] = useState(false);
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!visible) return;
    if (displayed.length < QUESTION_FULL.length) {
      const t = setTimeout(() => setDisplayed(QUESTION_FULL.slice(0, displayed.length + 1)), 28);
      return () => clearTimeout(t);
    }
  }, [visible, displayed]);

  return (
    <motion.div
      onViewportEnter={() => setVisible(true)}
      viewport={{ once: true, margin: "-60px" }}
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(139,92,246,0.18)",
        borderRadius: "12px", padding: "20px", backdropFilter: "blur(8px)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
        <motion.div
          animate={{ opacity: [1, 0.35, 1] }}
          transition={{ duration: 1.4, repeat: Infinity }}
          style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#A78BFA" }}
        />
        <span className="font-label" style={{ fontSize: "10px", color: "#A78BFA" }}>Alex is asking</span>
      </div>
      <p style={{ fontSize: "0.875rem", color: "#CBD5E1", lineHeight: 1.65, fontFamily: "var(--font-inter)", fontWeight: 300, margin: 0 }}>
        &ldquo;{displayed}
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.9, repeat: Infinity }}
          style={{ display: "inline-block", width: "8px", height: "0.9em", background: "#22D3EE", marginLeft: "2px", verticalAlign: "middle", borderRadius: "1px" }}
        />
      </p>
    </motion.div>
  );
}

/* ─── Feature 2 visual — waveform + question card + stat pills ───────────────── */

function WaveformVisual() {
  const bars = useMemo(
    () =>
      Array.from({ length: 32 }, (_, i) => {
        const t = i / 31;
        const r = Math.round(124 + (236 - 124) * t);
        const g = Math.round(58 + (72 - 58) * t);
        const b = Math.round(237 + (153 - 237) * t);
        return {
          color: `rgb(${r},${g},${b})`,
          h1: 10 + Math.random() * 58,
          h2: 10 + Math.random() * 58,
          h3: 10 + Math.random() * 58,
          duration: 0.7 + Math.random() * 0.7,
          delay: Math.random() * 0.5,
        };
      }),
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true, margin: "-80px" }}
      style={{ display: "flex", flexDirection: "column", gap: "20px" }}
    >
      {/* Animated bars */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "3px",
          height: "80px",
        }}
      >
        {bars.map((bar, i) => (
          <motion.div
            key={i}
            animate={{ height: [bar.h1, bar.h2, bar.h3, bar.h1] }}
            transition={{
              duration: bar.duration,
              delay: bar.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              flex: 1,
              background: bar.color,
              borderRadius: "2px",
              minWidth: "3px",
            }}
          />
        ))}
      </div>

      {/* Question card with typewriter */}
      <QuestionCard />

      {/* Stat pills */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {["< 200ms latency", "99.2% accuracy", "real-time follow-ups"].map((label, i) => (
          <span
            key={i}
            className="font-label"
            style={{
              fontSize: "10px",
              color: "#67E8F9",
              background: "rgba(6,182,212,0.08)",
              border: "1px solid rgba(6,182,212,0.2)",
              borderRadius: "9999px",
              padding: "4px 12px",
            }}
          >
            {label}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Feature 3 visual — score bars ──────────────────────────────────────────── */

const SCORES = [
  { label: "BEHAVIORAL CLARITY",  score: 84, feedback: "Concrete answers with strong STAR structure throughout" },
  { label: "COMMUNICATION",       score: 78, feedback: "Clear explanations, occasional over-qualification" },
  { label: "TECHNICAL DEPTH",     score: 71, feedback: "Strong fundamentals, gaps in distributed systems" },
  { label: "STRUCTURED THINKING", score: 89, feedback: "Logical, well-paced, handled ambiguity well" },
];

function ScoreBarsVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true, margin: "-80px" }}
      style={{ display: "flex", flexDirection: "column", gap: "22px" }}
    >
      {SCORES.map((cat, i) => (
        <div key={i}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px" }}>
            <span className="font-label" style={{ fontSize: "10px", color: "#A78BFA" }}>
              {cat.label}
            </span>
            <span className="font-label" style={{ fontSize: "12px", color: "#ffffff" }}>
              {cat.score}
            </span>
          </div>
          <div
            style={{
              height: "6px",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "9999px",
              overflow: "hidden",
              marginBottom: "6px",
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${cat.score}%` }}
              transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
              viewport={{ once: true, margin: "-80px" }}
              style={{
                height: "100%",
                background: "linear-gradient(to right, #7C3AED, #06B6D4)",
                borderRadius: "9999px",
              }}
            />
          </div>
          <p
            style={{
              fontSize: "0.8125rem",
              color: "#64748B",
              fontFamily: "var(--font-inter)",
              fontWeight: 300,
              margin: 0,
            }}
          >
            {cat.feedback}
          </p>
        </div>
      ))}
    </motion.div>
  );
}

/* ─── Text columns ───────────────────────────────────────────────────────────── */

function TextColumn({
  label,
  labelColor,
  heading,
  body,
  bullets,
  bulletColor,
  fromLeft,
}: {
  label: string;
  labelColor: string;
  heading: string;
  body: string;
  bullets: string[];
  bulletColor: string;
  fromLeft: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: fromLeft ? -24 : 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true, margin: "-80px" }}
    >
      <p className="font-label" style={{ fontSize: "11px", color: labelColor, marginBottom: "16px" }}>
        {label}
      </p>
      <h2
        className="font-display"
        style={{
          fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
          fontWeight: 700,
          color: "#ffffff",
          lineHeight: 1.15,
          marginBottom: "16px",
        }}
        dangerouslySetInnerHTML={{ __html: heading }}
      />
      <p
        style={{
          fontSize: "0.9375rem",
          color: "#CBD5E1",
          lineHeight: 1.7,
          fontFamily: "var(--font-inter)",
          fontWeight: 300,
          marginBottom: "20px",
        }}
      >
        {body}
      </p>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
        {bullets.map((item, i) => (
          <li
            key={i}
            style={{ display: "flex", alignItems: "flex-start", gap: "10px", color: "#CBD5E1", fontSize: "0.9375rem", lineHeight: 1.6 }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: bulletColor,
                marginTop: "8px",
                flexShrink: 0,
              }}
            />
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/* ─── Final CTA ──────────────────────────────────────────────────────────────── */

function FinalCTA() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true, margin: "-80px" }}
      style={{ textAlign: "center", padding: "120px 24px", position: "relative", zIndex: 10 }}
    >
      <h2
        className="font-display"
        style={{ fontSize: "clamp(2rem, 5vw, 4rem)", fontWeight: 800, color: "#ffffff", marginBottom: "40px" }}
      >
        Ready to get grilled?
      </h2>
      <div>
        <GoogleSignInButton />
        <p className="font-label" style={{ fontSize: "11px", color: "#64748B", marginTop: "20px" }}>
          No DSA &nbsp;·&nbsp; No prep required &nbsp;·&nbsp; Just your resume
        </p>
      </div>
    </motion.section>
  );
}

/* ─── FeatureSections ────────────────────────────────────────────────────────── */

export function FeatureSections() {
  return (
    <div style={{ position: "relative", zIndex: 10 }}>
      {/* Feature 1 — DFS Questioning: text left, tree right */}
      <Divider />
      <div style={SECTION}>
        <TextColumn
          label="How It Works"
          labelColor="#8B5CF6"
          heading="DFS-Style Questioning"
          body="Most tools cycle through questions. ALEX goes depth-first. Every answer opens a new branch — drilling into your reasoning, trade-offs, and the limits of your knowledge before moving on."
          bullets={[
            "Goes deep before going wide — exactly like real interviewers",
            "Every claim on your resume becomes a potential branch point",
            "Probes until it can confidently assess your actual depth",
          ]}
          bulletColor="#8B5CF6"
          fromLeft
        />
        <DFSTree />
      </div>

      {/* Feature 2 — Voice Engine: waveform left, text right */}
      <Divider />
      <div style={SECTION}>
        <WaveformVisual />
        <TextColumn
          label="Voice Engine"
          labelColor="#06B6D4"
          heading="Voice-First.<br/>Real Pressure."
          body="No typing. No clicking. Just talk. ALEX listens continuously, responds in under two seconds, and handles interruptions naturally — the closest thing to being in the room."
          bullets={[
            "No push-to-talk button — your mic is always on",
            "Interrupt mid-sentence and the session adapts instantly",
            "Natural silence handling without awkward dead air",
          ]}
          bulletColor="#06B6D4"
          fromLeft={false}
        />
      </div>

      {/* Feature 3 — Report Card: text left, scores right */}
      <Divider />
      <div style={SECTION}>
        <TextColumn
          label="After Every Session"
          labelColor="#EC4899"
          heading="Your Report Card,<br/>Instantly."
          body="When the session ends, ALEX switches from interviewer to hiring committee. Six scored dimensions, specific written feedback on what you said, and a final recommendation."
          bullets={[
            "Six scored categories with AI-written feedback per dimension",
            "Hire, Lean Hire, Lean No Hire, or No Hire recommendation",
            "Download as PDF or revisit any past session from your dashboard",
          ]}
          bulletColor="#EC4899"
          fromLeft
        />
        <ScoreBarsVisual />
      </div>

      {/* Final CTA */}
      <Divider />
      <FinalCTA />
    </div>
  );
}
