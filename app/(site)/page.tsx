import { ArrowUpRight, Check, MessageSquare, X } from "lucide-react";
import {
  PiBellDuotone,
  PiBuildingsDuotone,
  PiChartLineUpDuotone,
  PiChatTeardropTextDuotone,
  PiCodeDuotone,
  PiCubeDuotone,
  PiEyeDuotone,
  PiFileCodeDuotone,
  PiGlobeDuotone,
  PiGraduationCapDuotone,
  PiImageDuotone,
  PiLockKeyDuotone,
  PiMegaphoneDuotone,
  PiMicrophoneDuotone,
  PiPlugsConnectedDuotone,
  PiProhibitDuotone,
  PiRobotDuotone,
  PiScalesDuotone,
  PiShieldCheckDuotone,
  PiTagDuotone,
  PiTicketDuotone,
  PiTimerDuotone,
  PiWarningDuotone,
} from "react-icons/pi";
import Link from "next/link";
import { AgentDemo } from "@/components/agents/agent-demo";
import { CtaFolder } from "@/components/blocks/cta";
import { NewsletterFolder } from "@/components/blocks/newsletter";
import { StatsFolder } from "@/components/blocks/stats";
import { Head } from "@/components/head";
import { SealedFlow } from "@/components/home/flow";
import { Faq } from "@/components/home/faq";
import { Hero } from "@/components/home/hero";
import { Models } from "@/components/home/models";
import { WorkspaceBento } from "@/components/home/workspace";
import { HormanMark } from "@/components/logo";
import { ModeColumns } from "@/components/mode-picker";
import { VideoTabs } from "@/components/product-video";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import type { IconLike } from "@/lib/icons";
import "./home.css";
import "./product.css";

// Everything Horman does, as one cloud of chips under the hero.
const ABILITIES: [IconLike, string][] = [
  [PiLockKeyDuotone, "Sealed mode"],
  [PiTimerDuotone, "Ephemeral mode"],
  [PiProhibitDuotone, "Never used for training"],
  [PiChatTeardropTextDuotone, "Chat with any model"],
  [PiRobotDuotone, "Scheduled agents"],
  [PiGlobeDuotone, "Web research"],
  [PiEyeDuotone, "Wallet watch"],
  [PiShieldCheckDuotone, "Token checks"],
  [PiFileCodeDuotone, "Program reads"],
  [PiImageDuotone, "Images and video"],
  [PiMicrophoneDuotone, "Voice"],
  [PiPlugsConnectedDuotone, "MCP tools"],
  [PiCodeDuotone, "API and SDKs"],
  [PiTicketDuotone, "Private vouchers"],
];

const AUDIENCE = [
  {
    Icon: PiBuildingsDuotone,
    title: "Founders and operators",
    text: "Draft, analyze and plan with contracts, numbers and investor notes that stay private.",
  },
  {
    Icon: PiChartLineUpDuotone,
    title: "Crypto teams and traders",
    text: "Research Solana wallets and watch pools without broadcasting what you’re watching.",
  },
  { Icon: PiCodeDuotone, title: "Developers", text: "Ship AI features with the same private pipeline through the API and SDKs." },
  {
    Icon: PiScalesDuotone,
    title: "Legal and finance",
    text: "Review documents and model scenarios without sending client data into shared logs.",
  },
  {
    Icon: PiMegaphoneDuotone,
    title: "Creators and marketers",
    text: "Make visuals, scripts and voiceovers for launches you haven’t announced yet.",
  },
  {
    Icon: PiGraduationCapDuotone,
    title: "Students and everyone else",
    text: "Ask questions, learn and brainstorm without your history becoming someone’s data.",
  },
];

// Where your words go: a typical AI app against a Sealed chat.
const COMPARE = [
  ["Who can read your prompt", "The company and its reviewers", "Only you and the enclave"],
  ["How long it’s kept", "Often until you delete it", "Not kept at all"],
  ["Used to train models", "Often, unless you opt out", "Never"],
  ["Linked to who you are", "Your email and your card", "No account, paid with vouchers"],
  ["What you get back", "An answer", "An answer and a privacy receipt"],
];

