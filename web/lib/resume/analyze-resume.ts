import { openai } from "@/lib/ai/openai";

export interface ResumeAnalysis {
  name: string;
  role: string;
  summary: string;
  experience: { company: string; title: string; duration: string; highlights: string[] }[];
  projects: { name: string; description: string; technologies: string[] }[];
  skills: string[];
  achievements: string[];
}

export interface InterviewPlan {
  openingQuestion: string;
  topics: {
    area: string;
    questions: string[];
    depth: "surface" | "deep";
  }[];
  redFlags: string[];
  strongPoints: string[];
}

const DIFFICULTY_CONTEXT: Record<string, string> = {
  Internship: "The candidate is applying for an internship. Adjust expectations accordingly — focus on potential, learning ability, and foundational projects. Be relatively approachable.",
  "New Grad": "The candidate is a new graduate. Focus on academic projects, internships, and early career work. Probe for depth where present.",
  "Mid-Level": "The candidate has 2-5 years of experience. Expect ownership of projects, technical decisions, and measurable impact. Be thorough.",
  Senior: "The candidate is applying for a senior role. Expect deep technical expertise, leadership, mentorship, system design thinking, and significant impact. Be rigorous.",
};

export async function analyzeResume(
  resumeText: string,
  difficulty: string,
  targetCompany?: string,
): Promise<{ analysis: ResumeAnalysis; plan: InterviewPlan }> {
  const companyContext = targetCompany
    ? `The candidate is targeting ${targetCompany}. Calibrate question difficulty and cultural expectations accordingly.`
    : "";

  const prompt = `You are a senior technical recruiter at a top-tier technology company. Analyze the following resume and generate a structured interview plan.

DIFFICULTY LEVEL: ${difficulty}
${DIFFICULTY_CONTEXT[difficulty] ?? ""}
${companyContext}

RESUME:
${resumeText}

Return a JSON object with exactly this structure:
{
  "analysis": {
    "name": "candidate full name",
    "role": "most recent or target role",
    "summary": "2-sentence professional summary",
    "experience": [
      { "company": "", "title": "", "duration": "", "highlights": ["", ""] }
    ],
    "projects": [
      { "name": "", "description": "", "technologies": [""] }
    ],
    "skills": [""],
    "achievements": [""]
  },
  "plan": {
    "openingQuestion": "A specific, personalized opening question referencing something from their resume",
    "topics": [
      {
        "area": "topic name (e.g. 'Project: PaymentService refactor')",
        "questions": ["specific question 1", "specific question 2", "follow-up probing question"],
        "depth": "surface" | "deep"
      }
    ],
    "redFlags": ["anything vague, inconsistent, or worth probing in this resume"],
    "strongPoints": ["genuinely impressive things worth exploring further"]
  }
}

Generate 6-8 topics in the plan. Make every question specific to THIS resume — no generic questions. Return only valid JSON, no markdown.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
    response_format: { type: "json_object" },
  });

  const raw = response.choices[0].message.content ?? "{}";
  return JSON.parse(raw) as { analysis: ResumeAnalysis; plan: InterviewPlan };
}
