import { createFileRoute } from "@tanstack/react-router";
import { Mail, Sparkles, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/email-generator")({
  head: () => ({
    meta: [
      { title: "Email Generator — Assistly AI" },
      {
        name: "description",
        content: "Generate professional workplace emails in seconds with tone and length control.",
      },
      { property: "og:title", content: "Email Generator — Assistly AI" },
      {
        property: "og:description",
        content: "Draft polished emails with AI: pick a tone, add context, send with confidence.",
      },
    ],
  }),
  component: EmailGenerator,
});

function EmailGenerator() {
  const [recipient, setRecipient] = useState("");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional");
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = () => {
    if (!topic.trim()) {
      toast.error("Add what the email should be about.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setDraft(
        `Subject: ${topic.trim()}\n\nHi ${recipient.trim() || "there"},\n\nI hope you're doing well. I wanted to reach out regarding ${topic.trim().toLowerCase()}.\n\nHere's a quick summary of where things stand and what I'd suggest as next steps. I've kept it brief so it's easy to action, and I'm happy to jump on a short call if that's easier.\n\nCould you let me know your thoughts by end of week?\n\nBest regards,\nOratilwe\n\n— written in a ${tone} tone`,
      );
      setLoading(false);
    }, 700);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Mail}
        title="Email Generator"
        description="Turn a few notes into a ready-to-send email."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="surface-card space-y-4 p-5">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient</Label>
            <Input
              id="recipient"
              placeholder="e.g. Sarah from Finance"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="topic">What is it about?</Label>
            <Textarea
              id="topic"
              rows={5}
              placeholder="Follow up on the Q3 budget review and request updated figures"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["professional", "friendly", "concise", "persuasive", "apologetic"].map((t) => (
                  <SelectItem key={t} value={t}>
                    {t[0].toUpperCase() + t.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={generate} disabled={loading} className="w-full">
            <Sparkles className="size-4" />
            {loading ? "Generating…" : "Generate email"}
          </Button>
        </div>

        <div className="surface-card flex min-h-72 flex-col p-5">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <h2 className="truncate text-base font-semibold">Draft</h2>
            <Button
              variant="outline"
              size="sm"
              disabled={!draft}
              onClick={() => {
                navigator.clipboard.writeText(draft);
                toast.success("Draft copied to clipboard");
              }}
            >
              <Copy className="size-4" /> Copy
            </Button>
          </div>
          <div className="mt-4 flex-1 rounded-xl bg-muted/60 p-4">
            {draft ? (
              <pre className="font-sans text-sm whitespace-pre-wrap">{draft}</pre>
            ) : (
              <p className="text-sm text-muted-foreground">
                Your generated email will appear here.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