const ONCHAIN: [IconLike, string][] = [
  [PiTagDuotone, "Wallets tagged as funds, market makers, MEV bots and dev wallets"],
  [PiWarningDuotone, "Risk flags on fresh mints with live mint or freeze authority"],
  [PiBellDuotone, "Alerts the moment something moves"],
];

export default function HomePage() {
  return (
    <main className="pb-10">
      <Hero />

      <section className="section">
        <Head
          kicker="One workspace"
          title={
            <>
              Your AI, <em>wherever the work is.</em>
            </>
          }
          lede="Chat, create, hand work to agents and read the chain from one place, with the same privacy modes in every one of them."
        />
        <Stagger className="ability-cloud" gap={0.03}>
          {ABILITIES.map(([Icon, label]) => (
            <StaggerItem key={label} className="ability">
              <Icon size={16} /> {label}
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section id="watch" className="section">
        <Head
          kicker="Watch it work"
          title={
            <>
              Tutorials and how it works, <em>in under 20 seconds.</em>
            </>
          }
          lede="Short videos of a first chat, Sealed mode, agents, onchain lookups and top-ups. Every one uses sample data."
        >
          <Link href="/guides" className="btn btn-sm">
            All guides <ArrowUpRight size={15} />
          </Link>
        </Head>
        <Reveal>
          <VideoTabs />
        </Reveal>
      </section>

      <section id="agents" className="section">
        <Head
          kicker="Agents"
          title={
            <>
              Hand off the busywork. <em>Keep the strategy.</em>
            </>
          }
          lede="Set an agent once and it researches, watches wallets and reports back on a schedule, sealed to you. Pick a template and preview a run."
        >
          <Link href="/agents" className="btn btn-sm">
            See every agent <ArrowUpRight size={15} />
          </Link>
        </Head>
        <Reveal className="mt-12">
          <AgentDemo />
        </Reveal>
      </section>

      <section id="models" className="section">
        <Head
          kicker="Models"
          title={
            <>
              The models you know, <em>kept private.</em>
            </>
          }
          lede="Pick a model yourself or let Auto choose. Every model works in every mode: open-weight ones through private providers, the big hosted ones read by their lab."
        />
        <Models />
      </section>

      <section className="section">
        <Reveal>
          <StatsFolder />
        </Reveal>
      </section>

      <section id="why" className="section">
        <Head
          kicker="Why private"
          title={
            <>
              Every prompt says <em>something about you.</em>
            </>
          }
          lede="Most AI apps keep what you ask, and some train on it. We don’t sell your prompts, we don’t train on them, and in Sealed mode we can’t read them at all."
        />
        <Reveal className="folder tone-paper lined compare-folder">
          <span className="folder-tab">Where your words go</span>
          <div className="compare" role="table" aria-label="A typical AI app compared with Horman in Sealed mode">
            <div className="compare-row head" role="row">
              <span className="label" role="columnheader">
                Where your words go
              </span>
              <span className="label" role="columnheader">
                A typical AI app
              </span>
              <span className="label !text-pale" role="columnheader">
                Horman · Sealed
              </span>
            </div>
            {COMPARE.map(([q, them, us]) => (
              <div key={q} className="compare-row" role="row">
                <span className="compare-q" role="rowheader">
                  {q}
                </span>
                <span className="compare-cell bad" role="cell">
                  <X /> {them}
                </span>
                <span className="compare-cell good" role="cell">
                  <Check /> {us}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section id="workspace" className="section">
        <Head
          kicker="Inside the workspace"
          title={
            <>
              Everything you’d ask an AI, <em>kept private.</em>
            </>
          }
          lede="Chat, images, agents and onchain answers in one place, with the same privacy modes in every one of them."
        />
        <span id="chat" />
        <WorkspaceBento />
      </section>

      <section id="sealed" className="section">
        <Head
          kicker="Sealed mode"
          title={
            <>
              How a chat stays sealed, <em>start to finish.</em>
            </>
          }
          lede="Sealed mode checks the hardware before you send anything, and opens the answer only on your device."
        />
        <SealedFlow />
      </section>

      <section id="modes" className="section">
        <Head
          kicker="Privacy modes"
          title={
            <>
              Choose how much <em>you reveal.</em>
            </>
          }
          lede="Set a mode per chat. Sealed is the default; switch when you want the widest choice of models."
        />
        <ModeColumns />
      </section>

      {/* Onchain as its own product card, after supaste.com's app cards. */}
      <section id="onchain" className="section">
        <Reveal className="folder tone-paper lined">
          <span className="folder-tab">
            <PiCubeDuotone /> Onchain · built in
          </span>
          <div className="onchain-card">
            <div className="flex flex-col items-start gap-6">
              <h2 className="font-display text-[clamp(36px,4.6vw,62px)] font-bold leading-none tracking-[-0.05em]">
                Ask the chain
                <br />
                <em className="serif">in plain words.</em>
              </h2>
              <p className="max-w-[46ch] text-[17px] leading-relaxed text-muted">
                Horman reads Solana transactions and program logs and turns them into answers you can understand. Your questions stay private, so nobody
                sees what you’re watching.
              </p>
              <ul className="grid gap-2.5 text-[15px]">
                {ONCHAIN.map(([Icon, text]) => (
                  <li key={text} className="flex items-center gap-3">
                    <span className="grid h-9 w-9 flex-none place-items-center rounded-[12px] bg-surface text-accent">
                      <Icon size={16} />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
              <Link href="/onchain" className="btn btn-ink">
                Explore onchain <ArrowUpRight size={16} />
              </Link>
            </div>

            <div className="onchain-mock">
              <span className="label flex items-center gap-1.5">
                <PiLockKeyDuotone size={14} className="text-accent" /> Chat · sealed · sample
              </span>
              <div className="ml-auto max-w-[86%] rounded-[18px_18px_6px_18px] bg-panel px-4 py-3 text-[15px]">
                What did 7xKp…Wq3F do in the last 24 hours?
              </div>
              <div className="flex gap-3">
                <HormanMark size={30} className="mt-0.5 flex-none" />
                <div className="flex min-w-0 flex-col gap-3">
                  <span className="pill pill-accent self-start">used onchain context</span>
                  <p className="text-[15px] leading-relaxed">
                    This wallet belongs to a market-making cluster of 12 addresses. It pulled 38% of its liquidity from one Raydium pool and
                    moved it into a stable pair. Risk: low.
                  </p>
                  <div className="grid grid-cols-3 gap-2 max-[480px]:grid-cols-1">
                    {[
                      ["Cluster", "12 wallets"],
                      ["Moved", "38%"],
                      ["Risk", "Low"],
                    ].map(([k, v]) => (
                      <div key={k} className="rounded-[14px] bg-panel px-3 py-2.5">
                        <span className="label block">{k}</span>
                        <b className="font-display text-[20px] font-bold tracking-[-0.03em]">{v}</b>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="section">
        <Head
          kicker="Who it’s for"
          title={
            <>
              Built for anything <em>you’d rather keep to yourself.</em>
            </>
          }
          lede="From deal notes to wallet research, Horman keeps the work that matters most out of shared logs."
        />
        <Stagger className="audience-grid">
          {AUDIENCE.map(({ Icon, title, text }) => (
            <StaggerItem key={title} className="audience-card">
              <span className="audience-icon">
                <Icon size={20} />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="section grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] items-start gap-16 max-[900px]:grid-cols-1 max-[900px]:gap-8">
        <div className="sticky top-[110px] flex flex-col items-start gap-5 max-[900px]:static">
          <span className="kicker">Questions</span>
          <h2 className="font-display text-[clamp(36px,4.6vw,62px)] font-bold leading-none tracking-[-0.05em]">
            Common
            <br />
            <em className="serif">questions.</em>
          </h2>
          <p className="max-w-[34ch] text-muted">Still curious? Ask Horman itself, in a chat nobody else can read.</p>
          <Link href="/chat" className="btn btn-sm">
            <MessageSquare size={16} /> Ask in a private chat
          </Link>
        </div>
        <Reveal>
          <Faq />
        </Reveal>
      </section>

      <section className="section">
        <Reveal>
          <NewsletterFolder />
        </Reveal>
      </section>

      <section className="section">
        <Reveal>
          <CtaFolder />
        </Reveal>
      </section>
    </main>
  );
}
