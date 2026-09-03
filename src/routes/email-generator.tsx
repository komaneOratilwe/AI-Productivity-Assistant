import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Mail, Sparkles, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { generateEmail } from "@/lib/ai.functions";
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

export const Route = createFileRoute("/email-generator")({
  head: () => ({
    meta: [
      { title: "Email Generator — Assistly AI" },
      {
        name: "description",
        content: "Generate professional workplace emails in seconds with AI tone control.",
      },
      { property: "og:title", content: "Email Generator — Assistly AI" },
      {
        property: "og:description",
        content: "Draft polished emails with AI: add key points, pick a tone, copy and send.",
      },
    ],
  }),
  component: EmailGenerator,
});

type Tone = "Formal" | "Friendly" | "Persuasive";

function EmailGenerator() {
  const runGenerate = useServerFn(generateEmail);
  const [keyPoints, setKeyPoints] = useState("");
  const [tone, setTone] = useState<Tone>("Formal");
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);

  const onGenerate = async () => {
    if (!keyPoints.trim()) {
      toast.error("Add the key points the email should cover.");
      return;
    }
    setLoading(true);
    try {
      const result = await runGenerate({ data: { keyPoints: keyPoints.trim(), tone } });
      setDraft(result.email);
      toast.success("Email generated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not generate the email.");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(draft);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Copying isn't available in this browser.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Mail}
        title="Email Generator"
        description="Turn a few key points into a ready-to-send email."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="surface-card space-y-4 p-5">
          <div className="space-y-2">
            <Label htmlFor="key-points">What the email should say</Label>
            <Textarea
              id="key-points"
              rows={8}
              placeholder="e.g. Follow up on the Q3 budget review, ask for updated figures by Friday, offer a 15-minute call"
              value={keyPoints}
              onChange={(e) => setKeyPoints(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              List the key points — the AI handles the structure and wording.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tone">Tone</Label>
            <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
              <SelectTrigger id="tone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Formal">Formal</SelectItem>
                <SelectItem value="Friendly">Friendly</SelectItem>
                <SelectItem value="Persuasive">Persuasive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={onGenerate} disabled={loading} className="w-full">
            <Sparkles className="size-4" />
            {loading ? "Generating…" : "Generate Email"}
          </Button>
        </div>

        <div className="surface-card flex min-h-72 flex-col p-5">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <h2 className="truncate text-base font-semibold">Generated email</h2>
            <Button variant="outline" size="sm" disabled={!draft} onClick={copy}>
              <Copy className="size-4" /> Copy to Clipboard
            </Button>
          </div>
          <Textarea
            aria-label="Generated email"
            className="mt-4 min-h-64 flex-1 font-sans text-sm"
            placeholder="Your generated email will appear here — you can edit it before sending."
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
        </div>
      </div>

      <AiDisclaimer />
    </div>
  );
}
