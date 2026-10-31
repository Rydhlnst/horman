import { Check, Flame, Lock, LockOpen, MessageSquare, Wallet, X as XIcon, Zap, Radio, Sparkles, KeyRound } from "lucide-react";
import type { ReactNode } from "react";
import { SiSolana } from "react-icons/si";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CA } from "./HowTo";
import { C, ease, F, fadeUp, Hills, Mark, SOL } from "./Launch";
import { Grid } from "./Works";

// Ten short square clips, one per tweet. 8 s each at 30 fps.
export const SHORT_FRAMES = 240;
const END = 200; // the closing card starts here
const MONO = "'IBM Plex Mono', ui-monospace, monospace";
const EMBER = "#e2673a";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const p = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });

type Tone = "light" | "dark";

/** Shared frame: background, brand line at the bottom, and the closing card. */
function Shell({ tone, children, end = "horman.dev" }: { tone: Tone; children: ReactNode; end?: string }) {
  const f = useCurrentFrame();
  const body = interpolate(f, [END - 8, END + 4], [1, 0], clamp);
  const close = interpolate(f, [END - 4, END + 8], [0, 1], clamp);
  const fg = tone === "dark" ? "#fff" : C.fg;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {tone === "dark" ? <Grid frame={f} /> : <AbsoluteFill style={{ background: "linear-gradient(180deg, #f4f7f5 0%, #ffffff 55%, #eef3ef 100%)" }} />}
      {tone === "light" && <Hills frame={f} />}
      <AbsoluteFill style={{ opacity: body }}>{children}</AbsoluteFill>
      <div style={{ position: "absolute", left: 60, right: 60, bottom: 48, display: "flex", alignItems: "center", gap: 14, opacity: body }}>
        <Mark size={44} />
        <span style={{ fontFamily: F.mark, fontWeight: 700, fontSize: 34, color: fg, letterSpacing: "-0.03em" }}>horman</span>
        <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 22, color: tone === "dark" ? C.nightMuted : C.muted }}>$HORMAN · Solana</span>
      </div>
      <AbsoluteFill
        style={{
          opacity: close,
          background: `radial-gradient(120% 90% at 50% 30%, ${C.night} 0%, ${C.ink} 70%)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          color: "#fff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, ...fadeUp(f, END + 2) }}>
          <Mark size={80} />
          <span style={{ fontFamily: F.mark, fontWeight: 700, fontSize: 72, letterSpacing: "-0.035em" }}>horman</span>
        </div>
        <div style={{ padding: "18px 44px", borderRadius: 999, background: "#fff", color: C.ink, fontFamily: F.display, fontWeight: 700, fontSize: 44, letterSpacing: "-0.02em", ...fadeUp(f, END + 8) }}>{end}</div>
        <div style={{ fontFamily: MONO, fontSize: 21, color: C.pale, ...fadeUp(f, END + 14, 14, 10) }}>CA {CA}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

const Head = ({ children, tone, size = 92, style }: { children: ReactNode; tone: Tone; size?: number; style?: React.CSSProperties }) => (
  <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: size, lineHeight: 0.98, letterSpacing: "-0.05em", color: tone === "dark" ? "#fff" : C.fg, ...style }}>{children}</div>
);
const Serif = ({ children, tone, size = 84, style }: { children: ReactNode; tone: Tone; size?: number; style?: React.CSSProperties }) => (
  <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: size, lineHeight: 1.02, color: tone === "dark" ? C.pale : C.fg, ...style }}>{children}</div>
);
const Logo = ({ name, size = 40 }: { name: string; size?: number }) => <Img src={staticFile(`models/${name}.svg`)} style={{ width: size, height: size }} />;

function Tick({ text, on, tone }: { text: string; on: number; tone: Tone }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: on, transform: `translateX(${(1 - on) * -24}px)` }}>
      <span style={{ display: "grid", placeItems: "center", width: 50, height: 50, borderRadius: 15, background: "#cfe9dc", color: "#0f5a40", transform: `scale(${0.6 + 0.4 * on})` }}>
        <Check size={28} strokeWidth={3} />
      </span>
      <span style={{ fontFamily: F.display, fontWeight: 700, fontSize: 44, letterSpacing: "-0.03em", color: tone === "dark" ? "#fff" : C.fg }}>{text}</span>
    </div>
  );
}

/* 1. A promise, struck through; a product, ticked off. */
export function S1Product() {
  const f = useCurrentFrame();
  const strike = p(f, 30, 50);
  const items = ["Private AI chat", "Wallet sign-in", "Live holder access", "The newest models"];
  return (
    <Shell tone="light">
      <div style={{ position: "absolute", left: 80, top: 110, right: 80 }}>
        <div style={{ ...fadeUp(f, 4) }}>
          <Head tone="light" size={76} style={{ color: C.muted }}>
            Most tokens launch a{" "}
            <span style={{ position: "relative", display: "inline-block" }}>
              promise.
              <span style={{ position: "absolute", left: -6, right: -6, top: "55%", height: 9, borderRadius: 9, background: EMBER, transform: `scaleX(${strike})`, transformOrigin: "left" }} />
            </span>
          </Head>
        </div>
        <div style={{ marginTop: 26, ...fadeUp(f, 56, 18, 30) }}>
          <Head tone="light" size={104}>$HORMAN launched</Head>
          <Serif tone="light" size={104}>a product.</Serif>
        </div>
        <div style={{ marginTop: 50, display: "flex", flexDirection: "column", gap: 20 }}>
          {items.map((t, i) => (
            <Tick key={t} text={t} on={p(f, 96 + i * 16, 112 + i * 16)} tone="light" />
          ))}
        </div>
      </div>
    </Shell>
  );
}

/* 2. No email, no password, no waitlist: each one gets stamped out. */
export function S2NoSignup() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rows = ["Email", "Password", "Waitlist"];
  return (
    <Shell tone="dark">
      <div style={{ position: "absolute", left: 80, right: 80, top: 120, display: "flex", flexDirection: "column", gap: 26 }}>
        {rows.map((t, i) => {
          const s = spring({ frame: f - (24 + i * 22), fps, config: { damping: 11, stiffness: 170 } });
          return (
            <div key={t} style={{ position: "relative", display: "flex", alignItems: "center", gap: 22, padding: "26px 34px", borderRadius: 26, background: "rgba(22,30,26,0.92)", border: "1.5px solid rgba(201,215,205,0.25)", ...fadeUp(f, 4 + i * 6) }}>
              <span style={{ fontFamily: MONO, fontSize: 24, color: C.nightMuted }}>0{i + 1}</span>
              <span style={{ fontFamily: F.display, fontWeight: 800, fontSize: 70, color: "#fff", letterSpacing: "-0.04em", opacity: 1 - 0.55 * s }}>{t}</span>
              <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 22px", borderRadius: 14, border: `4px solid ${EMBER}`, color: EMBER, fontFamily: F.display, fontWeight: 800, fontSize: 40, transform: `rotate(-8deg) scale(${1.6 - 0.6 * s})`, opacity: s }}>
                <XIcon size={34} strokeWidth={3.5} /> NO
              </span>
            </div>
          );
        })}
        <div style={{ marginTop: 26, ...fadeUp(f, 104, 18, 24) }}>
          <Head tone="dark" size={92}>Just ask.</Head>
          <Serif tone="dark" size={80}>Answers in seconds.</Serif>
        </div>
      </div>
    </Shell>
  );
}

/* 3. Tokens fall into the flame: the dev buy, burned. */
export function S3Burn() {
  const f = useCurrentFrame();
  const flame = 1 + Math.sin(f / 4) * 0.05;
  return (
    <Shell tone="dark">
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center", ...fadeUp(f, 4) }}>
        <Head tone="dark" size={110}>Dev buy</Head>
        <Serif tone="dark" size={108} style={{ color: EMBER }}>burned.</Serif>
      </div>
      {Array.from({ length: 9 }).map((_, i) => {
        const t = (f - 40 - i * 9) / 34;
        if (t < 0 || t > 1) return null;
        const x = 540 + Math.sin(i * 2.1) * 120 * (1 - t);
        const y = 420 + t * 230;
        return (
          <span key={i} style={{ position: "absolute", left: x - 26, top: y - 26, width: 52, height: 52, borderRadius: 99, display: "grid", placeItems: "center", background: `linear-gradient(135deg, #7e9a8a, ${EMBER})`, opacity: 1 - t * 0.7, transform: `scale(${1 - t * 0.5}) rotate(${t * 180}deg)` }}>
            <Mark size={34} />
          </span>
        );
      })}
      <div style={{ position: "absolute", left: 540 - 95, top: 660, width: 190, height: 190, ...fadeUp(f, 20, 16, 20) }}>
        <div style={{ width: 190, height: 190, borderRadius: 56, display: "grid", placeItems: "center", background: EMBER, color: "#fff", transform: `scale(${flame})`, boxShadow: `0 0 120px 30px rgba(226,103,58,${0.25 + 0.15 * Math.sin(f / 5)})` }}>
          <Flame size={110} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 880, textAlign: "center", fontFamily: F.body, fontWeight: 500, fontSize: 34, color: C.pale, ...fadeUp(f, 130, 16, 14) }}>
        Out of supply, for good. Check it on Solscan.
      </div>
    </Shell>
  );
}

