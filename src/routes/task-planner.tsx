import { createFileRoute } from "@tanstack/react-router";
import { ListChecks, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/task-planner")({
  head: () => ({
    meta: [
      { title: "Task Planner — Assistly AI" },
      {
        name: "description",
        content: "Plan your week with prioritized, AI-assisted tasks you can check off.",
      },
      { property: "og:title", content: "Task Planner — Assistly AI" },
      {
        property: "og:description",
        content: "Break goals into prioritized tasks and track progress in one clean board.",
      },
    ],
  }),
  component: TaskPlanner,
});

type Priority = "high" | "medium" | "low";
type Task = { id: number; title: string; priority: Priority; done: boolean };

const seed: Task[] = [
  { id: 1, title: "Finalize onboarding copy", priority: "high", done: false },
  { id: 2, title: "Review Q3 budget figures", priority: "medium", done: false },
  { id: 3, title: "Send follow-up to Northwind Group", priority: "high", done: true },
  { id: 4, title: "Prep research brief on pricing", priority: "low", done: false },
];

const tone: Record<Priority, string> = {
  high: "bg-destructive/10 text-destructive",
  medium: "bg-primary-soft text-accent-foreground",
  low: "bg-muted text-muted-foreground",
};

function TaskPlanner() {
  const [tasks, setTasks] = useState<Task[]>(seed);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");

  const add = () => {
    if (!title.trim()) return;
    setTasks((t) => [{ id: Date.now(), title: title.trim(), priority, done: false }, ...t]);
    setTitle("");
  };

  const done = tasks.filter((t) => t.done).length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ListChecks}
        title="Task Planner"
        description="Prioritize the week and keep momentum."
        action={
          <Badge variant="secondary" className="shrink-0">
            {done}/{tasks.length} done
          </Badge>
        }
      />

      <div className="surface-card grid gap-3 p-5 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
        <Input
          placeholder="Add a task…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
        />
        <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
          <SelectTrigger className="sm:w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={add}>
          <Plus className="size-4" /> Add task
        </Button>
      </div>

      <ul className="space-y-3">
        {tasks.map((t) => (
          <li
            key={t.id}
            className="surface-card grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-4"
          >
            <Checkbox
              checked={t.done}
              onCheckedChange={() =>
                setTasks((list) =>
                  list.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)),
                )
              }
            />
            <span
              className={`min-w-0 truncate text-sm ${t.done ? "text-muted-foreground line-through" : ""}`}
            >
              {t.title}
            </span>
            <div className="flex shrink-0 items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${tone[t.priority]}`}
              >
                {t.priority}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTasks((list) => list.filter((x) => x.id !== t.id))}
                aria-label={`Delete ${t.title}`}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
