"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { PastSession } from "@/lib/actions/get-past-sessions";

const SUGGESTION_STYLE: Record<string, { text: string; bg: string; border: string }> = {
  "Hire":         { text: "#10B981", bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.3)" },
  "Lean Hire":    { text: "#06B6D4", bg: "rgba(6,182,212,0.1)",   border: "rgba(6,182,212,0.3)" },
  "Lean No Hire": { text: "#F59E0B", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.3)" },
  "No Hire":      { text: "#EF4444", bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.3)" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatDuration(secs: number | null) {
  if (!secs) return null;
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}m ${s}s`;
}

function SessionCard({ session, onClick }: { session: PastSession; onClick: () => void }) {
  const sug = session.hiringSuggestion ? SUGGESTION_STYLE[session.hiringSuggestion] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, borderColor: "rgba(139,92,246,0.35)" }}
      onClick={onClick}
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "14px", padding: "24px 28px",
        cursor: "pointer", display: "flex", alignItems: "center",
        gap: "24px", transition: "border-color 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 24px rgba(124,58,237,0.12)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
    >
      {/* Score ring */}
      <div style={{ flexShrink: 0 }}>
        {session.overallScore != null ? (
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.1))",
            border: "1.5px solid rgba(139,92,246,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{
              fontFamily: "var(--font-jetbrains-mono)", fontSize: "1rem", fontWeight: 700,
              background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              {session.overallScore}
            </span>
          </div>
        ) : (
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: "rgba(255,255,255,0.02)",
            border: "1px dashed rgba(255,255,255,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span className="font-label" style={{ fontSize: "8px", color: "#475569" }}>N/A</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", fontWeight: 500, color: "#fff" }}>
            {session.role ?? "Software Engineer"}
          </span>
          {sug && (
            <span style={{
              background: sug.bg, border: `1px solid ${sug.border}`,
              borderRadius: "9999px", padding: "2px 10px",
              fontFamily: "var(--font-jetbrains-mono)", fontSize: "9px",
              letterSpacing: "0.1em", color: sug.text, textTransform: "uppercase",
            }}>
              {session.hiringSuggestion}
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          {[
            formatDate(session.createdAt),
            session.difficulty,
            session.targetCompany,
            formatDuration(session.durationSeconds),
          ].filter(Boolean).map((tag, i) => (
            <span key={i} className="font-label" style={{ fontSize: "9px", color: "#475569" }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Arrow */}
      <span style={{ color: "#334155", fontSize: "1.125rem", flexShrink: 0 }}>→</span>
    </motion.div>
  );
}

export function Dashboard({ name, sessions }: { name: string; sessions: PastSession[] }) {
  const router = useRouter();

  return (
    <main style={{
      position: "relative", zIndex: 10, minHeight: "100vh",
      padding: "120px 48px 80px", maxWidth: "1024px", margin: "0 auto",
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }} style={{ marginBottom: "64px" }}
      >
        <p className="font-label" style={{ fontSize: "11px", color: "#64748B", marginBottom: "12px" }}>
          Welcome back
        </p>
        <h1 className="font-display" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "#ffffff", marginBottom: "8px" }}>
          {name}
        </h1>
        <p style={{ fontSize: "0.9375rem", color: "#64748B", fontFamily: "var(--font-inter)", fontWeight: 300 }}>
          Ready for your next session?
        </p>
      </motion.div>

      {/* New Interview CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }} style={{ marginBottom: "64px" }}
      >
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
          onClick={() => router.push("/upload")}
          style={{
            position: "relative", overflow: "hidden",
            display: "inline-flex", alignItems: "center", gap: "10px",
            background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
            border: "none", borderRadius: "9999px", padding: "14px 28px",
            fontSize: "1rem", fontWeight: 500, color: "#ffffff",
            cursor: "pointer", fontFamily: "var(--font-inter)",
            boxShadow: "0 0 40px rgba(124,58,237,0.4), 0 0 80px rgba(6,182,212,0.15)",
          }}
        >
          + New Interview
        </motion.button>
      </motion.div>

      {/* Past sessions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <p className="font-label" style={{ fontSize: "11px", color: "#64748B", marginBottom: "24px" }}>
          Past Sessions {sessions.length > 0 && `· ${sessions.length}`}
        </p>

        {sessions.length === 0 ? (
          <div style={{
            border: "1px dashed rgba(255,255,255,0.08)", borderRadius: "1rem",
            padding: "64px 32px", textAlign: "center",
          }}>
            <p className="font-label" style={{ fontSize: "11px", color: "#64748B", marginBottom: "8px" }}>
              No sessions yet
            </p>
            <p style={{ fontSize: "0.875rem", color: "#64748B", fontFamily: "var(--font-inter)", fontWeight: 300 }}>
              Your interview history will appear here after your first session.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {sessions.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.06 }}>
                <SessionCard session={s} onClick={() => router.push(`/report?sessionId=${s.id}`)} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </main>
  );
}