/* 4. One token in the middle, every model in orbit. */
export function S4Orbit() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logos = ["claude-color", "openai", "gemini-color", "deepseek-color", "meta-color", "qwen-color", "kimi-color"];
  const unlock = spring({ frame: f - 120, fps, config: { damping: 12 } });
  return (
    <Shell tone="light">
      <div style={{ position: "absolute", left: 0, right: 0, top: 80, textAlign: "center", ...fadeUp(f, 4) }}>
        <Head tone="light" size={100}>One token.</Head>
        <Serif tone="light" size={96}>Every model.</Serif>
      </div>
      <div style={{ position: "absolute", left: 540, top: 600 }}>
        {logos.map((l, i) => {
          const a = (i / logos.length) * Math.PI * 2 + f / 70;
          const r = 250 * p(f, 20 + i * 5, 60 + i * 5);
          return (
            <span key={l} style={{ position: "absolute", left: Math.cos(a) * r - 42, top: Math.sin(a) * r * 0.62 - 42, width: 84, height: 84, borderRadius: 24, background: "#fff", border: `1.5px solid ${C.line}`, display: "grid", placeItems: "center", boxShadow: "0 18px 30px -18px rgba(20,30,25,0.4)" }}>
              <Logo name={l} size={46} />
            </span>
          );
        })}
        <span style={{ position: "absolute", left: -95, top: -95, width: 190, height: 190, borderRadius: 999, background: `radial-gradient(circle at 35% 30%, #3A4D42, ${C.ink})`, display: "grid", placeItems: "center", boxShadow: "0 30px 60px -20px rgba(20,30,25,0.6)" }}>
          <Mark size={110} />
        </span>
        <span style={{ position: "absolute", left: -110, top: 120, width: 220, display: "flex", justifyContent: "center", alignItems: "center", gap: 10, padding: "12px 0", borderRadius: 999, background: unlock > 0.5 ? "#cfe9dc" : C.mist, color: unlock > 0.5 ? "#0f5a40" : C.muted, fontFamily: F.body, fontWeight: 600, fontSize: 26 }}>
          {unlock > 0.5 ? <LockOpen size={24} /> : <Lock size={24} />} {unlock > 0.5 ? "Unlocked" : "Holders"}
        </span>
      </div>
    </Shell>
  );
}

