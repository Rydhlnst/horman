// Server-only: every token in a wallet, each run through the token checks. Mints are read
// in one batched call, so a scan costs a handful of RPC requests however many tokens it holds.
import "server-only";
import { checkToken, type Level, type Report } from "@/lib/check";
import { parseMint, rpc, TOKEN, TOKEN_2022, type AccountInfo } from "@/lib/solana";

const MAX_TOKENS = 60;
const RANK: Record<Level, number> = { bad: 0, warn: 1, ok: 2 };

export type ScanRow = {
  mint: string;
  amount: number;
  name: string | null;
  symbol: string | null;
  usd: number | null;
  report: Report | null;
};
export type Scan = { owner: string; sol: number; rows: ScanRow[]; more: number; readAt: string };

type Owned = { value: { account: { data: { parsed?: { info?: { mint?: string; tokenAmount?: { uiAmount?: number } } } } } }[] };

/** Names and prices from DexScreener, best effort: a scan never waits long or fails on it. */
async function market(mints: string[]): Promise<Map<string, { name: string; symbol: string; price: number | null }>> {
  const out = new Map<string, { name: string; symbol: string; price: number | null; liq: number }>();
  for (let i = 0; i < mints.length; i += 30) {
    try {
      const res = await fetch(`https://api.dexscreener.com/tokens/v1/solana/${mints.slice(i, i + 30).join(",")}`, { signal: AbortSignal.timeout(4000), next: { revalidate: 60 } });
      if (!res.ok) continue;
      const pairs = (await res.json()) as { baseToken?: { address?: string; name?: string; symbol?: string }; priceUsd?: string; liquidity?: { usd?: number } }[];
      for (const p of Array.isArray(pairs) ? pairs : []) {
        const a = p.baseToken?.address;
        if (!a) continue;
        const liq = p.liquidity?.usd ?? 0;
        const prev = out.get(a);
        if (!prev || liq > prev.liq) out.set(a, { name: p.baseToken?.name ?? "", symbol: p.baseToken?.symbol ?? "", price: p.priceUsd ? Number(p.priceUsd) : null, liq });
      }
    } catch {
      /* names and prices are a bonus */
    }
  }
  return new Map([...out].map(([k, v]) => [k, { name: v.name, symbol: v.symbol, price: v.price }]));
}

/** null when Solana couldn't be read. */
export async function scanWallet(owner: string): Promise<Scan | null> {
  const opts = { encoding: "jsonParsed", commitment: "confirmed" };
  const [classic, t22, bal] = await Promise.all([
    rpc<Owned>("getTokenAccountsByOwner", [owner, { programId: TOKEN }, opts]),
    rpc<Owned>("getTokenAccountsByOwner", [owner, { programId: TOKEN_2022 }, opts]),
    rpc<{ value: number }>("getBalance", [owner, { commitment: "confirmed" }]),
  ]);
  if (!classic && !t22) return null;

  const amounts = new Map<string, number>();
  for (const a of [...(classic?.value ?? []), ...(t22?.value ?? [])]) {
    const info = a.account.data.parsed?.info;
    const amount = info?.tokenAmount?.uiAmount ?? 0;
    if (info?.mint && amount > 0) amounts.set(info.mint, (amounts.get(info.mint) ?? 0) + amount);
  }
  const all = [...amounts.keys()];
  const mints = all.slice(0, MAX_TOKENS);

  const accounts: AccountInfo["value"][] = [];
  for (let i = 0; i < mints.length; i += 100) {
    const got = await rpc<{ value: AccountInfo["value"][] }>("getMultipleAccounts", [mints.slice(i, i + 100), opts]);
    accounts.push(...(got?.value ?? mints.slice(i, i + 100).map(() => null)));
  }
  const names = await market(mints);

  const rows: ScanRow[] = mints.map((mint, i) => {
    const facts = parseMint(mint, accounts[i] ?? null);
    const m = names.get(mint);
    const amount = amounts.get(mint) ?? 0;
    return {
      mint,
      amount,
      name: m?.name || null,
      symbol: m?.symbol || null,
      usd: m?.price != null ? amount * m.price : null,
      report: facts ? checkToken(facts) : null,
    };
  });
  // Riskiest first, then the largest holdings by value.
  rows.sort((a, b) => RANK[a.report?.level ?? "ok"] - RANK[b.report?.level ?? "ok"] || (b.usd ?? 0) - (a.usd ?? 0));
  return { owner, sol: (bal?.value ?? 0) / 1e9, rows, more: all.length - mints.length, readAt: new Date().toISOString() };
}
