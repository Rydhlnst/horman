import { Sparkles } from "lucide-react";
import { SiSolana, SiZcash } from "react-icons/si";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, ease, F, Mark, SOL } from "./Launch";

// "Pay per answer": no token needed. One answer, then a receipt prints showing how the
// charge adds up: the model's own cost plus the fee. Every figure is an example.
export const U07_FRAMES = 330;
const MONO = "'IBM Plex Mono', ui-monospace, monospace";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const p = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
const up = (f: number, a: number, d = 14, dist = 20) => ({ opacity: p(f, a, a + d), transform: `translateY(${(1 - p(f, a, a + d)) * dist}px)` });

const ANSWER = "Staking locks SOL with a validator that helps run the network. In return you earn a share of the rewards, usually paid every epoch.";
const LINES: [string, string, boolean?][] = [
  ["Model", "Claude"],
  ["Tokens", "500 in · 40 out"],
  ["Model cost", "$0.0021"],
  ["Fee 10%", "$0.0002"],
  ["This answer", "$0.0023", true],
];

export function U07PayGo() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chat = p(f, 30, 46);
  const typed = ANSWER.slice(0, Math.max(0, Math.floor((f - 64) * 2.4)));
  const print = p(f, 132, 176);
  const total = spring({ frame: f - 218, fps, config: { damping: 12, stiffness: 160 } });
  const left = interpolate(f, [226, 250], [10, 9.9977], { ...clamp, easing: ease });
  const outro = p(f, 284, 298);

  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #ffffff 0%, #f6f9f7 60%, #eaf1ec 100%)", color: C.fg, fontFamily: F.body }}>
      {/* Headline */}
      <div style={{ position: "absolute", left: 70, right: 70, top: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, ...up(f, 2) }}>
          <span style={{ padding: "6px 14px", borderRadius: 999, background: C.ink, color: "#fff", fontFamily: MONO, fontSize: 21, letterSpacing: "0.1em" }}>NEW</span>
          <span style={{ fontFamily: MONO, fontSize: 21, color: C.muted }}>horman.dev · pay as you go</span>
        </div>
        <div style={{ marginTop: 18, display: "flex", alignItems: "baseline", gap: 22 }}>
          <span style={{ fontFamily: F.display, fontWeight: 800, fontSize: 92, letterSpacing: "-0.05em", lineHeight: 0.96, ...up(f, 8) }}>No token?</span>
          <span style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 92, color: C.accent, lineHeight: 0.96, ...up(f, 16) }}>Pay per answer.</span>
        </div>
      </div>

      {/* The chat */}
      <div style={{ position: "absolute", left: 70, right: 70, top: 250, padding: "26px 30px", borderRadius: 28, background: "#fff", border: `1.5px solid ${C.line}`, boxShadow: "0 40px 90px -50px rgba(20,30,25,0.5)", zIndex: 2, opacity: chat, transform: `translateY(${(1 - chat) * 26}px)` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 16px 8px 8px", borderRadius: 999, border: `1.5px solid ${C.line}` }}>
            <span style={{ display: "grid", placeItems: "center", width: 32, height: 32, borderRadius: 999, background: SOL, color: "#fff" }}>
              <SiSolana size={16} />
            </span>
            <span style={{ fontFamily: MONO, fontSize: 19 }}>no {"$"}HORMAN held</span>
          </span>
          <span style={{ padding: "9px 16px", borderRadius: 12, border: `1.5px solid ${C.line}`, fontSize: 20, color: C.muted }}>Claude · pay as you go</span>
        </div>
        <div style={{ marginTop: 22, display: "flex", justifyContent: "flex-end", ...up(f, 50, 10, 10) }}>
          <span style={{ padding: "14px 20px", borderRadius: "20px 20px 6px 20px", background: C.mist, fontSize: 25 }}>What is staking on Solana?</span>
        </div>
        <div style={{ marginTop: 18, display: "flex", gap: 14, minHeight: 112 }}>
          <span style={{ flex: "none", display: "grid", placeItems: "center", width: 40, height: 40, borderRadius: 12, background: C.night, color: C.pale, opacity: f > 60 ? 1 : 0 }}>
            <Sparkles size={20} />
          </span>
          <span style={{ fontSize: 25, lineHeight: 1.4 }}>
            {typed}
            {typed.length > 0 && typed.length < ANSWER.length && <span style={{ display: "inline-block", width: 10, height: 26, marginLeft: 3, background: C.accent, verticalAlign: "-4px" }} />}
          </span>
        </div>
      </div>

      {/* The receipt prints out from under the chat */}
      <div style={{ position: "absolute", left: 200, right: 200, top: 560, height: 400, overflow: "hidden", zIndex: 1 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            padding: "28px 34px 30px",
            background: "#fffdf7",
            border: `1.5px solid ${C.line}`,
            borderTop: "none",
            boxShadow: "0 30px 60px -40px rgba(20,30,25,0.5)",
            transform: `translateY(${(1 - print) * -100}%)`,
            fontFamily: MONO,
            borderRadius: "0 0 18px 18px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 17, color: C.muted, letterSpacing: "0.12em" }}>
            <span>RECEIPT</span>
            <span>EXAMPLE</span>
          </div>
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            {LINES.map(([k, v, strong], i) => {
              const on = p(f, 176 + i * 10, 186 + i * 10);
              return (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: strong ? 27 : 23, fontWeight: strong ? 700 : 400, paddingTop: strong ? 12 : 0, borderTop: strong ? `2px dashed ${C.line}` : "none", opacity: on, transform: strong ? `scale(${0.9 + 0.1 * total})` : undefined, transformOrigin: "left center" }}>
                  <span>{k}</span>
                  <span>{v}</span>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 18, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 12, background: C.night, color: "#fff", fontSize: 22, ...up(f, 222, 10, 8) }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
              <SiZcash size={20} color="#F4B728" /> Credit left
            </span>
            <span style={{ fontWeight: 600 }}>${left.toFixed(4)}</span>
          </div>
        </div>
      </div>

      {/* Closing */}
      <AbsoluteFill style={{ zIndex: 3, opacity: outro, background: "linear-gradient(180deg, #ffffff 0%, #eef3ef 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
        <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 86, letterSpacing: "-0.05em", lineHeight: 0.98 }}>Hold {"$"}HORMAN,</div>
        <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 86, color: C.accent, lineHeight: 1 }}>or pay as you go.</div>
        <div style={{ marginTop: 6, fontSize: 30, color: C.muted }}>Every model. The model’s own price, plus 10%.</div>
        <div style={{ marginTop: 22, display: "flex", alignItems: "center", gap: 14 }}>
          <Mark size={60} />
          <span style={{ fontFamily: F.mark, fontWeight: 700, fontSize: 52, letterSpacing: "-0.03em" }}>horman.dev/pricing</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
