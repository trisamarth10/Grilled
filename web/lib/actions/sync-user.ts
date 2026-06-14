"use server";

import { createServerClient } from "@/lib/supabase/server";

export async function syncUser(params: {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
}) {
  const supabase = createServerClient();
  const { error } = await supabase.from("users").upsert(
    {
      id: params.id,
      email: params.email,
      name: params.name,
      avatar_url: params.avatarUrl,
    },
    { onConflict: "id" },
  );
  if (error) console.error("[syncUser]", error.message);
}
