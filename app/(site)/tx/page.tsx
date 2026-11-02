import { ArrowDownLeft, ArrowUpRight, Check, ShieldAlert } from "lucide-react";
import type { Metadata } from "next";
import { PiArrowsLeftRightDuotone } from "react-icons/pi";
import { CheckTabs } from "@/components/check-tabs";
import { Head } from "@/components/head";
import { findSignature, readTx, short } from "@/lib/tx";

export const metadata: Metadata = {
  title: "Transaction explainer",
  description: "Paste any Solana transaction signature and see what it did: who paid whom, which tokens moved, which programs ran, the fee, and whether it worked.",
};
export const dynamic = "force-dynamic";

const num = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: Math.abs(n) < 1 ? 6 : 4 });

export default async function TxPage({ searchParams }: { searchParams: Promise<{ sig?: string }> }) {
  const raw = ((await searchParams).sig ?? "").trim();
  const sig = raw ? findSignature(raw) : null;
  const s = sig ? await readTx(sig) : null;

  return (
    <main>
      <section className="wrap pt-16">
        <Head
          page
          Icon={PiArrowsLeftRightDuotone}
          kicker="Transaction explainer"
          title={
            <>
              What did this transaction <em>actually do?</em>
            </>
          }
        >
          <p>Paste any Solana transaction signature. Horman reads it from the chain and shows who paid whom, which tokens moved, which programs ran and whether it worked. Free, no wallet needed.</p>
          <CheckTabs active="tx" />
        </Head>
      </section>

      <section className="wrap mt-10">
        <form action="/tx" method="get" className="flex flex-wrap items-center gap-3 rounded-[24px] border border-line bg-surface p-3 shadow-[0_24px_50px_-34px_rgba(20,30,25,0.4)]">
          <label htmlFor="sig" className="sr-only">
            Transaction signature
          </label>
          <input
            id="sig"
            name="sig"
            defaultValue={raw}
            placeholder="Paste a transaction signature…"
            autoComplete="off"
            spellCheck={false}
            className="min-w-0 flex-1 bg-transparent px-3 py-3 font-mono text-[15px] text-fg outline-none placeholder:font-sans placeholder:text-faint"
          />
          <button type="submit" className="btn btn-ink">
            Explain it
          </button>
        </form>
        <p className="mt-3 text-[14px] text-muted">The long string in your wallet’s activity or on Solscan, usually 87 or 88 characters.</p>
      </section>

      <section className="wrap mt-10">
        {raw && !sig && (
          <div className="rounded-[22px] border border-line bg-surface p-7">
            <p className="font-display text-[22px] font-bold tracking-[-0.02em]">That isn’t a transaction signature.</p>
            <p className="mt-2 text-muted">
              A signature is 87 or 88 letters and numbers. For a wallet, use{" "}
              <a className="text-accent underline underline-offset-2" href="/scan">
                Wallet scan
              </a>
              ; for a token, use{" "}
              <a className="text-accent underline underline-offset-2" href="/check">
                Token check
              </a>
              .
            </p>
          </div>
        )}
        {sig && !s && (
          <div className="rounded-[22px] border border-line bg-surface p-7">
            <p className="font-display text-[22px] font-bold tracking-[-0.02em]">No transaction found, or Solana didn’t answer.</p>
            <p className="mt-2 text-muted">Check that it’s a mainnet signature, or try again in a moment. Very old transactions may not be kept by every RPC.</p>
          </div>
        )}
        {s && (
          <div className="flex flex-col gap-4">
            <div className={`flex flex-wrap items-center gap-4 rounded-[24px] p-6 ${s.ok ? "bg-[#cfe9dc] text-[#0f5a40]" : "bg-[#fbdcd6] text-[#9a2f22]"}`}>
              {s.ok ? <Check size={30} strokeWidth={3} /> : <ShieldAlert size={30} />}
              <div className="flex min-w-0 flex-col">
                <span className="font-display text-[28px] font-extrabold tracking-[-0.03em]">{s.ok ? "It worked" : "It failed"}</span>
                <span className="text-[14px] opacity-80">
                  {s.when ? `${s.when.slice(0, 16).replace("T", " ")} UTC` : "Time unknown"} · slot {s.slot.toLocaleString("en-US")} · fee {num(s.feeSol)} SOL
                </span>
              </div>
              <a href={`https://solscan.io/tx/${s.signature}`} target="_blank" rel="noreferrer" className="btn ml-auto bg-white/70">
                Solscan <ArrowUpRight size={16} />
              </a>
            </div>
            {!s.ok && s.error && <p className="rounded-[18px] border border-line bg-surface p-5 font-mono text-[13px] text-muted">{s.error}</p>}

            <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-4 max-[860px]:grid-cols-1">
              <div className="rounded-[22px] border border-line bg-surface p-6">
                <h2 className="font-display text-[20px] font-bold tracking-[-0.02em]">What moved</h2>
                {s.moves.length === 0 ? (
                  <p className="mt-3 text-muted">Nothing besides the fee.</p>
                ) : (
                  <ul className="mt-3 flex flex-col">
                    {s.moves.map((m, i) => (
                      <li key={i} className="flex items-center gap-3 border-t border-line py-3 first:border-t-0">
                        <span className={`grid h-8 w-8 flex-none place-items-center rounded-[10px] ${m.delta > 0 ? "bg-[#cfe9dc] text-[#0f5a40]" : "bg-[#fbdcd6] text-[#9a2f22]"}`} aria-hidden="true">
                          {m.delta > 0 ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                        </span>
                        <a href={`/scan?address=${m.who}`} className="font-mono text-[14px] text-muted underline-offset-2 hover:underline">
                          {short(m.who)}
                        </a>
                        <span className={`ml-auto font-mono text-[14px] tabular-nums ${m.delta > 0 ? "text-[#0f5a40]" : "text-[#9a2f22]"}`}>
                          {m.delta > 0 ? "+" : ""}
                          {num(m.delta)} {m.asset}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex flex-col gap-4">
                <div className="rounded-[22px] border border-line bg-surface p-6">
                  <h2 className="font-display text-[20px] font-bold tracking-[-0.02em]">Programs that ran</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {s.programs.map((p) => (
                      <span key={p} className="rounded-full bg-raise px-3 py-1.5 text-[14px] font-medium">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-[22px] border border-line bg-surface p-6">
                  <h2 className="font-display text-[20px] font-bold tracking-[-0.02em]">Signed by</h2>
                  <ul className="mt-3 flex flex-col gap-1.5">
                    {s.signers.map((a) => (
                      <li key={a} className="break-all font-mono text-[13px] text-muted">
                        {a}
                        {a === s.feePayer ? " · paid the fee" : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <p className="max-w-[74ch] text-[14px] text-faint">
              Balance changes are shown per wallet, with the fee left out. Token names from DexScreener when it answers. The chain shows what happened, not why.
              Paste the signature into the chat for the story in plain words.
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
