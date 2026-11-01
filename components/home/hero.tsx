"use client";

import { ArrowUp, ArrowUpRight, Check, Globe, LockKeyhole, RotateCcw, Timer, type LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { PiCubeDuotone, PiImageDuotone, PiRobotDuotone, PiShieldCheckDuotone } from "react-icons/pi";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CaButton } from "@/components/ca-button";
import { GeneratedImage, IMAGE_INTENT, Markdown } from "@/components/chat/reply";
import { ask } from "@/lib/ask";
import { HormanMark } from "@/components/logo";
import { fadeUp, stagger } from "@/components/motion/reveal";
import { SlidingTabs } from "@/components/watermelon/sliding-tabs";
import { HANDOFF, reducedMotion, uid, type Chat, type Message } from "@/lib/chat";
import { MODES, type ModeKey } from "@/lib/site";

const MODE_ICON: Record<ModeKey, LucideIcon> = { sealed: LockKeyhole, ephemeral: Timer, open: Globe };

// Typed one after another as the composer's placeholder.
const EXAMPLES = [
  "Explain my blood test in plain words",
  "How do I ask for 22k without losing the offer?",
  "Make an image of a quiet lake at sunrise",
  "What did 7xKp…Wq3F do in the last 24 hours?",
  "Plan a 3-day trip to New York City on a mid-range budget",
];

// Makers whose models Horman runs, shown as a quiet row under the hero.
const MAKERS = [
  ["meta-color", "Meta"],
  ["openai", "OpenAI"],
  ["claude-color", "Anthropic"],
  ["gemini-color", "Google"],
  ["deepseek-color", "DeepSeek"],
  ["qwen-color", "Qwen"],
  ["kimi-color", "Kimi"],
  ["flux", "Black Forest Labs"],
  ["kling-color", "Kling"],
  ["elevenlabs", "ElevenLabs"],
] as const;

const CHIPS = [
  { label: "Read a wallet", prompt: "What did 7xKp…Wq3F do in the last 24 hours?", Icon: PiCubeDuotone },
  { label: "Check a token", prompt: "Is this token safe to hold? EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", Icon: PiShieldCheckDuotone },
  { label: "Set up an agent", prompt: "Every Monday, brief me on what moved in my market", Icon: PiRobotDuotone },
  { label: "Make an image", prompt: "Create an image of a quiet mountain lake at sunrise, in soft sage tones", Icon: PiImageDuotone },
];

/** The placeholder types each example, holds it, then moves on. With reduced motion whole examples swap.
 *  It starts empty so the server and the browser render the same thing. */
function useTypedPlaceholder(running: boolean) {
  const [state, setState] = useState({ i: 0, n: 0 });
  const text = EXAMPLES[state.i];
  useEffect(() => {
    if (!running) return;
    const still = reducedMotion();
    const done = state.n >= text.length;
    const next = (state.i + 1) % EXAMPLES.length;
    const t = setTimeout(
      () => setState(done ? { i: next, n: still ? EXAMPLES[next].length : 0 } : { i: state.i, n: still ? text.length : state.n + 1 }),
      done ? (still ? 3200 : 2000) : still ? 0 : 38,
    );
    return () => clearTimeout(t);
  }, [running, state, text.length]);
  return text.slice(0, state.n);
}

/** What happened to this answer, for the mode it was asked in. */
// What happened to an answer, per mode: good news in sage, the trade-offs in amber.
const RECEIPT: Record<ModeKey, { text: string; ok: boolean }[]> = {
  sealed: [
    { text: "Not stored by Horman", ok: true },
    { text: "Private provider, never trained on", ok: true },
    { text: "Enclave coming soon", ok: false },
  ],
  ephemeral: [
    { text: "Not stored by Horman", ok: true },
    { text: "Not saved in this browser", ok: true },
    { text: "Never trained on", ok: true },
  ],
  open: [
    { text: "The model host reads it", ok: false },
    { text: "Host may keep logs", ok: false },
    { text: "Not stored by Horman", ok: true },
  ],
};

