import { KeyRound, MessageSquare, Wallet } from "lucide-react";
import type { ReactNode } from "react";
import { SiSolana } from "react-icons/si";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

// Horman's palette (app/globals.css).
const C = {
  fg: "#161a17",
  muted: "#4d5550",
  line: "#e0e5e1",
  night: "#1a231e",
  ink: "#111614",
  nightMuted: "#a9c0b1",
  pale: "#c9d7cd",
  mist: "#dde6df",
  accent: "#4e6b5c",
};
const SOL = "linear-gradient(135deg, #9945FF, #14F195)";
const F = {
  display: "'Inter Tight', sans-serif",
  serif: "'Instrument Serif', serif",
  body: "'Instrument Sans', sans-serif",
  mark: "'Bricolage Grotesque', sans-serif",
};

const ease = Easing.bezier(0.22, 0.8, 0.24, 1);
const fadeUp = (frame: number, start: number, dur = 18, dist = 28) => ({
  opacity: interpolate(frame, [start, start + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  transform: `translateY(${interpolate(frame, [start, start + dur], [dist, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease })}px)`,
});
/** Opacity of a scene that fades in at `a`, holds, and fades out by `d`. */
const window4 = (frame: number, a: number, b: number, c: number, d: number) =>
  interpolate(frame, [a, b, c, d], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/** The Horman mark: four sage petals on a dark green tile. */
function Mark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <defs>
        <radialGradient id="t" cx="0.5" cy="0.4" r="0.75">
          <stop offset="0" stopColor="#3A4D42" />
          <stop offset="1" stopColor="#1F2A24" />
        </radialGradient>
        <linearGradient id="p" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#EEF3EF" />
          <stop offset="1" stopColor="#7E9A8A" />
        </linearGradient>
        <mask id="m">
          <rect width="64" height="64" fill="#fff" />
          <circle cx="32" cy="32" r="5.5" fill="#000" />
        </mask>
      </defs>
      <rect width="64" height="64" rx="15" fill="url(#t)" />
      <g transform="translate(9.6 9.6) scale(0.7)">
        <g mask="url(#m)">
          {[
            [32, 19],
            [45, 32],
            [32, 45],
            [19, 32],
          ].map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="13" fill="url(#p)" fillOpacity="0.85" />
          ))}
        </g>
      </g>
    </svg>
  );
}

/** Soft sage hills along the bottom, like the product videos. */
function Hills({ frame }: { frame: number }) {
  const drift = Math.sin(frame / 60) * 14;
  return (
    <svg viewBox="0 0 1920 420" preserveAspectRatio="none" style={{ position: "absolute", left: 0, right: 0, bottom: 0, width: "100%", height: "36%" }}>
      <path d={`M0 260 C 420 ${150 + drift} 760 300 1180 220 S 1700 ${120 - drift} 1920 190 L1920 420 L0 420 Z`} fill="#c9d7cd" opacity="0.55" />
      <path d={`M0 320 C 360 ${250 - drift} 820 360 1260 290 S 1760 ${250 + drift} 1920 280 L1920 420 L0 420 Z`} fill="#9fb6a8" opacity="0.55" />
      <path d={`M0 380 C 500 ${330 + drift} 980 400 1400 360 S 1800 ${340 - drift} 1920 350 L1920 420 L0 420 Z`} fill="#6f8b7b" opacity="0.6" />
    </svg>
  );
}

function SolanaBadge({ u }: { u: number }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 18 * u,
        padding: `${14 * u}px ${34 * u}px ${14 * u}px ${14 * u}px`,
        borderRadius: 999,
        background: "#fff",
        border: `${1.5 * u}px solid ${C.line}`,
        boxShadow: `0 ${14 * u}px ${36 * u}px -${18 * u}px rgba(20,30,25,0.35)`,
      }}
    >
      <span style={{ display: "grid", placeItems: "center", width: 60 * u, height: 60 * u, borderRadius: 18 * u, background: SOL, color: "#fff" }}>
        <SiSolana size={32 * u} />
      </span>
      <span style={{ fontFamily: F.body, fontWeight: 600, fontSize: 40 * u, color: C.fg }}>Live on Solana</span>
    </div>
  );
}

