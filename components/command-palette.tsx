"use client";

// A ⌘K palette, in the spirit of Watermelon UI's command-search: type to filter
// pages, models and actions, move with the arrows, Enter to go.

import { CornerDownLeft, Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  PiBookOpenDuotone,
  PiChatTeardropTextDuotone,
  PiCpuDuotone,
  PiCubeDuotone,
  PiHouseDuotone,
  PiLockKeyDuotone,
  PiPlayCircleDuotone,
  PiRobotDuotone,
  PiSparkleDuotone,
  PiTagDuotone,
  PiWalletDuotone,
} from "react-icons/pi";
import { HormanMark } from "@/components/logo";
import type { IconLike } from "@/lib/icons";
import { MODEL_GROUPS } from "@/lib/site";

type Entry = { group: string; label: string; hint: string; href: string; Icon?: IconLike; logo?: string; mark?: boolean };

const PAGES: Entry[] = [
  { group: "Pages", label: "Home", hint: "Ask anything, keep it private", href: "/", Icon: PiHouseDuotone },
  { group: "Pages", label: "Chat", hint: "Open the private chat", href: "/chat", Icon: PiChatTeardropTextDuotone },
  { group: "Pages", label: "Guides", hint: "Tutorials and how-it-works videos", href: "/guides", Icon: PiPlayCircleDuotone },
  { group: "Pages", label: "Token check", hint: "Is a Solana token safe? Free, from the chain", href: "/check", Icon: PiCubeDuotone },
  { group: "Pages", label: "Wallet scan", hint: "Every token in a wallet, checked", href: "/scan", Icon: PiCubeDuotone },
  { group: "Pages", label: "Transaction explainer", hint: "What did this Solana transaction do?", href: "/tx", Icon: PiCubeDuotone },
  { group: "Pages", label: "$HORMAN", hint: "The token, read live from Solana", href: "/token", Icon: PiCubeDuotone },
  { group: "Pages", label: "Onchain", hint: "Solana wallets, tokens and programs, explained", href: "/onchain", Icon: PiCubeDuotone },
  { group: "Pages", label: "Agents", hint: "Briefs, wallet watches and launch radar", href: "/agents", Icon: PiRobotDuotone },
  { group: "Pages", label: "Models", hint: "Every model and the modes it runs in", href: "/#models", Icon: PiCpuDuotone },
  { group: "Pages", label: "Privacy modes", hint: "Sealed, Ephemeral and Open", href: "/#modes", Icon: PiLockKeyDuotone },
  { group: "Pages", label: "Pricing", hint: "Free tier and holders", href: "/pricing", Icon: PiTagDuotone },
  { group: "Pages", label: "Top up credit", hint: "Pay with ZEC", href: "/topup", Icon: PiWalletDuotone },
  { group: "Pages", label: "Developers", hint: "API, SDKs and MCP tools", href: "/developers", Icon: PiBookOpenDuotone },
  { group: "Pages", label: "Early access", hint: "Join wave 1", href: "/access", Icon: PiSparkleDuotone },
];

const MODELS: Entry[] = MODEL_GROUPS.flatMap((g) =>
  g.models.map((m) => ({
    group: "Models",
    label: m.name,
    hint: `${g.label} · ${m.maker}${m.free ? " · free" : ""}`,
    href: "/#models",
    logo: m.logo,
    mark: !m.logo,
  })),
);

const ALL = [...PAGES, ...MODELS];

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL;
    return ALL.filter((e) => `${e.label} ${e.hint}`.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => input.current?.focus(), 30);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    list.current?.querySelector(`[data-i="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const go = (e: Entry | undefined) => {
    if (!e) return;
    onClose();
    setQuery("");
    setActive(0);
    router.push(e.href);
  };

  const onKey = (ev: React.KeyboardEvent) => {
    if (ev.key === "ArrowDown") {
      ev.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (ev.key === "ArrowUp") {
      ev.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (ev.key === "Enter") {
      ev.preventDefault();
      go(results[active]);
    } else if (ev.key === "Escape") {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="cmdk-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search Horman"
            className="cmdk"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
          >
            <div className="cmdk-input">
              <Search size={18} />
              <input
                ref={input}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onKey}
                placeholder="Search pages and models"
                aria-label="Search pages and models"
                aria-controls="cmdk-list"
                aria-activedescendant={results[active] ? `cmdk-${active}` : undefined}
              />
              <kbd>Esc</kbd>
            </div>
            <ul id="cmdk-list" ref={list} role="listbox" className="cmdk-list">
              {results.length === 0 && <li className="cmdk-empty">Nothing matches “{query}”.</li>}
              {results.map((e, i) => {
                // A group's name heads its first result.
                const head = i === 0 || results[i - 1].group !== e.group ? e.group : null;
                const on = i === active;
                return (
                  <li key={`${e.group}-${e.label}`} role="presentation">
                    {head && <span className="cmdk-group">{head}</span>}
                    <button
                      id={`cmdk-${i}`}
                      data-i={i}
                      type="button"
                      role="option"
                      aria-selected={on}
                      className="cmdk-item"
                      onMouseMove={() => setActive(i)}
                      onClick={() => go(e)}
                    >
                      {on && <motion.span layoutId="cmdk-active" className="cmdk-active" transition={{ type: "spring", stiffness: 500, damping: 38 }} />}
                      <span className="cmdk-icon">
                        {e.Icon ? (
                          <e.Icon size={17} />
                        ) : e.logo ? (
                          <Image src={`/models/${e.logo}.svg`} alt="" width={16} height={16} unoptimized />
                        ) : (
                          <HormanMark size={20} />
                        )}
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col text-left">
                        <b>{e.label}</b>
                        <span className="truncate">{e.hint}</span>
                      </span>
                      {on && <CornerDownLeft size={14} className="cmdk-enter" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
