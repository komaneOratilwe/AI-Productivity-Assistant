import { createFileRoute } from "@tanstack/react-router";
import { Bot, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

import { AiDisclaimer } from "@/components/ai-disclaimer";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { chatReply } from "@/lib/ai.functions";

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

const opening: Msg = {
  id: 1,
  role: "assistant",
  text: "Hi! I can help you draft messages, plan work, or think through a problem. What are you working on?",
};

function Chatbot() {
  const [messages, setMessages] = useState<Msg[]>([opening]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const next: Msg[] = [...messages, { id: Date.now(), role: "user", text }];
    setMessages(next);
    setLoading(true);
    try {
      const { reply } = await chatReply({
        data: {
          messages: next
            .filter((m) => m.id !== opening.id)
            .map((m) => ({ role: m.role, text: m.text })),
        },
      });
      setMessages((m) => [...m, { id: Date.now() + 1, role: "assistant", text: reply }]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Bot}
        title="AI Chatbot"
        description="Ask anything about your work and iterate together."
      />

      <div className="surface-card flex h-[60vh] min-h-96 flex-col">
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5">
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
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {m.role === "assistant" ? (
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown>{m.text}</ReactMarkdown>
                  </div>
                ) : (
                  m.text
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="hero-gradient grid size-8 shrink-0 place-items-center rounded-xl text-primary-foreground">
                <Bot className="size-4" />
              </div>
              <div className="flex items-center gap-1.5 rounded-2xl bg-muted px-4 py-3">
                <span className="size-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.3s]" />
                <span className="size-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.15s]" />
                <span className="size-2 animate-bounce rounded-full bg-muted-foreground/60" />
              </div>
            </div>
          )}
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 border-t border-border p-4">
          <Input
            ref={inputRef}
            placeholder="Message the assistant…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            disabled={loading}
            autoFocus
          />
          <Button onClick={send} disabled={loading} aria-label="Send message">
            <Send className="size-4" />
          </Button>
        </div>
      </div>

      <AiDisclaimer />
    </div>
  );
}
