import { createFileRoute } from "@tanstack/react-router";
import { Search, Sparkles, Lightbulb } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AiDisclaimer } from "@/components/ai-disclaimer";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { researchTopic } from "@/lib/ai.functions";

export const Route = createFileRoute("/research-assistant")({
  head: () => ({
    meta: [
      { title: "Research Assistant — Assistly AI" },
      {
        name: "description",
        content: "Get structured research briefs with key points and actionable recommendations.",
      },
      { property: "og:title", content: "Research Assistant — Assistly AI" },
      {
        property: "og:description",
        content: "Paste a topic or article and receive a concise summary with recommendations.",
      },
    ],
  }),
  component: ResearchAssistant,
});

function ResearchAssistant() {
  const [content, setContent] = useState("");
  const [brief, setBrief] = useState<{
    title: string;
    summary: string[];
    recommendations: string[];
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!content.trim()) {
      toast.error("Enter a topic or paste an article first.");
      return;
    }
    setLoading(true);
    try {
      const result = await researchTopic({ data: { content: content.trim() } });
      setBrief(result);
      toast.success("Research brief ready.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Search}
        title="Research Assistant"
        description="Concise summaries and actionable recommendations on any topic."
      />

      <div className="surface-card space-y-4 p-5">
        <div className="space-y-2">
          <Label htmlFor="research-input">Topic, question, or article text</Label>
          <Textarea
            id="research-input"
            placeholder="e.g. SaaS pricing trends for mid-market teams — or paste an article to summarize."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-36"
          />
        </div>
        <div className="flex justify-end">
          <Button onClick={run} disabled={loading}>
            <Sparkles className="size-4" />
            {loading ? "Researching…" : "Research"}
          </Button>
        </div>
      </div>

      {brief ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="surface-card p-5">
            <h2 className="text-base font-semibold">Summary — {brief.title}</h2>
            <ol className="mt-4 space-y-3">
              {brief.summary.map((s, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-primary-soft text-xs font-semibold text-accent-foreground">
                    {i + 1}
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="surface-card p-5">
            <h2 className="text-base font-semibold">Recommendations</h2>
            <ul className="mt-4 space-y-3">
              {brief.recommendations.map((r, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <Lightbulb className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="surface-card p-10 text-center">
          <p className="text-sm text-muted-foreground">
            Enter a topic above to generate a research brief.
          </p>
        </div>
      )}

      <AiDisclaimer />
    </div>
  );
}
