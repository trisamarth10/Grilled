"use server";

import { createServerClient } from "@/lib/supabase/server";

export interface PastSession {
  id: string;
  createdAt: string;
  difficulty: string;
  targetCompany: string | null;
  role: string | null;
  durationSeconds: number | null;
  hiringSuggestion: string | null;
  overallScore: number | null;
}

export async function getPastSessions(userId: string): Promise<PastSession[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("sessions")
    .select("id, created_at, difficulty, target_company, resume_analysis, duration_seconds, report")
    .eq("user_id", userId)
    .eq("status", "completed")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    createdAt: row.created_at,
    difficulty: row.difficulty,
    targetCompany: row.target_company ?? null,
    role: (row.resume_analysis as { role?: string } | null)?.role ?? null,
    durationSeconds: row.duration_seconds ?? null,
    hiringSuggestion: (row.report as { hiringSuggestion?: string } | null)?.hiringSuggestion ?? null,
    overallScore: (row.report as { overallScore?: number } | null)?.overallScore ?? null,
  }));
}