/* 5. Live, not a snapshot: a pulse line reading Solana. */
export function S5Live() {
  const f = useCurrentFrame();
  const pts = Array.from({ length: 60 }, (_, i) => {
    const x = i * 16;
    const k = (i + f / 2) % 20;
    const y = k > 9 && k < 12 ? (k === 10 || k < 10.6 ? -70 : 50) : Math.sin((i + f) / 3) * 6;
    return `${x},${y}`;
  }).join(" ");
  const snapOff = p(f, 30, 48);
  return (
    <Shell tone="dark">
      <div style={{ position: "absolute", left: 80, right: 80, top: 110, ...fadeUp(f, 4) }}>
        <Head tone="dark" size={100}>Live,</Head>
        <Serif tone="dark" size={96}>not a snapshot.</Serif>
      </div>
      <div style={{ position: "absolute", left: 80, top: 420, display: "flex", alignItems: "center", gap: 16, padding: "14px 26px", borderRadius: 999, border: "1.5px solid rgba(201,215,205,0.3)", fontFamily: MONO, fontSize: 26, color: C.nightMuted, ...fadeUp(f, 14) }}>
        <span style={{ textDecoration: "line-through", textDecorationColor: EMBER, textDecorationThickness: 4, opacity: 1 - 0.5 * snapOff }}>snapshot taken last week</span>
      </div>
      <svg width="960" height="220" viewBox="-10 -110 960 220" style={{ position: "absolute", left: 60, top: 520, opacity: p(f, 40, 60) }}>
        <polyline points={pts} fill="none" stroke="#c9d7cd" strokeWidth="5" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 10px #c9d7cd)" }} />
      </svg>
      <div style={{ position: "absolute", left: 80, top: 770, display: "flex", alignItems: "center", gap: 18, ...fadeUp(f, 70) }}>
        <span style={{ display: "grid", placeItems: "center", width: 64, height: 64, borderRadius: 18, background: SOL, color: "#fff" }}>
          <SiSolana size={34} />
        </span>
        <span style={{ fontFamily: F.display, fontWeight: 700, fontSize: 40, color: "#fff" }}>$HORMAN balance, read right now</span>
        <Radio size={34} color="#cfe9dc" style={{ opacity: 0.5 + 0.5 * Math.sin(f / 4) }} />
      </div>
    </Shell>
  );
}

