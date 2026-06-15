"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GoogleSignInButton } from "@/components/ui/GoogleSignInButton";

/* ─── Typewriter ─────────────────────────────────────────────────────────────── */

const PHRASES = [
  "45-minute AI-powered interviews that feel like the real thing.",
  "Questions that adapt depth-first through your knowledge.",
  "Your weaknesses, found. Your strengths, confirmed.",
];

function TypewriterSubtitle() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const target = PHRASES[phraseIndex];
    if (isPaused) {
      const t = setTimeout(() => { setIsPaused(false); setIsDeleting(true); }, 3000);
      return () => clearTimeout(t);
    }
    if (!isDeleting) {
      if (displayed.length < target.length) {
        const t = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 50);
        return () => clearTimeout(t);
      }
      setIsPaused(true);
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 30);
        return () => clearTimeout(t);
      }
      setIsDeleting(false);
      setPhraseIndex((i) => (i + 1) % PHRASES.length);
    }
  }, [displayed, isDeleting, isPaused, phraseIndex]);

  return (
    <p style={{
      fontSize: "1.125rem", fontWeight: 300, color: "#CBD5E1",
      display: "flex", alignItems: "center", justifyContent: "center",
      minHeight: "1.75rem", fontFamily: "var(--font-inter)",
    }}>
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        style={{
          display: "inline-block", width: "10px", height: "1.1em",
          background: "#22D3EE", marginLeft: "3px", verticalAlign: "middle", borderRadius: "1px",
        }}
      />
    </p>
  );
}

/* ─── Badge ──────────────────────────────────────────────────────────────────── */

function HeroBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      style={{
        display: "inline-flex", alignItems: "center", gap: "8px",
        background: "rgba(255,255,255,0.04)",
        backgroundImage: "linear-gradient(rgba(4,0,16,0.9), rgba(4,0,16,0.9))",
        border: "1px solid rgba(139,92,246,0.35)",
        borderRadius: "9999px", padding: "6px 16px", marginBottom: "32px",
        boxShadow: "0 0 16px rgba(124,58,237,0.12), inset 0 0 12px rgba(124,58,237,0.04)",
      }}
    >
      <motion.span
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#06B6D4", display: "inline-block", flexShrink: 0 }}
      />
      <span className="font-label" style={{ fontSize: "11px", color: "#CBD5E1" }}>
        AI Interview Engine
      </span>
    </motion.div>
  );
}

/* ─── Stats Row ──────────────────────────────────────────────────────────────── */

const STATS = [
  { value: "45", suffix: " min", label: "Real interview sessions" },
  { value: "< 2s", suffix: "", label: "AI response time" },
  { value: "6", suffix: "", label: "Scored dimensions" },
];

