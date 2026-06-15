"use server";

import { createServerClient } from "@/lib/supabase/server";
import type { ResumeAnalysis, InterviewPlan } from "@/lib/resume/analyze-resume";

export interface SessionReport {
  overallScore: number;
  letterGrade: string;
  hiringSuggestion: "Hire" | "Lean Hire" | "Lean No Hire" | "No Hire";
  hiringRationale: string;
  categories: {
    name: string;
    score: number;
    feedback: string;
    evidence: string;
  }[];
  strengths: string[];
  areasToImprove: string[];
  interviewerAssessment: string;
  notableExchanges: {
    question: string;
    summary: string;
  }[];
  generatedAt: string;
}

export interface SessionData {
  id: string;
  difficulty: string;
  targetCompany: string | null;
  resumeAnalysis: ResumeAnalysis;
  interviewPlan: InterviewPlan;
  durationSeconds: number | null;
  report: SessionReport | null;
}

export async function getSession(sessionId: string): Promise<SessionData | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("sessions")
    .select("id, difficulty, target_company, resume_analysis, interview_plan, duration_seconds, report")
    .eq("id", sessionId)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    difficulty: data.difficulty,
    targetCompany: data.target_company,
    resumeAnalysis: data.resume_analysis as ResumeAnalysis,
    interviewPlan: data.interview_plan as InterviewPlan,
    durationSeconds: data.duration_seconds ?? null,
    report: data.report as SessionReport | null,
  };
}

export async function markSessionEnded(
  sessionId: string,
  transcript: { role: string; content: string }[],
  durationSeconds: number,
) {
  const supabase = createServerClient();
  await supabase
    .from("sessions")
    .update({
      status: "completed",
      transcript,
      duration_seconds: durationSeconds,
      ended_at: new Date().toISOString(),
    })
    .eq("id", sessionId);
}
