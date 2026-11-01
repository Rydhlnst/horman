import { Check, ShieldAlert, TriangleAlert } from "lucide-react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, ease, F, Mark } from "./Launch";

// "Token check": one risky example token, one clean one. Both are labelled examples.
export const U05_FRAMES = 330;
const MONO = "'IBM Plex Mono', ui-monospace, monospace";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const p = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
const up = (f: number, a: number, d = 14, dist = 20) => ({ opacity: p(f, a, a + d), transform: `translateY(${(1 - p(f, a, a + d)) * dist}px)` });

type Level = "ok" | "warn" | "bad";
const TONE: Record<Level, [string, string]> = { ok: ["#cfe9dc", "#0f5a40"], warn: ["#f6e3c8", "#7a4b0b"], bad: ["#fbdcd6", "#9a2f22"] };
const Icon = ({ l, size }: { l: Level; size: number }) => (l === "ok" ? <Check size={size} strokeWidth={3} /> : l === "warn" ? <TriangleAlert size={size} /> : <ShieldAlert size={size} />);

const RISKY: [string, string, Level][] = [
  ["Permanent delegate", "Someone can move tokens out of any wallet", "bad"],
  ["Freeze authority is active", "Holders can be frozen so they can’t sell", "bad"],
  ["Transfer fee of 5%", "Every sale pays it", "warn"],
  ["Mint authority is revoked", "No one can create more", "ok"],
];
const CLEAN: [string, string, Level][] = [
  ["Mint authority is revoked", "No one can create more", "ok"],
  ["Freeze authority is revoked", "No one can freeze yours", "ok"],
  ["Largest ten hold 27%", "Supply is spread out", "ok"],
  ["Largest account holds 9.5%", "No single account dominates", "ok"],
];

function Report({ f, start, addr, verdict, level, rows }: { f: number; start: number; addr: string; verdict: string; level: Level; rows: [string, string, Level][] }) {
  const { fps } = useVideoConfig();
  const typed = addr.slice(0, Math.max(0, Math.floor((f - start) * 1.6)));
  const banner = spring({ frame: f - (start + 34), fps, config: { damping: 13, stiffness: 150 } });
  const [bg, fg] = TONE[level];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 12px 12px 22px", borderRadius: 22, background: "#fff", border: `1.5px solid ${C.line}`, boxShadow: "0 20px 44px -30px rgba(20,30,25,0.4)" }}>
        <span style={{ flex: 1, fontFamily: MONO, fontSize: 26, color: C.fg }}>
          {typed}
          {typed.length < addr.length && <span style={{ opacity: Math.floor(f / 8) % 2 ? 1 : 0 }}>|</span>}
        </span>
        <span style={{ padding: "14px 24px", borderRadius: 999, background: C.ink, color: "#fff", fontFamily: F.display, fontWeight: 700, fontSize: 24, transform: `scale(${f > start + 26 && f < start + 32 ? 0.94 : 1})` }}>Check token</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 24px", borderRadius: 24, background: bg, color: fg, opacity: banner, transform: `scale(${0.92 + 0.08 * banner})` }}>
        <Icon l={level} size={36} />
        <span style={{ fontFamily: F.display, fontWeight: 800, fontSize: 40, letterSpacing: "-0.03em" }}>{verdict}</span>
        <span style={{ marginLeft: "auto", padding: "6px 12px", borderRadius: 999, background: "rgba(255,255,255,0.7)", fontFamily: MONO, fontSize: 17, color: C.muted }}>Example</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
        {rows.map(([t, d, l], i) => {
          const on = p(f, start + 44 + i * 9, start + 56 + i * 9);
          const [b2, f2] = TONE[l];
          return (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", borderRadius: 18, background: "#fff", border: `1.5px solid ${C.line}`, opacity: on, transform: `translateY(${(1 - on) * 14}px)` }}>
              <span style={{ flex: "none", display: "grid", placeItems: "center", width: 48, height: 48, borderRadius: 14, background: b2, color: f2 }}>
                <Icon l={l} size={24} />
              </span>
              <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontFamily: F.display, fontWeight: 700, fontSize: 30, letterSpacing: "-0.02em" }}>{t}</span>
                <span style={{ fontSize: 22, color: C.muted, lineHeight: 1.3 }}>{d}</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function U05Check() {
  const f = useCurrentFrame();
  const a1 = 1 - p(f, 156, 168);
  const a2 = p(f, 166, 178);
  const outro = p(f, 290, 304);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #ffffff 0%, #f6f9f7 60%, #eaf1ec 100%)", color: C.fg, fontFamily: F.body }}>
      <div style={{ position: "absolute", left: 70, right: 70, top: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, ...up(f, 2) }}>
          <span style={{ padding: "6px 14px", borderRadius: 999, background: C.ink, color: "#fff", fontFamily: MONO, fontSize: 21, letterSpacing: "0.1em" }}>NEW</span>
          <span style={{ fontFamily: MONO, fontSize: 21, color: C.muted }}>horman.dev/check · free</span>
        </div>
        <div style={{ marginTop: 18, fontFamily: F.display, fontWeight: 800, fontSize: 84, lineHeight: 0.98, letterSpacing: "-0.05em", ...up(f, 8) }}>Is this token safe?</div>
        <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 80, lineHeight: 1.04, color: C.accent, ...up(f, 16) }}>Find out in seconds.</div>
      </div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 330, opacity: a1 }}>
        <Report f={f} start={30} addr="7Hq2…xY9p  (example token)" verdict="High risk · 2 serious issues" level="bad" rows={RISKY} />
      </div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 330, opacity: a2 }}>
        <Report f={f} start={170} addr="4mNv…k2Rd  (example token)" verdict="Clean on every check" level="ok" rows={CLEAN} />
      </div>
      <AbsoluteFill style={{ opacity: outro, background: "linear-gradient(180deg, #ffffff 0%, #eef3ef 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 22 }}>
        <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 96, letterSpacing: "-0.05em", lineHeight: 0.98 }}>Know before you buy.</div>
        <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 84, color: C.accent, lineHeight: 1 }}>Free, from the chain.</div>
        <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 14 }}>
          <Mark size={60} />
          <span style={{ fontFamily: F.mark, fontWeight: 700, fontSize: 52, letterSpacing: "-0.03em" }}>horman.dev/check</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
