// ALEX voice: Adam (ElevenLabs) — professional, clear, authoritative
const VOICE_ID = "pNInz6obpgDQGcFmaJgB";

export async function POST(request: Request) {
  const { text } = (await request.json()) as { text: string };
  if (!text) return Response.json({ error: "No text" }, { status: 400 });

  const upstream = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream`,
    {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY!,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_flash_v2_5",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0,
          use_speaker_boost: true,
        },
        output_format: "mp3_44100_128",
      }),
    }
  );

  if (!upstream.ok) {
    const err = await upstream.text();
    console.error("[elevenlabs] error:", upstream.status, err);
    return Response.json({ error: "TTS upstream failed" }, { status: 502 });
  }

  return new Response(upstream.body, {
    headers: { "Content-Type": "audio/mpeg" },
  });
}
