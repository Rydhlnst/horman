import { type NextRequest } from "next/server";
import { SESSION_COOKIE, unseal } from "@/lib/auth";
import { getPaymentStatus } from "@/lib/nowpayments";
import { applyStatus, zecPaymentsOn } from "@/lib/pay";
import { getCredit, getPayment } from "@/lib/store";

export const dynamic = "force-dynamic";

/** The browser polls this while a payment is open. It also credits a paid payment if the webhook is late. */
export async function GET(req: NextRequest) {
  if (!zecPaymentsOn()) return Response.json({ error: "ZEC top-ups open soon." }, { status: 503 });
  const session = unseal<{ address: string }>(req.cookies.get(SESSION_COOKIE)?.value);
  const id = req.nextUrl.searchParams.get("id") ?? "";
  const rec = id ? await getPayment(id) : null;
  if (!session || !rec || rec.address !== session.address) return Response.json({ error: "Payment not found." }, { status: 404 });
  const { ok, data } = await getPaymentStatus(id);
  const status = ok && data.payment_status ? data.payment_status : rec.status;
  await applyStatus(id, status);
  return Response.json({ status, balance: (await getCredit(session.address)) / 100 });
}
