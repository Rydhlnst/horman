"use client";

// The top bar is a plain white bar with the menu of Watermelon UI "navigation-3"
// (MIT, https://ui.watermelon.sh): the menu button drops a four-column panel
// (feature, two link lists, a featured card) across the page. Rebuilt without
// shadcn's Button/Popover so it uses Horman's own styles.

import { ArrowUpRight, Menu, Search, X } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  PiChatTeardropTextDuotone,
  PiCubeDuotone,
  PiHouseDuotone,
  PiImageDuotone,
  PiLockKeyDuotone,
  PiRobotDuotone,
  PiTagDuotone,
} from "react-icons/pi";
import { CaButton } from "@/components/ca-button";
import { CommandPalette } from "@/components/command-palette";
import { Wordmark } from "@/components/logo";
import { WalletButton } from "@/components/wallet/wallet-button";
import type { IconLike } from "@/lib/icons";
import { X_URL } from "@/lib/site";
import { SiX } from "react-icons/si";

const CHIPS: { label: string; href: string; Icon: IconLike }[] = [
  { label: "Chat", href: "/chat", Icon: PiChatTeardropTextDuotone },
  { label: "Create", href: "/#create", Icon: PiImageDuotone },
  { label: "Agents", href: "/agents", Icon: PiRobotDuotone },
  { label: "Onchain", href: "/onchain", Icon: PiCubeDuotone },
];

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Product",
    links: [
      { href: "/onchain", label: "Onchain" },
      { href: "/agents", label: "Agents" },
      { href: "/#models", label: "Models" },
      { href: "/#modes", label: "Privacy modes" },
      { href: "/#sealed", label: "How Sealed works" },
      { href: "/guides", label: "Guides and videos" },
      { href: "/pricing", label: "Pricing" },
      { href: "/topup", label: "Top up credit" },
    ],
  },
  {
    title: "Developers",
    links: [
      { href: "/developers", label: "Documentation" },
      { href: "/developers#quickstart", label: "API and SDKs" },
      { href: "/developers#mcp", label: "MCP tools" },
      { href: "/developers#modes", label: "Privacy modes in the API" },
    ],
  },
];

// The links that sit in the bar on wide screens; the menu holds everything.
const LINKS = [
  { href: "/agents", label: "Agents" },
  { href: "/onchain", label: "Onchain" },
  { href: "/#models", label: "Models" },
  { href: "/pricing", label: "Pricing" },
];

