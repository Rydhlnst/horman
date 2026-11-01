import { randomUUID } from "node:crypto";
import { type NextRequest } from "next/server";
import { SESSION_COOKIE, unseal } from "@/lib/auth";
import { createZecPayment } from "@/lib/nowpayments";
import { zecPaymentsOn } from "@/lib/pay";
import { TOPUP_MAX, TOPUP_MIN } from "@/lib/site";
import { savePayment } from "@/lib/store";

export const dynamic = "force-dynamic";
const json = (status: number, body: object) => Response.json(body, { status });

/** Starts a ZEC top-up for the signed-in wallet and returns where and how much to pay. */
export async function POST(req: NextRequest) {
  if (!zecPaymentsOn()) return json(503, { error: "ZEC top-ups open soon." });
  const session = unseal<{ address: string }>(req.cookies.get(SESSION_COOKIE)?.value);
  if (!session) return json(401, { error: "Connect your wallet first, so the credit has somewhere to land." });
  const { amount } = (await req.json().catch(() => ({}))) as { amount?: number };
  const usd = Math.round(Number(amount));
  if (!Number.isFinite(usd) || usd < TOPUP_MIN || usd > TOPUP_MAX) return json(400, { error: `Pick an amount from $${TOPUP_MIN} to $${TOPUP_MAX}.` });

  // Fixed, so a forged Host header can't redirect the processor's webhook.
  const ipn = process.env.PAY_IPN_URL?.trim() || "https://horman.dev/api/pay/ipn";
  const { ok, data } = await createZecPayment(usd, `${session.address}:${randomUUID()}`, ipn);
  if (!ok || !data.payment_id || !data.pay_address) {
    console.error("nowpayments create failed", data.message);
    const minimum = /minimal|minimum|less than/i.test(data.message ?? "");
    return json(502, { error: minimum ? "That amount is below the processor’s ZEC minimum. Try a larger amount." : "The payment couldn’t be started. Try again in a moment." });
  }
  const id = String(data.payment_id);
  await savePayment(id, { address: session.address, usd, status: data.payment_status ?? "waiting", payAddress: data.pay_address, payAmount: data.pay_amount, createdAt: new Date().toISOString() });
  return json(200, { id, payAddress: data.pay_address, payAmount: data.pay_amount, currency: "ZEC", usd, status: data.payment_status ?? "waiting" });
}
