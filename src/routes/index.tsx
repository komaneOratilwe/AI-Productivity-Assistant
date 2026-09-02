import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Mail, NotebookPen, ListChecks, Search, Bot, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview — Assistly AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Your AI workspace overview: drafted emails, meeting summaries, task plans and research at a glance.",
      },
      { property: "og:title", content: "Overview — Assistly AI Workplace Assistant" },
      {
        property: "og:description",
        content: "Automate everyday workplace tasks with AI-powered tools in one dashboard.",
      },
    ],
  }),
  component: Overview,
});

const tools = [
  {
    title: "Email Generator",
    url: "/email-generator" as const,
    icon: Mail,
    desc: "Draft polished, on-brand emails in seconds from a short prompt.",
  },
  {
    title: "Meeting Summarizer",
    url: "/meeting-summarizer" as const,
    icon: NotebookPen,
    desc: "Turn transcripts into decisions, action items and owners.",
  },
  {
    title: "Task Planner",
    url: "/task-planner" as const,
    icon: ListChecks,
    desc: "Break goals into a prioritized, time-boxed plan for the week.",
  },
  {
    title: "Research Assistant",
    url: "/research-assistant" as const,
    icon: Search,
    desc: "Get structured briefs with key findings and sources to review.",
  },
  {
    title: "AI Chatbot",
    url: "/chatbot" as const,
    icon: Bot,
    desc: "Ask anything about your work and iterate in a conversation.",
  },
];

const stats = [
  { label: "Tasks automated", value: "128", hint: "+18 this week" },
  { label: "Hours saved", value: "26.5", hint: "≈ 3 workdays" },
  { label: "AI actions used", value: "1,240", hint: "of 5,000" },
  { label: "Active workflows", value: "7", hint: "2 scheduled" },
];

function Overview() {
  return (
    <div className="space-y-8">
      <section className="hero-gradient rounded-3xl px-6 py-10 text-primary-foreground sm:px-10 sm:py-14">
        <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
          <Zap className="size-3.5" /> Wednesday focus mode
        </p>
        <h1 className="mt-4 max-w-2xl text-3xl font-bold sm:text-4xl">
          Welcome back — let AI handle the busywork.
        </h1>
        <p className="mt-3 max-w-xl text-sm/6 opacity-90">
          Generate emails, summarize meetings, plan your week and research faster. Pick a tool to
          get started.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild size="lg" variant="secondary">
            <Link to="/email-generator">
              Draft an email <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/40 bg-transparent text-primary-foreground hover:bg-white/15 hover:text-primary-foreground"
          >
            <Link to="/chatbot">Ask the assistant</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="surface-card p-5">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-2 text-2xl font-bold">{s.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.hint}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-lg font-semibold">Your AI tools</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <Link
              key={t.title}
              to={t.url}
              className="surface-card group p-5 transition-shadow hover:shadow-[var(--shadow-lift)]"
            >
              <div className="grid size-10 place-items-center rounded-xl bg-primary-soft text-accent-foreground">
                <t.icon className="size-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold">{t.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Open <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="surface-card p-5">
        <h2 className="text-lg font-semibold">Recent activity</h2>
        <ul className="mt-4 divide-y divide-border">
          {[
            { text: "Drafted follow-up email to Northwind Group", time: "12 min ago" },
            { text: "Summarized “Q3 Roadmap Sync” (48 min)", time: "1 hr ago" },
            { text: "Generated weekly plan with 9 tasks", time: "Yesterday" },
            { text: "Research brief: competitor pricing models", time: "2 days ago" },
          ].map((a) => (
            <li key={a.text} className="flex items-center justify-between gap-4 py-3">
              <span className="min-w-0 truncate text-sm">{a.text}</span>
              <span className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                <Clock className="size-3.5" />
                {a.time}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
