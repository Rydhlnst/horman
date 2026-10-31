"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GeneratedImage, IMAGE_INTENT, Markdown } from "@/components/chat/reply";
import { ask } from "@/lib/ask";
import { ArrowUp, ImageIcon, Lightbulb, Map as MapIcon, MessageSquare, PanelLeft, PenLine, Plus, Ticket, X } from "lucide-react";
import { HormanMark, Wordmark } from "@/components/logo";
import { TopupSteps, TopupVoucher } from "@/components/topup-card";
import { fadeUp, stagger } from "@/components/motion/reveal";
import { SlidingTabs } from "@/components/watermelon/sliding-tabs";
import { HANDOFF, STORE, reducedMotion, uid, type Chat, type Message } from "@/lib/chat";
import { HOLD, MODEL_GROUPS, MODES, TICKER } from "@/lib/site";
import { WalletButton } from "@/components/wallet/wallet-button";
import { useWalletSession } from "@/components/wallet/wallet-session";

// The chat models, free tier first. Anything but Auto needs the token.
const CHAT_MODELS = MODEL_GROUPS.find((g) => g.id === "chat")!.models;


const SUGGESTIONS = [
  { title: "Make an image", prompt: "Create an image of a quiet mountain lake at sunrise, in soft sage tones", image: true, Icon: ImageIcon },
  { title: "Explain simply", prompt: "Explain how vaccines train the immune system, simply", Icon: Lightbulb },
  {
    title: "Draft a message",
    prompt: "Draft a short, friendly reply to an investor asking for our Q3 numbers before the board meeting",
    Icon: PenLine,
  },
  { title: "Plan something", prompt: "Plan a 3-day trip to New York City on a mid-range budget", Icon: MapIcon },
];

const PETALS = ["petal-tl", "petal-tr", "petal-bl", "petal-br"];

// A chat started in the home page hero arrives once through session storage.
function takeHandoff(): Chat | null {
  try {
    const raw = sessionStorage.getItem(HANDOFF);
    if (!raw) return null;
    sessionStorage.removeItem(HANDOFF);
    const chat = JSON.parse(raw) as Chat;
    return chat && Array.isArray(chat.messages) ? chat : null;
  } catch {
    return null;
  }
}

