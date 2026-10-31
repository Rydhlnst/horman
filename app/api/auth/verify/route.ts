import { NextResponse, type NextRequest } from "next/server";
import {
  authConfigured,
  cookieBase,
  holding,
  isSolanaAddress,
  NONCE_COOKIE,
  seal,
  SESSION_COOKIE,
  SESSION_DAYS,
  signInMessage,
  unseal,
  verifySignature,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

type Body = { address?: string; signature?: string; issuedAt?: string };

/** Checks the signed sign-in message and starts a session for that wallet. */
export async function POST(req: NextRequest) {
  if (!authConfigured()) return NextResponse.json({ error: "Wallet sign-in is not set up yet." }, { status: 503 });
  const body = (await req.json().catch(() => ({}))) as Body;
  const { address, signature, issuedAt } = body;
  if (!address || !signature || !issuedAt || !isSolanaAddress(address)) {
    return NextResponse.json({ error: "Missing or invalid sign-in details." }, { status: 400 });
  }
  const saved = unseal<{ nonce: string }>(req.cookies.get(NONCE_COOKIE)?.value);
  if (!saved) return NextResponse.json({ error: "The sign-in request expired. Try again." }, { status: 401 });

  const issued = Date.parse(issuedAt);
  if (!Number.isFinite(issued) || Math.abs(Date.now() - issued) > 10 * 60_000) {
    return NextResponse.json({ error: "The sign-in request expired. Try again." }, { status: 401 });
  }
  const domain = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "";
  const message = signInMessage({ domain, address, nonce: saved.nonce, issuedAt });
  if (!verifySignature(address, message, signature)) {
    return NextResponse.json({ error: "The signature didn’t match this wallet." }, { status: 401 });
  }

  const hold = await holding(address);
  const res = NextResponse.json({ address, ...hold });
  res.cookies.set(SESSION_COOKIE, seal({ address, exp: Date.now() + SESSION_DAYS * 86_400_000 }), { ...cookieBase, maxAge: SESSION_DAYS * 86_400 });
  res.cookies.delete(NONCE_COOKIE);
  return res;
}
