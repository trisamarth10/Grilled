"use server";

import { createServerClient } from "@/lib/supabase/server";
import { extractTextFromResume } from "@/lib/resume/extract-text";
import { analyzeResume } from "@/lib/resume/analyze-resume";

export async function processResume(params: {
  resumeId: string;
  filePath: string;
  fileName: string;
  difficulty: string;
  targetCompany?: string;
  userId: string;
}): Promise<{ sessionId: string } | { error: string }> {
  const supabase = createServerClient();

  // 1. Download file from Supabase Storage
  const { data: fileData, error: downloadError } = await supabase.storage
    .from("resumes")
    .download(params.filePath);

  if (downloadError || !fileData) {
    return { error: "Failed to download resume file" };
  }

  // 2. Extract text
  const buffer = Buffer.from(await fileData.arrayBuffer());
  let resumeText: string;
  try {
    resumeText = await extractTextFromResume(buffer, params.fileName);
  } catch {
    return { error: "Failed to extract text from resume" };
  }

  if (!resumeText || resumeText.length < 100) {
    return { error: "Resume appears to be empty or unreadable" };
  }

  // 3. Store extracted text on the resume record
  await supabase
    .from("resumes")
    .update({ extracted_text: resumeText })
    .eq("id", params.resumeId);

  // 4. Analyze resume + generate interview plan
  let analysis: Awaited<ReturnType<typeof analyzeResume>>;
  try {
    analysis = await analyzeResume(resumeText, params.difficulty, params.targetCompany);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[processResume] OpenAI error:", msg);
    return { error: `Failed to analyze resume: ${msg}` };
  }

  // 5. Create a session record with the plan attached
  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .insert({
      user_id: params.userId,
      resume_id: params.resumeId,
      difficulty: params.difficulty,
      target_company: params.targetCompany ?? null,
      resume_analysis: analysis.analysis,
      interview_plan: analysis.plan,
      status: "pending",
    })
    .select("id")
    .single();

  if (sessionError || !session) {
    return { error: "Failed to create session" };
  }

  return { sessionId: session.id as string };
}
