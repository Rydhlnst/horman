import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PiEyeSlashDuotone, PiRobotDuotone, PiShieldCheckDuotone, PiTrayDuotone } from "react-icons/pi";
import { AgentDemo } from "@/components/agents/agent-demo";
import { Head } from "@/components/head";
import { ProductVideo } from "@/components/product-video";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import "../product.css";

export const metadata: Metadata = {
  title: "Agents",
  description: "Agents that brief you, watch wallets and check new tokens on Solana, running privately and reporting only to you.",
};

const PRIVATE = [
  { Icon: PiShieldCheckDuotone, title: "Runs in the enclave", text: "In Sealed mode the agent works inside the same verified enclave as your chats." },
  { Icon: PiEyeSlashDuotone, title: "Your watchlist stays yours", text: "Which wallets and topics you follow is encrypted, so nobody can trade against it." },
  { Icon: PiTrayDuotone, title: "Results sealed to you", text: "Briefs and alerts land in your Horman inbox, opened only on your device." },
];

export default function AgentsPage() {
  return (
    <main>
      <section className="wrap pt-16">
        <Head
          page
          Icon={PiRobotDuotone}
          kicker="Agents"
          title={
            <>
              Hand off <em>the busywork.</em>
            </>
          }
          lede="Agents that research, watch the chain and write it up for you, on a schedule or the moment something moves. They run privately and report only to you."
        >
          <div className="flex flex-wrap gap-2.5">
            <Link href="/access" className="btn btn-ink">
              Get early access <ArrowUpRight size={16} />
            </Link>
            <Link href="/onchain" className="btn">
              See onchain
            </Link>
          </div>
        </Head>
      </section>

      <section className="wrap mt-16">
        <Reveal>
          <AgentDemo />
        </Reveal>
      </section>

      <section className="section">
        <Head
          kicker="Tutorial"
          title={
            <>
              Set up an agent <em>in under a minute.</em>
            </>
          }
          lede="Pick a template, choose when it runs, and preview a run that ends in a brief sealed to you."
        />
        <Reveal className="folder tone-paper lined video-tabs">
          <span className="folder-tab">Video · sample data</span>
          <ProductVideo id="agents-tutorial" />
        </Reveal>
      </section>

      <section className="section">
        <Head
          kicker="Private agents"
          title={
            <>
              An assistant that can’t <em>leak your strategy.</em>
            </>
          }
          lede="An agent knows what you care about. That’s exactly what should stay sealed."
        />
        <Stagger className="private-grid" gap={0.08}>
          {PRIVATE.map(({ Icon, title, text }) => (
            <StaggerItem key={title} lift className="folder tone-paper lined private-card">
              <span className="folder-tab">{title}</span>
              <span className="tactile-icon">
                <Icon size={22} />
              </span>
              <p>{text}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="section">
        <Reveal className="folder tone-sage product-cta">
          <span className="folder-tab">Opening with wave 1</span>
          <div className="flex flex-col gap-3">
            <h2 className="font-display text-[clamp(30px,4vw,48px)] font-extrabold leading-[1] tracking-[-0.035em]">
              Your first agent,
              <br />
              <span className="text-pale">ready on day one.</span>
            </h2>
            <p className="max-w-[46ch] text-[#d6e2da]">Join the list and set up a brief, a wallet watch or a launch radar the day wave 1 opens.</p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link href="/access" className="btn btn-ink">
              Join wave 1 <ArrowUpRight size={16} />
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
