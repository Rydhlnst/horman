// Server-only: reads one Solana transaction and turns it into plain facts: who signed and
// paid, what moved where, which programs ran, and whether it worked.
import "server-only";
import { base58Decode } from "@/lib/auth";
import { market } from "@/lib/scan";
import { rpc } from "@/lib/solana";
import { CA_ADDRESS, TICKER } from "@/lib/site";

const LAMPORTS = 1_000_000_000;

/** Well-known programs, so the story can say "Jupiter" instead of an address. */
const PROGRAMS: Record<string, string> = {
  "11111111111111111111111111111111": "System Program",
  TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA: "Token Program",
  TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb: "Token-2022",
  ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL: "Associated Token Account",
  ComputeBudget111111111111111111111111111111: "Compute Budget",
  MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr: "Memo",
  JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4: "Jupiter",
  "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8": "Raydium AMM",
  CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK: "Raydium CLMM",
  CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C: "Raydium CPMM",
  whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc: "Orca Whirlpool",
  LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo: "Meteora DLMM",
  "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P": "pump.fun",
  pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA: "PumpSwap",
  metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s: "Metaplex Token Metadata",
  Stake11111111111111111111111111111111111111: "Stake Program",
  Vote111111111111111111111111111111111111111: "Vote Program",
};
const MINTS: Record<string, string> = {
  So11111111111111111111111111111111111111112: "SOL (wrapped)",
  EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: "USDC",
  Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB: "USDT",
  [CA_ADDRESS]: TICKER,
};

export const short = (a: string) => `${a.slice(0, 4)}…${a.slice(-4)}`;
const num = (n: number, d = 6) => n.toLocaleString("en-US", { maximumFractionDigits: d });

/** The first transaction signature in a message (64 bytes of base58), if any. */
export function findSignature(text: string): string | null {
  for (const m of text.matchAll(/\b[1-9A-HJ-NP-Za-km-z]{80,90}\b/g)) {
    if (base58Decode(m[0])?.length === 64) return m[0];
  }
  return null;
}

type TokenBal = { accountIndex: number; mint: string; owner?: string; uiTokenAmount: { uiAmount: number | null } };
type Ix = { programId: string; program?: string; parsed?: { type?: string; info?: Record<string, unknown> } };
type RawTx = {
  slot: number;
  blockTime: number | null;
  meta: {
    err: unknown;
    fee: number;
    preBalances: number[];
    postBalances: number[];
    preTokenBalances?: TokenBal[];
    postTokenBalances?: TokenBal[];
    logMessages?: string[];
    innerInstructions?: { instructions: Ix[] }[];
  } | null;
  transaction: { message: { accountKeys: { pubkey: string; signer: boolean; writable: boolean }[]; instructions: Ix[] } };
};

export type Move = { who: string; asset: string; mint: string | null; delta: number };
export type TxStory = {
  signature: string;
  ok: boolean;
  error: string | null;
  when: string | null;
  slot: number;
  feeSol: number;
  feePayer: string;
  signers: string[];
  programs: string[];
  moves: Move[];
  logTail: string[];
};

/** null when Solana couldn't be read or the signature isn't found. */
export async function readTx(signature: string): Promise<TxStory | null> {
  const tx = await rpc<RawTx>("getTransaction", [signature, { encoding: "jsonParsed", maxSupportedTransactionVersion: 0, commitment: "confirmed" }]);
  if (!tx?.meta) return null;
  const keys = tx.transaction.message.accountKeys.map((k) => k.pubkey);
  const signers = tx.transaction.message.accountKeys.filter((k) => k.signer).map((k) => k.pubkey);
  const m = tx.meta;

  // Programs that ran, top level first, then inner calls, without repeats.
  const ran = [...tx.transaction.message.instructions, ...(m.innerInstructions ?? []).flatMap((i) => i.instructions)].map((i) => i.programId);
  const programs = [...new Set(ran)].map((id) => PROGRAMS[id] ?? short(id));

  // SOL changes per account; the fee payer's change leaves the fee out so it reads as a transfer.
  const moves: Move[] = [];
  keys.forEach((k, i) => {
    let d = (m.postBalances[i] ?? 0) - (m.preBalances[i] ?? 0);
    if (i === 0) d += m.fee;
    if (Math.abs(d) >= 1000) moves.push({ who: k, asset: "SOL", mint: null, delta: d / LAMPORTS });
  });

  // Token changes per owner and mint.
  const tok = new Map<string, Move>();
  const add = (b: TokenBal, sign: 1 | -1) => {
    const who = b.owner ?? keys[b.accountIndex];
    const key = `${who}:${b.mint}`;
    const cur = tok.get(key) ?? { who, asset: MINTS[b.mint] ?? short(b.mint), mint: b.mint, delta: 0 };
    cur.delta += sign * (b.uiTokenAmount.uiAmount ?? 0);
    tok.set(key, cur);
  };
  (m.preTokenBalances ?? []).forEach((b) => add(b, -1));
  (m.postTokenBalances ?? []).forEach((b) => add(b, 1));
  const tokenMoves = [...tok.values()].filter((t) => Math.abs(t.delta) > 1e-9);

  // Name unknown mints from DexScreener when it answers.
  const unknown = [...new Set(tokenMoves.filter((t) => t.mint && !MINTS[t.mint]).map((t) => t.mint as string))];
  if (unknown.length) {
    const names = await market(unknown);
    for (const t of tokenMoves) {
      const n = t.mint ? names.get(t.mint) : undefined;
      if (n?.symbol) t.asset = `$${n.symbol}`;
    }
  }
  moves.push(...tokenMoves);
  moves.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));

  const logs = m.logMessages ?? [];
  return {
    signature,
    ok: !m.err,
    // Prefer the program's own words ("Error: Slippage tolerance exceeded") over the raw error code.
    error: m.err
      ? (logs.find((l) => /Program log: (Error|AnchorError)/i.test(l))?.replace(/^Program log: /, "") ??
          logs.filter((l) => /error|failed|insufficient/i.test(l)).pop() ??
          JSON.stringify(m.err)
        ).slice(0, 240)
      : null,
    when: tx.blockTime ? new Date(tx.blockTime * 1000).toISOString() : null,
    slot: tx.slot,
    feeSol: m.fee / LAMPORTS,
    feePayer: keys[0],
    signers,
    programs,
    moves: moves.slice(0, 16),
    logTail: m.err ? logs.slice(-6) : [],
  };
}

/** The facts as a system message for the chat model. */
export function txContext(s: TxStory): string {
  const lines = [
    `Live Solana mainnet data for transaction ${s.signature}:`,
    `Status: ${s.ok ? "succeeded" : `FAILED (${s.error})`}`,
    `Time: ${s.when ? s.when.slice(0, 16).replace("T", " ") + " UTC" : "unknown"}, slot ${s.slot}`,
    `Fee payer: ${s.feePayer}; signers: ${s.signers.join(", ")}`,
    `Fee: ${num(s.feeSol, 9)} SOL`,
    `Programs used: ${s.programs.join(", ")}`,
    s.moves.length
      ? `Balance changes (fee excluded): ${s.moves.map((mv) => `${short(mv.who)} ${mv.delta > 0 ? "+" : ""}${num(mv.delta)} ${mv.asset}`).join("; ")}`
      : "Balance changes: none besides the fee",
    ...(s.logTail.length ? [`Last program logs: ${s.logTail.join(" | ")}`] : []),
    "Explain what this transaction did in plain words: who paid whom, what was swapped or minted, through which programs, and whether it worked. Use only these facts and say what they can't tell (for example why someone did it).",
  ];
  return lines.join("\n");
}
