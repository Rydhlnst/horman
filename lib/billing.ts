// Server-only: pay-as-you-go with credit. A paid request is charged what OpenRouter
// reports it cost, plus a small markup that covers payment and provider fees.
import "server-only";
import { modelPricing } from "@/lib/models";
import { debit, getCredit, storeConfigured } from "@/lib/store";

/** Markup on the model's cost, in percent. CREDIT_MARKUP_PCT overrides it. */
export const MARKUP_PCT = (() => {
  const n = Number(process.env.CREDIT_MARKUP_PCT);
  return Number.isFinite(n) && n >= 0 && n <= 200 ? n : 10;
})();

/** A paid request needs at least this much credit to start, in cents. */
export const MIN_CENTS = 5;

/** Credit in cents, or 0 when the store isn't set up or can't be read. */
export async function creditCents(address: string): Promise<number> {
  if (!storeConfigured()) return 0;
  return getCredit(address).catch(() => 0);
}

type Usage = { cost?: number; prompt_tokens?: number; completion_tokens?: number };

/**
 * What to charge, in cents: OpenRouter's reported cost when there is one, otherwise an
 * estimate from the model's listed prices (tokens reported, or about four characters a token).
 */
export async function chargeCents(model: string, usage: Usage | null, fallback: { promptChars: number; outputChars: number; images?: number }): Promise<number> {
  let usd = typeof usage?.cost === "number" && usage.cost > 0 ? usage.cost : null;
  if (usd === null) {
    const p = await modelPricing(model);
    const prompt = usage?.prompt_tokens ?? Math.ceil(fallback.promptChars / 4);
    const output = usage?.completion_tokens ?? Math.ceil(fallback.outputChars / 4);
    usd =
      prompt * Number(p?.prompt ?? 0) +
      output * Number(p?.completion ?? 0) +
      (fallback.images ?? 0) * Number(p?.image ?? 0) +
      Number(p?.request ?? 0);
    // No price listed and nothing reported: charge a cent rather than nothing.
    if (!(usd > 0)) usd = 0.01;
  }
  return usd * 100 * (1 + MARKUP_PCT / 100);
}

/** Charges a wallet for one request; logs instead of throwing so a reply is never lost. */
export async function settle(address: string, cents: number) {
  try {
    await debit(address, cents);
  } catch (e) {
    console.error("credit debit failed", address.slice(0, 6), cents, e instanceof Error ? e.message : e);
  }
}
