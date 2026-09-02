import { createFileRoute } from "@tanstack/react-router";
import { Bot, Send, User } from "lucide-react";
import { useState } from "react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/chatbot")({
  head: () => ({
    meta: [
      { title: "AI Chatbot — Assistly AI" },
      {
        name: "description",
        content: "Chat with your workplace AI assistant to plan, write and solve problems faster.",
      },
      { property: "og:title", content: "AI Chatbot — Assistly AI" },
      {
        property: "og:description",
        content: "A conversational assistant for everyday workplace questions and drafting.",
      },
    ],
  }),
  component: Chatbot,
});

type Msg = { id: number; role: "user" | "assistant"; text: string };

function Chatbot() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 1,
      role: "assistant",
      text: "Hi! I can help you draft messages, plan work, or think through a problem. What are you working on?",
    },
  ]);
  const [input, setInput] = useState("");

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    setMessages((m) => [...m, { id: Date.now(), role: "user", text }]);
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: `Here's how I'd approach "${text}": start by clarifying the outcome you need, then break it into two or three concrete steps you can finish today. Want me to turn that into tasks or a draft message?`,
        },
      ]);
    }, 600);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Bot}
        title="AI Chatbot"
        description="Ask anything about your work and iterate together."
      />

      <div className="surface-card flex h-[60vh] min-h-96 flex-col">
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`grid size-8 shrink-0 place-items-center rounded-xl ${
                  m.role === "user"
                    ? "bg-secondary text-secondary-foreground"
                    : "hero-gradient text-primary-foreground"
                }`}
              >
                {m.role === "user" ? <User className="size-4" /> : <Bot className="size-4" />}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                  m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 border-t border-border p-4">
          <Input
            placeholder="Message the assistant…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <Button onClick={send} aria-label="Send message">
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
