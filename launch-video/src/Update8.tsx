import { Check, ShieldAlert, TriangleAlert } from "lucide-react";
import { SiSolana } from "react-icons/si";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, ease, F, Mark, SOL } from "./Launch";

// "What's really in your wallet?": a scan beam passes over a wallet's tokens and each one
// lights up with its verdict. Every token here is a made-up example.
export const U08_FRAMES = 330;
const MONO = "'IBM Plex Mono', ui-monospace, monospace";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const p = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
const up = (f: number, a: number, d = 14, dist = 20) => ({ opacity: p(f, a, a + d), transform: `translateY(${(1 - p(f, a, a + d)) * dist}px)` });

type Level = "ok" | "warn" | "bad";
const TONE: Record<Level, [string, string]> = { ok: ["#cfe9dc", "#0f5a40"], warn: ["#f6e3c8", "#7a4b0b"], bad: ["#fbdcd6", "#9a2f22"] };
const Icon = ({ l, size }: { l: Level; size: number }) => (l === "ok" ? <Check size={size} strokeWidth={3} /> : l === "warn" ? <TriangleAlert size={size} /> : <ShieldAlert size={size} />);

const TOKENS: { name: string; amount: string; level: Level; finding: string }[] = [
  { name: "Airdropped token", amount: "1,000,000", level: "bad", finding: "Permanent delegate: someone can move it out" },
  { name: "Meme token", amount: "42,000", level: "bad", finding: "Freeze authority is active" },
  { name: "Fee token", amount: "850", level: "warn", finding: "Transfer fee of 5% on every sale" },
  { name: "Community token", amount: "12,400", level: "ok", finding: "Mint and freeze revoked" },
  { name: "Long-held token", amount: "3,200", level: "ok", finding: "No mint, freeze or fee risks" },
];
const ROW_H = 104;
const TOP = 404;

