import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const EmailInput = z.object({
  keyPoints: z.string().min(1),
  tone: z.enum(["Formal", "Friendly", "Persuasive"]),
});

const MeetingInput = z.object({
  notes: z.string().min(1),
});

type GatewayContent = { type?: string; text?: string };
type GatewayOutput = { type?: string; content?: GatewayContent[] };

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("AI is not configured for this app.");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
      },
      body: JSON.stringify({
        model: "openai/gpt-5.6-sol",
        reasoning: { effort: "low" },
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
        ],
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      let message = body;
      try {
        message = (JSON.parse(body) as { error?: { message?: string } }).error?.message ?? body;
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
    return { email: text };
  });

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => MeetingInput.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("AI is not configured for this app.");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
      },
      body: JSON.stringify({
        model: "openai/gpt-5.6-sol",
        reasoning: { effort: "low" },
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
        ],
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
                decisions: {
                  type: "array",
                  items: { type: "string" },
                },
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
                deadlines: {
                  type: "array",
                  items: { type: "string" },
                },
              },
            },
          },
        },
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      let message = body;
      try {
        message = (JSON.parse(body) as { error?: { message?: string } }).error?.message ?? body;
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

    const json = (await res.json()) as {
      output_text?: string;
      output?: GatewayOutput[];
    };
    const raw =
      json.output_text ??
      (json.output ?? [])
        .filter((o) => o.type === "message")
        .flatMap((o) => o.content ?? [])
        .filter((c) => c.type === "output_text" || typeof c.text === "string")
        .map((c) => c.text ?? "")
        .join("\n")
        .trim();
    let parsed: {
      decisions: string[];
      actionItems: { task: string; owner: string | null }[];
      deadlines: string[];
    };
    try {
      parsed = JSON.parse(raw) as typeof parsed;
    } catch {
      throw new Error("The AI returned an unexpected format. Please try again.");
    }

    return {
      decisions: parsed.decisions ?? [],
      actionItems: parsed.actionItems ?? [],
      deadlines: parsed.deadlines ?? [],
    };
  });
