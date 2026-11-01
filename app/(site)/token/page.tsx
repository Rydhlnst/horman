import { ArrowUpRight, Check, TriangleAlert } from "lucide-react";
import type { Metadata } from "next";
import { PiCoinDuotone } from "react-icons/pi";
import { CaButton } from "@/components/ca-button";
import { Head } from "@/components/head";
import { Reveal } from "@/components/motion/reveal";
import { CA_ADDRESS, TICKER } from "@/lib/site";
import { mintFacts } from "@/lib/solana";

export const metadata: Metadata = {
  title: "$HORMAN",
  description: "$HORMAN, read live from Solana: supply, mint and freeze authority, and how concentrated the largest holders are.",
};

// Rendered per request; lib/solana keeps the facts for 60 seconds.
export const dynamic = "force-dynamic";

const CA = process.env.NEXT_PUBLIC_CA?.trim() || CA_ADDRESS;
const pct = (n: number | null) => (n === null ? "unknown" : `${(n * 100).toLocaleString("en-US", { maximumFractionDigits: 1 })}%`);
const short = (a: string) => `${a.slice(0, 4)}…${a.slice(-4)}`;

type Tile = { label: string; value: string; note: string; tone: "ok" | "warn" | "plain" };

export default async function TokenPage() {
  const facts = await mintFacts(CA);
  const tiles: Tile[] = facts
    ? [
        {
          label: "Mint authority",
          value: facts.mintAuthority ? "Active" : "Revoked",
          note: facts.mintAuthority ? `${short(facts.mintAuthority)} can create more tokens.` : "No one can ever create more tokens.",
          tone: facts.mintAuthority ? "warn" : "ok",
        },
        {
          label: "Freeze authority",
          value: facts.freezeAuthority ? "Active" : "Revoked",
          note: facts.freezeAuthority ? `${short(facts.freezeAuthority)} can freeze holders’ tokens.` : "No one can freeze your tokens.",
          tone: facts.freezeAuthority ? "warn" : "ok",
        },
        {
          label: "Supply",
          value: facts.supply.toLocaleString("en-US", { maximumFractionDigits: 0 }),
          note: `${TICKER} in existence right now, ${facts.decimals} decimals.`,
          tone: "plain",
        },
        { label: "Largest ten accounts", value: pct(facts.top10), note: "Share of supply held by the ten biggest token accounts.", tone: "plain" },
        { label: "Largest account", value: pct(facts.top1), note: "Often the liquidity pool rather than one person.", tone: "plain" },
        {
          label: "Token program",
          value: facts.program,
          note: facts.extensions.length ? `Extensions: ${facts.extensions.join(", ")}.` : "No extra token rules attached.",
          tone: "plain",
        },
      ]
    : [];
  const links = [
    ["Solscan", `https://solscan.io/token/${CA}`],
    ["DexScreener", `https://dexscreener.com/solana/${CA}`],
    ["Birdeye", `https://birdeye.so/token/${CA}?chain=solana`],
  ];

  return (
    <main>
      <section className="wrap pt-16">
        <Head
          page
          Icon={PiCoinDuotone}
          kicker={TICKER}
          title={
            <>
              {TICKER}, <em>live from Solana.</em>
            </>
          }
        >
          <p>Don’t take our word for it. These facts are read straight from the chain, at most a minute old.</p>
          <div className="flex flex-wrap items-center gap-2.5">
            <CaButton />
            {links.map(([name, href]) => (
              <a key={name} href={href} target="_blank" rel="noreferrer" className="btn">
                {name} <ArrowUpRight size={16} />
              </a>
            ))}
          </div>
        </Head>
      </section>

      <Reveal className="wrap mt-14">
        {facts ? (
          <>
            <div className="grid grid-cols-3 gap-4 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1">
              {tiles.map((t) => (
                <div key={t.label} className="flex flex-col gap-2 rounded-[22px] border border-line bg-surface p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[14px] font-medium text-muted">{t.label}</span>
                    {t.tone !== "plain" && (
                      <span
                        className={`grid h-8 w-8 place-items-center rounded-[10px] ${t.tone === "ok" ? "bg-[#cfe9dc] text-[#0f5a40]" : "bg-[#f6e3c8] text-[#7a4b0b]"}`}
                        aria-hidden="true"
                      >
                        {t.tone === "ok" ? <Check size={18} strokeWidth={3} /> : <TriangleAlert size={17} />}
                      </span>
                    )}
                  </div>
                  <span className="font-display text-[34px] font-extrabold leading-none tracking-[-0.03em] tabular-nums">{t.value}</span>
                  <span className="text-[14px] leading-snug text-muted">{t.note}</span>
                </div>
              ))}
            </div>
            <p className="mt-5 max-w-[70ch] text-[14px] text-faint">
              Read {facts.readAt.slice(0, 16).replace("T", " ")} UTC from Solana mainnet. The largest token accounts can include the liquidity pool and
              exchanges, so a high share isn’t always one holder. Check any of it yourself with the links above.
            </p>
          </>
        ) : (
          <div className="rounded-[22px] border border-line bg-surface p-8">
            <p className="font-display text-[24px] font-bold tracking-[-0.02em]">Couldn’t read Solana right now.</p>
            <p className="mt-2 text-muted">The page tries again within a minute. Until then, check {TICKER} on Solscan with the link above.</p>
          </div>
        )}
      </Reveal>

      <section className="section">
        <Head
          kicker="Paste any token"
          title={
            <>
              Check any token <em>the same way.</em>
            </>
          }
          lede="Run any Solana token through the free Token check, or paste it into the Horman chat for the same live facts in plain words."
        >
          <div className="flex flex-wrap gap-2.5">
            <a href="/check" className="btn btn-ink">
              Open Token check <ArrowUpRight size={16} />
            </a>
            <a href="/chat" className="btn">
              Open the chat <ArrowUpRight size={16} />
            </a>
          </div>
        </Head>
      </section>
    </main>
  );
}
