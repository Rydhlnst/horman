import { type NextRequest } from "next/server";
import { verifyIpn } from "@/lib/nowpayments";
import { applyStatus, zecPaymentsOn } from "@/lib/pay";

export const dynamic = "force-dynamic";

/** NOWPayments calls this on every status change. The signature is checked before anything is credited. */
export async function POST(req: NextRequest) {
  if (!zecPaymentsOn()) return new Response("off", { status: 503 });
  const raw = await req.text();
  if (!verifyIpn(raw, req.headers.get("x-nowpayments-sig"))) return new Response("bad signature", { status: 401 });
  const body = JSON.parse(raw) as { payment_id?: string | number; payment_status?: string };
  if (!body.payment_id || !body.payment_status) return new Response("missing fields", { status: 400 });
  const { rec } = await applyStatus(String(body.payment_id), body.payment_status);
  return new Response(rec ? "ok" : "unknown payment", { status: rec ? 200 : 404 });
}
