import { ArrowUpRight, Check, X } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  PiArrowsLeftRightDuotone,
  PiBellRingingDuotone,
  PiCoinDuotone,
  PiCubeDuotone,
  PiFileCodeDuotone,
  PiRocketLaunchDuotone,
  PiWalletDuotone,
} from "react-icons/pi";
import { Head } from "@/components/head";
import { ProductVideo } from "@/components/product-video";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { LookupDemo } from "@/components/onchain/lookup-demo";
import "../home.css";
import "../product.css";

export const metadata: Metadata = {
  title: "Onchain",
  description: "Ask Solana about any wallet, token or program in plain words, without anyone seeing what you watch.",
};

const READS = [
  { Icon: PiWalletDuotone, title: "Wallets", text: "Who a wallet is, what it holds, who it trades with, and the wallets that move with it." },
  { Icon: PiCoinDuotone, title: "Tokens", text: "Holders, how concentrated they are, mint and freeze authority, LP burns, and what the dev wallet did." },
  { Icon: PiFileCodeDuotone, title: "Programs", text: "What each instruction does, in plain words, and which authorities the dev kept." },
  { Icon: PiArrowsLeftRightDuotone, title: "Transactions", text: "Paste a transaction signature and get the story: who paid whom, through which program, and why it matters." },
  { Icon: PiRocketLaunchDuotone, title: "Launches", text: "New mints checked as they appear, pump.fun included: authorities, holders, liquidity, risk score." },
  { Icon: PiBellRingingDuotone, title: "Alerts", text: "Hand a wallet or token to an agent and hear the moment something moves." },
];

const WHO_SEES = [
  ["What you look up", "Logged by the explorer or bot", "Encrypted to the enclave"],
  ["Which wallets you watch", "Visible to whoever runs the bot", "Nobody, not even Horman"],
  ["Your own wallet", "Often asked to connect it", "Never needed"],
  ["Your questions", "Kept on their servers", "Not kept in Sealed mode"],
];

export default function OnchainPage() {
  return (
    <main>
      <section className="wrap pt-16">
        <Head
          page
          Icon={PiCubeDuotone}
          kicker="Onchain"
          title={
            <>
              Ask the chain <em>in plain words.</em>
            </>
          }
          lede="Wallets, tokens and programs on Solana, read for you and explained like a person would. Your lookups stay sealed, so nobody learns what you’re watching."
        >
          <div className="flex flex-wrap gap-2.5">
            <Link href="/chat" className="btn btn-ink">
              Start an onchain chat <ArrowUpRight size={16} />
            </Link>
            <Link href="/agents" className="btn">
              Set up an alert
            </Link>
          </div>
        </Head>
      </section>

      <section className="wrap mt-16">
        <Reveal>
          <LookupDemo />
        </Reveal>
      </section>

      <section className="section">
        <Head
          kicker="How it works"
          title={
            <>
              From an address <em>to a plain answer.</em>
            </>
          }
          lede="Paste a wallet, ask a question, and read the report. Nobody sees what you looked up."
        />
        <Reveal className="folder tone-paper lined video-tabs">
          <span className="folder-tab">Video · sample data</span>
          <ProductVideo id="onchain-lookup" />
        </Reveal>
      </section>

      <section className="section">
        <Head
          kicker="What it reads"
          title={
            <>
              Everything Solscan shows, <em>explained.</em>
            </>
          }
          lede="Ask in your own words. Horman reads the slots, transactions and program logs, tags who is who and tells you what it means."
        />
        <Reveal className="folder tone-paper lined mt-16 p-3">
          <span className="folder-tab">Solana</span>
          <Stagger className="reads-grid" gap={0.06}>
            {READS.map(({ Icon, title, text }) => (
              <StaggerItem key={title} className="reads-card">
                <span className="tactile-icon">
                  <Icon size={22} />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </Reveal>
      </section>

      <section className="section">
        <Head
          kicker="Private by design"
          title={
            <>
              Nobody learns <em>what you’re watching.</em>
            </>
          }
          lede="Most explorers and bots log every lookup. In Sealed mode your question is encrypted on your device, so even Horman can’t see which wallet you asked about."
        />
        <Reveal className="folder tone-paper lined compare-folder">
          <span className="folder-tab">Who sees your lookups</span>
          <div className="compare" role="table" aria-label="Who sees your onchain lookups">
            <div className="compare-row head" role="row">
              <span className="label" role="columnheader">
                Your lookups
              </span>
              <span className="label" role="columnheader">
                A typical explorer or bot
              </span>
              <span className="label !text-pale" role="columnheader">
                Horman · Sealed
              </span>
            </div>
            {WHO_SEES.map(([q, them, us]) => (
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

      <section className="section">
        <Reveal className="folder tone-night product-cta">
          <span className="folder-tab">Built in, in every mode</span>
          <div className="flex flex-col gap-3">
            <h2 className="font-display text-[clamp(30px,4vw,48px)] font-extrabold leading-[1] tracking-[-0.035em]">
              Your next lookup,
              <br />
              <span className="text-pale">sealed.</span>
            </h2>
            <p className="max-w-[46ch] text-night-muted">Paste a wallet, a mint or a transaction signature into the chat, or let an agent watch it for you.</p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link href="/chat" className="btn border-pale !bg-none bg-pale text-night hover:border-white hover:bg-white">
              Open the chat <ArrowUpRight size={16} />
            </Link>
            <Link href="/agents" className="btn border-white/30 !bg-none bg-transparent text-white shadow-none hover:border-white">
              See agents
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
