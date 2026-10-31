import { Gift, KeyRound, Search, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { Head } from "@/components/head";
import { Reveal } from "@/components/motion/reveal";
import { AccessForm } from "./access-form";

export const metadata: Metadata = { title: "Early access" };

const NEXT = [
  { Icon: Search, text: "We review your request." },
  { Icon: KeyRound, text: "You get an invite to the workspace, plus an API key if you need one." },
  { Icon: Gift, text: "Your first month of Pro is on us." },
];

export default function AccessPage() {
  return (
    <main>
      <section className="wrap pt-16">
        <Head
          page
          Icon={Sparkles}
          kicker="Early access"
          title={
            <>
              Horman opens in waves. <em>Get on the list.</em>
            </>
          }
          lede="Tell us how you’d use it and we’ll send your invite."
        />
      </section>
      <Reveal className="wrap mt-20 grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] items-start gap-5 max-[900px]:grid-cols-1 max-[900px]:gap-14">
        <div className="folder tone-night mt-0 flex flex-col gap-3 p-7 max-[480px]:p-5">
          <span className="folder-tab">What happens next</span>
          {NEXT.map(({ Icon, text }, i) => (
            <div key={text} className="flex items-center gap-4 rounded-[18px] bg-night-2 p-4">
              <span className={`grid h-11 w-11 flex-none place-items-center rounded-[14px] ${i === 2 ? "bg-pale text-night" : "bg-night text-pale"}`}>
                <Icon size={18} />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="label !text-night-muted">Step {i + 1}</span>
                <span className="text-[15px] leading-snug">{text}</span>
              </span>
            </div>
          ))}
        </div>
        <div className="folder tone-paper lined mt-0 p-8 max-[480px]:p-5">
          <span className="folder-tab">Request an invite · wave 1</span>
          <AccessForm />
        </div>
      </Reveal>
    </main>
  );
}
