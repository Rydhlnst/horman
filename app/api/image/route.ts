import { type NextRequest } from "next/server";
import { holding, SESSION_COOKIE, unseal } from "@/lib/auth";
import { chargeCents, creditCents, MIN_CENTS, settle } from "@/lib/billing";
import { resolveImageModel } from "@/lib/models";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_PROMPT = 1_500;
const WINDOW_MS = 10 * 60_000;
const LIMIT = 10;
const hits = new Map<string, number[]>();
function allow(key: string) {
  const now = Date.now();
  const list = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (list.length >= LIMIT) return false;
  list.push(now);
  hits.set(key, list);
  if (hits.size > 5_000) hits.clear();
  return true;
}

const json = (status: number, error: string) => Response.json({ error }, { status });

type Choice = { message?: { content?: string; images?: { image_url?: { url?: string }; url?: string }[] } };

/** Creates one image from a prompt. For holders, or anyone paying as they go with credit. */
export async function POST(req: NextRequest) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return json(503, "Image creation isn’t switched on yet.");

  const body = (await req.json().catch(() => ({}))) as { prompt?: string };
  const prompt = typeof body.prompt === "string" ? body.prompt.trim().slice(0, MAX_PROMPT) : "";
  if (!prompt) return json(400, "Describe the image you want.");

  const session = unseal<{ address: string }>(req.cookies.get(SESSION_COOKIE)?.value);
  if (!session) return json(403, "Image creation is for $HORMAN holders or pay as you go with credit. Connect your wallet first.");
  const paid = !(await holding(session.address)).holder;
  if (paid && (await creditCents(session.address)) < MIN_CENTS) return json(402, "Image creation needs $HORMAN or credit. Top up from $1 in ZEC.");
  if (!allow(session.address)) return json(429, "That’s a lot of images in a short time. Wait a few minutes and try again.");

  const model = await resolveImageModel();
  const res = await fetch(`${process.env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1"}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://horman.dev",
      "X-Title": "Horman",
    },
    body: JSON.stringify({
      model: model.id,
      modalities: ["image", "text"],
      usage: { include: true },
      messages: [{ role: "user", content: `Create an image: ${prompt}` }],
    }),
    signal: AbortSignal.timeout(55_000),
  }).catch(() => null);

  if (!res || !res.ok) {
    const detail = res ? await res.text().catch(() => "") : "";
    console.error("openrouter image error", res?.status, model.id, detail.slice(0, 500));
    return json(502, res?.status === 402 ? "The model credit has run out. The team has been told." : "The image model couldn’t make that one. Try again or reword the prompt.");
  }
  const data = (await res.json().catch(() => ({}))) as { choices?: Choice[]; usage?: { cost?: number; prompt_tokens?: number; completion_tokens?: number } };
  // The model ran, so a paid request is charged even if no image came back.
  if (paid) await settle(session.address, await chargeCents(model.id, data.usage ?? null, { promptChars: prompt.length, outputChars: 0, images: 1 }));
  const msg = data.choices?.[0]?.message;
  const image = msg?.images?.map((i) => i.image_url?.url ?? i.url).find((u): u is string => !!u && (u.startsWith("data:image/") || u.startsWith("https://")));
  if (!image) {
    console.error("openrouter image: no image in reply", model.id, (msg?.content ?? "").slice(0, 200));
    return json(502, msg?.content ? `The model replied without an image: “${msg.content.slice(0, 160)}”` : "No image came back. Try rewording the prompt.");
  }
  return Response.json({ image, model: model.name, note: msg?.content?.slice(0, 400) || undefined });
}
