"use client";

// Solana wallet connection plus the signed-in session. Wallets that follow the Wallet
// Standard (Phantom, Solflare, Backpack and others) are found on their own; on Android the
// Mobile Wallet Adapter is added too. Connecting is followed by one signed message
// ("Sign in with Solana"), which the server checks before it trusts the address.

import { ConnectionProvider, useWallet, WalletProvider } from "@solana/wallet-adapter-react";
import type { WalletName } from "@solana/wallet-adapter-base";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { signInMessage } from "@/lib/siws";

export type Session = {
  configured: boolean;
  address: string | null;
  /** $HORMAN mint, null until launch. */
  ca: string | null;
  balance: number | null;
  holder: boolean;
};

type Ctx = {
  session: Session | null;
  /** True while a wallet is connecting or the sign-in message is being signed. */
  working: boolean;
  error: string;
  signIn: (wallet: WalletName) => void;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
  clearError: () => void;
};

const SessionContext = createContext<Ctx | null>(null);

export function useWalletSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useWalletSession needs <WalletSessionProvider>");
  return ctx;
}

const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function base58(bytes: Uint8Array) {
  let n = BigInt(0);
  for (const b of bytes) n = n * BigInt(256) + BigInt(b);
  let out = "";
  while (n > BigInt(0)) {
    out = ALPHABET[Number(n % BigInt(58))] + out;
    n /= BigInt(58);
  }
  for (const b of bytes) {
    if (b !== 0) break;
    out = "1" + out;
  }
  return out;
}

export const shortAddress = (a: string) => `${a.slice(0, 4)}…${a.slice(-4)}`;

function Session({ children }: { children: ReactNode }) {
  const { wallet, select, connect, disconnect, connected, connecting, publicKey, signMessage } = useWallet();
  const [session, setSession] = useState<Session | null>(null);
  const [pending, setPending] = useState(false);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");
  const signing = useRef(false);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session", { cache: "no-store" });
      setSession((await res.json()) as Session);
    } catch {
      setSession({ configured: false, address: null, ca: null, balance: null, holder: false });
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(refresh, 0);
    return () => clearTimeout(t);
  }, [refresh]);

  const fail = useCallback((message: string) => {
    setError(message);
    setPending(false);
    setWorking(false);
    signing.current = false;
  }, []);

  // Step 1: once a wallet is picked, connect to it.
  useEffect(() => {
    if (!pending || !wallet || connected || connecting) return;
    connect().catch((e: Error) => fail(e?.name === "WalletNotReadyError" ? "That wallet isn’t installed in this browser." : "The wallet didn’t connect. Try again."));
  }, [pending, wallet, connected, connecting, connect, fail]);

  // Step 2: once connected, sign the sign-in message and hand it to the server.
  useEffect(() => {
    if (!pending || !connected || !publicKey || signing.current) return;
    signing.current = true;
    (async () => {
      if (!signMessage) return fail("This wallet can’t sign messages. Try Phantom, Solflare or Backpack.");
      try {
        const nonceRes = await fetch("/api/auth/nonce", { cache: "no-store" });
        const { nonce, error: nonceError } = (await nonceRes.json()) as { nonce?: string; error?: string };
        if (!nonce) return fail(nonceError ?? "Sign-in isn’t available right now.");
        const address = publicKey.toBase58();
        const issuedAt = new Date().toISOString();
        const message = signInMessage({ domain: window.location.host, address, nonce, issuedAt });
        const signature = await signMessage(new TextEncoder().encode(message));
        const res = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address, signature: base58(signature), issuedAt }),
        });
        const data = (await res.json()) as Partial<Session> & { error?: string };
        if (!res.ok) return fail(data.error ?? "Sign-in failed. Try again.");
        setSession({ configured: true, address: data.address ?? address, ca: data.ca ?? null, balance: data.balance ?? null, holder: !!data.holder });
        setPending(false);
        setWorking(false);
        signing.current = false;
      } catch (e) {
        const name = (e as Error)?.name ?? "";
        fail(name.includes("Rejected") || /reject|cancel|denied/i.test(String((e as Error)?.message)) ? "You cancelled the signature. Nothing was sent." : "Sign-in failed. Try again.");
        disconnect().catch(() => {});
      }
    })();
  }, [pending, connected, publicKey, signMessage, fail, disconnect]);

  const signIn = useCallback(
    (name: WalletName) => {
      setError("");
      setWorking(true);
      setPending(true);
      signing.current = false;
      select(name);
    },
    [select],
  );

  const signOut = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    await disconnect().catch(() => {});
    setSession((s) => ({ configured: s?.configured ?? true, address: null, ca: s?.ca ?? null, balance: null, holder: false }));
  }, [disconnect]);

  const value = useMemo(
    () => ({ session, working, error, signIn, signOut, refresh, clearError: () => setError("") }),
    [session, working, error, signIn, signOut, refresh],
  );
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

// Only used so the Mobile Wallet Adapter knows it is talking to mainnet; balances are read on the server.
const ENDPOINT = "https://api.mainnet-beta.solana.com";

export function WalletSessionProvider({ children }: { children: ReactNode }) {
  const wallets = useMemo(() => [], []);
  return (
    <ConnectionProvider endpoint={ENDPOINT}>
      <WalletProvider wallets={wallets} autoConnect={false}>
        <Session>{children}</Session>
      </WalletProvider>
    </ConnectionProvider>
  );
}
