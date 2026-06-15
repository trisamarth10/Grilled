"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import type { SessionData, SessionReport } from "@/lib/actions/get-session";

/* ─── Overall score ring ─────────────────────────────────────────────────────── */

function ScoreRing({ score }: { score: number }) {
  const R = 88;
  const circumference = 2 * Math.PI * R;
  const dashOffset = circumference * (1 - score / 100);

  return (
    <div style={{ position: "relative", width: 200, height: 200, flexShrink: 0 }}>
      <svg width="200" height="200" viewBox="0 0 200 200" style={{ transform: "rotate(-90deg)" }}>
        <defs>
          <linearGradient id="score-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
          <filter id="score-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <circle cx="100" cy="100" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <motion.circle
          cx="100" cy="100" r={R} fill="none"
          stroke="url(#score-grad)" strokeWidth="28" strokeOpacity="0.22"
          strokeLinecap="round" strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
          filter="url(#score-glow)"
        />
        <motion.circle
          cx="100" cy="100" r={R} fill="none"
          stroke="url(#score-grad)" strokeWidth="8"
          strokeLinecap="round" strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          style={{
            fontFamily: "var(--font-jetbrains-mono)", fontSize: "60px", fontWeight: 700, lineHeight: 1,
            background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}
        >
          {score}
        </motion.span>
        <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "13px", color: "#475569" }}>/100</span>
      </div>
    </div>
  );
}

/* ─── Helpers ─────────────────────────────────────────────────────────────────── */

const SUGGESTION_STYLE: Record<string, { text: string; bg: string; border: string }> = {
  "Hire":         { text: "#10B981", bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.35)" },
  "Lean Hire":    { text: "#06B6D4", bg: "rgba(6,182,212,0.1)",   border: "rgba(6,182,212,0.35)" },
  "Lean No Hire": { text: "#F59E0B", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.35)" },
  "No Hire":      { text: "#EF4444", bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.35)" },
};

function performanceLabel(score: number): string {
  if (score >= 93) return "EXCEPTIONAL";
  if (score >= 86) return "EXCELLENT";
  if (score >= 78) return "GOOD PERFORMANCE";
  if (score >= 68) return "MEETS BAR";
  if (score >= 58) return "BELOW BAR";
  return "DOES NOT MEET BAR";
}

/* ─── Category card ──────────────────────────────────────────────────────────── */

