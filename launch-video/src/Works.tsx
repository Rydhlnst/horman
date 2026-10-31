import { Check, Cpu, Lock, LockOpen, Wallet } from "lucide-react";
import type { ReactNode } from "react";
import { SiSolana } from "react-icons/si";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CA } from "./HowTo";
import { C, ease, F, fadeUp, Mark, SOL } from "./Launch";

// "How Horman works": a dark blueprint with a live system diagram per chapter.
const BG = "#0c120f";
const WIRE = "rgba(201,215,205,0.28)";
const GLOW = "#c9d7cd";
const MONO = "'IBM Plex Mono', ui-monospace, monospace";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const prog = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });

const CHAPTERS = [
  { from: 90, to: 270, n: "01", title: "Sign in with Solana", body: "Your wallet signs one message. No transaction, no fee. Your keys never leave your wallet." },
  { from: 270, to: 450, n: "02", title: "Live holder check", body: "Pick a holders model and Horman reads your $HORMAN balance on Solana, right then. No snapshots, no roles." },
  { from: 450, to: 630, n: "03", title: "Always the newest model", body: "Each family points to its newest version. When a lab ships, the lineup moves with it." },
  { from: 630, to: 840, n: "04", title: "Every model, every mode", body: "Open-weight models use providers that don’t keep or train on your data. Hosted ones are read by their lab. Horman stores nothing." },
  { from: 840, to: 960, n: "05", title: "What’s next", body: "Shipped before it’s claimed." },
];
export const WORKS_FRAMES = 1080;

export function Grid({ frame }: { frame: number }) {
  const shift = (frame * 0.4) % 60;
  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        backgroundImage: `linear-gradient(rgba(201,215,205,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(201,215,205,0.05) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
        backgroundPosition: `${shift}px ${shift}px`,
      }}
    >
      <AbsoluteFill style={{ background: "radial-gradient(70% 60% at 65% 45%, rgba(78,107,92,0.28) 0%, rgba(12,18,15,0) 70%)" }} />
    </AbsoluteFill>
  );
}

function Node({ x, y, w = 290, h = 96, icon, label, sub, on = 1, accent }: { x: number; y: number; w?: number; h?: number; icon: ReactNode; label: string; sub?: string; on?: number; accent?: string }) {
  return (
    <div
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y - h / 2,
        width: w,
        height: h,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "0 18px",
        borderRadius: 20,
        background: "rgba(22,30,26,0.92)",
        border: `1.5px solid rgba(201,215,205,${0.18 + 0.5 * on})`,
        boxShadow: `0 0 ${36 * on}px rgba(201,215,205,${0.18 * on})`,
        opacity: 0.35 + 0.65 * on,
        transform: `scale(${0.94 + 0.06 * on})`,
      }}
    >
      <span style={{ flex: "none", display: "grid", placeItems: "center", width: 52, height: 52, borderRadius: 15, background: accent ?? "rgba(201,215,205,0.12)", color: "#fff" }}>{icon}</span>
      <span style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
        <span style={{ fontFamily: F.display, fontWeight: 700, fontSize: 26, color: "#fff", letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>{label}</span>
        {sub && <span style={{ fontFamily: MONO, fontSize: 15, color: C.nightMuted, whiteSpace: "nowrap" }}>{sub}</span>}
      </span>
    </div>
  );
}

/** A straight wire with a travelling packet; `p` runs 0..1. */
function Wire({ x1, y1, x2, y2, p, label, back = false }: { x1: number; y1: number; x2: number; y2: number; p: number; label?: string; back?: boolean }) {
  const len = Math.hypot(x2 - x1, y2 - y1);
  const t = back ? 1 - p : p;
  const px = x1 + (x2 - x1) * t;
  const py = y1 + (y2 - y1) * t;
  return (
    <>
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={WIRE} strokeWidth={2} strokeDasharray="6 8" />
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={GLOW} strokeWidth={2.5} strokeDasharray={`${len}`} strokeDashoffset={len * (1 - Math.min(1, p * 1.15))} opacity={0.7} />
        {p > 0 && p < 1 && <circle cx={px} cy={py} r={9} fill={GLOW} style={{ filter: "drop-shadow(0 0 10px #c9d7cd)" }} />}
      </svg>
      {label && p > 0.05 && (
        <span
          style={{
            position: "absolute",
            left: px,
            top: py - 46,
            transform: "translateX(-50%)",
            padding: "5px 12px",
            borderRadius: 999,
            background: "rgba(201,215,205,0.14)",
            border: "1px solid rgba(201,215,205,0.3)",
            fontFamily: MONO,
            fontSize: 15,
            color: GLOW,
            whiteSpace: "nowrap",
            opacity: p < 1 ? 1 : 0.0,
          }}
        >
          {label}
        </span>
      )}
    </>
  );
}

function Badge({ x, y, text, on, tone = "ok" }: { x: number; y: number; text: string; on: number; tone?: "ok" | "warn" }) {
  return (
    <span
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${0.7 + 0.3 * on})`,
        opacity: on,
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 16px",
        borderRadius: 999,
        background: tone === "ok" ? "#cfe9dc" : "#f6e3c8",
        color: tone === "ok" ? "#0f5a40" : "#7a4b0b",
        fontFamily: F.body,
        fontWeight: 600,
        fontSize: 19,
        whiteSpace: "nowrap",
      }}
    >
      {tone === "ok" && <Check size={17} />}
      {text}
    </span>
  );
}