/* 6. Three cards: what Horman does with your chats. */
export function S6Respect() {
  const f = useCurrentFrame();
  const cards = [
    ["Horman stores nothing.", "No chat logs on our servers."],
    ["Your chats live in your browser.", "Ephemeral ones aren’t saved at all."],
    ["Not kept. Not trained.", "Open-weight models use private providers."],
  ];
  return (
    <Shell tone="light">
      <div style={{ position: "absolute", left: 80, right: 80, top: 100, ...fadeUp(f, 4) }}>
        <Head tone="light" size={96}>AI that</Head>
        <Serif tone="light" size={96}>respects you.</Serif>
      </div>
      <div style={{ position: "absolute", left: 80, right: 80, top: 400, display: "flex", flexDirection: "column", gap: 20 }}>
        {cards.map(([a, b], i) => {
          const on = p(f, 40 + i * 26, 60 + i * 26);
          return (
            <div key={a} style={{ display: "flex", alignItems: "center", gap: 22, padding: "24px 30px", borderRadius: 26, background: "#fff", border: `1.5px solid ${C.line}`, boxShadow: "0 22px 44px -26px rgba(20,30,25,0.4)", opacity: on, transform: `perspective(900px) rotateX(${(1 - on) * 60}deg)`, transformOrigin: "top" }}>
              <span style={{ display: "grid", placeItems: "center", width: 60, height: 60, borderRadius: 18, background: C.mist, color: C.accent }}>
                <Lock size={30} />
              </span>
              <span style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontFamily: F.display, fontWeight: 700, fontSize: 40, letterSpacing: "-0.03em", color: C.fg }}>{a}</span>
                <span style={{ fontFamily: F.body, fontSize: 28, color: C.muted }}>{b}</span>
              </span>
            </div>
          );
        })}
      </div>
    </Shell>
  );
}

