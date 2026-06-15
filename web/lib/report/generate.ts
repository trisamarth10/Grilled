"use server";

import { openai } from "@/lib/ai/openai";
import { createServerClient } from "@/lib/supabase/server";
import type { SessionData, SessionReport } from "@/lib/actions/get-session";
import type { ResumeAnalysis } from "@/lib/resume/analyze-resume";

function buildTranscript(messages: { role: string; content: string }[]): string {
  return messages
    .map((m) => `${m.role === "assistant" ? "ALEX" : "CANDIDATE"}: ${m.content}`)
    .join("\n\n");
}

function buildResumeContext(analysis: ResumeAnalysis): string {
  const expLines = analysis.experience
    .map((e) => `  - ${e.title} at ${e.company} (${e.duration}): ${e.highlights.slice(0, 2).join("; ")}`)
    .join("\n");
  const projectLines = analysis.projects
    .map((p) => `  - ${p.name}: ${p.description} [${p.technologies.slice(0, 4).join(", ")}]`)
    .join("\n");
  return [
    `Name: ${analysis.name}`,
    `Role: ${analysis.role}`,
    `Summary: ${analysis.summary}`,
    `Experience:\n${expLines}`,
    `Projects:\n${projectLines}`,
    `Skills: ${analysis.skills.slice(0, 12).join(", ")}`,
    analysis.achievements.length
      ? `Achievements: ${analysis.achievements.slice(0, 4).join("; ")}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function buildPrompt(session: SessionData, messages: { role: string; content: string }[]): string {
  const durationMin = Math.round((session.durationSeconds ?? 0) / 60);
  const transcript = buildTranscript(messages);
  const resumeCtx = buildResumeContext(session.resumeAnalysis);

  return `You are a senior engineering hiring manager at a top-tier technology company.
You just completed a live behavioral interview with a software engineering candidate.
Your job is to produce a comprehensive, personalized hiring evaluation based on the exact transcript.

━━━ CANDIDATE PROFILE ━━━
${resumeCtx}
Target Company: ${session.targetCompany ?? "top-tier tech company"}
Difficulty Level: ${session.difficulty}
Interview Duration: ${durationMin} minutes

━━━ FULL INTERVIEW TRANSCRIPT ━━━
${transcript}

━━━ EVALUATION INSTRUCTIONS ━━━
Evaluate this candidate based ONLY on what they actually said in the transcript.
Every piece of feedback must reference specific moments, specific answers, or specific language the candidate used.
Do NOT write generic feedback. If you cannot tie a feedback point to a specific transcript moment, you have not read carefully enough.
Quote or paraphrase specific things the candidate said. Name specific projects they discussed. Reference exact questions and how they responded.

Return a comprehensive hiring evaluation in this exact JSON structure:

{
  "overallScore": <integer 0-100>,
  "letterGrade": <"A+" | "A" | "A-" | "B+" | "B" | "B-" | "C+" | "C" | "C-" | "D" | "F">,
  "hiringSuggestion": <"Hire" | "Lean Hire" | "Lean No Hire" | "No Hire">,
  "hiringRationale": "<2-3 sentences that explain the hiring decision, referencing specific interview performance. Must be specific to this candidate, not generic.>",
  "categories": [
    {
      "name": "Behavioral Clarity",
      "score": <integer 0-100>,
      "feedback": "<5-6 sentences minimum. Assess whether their answers followed a clear situation-action-result structure. Did they give concrete, specific examples or stay high-level and abstract? Did they clearly distinguish their personal contribution from the team's? Did their answers have a beginning, middle, and end? Cite specific answers they gave — mention the actual project or situation they discussed.>",
      "evidence": "<A direct quote or specific paraphrase from the transcript that best illustrates their score in this dimension.>"
    },
    {
      "name": "Communication",
      "score": <integer 0-100>,
      "feedback": "<5-6 sentences minimum. How clearly did they express complex ideas under pressure? Were they concise or did they tend to ramble and lose the thread? Did they calibrate technical depth appropriately — not over-explaining basics, not glossing over complexity? Were their answers easy to follow or did they jump around? Reference specific moments where communication was strong or broke down.>",
      "evidence": "<Direct quote or paraphrase from the transcript.>"
    },
    {
      "name": "Self-Awareness",
      "score": <integer 0-100>,
      "feedback": "<5-6 sentences minimum. Did they acknowledge limitations or gaps in their knowledge when probed? Were they honest about failures, mistakes, or decisions that didn't go well? Did they show realistic assessment of their own contributions — neither inflating nor underselling? When they didn't know something, how did they handle it? Reference specific moments of honesty or evasion.>",
      "evidence": "<Direct quote or paraphrase from the transcript.>"
    },
    {
      "name": "Leadership Examples",
      "score": <integer 0-100>,
      "feedback": "<5-6 sentences minimum. Did they demonstrate initiative, ownership, and the ability to influence without formal authority? Did they give examples of leading through ambiguity or driving a project forward under pressure? Were their leadership examples specific and verifiable, or vague and generic? Did they take appropriate credit — neither claiming sole ownership of team work nor deflecting all credit away? Reference specific examples they gave.>",
      "evidence": "<Direct quote or paraphrase from the transcript.>"
    },
    {
      "name": "Technical Depth",
      "score": <integer 0-100>,
      "feedback": "<5-6 sentences minimum. Did they explain the 'why' behind technical decisions, not just the 'what'? When probed on specific technology choices, could they articulate trade-offs, alternatives they considered, and why they chose what they chose? Did they demonstrate knowledge of the limits and failure modes of technologies they claimed to use? Did their technical vocabulary match the depth of their explanations? Reference specific technical discussions from the interview.>",
      "evidence": "<Direct quote or paraphrase from the transcript.>"
    },
    {
      "name": "Structured Thinking",
      "score": <integer 0-100>,
      "feedback": "<5-6 sentences minimum. Did they frame problems clearly before diving into solutions? Were their answers logically organized with a clear progression of ideas? How did they handle ambiguous or open-ended questions — did they ask for clarification or make reasonable assumptions explicit? Did they stay on topic or drift? Reference specific moments where their structure was strong or where they visibly struggled to organize their thoughts.>",
      "evidence": "<Direct quote or paraphrase from the transcript.>"
    }
  ],
  "strengths": [
    "<Specific strength, 2-3 sentences. Reference the exact moment or answer that demonstrated this strength. Be precise — name the project, the question, or the specific thing they said.>",
    "<Second specific strength, 2-3 sentences with transcript reference.>",
    "<Third specific strength, 2-3 sentences with transcript reference.>",
    "<Fourth specific strength, 2-3 sentences with transcript reference.>"
  ],
  "areasToImprove": [
    "<Specific, actionable improvement area, 2-3 sentences. Reference where this weakness showed in the interview. Give concrete advice on what they should do differently.>",
    "<Second improvement area, 2-3 sentences with transcript reference and actionable advice.>",
    "<Third improvement area, 2-3 sentences with transcript reference and actionable advice.>",
    "<Fourth improvement area if warranted, 2-3 sentences with specific advice.>"
  ],
  "interviewerAssessment": "<A 7-8 sentence paragraph written exactly like a hiring committee debrief memo. Must reference specific parts of the interview by name — cite actual projects they discussed, specific questions that were revealing, specific answers that stood out positively or negatively. Give a clear-eyed, calibrated assessment of where this person sits relative to the ${session.difficulty} bar. Highlight the 1-2 things that most influenced your recommendation. If recommending against hiring, be specific about what would need to be true for you to change your mind. If recommending hire, note what risks or unknowns remain. This should feel like a senior engineer who sat in the room wrote it — not generic AI output.>",
  "notableExchanges": [
    {
      "question": "<The exact question or paraphrase of what ALEX asked>",
      "summary": "<2-3 sentences on what the candidate said, why it was notable, and what it revealed about them as a candidate — positively or negatively>"
    },
    {
      "question": "<Another notable exchange>",
      "summary": "<2-3 sentences>"
    },
    {
      "question": "<A third notable exchange>",
      "summary": "<2-3 sentences>"
    },
    {
      "question": "<A fourth exchange worth calling out>",
      "summary": "<2-3 sentences>"
    }
  ]
}

━━━ DIFFICULTY CALIBRATION ━━━
Internship: Bar is lower. Focus on potential, curiosity, foundational understanding. Scores of 70-80 indicate a strong intern candidate.
New Grad: Solid academic projects, early depth. 75-85 meets bar. Below 65 is likely a no hire.
Mid-Level (${session.difficulty === "Mid-Level" ? "← CURRENT" : ""}): Expects ownership, measurable impact, technical decisions. 70-80 meets bar. Below 65 is a no hire.
Senior (${session.difficulty === "Senior" ? "← CURRENT" : ""}): Architecture, scale, leadership, deep technical rigor. 80+ meets bar. Below 70 is a clear no hire.

━━━ CRITICAL ━━━
Return ONLY valid JSON. No markdown. No backticks. No explanation outside the JSON object. The JSON must be parseable with JSON.parse().`;
}

export async function generateReport(
  session: SessionData,
  messages: { role: string; content: string }[],
): Promise<SessionReport> {
  const prompt = buildPrompt(session, messages);

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    max_tokens: 4500,
    temperature: 0.4,
    response_format: { type: "json_object" },
    messages: [{ role: "user", content: prompt }],
  });

  const raw = response.choices[0].message.content ?? "";

  const cleaned = raw.trim();

  const parsed = JSON.parse(cleaned) as SessionReport;
  parsed.generatedAt = new Date().toISOString();

  // Save to Supabase
  const supabase = createServerClient();
  await supabase
    .from("sessions")
    .update({ report: parsed })
    .eq("id", session.id);

  return parsed;
}
