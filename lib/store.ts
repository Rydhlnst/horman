// Server-only: a tiny Upstash Redis client over its REST API, for credit balances and
// payments. Reads KV_REST_API_* (Vercel's Upstash integration) or UPSTASH_REDIS_REST_*.
import "server-only";

function conf() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

export const storeConfigured = () => conf() !== null;

async function cmd<T>(...args: (string | number)[]): Promise<T | null> {
  const c = conf();
  if (!c) throw new Error("Store not configured");
  const res = await fetch(c.url, {
    method: "POST",
    headers: { Authorization: `Bearer ${c.token}`, "Content-Type": "application/json" },
    body: JSON.stringify(args.map(String)),
    cache: "no-store",
    signal: AbortSignal.timeout(6000),
  });
  if (!res.ok) throw new Error(`Store error ${res.status}`);
  const json = (await res.json()) as { result?: T; error?: string };
  if (json.error) throw new Error(json.error);
  return json.result ?? null;
}

/** Credit in US cents for a wallet. */
export async function getCredit(address: string): Promise<number> {
  return Number((await cmd<string>("GET", `credit:${address}`)) ?? 0);
}

/** Adds credit once per payment id, however many times it's called. Returns true if it credited now. */
export async function creditOnce(address: string, cents: number, paymentId: string): Promise<boolean> {
  const first = await cmd<string>("SET", `credited:${paymentId}`, "1", "NX");
  if (first !== "OK") return false;
  await cmd("INCRBY", `credit:${address}`, Math.round(cents));
  return true;
}

export type PaymentRecord = { address: string; usd: number; status: string; payAddress?: string; payAmount?: number; createdAt: string };

export async function savePayment(id: string, rec: PaymentRecord) {
  await cmd("SET", `payment:${id}`, JSON.stringify(rec), "EX", 60 * 60 * 24 * 30);
}

export async function getPayment(id: string): Promise<PaymentRecord | null> {
  const raw = await cmd<string>("GET", `payment:${id}`);
  return raw ? (JSON.parse(raw) as PaymentRecord) : null;
}