const Logo = ({ name }: { name: string }) => <Img src={staticFile(`models/${name}.svg`)} style={{ width: 30, height: 30 }} />;

/** The diagram for each chapter, drawn in a 900 x 640 panel. */
function Diagram({ frame, fps }: { frame: number; fps: number }) {
  const ch = CHAPTERS.findIndex((c) => frame >= c.from && frame < c.to);
  const f = ch >= 0 ? frame - CHAPTERS[ch].from : 0;
  const hormanIcon = <Mark size={44} />;

  if (ch === 0) {
    const p = prog(f, 30, 90);
    const ok = spring({ frame: f - 92, fps, config: { damping: 12 } });
    return (
      <>
        <Wire x1={260} y1={320} x2={640} y2={320} p={p} label="horman.dev · one-time code" />
        <Node x={150} y={320} icon={<Wallet size={26} />} label="Your wallet" sub="signs a message" on={1} accent="rgba(153,69,255,0.55)" />
        <Node x={750} y={320} w={310} icon={hormanIcon} label="Horman" sub="checks the signature" on={0.4 + 0.6 * p} />
        <Badge x={750} y={430} text="Signed in · no fee" on={ok} />
        <Badge x={150} y={430} text="Keys stay here" on={prog(f, 110, 130)} />
      </>
    );
  }
  if (ch === 1) {
    const ask = prog(f, 20, 70);
    const back = prog(f, 80, 125);
    const open = spring({ frame: f - 128, fps, config: { damping: 12 } });
    return (
      <>
        <Wire x1={300} y1={200} x2={600} y2={200} p={ask} label="balance of $HORMAN?" />
        <Wire x1={300} y1={250} x2={600} y2={250} p={back} back label="holder" />
        <Node x={170} y={225} icon={hormanIcon} label="Horman" sub="your session" on={1} />
        <Node x={730} y={225} icon={<SiSolana size={24} />} label="Solana" sub="read live" accent={SOL} on={0.4 + 0.6 * ask} />
        <div style={{ position: "absolute", left: 450 - 170, top: 380, width: 340, height: 120, borderRadius: 24, border: "1.5px solid rgba(201,215,205,0.35)", background: "rgba(22,30,26,0.92)", display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
          <span style={{ display: "grid", placeItems: "center", width: 60, height: 60, borderRadius: 18, background: open > 0.5 ? "#cfe9dc" : "rgba(201,215,205,0.12)", color: open > 0.5 ? "#0f5a40" : "#fff" }}>
            {open > 0.5 ? <LockOpen size={30} /> : <Lock size={30} />}
          </span>
          <span style={{ fontFamily: F.display, fontWeight: 700, fontSize: 30, color: "#fff" }}>{open > 0.5 ? "Every model" : "Holders model"}</span>
        </div>
      </>
    );
  }
  if (ch === 2) {
    const fam = [
      ["claude-color", "Claude"],
      ["openai", "GPT"],
      ["gemini-color", "Gemini"],
      ["deepseek-color", "DeepSeek"],
      ["meta-color", "Llama"],
      ["qwen-color", "Qwen"],
      ["kimi-color", "Kimi"],
    ];
    return (
      <>
        <Node x={130} y={320} icon={hormanIcon} label="Horman" w={220} on={1} />
        <Node x={400} y={320} icon={<Cpu size={26} />} label="Router" sub="newest per family" w={280} on={prog(f, 10, 30)} />
        {fam.map(([logo, name], i) => {
          const y = 60 + i * 86;
          const p = prog(f, 30 + i * 8, 70 + i * 8);
          const tag = prog(f, 90 + i * 6, 110 + i * 6);
          return (
            <div key={name}>
              <Wire x1={540} y1={320} x2={650} y2={y} p={p} />
              <div style={{ position: "absolute", left: 650, top: y - 32, height: 64, width: 250, display: "flex", alignItems: "center", gap: 12, padding: "0 16px", borderRadius: 16, background: "rgba(22,30,26,0.92)", border: `1.5px solid rgba(201,215,205,${0.15 + 0.4 * p})`, opacity: 0.3 + 0.7 * p }}>
                <span style={{ display: "grid", placeItems: "center", width: 40, height: 40, borderRadius: 11, background: "#fff" }}>
                  <Logo name={logo} />
                </span>
                <span style={{ fontFamily: F.display, fontWeight: 700, fontSize: 23, color: "#fff" }}>{name}</span>
                <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 13, color: "#0f5a40", background: "#cfe9dc", borderRadius: 999, padding: "3px 9px", opacity: tag }}>newest</span>
              </div>
            </div>
          );
        })}
      </>
    );
  }
  if (ch === 3) {
    const a = prog(f, 20, 70);
    const b = prog(f, 50, 100);
    const stamp = spring({ frame: f - 120, fps, config: { damping: 11 } });
    return (
      <>
        <Node x={150} y={320} icon={hormanIcon} label="Horman" sub="stores nothing" w={250} on={1} />
        <Wire x1={275} y1={300} x2={560} y2={170} p={a} label="open-weight" />
        <Wire x1={275} y1={340} x2={560} y2={470} p={b} label="GPT · Claude · Gemini" />
        <Node x={720} y={170} w={330} icon={<Lock size={24} />} label="Private provider" sub="not kept · not trained" on={0.4 + 0.6 * a} />
        <Node x={720} y={470} w={330} icon={<Cpu size={24} />} label="Hosted by the lab" sub="the host reads it" on={0.4 + 0.6 * b} />
        <Badge x={150} y={440} text="Nothing kept by Horman" on={stamp} />
        <Badge x={720} y={560} text="Horman tells you when" on={prog(f, 140, 160)} tone="warn" />
      </>
    );
  }
  if (ch === 4) {
    const items = ["Sealed enclaves", "Onchain lookups on Solana", "Agents that watch for you", "Image models", "USDC top-ups from $1"];
    return (
      <div style={{ position: "absolute", left: 110, top: 70, width: 680, display: "flex", flexDirection: "column", gap: 16 }}>
        {items.map((t, i) => (
          <div key={t} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 22px", borderRadius: 18, background: "rgba(22,30,26,0.92)", border: "1.5px solid rgba(201,215,205,0.25)", ...fadeUp(f, 6 + i * 9, 16, 18) }}>
            <span style={{ fontFamily: MONO, fontSize: 18, color: C.nightMuted }}>{String(i + 1).padStart(2, "0")}</span>
            <span style={{ fontFamily: F.display, fontWeight: 700, fontSize: 30, color: "#fff", letterSpacing: "-0.02em" }}>{t}</span>
            <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 15, color: "#7a4b0b", background: "#f6e3c8", borderRadius: 999, padding: "4px 12px" }}>soon</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export function Works() {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const square = width / height < 1.2;
  const u = height / 1080;

  const intro = interpolate(frame, [0, 1, 78, 92], [0, 1, 1, 0], clamp);
  const body = interpolate(frame, [84, 98, 952, 966], [0, 1, 1, 0], clamp);
  const outro = interpolate(frame, [956, 972], [0, 1], clamp);
  const ch = Math.max(0, CHAPTERS.findIndex((c) => frame >= c.from && frame < c.to));
  const chapter = CHAPTERS[ch];
  const cf = frame - chapter.from;
  // Fade the diagram between chapters.
  const swap = interpolate(cf, [0, 10, chapter.to - chapter.from - 10, chapter.to - chapter.from], [0, 1, 1, 0], clamp);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Grid frame={frame} />

      {/* Intro */}
      <AbsoluteFill style={{ opacity: intro, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26 * u }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 * u, ...fadeUp(frame, 2) }}>
          <Mark size={60 * u} />
          <span style={{ fontFamily: MONO, fontSize: 28 * u, color: C.nightMuted, letterSpacing: "0.08em" }}>HORMAN / SYSTEM</span>
        </div>
        <div style={{ textAlign: "center", lineHeight: 0.98 }}>
          <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: (square ? 130 : 160) * u, letterSpacing: "-0.05em", color: "#fff", ...fadeUp(frame, 8, 18, 34) }}>How Horman works</div>
          <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: (square ? 110 : 130) * u, color: GLOW, ...fadeUp(frame, 18, 18, 26) }}>under the hood.</div>
        </div>
      </AbsoluteFill>

      {/* Chapters */}
      <AbsoluteFill style={{ opacity: body }}>
        <div
          style={{
            position: "absolute",
            left: (square ? 90 : 110) * u,
            top: (square ? 80 : 0) * u,
            width: (square ? 900 : 720) * u,
            height: square ? 330 * u : height,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 18 * u,
          }}
        >
          <div key={chapter.n} style={{ display: "flex", flexDirection: "column", gap: 18 * u }}>
            <span style={{ fontFamily: MONO, fontSize: 26 * u, color: C.nightMuted, letterSpacing: "0.1em", ...fadeUp(cf, 0, 14, 12) }}>STEP {chapter.n}</span>
            <span style={{ fontFamily: F.display, fontWeight: 800, fontSize: (square ? 72 : 86) * u, lineHeight: 1, letterSpacing: "-0.045em", color: "#fff", ...fadeUp(cf, 4, 16, 20) }}>{chapter.title}</span>
            <span style={{ fontFamily: F.body, fontSize: (square ? 30 : 32) * u, lineHeight: 1.35, color: "#d6e2da", maxWidth: (square ? 900 : 640) * u, ...fadeUp(cf, 10, 16, 16) }}>{chapter.body}</span>
          </div>
          {/* progress */}
          <div style={{ display: "flex", gap: 10 * u, marginTop: 14 * u }}>
            {CHAPTERS.map((c, i) => (
              <span key={c.n} style={{ height: 6 * u, width: 56 * u, borderRadius: 99, background: "rgba(201,215,205,0.18)", overflow: "hidden" }}>
                <span style={{ display: "block", height: "100%", width: `${i < ch ? 100 : i > ch ? 0 : prog(cf, 0, c.to - c.from) * 100}%`, background: GLOW }} />
              </span>
            ))}
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: (square ? 90 : 900) * u,
            top: (square ? 410 : 220) * u,
            width: 900,
            height: 640,
            transform: `scale(${u * (square ? 1 : 1)})`,
            transformOrigin: "0 0",
            opacity: swap,
          }}
        >
          <Diagram frame={frame} fps={fps} />
        </div>
      </AbsoluteFill>

      {/* Outro */}
      <AbsoluteFill style={{ opacity: outro, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 30 * u, color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 * u, ...fadeUp(frame, 962) }}>
          <Mark size={84 * u} />
          <span style={{ fontFamily: F.mark, fontWeight: 700, fontSize: 76 * u, letterSpacing: "-0.035em" }}>horman</span>
        </div>
        <div style={{ textAlign: "center", ...fadeUp(frame, 968) }}>
          <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 92 * u, letterSpacing: "-0.045em", lineHeight: 1 }}>Ask anything.</div>
          <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 84 * u, color: GLOW, lineHeight: 1.05 }}>Keep it private.</div>
        </div>
        <div style={{ padding: `${18 * u}px ${44 * u}px`, borderRadius: 999, background: "#fff", color: C.ink, fontFamily: F.display, fontWeight: 700, fontSize: 42 * u, letterSpacing: "-0.02em", ...fadeUp(frame, 976) }}>horman.dev</div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 * u, padding: `${12 * u}px ${22 * u}px`, borderRadius: 16 * u, background: "rgba(255,255,255,0.08)", maxWidth: width - 80 * u, ...fadeUp(frame, 984, 16, 12) }}>
          <span style={{ fontFamily: F.body, fontWeight: 600, fontSize: 24 * u, color: GLOW }}>CA</span>
          <span style={{ fontFamily: MONO, fontSize: (square ? 25 : 30) * u }}>{CA}</span>
        </div>
        <div style={{ fontFamily: F.body, fontSize: 28 * u, color: GLOW, ...fadeUp(frame, 990, 16, 10) }}>Only trust the CA on horman.dev and @hormandotdev</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
