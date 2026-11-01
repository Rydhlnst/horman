import { type NextRequest } from "next/server";
import { SESSION_COOKIE, unseal } from "@/lib/auth";
import { zecPaymentsOn } from "@/lib/pay";
import { getCredit, storeConfigured } from "@/lib/store";

export const dynamic = "force-dynamic";

/** The signed-in wallet's credit in dollars, and whether ZEC top-ups are open. */
export async function GET(req: NextRequest) {
  const session = unseal<{ address: string }>(req.cookies.get(SESSION_COOKIE)?.value);
  const zec = zecPaymentsOn();
  if (!session || !storeConfigured()) return Response.json({ balance: null, zec });
  try {
    return Response.json({ balance: (await getCredit(session.address)) / 100, zec });
  } catch {
    return Response.json({ balance: null, zec });
  }
}