function Card({ icon, title, text, u, style, row = false }: { icon: ReactNode; title: string; text: string; u: number; style: React.CSSProperties; row?: boolean }) {
  if (row) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 22 * u,
          padding: `${20 * u}px ${26 * u}px`,
          borderRadius: 24 * u,
          background: "#fff",
          border: `${1.5 * u}px solid ${C.line}`,
          boxShadow: `0 ${20 * u}px ${44 * u}px -${26 * u}px rgba(20,30,25,0.4)`,
          ...style,
        }}
      >
        <span style={{ flex: "none", display: "grid", placeItems: "center", width: 64 * u, height: 64 * u, borderRadius: 18 * u, background: C.mist, color: C.accent }}>
          {icon}
        </span>
        <span style={{ display: "flex", flexDirection: "column", gap: 4 * u }}>
          <span style={{ fontFamily: F.display, fontWeight: 700, fontSize: 40 * u, letterSpacing: "-0.03em", color: C.fg, lineHeight: 1.08 }}>{title}</span>
          <span style={{ fontFamily: F.body, fontSize: 27 * u, lineHeight: 1.3, color: C.muted }}>{text}</span>
        </span>
      </div>
    );
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14 * u,
        padding: 34 * u,
        borderRadius: 28 * u,
        background: "#fff",
        border: `${1.5 * u}px solid ${C.line}`,
        boxShadow: `0 ${24 * u}px ${50 * u}px -${28 * u}px rgba(20,30,25,0.4)`,
        ...style,
      }}
    >
      <span style={{ display: "grid", placeItems: "center", width: 68 * u, height: 68 * u, borderRadius: 18 * u, background: C.mist, color: C.accent }}>
        {icon}
      </span>
      <span style={{ fontFamily: F.display, fontWeight: 700, fontSize: 46 * u, letterSpacing: "-0.03em", color: C.fg, lineHeight: 1.08 }}>{title}</span>
      <span style={{ fontFamily: F.body, fontSize: 32 * u, lineHeight: 1.35, color: C.muted }}>{text}</span>
    </div>
  );
}

function Caption({ n, text, u, frame, start }: { n: number; text: string; u: number; frame: number; start: number }) {
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 64 * u, display: "flex", justifyContent: "center", ...fadeUp(frame, start, 14, 16) }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 16 * u,
          padding: `${12 * u}px ${30 * u}px ${12 * u}px ${12 * u}px`,
          borderRadius: 999,
          background: C.ink,
          color: "#fff",
          fontFamily: F.body,
          fontWeight: 500,
          fontSize: 36 * u,
        }}
      >
        <span style={{ display: "grid", placeItems: "center", width: 52 * u, height: 52 * u, borderRadius: 999, background: C.pale, color: C.ink, fontWeight: 600, fontSize: 28 * u }}>{n}</span>
        {text}
      </div>
    </div>
  );
}

