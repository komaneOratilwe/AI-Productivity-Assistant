import { createFileRoute } from "@tanstack/react-router";
import { Search, Sparkles, ExternalLink } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/research-assistant")({
  head: () => ({
    meta: [
      { title: "Research Assistant — Assistly AI" },
      {
        name: "description",
        content: "Get structured research briefs with key findings and sources to review.",
      },
      { property: "og:title", content: "Research Assistant — Assistly AI" },
      {
        property: "og:description",
        content: "Ask a question and receive a concise, structured brief with sources.",
      },
    ],
  }),
  component: ResearchAssistant,
});

function ResearchAssistant() {
  const [query, setQuery] = useState("");
  const [brief, setBrief] = useState<{ topic: string; findings: string[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const run = () => {
    if (!query.trim()) {
      toast.error("Enter a research topic first.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setBrief({
        topic: query.trim(),
        findings: [
          "The market is consolidating around usage-based pricing, with seat-based models retained for enterprise tiers.",
          "Buyers rank onboarding speed above feature depth when evaluating tools under $50/seat.",
          "Teams that automate reporting report roughly 20% less time spent in status meetings.",
          "Security review is the most common late-stage deal blocker for mid-market purchases.",
        ],
      });
      setLoading(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Search}
        title="Research Assistant"
        description="Concise briefs on any work topic, with sources."
      />

      <div className="surface-card grid gap-3 p-5 sm:grid-cols-[minmax(0,1fr)_auto]">
        <Input
          placeholder="e.g. SaaS pricing trends for mid-market teams"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && run()}
        />
        <Button onClick={run} disabled={loading}>
          <Sparkles className="size-4" />
          {loading ? "Researching…" : "Research"}
        </Button>
      </div>

      {brief ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="surface-card p-5">
            <h2 className="text-base font-semibold">Key findings — {brief.topic}</h2>
            <ol className="mt-4 space-y-3">
              {brief.findings.map((f, i) => (
                <li key={f} className="flex gap-3 text-sm">
                  <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-primary-soft text-xs font-semibold text-accent-foreground">
                    {i + 1}
                  </span>
                  <span>{f}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="surface-card p-5">
            <h2 className="text-base font-semibold">Suggested sources</h2>
            <ul className="mt-4 space-y-3">
              {["Industry pricing benchmark report", "Buyer survey summary", "Analyst market brief"].map(
                (s) => (
                  <li key={s} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ExternalLink className="size-4 shrink-0 text-primary" />
                    <span className="min-w-0 truncate">{s}</span>
                  </li>
                ),
              )}
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
    </div>
  );
}
