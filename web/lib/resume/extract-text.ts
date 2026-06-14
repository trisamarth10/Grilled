import mammoth from "mammoth";

// Import from internal lib path to skip pdf-parse's self-test (which fails in Next.js)
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require("pdf-parse/lib/pdf-parse") as (buffer: Buffer) => Promise<{ text: string }>;

export async function extractTextFromResume(buffer: Buffer, filename: string): Promise<string> {
  const ext = filename.split(".").pop()?.toLowerCase();

  if (ext === "pdf") {
    const result = await pdfParse(buffer);
    return result.text.trim();
  }

  if (ext === "docx") {
    const result = await mammoth.extractRawText({ buffer });
    return result.value.trim();
  }

  throw new Error(`Unsupported file type: ${ext}`);
}
