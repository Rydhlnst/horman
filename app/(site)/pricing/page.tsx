import { ArrowUpRight, Check, Coins, Ticket } from "lucide-react";
import {
  PiBrainDuotone,
  PiChatCircleDuotone,
  PiCrosshairDuotone,
  PiImageDuotone,
  PiMicrophoneDuotone,
  PiSparkleDuotone,
  PiVideoCameraDuotone,
} from "react-icons/pi";
import type { Metadata } from "next";
import { Head } from "@/components/head";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import Link from "next/link";
import { FREE_LIMIT, HOLD } from "@/lib/site";

export const metadata: Metadata = { title: "Pricing" };

// Free access needs no token and gets the free tier: Auto only.
const FREE = ["Auto, which answers with a light open model", FREE_LIMIT, "[N] images a day", "Sealed mode included", "No account, no token, no ads"];
// Holding the token unlocks every model; use is paid with credit.
const HOLDER = [
  `Hold ${HOLD} in your wallet to unlock every model`,
  "Pick any model, in every mode it runs in",
  "Pay per use with credit: top-ups of $1 to $200",
  "Pay in ZEC today, USDC on Solana soon. No card needed",
];

const PRICES = [
  { Icon: PiChatCircleDuotone, use: "Chat · Fast", covers: "Quick answers and everyday questions", price: "[PRICE] per 1M tokens" },
  { Icon: PiSparkleDuotone, use: "Chat · Auto", covers: "Picks the right model for each question", price: "[PRICE] per 1M tokens" },
  { Icon: PiBrainDuotone, use: "Chat · Reasoning", covers: "Hard problems, analysis and code", price: "[PRICE] per 1M tokens" },
  { Icon: PiImageDuotone, use: "Image", covers: "One image, 1024 × 1024", price: "[PRICE] per image" },
  { Icon: PiVideoCameraDuotone, use: "Video", covers: "Short clip", price: "[PRICE] per second" },
  { Icon: PiMicrophoneDuotone, use: "Voice", covers: "Voiceover or speech", price: "[PRICE] per minute" },
  { Icon: PiCrosshairDuotone, use: "Onchain lookup", covers: "Wallet, token, program or transaction", price: "[PRICE] per lookup" },
];

export default function PricingPage() {
  return (
    <main>
      <section className="wrap pt-16">
        <Head
          page
          Icon={Coins}
          kicker="Pricing"
          title={
            <>
              Start free. <em>Hold to unlock every model.</em>
            </>
          }
          lede={`Everyone gets Auto for free. Hold ${HOLD} to pick any model and pay only for what you use. Every plan is private, and nothing you send is used for training.`}
        />
      </section>

      <Reveal className="wrap mt-20 grid grid-cols-2 items-stretch gap-5 max-[860px]:grid-cols-1 max-[860px]:gap-14">
        <div className="folder tone-paper lined mt-0 flex flex-col gap-8 p-10 max-[480px]:p-7">
          <span className="folder-tab">Free</span>
          <div className="flex flex-col gap-2">
            <div className="font-display text-[88px] font-extrabold leading-[0.9] tracking-[-0.05em]">$0</div>
            <p className="text-muted">Forever. Auto only, no token or account needed.</p>
          </div>
          <ul className="flex flex-col gap-3 text-[16px]">
            {FREE.map((f) => (
              <li key={f} className="flex items-center gap-3">
                <span className="grid h-6 w-6 flex-none place-items-center rounded-[8px] bg-mist text-accent">
                  <Check size={14} />
                </span>
                {f}
              </li>
            ))}
          </ul>
          <Link className="btn mt-auto self-start" href="/chat">
            Try it free <ArrowUpRight size={16} />
          </Link>
        </div>

        {/* Holders: the main ticket and a torn-off credit stub. */}
        <div className="folder tone-night mt-0 grid grid-cols-[minmax(0,1fr)_150px] max-[560px]:grid-cols-1">
          <span className="folder-tab">Holders</span>
          <div className="flex flex-col gap-8 p-10 max-[480px]:p-7">
            <div className="flex flex-col gap-2">
              <div className="font-display text-[clamp(52px,6vw,80px)] font-extrabold leading-[0.9] tracking-[-0.05em]">
                Every
                <br />
                model
              </div>
              <p className="text-night-muted">Hold {HOLD}, then pay as you go.</p>
            </div>
            <ul className="flex flex-col gap-3 text-[16px]">
              {HOLDER.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-[8px] bg-night-2 text-pale">
                    <Check size={14} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <Link className="btn mt-auto self-start border-pale !bg-none bg-pale text-night hover:border-white hover:bg-white" href="/topup">
              Top up credit <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="relative flex flex-col items-center justify-center gap-3 border-l-2 border-dashed border-white/15 p-6 text-center max-[560px]:border-l-0 max-[560px]:border-t-2">
            <Ticket size={28} className="text-pale" />
            <span className="font-display text-[44px] font-extrabold leading-none">$1</span>
            <span className="label !text-night-muted">= $1 of credit</span>
          </div>
        </div>
      </Reveal>

      <section className="section">
        <Head
          kicker="Per use"
          title={
            <>
              Clear prices, <em>per use.</em>
            </>
          }
          lede={`For holders, paid from credit. Prices are the same in every privacy mode; Auto stays free up to ${FREE_LIMIT}.`}
        />
        <Stagger className="mt-12 grid grid-cols-2 gap-2.5 max-[760px]:grid-cols-1" gap={0.05}>
          {PRICES.map(({ Icon, use, covers, price }, i) => (
            <StaggerItem
              key={use}
              className={`flex items-center gap-4 rounded-[22px] border border-line bg-surface p-5 ${i === PRICES.length - 1 ? "col-span-full max-[760px]:col-span-1" : ""}`}
            >
              <span className="tactile-icon">
                <Icon size={20} />
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <b className="text-[16px] font-semibold">{use}</b>
                <span className="text-sm text-muted">{covers}</span>
                <span className="mt-1 hidden font-mono text-[12px] text-fg max-[480px]:block">{price}</span>
              </span>
              <span className="whitespace-nowrap rounded-full bg-bg px-3 py-1.5 font-mono text-[12px] tabular-nums max-[480px]:hidden">{price}</span>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="section">
        <Reveal className="folder tone-sage flex flex-wrap items-center justify-between gap-6 p-10 max-[480px]:p-7">
          <span className="folder-tab">Teams and API</span>
          <div className="flex max-w-[56ch] flex-col gap-2">
            <h2 className="font-display text-[clamp(28px,3.4vw,40px)] font-extrabold leading-none tracking-[-0.03em]">
              Bring your whole team.
            </h2>
            <p className="text-[#d6e2da]">Shared credit, API keys, MCP tools and dedicated enclaves for companies and builders.</p>
          </div>
          <Link className="btn btn-ink" href="/access">
            Talk to us <ArrowUpRight size={16} />
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
