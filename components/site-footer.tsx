import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { PiLockKeyDuotone } from "react-icons/pi";
import { SiGithub, SiX } from "react-icons/si";
import { X_URL } from "@/lib/site";
import { CaButton } from "@/components/ca-button";
import { Wordmark } from "@/components/logo";
import { Reveal } from "@/components/motion/reveal";

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Menu",
    links: [
      { href: "/", label: "Home" },
      { href: "/chat", label: "Chat" },
      { href: "/agents", label: "Agents" },
      { href: "/onchain", label: "Onchain" },
      { href: "/token", label: "$HORMAN live" },
      { href: "/check", label: "Token check" },
      { href: "/scan", label: "Wallet scan" },
      { href: "/tx", label: "Transaction explainer" },
      { href: "/#models", label: "Models" },
      { href: "/pricing", label: "Pricing" },
      { href: "/guides", label: "Guides" },
      { href: "/topup", label: "Top up credit" },
    ],
  },
  {
    title: "Privacy",
    links: [
      { href: "/#sealed", label: "How Sealed works" },
      { href: "/#modes", label: "Privacy modes" },
      { href: "/#why", label: "Where your words go" },
      { href: "/access", label: "Early access" },
    ],
  },
  {
    title: "Developers",
    links: [
      { href: "/developers", label: "Docs" },
      { href: "/developers#chat", label: "Chat API" },
      { href: "/developers#mcp", label: "MCP tools" },
      { href: "https://github.com", label: "GitHub" },
    ],
  },
];

const SOCIAL = [
  { href: X_URL, label: "Horman on X", Icon: SiX },
  { href: "https://github.com", label: "GitHub", Icon: SiGithub },
];

/**
 * An ink footer, after supaste.com: the white page ends in a rounded lip over it,
 * then the brand line, the links, and the wordmark cut off at the bottom.
 */
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-lip" aria-hidden="true" />
      <div className="wrap">
        <Reveal className="footer-grid">
          <div className="footer-brand">
            <Link className="flex items-center gap-2.5 no-underline" href="/" aria-label="Horman home">
              <Wordmark size={30} light />
              <span className="text-[15px] text-white/40">AI agent workspace</span>
            </Link>
            <p className="footer-line">
              Ask anything.
              <br />
              <em>Keep it private.</em>
            </p>
            <p className="max-w-[44ch] text-[15px] leading-relaxed text-white/55">
              Chat, create, run agents and read the chain with leading AI models, in a workspace that keeps no copy of what you ask.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/chat" className="footer-cta">
                Start chatting <ArrowUpRight size={15} />
              </Link>
              {SOCIAL.map(({ href, label, Icon }) => (
                <a key={href} href={href} rel="noopener" target="_blank" aria-label={label} className="footer-social">
                  <Icon size={15} />
                </a>
              ))}
            </div>
            <CaButton tone="dark" />
            <p className="text-[14px] text-white/45">© 2026 Horman · All rights reserved</p>
            <span className="footer-badge">
              <PiLockKeyDuotone size={14} /> Sealed by default
            </span>
          </div>

          <div className="footer-cols">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h4 className="footer-title">{col.title}</h4>
                <ul className="flex flex-col gap-[18px]">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      {l.href.startsWith("http") ? (
                        <a className="footer-link" href={l.href} rel="noopener" target="_blank">
                          {l.label}
                        </a>
                      ) : (
                        <Link className="footer-link" href={l.href}>
                          {l.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
      <div className="footer-mark" aria-hidden="true">
        horman
      </div>
    </footer>
  );
}
