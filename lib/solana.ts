// Server-only: reads live Solana data for an address pasted into the chat, so the model
// can explain real numbers instead of guessing. Uses SOLANA_RPC_URL.
import "server-only";
import { isSolanaAddress } from "@/lib/auth";

export const TOKEN = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
export const TOKEN_2022 = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
const UPGRADEABLE_LOADER = "BPFLoaderUpgradeab1e11111111111111111111111";
const SYSTEM_PROGRAM = "11111111111111111111111111111111";
const LAMPORTS = 1_000_000_000;

export type OnchainKind = "wallet" | "token" | "program" | "token account" | "account" | "empty";
export type Onchain = { address: string; kind: OnchainKind; context: string };

/** The first full Solana address in a message, if any. */
export function findAddress(text: string): string | null {
  for (const m of text.matchAll(/\b[1-9A-HJ-NP-Za-km-z]{32,44}\b/g)) {
    if (isSolanaAddress(m[0])) return m[0];
  }
  return null;
}

export async function rpc<T>(method: string, params: unknown[]): Promise<T | null> {
  const url = process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
      cache: "no-store",
      signal: AbortSignal.timeout(7000),
    });
    const json = (await res.json()) as { result?: T };
    return json.result ?? null;
  } catch {
    return null;
  }
}

type Parsed = { parsed?: { type?: string; info?: Record<string, unknown> }; program?: string };
export type AccountInfo = { value: { lamports: number; owner: string; executable: boolean; data: Parsed | unknown[] } | null };

const num = (n: number, d = 2) => n.toLocaleString("en-US", { maximumFractionDigits: d });
const short = (a: string) => `${a.slice(0, 4)}…${a.slice(-4)}`;
const when = (t?: number | null) => (t ? new Date(t * 1000).toISOString().replace("T", " ").slice(0, 16) + " UTC" : "unknown");

async function tokenMint(address: string, program: string, info: Record<string, unknown>): Promise<string> {
  const decimals = Number(info.decimals ?? 0);
  const supply = Number(info.supply ?? 0) / 10 ** decimals;
  const largest = await rpc<{ value: { address: string; uiAmountString?: string }[] }>("getTokenLargestAccounts", [address, { commitment: "confirmed" }]);
  const top = (largest?.value ?? []).slice(0, 10).map((a) => Number(a.uiAmountString ?? 0));
  const topSum = top.reduce((s, n) => s + n, 0);
  const lines = [
    `Type: token mint (${program === "spl-token-2022" ? "Token-2022" : "SPL Token"})`,
    `Supply: ${num(supply)} (decimals ${decimals})`,
    `Mint authority: ${info.mintAuthority ? `ACTIVE (${short(String(info.mintAuthority))}), more tokens can be minted` : "revoked, supply is fixed"}`,
    `Freeze authority: ${info.freezeAuthority ? `ACTIVE (${short(String(info.freezeAuthority))}), holders' accounts can be frozen` : "revoked"}`,
  ];
  if (top.length && supply > 0) {
    lines.push(`Largest token accounts: top 1 holds ${num((top[0] / supply) * 100, 1)}%, top 10 hold ${num((topSum / supply) * 100, 1)}% (accounts can include liquidity pools and exchanges)`);
  }
  const ext = info.extensions as { extension?: string; state?: Record<string, unknown> }[] | undefined;
  if (ext?.length) lines.push(`Token-2022 extensions: ${ext.map((e) => e.extension).filter(Boolean).join(", ")}`);
  return lines.join("\n");
}

async function wallet(address: string, lamports: number): Promise<string> {
  const [classic, t22, sigs] = await Promise.all([
    rpc<{ value: { account: { data: Parsed } }[] }>("getTokenAccountsByOwner", [address, { programId: TOKEN }, { encoding: "jsonParsed", commitment: "confirmed" }]),
    rpc<{ value: { account: { data: Parsed } }[] }>("getTokenAccountsByOwner", [address, { programId: TOKEN_2022 }, { encoding: "jsonParsed", commitment: "confirmed" }]),
    rpc<{ blockTime?: number | null; err: unknown }[]>("getSignaturesForAddress", [address, { limit: 25 }]),
  ]);
  const holdings = [...(classic?.value ?? []), ...(t22?.value ?? [])]
    .map((a) => {
      const info = (a.account.data as Parsed).parsed?.info as { mint?: string; tokenAmount?: { uiAmount?: number } } | undefined;
      return { mint: info?.mint ?? "", amount: info?.tokenAmount?.uiAmount ?? 0 };
    })
    .filter((h) => h.amount > 0)
    .sort((a, b) => b.amount - a.amount);
  const lines = [`Type: wallet`, `SOL balance: ${num(lamports / LAMPORTS, 4)} SOL`, `Token accounts with a balance: ${holdings.length}`];
  if (holdings.length) lines.push(`Largest holdings by amount: ${holdings.slice(0, 6).map((h) => `${num(h.amount)} of mint ${short(h.mint)}`).join("; ")}`);
  if (sigs) {
    const failed = sigs.filter((s) => s.err).length;
    lines.push(
      sigs.length
        ? `Recent activity: last ${sigs.length} transactions, newest ${when(sigs[0]?.blockTime)}, oldest of those ${when(sigs[sigs.length - 1]?.blockTime)}, ${failed} failed`
        : "Recent activity: no transactions found",
    );
  }
  return lines.join("\n");
}