export function U08Scan() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  // The beam sweeps from the first row to past the last.
  const beamY = interpolate(f, [70, 200], [TOP - 20, TOP + TOKENS.length * (ROW_H + 14) + 10], { ...clamp, easing: ease });
  const beamOn = p(f, 62, 72) * (1 - p(f, 200, 214));
  const summary = spring({ frame: f - 212, fps, config: { damping: 13, stiffness: 150 } });
  const outro = p(f, 284, 298);

  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #ffffff 0%, #f6f9f7 60%, #eaf1ec 100%)", color: C.fg, fontFamily: F.body }}>
      <div style={{ position: "absolute", left: 70, right: 70, top: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, ...up(f, 2) }}>
          <span style={{ padding: "6px 14px", borderRadius: 999, background: C.ink, color: "#fff", fontFamily: MONO, fontSize: 21, letterSpacing: "0.1em" }}>NEW</span>
          <span style={{ fontFamily: MONO, fontSize: 21, color: C.muted }}>horman.dev/scan · free</span>
        </div>
        <div style={{ marginTop: 18, fontFamily: F.display, fontWeight: 800, fontSize: 84, lineHeight: 0.98, letterSpacing: "-0.05em", ...up(f, 8) }}>What’s really</div>
        <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 84, lineHeight: 1.04, color: C.accent, ...up(f, 16) }}>in your wallet?</div>
      </div>

      {/* The wallet header */}
      <div style={{ position: "absolute", left: 70, right: 70, top: 322, display: "flex", alignItems: "center", gap: 14, ...up(f, 30, 12, 12) }}>
        <span style={{ display: "grid", placeItems: "center", width: 44, height: 44, borderRadius: 999, background: SOL, color: "#fff" }}>
          <SiSolana size={22} />
        </span>
        <span style={{ fontFamily: MONO, fontSize: 24 }}>7xKX…gAsU</span>
        <span style={{ marginLeft: "auto", padding: "6px 12px", borderRadius: 999, background: "#fff", border: `1.5px solid ${C.line}`, fontFamily: MONO, fontSize: 16, color: C.muted }}>example wallet</span>
      </div>

      {/* Tokens */}
      {TOKENS.map((t, i) => {
        const y = TOP + i * (ROW_H + 14);
        const seen = beamY > y + ROW_H / 2;
        const lit = spring({ frame: f - Math.round(interpolate(y + ROW_H / 2, [TOP - 20, TOP + TOKENS.length * (ROW_H + 14) + 10], [70, 200])), fps, config: { damping: 12, stiffness: 170 } });
        const [bg, fg] = TONE[t.level];
        const show = p(f, 34 + i * 5, 46 + i * 5);
        return (
          <div key={t.name} style={{ position: "absolute", left: 70, right: 70, top: y, height: ROW_H, display: "flex", alignItems: "center", gap: 18, padding: "0 22px", borderRadius: 22, background: "#fff", border: `1.5px solid ${seen ? fg + "44" : C.line}`, opacity: show * (1 - 0.55 * p(f, 214, 226) * (t.level === "ok" ? 1 : 0)) }}>
            <span style={{ flex: "none", display: "grid", placeItems: "center", width: 56, height: 56, borderRadius: 16, background: seen ? bg : "#eef1ef", color: seen ? fg : C.muted, transform: `scale(${seen ? 0.8 + 0.2 * lit : 1})` }}>
              {seen ? <Icon l={t.level} size={28} /> : <span style={{ width: 18, height: 18, borderRadius: 99, background: C.line }} />}
            </span>
            <span style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
              <span style={{ fontFamily: F.display, fontWeight: 700, fontSize: 30, letterSpacing: "-0.02em" }}>{t.name}</span>
              <span style={{ fontSize: 21, color: seen ? fg : C.muted, opacity: seen ? 1 : 0.5 }}>{seen ? t.finding : "not checked yet"}</span>
            </span>
            <span style={{ fontFamily: MONO, fontSize: 22, color: C.muted }}>{t.amount}</span>
          </div>
        );
      })}

      {/* The beam */}
      <div style={{ position: "absolute", left: 50, right: 50, top: beamY - 40, height: 80, opacity: beamOn, pointerEvents: "none", background: "linear-gradient(180deg, rgba(78,107,92,0) 0%, rgba(78,107,92,0.16) 50%, rgba(78,107,92,0) 100%)" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 39, height: 3, borderRadius: 3, background: C.accent, boxShadow: "0 0 24px rgba(78,107,92,0.8)" }} />
      </div>

      {/* Summary */}
      <div style={{ position: "absolute", left: 70, right: 70, top: 1004, display: "flex", gap: 12, justifyContent: "center", opacity: summary, transform: `translateY(${(1 - summary) * 20}px)` }}>
        {([["bad", "2 high risk"], ["warn", "1 some risks"], ["ok", "2 clean"]] as [Level, string][]).map(([l, txt]) => (
          <span key={l} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 999, background: TONE[l][0], color: TONE[l][1], fontWeight: 700, fontSize: 24 }}>
            <Icon l={l} size={22} /> {txt}
          </span>
        ))}
      </div>

      <AbsoluteFill style={{ opacity: outro, background: "linear-gradient(180deg, #ffffff 0%, #eef3ef 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
        <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 92, letterSpacing: "-0.05em", lineHeight: 0.98 }}>Scan any wallet.</div>
        <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 84, color: C.accent, lineHeight: 1 }}>Free, read-only.</div>
        <div style={{ marginTop: 6, fontSize: 30, color: C.muted }}>No wallet connection. Nothing signed.</div>
        <div style={{ marginTop: 22, display: "flex", alignItems: "center", gap: 14 }}>
          <Mark size={60} />
          <span style={{ fontFamily: F.mark, fontWeight: 700, fontSize: 52, letterSpacing: "-0.03em" }}>horman.dev/scan</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
