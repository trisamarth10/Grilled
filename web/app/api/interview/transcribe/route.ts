import { DeepgramClient } from "@deepgram/sdk";

const deepgram = new DeepgramClient({ apiKey: process.env.DEEPGRAM_API_KEY! });

export async function POST(request: Request) {
  const formData = await request.formData();
  const audio = formData.get("audio") as File;
  if (!audio) return Response.json({ error: "No audio" }, { status: 400 });

  const t = Date.now();
  const arrayBuffer = await audio.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = await deepgram.listen.v1.media.transcribeFile(
      buffer,
      { model: "nova-2", language: "en", smart_format: true }
    );

    const whisperMs = Date.now() - t;
    const text: string = result?.results?.channels?.[0]?.alternatives?.[0]?.transcript ?? "";
    return Response.json({ text, whisperMs });
  } catch (err) {
    console.error("[deepgram] error:", err);
    return Response.json({ error: "Transcription failed" }, { status: 502 });
  }
}