function loadChats(): Chat[] {
  try {
    const raw = localStorage.getItem(STORE);
    const list = raw ? (JSON.parse(raw) as Chat[]) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function saveChats(chats: Chat[]) {
  try {
    // Ephemeral chats never touch storage.
    localStorage.setItem(STORE, JSON.stringify(chats.filter((c) => c.mode !== "ephemeral")));
  } catch {
    /* storage blocked: chats live for this tab only */
  }
}

export function ChatApp() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [modeIndex, setModeIndex] = useState(0);
  const [tool, setTool] = useState<"chat" | "image">("chat");
  const [tier, setTier] = useState("Auto");
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [topupOpen, setTopupOpen] = useState(false);
  const [payNote, setPayNote] = useState("");
  const [loaded, setLoaded] = useState(false);

  const composer = useRef<HTMLTextAreaElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const aborts = useRef<AbortController[]>([]);

  const mode = MODES[modeIndex];
  // Holders-only models need a signed-in wallet that holds the token.
  const { session } = useWalletSession();
  const locked = tool === "chat" && !CHAT_MODELS.find((m) => m.name === tier)?.free && !session?.holder;
  const active = chats.find((c) => c.id === activeId) ?? null;
  const messages = useMemo(() => active?.messages ?? [], [active]);

  // Load saved chats and honour a #topup link once the page is in the browser.
  useEffect(() => {
    // Read inside the timer so a cancelled first run (Strict Mode) never eats the handoff.
    const boot = setTimeout(() => {
      const saved = loadChats();
      const handoff = takeHandoff();
      if (handoff) {
        setChats([handoff, ...saved.filter((c) => c.id !== handoff.id)]);
        setActiveId(handoff.id);
        setModeIndex(Math.max(0, MODES.findIndex((m) => m.key === handoff.mode)));
      } else {
        setChats(saved);
      }
      setLoaded(true);
      if (location.hash === "#topup") setTopupOpen(true);
    });
    const onHash = () => location.hash === "#topup" && setTopupOpen(true);
    window.addEventListener("hashchange", onHash);
    const pending = timers.current;
    const streams = aborts.current;
    return () => {
      streams.forEach((c) => c.abort());
      clearTimeout(boot);
      window.removeEventListener("hashchange", onHash);
      pending.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    if (loaded && !busy) saveChats(chats);
  }, [chats, busy, loaded]);

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = messages.length ? el.scrollHeight : 0;
  }, [messages]);

  const closeTopup = useCallback(() => {
    setTopupOpen(false);
    setPayNote("");
    if (location.hash === "#topup") history.replaceState(null, "", location.pathname + location.search);
  }, []);

  useEffect(() => {
    if (!topupOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeTopup();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [topupOpen, closeTopup]);

  const patchMessage = (chatId: string, msgId: string, patch: (m: Message) => Message) =>
    setChats((list) =>
      list.map((c) => (c.id === chatId ? { ...c, messages: c.messages.map((m) => (m.id === msgId ? patch(m) : m)) } : c)),
    );

  const later = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  };

  const send = (raw: string, forceImage = false) => {
    const text = raw.trim();
    // Holders-only models stay locked; image requests go through Auto.
    if (!text || busy || (locked && !forceImage)) return;
    const isImage = forceImage || tool === "image" || IMAGE_INTENT.test(text);
    const reduce = reducedMotion();

    let chatId = activeId;
    const user: Message = { id: uid(), role: "user", text };
    const answerId = uid();
    const answer: Message = isImage
      ? { id: answerId, role: "assistant", kind: "image", prompt: text, ready: false }
      : { id: answerId, role: "assistant", kind: "text", text: "", shown: 0 };
    const history = [...(active && chatId ? active.messages : []), user];

    if (!chatId || !active) {
      chatId = uid();
      const chat: Chat = { id: chatId, title: text.slice(0, 60), mode: mode.key, messages: [user, answer] };
      setChats((list) => [chat, ...list]);
      setActiveId(chatId);
    } else {
      const id = chatId;
      setChats((list) => list.map((c) => (c.id === id ? { ...c, messages: [...c.messages, user, answer] } : c)));
    }
    setDraft("");
    setBusy(true);

    const id = chatId;
    if (answer.role === "assistant" && answer.kind === "image") {
      later(() => {
        patchMessage(id, answerId, (m) => ({ ...m, ready: true }) as Message);
        setBusy(false);
      }, reduce ? 50 : 1200);
      return;
    }

    const controller = new AbortController();
    aborts.current.push(controller);
    ask({
      history,
      tier,
      mode: mode.key,
      signal: controller.signal,
      onText: (t) => patchMessage(id, answerId, (m) => ({ ...m, text: t, shown: t.length }) as Message),
    }).then(({ text: t, model, error }) => {
      patchMessage(id, answerId, (m) =>
        error ? ({ ...m, text: error, shown: error.length, error: true, model } as Message) : ({ ...m, text: t, shown: t.length, model } as Message),
      );
      setBusy(false);
    });
  };

  const newChat = () => {
    setActiveId(null);
    setListOpen(false);
    composer.current?.focus();
  };

  const resize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 220)}px`;
  };

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-bg">
      <aside
        className={`flex w-[280px] flex-none flex-col border-r border-line bg-surface max-[860px]:fixed max-[860px]:inset-y-0 max-[860px]:left-0 max-[860px]:z-40 max-[860px]:pt-[env(safe-area-inset-top,0px)] max-[860px]:shadow-lift max-[860px]:transition-transform ${listOpen ? "max-[860px]:translate-x-0" : "max-[860px]:-translate-x-full"}`}
        aria-label="Chats"
      >
        <div className="flex items-center justify-between gap-2 px-4 py-4">
          <Link className="no-underline" aria-label="Horman home" href="/">
            <Wordmark size={28} />
          </Link>
          <button
            type="button"
            className="hidden min-h-[40px] min-w-[40px] items-center justify-center rounded-[10px] text-muted hover:bg-raise max-[860px]:inline-flex"
            aria-label="Close chat list"
            onClick={() => setListOpen(false)}
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-3">
          <button type="button" className="btn btn-ink w-full justify-start gap-2 rounded-[14px] px-3.5" onClick={newChat}>
            <Plus size={18} /> New chat
          </button>
        </div>
        <nav className="mt-4 flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-3" aria-label="Recent chats">
          {chats.length === 0 ? (
            <p className="px-2 py-3 text-sm text-faint">Your chats will show up here.</p>
          ) : (
            chats.map((c) => (
              <div key={c.id} className={`group flex items-center rounded-[10px] ${c.id === activeId ? "bg-raise" : ""}`}>
                <button
                  type="button"
                  className="min-h-[40px] min-w-0 flex-1 truncate px-3 text-left text-sm text-fg"
                  aria-current={c.id === activeId ? "true" : undefined}
                  onClick={() => {
                    if (busy) return;
                    setActiveId(c.id);
                    setListOpen(false);
                  }}
                >
                  {c.title}
                </button>
              </div>
            ))
          )}
        </nav>
        <div className="mx-3 mb-3 flex items-center justify-between gap-2 rounded-[18px] bg-night py-3 pl-4 pr-3 text-white">
          <span className="flex items-center gap-3">
            <Ticket size={20} className="text-pale" strokeWidth={1.6} />
            <span className="flex flex-col">
              <span className="label !text-night-muted">Credit</span>
              <span className="font-mono text-[15px] font-medium tabular-nums">$0.00</span>
            </span>
          </span>
          <button
            type="button"
            className="btn btn-sm min-h-9 rounded-[12px] border-pale !bg-none bg-pale px-3 text-night hover:border-white hover:bg-white"
            onClick={() => setTopupOpen(true)}
          >
            Top up
          </button>
        </div>
        <div className="flex flex-col gap-2 border-t border-line px-4 py-3 text-xs text-faint">
          <span>Chats are saved only in this browser. Ephemeral chats are never saved.</span>
        </div>
      </aside>

      {topupOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[rgba(22,26,23,0.4)] px-4 pb-6 pt-[max(40px,env(safe-area-inset-top,0px))]"
          role="dialog"
          aria-modal="true"
          aria-label="Top up credit"
          onClick={(e) => e.target === e.currentTarget && closeTopup()}
        >
          <div className="flex w-full max-w-[620px] flex-col gap-3">
            <div className="flex items-center justify-between gap-3 rounded-[22px] bg-surface px-5 py-4">
              <div className="flex flex-col">
                <h2 className="font-display text-[22px] font-extrabold tracking-[-0.02em]">Top up credit</h2>
                <span className="text-sm text-faint">Credit pays for every model, at the prices on Pricing.</span>
              </div>
              <button
                type="button"
                className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-[10px] text-muted hover:bg-raise"
                aria-label="Close top up"
                onClick={closeTopup}
                autoFocus
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-9 grid gap-12">
              <TopupSteps compact />
              <TopupVoucher onPay={(amount, token) => setPayNote(`Wallet payments open at launch. You picked $${amount} in ${token}.`)} />
            </div>
            {payNote && (
              <p aria-live="polite" className="rounded-xl bg-surface px-4 py-3 text-sm text-muted">
                {payNote}
              </p>
            )}
          </div>
        </div>
      )}

      <main className="flex min-w-0 flex-1 flex-col pt-[env(safe-area-inset-top,0px)]">
        <div className="flex items-center justify-between gap-3 border-b border-line bg-surface py-2.5 pl-[max(16px,env(safe-area-inset-left,0px))] pr-[max(16px,env(safe-area-inset-right,0px))]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="hidden min-h-[40px] min-w-[40px] items-center justify-center rounded-[10px] border border-line max-[860px]:inline-flex"
              aria-label="Open chat list"
              onClick={() => setListOpen(true)}
            >
              <PanelLeft size={18} />
            </button>
            <SlidingTabs
              kind="radio"
              size="sm"
              label="Privacy mode"
              value={MODES[modeIndex].key}
              onChange={(id) => setModeIndex(MODES.findIndex((m) => m.key === id))}
              items={MODES.map((m) => ({ id: m.key, label: m.label }))}
            />
          </div>
          <WalletButton />
        </div>
        <div className="bg-mist py-2 pl-[max(16px,env(safe-area-inset-left,0px))] pr-[max(16px,env(safe-area-inset-right,0px))] text-[13px] text-fg/75">
          Live beta. Sealed enclaves aren’t switched on yet: until they are, Sealed and Ephemeral chats use open-weight models through providers that don’t keep or train on your data. Images are still samples.
        </div>

        <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-[780px] flex-col gap-6 py-8 pl-[max(16px,env(safe-area-inset-left,0px))] pr-[max(16px,env(safe-area-inset-right,0px))]">
            {messages.length === 0 ? (
              <motion.div className="flex flex-col items-center gap-6 pt-[8vh] text-center" initial="hidden" animate="show" variants={stagger(0.08)}>
                <motion.div variants={fadeUp}>
                  <HormanMark size={64} />
                </motion.div>
                <motion.h1 variants={fadeUp} className="font-display text-[clamp(32px,4.6vw,52px)] font-extrabold leading-[0.98] tracking-[-0.04em]">
                  What would you
                  <br />
                  <em className="serif">like to ask?</em>
                </motion.h1>
                <motion.p variants={fadeUp} className="max-w-[46ch] text-muted">
                  {mode.hero}
                </motion.p>
                <motion.div variants={fadeUp} className="grid w-full max-w-[640px] grid-cols-2 gap-3 max-[560px]:grid-cols-1">
                  {SUGGESTIONS.map((s, i) => (
                    <button
                      key={s.title}
                      type="button"
                      onClick={() => send(s.prompt, s.image)}
                      className={`${PETALS[i]} flex flex-col gap-1.5 border border-line bg-surface p-4 text-left transition hover:border-accent`}
                    >
                      <span className="flex items-center gap-2 text-sm font-semibold">
                        <span className={`grid h-7 w-7 place-items-center rounded-[9px] ${i === 0 ? "bg-accent text-white" : "bg-mist text-accent"}`}>
                          <s.Icon size={14} />
                        </span>
                        {s.title}
                      </span>
                      <span className="line-clamp-2 text-[13px] text-faint">{s.prompt}</span>
                    </button>
                  ))}
                </motion.div>
              </motion.div>
            ) : (
              messages.map((m) =>
                m.role === "user" ? (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-[85%] self-end whitespace-pre-wrap rounded-[20px_20px_6px_20px] bg-night px-4 py-3 text-[15px] text-white [overflow-wrap:anywhere]"
                  >
                    {m.text}
                  </motion.div>
                ) : (
                  <motion.div
                    key={m.id}
                    className="flex gap-3"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.1 }}
                  >
                    <div className="pt-0.5">
                      <HormanMark size={28} />
                    </div>
                    <div className="min-w-0 flex-1 text-[15px] leading-relaxed">
                      <AssistantBody message={m} />
                    </div>
                  </motion.div>
                ),
              )
            )}
          </div>
        </div>

        <div className="pb-[max(14px,env(safe-area-inset-bottom,0px))] pl-[max(16px,env(safe-area-inset-left,0px))] pr-[max(16px,env(safe-area-inset-right,0px))]">
          <form
            className="mx-auto flex w-full max-w-[780px] flex-col gap-2 rounded-[24px] border border-line-strong bg-surface p-2.5 focus-within:border-accent"
            onSubmit={(e) => {
              e.preventDefault();
              send(draft);
              if (composer.current) composer.current.style.height = "auto";
            }}
          >
            <label htmlFor="composer" className="sr-only">
              Message Horman
            </label>
            <textarea
              ref={composer}
              id="composer"
              rows={1}
              value={draft}
              placeholder={tool === "image" ? "Describe the image you want…" : "Ask anything…"}
              className="max-h-[220px] min-h-[44px] w-full resize-none bg-transparent px-2 py-2 text-[15px] text-fg outline-none placeholder:text-faint focus-visible:outline-none"
              onChange={(e) => {
                setDraft(e.target.value);
                resize(e.target);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  send(draft);
                  e.currentTarget.style.height = "auto";
                }
              }}
            />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <div role="group" aria-label="Tool" className="inline-flex gap-0.5 rounded-[10px] bg-raise p-0.5">
                  {(
                    [
                      ["chat", "Chat", MessageSquare],
                      ["image", "Image", ImageIcon],
                    ] as const
                  ).map(([key, label, Icon]) => (
                    <button
                      key={key}
                      type="button"
                      aria-pressed={tool === key}
                      onClick={() => setTool(key)}
                      className={`inline-flex min-h-[34px] items-center gap-1.5 rounded-lg px-3 text-[13px] font-semibold ${tool === key ? "bg-surface text-fg shadow-sm" : "text-muted"}`}
                    >
                      <Icon size={14} />
                      {label}
                    </button>
                  ))}
                </div>
                {tool === "chat" && (
                  <>
                    <label htmlFor="tier" className="sr-only">
                      Model
                    </label>
                    <select
                      id="tier"
                      value={tier}
                      onChange={(e) => setTier(e.target.value)}
                      className="min-h-[34px] rounded-[10px] border border-line bg-surface px-2.5 text-[13px] text-muted outline-none focus:border-accent"
                    >
                      {CHAT_MODELS.map((m) => (
                        <option key={m.name} value={m.name}>
                          {m.free ? `${m.name} · free` : `${m.name} · holders`}
                        </option>
                      ))}
                    </select>
                  </>
                )}
              </div>
              <button
                type="submit"
                disabled={!draft.trim() || busy || locked}
                className="inline-flex min-h-[42px] min-w-[42px] items-center justify-center rounded-[14px] bg-night text-white disabled:opacity-30"
                aria-label="Send"
              >
                <ArrowUp size={18} />
              </button>
            </div>
          </form>
          {locked && (
            <p className="mx-auto mt-2 flex max-w-[780px] flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-[13px] text-muted" role="status">
              {!session?.address
                ? `${tier} is for holders: connect a wallet that holds ${HOLD} to pick it.`
                : !session.ca
                  ? `${tier} opens to holders when ${TICKER} launches.`
                  : `${tier} is for holders: this wallet needs ${HOLD}.`}
              <button type="button" className="font-semibold text-accent underline underline-offset-2" onClick={() => setTier("Auto")}>
                Use Auto, free
              </button>
            </p>
          )}
          <p className="mx-auto mt-2 max-w-[780px] text-center text-xs text-faint">
            Horman can make mistakes. Check important information.
          </p>
        </div>
      </main>
    </div>
  );
}

function Pending({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-faint">
      <span className="inline-block h-4 w-2 animate-blink bg-accent" />
      {label}
    </span>
  );
}

function AssistantBody({ message }: { message: Extract<Message, { role: "assistant" }> }) {
  if (message.kind === "image") {
    if (!message.ready) return <Pending label="Creating your image…" />;
    return (
      <>
        <div className="flex flex-col gap-3">
          <p>Image models aren’t switched on yet, so this one is a sample.</p>
        </div>
        <GeneratedImage prompt={message.prompt} className="mt-3 max-w-[460px]" />
      </>
    );
  }
  if (message.shown === 0 && !message.error) return <Pending label="Thinking…" />;
  if (message.error) return <p className="rounded-[12px] bg-[#fdecea] px-3 py-2 text-[14px] text-[#a3362b]">{message.text}</p>;
  return (
    <>
      <Markdown text={message.text.slice(0, message.shown)} />
      {message.model && <p className="mt-2 text-[12px] text-faint">Answered by {message.model}</p>}
    </>
  );
}