const SPRING = { type: "spring", stiffness: 380, damping: 34 } as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  // Where the bar ends on screen, so the open menu never runs past the bottom edge.
  const [panelTop, setPanelTop] = useState(64);
  const shell = useRef<HTMLElement>(null);

  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  // ⌘K / Ctrl+K anywhere toggles search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(false);
        setSearch((s) => !s);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    // The page stays put under the open menu; only the menu scrolls.
    const html = document.documentElement;
    const overflow = html.style.overflow;
    html.style.overflow = "hidden";
    const onDown = (e: PointerEvent) => {
      if (!shell.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = overflow;
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);
  const toggle = () => {
    if (!open && shell.current) setPanelTop(Math.max(0, shell.current.getBoundingClientRect().bottom));
    setOpen((o) => !o);
  };

  return (
    <>
      <header ref={shell} className="topbar">
        <div className="topbar-row">
          <Link href="/" aria-label="Horman home" className="no-underline" onClick={close}>
            <Wordmark size={28} />
          </Link>

          <nav aria-label="Main" className="topbar-links">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} aria-current={pathname === l.href ? "page" : undefined} onClick={close}>
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="topbar-end">
            <button type="button" className="topbar-icon" onClick={() => setSearch(true)} aria-label="Search (Ctrl K)" title="Search (Ctrl K)">
              <Search size={18} />
            </button>
            <a href={X_URL} target="_blank" rel="noreferrer" className="topbar-icon" aria-label="Horman on X" title="Horman on X">
              <SiX size={15} />
            </a>
            <span className="topbar-sep max-[560px]:hidden" aria-hidden="true" />
            <CaButton className="max-[1180px]:hidden" />
            <WalletButton className="max-[860px]:hidden" />
            <Link href="/chat" className="topbar-cta max-[560px]:hidden">
              Start chatting
            </Link>
            <button
              type="button"
              className="topbar-icon"
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={toggle}
            >
              <AnimatePresence initial={false} mode="wait">
                <motion.span
                  key={open ? "x" : "menu"}
                  initial={{ opacity: 0, rotate: -45 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 45 }}
                  transition={{ duration: 0.15 }}
                  className="grid place-items-center"
                >
                  {open ? <X size={20} /> : <Menu size={20} />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              id="site-menu"
              className="topbar-panel"
              style={{ maxHeight: `calc(100dvh - ${panelTop}px)` }}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6, transition: { duration: 0.12 } }}
              transition={{ duration: 0.22, ease: [0.22, 0.8, 0.24, 1] }}
            >
              <div className="topbar-grid">
                {/* Feature */}
                <div className="topbar-col first">
                  <span className="topbar-tile">
                    <PiLockKeyDuotone size={20} />
                  </span>
                  <h4 className="text-[15px] font-semibold">Private AI workspace</h4>
                  <p className="text-[14px] leading-relaxed text-muted">
                    Chat, create, run agents and read the chain, sealed by default and never used for training.
                  </p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {CHIPS.map(({ label, href, Icon }) => (
                      <Link key={href} href={href} className="topbar-chip" onClick={close}>
                        <Icon size={14} /> {label}
                      </Link>
                    ))}
                  </div>
                </div>

                {COLUMNS.map((col) => (
                  <div key={col.title} className="topbar-col">
                    <h4 className="topbar-heading">{col.title}</h4>
                    <ul className="flex flex-col gap-3">
                      {col.links.map((l) => (
                        <li key={l.href + l.label}>
                          <Link href={l.href} className="topbar-link" onClick={close}>
                            {l.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {/* Featured */}
                <div className="topbar-col last">
                  <h4 className="topbar-heading">Featured</h4>
                  <Link href="/access" className="topbar-feature group" onClick={close}>
                    <span>
                      <span className="topbar-badge">
                        Wave 1 · opening soon <ArrowUpRight size={12} />
                      </span>
                      <strong className="mt-3 block text-[15px] font-semibold">Get early access</strong>
                      <span className="mt-1.5 block text-[14px] leading-relaxed text-muted">
                        Join the list for wave 1 and we’ll send your invite, plus an API key if you need one.
                      </span>
                    </span>
                    <span className="mt-5 inline-flex items-center gap-1 text-[14px] font-semibold text-accent">
                      Join the list <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </div>
              </div>

              <div className="topbar-mobile-cta flex flex-col items-stretch gap-2.5">
                <CaButton className="justify-center" />
                <WalletButton block />
                <Link href="/chat" className="topbar-cta w-full justify-center" onClick={close}>
                  Start chatting
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <CommandPalette open={search} onClose={() => setSearch(false)} />
      <TabBar pathname={pathname} hidden={open} />
    </>
  );
}

const TABS: { label: string; href: string; Icon: IconLike }[] = [
  { label: "Home", href: "/", Icon: PiHouseDuotone },
  { label: "Onchain", href: "/onchain", Icon: PiCubeDuotone },
  { label: "Agents", href: "/agents", Icon: PiRobotDuotone },
  { label: "Pricing", href: "/pricing", Icon: PiTagDuotone },
];

/**
 * Phones: a floating tab bar whose capsule slides to the current page and
 * opens to show its name, with Chat as its own round key beside it.
 */
function TabBar({ pathname, hidden }: { pathname: string; hidden: boolean }) {
  return (
    <div className={`tabbar-wrap ${hidden ? "is-hidden" : ""}`} aria-hidden={hidden || undefined}>
      <LayoutGroup id="tabbar">
        <nav aria-label="Pages" className="tabbar">
          {TABS.map(({ label, href, Icon }) => {
            const here = pathname === href;
            return (
              <Link key={href} href={href} aria-label={label} aria-current={here ? "page" : undefined} className="tab">
                {here && <motion.span layoutId="tab-capsule" className="tab-capsule" transition={SPRING} />}
                <motion.span layout="position" className="relative z-10 flex items-center gap-1.5">
                  <Icon size={21} />
                  <AnimatePresence initial={false}>
                    {here && (
                      <motion.span
                        className="tab-label"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={SPRING}
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.span>
              </Link>
            );
          })}
        </nav>
      </LayoutGroup>
      <motion.div whileTap={{ scale: 0.92 }} transition={{ type: "spring", stiffness: 500, damping: 20 }}>
        <Link href="/chat" aria-label="Chat" aria-current={pathname === "/chat" ? "page" : undefined} className="tabbar-chat">
          <PiChatTeardropTextDuotone size={24} />
        </Link>
      </motion.div>
    </div>
  );
}
