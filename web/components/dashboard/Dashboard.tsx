"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export function Dashboard({ name }: { name: string }) {
  const router = useRouter();
  return (
    <main
      style={{
        position: "relative",
        zIndex: 10,
        minHeight: "100vh",
        padding: "120px 48px 80px",
        maxWidth: "1024px",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: "64px" }}
      >
        <p className="font-label" style={{ fontSize: "11px", color: "#64748B", marginBottom: "12px" }}>
          Welcome back
        </p>
        <h1
          className="font-display"
          style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "#ffffff", marginBottom: "8px" }}
        >
          {name}
        </h1>
        <p style={{ fontSize: "0.9375rem", color: "#64748B", fontFamily: "var(--font-inter)", fontWeight: 300 }}>
          Ready for your next session?
        </p>
      </motion.div>

      {/* New Interview CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        style={{ marginBottom: "64px" }}
      >
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          style={{
            position: "relative",
            overflow: "hidden",
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
            border: "none",
            borderRadius: "9999px",
            padding: "14px 28px",
            fontSize: "1rem",
            fontWeight: 500,
            color: "#ffffff",
            cursor: "pointer",
            fontFamily: "var(--font-inter)",
            boxShadow: "0 0 40px rgba(124,58,237,0.4), 0 0 80px rgba(6,182,212,0.15)",
          }}
          onClick={() => router.push("/upload")}
        >
          + New Interview
        </motion.button>
      </motion.div>

      {/* Past interviews — empty state */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <p className="font-label" style={{ fontSize: "11px", color: "#64748B", marginBottom: "24px" }}>
          Past Sessions
        </p>
        <div
          style={{
            border: "1px dashed rgba(255,255,255,0.08)",
            borderRadius: "1rem",
            padding: "64px 32px",
            textAlign: "center",
          }}
        >
          <p
            className="font-label"
            style={{ fontSize: "11px", color: "#64748B", marginBottom: "8px" }}
          >
            No sessions yet
          </p>
          <p
            style={{
              fontSize: "0.875rem",
              color: "#64748B",
              fontFamily: "var(--font-inter)",
              fontWeight: 300,
            }}
          >
            Your interview history will appear here after your first session.
          </p>
        </div>
      </motion.div>
    </main>
  );
}