function CategoryCard({ cat, index }: { cat: SessionReport["categories"][number]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + index * 0.07 }}
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(139,92,246,0.15)",
        borderRadius: "16px", padding: "24px",
        backdropFilter: "blur(16px)",
        display: "flex", flexDirection: "column", gap: "12px",
        cursor: "default", transition: "border-color 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.4)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 0 30px rgba(124,58,237,0.15)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.15)";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      <span className="font-label" style={{ fontSize: "10px", color: "#A78BFA" }}>{cat.name}</span>

      <span style={{
        fontFamily: "var(--font-jetbrains-mono)", fontSize: "40px", fontWeight: 700, lineHeight: 1,
        background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      }}>
        {cat.score}
      </span>

      <div style={{ height: "6px", background: "rgba(255,255,255,0.05)", borderRadius: "9999px", overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${cat.score}%` }}
          transition={{ duration: 1, delay: 0.4 + index * 0.1, ease: "easeOut" }}
          style={{ height: "100%", background: "linear-gradient(to right, #7C3AED, #06B6D4)", borderRadius: "9999px" }}
        />
      </div>

      <p style={{
        fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#64748B",
        margin: 0, lineHeight: 1.7, fontWeight: 300,
      }}>
        {cat.feedback}
      </p>

      {cat.evidence && (
        <div style={{ borderLeft: "2px solid rgba(139,92,246,0.25)", paddingLeft: "12px" }}>
          <p style={{
            fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#475569",
            fontStyle: "italic", margin: 0, lineHeight: 1.6,
          }}>
            &ldquo;{cat.evidence}&rdquo;
          </p>
        </div>
      )}
    </motion.div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────────── */

function downloadReport(session: SessionData, report: SessionReport) {
  const durationMin = session.durationSeconds ? Math.round(session.durationSeconds / 60) : 0;
  const sug = SUGGESTION_STYLE[report.hiringSuggestion] ?? SUGGESTION_STYLE["Lean Hire"];

  const categoryRows = report.categories.map((cat) => `
    <div class="category">
      <div class="category-header">
        <span class="category-name">${cat.name}</span>
        <span class="category-score">${cat.score}/100</span>
      </div>
      <div class="progress-track"><div class="progress-fill" style="width:${cat.score}%"></div></div>
      <p class="body-text">${cat.feedback}</p>
      ${cat.evidence ? `<blockquote>&ldquo;${cat.evidence}&rdquo;</blockquote>` : ""}
    </div>
  `).join("");

  const strengthsHtml = report.strengths.map((s) => `<li>${s}</li>`).join("");
  const improvementsHtml = report.areasToImprove.map((a) => `<li>${a}</li>`).join("");
  const exchangesHtml = (report.notableExchanges ?? []).map((ex) => `
    <div class="exchange">
      <p class="exchange-question">&ldquo;${ex.question}&rdquo;</p>
      <p class="body-text">${ex.summary}</p>
    </div>
  `).join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Interview Report — ${session.resumeAnalysis.name}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #111; background: #fff; font-size: 13px; line-height: 1.6; padding: 40px; max-width: 820px; margin: 0 auto; }
    h1 { font-size: 26px; font-weight: 700; margin-bottom: 4px; }
    h2 { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #555; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 1px solid #e5e5e5; }
    .label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; color: #888; }
    .body-text { color: #333; line-height: 1.7; margin-top: 8px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #111; }
    .header-left { flex: 1; }
    .header-right { text-align: center; }
    .score-big { font-size: 56px; font-weight: 800; color: #111; line-height: 1; }
    .score-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #888; margin-top: 4px; }
    .meta { display: flex; gap: 16px; flex-wrap: wrap; margin: 10px 0; }
    .meta span { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #666; }
    .verdict { display: inline-block; border: 1.5px solid #111; border-radius: 4px; padding: 4px 12px; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; margin-top: 8px; }
    .section { margin-bottom: 32px; }
    .rationale { background: #f8f8f8; border-left: 3px solid #111; padding: 14px 18px; border-radius: 0 6px 6px 0; color: #333; line-height: 1.75; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .category { padding: 16px; border: 1px solid #e5e5e5; border-radius: 8px; }
    .category-header { display: flex; justify-content: space-between; margin-bottom: 6px; }
    .category-name { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700; color: #555; }
    .category-score { font-size: 16px; font-weight: 800; color: #111; }
    .progress-track { height: 4px; background: #eee; border-radius: 9999px; margin-bottom: 10px; overflow: hidden; }
    .progress-fill { height: 100%; background: #111; border-radius: 9999px; }
    blockquote { border-left: 2px solid #ccc; padding-left: 12px; margin-top: 8px; font-style: italic; color: #666; font-size: 12px; }
    .insights { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .insight-box { border: 1px solid #e5e5e5; border-radius: 8px; padding: 20px; }
    .insight-box h3 { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700; color: #555; margin-bottom: 12px; }
    ul { padding-left: 0; list-style: none; }
    ul li { padding: 6px 0 6px 16px; position: relative; border-bottom: 1px solid #f0f0f0; color: #333; font-size: 12px; line-height: 1.65; }
    ul li:last-child { border-bottom: none; }
    ul li::before { content: "•"; position: absolute; left: 0; color: #999; }
    .assessment { background: #f8f8f8; border-left: 3px solid #555; padding: 20px 24px; border-radius: 0 8px 8px 0; color: #222; font-size: 13px; line-height: 1.85; }
    .exchange { margin-bottom: 14px; padding-bottom: 14px; border-bottom: 1px solid #f0f0f0; }
    .exchange:last-child { border-bottom: none; }
    .exchange-question { font-style: italic; color: #555; font-size: 12px; margin-bottom: 4px; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e5e5e5; font-size: 10px; color: #aaa; text-transform: uppercase; letter-spacing: 0.08em; display: flex; justify-content: space-between; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-left">
      <p class="label">Interview Performance Report</p>
      <h1>${session.resumeAnalysis.name}</h1>
      <div class="meta">
        <span>${session.resumeAnalysis.role ?? ""}</span>
        <span>${session.difficulty}</span>
        ${session.targetCompany ? `<span>${session.targetCompany}</span>` : ""}
        ${durationMin ? `<span>${durationMin} min session</span>` : ""}
      </div>
      <div class="verdict">${report.hiringSuggestion}</div>
    </div>
    <div class="header-right">
      <div class="score-big">${report.overallScore}</div>
      <div class="score-label">${report.letterGrade} · Overall Score</div>
    </div>
  </div>

  <div class="section">
    <h2>Summary</h2>
    <div class="rationale">${report.hiringRationale}</div>
  </div>

  <div class="section">
    <h2>Performance Breakdown</h2>
    <div class="grid">${categoryRows}</div>
  </div>

  <div class="section">
    <h2>Insights</h2>
    <div class="insights">
      <div class="insight-box">
        <h3>Strengths</h3>
        <ul>${strengthsHtml}</ul>
      </div>
      <div class="insight-box">
        <h3>Areas to Improve</h3>
        <ul>${improvementsHtml}</ul>
      </div>
    </div>
  </div>

  ${exchangesHtml ? `
  <div class="section">
    <h2>Notable Exchanges</h2>
    ${exchangesHtml}
  </div>` : ""}

  <div class="section">
    <h2>Interviewer's Assessment</h2>
    <div class="assessment">${report.interviewerAssessment}</div>
  </div>

  <div class="footer">
    <span>Grilled · AI Interview Platform</span>
    <span>Generated ${new Date(report.generatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
  </div>
</body>
</html>`;

  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 400);
}

