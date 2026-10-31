import { ArrowUpRight, Play } from "lucide-react";
import Link from "next/link";
import {
  PiChatTeardropTextDuotone,
  PiCodeDuotone,
  PiCubeDuotone,
  PiImageDuotone,
  PiLockKeyDuotone,
  PiRobotDuotone,
} from "react-icons/pi";
import { HormanMark } from "@/components/logo";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import type { IconLike } from "@/lib/icons";

// After Watermelon UI "cta-3" (MIT): the pitch and two buttons on the left, a grid
// of product tiles on the right, each tile a white panel set inside a soft frame.
const TILES: { label: string; href: string; Icon: IconLike }[] = [
  { label: "Chat", href: "/chat", Icon: PiChatTeardropTextDuotone },
  { label: "Create", href: "/#create", Icon: PiImageDuotone },
  { label: "Agents", href: "/agents", Icon: PiRobotDuotone },
  { label: "Onchain", href: "/onchain", Icon: PiCubeDuotone },
  { label: "API", href: "/developers", Icon: PiCodeDuotone },
  { label: "Sealed", href: "/#sealed", Icon: PiLockKeyDuotone },
];

export function CtaFolder() {
  return (
    <div className="folder tone-sage cta-folder">
      <span className="folder-tab">Free to start · no account</span>
      <div className="flex flex-col items-start gap-6">
        <HormanMark size={52} />
        <h2 className="font-display text-[clamp(38px,5vw,64px)] font-bold leading-[0.98] tracking-[-0.05em]">
          Ask anything.
          <br />
          <em className="serif text-pale">Keep it private.</em>
        </h2>
        <p className="max-w-[40ch] text-[17px] leading-relaxed text-[#d6e2da]">
          Chat, create, hand off research and read the chain in one workspace that keeps no copy of what you ask.
        </p>
        <div className="flex flex-wrap gap-2.5">
          <Link href="/chat" className="btn btn-ink">
            Start a private chat <ArrowUpRight size={17} />
          </Link>
          <Link href="/#sealed" className="btn border-white/40 !bg-none bg-transparent text-white shadow-none hover:border-white">
            <Play size={15} /> How Sealed works
          </Link>
        </div>
      </div>
      <Stagger as="ul" className="cta-tiles" gap={0.05}>
        {TILES.map(({ label, href, Icon }) => (
          <StaggerItem key={label} lift>
            <Link href={href} className="cta-tile group">
              <span className="cta-tile-inner">
                <Icon size={30} className="cta-tile-icon" />
                <span>{label}</span>
              </span>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
