"use server";

import { createServerClient } from "@/lib/supabase/server";

export async function uploadResume(formData: FormData) {
  const file = formData.get("file") as File;
  const userId = formData.get("userId") as string;

  if (!file || !userId) return { error: "Missing file or user" };

  const ext = file.name.split(".").pop()?.toLowerCase();
  if (!["pdf", "docx"].includes(ext ?? "")) return { error: "Only PDF and DOCX files are allowed" };
  if (file.size > 10 * 1024 * 1024) return { error: "File must be under 10MB" };

  const supabase = createServerClient();
  const path = `${userId}/${Date.now()}_${file.name.replace(/\s+/g, "_")}`;

  const { error: storageError } = await supabase.storage
    .from("resumes")
    .upload(path, file, { upsert: true });

  if (storageError) return { error: storageError.message };

  const { data, error: dbError } = await supabase
    .from("resumes")
    .insert({ user_id: userId, file_path: path, original_name: file.name })
    .select("id")
    .single();

  if (dbError) return { error: dbError.message };

  return { resumeId: data.id as string, filePath: path };
}
