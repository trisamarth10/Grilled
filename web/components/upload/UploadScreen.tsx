"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { uploadResume } from "@/lib/actions/upload-resume";
import { processResume } from "@/lib/actions/process-resume";

const DIFFICULTIES = ["Internship", "New Grad", "Mid-Level", "Senior"] as const;
type Difficulty = (typeof DIFFICULTIES)[number];

/* ─── Icons ─────────────────────────────────────────────────────────────────── */

function UploadIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="upload-grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      <path d="M24 32V16M24 16L17 23M24 16L31 23" stroke="url(#upload-grad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 36a4 4 0 01-4-4v-2a10 10 0 0110-10h1M40 36a4 4 0 004-4v-2a10 10 0 00-10-10h-1" stroke="url(#upload-grad)" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 2h8l4 4v12a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="#7C3AED" strokeWidth="1.5" />
      <path d="M12 2v4h4" stroke="#7C3AED" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <rect x="2" y="4" width="12" height="11" rx="1" stroke="#64748B" strokeWidth="1.25" />
      <path d="M5 15V10h6v5M2 7h12" stroke="#64748B" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon({ shifted }: { shifted: boolean }) {
  return (
    <motion.svg
      animate={{ x: shifted ? 4 : 0 }}
      transition={{ duration: 0.2 }}
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
    >
      <path d="M3 9h12M10 4l5 5-5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </motion.svg>
  );
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ─── Drop Zone ─────────────────────────────────────────────────────────────── */

function DropZone({ onFile }: { onFile: (f: File) => void }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const accept = (f: File) => {
    const ext = f.name.split(".").pop()?.toLowerCase();
    if (!["pdf", "docx"].includes(ext ?? "")) return;
    if (f.size > 10 * 1024 * 1024) return;
    onFile(f);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) accept(f);
  }, []);

  return (
    <motion.div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      animate={{
        borderColor: dragging ? "rgba(139,92,246,0.7)" : "rgba(139,92,246,0.3)",
        background: dragging ? "rgba(139,92,246,0.06)" : "rgba(6,0,24,0.5)",
      }}
      style={{
        height: "340px",
        width: "100%",
        border: "1px dashed rgba(139,92,246,0.3)",
        borderRadius: "0.75rem",
        backdropFilter: "blur(8px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <UploadIcon />
      <div style={{ textAlign: "center" }}>
        <p style={{ color: "#ffffff", fontSize: "1.25rem", fontWeight: 500, fontFamily: "var(--font-inter)", marginBottom: "6px" }}>
          Drop your resume here
        </p>
        <p className="font-label" style={{ fontSize: "11px", color: "#64748B" }}>
          PDF or DOCX · Max 10MB
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx"
        style={{ display: "none" }}
        onChange={(e) => { const f = e.target.files?.[0] ?? null; if (f) accept(f); }}
      />
    </motion.div>
  );
}

/* ─── File Card ─────────────────────────────────────────────────────────────── */

function FileCard({ file, onDismiss }: { file: File; onDismiss: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "14px 16px",
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "0.75rem",
      }}
    >
      <FileIcon />
      <span style={{ flex: 1, fontSize: "0.875rem", color: "#CBD5E1", fontFamily: "var(--font-inter)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {file.name}
      </span>
      <span style={{ fontSize: "0.8125rem", color: "#64748B", fontFamily: "var(--font-inter)", flexShrink: 0 }}>
        {formatBytes(file.size)}
      </span>
      <span
        className="font-label"
        style={{
          fontSize: "10px",
          color: "#10B981",
          background: "rgba(16,185,129,0.1)",
          padding: "3px 8px",
          borderRadius: "9999px",
          flexShrink: 0,
        }}
      >
        READY
      </span>
      <button
        onClick={onDismiss}
        style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B", fontSize: "18px", lineHeight: 1, padding: "0 2px", flexShrink: 0 }}
      >
        ×
      </button>
    </motion.div>
  );
}

/* ─── Main Screen ────────────────────────────────────────────────────────────── */

export function UploadScreen({ userId }: { userId: string }) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>("New Grad");
  const [company, setCompany] = useState("");
  const [companyFocused, setCompanyFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleBegin = async () => {
    if (!file || loading) return;
    setLoading(true);
    setError(null);

    // Step 1: Upload file to Supabase Storage
    setLoadingStage("Uploading resume...");
    const fd = new FormData();
    fd.append("file", file);
    fd.append("userId", userId);

    const uploadResult = await uploadResume(fd);
    if ("error" in uploadResult) {
      setError(uploadResult.error ?? "Upload failed");
      setLoading(false);
      return;
    }

    // Step 2: Extract text + analyze resume + create session
    setLoadingStage("Analyzing resume...");
    const processResult = await processResume({
      resumeId: uploadResult.resumeId,
      filePath: uploadResult.filePath,
      fileName: file.name,
      difficulty,
      targetCompany: company || undefined,
    });

    if ("error" in processResult) {
      setError(processResult.error);
      setLoading(false);
      return;
    }

    router.push(`/countdown?sessionId=${processResult.sessionId}`);
  };

  return (
    <main
      style={{
        position: "relative",
        zIndex: 10,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "120px 48px 80px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "640px", display: "flex", flexDirection: "column", gap: "32px" }}>

        {/* Step label */}
        <p className="font-label" style={{ fontSize: "12px", color: "#64748B", textAlign: "center" }}>
          Step 1 of 2 · Upload Resume
        </p>

        {/* Drop zone / File card */}
        <AnimatePresence mode="wait">
          {file ? (
            <motion.div key="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <FileCard file={file} onDismiss={() => setFile(null)} />
            </motion.div>
          ) : (
            <motion.div key="zone" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DropZone onFile={setFile} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Difficulty */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <p className="font-label" style={{ fontSize: "11px", color: "#64748B" }}>
            Difficulty Level
          </p>
          <div style={{ display: "flex", gap: "8px" }}>
            {DIFFICULTIES.map((d) => {
              const active = d === difficulty;
              return (
                <motion.button
                  key={d}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setDifficulty(d)}
                  style={{
                    flex: 1,
                    padding: "10px 0",
                    borderRadius: "9999px",
                    border: active ? "none" : "1px solid rgba(255,255,255,0.08)",
                    background: active ? "linear-gradient(to right, #7C3AED, #06B6D4)" : "rgba(255,255,255,0.02)",
                    color: active ? "#ffffff" : "#CBD5E1",
                    fontSize: "0.8125rem",
                    fontWeight: active ? 500 : 400,
                    fontFamily: "var(--font-inter)",
                    cursor: "pointer",
                    transition: "background 0.2s, color 0.2s",
                  }}
                >
                  {d}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Target company */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <p className="font-label" style={{ fontSize: "11px", color: "#64748B" }}>
            Target Company (Optional)
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "0 14px",
              background: companyFocused ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
              border: `1px solid ${companyFocused ? "#7C3AED" : "rgba(255,255,255,0.08)"}`,
              borderRadius: "0.5rem",
              transition: "border-color 0.2s, background 0.2s",
            }}
          >
            <BuildingIcon />
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              onFocus={() => setCompanyFocused(true)}
              onBlur={() => setCompanyFocused(false)}
              placeholder="e.g. Stripe, Google..."
              style={{
                flex: 1,
                background: "none",
                border: "none",
                outline: "none",
                padding: "14px 0",
                fontSize: "0.9375rem",
                color: "#ffffff",
                fontFamily: "var(--font-inter)",
              }}
            />
          </div>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ fontSize: "0.875rem", color: "#EF4444", fontFamily: "var(--font-inter)", textAlign: "center" }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* CTA */}
        <motion.button
          whileHover={file ? { scale: 1.02, y: -2 } : {}}
          whileTap={file ? { scale: 0.98 } : {}}
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          onClick={handleBegin}
          disabled={!file || loading}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            width: "100%",
            padding: "16px",
            borderRadius: "9999px",
            border: "none",
            background: file
              ? "linear-gradient(135deg, #7C3AED, #06B6D4)"
              : "rgba(255,255,255,0.05)",
            color: file ? "#ffffff" : "#64748B",
            fontSize: "1rem",
            fontWeight: 500,
            fontFamily: "var(--font-inter)",
            cursor: file ? "pointer" : "not-allowed",
            boxShadow: file && hovered
              ? "0 0 60px rgba(124,58,237,0.7), 0 0 100px rgba(6,182,212,0.3)"
              : file
              ? "0 0 40px rgba(124,58,237,0.5), 0 0 80px rgba(6,182,212,0.2)"
              : "none",
            transition: "box-shadow 0.2s, background 0.2s, color 0.2s",
          }}
        >
          {loading ? loadingStage : "Begin Session"}
          {!loading && file && <ArrowIcon shifted={hovered} />}
        </motion.button>

      </div>
    </main>
  );
}
