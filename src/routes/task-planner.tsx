import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AiDisclaimer } from "@/components/ai-disclaimer";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { planTasks } from "@/lib/ai.functions";

export const Route = createFileRoute("/task-planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Assistly AI" },
      {
        name: "description",
        content: "Turn a task list into a prioritized schedule with AI-suggested time blocks.",
      },
      { property: "og:title", content: "AI Task Planner — Assistly AI" },
      {
        property: "og:description",
        content: "Prioritize tasks by urgency and importance with a realistic AI-generated schedule.",
      },
    ],
  }),
  component: TaskPlanner,
});

type Block = {
  timeBlock: string;
  task: string;
  priority: "High" | "Medium" | "Low";
  rationale: string;
};

const priorityTone: Record<string, string> = {
  High: "bg-destructive/10 text-destructive",
  Medium: "bg-primary-soft text-accent-foreground",
  Low: "bg-muted text-muted-foreground",
};

function TaskPlanner() {
  const [tasks, setTasks] = useState("");
  const [horizon, setHorizon] = useState<"Today" | "This Week">("Today");
  const [overview, setOverview] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!tasks.trim()) {
      toast.error("List at least one task first.");
      return;
    }
    setLoading(true);
    try {
      const result = await planTasks({ data: { tasks: tasks.trim(), horizon } });
      setOverview(result.overview);
      setBlocks(result.blocks);
      toast.success("Schedule generated.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={CalendarClock}
        title="AI Task Planner"
        description="Turn a list of tasks into a prioritized, realistic schedule."
      />

      <div className="surface-card space-y-4 p-5">
        <div className="space-y-2">
          <Label htmlFor="tasks">Your tasks (one per line)</Label>
          <Textarea
            id="tasks"
            placeholder={"Finalize onboarding copy\nReview Q3 budget figures\nSend follow-up to Northwind Group"}
            value={tasks}
            onChange={(e) => setTasks(e.target.value)}
            className="min-h-36"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <div className="space-y-2 sm:max-w-56">
            <Label>Plan for</Label>
            <Select value={horizon} onValueChange={(v) => setHorizon(v as "Today" | "This Week")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Today">Today</SelectItem>
                <SelectItem value="This Week">This Week</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={generate} disabled={loading}>
            <Sparkles className="size-4" />
            {loading ? "Generating…" : "Generate Schedule"}
          </Button>
        </div>
      </div>

      {blocks.length > 0 && (
        <div className="space-y-4">
          {overview && (
            <div className="surface-card p-5">
              <h2 className="text-base font-semibold">Overview</h2>
              <p className="mt-2 text-sm text-muted-foreground">{overview}</p>
            </div>
          )}
          <ol className="space-y-3">
            {blocks.map((b, i) => (
              <li key={`${b.timeBlock}-${i}`} className="surface-card grid gap-3 p-4 sm:grid-cols-[10rem_minmax(0,1fr)]">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <CalendarClock className="size-4 shrink-0" />
                  <span>{b.timeBlock}</span>
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium">{b.task}</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityTone[b.priority] ?? "bg-muted text-muted-foreground"}`}
                    >
                      {b.priority}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{b.rationale}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      <AiDisclaimer />
    </div>
  );
}
