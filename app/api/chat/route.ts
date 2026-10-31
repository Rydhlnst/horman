import { type NextRequest } from "next/server";
import { holding, SESSION_COOKIE, unseal } from "@/lib/auth";
import { resolveModel, TIERS } from "@/lib/models";
import { MODEL_GROUPS, MODES, type ModeKey } from "@/lib/site";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const CHAT_MODELS = MODEL_GROUPS.find((g) => g.id === "chat")!.models;

const MAX_MESSAGES = 24;
const MAX_CHARS = 8_000;
const MAX_TOTAL = 32_000;
const MAX_OUTPUT_TOKENS = 1_500;

// Per-instance limits: a light guard until a shared store (Upstash) is connected.
const WINDOW_MS = 10 * 60_000;
const LIMIT_FREE = 20;
const LIMIT_HOLDER = 60;
const hits = new Map<string, number[]>();
function allow(key: string, limit: number) {
  const now = Date.now();
  const list = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (list.length >= limit) return false;
  list.push(now);
  hits.set(key, list);
  if (hits.size > 5_000) hits.clear();
  return true;
}

const SYSTEM = [
  "You are Horman, a private AI assistant on horman.dev.",
  "Answer in the language the user writes in. Be clear, warm and to the point.",
  "Format: plain paragraphs. You may use **bold** and simple lines starting with '- ' for lists. No headings, tables or code fences unless the user asks for code.",
  "You know Solana well. Never invent onchain data such as balances or transactions: say you can't read the chain from this chat yet.",
].join(" ");

const json = (status: number, error: string) => Response.json({ error }, { status });

type In = { messages?: { role: string; text: string }[]; tier?: string; mode?: string };

export async function POST(req: NextRequest) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return json(503, "Chat isn’t switched on yet.");

  const body = (await req.json().catch(() => ({}))) as In;
  const tier = typeof body.tier === "string" && TIERS[body.tier] ? body.tier : "Auto";
  const mode = (MODES.find((m) => m.key === body.mode)?.key ?? "sealed") as ModeKey;
  const entry = CHAT_MODELS.find((m) => m.name === tier)!;

  const raw = Array.isArray(body.messages) ? body.messages.slice(-MAX_MESSAGES) : [];
  const messages = raw
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.text === "string" && m.text.trim())
    .map((m) => ({ role: m.role as "user" | "assistant", content: m.text.slice(0, MAX_CHARS) }));
  if (!messages.length || messages[messages.length - 1].role !== "user") return json(400, "Nothing to answer.");
  let total = 0;
  for (let i = messages.length - 1; i >= 0; i--) {
    total += messages[i].content.length;
    if (total > MAX_TOTAL) {
      messages.splice(0, i + 1);
      break;
    }
  }
  if (!messages.length) return json(400, "That message is too long.");

  const session = unseal<{ address: string }>(req.cookies.get(SESSION_COOKIE)?.value);
  let holder = false;
  if (!entry.free) {
    if (!session) return json(403, `${tier} is for $HORMAN holders. Connect your wallet first.`);
    holder = (await holding(session.address)).holder;
    if (!holder) return json(403, `${tier} is for $HORMAN holders, and this wallet doesn’t qualify yet. Auto is free for everyone.`);
  }

  const who = session?.address ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
  if (!allow(who, holder ? LIMIT_HOLDER : LIMIT_FREE)) {
    return json(429, "You’ve sent a lot of messages in a short time. Wait a few minutes and try again.");
  }

  const picked = await resolveModel(tier);
  if (!picked) return json(400, "Unknown model.");
  let model = picked;

  const call = (id: string) =>
    fetch(`${process.env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1"}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://horman.dev",
        "X-Title": "Horman",
      },
      body: JSON.stringify({
        model: id,
        stream: true,
        max_tokens: MAX_OUTPUT_TOKENS,
        messages: [{ role: "system", content: SYSTEM }, ...messages],
        // Outside Open, open-weight models only use providers that don't keep or train on prompts.
        // Hosted models (GPT, Claude, Gemini) are read by their lab; the chat says so.
        ...(mode === "open" || entry.hosted ? {} : { provider: { data_collection: "deny" } }),
      }),
      signal: req.signal,
    }).catch(() => null);

  let upstream = await call(model.id);
  // If the newest pick fails before answering, try the tier's known model once.
  const fallback = TIERS[tier].fallback;
  if ((!upstream || !upstream.ok) && upstream?.status !== 402 && fallback !== model.id) {
    console.error("openrouter retry", upstream?.status, model.id, "->", fallback);
    upstream = await call(fallback);
    model = { id: fallback, name: fallback };
  }

  if (!upstream || !upstream.ok || !upstream.body) {
    const detail = upstream ? await upstream.text().catch(() => "") : "";
    console.error("openrouter error", upstream?.status, model.id, detail.slice(0, 500));
    const msg =
      upstream?.status === 402
        ? "The model credit has run out. The team has been told."
        : upstream?.status === 404 && mode !== "open" && !entry.hosted
          ? `${tier} has no private provider available right now. Try another model, or switch to Open.`
          : `${tier} couldn’t answer right now. Try again in a moment.`;
    return json(502, msg);
  }

  // Turn OpenRouter's server-sent events into a plain stream of text.
  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      let buffer = "";
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          let nl: number;
          while ((nl = buffer.indexOf("\n")) >= 0) {
            const line = buffer.slice(0, nl).trim();
            buffer = buffer.slice(nl + 1);
            if (!line.startsWith("data:")) continue;
            const data = line.slice(5).trim();
            if (data === "[DONE]") continue;
            try {
              const evt = JSON.parse(data) as { choices?: { delta?: { content?: string } }[]; error?: { message?: string } };
              if (evt.error) {
                console.error("openrouter stream error", model.id, evt.error.message);
                controller.enqueue(encoder.encode("\n\n(The answer was cut short. Try again.)"));
                continue;
              }
              const piece = evt.choices?.[0]?.delta?.content;
              if (piece) controller.enqueue(encoder.encode(piece));
            } catch {
              /* keep-alive or partial line */
            }
          }
        }
      } catch {
        /* client went away */
      }
      controller.close();
    },
    cancel() {
      reader.cancel().catch(() => {});
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Horman-Model": encodeURIComponent(model.name),
    },
  });
}
