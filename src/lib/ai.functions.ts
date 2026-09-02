import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const EmailInput = z.object({
  keyPoints: z.string().min(1),
  tone: z.enum(["Formal", "Friendly", "Persuasive"]),
});

const MeetingInput = z.object({
  notes: z.string().min(1),
});

const PlanInput = z.object({
  tasks: z.string().min(1),
  horizon: z.enum(["Today", "This Week"]),
});

const ResearchInput = z.object({
  content: z.string().min(1),
});

const ChatInput = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        text: z.string().min(1),
      }),
    )
    .min(1),
});

type GatewayContent = { type?: string; text?: string };
type GatewayOutput = { type?: string; content?: GatewayContent[] };
type GatewayMessage = { role: "system" | "user" | "assistant"; content: string };

function getApiKey() {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI is not configured for this app.");
  return apiKey;
}

async function callGateway(body: Record<string, unknown>) {
  const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": getApiKey(),
    },
    body: JSON.stringify({ model: "openai/gpt-5.6-sol", reasoning: { effort: "low" }, ...body }),
  });

  if (!res.ok) {
    const raw = await res.text();
    let message = raw;
    try {
      message = (JSON.parse(raw) as { error?: { message?: string } }).error?.message ?? raw;
    } catch {
      // keep raw body
    }
    if (res.status === 429) {
      throw new Error("Too many requests right now. Please wait a moment and try again.");
    }
    if (res.status === 402) {
      throw new Error(message || "AI credits are exhausted. Please add credits to continue.");
    }
    throw new Error(message || `AI request failed (${res.status}).`);
  }

  const json = (await res.json()) as { output_text?: string; output?: GatewayOutput[] };
  const text =
    json.output_text ??
    (json.output ?? [])
      .filter((o) => o.type === "message")
      .flatMap((o) => o.content ?? [])
      .filter((c) => c.type === "output_text" || typeof c.text === "string")
      .map((c) => c.text ?? "")
      .join("\n")
      .trim();

  if (!text) throw new Error("The AI returned an empty response. Please try again.");
  return text;
}

async function callGatewayJson<T>(body: Record<string, unknown>): Promise<T> {
  const raw = await callGateway(body);
  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new Error("The AI returned an unexpected format. Please try again.");
  }
}

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }) => {
    const email = await callGateway({
      input: [
        {
          role: "system",
          content:
            "You are an expert workplace communication assistant. Return only the email text, starting with a 'Subject:' line. No commentary, no markdown fences.",
        },
        {
          role: "user",
          content: `Write a professional email based on these key points, using a ${data.tone} tone. Include a subject line.\n\nKey points:\n${data.keyPoints}`,
        },
      ] satisfies GatewayMessage[],
    });
    return { email };
  });

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => MeetingInput.parse(input))
  .handler(async ({ data }) => {
    const parsed = await callGatewayJson<{
      decisions: string[];
      actionItems: { task: string; owner: string | null }[];
      deadlines: string[];
    }>({
      input: [
        {
          role: "system",
          content:
            "You summarize workplace meeting notes. Return only JSON matching the requested schema. Use empty arrays for sections the notes do not mention.",
        },
        {
          role: "user",
          content: `Summarize these meeting notes into: 1) Key Decisions, 2) Action Items (with owner if mentioned), 3) Deadlines mentioned. Format as clear bullet points under each heading.\n\nMeeting notes:\n${data.notes}`,
        },
      ] satisfies GatewayMessage[],
      text: {
        format: {
          type: "json_schema",
          name: "meeting_summary",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            required: ["decisions", "actionItems", "deadlines"],
            properties: {
              decisions: { type: "array", items: { type: "string" } },
              actionItems: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  required: ["task", "owner"],
                  properties: {
                    task: { type: "string" },
                    owner: { type: ["string", "null"] },
                  },
                },
              },
              deadlines: { type: "array", items: { type: "string" } },
            },
          },
        },
      },
    });

    return {
      decisions: parsed.decisions ?? [],
      actionItems: parsed.actionItems ?? [],
      deadlines: parsed.deadlines ?? [],
    };
  });

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PlanInput.parse(input))
  .handler(async ({ data }) => {
    const parsed = await callGatewayJson<{
      overview: string;
      blocks: {
        timeBlock: string;
        task: string;
        priority: "High" | "Medium" | "Low";
        rationale: string;
      }[];
    }>({
      input: [
        {
          role: "system",
          content:
            "You are a workplace productivity planner. Return only JSON matching the requested schema. Time blocks must be realistic and in chronological order.",
        },
        {
          role: "user",
          content: `Given this list of tasks, prioritize them by urgency and importance, then create a realistic schedule with suggested time blocks. Explain briefly why each task was prioritized where it was.\n\nPlan for: ${data.horizon}\n\nTasks:\n${data.tasks}`,
        },
      ] satisfies GatewayMessage[],
      text: {
        format: {
          type: "json_schema",
          name: "task_schedule",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            required: ["overview", "blocks"],
            properties: {
              overview: { type: "string" },
              blocks: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  required: ["timeBlock", "task", "priority", "rationale"],
                  properties: {
                    timeBlock: { type: "string" },
                    task: { type: "string" },
                    priority: { type: "string", enum: ["High", "Medium", "Low"] },
                    rationale: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    });

    return { overview: parsed.overview ?? "", blocks: parsed.blocks ?? [] };
  });

export const researchTopic = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ResearchInput.parse(input))
  .handler(async ({ data }) => {
    const parsed = await callGatewayJson<{
      title: string;
      summary: string[];
      recommendations: string[];
    }>({
      input: [
        {
          role: "system",
          content:
            "You are a workplace research assistant. Return only JSON matching the requested schema.",
        },
        {
          role: "user",
          content: `Summarize this topic/article in 3-4 key points, then provide 2-3 actionable insights or recommendations related to it.\n\nInput:\n${data.content}`,
        },
      ] satisfies GatewayMessage[],
      text: {
        format: {
          type: "json_schema",
          name: "research_brief",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            required: ["title", "summary", "recommendations"],
            properties: {
              title: { type: "string" },
              summary: { type: "array", items: { type: "string" } },
              recommendations: { type: "array", items: { type: "string" } },
            },
          },
        },
      },
    });

    return {
      title: parsed.title ?? "Research brief",
      summary: parsed.summary ?? [],
      recommendations: parsed.recommendations ?? [],
    };
  });

export const chatReply = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => {
    const reply = await callGateway({
      input: [
        {
          role: "system",
          content:
            "You are a helpful workplace productivity assistant. Answer questions about scheduling, emails, tasks, and general work advice concisely and professionally.",
        },
        ...data.messages.map((m) => ({ role: m.role, content: m.text })),
      ] satisfies GatewayMessage[],
    });
    return { reply };
  });