export function Launch() {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const square = width / height < 1.2;
  // Design unit: 1px at 1080p.
  const u = height / 1080;

  // Scene timing (30 fps, 12 s).
  const intro = window4(frame, 0, 1, 66, 80);
  const head = window4(frame, 70, 84, 186, 200);
  const feats = window4(frame, 190, 204, 284, 298);
  const outro = interpolate(frame, [286, 302], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const pop = spring({ frame: frame - 6, fps, config: { damping: 14, stiffness: 120 } });
  const word = interpolate(frame, [22, 42], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });

  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #f4f7f5 0%, #ffffff 55%, #eef3ef 100%)", overflow: "hidden" }}>
      <Hills frame={frame} />

      {/* 1. The mark and wordmark */}
      <AbsoluteFill style={{ opacity: intro, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 28 * u, transform: `translateX(${(1 - word) * 253 * u}px) scale(${0.6 + 0.4 * pop})` }}>
          <Mark size={150 * u} />
          <span
            style={{
              fontFamily: F.mark,
              fontWeight: 700,
              fontSize: 132 * u,
              letterSpacing: "-0.035em",
              color: C.fg,
              opacity: word,
              transform: `translateX(${(1 - word) * -30 * u}px)`,
              clipPath: `inset(0 ${(1 - word) * 100}% 0 0)`,
            }}
          >
            horman
          </span>
        </div>
      </AbsoluteFill>

      {/* 2. The announcement */}
      <AbsoluteFill style={{ opacity: head, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 40 * u, paddingBottom: 90 * u }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 * u, ...fadeUp(frame, 76) }}>
          <Mark size={52 * u} />
          <span style={{ fontFamily: F.body, fontWeight: 600, fontSize: 32 * u, color: C.fg }}>Private AI workspace</span>
        </div>
        <div style={{ textAlign: "center", lineHeight: 0.95 }}>
          <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: (square ? 190 : 230) * u, letterSpacing: "-0.055em", color: C.fg, ...fadeUp(frame, 84, 20, 40) }}>
            $HORMAN
          </div>
          <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: (square ? 118 : 140) * u, letterSpacing: "-0.02em", color: C.fg, marginTop: 6 * u, ...fadeUp(frame, 100, 20, 30) }}>
            is live on Solana.
          </div>
        </div>
        <div style={{ ...fadeUp(frame, 120, 18, 20) }}>
          <SolanaBadge u={u} />
        </div>
      </AbsoluteFill>

      {/* 3. What you get */}
      <AbsoluteFill style={{ opacity: feats, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 46 * u, padding: `0 ${60 * u}px ${150 * u}px` }}>
        <div style={{ textAlign: "center", ...fadeUp(frame, 194) }}>
          <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: (square ? 84 : 96) * u, letterSpacing: "-0.045em", color: C.fg, lineHeight: 1 }}>Ask anything.</div>
          <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: (square ? 80 : 92) * u, color: C.fg, lineHeight: 1 }}>Keep it private.</div>
        </div>
        <div style={{ display: "flex", flexDirection: square ? "column" : "row", gap: (square ? 16 : 28) * u, width: square ? 940 * u : 1740 * u }}>
          <Card
            u={u}
            icon={<MessageSquare size={36 * u} />}
            title="Free AI chat"
            text="Ask anything with Auto. No account needed."
            style={{ flex: 1, ...fadeUp(frame, 208, 18, 30) }}
            row={square}
          />
          <Card
            u={u}
            icon={<KeyRound size={36 * u} />}
            title="Every model for holders"
            text="Hold $HORMAN to unlock GPT, Claude, Gemini and more."
            style={{ flex: 1, ...fadeUp(frame, 218, 18, 30) }}
            row={square}
          />
          <Card
            u={u}
            icon={<Wallet size={36 * u} />}
            title="Sign in with Solana"
            text="Phantom, Solflare or Backpack. One signature, no fee."
            style={{ flex: 1, ...fadeUp(frame, 228, 18, 30) }}
            row={square}
          />
        </div>
      </AbsoluteFill>
      {feats > 0 && (
        <div style={{ opacity: feats }}>
          <Caption n={1} text="Private AI, now on Solana" u={u} frame={frame} start={236} />
        </div>
      )}

      {/* 4. Outro */}
      <AbsoluteFill
        style={{
          opacity: outro,
          background: `radial-gradient(120% 90% at 50% 30%, ${C.night} 0%, ${C.ink} 70%)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 34 * u,
          color: "#fff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 * u, ...fadeUp(frame, 294) }}>
          <Mark size={84 * u} />
          <span style={{ fontFamily: F.mark, fontWeight: 700, fontSize: 76 * u, letterSpacing: "-0.035em" }}>horman</span>
        </div>
        <div style={{ textAlign: "center", ...fadeUp(frame, 302) }}>
          <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 92 * u, letterSpacing: "-0.045em", lineHeight: 1 }}>$HORMAN is live.</div>
          <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 84 * u, color: C.pale, lineHeight: 1.05 }}>On Solana.</div>
        </div>
        <div
          style={{
            padding: `${18 * u}px ${44 * u}px`,
            borderRadius: 999,
            background: "#fff",
            color: C.ink,
            fontFamily: F.display,
            fontWeight: 700,
            fontSize: 40 * u,
            letterSpacing: "-0.02em",
            ...fadeUp(frame, 312),
          }}
        >
          horman.dev
        </div>
        <div style={{ fontFamily: F.body, fontSize: 32 * u, color: C.pale, ...fadeUp(frame, 322, 16, 12) }}>
          Only trust the CA on horman.dev and @askhorman
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
