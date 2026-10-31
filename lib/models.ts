// Which OpenRouter model answers for each chat tier. Model ids change often, so the
// server reads OpenRouter's live model list (cached for an hour) and picks the newest
// model that matches each tier's patterns, in order. The fixed ids are only a fallback
// for when that list can't be read.
import "server-only";

type Tier = { patterns: RegExp[]; fallback: string };

export const TIERS: Record<string, Tier> = {
  Auto: { patterns: [/^openai\/gpt-oss-120b$/, /^meta-llama\/llama-3\.3-70b-instruct$/, /^deepseek\/deepseek-chat/], fallback: "openai/gpt-oss-120b" },
  Llama: { patterns: [/^meta-llama\/llama-4-maverick$/, /^meta-llama\/llama-3\.3-70b-instruct$/, /^meta-llama\/llama-/], fallback: "meta-llama/llama-3.3-70b-instruct" },
  DeepSeek: { patterns: [/^deepseek\/deepseek-v3\.\d+$/, /^deepseek\/deepseek-chat-v3\.\d+$/, /^deepseek\/deepseek-chat/], fallback: "deepseek/deepseek-chat" },
  Qwen: { patterns: [/^qwen\/qwen3-max$/, /^qwen\/qwen3-235b-a22b-\d{4}$/, /^qwen\/qwen3-235b/, /^qwen\/qwen-2\.5-72b/], fallback: "qwen/qwen-2.5-72b-instruct" },
  Kimi: { patterns: [/^moonshotai\/kimi-k2(-\d{4})?$/, /^moonshotai\/kimi/], fallback: "moonshotai/kimi-k2" },
  "gpt-oss": { patterns: [/^openai\/gpt-oss-120b$/, /^openai\/gpt-oss/], fallback: "openai/gpt-oss-120b" },
  GPT: { patterns: [/^openai\/gpt-5(\.\d+)?$/, /^openai\/gpt-4\.1$/, /^openai\/gpt-4o$/], fallback: "openai/gpt-4o" },
  Claude: { patterns: [/^anthropic\/claude-sonnet-\d+(\.\d+)?$/, /^anthropic\/claude-\d+(\.\d+)?-sonnet$/], fallback: "anthropic/claude-sonnet-4" },
  Gemini: { patterns: [/^google\/gemini-\d+(\.\d+)?-pro$/, /^google\/gemini-\d+(\.\d+)?-pro/, /^google\/gemini-\d+(\.\d+)?-flash$/], fallback: "google/gemini-2.5-pro" },
};

type Listed = { id: string; name?: string; created?: number };
let cache: { at: number; models: Listed[] } | null = null;

async function liveModels(): Promise<Listed[] | null> {
  if (cache && Date.now() - cache.at < 3_600_000) return cache.models;
  try {
    const res = await fetch(`${process.env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1"}/models`, { signal: AbortSignal.timeout(6000), cache: "no-store" });
    if (!res.ok) return cache?.models ?? null;
    const json = (await res.json()) as { data?: Listed[] };
    // Variants such as ":free" or ":online" are left out.
    const models = (json.data ?? []).filter((m) => m.id && !m.id.includes(":"));
    cache = { at: Date.now(), models };
    return models;
  } catch {
    return cache?.models ?? null;
  }
}

/** The OpenRouter id and display name for a tier, newest match first. */
export async function resolveModel(tier: string): Promise<{ id: string; name: string } | null> {
  const t = TIERS[tier];
  if (!t) return null;
  const models = await liveModels();
  if (models) {
    for (const p of t.patterns) {
      const hits = models.filter((m) => p.test(m.id)).sort((a, b) => (b.created ?? 0) - (a.created ?? 0));
      if (hits[0]) return { id: hits[0].id, name: hits[0].name ?? hits[0].id };
    }
  }
  return { id: t.fallback, name: t.fallback };
}
