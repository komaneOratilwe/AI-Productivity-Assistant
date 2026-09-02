import { createFileRoute } from "@tanstack/react-router";
import { NotebookPen, Sparkles, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/meeting-summarizer")({
  head: () => ({
    meta: [
      { title: "Meeting Summarizer — Assistly AI" },
      {
        name: "description",
        content: "Paste a transcript and get key decisions, action items and owners in seconds.",
      },
      { property: "og:title", content: "Meeting Summarizer — Assistly AI" },
      {
        property: "og:description",
        content: "Turn long meeting transcripts into a clear summary with owners and next steps.",
      },
    ],
  }),
  component: MeetingSummarizer,
});

type Summary = { points: string[]; actions: { task: string; owner: string }[] };

function MeetingSummarizer() {
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(false);

  const run = () => {
    if (transcript.trim().length < 20) {
      toast.error("Paste a longer transcript to summarize.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setSummary({
        points: [
          "Team aligned on shipping the new onboarding flow before month end.",
          "Budget for paid acquisition is held flat until Q4 review.",
          "Support backlog is the top blocker for the customer NPS goal.",
        ],
        actions: [
          { task: "Finalize onboarding copy and hand off to design", owner: "Sarah" },
          { task: "Draft Q4 acquisition proposal with two scenarios", owner: "Miguel" },
          { task: "Set up weekly support backlog triage", owner: "Oratilwe" },
        ],
      });
      setLoading(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={NotebookPen}
        title="Meeting Summarizer"
        description="Decisions, action items and owners from any transcript."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="surface-card space-y-4 p-5">
          <h2 className="text-base font-semibold">Transcript</h2>
          <Textarea
            rows={14}
            placeholder="Paste your meeting transcript or notes here…"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
          />
          <Button onClick={run} disabled={loading} className="w-full">
            <Sparkles className="size-4" />
            {loading ? "Summarizing…" : "Summarize meeting"}
          </Button>
        </div>

        <div className="surface-card space-y-5 p-5">
          <h2 className="text-base font-semibold">Summary</h2>
          {summary ? (
            <>
              <ul className="space-y-2">
                {summary.points.map((p) => (
                  <li key={p} className="flex gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <div>
                <p className="text-sm font-semibold">Action items</p>
                <ul className="mt-2 space-y-2">
                  {summary.actions.map((a) => (
                    <li
                      key={a.task}
                      className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl bg-muted/60 p-3"
                    >
                      <span className="min-w-0 text-sm">{a.task}</span>
                      <Badge variant="secondary" className="shrink-0">
                        {a.owner}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Your summary and action items will appear here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
