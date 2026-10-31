import { NextResponse, type NextRequest } from "next/server";
import { authConfigured, holding, SESSION_COOKIE, unseal } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** Who is signed in, and whether that wallet holds $HORMAN right now. */
export async function GET(req: NextRequest) {
  const configured = authConfigured();
  const session = unseal<{ address: string }>(req.cookies.get(SESSION_COOKIE)?.value);
  if (!session) return NextResponse.json({ configured, address: null, ca: null, balance: null, holder: false });
  const hold = await holding(session.address);
  return NextResponse.json({ configured, address: session.address, ...hold });
}
