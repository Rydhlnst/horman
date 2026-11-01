import { Check, ChevronDown, Lock } from "lucide-react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, ease, F, Mark } from "./Launch";

// "Claude, GPT and Gemini now run in every mode", with the on-screen notice as proof.
export const U01_FRAMES = 300;
const MONO = "'IBM Plex Mono', ui-monospace, monospace";
const MINT = "#cfe9dc";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const p = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
const up = (f: number, a: number, d = 16, dist = 22) => ({ opacity: p(f, a, a + d), transform: `translateY(${(1 - p(f, a, a + d)) * dist}px)` });

const MODES = ["Sealed", "Ephemeral", "Open"];
const LABS = [
  ["claude-color", "Claude", "Anthropic"],
  ["openai", "GPT", "OpenAI"],
  ["gemini-color", "Gemini", "Google"],
];
const NOTICE = "Claude is hosted by Anthropic, so Anthropic reads this chat to answer it. Horman still stores nothing.";

export function U01EveryMode() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  // The mode switch slides from Open to Sealed.
  const slide = p(f, 92, 112);
  const thumbX = interpolate(slide, [0, 1], [2, 0]);
  const flipped = f > 118;
  const stamp = spring({ frame: f - 122, fps, config: { damping: 10, stiffness: 160 } });
  // Act two: the composer and the notice.
  const act2 = p(f, 160, 176);
  const act1 = 1 - act2;
  const question = "Draft a calm reply to this angry client email";
  const typed = question.slice(0, Math.max(0, Math.floor((f - 180) * 1.8)));
  const notice = p(f, 206, 220);
  const marker = p(f, 222, 246);
  const outro = p(f, 262, 276);

  return (
    <AbsoluteFill style={{ background: "#f4f7f5", fontFamily: F.body, color: C.fg }}>
      {/* Header */}
      <div style={{ position: "absolute", left: 80, right: 80, top: 76 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, ...up(f, 2) }}>
          <span style={{ padding: "6px 14px", borderRadius: 999, background: C.ink, color: "#fff", fontFamily: MONO, fontSize: 22, letterSpacing: "0.1em" }}>UPDATE</span>
          <span style={{ fontFamily: MONO, fontSize: 22, color: C.muted }}>horman.dev</span>
        </div>
        <div style={{ marginTop: 22, fontFamily: F.display, fontWeight: 800, fontSize: 86, lineHeight: 0.98, letterSpacing: "-0.05em", ...up(f, 8) }}>Claude, GPT and Gemini</div>
        <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 84, lineHeight: 1.02, color: C.accent, ...up(f, 16) }}>now in every mode.</div>
      </div>

      {/* Act one: mode switch and model cards */}
      <div style={{ position: "absolute", left: 80, right: 80, top: 360, opacity: act1, transform: `translateY(${-act2 * 40}px)` }}>
        <div style={{ position: "relative", display: "flex", padding: 6, borderRadius: 999, background: "#fff", border: `1.5px solid ${C.line}`, boxShadow: "0 16px 30px -22px rgba(20,30,25,0.35)", ...up(f, 30) }}>
          <span style={{ position: "absolute", top: 6, bottom: 6, left: `calc(6px + ${thumbX} * (100% - 12px) / 3)`, width: "calc((100% - 12px) / 3)", borderRadius: 999, background: C.ink }} />
          {MODES.map((m, i) => {
            const on = (i === 2 && slide < 0.5) || (i === 0 && slide >= 0.5);
            return (
              <span key={m} style={{ position: "relative", flex: 1, textAlign: "center", padding: "16px 0", fontFamily: F.display, fontWeight: 700, fontSize: 32, color: on ? "#fff" : C.muted }}>
                {m}
              </span>
            );
          })}
        </div>
        <div style={{ marginTop: 34, display: "flex", flexDirection: "column", gap: 18 }}>
          {LABS.map(([logo, name, lab], i) => (
            <div key={name} style={{ display: "flex", alignItems: "center", gap: 20, padding: "22px 26px", borderRadius: 26, background: "#fff", border: `1.5px solid ${flipped ? "#b9dccb" : C.line}`, boxShadow: "0 18px 36px -26px rgba(20,30,25,0.4)", ...up(f, 44 + i * 10) }}>
              <span style={{ display: "grid", placeItems: "center", width: 64, height: 64, borderRadius: 18, background: "#f4f7f5" }}>
                <Img src={staticFile(`models/${logo}.svg`)} style={{ width: 40, height: 40 }} />
              </span>
              <span style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontFamily: F.display, fontWeight: 700, fontSize: 40, letterSpacing: "-0.02em" }}>{name}</span>
                <span style={{ fontSize: 24, color: C.muted }}>Hosted by {lab}</span>
              </span>
              <span style={{ marginLeft: "auto", position: "relative", height: 52, width: 230 }}>
                <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 999, background: "#eceeed", color: C.muted, fontSize: 24, fontWeight: 600, opacity: flipped ? 0 : 1, transform: `translateY(${flipped ? -16 : 0}px)` }}>
                  <Lock size={20} /> Open only
                </span>
                <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 999, background: MINT, color: "#0f5a40", fontSize: 24, fontWeight: 600, opacity: flipped ? 1 : 0, transform: `translateY(${flipped ? 0 : 16}px)` }}>
                  <Check size={22} strokeWidth={3} /> Every mode
                </span>
              </span>
            </div>
          ))}
        </div>
        <span style={{ position: "absolute", left: 400, top: 112, padding: "10px 22px", borderRadius: 14, border: `5px solid ${C.accent}`, color: C.accent, fontFamily: F.display, fontWeight: 800, fontSize: 44, transform: `rotate(-10deg) scale(${1.7 - 0.7 * stamp})`, opacity: stamp, background: "rgba(244,247,245,0.85)" }}>NEW</span>
      </div>

      {/* Act two: the composer in Sealed with Claude, and the notice */}
      <div style={{ position: "absolute", left: 80, right: 80, top: 380, opacity: act2, transform: `translateY(${(1 - act2) * 40}px)` }}>
        <div style={{ borderRadius: 30, background: "#fff", border: `1.5px solid ${C.line}`, boxShadow: "0 30px 60px -36px rgba(20,30,25,0.45)", padding: 28 }}>
          <div style={{ minHeight: 110, fontSize: 36, lineHeight: 1.35, color: typed ? C.fg : C.muted }}>
            {typed || "Ask anything…"}
            {f > 180 && f < 206 && <span style={{ opacity: Math.floor(f / 8) % 2 ? 1 : 0 }}>|</span>}
          </div>
          <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ padding: "10px 20px", borderRadius: 999, background: C.ink, color: "#fff", fontFamily: F.display, fontWeight: 700, fontSize: 26 }}>Sealed</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "9px 16px", borderRadius: 14, border: `1.5px solid ${C.line}`, fontSize: 26, color: C.fg }}>
              <Img src={staticFile("models/claude-color.svg")} style={{ width: 26, height: 26 }} /> Claude · holders <ChevronDown size={22} color={C.muted} />
            </span>
            <span style={{ marginLeft: "auto", display: "grid", placeItems: "center", width: 64, height: 64, borderRadius: 20, background: C.ink, color: "#fff", fontSize: 32 }}>↑</span>
          </div>
        </div>
        <div style={{ marginTop: 30, textAlign: "center", opacity: notice, transform: `translateY(${(1 - notice) * 14}px)` }}>
          <span
            style={{
              fontSize: 33,
              lineHeight: 1.5,
              color: C.fg,
              backgroundImage: `linear-gradient(${MINT}, ${MINT})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: `${marker * 100}% 100%`,
              boxDecorationBreak: "clone",
              WebkitBoxDecorationBreak: "clone",
              padding: "2px 6px",
              borderRadius: 6,
            }}
          >
            {NOTICE}
          </span>
        </div>
        <div style={{ marginTop: 26, display: "flex", justifyContent: "center", ...up(f, 240, 12, 12) }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 22px", borderRadius: 999, background: C.ink, color: "#fff", fontFamily: MONO, fontSize: 22 }}>
            ↑ shown on screen, every time
          </span>
        </div>
      </div>

      {/* Closing line */}
      <div style={{ position: "absolute", left: 80, right: 80, bottom: 70, display: "flex", alignItems: "flex-end", gap: 20, opacity: outro, transform: `translateY(${(1 - outro) * 18}px)` }}>
        <div>
          <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 56, letterSpacing: "-0.04em", lineHeight: 1 }}>Choice and honesty,</div>
          <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 56, lineHeight: 1.05 }}>in the same release.</div>
        </div>
        <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          <Mark size={52} />
          <span style={{ fontFamily: F.mark, fontWeight: 700, fontSize: 40, letterSpacing: "-0.03em" }}>horman</span>
        </span>
      </div>
    </AbsoluteFill>
  );
}
