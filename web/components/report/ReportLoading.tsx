"use client";

import { motion } from "framer-motion";

function Pulse({ width, height = 20, radius = 8 }: { width: string | number; height?: number; radius?: number | string }) {
  return (
    <motion.div
      animate={{ opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      style={{
        width, height, borderRadius: radius,
        background: "rgba(255,255,255,0.06)",
      }}
    />
  );
}

export function ReportLoading() {
  return (
    <div style={{
      position: "relative", zIndex: 10, maxWidth: "900px", margin: "0 auto",
      padding: "80px 24px",
    }}>
      {/* Header row skeleton */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "64px", flexWrap: "wrap", gap: "32px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Pulse width={120} height={14} />
          <Pulse width={360} height={44} radius={10} />
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "8px" }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
              style={{
                width: 18, height: 18, borderRadius: "50%",
                border: "2px solid rgba(139,92,246,0.2)",
                borderTopColor: "#8B5CF6",
              }}
            />
            <span style={{
              fontFamily: "var(--font-jetbrains-mono)", fontSize: "11px",
              letterSpacing: "0.1em", color: "#64748B", textTransform: "uppercase",
            }}>
              Generating your report...
            </span>
          </div>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#475569", maxWidth: 380, lineHeight: 1.6 }}>
            ALEX is reviewing the full transcript and scoring your performance across six dimensions. This takes 10–20 seconds.
          </p>
        </div>
        <Pulse width={200} height={200} radius="50%" />
      </div>

      {/* Category cards skeleton */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(139,92,246,0.08)",
              borderRadius: "16px", padding: "24px",
              display: "flex", flexDirection: "column", gap: "12px",
            }}
          >
            <Pulse width="40%" height={11} />
            <Pulse width="60%" height={36} radius={6} />
            <Pulse width="100%" height={6} radius={3} />
            <Pulse width="90%" height={14} />
            <Pulse width="75%" height={14} />
          </motion.div>
        ))}
      </div>

      {/* Insights skeleton */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
        {[0, 1].map((i) => (
          <div key={i} style={{ border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "32px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <Pulse width="50%" height={14} />
            {[1, 2, 3].map((j) => <Pulse key={j} width={`${70 + j * 8}%`} height={14} />)}
          </div>
        ))}
      </div>

      {/* Assessment skeleton */}
      <div style={{
        background: "rgba(124,58,237,0.04)", borderLeft: "2px solid rgba(139,92,246,0.3)",
        padding: "32px", borderRadius: "0 12px 12px 0",
        display: "flex", flexDirection: "column", gap: "12px",
      }}>
        <Pulse width={220} height={13} />
        {[1, 2, 3, 4].map((j) => <Pulse key={j} width={`${85 + j * 3}%`} height={15} />)}
      </div>
    </div>
  );
}
