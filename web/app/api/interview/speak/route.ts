// ─── Switch TTS provider here ─────────────────────────────────────────────────
const TTS_PROVIDER: "elevenlabs" | "deepgram" = "deepgram";
// ─────────────────────────────────────────────────────────────────────────────

const ELEVENLABS_VOICE_ID = "pNInz6obpgDQGcFmaJgB"; // Adam — deep, professional
const DEEPGRAM_MODEL      = "aura-asteria-en";

async function ttsElevenLabs(text: string): Promise<Response> {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}/stream`,
    {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_flash_v2_5",
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    }
  );
  if (!response.ok) {
    const err = await response.text();
    console.error("[tts] ElevenLabs error:", err);
    throw new Error(`ElevenLabs ${response.status}`);
  }
  return new Response(response.body, { headers: { "Content-Type": "audio/mpeg" } });
}

async function ttsDeepgram(text: string): Promise<Response> {
  const response = await fetch(
    `https://api.deepgram.com/v1/speak?model=${DEEPGRAM_MODEL}&encoding=mp3`,
    {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    }
  );
  if (!response.ok) {
    const err = await response.text();
    console.error("[tts] Deepgram error:", err);
    throw new Error(`Deepgram ${response.status}`);
  }
  return new Response(response.body, { headers: { "Content-Type": "audio/mpeg" } });
}

export async function POST(request: Request) {
  const { text } = (await request.json()) as { text: string };
  if (!text) return Response.json({ error: "No text" }, { status: 400 });

  try {
    return TTS_PROVIDER === "elevenlabs"
      ? await ttsElevenLabs(text)
      : await ttsDeepgram(text);
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