async function program(info: Record<string, unknown> | undefined): Promise<string> {
  const programData = info?.programData as string | undefined;
  if (!programData) return "Type: program (not upgradeable through the standard loader)";
  const pd = await rpc<AccountInfo>("getAccountInfo", [programData, { encoding: "jsonParsed" }]);
  const pinfo = ((pd?.value?.data as Parsed)?.parsed?.info ?? {}) as { authority?: string | null; slot?: number };
  return [
    "Type: program (upgradeable loader)",
    pinfo.authority ? `Upgrade authority: ACTIVE (${short(pinfo.authority)}), the code can be replaced` : "Upgrade authority: none, the code is immutable",
    pinfo.slot ? `Last deployed at slot ${pinfo.slot}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

/** Reads the address on Solana mainnet and returns a short, factual summary for the model. */
export async function readOnchain(address: string): Promise<Onchain | null> {
  const acct = await rpc<AccountInfo>("getAccountInfo", [address, { encoding: "jsonParsed", commitment: "confirmed" }]);
  if (!acct) return null;
  const v = acct.value;
  let kind: OnchainKind;
  let body: string;
  if (!v) {
    kind = "empty";
    body = "No account exists at this address on Solana mainnet (it holds no SOL and no data).";
  } else {
    const data = Array.isArray(v.data) ? undefined : (v.data as Parsed);
    const type = data?.parsed?.type;
    if ((v.owner === TOKEN || v.owner === TOKEN_2022) && type === "mint") {
      kind = "token";
      body = await tokenMint(address, data?.program ?? "", data?.parsed?.info ?? {});
    } else if ((v.owner === TOKEN || v.owner === TOKEN_2022) && type === "account") {
      kind = "token account";
      const info = data?.parsed?.info as { mint?: string; owner?: string; tokenAmount?: { uiAmountString?: string } } | undefined;
      body = `Type: token account\nMint: ${info?.mint}\nOwner wallet: ${info?.owner}\nBalance: ${info?.tokenAmount?.uiAmountString}`;
    } else if (v.executable || v.owner === UPGRADEABLE_LOADER) {
      kind = "program";
      body = await program(data?.parsed?.info);
    } else if (v.owner === SYSTEM_PROGRAM) {
      kind = "wallet";
      body = await wallet(address, v.lamports);
    } else {
      kind = "account";
      body = `Type: account owned by program ${v.owner}\nSOL balance: ${num(v.lamports / LAMPORTS, 4)} SOL`;
    }
  }
  const context = [
    `Live Solana mainnet data for ${address}, read ${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC:`,
    body,
    "Use only these facts for onchain claims. Explain what they mean in plain words, point out risks (active mint or freeze authority, upgradeable code, concentrated holders) and say what the data can't tell.",
  ].join("\n");
  return { address, kind, context };
}

export type MintFacts = {
  address: string;
  program: "SPL Token" | "Token-2022";
  decimals: number;
  supply: number;
  mintAuthority: string | null;
  freezeAuthority: string | null;
  /** Share of supply in the largest token account and the largest ten, 0..1. */
  top1: number | null;
  top10: number | null;
  extensions: string[];
  /** Token-2022 extensions with their state, for the safety checks. */
  extensionData: { extension: string; state?: Record<string, unknown> }[];
  readAt: string;
};

const factsCache = new Map<string, { at: number; facts: MintFacts }>();

/**
 * Structured facts about a token mint, read live and kept for 60 seconds per server
 * instance so a busy page doesn't hammer the RPC. null if the chain couldn't be read
 * or the address isn't a mint.
 */
export async function mintFacts(address: string): Promise<MintFacts | null> {
  if (!isSolanaAddress(address)) return null;
  const hit = factsCache.get(address);
  if (hit && Date.now() - hit.at < 60_000) return hit.facts;
  const facts = await readMintFacts(address);
  if (facts) factsCache.set(address, { at: Date.now(), facts });
  return facts ?? hit?.facts ?? null;
}

/** A mint's facts from its jsonParsed account, without holder concentration. null if it isn't a mint. */
export function parseMint(address: string, v: AccountInfo["value"]): MintFacts | null {
  const data = v && !Array.isArray(v.data) ? (v.data as Parsed) : undefined;
  if (!v || (v.owner !== TOKEN && v.owner !== TOKEN_2022) || data?.parsed?.type !== "mint") return null;
  const info = data.parsed.info ?? {};
  const decimals = Number(info.decimals ?? 0);
  const ext = (info.extensions as { extension?: string; state?: Record<string, unknown> }[] | undefined) ?? [];
  return {
    address,
    program: v.owner === TOKEN_2022 ? "Token-2022" : "SPL Token",
    decimals,
    supply: Number(info.supply ?? 0) / 10 ** decimals,
    mintAuthority: (info.mintAuthority as string | null) ?? null,
    freezeAuthority: (info.freezeAuthority as string | null) ?? null,
    top1: null,
    top10: null,
    extensions: ext.map((e) => e.extension ?? "").filter(Boolean),
    extensionData: ext.filter((e) => e.extension).map((e) => ({ extension: e.extension as string, state: e.state })),
    readAt: new Date().toISOString(),
  };
}

async function readMintFacts(address: string): Promise<MintFacts | null> {
  const acct = await rpc<AccountInfo>("getAccountInfo", [address, { encoding: "jsonParsed", commitment: "confirmed" }]);
  const facts = parseMint(address, acct?.value ?? null);
  if (!facts) return null;
  const largest = await rpc<{ value: { uiAmountString?: string }[] }>("getTokenLargestAccounts", [address, { commitment: "confirmed" }]);
  const top = (largest?.value ?? []).slice(0, 10).map((a) => Number(a.uiAmountString ?? 0));
  const s = facts.supply;
  return {
    ...facts,
    top1: top.length && s > 0 ? top[0] / s : null,
    top10: top.length && s > 0 ? top.reduce((sum, n) => sum + n, 0) / s : null,
  };
}