function StatsRow() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.7 }}
      style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginTop: "16px" }}
    >
      {STATS.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 + i * 0.1 }}
          whileHover={{ y: -2, borderColor: "rgba(139,92,246,0.4)" }}
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "12px", padding: "14px 22px", textAlign: "center",
            backdropFilter: "blur(8px)", transition: "border-color 0.2s, transform 0.2s",
            cursor: "default",
          }}
        >
          <div style={{
            fontFamily: "var(--font-jetbrains-mono)", fontSize: "1.375rem", fontWeight: 700,
            background: "linear-gradient(135deg, #8B5CF6, #22D3EE)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            {stat.value}<span style={{ fontSize: "0.8rem" }}>{stat.suffix}</span>
          </div>
          <div className="font-label" style={{ fontSize: "9px", color: "#475569", marginTop: "3px" }}>
            {stat.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ─── Company Marquee ────────────────────────────────────────────────────────── */

const COMPANIES = [
  "Google", "Meta", "Stripe", "Databricks", "Amazon", "Airbnb",
  "Netflix", "Figma", "OpenAI", "Anthropic", "Apple", "Microsoft",
];

function CompanyMarquee() {
  const items = [...COMPANIES, ...COMPANIES];
  return (
    <div style={{ width: "100%", marginTop: "auto", paddingBottom: "32px", paddingTop: "40px" }}>
      <p className="font-label" style={{ fontSize: "9px", color: "#334155", textAlign: "center", marginBottom: "16px" }}>
        Candidates targeting
      </p>
      <div style={{ position: "relative", overflow: "hidden" }}>
        {/* Fade edges */}
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: "140px", zIndex: 2,
          background: "linear-gradient(to right, #040010, transparent)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", right: 0, top: 0, bottom: 0, width: "140px", zIndex: 2,
          background: "linear-gradient(to left, #040010, transparent)", pointerEvents: "none",
        }} />
        <div style={{
          display: "flex", gap: "48px", alignItems: "center",
          animation: "marqueeScroll 28s linear infinite",
          whiteSpace: "nowrap", width: "max-content",
        }}>
          {items.map((company, i) => (
            <span key={i} className="font-label" style={{ fontSize: "11px", color: "#334155" }}>
              {company}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Floating Preview Cards ─────────────────────────────────────────────────── */

function FloatingAlexCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 1.0 }}
      style={{ position: "absolute", left: "5%", bottom: "28%", maxWidth: "260px", zIndex: 15 }}
    >
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: "rgba(4,0,16,0.85)",
          border: "1px solid rgba(139,92,246,0.2)",
          borderRadius: "14px", padding: "14px 16px",
          backdropFilter: "blur(20px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(139,92,246,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "10px" }}>
          <motion.div
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#EF4444", flexShrink: 0 }}
          />
          <span className="font-label" style={{ fontSize: "9px", color: "#A78BFA" }}>Alex is asking</span>
        </div>
        <p style={{
          fontSize: "0.8125rem", color: "#CBD5E1", lineHeight: 1.6,
          fontFamily: "var(--font-inter)", fontWeight: 300, margin: 0,
        }}>
          &ldquo;You mentioned a 40% latency improvement — walk me through exactly how you measured that.&rdquo;
        </p>
      </motion.div>
    </motion.div>
  );
}

function FloatingScoreCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 1.2 }}
      style={{ position: "absolute", right: "5%", bottom: "28%", maxWidth: "220px", zIndex: 15 }}
    >
      <motion.div
        animate={{ y: [0, -9, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        style={{
          background: "rgba(4,0,16,0.85)",
          border: "1px solid rgba(6,182,212,0.2)",
          borderRadius: "14px", padding: "14px 16px",
          backdropFilter: "blur(20px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(6,182,212,0.06)",
        }}
      >
        <div className="font-label" style={{ fontSize: "9px", color: "#64748B", marginBottom: "12px" }}>
          Session Complete
        </div>
        {[
          { label: "Technical Depth", score: 82 },
          { label: "Communication", score: 91 },
          { label: "Structured Thinking", score: 78 },
        ].map((cat, i) => (
          <div key={i} style={{ marginBottom: i < 2 ? "8px" : "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
              <span style={{ fontSize: "0.6875rem", color: "#64748B", fontFamily: "var(--font-jetbrains-mono)", letterSpacing: "0.06em" }}>
                {cat.label}
              </span>
              <span style={{ fontSize: "0.6875rem", color: "#fff", fontFamily: "var(--font-jetbrains-mono)" }}>
                {cat.score}
              </span>
            </div>
            <div style={{ height: "3px", background: "rgba(255,255,255,0.06)", borderRadius: "9999px", overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${cat.score}%` }}
                transition={{ duration: 1, delay: 1.5 + i * 0.15, ease: "easeOut" }}
                style={{ height: "100%", background: "linear-gradient(to right, #7C3AED, #06B6D4)", borderRadius: "9999px" }}
              />
            </div>
          </div>
        ))}
        <div style={{
          marginTop: "10px", display: "inline-block",
          background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)",
          borderRadius: "9999px", padding: "3px 10px",
          fontSize: "0.625rem", color: "#10B981", fontFamily: "var(--font-jetbrains-mono)", letterSpacing: "0.1em",
        }}>
          Lean Hire
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── HUD Corners ────────────────────────────────────────────────────────────── */

function HUDCorners() {
  const base: React.CSSProperties = {
    position: "fixed", fontFamily: "var(--font-jetbrains-mono)", fontSize: "1.5rem",
    color: "rgba(124,58,237,0.18)", zIndex: 5, lineHeight: 1,
    pointerEvents: "none", userSelect: "none",
  };
  return (
    <>
      <motion.span initial={{ opacity: 0, x: -6, y: -6 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ delay: 0.8, duration: 0.5 }} style={{ ...base, top: 24, left: 24 }}>&#91;</motion.span>
      <motion.span initial={{ opacity: 0, x: 6, y: -6 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ delay: 0.8, duration: 0.5 }} style={{ ...base, top: 24, right: 24 }}>&#93;</motion.span>
      <motion.span initial={{ opacity: 0, x: -6, y: 6 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ delay: 0.8, duration: 0.5 }} style={{ ...base, bottom: 24, left: 24 }}>&#91;</motion.span>
      <motion.span initial={{ opacity: 0, x: 6, y: 6 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ delay: 0.8, duration: 0.5 }} style={{ ...base, bottom: 24, right: 24 }}>&#93;</motion.span>
    </>
  );
}

/* ─── HeroSection ────────────────────────────────────────────────────────────── */

export function HeroSection() {
  return (
    <>
      <HUDCorners />

      <section
        style={{
          position: "relative", zIndex: 10, minHeight: "100vh",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          textAlign: "center", padding: "100px 24px 0",
          overflow: "hidden",
        }}
      >
        {/* Center radial glow */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -58%)",
            width: "700px", height: "700px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,58,237,0.10) 0%, rgba(6,182,212,0.04) 50%, transparent 70%)",
            pointerEvents: "none", zIndex: 0,
          }}
        />

        {/* Floating preview cards — hidden on narrower viewports */}
        <div style={{ display: "contents" }}>
          <FloatingAlexCard />
          <FloatingScoreCard />
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <HeroBadge />

          {/* Two-line headline */}
          <div style={{ marginBottom: "24px" }}>
            <h1 className="font-display" style={{ lineHeight: 1.05, margin: 0 }}>
              <motion.span
                initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.75, delay: 0.2 }}
                style={{
                  display: "block",
                  fontSize: "clamp(3.5rem, 8vw, 7rem)",
                  fontWeight: 800, color: "#ffffff",
                }}
              >
                Get Grilled.
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.75, delay: 0.38 }}
                className="gradient-animated font-display"
                style={{
                  display: "block",
                  fontSize: "clamp(3.5rem, 8vw, 7rem)",
                  fontWeight: 800,
                }}
              >
                Get Hired.
              </motion.span>
            </h1>
          </div>

          {/* Typewriter */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            style={{ marginBottom: "44px" }}
          >
            <TypewriterSubtitle />
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
          >
            <GoogleSignInButton />
          </motion.div>

          <StatsRow />
        </div>

        <CompanyMarquee />
      </section>
    </>
  );
}
