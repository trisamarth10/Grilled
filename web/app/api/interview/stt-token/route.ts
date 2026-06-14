// Returns the Deepgram API key for client-side WebSocket streaming STT.
// Route is protected by Clerk auth (middleware) — only signed-in users can call it.
export async function GET() {
  return Response.json({ key: process.env.DEEPGRAM_API_KEY });
}
