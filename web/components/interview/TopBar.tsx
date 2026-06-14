"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

interface TopBarProps {
  onEndSession: () => void;
  sessionSeconds: number;
}

export function TopBar({ onEndSession, sessionSeconds }: TopBarProps) {
  const [confirmEnd, setConfirmEnd] = useState(false);

  const handleEnd = () => {
    if (!confirmEnd) { setConfirmEnd(true); return; }
    onEndSession();
  };

  useEffect(() => {
    if (!confirmEnd) return;
    const t = setTimeout(() => setConfirmEnd(false), 3000);
    return () => clearTimeout(t);
  }, [confirmEnd]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "56px",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        background: "rgba(4,0,16,0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      {/* Left — logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span
          className="gradient-brand-text font-display"
          style={{ fontSize: "1.25rem", fontWeight: 800 }}
        >
          IQ
        </span>
        <span className="font-label" style={{ fontSize: "11px", color: "#64748B" }}>
          · LIVE INTERVIEW
        </span>
      </div>

      {/* Center — REC + timer */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <motion.div
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            style={{ width: 8, height: 8, borderRadius: "50%", background: "#EF4444" }}
          />
          <span className="font-label" style={{ fontSize: "11px", color: "#EF4444" }}>
            REC
          </span>
        </div>
        <span
          className="font-label"
          style={{ fontSize: "14px", fontWeight: 700, color: "#22D3EE", letterSpacing: "0.05em" }}
        >
          {formatTime(sessionSeconds)}
        </span>
      </div>

      {/* Right — End Session */}
      <motion.button
        whileHover={{ background: "rgba(239,68,68,0.12)" }}
        onClick={handleEnd}
        style={{
          padding: "8px 18px",
          borderRadius: "9999px",
          border: `1px solid ${confirmEnd ? "rgba(239,68,68,0.7)" : "rgba(239,68,68,0.35)"}`,
          background: confirmEnd ? "rgba(239,68,68,0.1)" : "transparent",
          color: confirmEnd ? "#EF4444" : "#94A3B8",
          fontSize: "0.75rem",
          fontWeight: 500,
          fontFamily: "var(--font-inter)",
          cursor: "pointer",
          transition: "border-color 0.2s, color 0.2s, background 0.2s",
        }}
      >
        {confirmEnd ? "Confirm End?" : "End Session"}
      </motion.button>
    </div>
  );
}