/* 7. A departures board of models: always the newest. */
export function S7Newest() {
  const f = useCurrentFrame();
  const rows = [
    ["claude-color", "Claude"],
    ["openai", "GPT"],
    ["gemini-color", "Gemini"],
    ["deepseek-color", "DeepSeek"],
    ["qwen-color", "Qwen"],
  ];
  return (
    <Shell tone="dark">
      <div style={{ position: "absolute", left: 80, right: 80, top: 100, ...fadeUp(f, 4) }}>
        <Head tone="dark" size={86}>When a lab ships,</Head>
        <Serif tone="dark" size={86}>Horman ships it too.</Serif>
      </div>
      <div style={{ position: "absolute", left: 80, right: 80, top: 380, borderRadius: 26, border: "1.5px solid rgba(201,215,205,0.25)", background: "rgba(22,30,26,0.92)", overflow: "hidden" }}>
        <div style={{ display: "flex", padding: "16px 28px", fontFamily: MONO, fontSize: 22, color: C.nightMuted, borderBottom: "1.5px solid rgba(201,215,205,0.15)" }}>
          <span>MODEL</span>
          <span style={{ marginLeft: "auto" }}>STATUS</span>
        </div>
        {rows.map(([logo, name], i) => {
          const flip = p(f, 50 + i * 14, 64 + i * 14);
          return (
            <div key={name} style={{ display: "flex", alignItems: "center", gap: 18, padding: "16px 28px", borderBottom: i < rows.length - 1 ? "1.5px solid rgba(201,215,205,0.1)" : "none" }}>
              <span style={{ display: "grid", placeItems: "center", width: 52, height: 52, borderRadius: 14, background: "#fff" }}>
                <Logo name={logo} size={34} />
              </span>
              <span style={{ fontFamily: F.display, fontWeight: 700, fontSize: 38, color: "#fff" }}>{name}</span>
              <span style={{ marginLeft: "auto", position: "relative", height: 44, width: 190, overflow: "hidden" }}>
                <span style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontFamily: MONO, fontSize: 22, color: C.nightMuted, transform: `translateY(${-flip * 100}%)` }}>updating…</span>
                <span style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", borderRadius: 999, fontFamily: MONO, fontSize: 22, background: "#cfe9dc", color: "#0f5a40", transform: `translateY(${(1 - flip) * 100}%)` }}>newest</span>
              </span>
            </div>
          );
        })}
      </div>
    </Shell>
  );
}

/* 8. Why Solana: three tiles. */
export function S8Solana() {
  const f = useCurrentFrame();
  const tiles: [ReactNode, string, string][] = [
    [<Wallet key="w" size={40} />, "One-tap sign-in", "Sign one message with your wallet"],
    [<Zap key="z" size={40} />, "No fee to sign in", "Nothing is sent, nothing is spent"],
    [<Sparkles key="s" size={40} />, "Live holder checks", "Your balance, read from the chain"],
  ];
  return (
    <Shell tone="light">
      <div style={{ position: "absolute", left: 80, right: 80, top: 90, display: "flex", alignItems: "center", gap: 26, ...fadeUp(f, 4) }}>
        <span style={{ display: "grid", placeItems: "center", width: 120, height: 120, borderRadius: 34, background: SOL, color: "#fff", flex: "none" }}>
          <SiSolana size={64} />
        </span>
        <div>
          <Head tone="light" size={96}>Why Solana?</Head>
          <Serif tone="light" size={60}>Fast, cheap, wallet-native.</Serif>
        </div>
      </div>
      <div style={{ position: "absolute", left: 80, right: 80, top: 330, display: "flex", flexDirection: "column", gap: 22 }}>
        {tiles.map(([icon, a, b], i) => (
          <div key={a} style={{ display: "flex", alignItems: "center", gap: 24, padding: "26px 30px", borderRadius: 28, background: "#fff", border: `1.5px solid ${C.line}`, boxShadow: "0 22px 44px -26px rgba(20,30,25,0.4)", ...fadeUp(f, 34 + i * 18, 18, 30) }}>
            <span style={{ display: "grid", placeItems: "center", width: 76, height: 76, borderRadius: 22, background: "linear-gradient(135deg, rgba(153,69,255,0.14), rgba(20,241,149,0.18))", color: "#5b3fb0" }}>{icon}</span>
            <span style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontFamily: F.display, fontWeight: 700, fontSize: 44, letterSpacing: "-0.03em", color: C.fg }}>{a}</span>
              <span style={{ fontFamily: F.body, fontSize: 29, color: C.muted }}>{b}</span>
            </span>
          </div>
        ))}
      </div>
    </Shell>
  );
}

