import { NextResponse } from "next/server";
import { authConfigured, cookieBase, newNonce, NONCE_COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** A one-time nonce for the sign-in message, kept in a signed cookie for ten minutes. */
export async function GET() {
  if (!authConfigured()) return NextResponse.json({ error: "Wallet sign-in is not set up yet." }, { status: 503 });
  const { nonce, token } = newNonce();
  const res = NextResponse.json({ nonce });
  res.cookies.set(NONCE_COOKIE, token, { ...cookieBase, maxAge: 600 });
  return res;
}
