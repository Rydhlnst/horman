import { ArrowUpRight, Check, ShieldAlert, TriangleAlert } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PiScanDuotone } from "react-icons/pi";
import { CheckTabs } from "@/components/check-tabs";
import { Head } from "@/components/head";
import { isSolanaAddress } from "@/lib/auth";
import type { Level } from "@/lib/check";
import { scanWallet } from "@/lib/scan";

export const metadata: Metadata = {
  title: "Wallet scan",
  description: "Paste any Solana wallet and see every token in it checked from the chain: who can mint it, freeze it, move it or tax it.",
};
export const dynamic = "force-dynamic";

const TONE: Record<Level, string> = {
  ok: "bg-[#cfe9dc] text-[#0f5a40]",
  warn: "bg-[#f6e3c8] text-[#7a4b0b]",
  bad: "bg-[#fbdcd6] text-[#9a2f22]",
};
const ICON = { ok: Check, warn: TriangleAlert, bad: ShieldAlert };
const LABEL: Record<Level, string> = { ok: "Clean", warn: "Some risks", bad: "High risk" };
const short = (a: string) => `${a.slice(0, 4)}…${a.slice(-4)}`;
const num = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: n < 1 ? 6 : 2 });
const usd = (n: number) => `$${n.toLocaleString("en-US", { maximumFractionDigits: n < 1 ? 4 : 2 })}`;

export default async function ScanPage({ searchParams }: { searchParams: Promise<{ address?: string }> }) {
  const raw = ((await searchParams).address ?? "").trim();
  const valid = raw ? isSolanaAddress(raw) : false;
  const scan = valid ? await scanWallet(raw) : null;
  const count = (l: Level) => scan?.rows.filter((r) => r.report?.level === l).length ?? 0;

  return (
    <main>
      <section className="wrap pt-16">
        <Head
          page
          Icon={PiScanDuotone}
          kicker="Wallet scan"
          title={
            <>
              Every token in a wallet, <em>checked.</em>
            </>
          }
        >
          <p>Paste any Solana wallet. Horman reads every token it holds and flags the ones someone can mint, freeze, move or tax. Free, read-only, no wallet connection.</p>
          <CheckTabs active="wallet" />
        </Head>
      </section>

      <section className="wrap mt-10">
        <form action="/scan" method="get" className="flex flex-wrap items-center gap-3 rounded-[24px] border border-line bg-surface p-3 shadow-[0_24px_50px_-34px_rgba(20,30,25,0.4)]">
          <label htmlFor="address" className="sr-only">
            Wallet address
          </label>
          <input
            id="address"
            name="address"
            defaultValue={raw}
            placeholder="Paste a Solana wallet address…"
            autoComplete="off"
            spellCheck={false}
            className="min-w-0 flex-1 bg-transparent px-3 py-3 font-mono text-[15px] text-fg outline-none placeholder:font-sans placeholder:text-faint"
          />
          <button type="submit" className="btn btn-ink">
            Scan wallet
          </button>
        </form>
        <p className="mt-3 text-[14px] text-muted">Only public chain data is read. Nothing is signed, stored or linked to you.</p>
      </section>

      <section className="wrap mt-10">
        {raw && !valid && (
          <div className="rounded-[22px] border border-line bg-surface p-7">
            <p className="font-display text-[22px] font-bold tracking-[-0.02em]">That isn’t a Solana address.</p>
            <p className="mt-2 text-muted">Paste the wallet’s address: 32 to 44 letters and numbers.</p>
          </div>
        )}
        {valid && !scan && (
          <div className="rounded-[22px] border border-line bg-surface p-7">
            <p className="font-display text-[22px] font-bold tracking-[-0.02em]">Solana didn’t answer.</p>
            <p className="mt-2 text-muted">Try again in a moment.</p>
          </div>
        )}
        {scan && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3 rounded-[24px] border border-line bg-surface p-5">
              <span className="break-all font-mono text-[14px] text-muted">{scan.owner}</span>
              <span className="ml-auto flex flex-wrap gap-2 text-[14px] font-semibold">
                <span className="rounded-full bg-raise px-3 py-1.5">{num(scan.sol)} SOL</span>
                <span className="rounded-full bg-raise px-3 py-1.5">
                  {scan.rows.length} token{scan.rows.length === 1 ? "" : "s"}
                </span>
                {(["bad", "warn", "ok"] as Level[]).map((l) => (
                  <span key={l} className={`rounded-full px-3 py-1.5 ${TONE[l]}`}>
                    {count(l)} {LABEL[l].toLowerCase()}
                  </span>
                ))}
              </span>
            </div>

            {scan.rows.length === 0 ? (
              <div className="rounded-[22px] border border-line bg-surface p-7">
                <p className="font-display text-[22px] font-bold tracking-[-0.02em]">No tokens in this wallet.</p>
                <p className="mt-2 text-muted">It only holds SOL, or nothing at all.</p>
              </div>
            ) : (
              <ul className="flex flex-col gap-2.5">
                {scan.rows.map((r) => {
                  const level = r.report?.level;
                  const I = level ? ICON[level] : TriangleAlert;
                  const issues = r.report?.checks.filter((c) => c.level !== "ok") ?? [];
                  return (
                    <li key={r.mint} className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-[20px] border border-line bg-surface p-4">
                      <span className={`grid h-10 w-10 flex-none place-items-center rounded-[12px] ${level ? TONE[level] : "bg-raise text-muted"}`} aria-hidden="true">
                        <I size={19} />
                      </span>
                      <span className="flex min-w-[220px] flex-1 flex-col gap-0.5">
                        <span className="flex flex-wrap items-baseline gap-x-2">
                          <b className="text-[16px] font-semibold">{r.symbol ? `$${r.symbol}` : short(r.mint)}</b>
                          {r.name && <span className="text-[14px] text-muted">{r.name}</span>}
                        </span>
                        <span className="text-[14px] text-muted">
                          {issues.length ? issues.map((c) => c.title).join(" · ") : r.report ? "No mint, freeze, delegate or fee risks found" : "Couldn’t read this mint"}
                        </span>
                      </span>
                      <span className="flex flex-col items-end text-right max-[560px]:ml-14 max-[560px]:mr-auto max-[560px]:items-start max-[560px]:text-left">
                        <span className="font-mono text-[14px] tabular-nums">{num(r.amount)}</span>
                        <span className="text-[13px] text-faint">{r.usd !== null ? `≈ ${usd(r.usd)}` : "no price"}</span>
                      </span>
                      <Link href={`/check?address=${r.mint}`} className="btn btn-sm">
                        Full check <ArrowUpRight size={14} />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}

            <p className="max-w-[74ch] text-[14px] text-faint">
              Read {scan.readAt.slice(0, 16).replace("T", " ")} UTC from Solana mainnet{scan.more > 0 ? `; the first 60 tokens are shown, ${scan.more} more not scanned` : ""}. Names and prices from
              DexScreener. The scan reads each token’s rules, not its holders; Full check adds holder concentration. Stablecoins often keep freeze authority
              on purpose, and unknown tokens that showed up uninvited are best left untouched. Not financial advice.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
