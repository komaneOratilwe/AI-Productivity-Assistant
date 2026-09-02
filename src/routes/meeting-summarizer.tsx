import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { NotebookPen, Sparkles, CheckCircle2, CalendarClock, ListChecks, Gavel } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { summarizeMeeting } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/meeting-summarizer")({
  head: () => ({
    meta: [
      { title: "Meeting Summarizer — Assistly AI" },
      {
        name: "description",
        content: "Paste a transcript and get key decisions, action items and deadlines in seconds.",
      },
      { property: "og:title", content: "Meeting Summarizer — Assistly AI" },
      {
        property: "og:description",
        content: "Turn long meeting notes into key decisions, action items and deadlines.",
      },
    ],
  }),
  component: MeetingSummarizer,
});

type Summary = {
  decisions: string[];
  actionItems: { task: string; owner: string | null }[];
  deadlines: string[];
};

function SectionHeading({ icon: Icon, children }: { icon: typeof Gavel; children: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="size-4 text-primary" />
      <h3 className="text-sm font-semibold tracking-normal">{children}</h3>
    </div>
  );
}

function EmptyHint({ children }: { children: string }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}

function MeetingSummarizer() {
  const runSummarize = useServerFn(summarizeMeeting);
  const [notes, setNotes] = useState("");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (notes.trim().length < 20) {
      toast.error("Paste longer meeting notes to summarize.");
      return;
    }
    setLoading(true);
    try {
      const result = await runSummarize({ data: { notes: notes.trim() } });
      setSummary(result);
      toast.success("Summary ready");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not summarize the notes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={NotebookPen}
        title="Meeting Summarizer"
        description="Decisions, action items and deadlines from any transcript."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="surface-card space-y-4 p-5">
          <h2 className="text-base font-semibold">Meeting notes</h2>
          <Textarea
            rows={14}
            aria-label="Raw meeting notes"
            placeholder="Paste your raw meeting transcript or notes here…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <Button onClick={run} disabled={loading} className="w-full">
            <Sparkles className="size-4" />
            {loading ? "Summarizing…" : "Summarize"}
          </Button>
        </div>

        <div className="surface-card space-y-5 p-5">
          <h2 className="text-base font-semibold">Summary</h2>
          {!summary ? (
            <EmptyHint>
              Your summary will appear here, split into key decisions, action items and deadlines.
            </EmptyHint>
          ) : (
            <div className="space-y-5">
              <section aria-label="Key decisions">
                <div className="flex items-center gap-2">
                  <Gavel className="size-4 text-primary" />
                  <h3 className="text-sm font-semibold">Key Decisions</h3>
                </div>
                {summary.decisions.length > 0 ? (
                  <ul className="mt-2 space-y-2">
                    {summary.decisions.map((d, i) => (
                      <li key={`${i}-${d}`} className="flex gap-2 text-sm">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyHint>No key decisions were mentioned in these notes.</EmptyHint>
                )}
              </section>

              <section aria-label="Action items">
                <div className="flex items-center gap-2">
                  <ListChecks className="size-4 text-primary" />
                  <h3 className="text-sm font-semibold">Action Items</h3>
                </div>
                {summary.actionItems.length > 0 ? (
                  <ul className="mt-2 space-y-2">
                    {summary.actionItems.map((a, i) => (
                      <li
                        key={`${i}-${a.task}`}
                        className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl bg-muted/60 p-3"
                      >
                        <span className="min-w-0 text-sm">{a.task}</span>
                        <Badge variant="secondary" className="shrink-0">
                          {a.owner ?? "Unassigned"}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyHint>No action items were captured from these notes.</EmptyHint>
                )}
              </section>

              <section aria-label="Deadlines mentioned">
                <div className="flex items-center gap-2">
                  <CalendarClock className="size-4 text-primary" />
                  <h3 className="text-sm font-semibold">Deadlines Mentioned</h3>
                </div>
                {summary.deadlines.length > 0 ? (
                  <ul className="mt-2 space-y-2">
                    {summary.deadlines.map((d, i) => (
                      <li
                        key={`${i}-${d}`}
                        className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2 text-sm"
                      >
                        <CalendarClock className="size-4 shrink-0 text-primary" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyHint>No deadlines were mentioned in these notes.</EmptyHint>
                )}
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
