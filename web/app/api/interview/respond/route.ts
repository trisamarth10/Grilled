import OpenAI from "openai";

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});
import type { ResumeAnalysis, InterviewPlan } from "@/lib/resume/analyze-resume";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function buildSystemPrompt(
  plan: InterviewPlan,
  analysis: ResumeAnalysis,
  difficulty: string,
  company?: string | null,
): string {
  const topicList = plan.topics
    .map((t, i) => `${i + 1}. ${t.area}\n   Questions: ${t.questions.join(" | ")}\n   Depth: ${t.depth}`)
    .join("\n");

  return `You are ALEX, a senior interviewer at a top-tier technology company conducting a live behavioral interview.

CANDIDATE: ${analysis.name}
ROLE: ${analysis.role}
DIFFICULTY: ${difficulty}${company ? `\nTARGET COMPANY: ${company}` : ""}

RESUME SUMMARY:
${analysis.summary}

INTERVIEW PLAN — Topics to cover (work through these systematically):
${topicList}

RED FLAGS to probe: ${plan.redFlags.join(", ")}
STRONG POINTS to explore: ${plan.strongPoints.join(", ")}

RULES — you must follow these exactly:
- Ask ONLY ONE question per message. Never stack questions.
- Keep each response under 3 sentences unless doing a deep probe.
- Do NOT give positive feedback, coaching hints, or compliments mid-interview. ("Great answer!", "That's interesting!" — forbidden.)
- Be direct, professional, and evaluative. You are deciding whether to hire.
- When an answer is vague, push back specifically. ("You said the team disagreed — what exactly was your position and what did you do?")
- When an answer is strong, follow up deeper. Probe for scale, tradeoffs, what went wrong.
- Reference the candidate's actual resume details, not generic topics.
- Do not reveal the interview plan or tell the candidate what topic you're moving to.
- Speak naturally as a human interviewer — no bullet points, no formatting.
- Keep the interview moving. Don't linger on one topic more than 3 exchanges.`;
}

export async function POST(request: Request) {
  const { messages, plan, analysis, difficulty, company } = await request.json() as {
    messages: Message[];
    plan: InterviewPlan;
    analysis: ResumeAnalysis;
    difficulty: string;
    company?: string | null;
  };

  const systemPrompt = buildSystemPrompt(plan, analysis, difficulty, company);

  const stream = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      ...messages,
    ],
    temperature: 0.75,
    max_tokens: 180,
    stream: true,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const token = chunk.choices[0]?.delta?.content;
        if (token) controller.enqueue(encoder.encode(token));
      }
      controller.close();
    },
    cancel() {
      stream.controller.abort();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
