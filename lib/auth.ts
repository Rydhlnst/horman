// Server-only helpers for "Sign in with Solana": nonces, the signed session cookie,
// signature checks and the $HORMAN balance lookup. Nothing here runs in the browser.
import "server-only";
import { createHmac, createPublicKey, randomBytes, timingSafeEqual, verify } from "node:crypto";
import { HOLD_MIN } from "@/lib/site";
export { signInMessage } from "@/lib/siws";

export const NONCE_COOKIE = "horman_nonce";
export const SESSION_COOKIE = "horman_session";
export const SESSION_DAYS = 7;
const NONCE_MINUTES = 10;

const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

export function base58Decode(s: string): Uint8Array | null {
  if (!s || s.length > 128) return null;
  let n = BigInt(0);
  for (const c of s) {
    const i = ALPHABET.indexOf(c);
    if (i < 0) return null;
    n = n * BigInt(58) + BigInt(i);
  }
  const bytes: number[] = [];
  while (n > BigInt(0)) {
    bytes.unshift(Number(n % BigInt(256)));
    n /= BigInt(256);
  }
  for (const c of s) {
    if (c !== "1") break;
    bytes.unshift(0);
  }
  return Uint8Array.from(bytes);
}

/** A Solana address is 32 bytes in base58. */
export function isSolanaAddress(s: string): boolean {
  const b = base58Decode(s);
  return !!b && b.length === 32;
}

function secret(): Buffer | null {
  const s = process.env.SESSION_SECRET;
  return s && s.length >= 32 ? Buffer.from(s) : null;
}

export function authConfigured(): boolean {
  return secret() !== null;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()!).update(payload).digest("base64url");
}

/** `payload.signature`, where payload is base64url JSON. */
export function seal(data: object): string {
  const payload = Buffer.from(JSON.stringify(data)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function unseal<T>(token: string | undefined): T | null {
  if (!token || !secret()) return null;
  const [payload, mac] = token.split(".");
  if (!payload || !mac) return null;
  const want = Buffer.from(sign(payload));
  const got = Buffer.from(mac);
  if (want.length !== got.length || !timingSafeEqual(want, got)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as T & { exp?: number };
    if (typeof data.exp === "number" && data.exp < Date.now()) return null;
    return data;
  } catch {
    return null;
  }
}

export function newNonce() {
  const nonce = randomBytes(16).toString("hex");
  return { nonce, token: seal({ nonce, exp: Date.now() + NONCE_MINUTES * 60_000 }) };
}

export function verifySignature(address: string, message: string, signatureB58: string): boolean {
  const key = base58Decode(address);
  const sig = base58Decode(signatureB58);
  if (!key || key.length !== 32 || !sig || sig.length !== 64) return false;
  try {
    const publicKey = createPublicKey({ key: { kty: "OKP", crv: "Ed25519", x: Buffer.from(key).toString("base64url") }, format: "jwk" });
    return verify(null, Buffer.from(message, "utf8"), publicKey, Buffer.from(sig));
  } catch {
    return false;
  }
}

export type Holding = {
  /** The token's mint address, or null before launch. */
  ca: string | null;
  balance: number | null;
  holder: boolean;
};

/** How much $HORMAN the wallet holds, read from Solana. */
export async function holding(address: string): Promise<Holding> {
  const ca = process.env.NEXT_PUBLIC_CA?.trim() || null;
  if (!ca || !isSolanaAddress(ca)) return { ca: null, balance: null, holder: false };
  const rpc = process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";
  try {
    const res = await fetch(rpc, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getTokenAccountsByOwner",
        params: [address, { mint: ca }, { encoding: "jsonParsed", commitment: "confirmed" }],
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    const json = (await res.json()) as {
      result?: { value: { account: { data: { parsed: { info: { tokenAmount: { uiAmountString: string } } } } } }[] };
    };
    if (!json.result) return { ca, balance: null, holder: false };
    const balance = json.result.value.reduce((sum, a) => sum + Number(a.account.data.parsed.info.tokenAmount.uiAmountString || 0), 0);
    const holder = balance > 0 && (HOLD_MIN === null || balance >= HOLD_MIN);
    return { ca, balance, holder };
  } catch {
    return { ca, balance: null, holder: false };
  }
}

export const cookieBase = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};
