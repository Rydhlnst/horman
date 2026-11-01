import { Check, ScanLine, ShieldAlert } from "lucide-react";
import { SiSolana } from "react-icons/si";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, ease, F, Mark, SOL } from "./Launch";

// "Paste any Solana address": the chat reads the chain live, then explains it.
// The example is the USDC mint; every field shown is a stable fact about it.
export const U02_FRAMES = 330;
const MONO = "'IBM Plex Mono', ui-monospace, monospace";
const MINT = "#cfe9dc";
const AMBER = "#f6e3c8";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const p = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
const up = (f: number, a: number, d = 14, dist = 20) => ({ opacity: p(f, a, a + d), transform: `translateY(${(1 - p(f, a, a + d)) * dist}px)` });

const ADDRESS = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
const FIELDS: [string, string, "ok" | "warn"][] = [
  ["Program", "SPL Token", "ok"],
  ["Decimals", "6", "ok"],
  ["Mint authority", "Active", "warn"],
  ["Freeze authority", "Active", "warn"],
];
const ANSWER =
  "This is the USDC mint. Its issuer can still create new tokens and freeze accounts. That’s normal for a regulated stablecoin, and a red flag on a meme coin. Check both before you buy anything.";

export function U02Onchain() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pasted = spring({ frame: f - 40, fps, config: { damping: 14, stiffness: 160 } });
  const reading = p(f, 66, 78) * (1 - p(f, 180, 192));
  const beam = ((f - 70) % 40) / 40;
  const answer = p(f, 188, 200);
  const typed = ANSWER.slice(0, Math.max(0, Math.floor((f - 200) * 2.4)));
  const outro = p(f, 296, 310);

  return (
    <AbsoluteFill style={{ background: "#0d1310", color: "#fff", fontFamily: F.body }}>
      <AbsoluteFill style={{ background: "radial-gradient(70% 55% at 50% 60%, rgba(78,107,92,0.35), rgba(13,19,16,0) 70%)" }} />
      {/* Header */}
      <div style={{ position: "absolute", left: 70, right: 70, top: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, ...up(f, 2) }}>
          <span style={{ padding: "6px 14px", borderRadius: 999, background: MINT, color: "#0f5a40", fontFamily: MONO, fontSize: 21, letterSpacing: "0.1em" }}>NEW</span>
          <span style={{ fontFamily: MONO, fontSize: 21, color: C.nightMuted }}>Live onchain lookups in chat</span>
        </div>
        <div style={{ marginTop: 18, fontFamily: F.display, fontWeight: 800, fontSize: 76, lineHeight: 0.98, letterSpacing: "-0.05em", ...up(f, 8) }}>Paste any Solana address.</div>
        <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 74, lineHeight: 1.04, color: C.pale, ...up(f, 16) }}>Horman reads it live.</div>
      </div>

      {/* Chat */}
      <div style={{ position: "absolute", left: 70, right: 70, top: 300, display: "flex", flexDirection: "column", gap: 22 }}>
        <div style={{ alignSelf: "flex-end", maxWidth: 820, padding: "20px 26px", borderRadius: 26, background: "#f4f7f5", color: C.ink, opacity: pasted, transform: `scale(${0.9 + 0.1 * pasted})`, transformOrigin: "right" }}>
          <div style={{ fontSize: 30, fontWeight: 500 }}>Is this safe to hold?</div>
          <div style={{ marginTop: 6, fontFamily: MONO, fontSize: 22, color: C.accent, overflowWrap: "anywhere" }}>{ADDRESS}</div>
        </div>

        {/* The live read */}
        <div style={{ position: "relative", height: 0 }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, opacity: reading, transform: `translateY(${(1 - p(f, 66, 78)) * 20}px)` }}>
            <div style={{ position: "relative", overflow: "hidden", padding: "22px 26px", borderRadius: 26, background: "rgba(22,30,26,0.95)", border: "1.5px solid rgba(201,215,205,0.3)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: MONO, fontSize: 22, color: C.nightMuted }}>
                <span style={{ display: "grid", placeItems: "center", width: 40, height: 40, borderRadius: 12, background: SOL, color: "#fff" }}>
                  <SiSolana size={22} />
                </span>
                Reading Solana mainnet…
                <ScanLine size={24} style={{ marginLeft: "auto", color: MINT }} />
              </div>
              <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {FIELDS.map(([k, v, tone], i) => {
                  const on = p(f, 86 + i * 20, 98 + i * 20);
                  return (
                    <div key={k} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 16, background: `rgba(201,215,205,${0.05 + 0.07 * on})`, border: `1.5px solid rgba(201,215,205,${0.12 + 0.3 * on})` }}>
                      <span style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontFamily: MONO, fontSize: 18, color: C.nightMuted }}>{k}</span>
                        <span style={{ fontFamily: F.display, fontWeight: 700, fontSize: 30, opacity: on }}>{on > 0.05 ? v : "···"}</span>
                      </span>
                      <span style={{ marginLeft: "auto", display: "grid", placeItems: "center", width: 36, height: 36, borderRadius: 11, background: tone === "ok" ? MINT : AMBER, color: tone === "ok" ? "#0f5a40" : "#7a4b0b", opacity: on, transform: `scale(${0.5 + 0.5 * on})` }}>
                        {tone === "ok" ? <Check size={22} strokeWidth={3} /> : <ShieldAlert size={22} />}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div style={{ position: "absolute", left: 0, right: 0, top: `${beam * 100}%`, height: 60, background: "linear-gradient(180deg, rgba(207,233,220,0), rgba(207,233,220,0.16), rgba(207,233,220,0))", pointerEvents: "none" }} />
            </div>
          </div>

          {/* The answer */}
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, display: "flex", gap: 16, opacity: answer, transform: `translateY(${(1 - answer) * 20}px)` }}>
            <Mark size={56} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
              <span style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 16px", borderRadius: 999, background: MINT, color: "#0f5a40", fontSize: 22, fontWeight: 600 }}>
                <span style={{ width: 10, height: 10, borderRadius: 99, background: "#14b88a" }} /> Read live from Solana · token
              </span>
              <div style={{ padding: "22px 26px", borderRadius: 26, background: "#f4f7f5", color: C.fg, fontSize: 31, lineHeight: 1.42, minHeight: 230 }}>{typed}</div>
              <div style={{ display: "flex", gap: 10, ...up(f, 270, 12, 10) }}>
                {["Mint authority active", "Freeze authority active"].map((t) => (
                  <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 999, background: AMBER, color: "#7a4b0b", fontSize: 21, fontWeight: 600 }}>
                    <ShieldAlert size={18} /> {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Closing */}
      <AbsoluteFill style={{ opacity: outro, background: `radial-gradient(120% 90% at 50% 30%, ${C.night} 0%, #0b100d 70%)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26 }}>
        <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 100, letterSpacing: "-0.05em", lineHeight: 0.98, textAlign: "center" }}>Check before</div>
        <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 100, color: C.pale, lineHeight: 1 }}>you buy.</div>
        <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 14 }}>
          <Mark size={60} />
          <span style={{ fontFamily: F.mark, fontWeight: 700, fontSize: 52, letterSpacing: "-0.03em" }}>horman.dev</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
