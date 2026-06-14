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
      const t = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, 3000);
      return () => clearTimeout(t);
    }

    if (!isDeleting) {
      if (displayed.length < target.length) {
        const t = setTimeout(
          () => setDisplayed(target.slice(0, displayed.length + 1)),
          50
        );
        return () => clearTimeout(t);
      }
      setIsPaused(true);
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(
          () => setDisplayed(displayed.slice(0, -1)),
          30
        );
        return () => clearTimeout(t);
      }
      setIsDeleting(false);
      setPhraseIndex((i) => (i + 1) % PHRASES.length);
    }
  }, [displayed, isDeleting, isPaused, phraseIndex]);

  return (
    <p
      style={{
        fontSize: "1.125rem",
        fontWeight: 300,
        color: "#CBD5E1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "1.75rem",
        fontFamily: "var(--font-inter)",
      }}
    >
      {displayed}
      {/* Blinking cyan cursor block */}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        style={{
          display: "inline-block",
          width: "10px",
          height: "1.1em",
          background: "#22D3EE",
          marginLeft: "3px",
          verticalAlign: "middle",
          borderRadius: "1px",
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
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        background: "rgba(255,255,255,0.05)",
        borderRadius: "9999px",
        padding: "6px 16px",
        marginBottom: "32px",
      }}
    >
      {/* Pulsing cyan dot */}
      <motion.span
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: "#06B6D4",
          display: "inline-block",
          flexShrink: 0,
        }}
      />
      <span
        className="font-label"
        style={{ fontSize: "11px", color: "#CBD5E1" }}
      >
        AI Interview Engine
      </span>
    </motion.div>
  );
}

/* ─── Google Icon (SVG) ──────────────────────────────────────────────────────── */

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        fill="rgba(255,255,255,0.9)"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
        fill="rgba(255,255,255,0.9)"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
        fill="rgba(255,255,255,0.9)"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
        fill="rgba(255,255,255,0.9)"
      />
    </svg>
  );
}

/* ─── CTA Button ─────────────────────────────────────────────────────────────── */

function CTAButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        position: "relative",
        overflow: "hidden",
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
        border: "none",
        borderRadius: "9999px",
        padding: "16px 32px",
        fontSize: "1.125rem",
        fontWeight: 500,
        color: "#ffffff",
        cursor: "pointer",
        fontFamily: "var(--font-inter)",
        boxShadow: hovered
          ? "0 0 60px rgba(124,58,237,0.7), 0 0 100px rgba(6,182,212,0.3)"
          : "0 0 40px rgba(124,58,237,0.5), 0 0 80px rgba(6,182,212,0.2)",
        transition: "box-shadow 0.2s ease",
      }}
    >
      {/* Shimmer sweep */}
      <motion.span
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)",
          pointerEvents: "none",
        }}
      />
      <GoogleIcon />
      Sign in with Google
    </motion.button>
  );
}

/* ─── HUD Corners ────────────────────────────────────────────────────────────── */

function HUDCorners() {
  const base: React.CSSProperties = {
    position: "fixed",
    fontFamily: "var(--font-jetbrains-mono)",
    fontSize: "1.5rem",
    color: "rgba(124,58,237,0.2)",
    zIndex: 5,
    lineHeight: 1,
    pointerEvents: "none",
    userSelect: "none",
  };
  return (
    <>
      <span style={{ ...base, top: 24, left: 24 }}>&#91;</span>
      <span style={{ ...base, top: 24, right: 24 }}>&#93;</span>
      <span style={{ ...base, bottom: 24, left: 24 }}>&#91;</span>
      <span style={{ ...base, bottom: 24, right: 24 }}>&#93;</span>
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
          position: "relative",
          zIndex: 10,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "100px 24px 60px", // clear fixed navbar
        }}
      >
        <HeroBadge />

        {/* Two-line headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{ marginBottom: "24px" }}
        >
          <h1
            className="font-display"
            style={{ lineHeight: 1.05, margin: 0 }}
          >
            <span
              style={{
                display: "block",
                fontSize: "clamp(3.5rem, 8vw, 7rem)",
                fontWeight: 800,
                color: "#ffffff",
              }}
            >
              Get Grilled.
            </span>
            <span
              className="gradient-text font-display"
              style={{
                display: "block",
                fontSize: "clamp(3.5rem, 8vw, 7rem)",
                fontWeight: 800,
              }}
            >
              Get Hired.
            </span>
          </h1>
        </motion.div>

        {/* Typewriter */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          style={{ marginBottom: "48px" }}
        >
          <TypewriterSubtitle />
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <GoogleSignInButton />
        </motion.div>
      </section>
    </>
  );
}
