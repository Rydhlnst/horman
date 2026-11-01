import { ArrowUpRight, Check, ShieldAlert, TriangleAlert } from "lucide-react";
import type { Metadata } from "next";
import { PiShieldCheckDuotone } from "react-icons/pi";
import { Head } from "@/components/head";
import { checkToken, type Level } from "@/lib/check";
import { isSolanaAddress } from "@/lib/auth";
import { CA_ADDRESS } from "@/lib/site";
import { mintFacts } from "@/lib/solana";

export const metadata: Metadata = {
  title: "Token check",
  description: "Paste any Solana token and see, from the chain, who can mint it, freeze it, move it or tax it, and how concentrated its holders are.",
};
export const dynamic = "force-dynamic";

const USDC = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
const TONE: Record<Level, string> = {
  ok: "bg-[#cfe9dc] text-[#0f5a40]",
  warn: "bg-[#f6e3c8] text-[#7a4b0b]",
  bad: "bg-[#fbdcd6] text-[#9a2f22]",
};
const ICON = { ok: Check, warn: TriangleAlert, bad: ShieldAlert };

export default async function CheckPage({ searchParams }: { searchParams: Promise<{ address?: string }> }) {
  const raw = ((await searchParams).address ?? "").trim();
  const valid = raw ? isSolanaAddress(raw) : false;
  const facts = valid ? await mintFacts(raw) : null;
  const report = facts ? checkToken(facts) : null;

  return (
    <main>
      <section className="wrap pt-16">
        <Head
          page
          Icon={PiShieldCheckDuotone}
          kicker="Token check"
          title={
            <>
              Check a token <em>before you buy.</em>
            </>
          }
        >
          <p>Paste any Solana token. Horman reads it from the chain and shows who can mint it, freeze it, move it or tax it. Free, no wallet needed.</p>
        </Head>
      </section>

      <section className="wrap mt-10">
        <form action="/check" method="get" className="flex flex-wrap items-center gap-3 rounded-[24px] border border-line bg-surface p-3 shadow-[0_24px_50px_-34px_rgba(20,30,25,0.4)]">
          <label htmlFor="address" className="sr-only">
            Token mint address
          </label>
          <input
            id="address"
            name="address"
            defaultValue={raw}
            placeholder="Paste a token mint address…"
            autoComplete="off"
            spellCheck={false}
            className="min-w-0 flex-1 bg-transparent px-3 py-3 font-mono text-[15px] text-fg outline-none placeholder:font-sans placeholder:text-faint"
          />
          <button type="submit" className="btn btn-ink">
            Check token
          </button>
        </form>
        <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[14px] text-muted">
          Try:
          <a className="text-accent underline underline-offset-2" href={`/check?address=${CA_ADDRESS}`}>
            $HORMAN
          </a>
          <a className="text-accent underline underline-offset-2" href={`/check?address=${USDC}`}>
            USDC
          </a>
        </p>
      </section>

      <section className="wrap mt-10">
        {raw && !valid && (
          <div className="rounded-[22px] border border-line bg-surface p-7">
            <p className="font-display text-[22px] font-bold tracking-[-0.02em]">That isn’t a Solana address.</p>
            <p className="mt-2 text-muted">Paste the token’s mint address: 32 to 44 letters and numbers, often ending in “pump” for pump.fun tokens.</p>
          </div>
        )}
        {valid && !facts && (
          <div className="rounded-[22px] border border-line bg-surface p-7">
            <p className="font-display text-[22px] font-bold tracking-[-0.02em]">No token mint at this address, or Solana didn’t answer.</p>
            <p className="mt-2 text-muted">
              If it’s a wallet or a program, paste it into the{" "}
              <a className="text-accent underline underline-offset-2" href="/chat">
                Horman chat
              </a>{" "}
              for a live read. Otherwise try again in a moment.
            </p>
          </div>
        )}
        {facts && report && (
          <div className="flex flex-col gap-4">
            <div className={`flex flex-wrap items-center gap-4 rounded-[24px] p-6 ${TONE[report.level]}`}>
              {(() => {
                const I = ICON[report.level];
                return <I size={30} />;
              })()}
              <div className="flex min-w-0 flex-col">
                <span className="font-display text-[28px] font-extrabold tracking-[-0.03em]">{report.verdict}</span>
                <span className="break-all font-mono text-[13px] opacity-80">{facts.address}</span>
              </div>
              <a href={`https://solscan.io/token/${facts.address}`} target="_blank" rel="noreferrer" className="btn ml-auto bg-white/70">
                Solscan <ArrowUpRight size={16} />
              </a>
            </div>
            <ul className="grid grid-cols-2 gap-3 max-[760px]:grid-cols-1">
              {report.checks.map((c) => {
                const I = ICON[c.level];
                return (
                  <li key={c.title} className="flex gap-3 rounded-[20px] border border-line bg-surface p-5">
                    <span className={`grid h-9 w-9 flex-none place-items-center rounded-[11px] ${TONE[c.level]}`} aria-hidden="true">
                      <I size={18} />
                    </span>
                    <span className="flex flex-col gap-1">
                      <b className="text-[16px] font-semibold">{c.title}</b>
                      <span className="text-[14px] leading-snug text-muted">{c.detail}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="max-w-[72ch] text-[14px] text-faint">
              {facts.program} · supply {facts.supply.toLocaleString("en-US", { maximumFractionDigits: 0 })} · read {facts.readAt.slice(0, 16).replace("T", " ")} UTC.
              These checks read the token’s code and holders, not the team behind it. Stablecoins and wrapped assets often keep mint and freeze authority
              on purpose. Not financial advice.
            </p>
            <a href="/chat" className="btn self-start">
              Ask Horman to explain it <ArrowUpRight size={16} />
            </a>
          </div>
        )}
      </section>
    </main>
  );
}