function ReceiptLine({ mode }: { mode: ModeKey }) {
  const Icon = MODE_ICON[mode];
  return (
    <p className="msg-receipt" aria-label="Privacy receipt">
      <span className="msg-receipt-mode">
        <Icon size={12} /> {MODES.find((m) => m.key === mode)!.label}
      </span>
      {RECEIPT[mode].map(({ text, ok }) => (
        <span key={text} className={ok ? "ok" : "warn"}>
          {ok ? <Check size={12} /> : <span className="msg-receipt-dot" aria-hidden="true" />}
          {text}
        </span>
      ))}
    </p>
  );
}

export function Hero() {
  const [mode, setMode] = useState<ModeKey>("sealed");
  const [chat, setChat] = useState<Chat | null>(null);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLTextAreaElement>(null);
  const thread = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const placeholder = useTypedPlaceholder(!chat && !draft);
  const current = MODES.find((m) => m.key === mode)!;

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const el = thread.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [chat]);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  };

  const patch = (msgId: string, fn: (m: Message) => Message) =>
    setChat((c) => (c ? { ...c, messages: c.messages.map((m) => (m.id === msgId ? fn(m) : m)) } : c));

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text || busy) return;
    const isImage = IMAGE_INTENT.test(text);
    const still = reducedMotion();
    const user: Message = { id: uid(), role: "user", text };
    const answerId = uid();
    const answer: Message = isImage
      ? { id: answerId, role: "assistant", kind: "image", prompt: text, ready: false }
      : { id: answerId, role: "assistant", kind: "text", text: "", shown: 0 };
    const history = [...(chat?.messages ?? []), user];

    setChat((c) =>
      c ? { ...c, messages: [...c.messages, user, answer] } : { id: uid(), title: text.slice(0, 60), mode, messages: [user, answer] },
    );
    setDraft("");
    setBusy(true);
    if (input.current) input.current.style.height = "";

    if (answer.kind === "image") {
      later(
        () => {
          patch(answerId, (m) => ({ ...m, ready: true }) as Message);
          setBusy(false);
        },
        still ? 50 : 1200,
      );
      return;
    }
    ask({
      history,
      tier: "Auto",
      mode: chat?.mode ?? mode,
      onText: (t) => patch(answerId, (m) => ({ ...m, text: t, shown: t.length }) as Message),
    }).then(({ text: t, model, error }) => {
      patch(answerId, (m) =>
        error ? ({ ...m, text: error, shown: error.length, error: true, model } as Message) : ({ ...m, text: t, shown: t.length, model } as Message),
      );
      setBusy(false);
    });
  };

  // Hand the chat to /chat, finished, so it opens there as the active conversation.
  const handoff = () => {
    if (!chat) return;
    const done: Chat = {
      ...chat,
      messages: chat.messages.map((m) =>
        m.role === "assistant" && m.kind === "text" ? { ...m, shown: m.text.length } : m.role === "assistant" ? { ...m, ready: true } : m,
      ),
    };
    try {
      sessionStorage.setItem(HANDOFF, JSON.stringify(done));
    } catch {
      /* storage blocked: /chat opens empty */
    }
  };

  const reset = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setChat(null);
    setBusy(false);
    setDraft("");
    input.current?.focus();
  };

  const grow = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
  };

  const ChatModeIcon = MODE_ICON[chat?.mode ?? mode];

  return (
    <motion.section className="wrap hero-chat" initial="hidden" animate="show" variants={stagger(0.09, 0.05)}>
      <motion.span className="hero-eyebrow" variants={fadeUp}>
        <HormanMark size={22} /> Private AI agent workspace
      </motion.span>
      <motion.h1 className="hero-title" variants={fadeUp}>
        Ask anything.
        <br />
        <em>Keep it private.</em>
      </motion.h1>
      <motion.div className="mt-6" variants={fadeUp}>
        <CaButton />
      </motion.div>

      <motion.div className={`composer ${chat ? "has-thread" : ""}`} variants={fadeUp}>
        {chat && (
          <>
            <div className="thread-head">
              <span className="flex items-center gap-2 text-[13px] font-medium text-muted">
                <ChatModeIcon size={14} className="text-accent" />
                {MODES.find((m) => m.key === chat.mode)!.label} chat<span className="max-[480px]:hidden"> · live beta</span>
              </span>
              <span className="flex items-center gap-1">
                <button type="button" className="thread-btn icon" onClick={reset} aria-label="Start over" title="Start over">
                  <RotateCcw size={14} />
                </button>
                <Link href="/chat" onClick={handoff} className="thread-btn">
                  <span className="max-[480px]:hidden">Open in full chat</span>
                  <span className="min-[481px]:hidden">Full chat</span>
                  <ArrowUpRight size={13} />
                </Link>
              </span>
            </div>
            <div className="thread" ref={thread} aria-live="polite">
              {chat.messages.map((m) =>
                m.role === "user" ? (
                  <motion.p
                    key={m.id}
                    className="bubble"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {m.text}
                  </motion.p>
                ) : (
                  <motion.div
                    key={m.id}
                    className="flex gap-3"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.1 }}
                  >
                    <HormanMark size={28} className="mt-0.5 flex-none" />
                    <div className="flex min-w-0 flex-1 flex-col gap-3 text-[15px] leading-relaxed">
                      {m.kind === "text" ? (
                        <>
                          {m.shown === 0 && !m.error ? (
                            <span className="thinking" aria-label="Thinking">
                              <i />
                              <i />
                              <i />
                            </span>
                          ) : m.error ? (
                            <p className="rounded-[12px] bg-[#fdecea] px-3 py-2 text-[14px] text-[#a3362b]">{m.text}</p>
                          ) : (
                            <Markdown text={m.text.slice(0, m.shown)} />
                          )}
                          {m.model && !m.error && <ReceiptLine mode={chat.mode} />}
                        </>
                      ) : m.ready ? (
                        <>
                          <GeneratedImage prompt={m.prompt} className="max-w-[360px]" />
                          <ReceiptLine mode={chat.mode} />
                        </>
                      ) : (
                        <span className="image-wait">Drawing at 1024 × 1024…</span>
                      )}
                    </div>
                  </motion.div>
                ),
              )}
            </div>
          </>
        )}

        <form
          className="composer-form"
          onSubmit={(e) => {
            e.preventDefault();
            send(draft);
          }}
        >
          <label htmlFor="hero-ask" className="sr-only">
            Ask Horman
          </label>
          <textarea
            id="hero-ask"
            ref={input}
            rows={chat ? 1 : 2}
            value={draft}
            placeholder={chat ? "Ask a follow-up" : placeholder}
            onChange={(e) => {
              setDraft(e.target.value);
              grow(e.target);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                send(draft);
              }
            }}
          />
          <div className="composer-bar">
            {chat ? null : (
              <SlidingTabs
                kind="radio"
                size="sm"
                label="Privacy mode"
                value={mode}
                onChange={(id) => setMode(id as ModeKey)}
                items={MODES.map((m) => ({ id: m.key, label: m.label, Icon: MODE_ICON[m.key] }))}
              />
            )}
            <button type="submit" className="send" aria-label="Send" disabled={!draft.trim() || busy}>
              <ArrowUp size={18} />
            </button>
          </div>
        </form>
      </motion.div>

      {chat ? null : (
        <>
          <motion.ul className="hero-chips" aria-label="Try asking" variants={fadeUp}>
            {CHIPS.map(({ label, prompt, Icon }) => (
              <li key={label}>
                <button type="button" className="hero-chip" onClick={() => send(prompt)}>
                  <Icon size={16} /> {label}
                </button>
              </li>
            ))}
          </motion.ul>
          <p className="hero-note rise" key={mode}>
            {current.hero}
          </p>
        </>
      )}

      <motion.ul className="hero-meta" variants={fadeUp}>
        <li>No account</li>
        <li>Never used for training</li>
        <li>Free with Auto, every model for holders</li>
      </motion.ul>
      <motion.div className="makers" variants={fadeUp}>
        <span>Models from</span>
        <ul>
          {MAKERS.map(([logo, name]) => (
            <li key={logo} title={name}>
              <Image src={`/models/${logo}.svg`} alt={name} width={22} height={22} unoptimized />
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.section>
  );
}
