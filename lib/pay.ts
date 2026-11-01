// Server-only glue between payments and credit.
import "server-only";
import { creditOnce, getPayment, savePayment, storeConfigured } from "@/lib/store";
import { nowpaymentsConfigured, PAID } from "@/lib/nowpayments";

/** ZEC top-ups are on only when the processor and the credit store are both set up. */
export const zecPaymentsOn = () => nowpaymentsConfigured() && storeConfigured();

/** Applies a processor status to a stored payment; credits it once when paid. */
export async function applyStatus(id: string, status: string) {
  const rec = await getPayment(id);
  if (!rec) return { rec: null, credited: false };
  let credited = false;
  if (PAID.has(status)) credited = await creditOnce(rec.address, Math.round(rec.usd * 100), id);
  if (rec.status !== status) await savePayment(id, { ...rec, status });
  return { rec: { ...rec, status }, credited };
}