export function ReportScreen({ session, report }: { session: SessionData; report: SessionReport }) {
  const router = useRouter();
  const sug = SUGGESTION_STYLE[report.hiringSuggestion] ?? SUGGESTION_STYLE["Lean Hire"];
  const durationMin = session.durationSeconds ? Math.round(session.durationSeconds / 60) : 0;

  return (
    <div className="report-root" style={{ position: "relative", zIndex: 10, maxWidth: "900px", margin: "0 auto", padding: "80px 24px 120px" }}>

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px", gap: "40px", flexWrap: "wrap" }}
      >
        {/* Left */}
        <div style={{ flex: 1, minWidth: "280px" }}>
          <span className="font-label" style={{ fontSize: "11px", color: "#64748B", display: "block", marginBottom: "12px" }}>
            Session Complete
          </span>
          <h1 className="font-display" style={{
            fontSize: "clamp(2rem, 4.5vw, 3.5rem)", fontWeight: 700,
            color: "#fff", margin: "0 0 20px", lineHeight: 1.1,
          }}>
            Your Performance Report
          </h1>

          {/* Meta tags */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
            {[session.resumeAnalysis.role, session.difficulty, `${durationMin} min`, session.targetCompany]
              .filter(Boolean)
              .map((tag, i) => (
                <span key={i} className="font-label" style={{
                  fontSize: "9px", color: "#64748B",
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "9999px", padding: "4px 10px",
                }}>
                  {tag}
                </span>
              ))}
          </div>

          {/* Verdict badges */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <span style={{
              background: sug.bg, border: `1px solid ${sug.border}`,
              borderRadius: "9999px", padding: "7px 18px",
              fontFamily: "var(--font-jetbrains-mono)", fontSize: "11px",
              letterSpacing: "0.12em", textTransform: "uppercase",
              color: sug.text, fontWeight: 700,
            }}>
              {report.hiringSuggestion}
            </span>
            <span className="font-label" style={{ fontSize: "11px", color: "#334155" }}>
              {report.letterGrade}
            </span>
          </div>
        </div>

        {/* Right — score ring */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
          <ScoreRing score={report.overallScore} />
          <span className="font-label" style={{ fontSize: "9px", color: "#475569" }}>
            {performanceLabel(report.overallScore)}
          </span>
        </div>
      </motion.div>

      {/* ── Hiring rationale ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        style={{
          background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "12px", padding: "20px 24px", marginBottom: "56px",
        }}
      >
        <p style={{
          fontFamily: "var(--font-inter)", fontSize: "0.9375rem",
          color: "#CBD5E1", margin: 0, lineHeight: 1.75, fontWeight: 300,
        }}>
          {report.hiringRationale}
        </p>
      </motion.div>

      {/* ── Category breakdown ── */}
      <div style={{ marginBottom: "48px" }}>
        <span className="font-label" style={{ fontSize: "10px", color: "#475569", display: "block", marginBottom: "20px" }}>
          Performance Breakdown
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {report.categories.map((cat, i) => (
            <CategoryCard key={cat.name} cat={cat} index={i} />
          ))}
        </div>
      </div>

      {/* ── Insights ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "48px" }}>

        {/* Strengths */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "32px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
            <span style={{ color: "#10B981", fontSize: "14px", fontWeight: 700 }}>✓</span>
            <span className="font-label" style={{ fontSize: "10px", color: "#10B981" }}>Strengths</span>
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "14px" }}>
            {report.strengths.map((s, i) => (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <span style={{ color: "#10B981", fontSize: "5px", marginTop: "8px", flexShrink: 0 }}>●</span>
                <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.9rem", color: "#CBD5E1", lineHeight: 1.65, fontWeight: 300 }}>
                  {s}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Areas to Improve */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          style={{ border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "32px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
            <span style={{ color: "#A78BFA", fontSize: "14px" }}>↗</span>
            <span className="font-label" style={{ fontSize: "10px", color: "#A78BFA" }}>Areas to Improve</span>
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "14px" }}>
            {report.areasToImprove.map((a, i) => (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <span style={{ color: "#A78BFA", fontSize: "5px", marginTop: "8px", flexShrink: 0 }}>●</span>
                <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.9rem", color: "#CBD5E1", lineHeight: 1.65, fontWeight: 300 }}>
                  {a}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* ── Notable Exchanges ── */}
      {report.notableExchanges?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ marginBottom: "48px" }}
        >
          <span className="font-label" style={{ fontSize: "10px", color: "#475569", display: "block", marginBottom: "20px" }}>
            Notable Exchanges
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {report.notableExchanges.map((ex, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: "12px", padding: "20px 24px",
              }}>
                <p className="font-label" style={{ fontSize: "9px", color: "#A78BFA", marginBottom: "8px" }}>
                  Alex asked
                </p>
                <p style={{
                  fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#94A3B8",
                  margin: "0 0 10px", fontStyle: "italic", lineHeight: 1.6,
                }}>
                  &ldquo;{ex.question}&rdquo;
                </p>
                <p style={{
                  fontFamily: "var(--font-inter)", fontSize: "0.875rem",
                  color: "#CBD5E1", margin: 0, fontWeight: 300, lineHeight: 1.65,
                }}>
                  {ex.summary}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Interviewer's Assessment ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        style={{
          background: "rgba(124,58,237,0.05)", borderLeft: "2px solid #8B5CF6",
          padding: "32px", borderRadius: "0 12px 12px 0", marginBottom: "64px",
        }}
      >
        <span className="font-label" style={{ fontSize: "10px", color: "#8B5CF6", display: "block", marginBottom: "16px" }}>
          Interviewer's Assessment
        </span>
        <p style={{
          fontFamily: "var(--font-inter)", fontSize: "1rem",
          color: "#CBD5E1", margin: 0, lineHeight: 1.85, fontWeight: 300,
        }}>
          {report.interviewerAssessment}
        </p>
      </motion.div>

      {/* ── Action bar ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        style={{
          borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "32px",
          display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap",
        }}
      >
        <motion.button
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => downloadReport(session, report)}
          style={{
            padding: "13px 28px", borderRadius: "9999px",
            background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
            color: "#fff", fontSize: "0.9375rem", fontWeight: 500,
            border: "none", cursor: "pointer", fontFamily: "var(--font-inter)",
            boxShadow: "0 0 28px rgba(124,58,237,0.35)",
          }}
        >
          Download Report
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { window.location.href = "/upload"; }}
          style={{
            padding: "13px 28px", borderRadius: "9999px",
            background: "transparent", border: "1px solid rgba(139,92,246,0.35)",
            color: "#A78BFA", fontSize: "0.9375rem", fontWeight: 500,
            cursor: "pointer", fontFamily: "var(--font-inter)",
          }}
        >
          Start New Session
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { window.location.href = "/dashboard"; }}
          style={{
            padding: "13px 28px", borderRadius: "9999px",
            background: "transparent", border: "1px solid rgba(255,255,255,0.07)",
            color: "#64748B", fontSize: "0.9375rem", fontWeight: 500,
            cursor: "pointer", fontFamily: "var(--font-inter)",
            marginLeft: "auto",
          }}
        >
          Dashboard
        </motion.button>
      </motion.div>
    </div>
  );
}