/* 9. Done right from day one: a three-step timeline. */
export function S9DoneRight() {
  const f = useCurrentFrame();
  const steps = [
    [<Flame key="f" size={30} />, "Dev buy burned"],
    [<MessageSquare key="m" size={30} />, "Product live"],
    [<KeyRound key="k" size={30} />, "CA on the site"],
  ] as const;
  const line = p(f, 40, 130);
  return (
    <Shell tone="dark">
      <div style={{ position: "absolute", left: 80, right: 80, top: 100, ...fadeUp(f, 4) }}>
        <Head tone="dark" size={92}>Simple things,</Head>
        <Serif tone="dark" size={92}>done right.</Serif>
      </div>
      <div style={{ position: "absolute", left: 130, top: 430, width: 6, height: 360, borderRadius: 9, background: "rgba(201,215,205,0.18)" }}>
        <div style={{ width: "100%", height: `${line * 100}%`, borderRadius: 9, background: "#cfe9dc", boxShadow: "0 0 18px #cfe9dc" }} />
      </div>
      {steps.map(([icon, t], i) => {
        const on = p(f, 44 + i * 40, 60 + i * 40);
        return (
          <div key={t} style={{ position: "absolute", left: 96, top: 410 + i * 160, display: "flex", alignItems: "center", gap: 30 }}>
            <span style={{ display: "grid", placeItems: "center", width: 74, height: 74, borderRadius: 999, background: on > 0.5 ? "#cfe9dc" : "rgba(22,30,26,0.92)", color: on > 0.5 ? "#0f5a40" : C.nightMuted, border: "1.5px solid rgba(201,215,205,0.35)" }}>
              {on > 0.5 ? <Check size={36} strokeWidth={3} /> : icon}
            </span>
            <span style={{ fontFamily: F.display, fontWeight: 800, fontSize: 56, letterSpacing: "-0.04em", color: "#fff", opacity: 0.3 + 0.7 * on }}>{t}</span>
          </div>
        );
      })}
    </Shell>
  );
}

/* 10. Next on Horman: a glowing route through what's coming. */
export function S10Next() {
  const f = useCurrentFrame();
  const stops = ["Sealed enclaves", "Onchain lookups", "Agents that watch", "Image models", "USDC top-ups from $1"];
  const run = p(f, 30, 160);
  return (
    <Shell tone="light">
      <div style={{ position: "absolute", left: 80, right: 80, top: 90, ...fadeUp(f, 4) }}>
        <Head tone="light" size={96}>Next on Horman.</Head>
        <Serif tone="light" size={70}>Shipped before it’s claimed.</Serif>
      </div>
      <svg width="1080" height="600" style={{ position: "absolute", left: 0, top: 330 }}>
        <path d="M 120 40 C 600 40, 600 150, 960 150 S 120 260, 120 330 S 960 430, 960 470" fill="none" stroke={C.mist} strokeWidth="10" strokeLinecap="round" />
        <path d="M 120 40 C 600 40, 600 150, 960 150 S 120 260, 120 330 S 960 430, 960 470" fill="none" stroke={C.accent} strokeWidth="10" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - run} />
      </svg>
      {stops.map((t, i) => {
        const pos = [
          [120, 370],
          [960, 480],
          [540, 560],
          [120, 660],
          [960, 800],
        ][i];
        const on = p(f, 40 + i * 24, 56 + i * 24);
        const left = pos[0] > 600;
        return (
          <div key={t} style={{ position: "absolute", left: left ? undefined : pos[0] - 34, right: left ? 1080 - pos[0] - 34 : undefined, top: pos[1] - 34, display: "flex", flexDirection: left ? "row-reverse" : "row", alignItems: "center", gap: 16, opacity: on }}>
            <span style={{ width: 68, height: 68, borderRadius: 999, background: "#fff", border: `4px solid ${C.accent}`, display: "grid", placeItems: "center", fontFamily: MONO, fontSize: 22, color: C.accent }}>0{i + 1}</span>
            <span style={{ padding: "12px 22px", borderRadius: 18, background: "#fff", border: `1.5px solid ${C.line}`, boxShadow: "0 16px 30px -20px rgba(20,30,25,0.4)", fontFamily: F.display, fontWeight: 700, fontSize: 34, color: C.fg, whiteSpace: "nowrap" }}>
              {t} <span style={{ fontFamily: MONO, fontSize: 18, color: "#7a4b0b", background: "#f6e3c8", borderRadius: 999, padding: "3px 10px", marginLeft: 8 }}>soon</span>
            </span>
          </div>
        );
      })}
    </Shell>
  );
}

export const SHORTS = [
  ["S01-product", S1Product],
  ["S02-no-signup", S2NoSignup],
  ["S03-burn", S3Burn],
  ["S04-every-model", S4Orbit],
  ["S05-live-check", S5Live],
  ["S06-respect", S6Respect],
  ["S07-newest", S7Newest],
  ["S08-why-solana", S8Solana],
  ["S09-done-right", S9DoneRight],
  ["S10-next", S10Next],
] as const;
