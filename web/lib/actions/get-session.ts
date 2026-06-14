"use server";

import { createServerClient } from "@/lib/supabase/server";
import type { ResumeAnalysis, InterviewPlan } from "@/lib/resume/analyze-resume";

export interface SessionData {
  id: string;
  difficulty: string;
  targetCompany: string | null;
  resumeAnalysis: ResumeAnalysis;
  interviewPlan: InterviewPlan;
}

export async function getSession(sessionId: string): Promise<SessionData | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("sessions")
    .select("id, difficulty, target_company, resume_analysis, interview_plan")
    .eq("id", sessionId)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    difficulty: data.difficulty,
    targetCompany: data.target_company,
    resumeAnalysis: data.resume_analysis as ResumeAnalysis,
    interviewPlan: data.interview_plan as InterviewPlan,
  };
}

export async function markSessionEnded(sessionId: string, transcript: { role: string; content: string }[]) {
  const supabase = createServerClient();
  await supabase
    .from("sessions")
    .update({ status: "completed", transcript, ended_at: new Date().toISOString() })
    .eq("id", sessionId);
}
