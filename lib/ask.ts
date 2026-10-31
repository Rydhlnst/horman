// Browser side of /api/chat: sends the conversation and reads the answer as it streams in.
import type { Message } from "@/lib/chat";
import type { ModeKey } from "@/lib/site";

type Result = { text: string; model?: string; error?: string };

export async function ask({
  history,
  tier,
  mode,
  onText,
  signal,
}: {
  history: Message[];
  tier: string;
  mode: ModeKey;
  onText: (text: string) => void;
  signal?: AbortSignal;
}): Promise<Result> {
  const messages = history.flatMap((m) =>
    m.role === "user" ? [{ role: "user", text: m.text }] : m.kind === "text" && !m.error && m.text ? [{ role: "assistant", text: m.text }] : [],
  );
  let res: Response;
  try {
    res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, tier, mode }),
      signal,
    });
  } catch {
    return { text: "", error: "Couldn’t reach Horman. Check your connection and try again." };
  }
  if (!res.ok || !res.body) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    return { text: "", error: data.error ?? "Something went wrong. Try again." };
  }
  const model = decodeURIComponent(res.headers.get("X-Horman-Model") ?? "") || undefined;
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let text = "";
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      text += decoder.decode(value, { stream: true });
      onText(text);
    }
  } catch {
    if (!text) return { text: "", model, error: "The answer was interrupted. Try again." };
  }
  if (!text.trim()) return { text: "", model, error: "No answer came back. Try again." };
  return { text, model };
}
