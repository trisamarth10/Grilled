import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  const { text } = (await request.json()) as { text: string };
  if (!text) return Response.json({ error: "No text" }, { status: 400 });

  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "onyx",
    input: text,
    response_format: "mp3",
    speed: 1.0,
  });

  const buffer = Buffer.from(await mp3.arrayBuffer());
  return new Response(buffer, {
    headers: { "Content-Type": "audio/mpeg" },
  });
}
