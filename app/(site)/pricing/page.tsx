import { ArrowUpRight, Check, Coins, Ticket } from "lucide-react";
import { PiChatCircleDuotone, PiImageDuotone, PiSparkleDuotone } from "react-icons/pi";
import type { Metadata } from "next";
import { Head } from "@/components/head";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import Link from "next/link";
import { MARKUP_PCT } from "@/lib/billing";
import { modelPricing, resolveImageModel, resolveModel } from "@/lib/models";
import { FREE_LIMIT, HOLD, MODEL_GROUPS } from "@/lib/site";

export const metadata: Metadata = { title: "Pricing" };
// Prices come from OpenRouter's live list (cached for an hour), so render per request.
export const dynamic = "force-dynamic";

const FREE = ["Auto, which answers with a light open model", FREE_LIMIT, "Every privacy mode included", "No account, no token, no ads"];
const PAID = [
  `Hold ${HOLD} to use every model and images`,
  "No token? Top up credit from $1 in ZEC and pay as you go",
  `Each answer costs what the model costs, plus ${MARKUP_PCT}%`,
  "No subscription. Unused credit stays on your wallet",
];

const CHAT_MODELS = MODEL_GROUPS.find((g) => g.id === "chat")!.models;
const usd = (n: number) => (n >= 1 ? `$${n.toFixed(2)}` : n >= 0.01 ? `$${n.toFixed(3)}` : `$${n.toFixed(4)}`);

type Row = { Icon: typeof PiChatCircleDuotone; use: string; covers: string; price: string };

/** Live prices per model tier, with the markup included. */
async function priceRows(): Promise<Row[]> {
  const k = 1 + MARKUP_PCT / 100;
  const chat = await Promise.all(
    CHAT_MODELS.filter((m) => !m.free).map(async (m): Promise<Row> => {
      const picked = await resolveModel(m.name);
      const p = picked ? await modelPricing(picked.id) : null;
      const inM = Number(p?.prompt ?? NaN) * 1e6 * k;
      const outM = Number(p?.completion ?? NaN) * 1e6 * k;
      return {
        Icon: m.hosted ? PiSparkleDuotone : PiChatCircleDuotone,
        use: `Chat · ${m.name}`,
        covers: picked?.name ?? m.name,
        price: Number.isFinite(inM) && Number.isFinite(outM) ? `${usd(inM)} in · ${usd(outM)} out per 1M tokens` : "Model cost + fee",
      };
    }),
  );
  const img = await resolveImageModel();
  const ip = await modelPricing(img.id);
  const perImage = Number(ip?.image ?? NaN) * k;
  return [
    ...chat,
    { Icon: PiImageDuotone, use: "Image", covers: img.name, price: Number.isFinite(perImage) && perImage > 0 ? `about ${usd(perImage)} per image` : "Model cost + fee, per image" },
  ];
}

export default async function PricingPage() {
  const rows = await priceRows();
  return (
    <main>
      <section className="wrap pt-16">
        <Head
          page
          Icon={Coins}
          kicker="Pricing"
          title={
            <>
              Start free. <em>Hold, or pay as you go.</em>
            </>
          }
          lede={`Everyone gets Auto for free. Hold ${HOLD} for every model, or top up credit and pay only for what you use. Every plan is private, and nothing you send is used for training.`}
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
          <span className="folder-tab">Holders or credit</span>
          <div className="flex flex-col gap-8 p-10 max-[480px]:p-7">
            <div className="flex flex-col gap-2">
              <div className="font-display text-[clamp(52px,6vw,80px)] font-extrabold leading-[0.9] tracking-[-0.05em]">
                Every
                <br />
                model
              </div>
              <p className="text-night-muted">Hold {HOLD}, or pay as you go.</p>
            </div>
            <ul className="flex flex-col gap-3 text-[16px]">
              {PAID.map((f) => (
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
              Live prices, <em>per use.</em>
            </>
          }
          lede={`What pay-as-you-go costs right now: each model’s own price, read live from OpenRouter, plus ${MARKUP_PCT}% for payment and provider fees. Holders don’t pay these, and Auto stays free up to ${FREE_LIMIT}. A short answer usually costs a fraction of a cent.`}
        />
        <Stagger className="mt-12 grid grid-cols-2 gap-2.5 max-[760px]:grid-cols-1" gap={0.05}>
          {rows.map(({ Icon, use, covers, price }, i) => (
            <StaggerItem
              key={use}
              className={`flex items-center gap-4 rounded-[22px] border border-line bg-surface p-5 ${i === rows.length - 1 && rows.length % 2 === 1 ? "col-span-full max-[760px]:col-span-1" : ""}`}
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
