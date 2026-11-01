// Server-only: NOWPayments, the processor behind ZEC top-ups. Needs NOWPAYMENTS_API_KEY
// and NOWPAYMENTS_IPN_SECRET.
import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

const BASE = process.env.NOWPAYMENTS_BASE_URL || "https://api.nowpayments.io/v1";

export const nowpaymentsConfigured = () => !!process.env.NOWPAYMENTS_API_KEY && !!process.env.NOWPAYMENTS_IPN_SECRET;

export type NpPayment = {
  payment_id: string | number;
  payment_status: string;
  pay_address?: string;
  pay_amount?: number;
  pay_currency?: string;
  price_amount?: number;
  actually_paid?: number;
  order_id?: string;
};

async function call<T>(path: string, init?: RequestInit): Promise<{ ok: boolean; status: number; data: T & { message?: string } }> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { "x-api-key": process.env.NOWPAYMENTS_API_KEY ?? "", "Content-Type": "application/json", ...(init?.headers ?? {}) },
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });
  const data = (await res.json().catch(() => ({}))) as T & { message?: string };
  return { ok: res.ok, status: res.status, data };
}

/** A ZEC payment for an amount in US dollars. */
export function createZecPayment(usd: number, orderId: string, ipnUrl: string) {
  return call<NpPayment>("/payment", {
    method: "POST",
    body: JSON.stringify({
      price_amount: usd,
      price_currency: "usd",
      pay_currency: "zec",
      order_id: orderId,
      order_description: `Horman credit $${usd}`,
      ipn_callback_url: ipnUrl,
    }),
  });
}

export function getPaymentStatus(id: string) {
  return call<NpPayment>(`/payment/${encodeURIComponent(id)}`);
}

/** Checks the x-nowpayments-sig header: HMAC-SHA512 of the body with its keys sorted, as NOWPayments signs it. */
export function verifyIpn(rawBody: string, signature: string | null): boolean {
  const secret = process.env.NOWPAYMENTS_IPN_SECRET;
  if (!secret || !signature) return false;
  try {
    const params = JSON.parse(rawBody) as Record<string, unknown>;
    const sorted = JSON.stringify(params, Object.keys(params).sort());
    const want = Buffer.from(createHmac("sha512", secret).update(sorted).digest("hex"));
    const got = Buffer.from(signature);
    return want.length === got.length && timingSafeEqual(want, got);
  } catch {
    return false;
  }
}

/** Statuses after which the money is ours and the credit can be added. */
export const PAID = new Set(["finished", "confirmed"]);
