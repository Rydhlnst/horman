import { ArrowUpRight, Check, Radio } from "lucide-react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, ease, F, Mark } from "./Launch";

// "Don't trust. Verify.": the /token page reading $HORMAN live from Solana.
// Only the two authority states are shown as values; numbers stay on the live page.
export const U04_FRAMES = 300;
const MONO = "'IBM Plex Mono', ui-monospace, monospace";
const MINT = "#cfe9dc";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const p = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
const up = (f: number, a: number, d = 14, dist = 20) => ({ opacity: p(f, a, a + d), transform: `translateY(${(1 - p(f, a, a + d)) * dist}px)` });

const TILES: { label: string; value: string; note: string; ok?: boolean }[] = [
  { label: "Mint authority", value: "Revoked", note: "No one can create more", ok: true },
  { label: "Freeze authority", value: "Revoked", note: "No one can freeze yours", ok: true },
  { label: "Supply", value: "Live", note: "Read from the chain" },
  { label: "Largest ten accounts", value: "Live", note: "Share of supply, right now" },
];

export function U04Token() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const page = p(f, 40, 56);
  const pulse = 0.5 + 0.5 * Math.sin(f / 5);
  const outro = p(f, 262, 276);

  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #ffffff 0%, #f6f9f7 60%, #eaf1ec 100%)", color: C.fg, fontFamily: F.body }}>
      <div style={{ position: "absolute", left: 70, right: 70, top: 64, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, ...up(f, 2) }}>
            <span style={{ padding: "6px 14px", borderRadius: 999, background: C.ink, color: "#fff", fontFamily: MONO, fontSize: 21, letterSpacing: "0.1em" }}>NEW</span>
            <span style={{ fontFamily: MONO, fontSize: 21, color: C.muted }}>horman.dev/token</span>
          </div>
          <div style={{ marginTop: 18, fontFamily: F.display, fontWeight: 800, fontSize: 104, lineHeight: 0.95, letterSpacing: "-0.05em", ...up(f, 8) }}>Don’t trust.</div>
          <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 100, lineHeight: 1, color: C.accent, ...up(f, 18) }}>Verify.</div>
        </div>
      </div>

      {/* The page in a browser frame */}
      <div style={{ position: "absolute", left: 70, right: 70, top: 340, borderRadius: 28, overflow: "hidden", background: "#fff", border: `1.5px solid ${C.line}`, boxShadow: "0 40px 90px -50px rgba(20,30,25,0.55)", opacity: page, transform: `translateY(${(1 - page) * 30}px)` }}>
        <div style={{ height: 52, display: "flex", alignItems: "center", gap: 10, padding: "0 20px", background: "#f6f8f7", borderBottom: `1.5px solid ${C.line}` }}>
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ width: 13, height: 13, borderRadius: 99, background: C.line }} />
          ))}
          <span style={{ margin: "0 auto", padding: "6px 22px", borderRadius: 999, background: "#fff", border: `1.5px solid ${C.line}`, fontSize: 20, color: C.muted }}>horman.dev/token</span>
        </div>
        <div style={{ padding: "26px 30px 30px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontFamily: F.display, fontWeight: 800, fontSize: 46, letterSpacing: "-0.04em" }}>$HORMAN,</span>
            <span style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 46 }}>live from Solana.</span>
            <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 999, background: MINT, color: "#0f5a40", fontFamily: MONO, fontSize: 18 }}>
              <Radio size={18} style={{ opacity: 0.4 + 0.6 * pulse }} /> LIVE
            </span>
          </div>
          <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {TILES.map((t, i) => {
              const s = 70 + i * 26;
              const on = p(f, s, s + 14);
              const pop = spring({ frame: f - (s + 8), fps, config: { damping: 11, stiffness: 170 } });
              return (
                <div key={t.label} style={{ position: "relative", padding: "20px 22px", borderRadius: 20, border: `1.5px solid ${on > 0.5 && t.ok ? "#b9dccb" : C.line}`, background: "#fff", overflow: "hidden" }}>
                  <span style={{ display: "block", fontSize: 20, color: C.muted }}>{t.label}</span>
                  <span style={{ display: "block", marginTop: 6, fontFamily: F.display, fontWeight: 800, fontSize: 42, letterSpacing: "-0.03em", opacity: on }}>{on > 0.05 ? t.value : ""}</span>
                  <span style={{ display: "block", marginTop: 2, fontSize: 19, color: C.muted, opacity: on }}>{t.note}</span>
                  {t.ok && (
                    <span style={{ position: "absolute", right: 18, top: 18, display: "grid", placeItems: "center", width: 38, height: 38, borderRadius: 12, background: MINT, color: "#0f5a40", opacity: pop, transform: `scale(${0.4 + 0.6 * pop})` }}>
                      <Check size={22} strokeWidth={3} />
                    </span>
                  )}
                  {on < 1 && <span style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, rgba(221,230,223,0) ${on * 100 - 30}%, rgba(221,230,223,0.8) ${on * 100}%, rgba(221,230,223,0) ${on * 100 + 30}%)` }} />}
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 18, display: "flex", gap: 10, ...up(f, 182, 12, 10) }}>
            {["Solscan", "DexScreener", "Birdeye"].map((n) => (
              <span key={n} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 999, border: `1.5px solid ${C.line}`, fontSize: 20, fontWeight: 600 }}>
                {n} <ArrowUpRight size={18} />
              </span>
            ))}
            <span style={{ marginLeft: "auto", alignSelf: "center", fontFamily: MONO, fontSize: 17, color: C.muted }}>check it yourself</span>
          </div>
        </div>
      </div>

      {/* Closing */}
      <AbsoluteFill style={{ opacity: outro, background: "linear-gradient(180deg, #ffffff 0%, #eef3ef 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 22 }}>
        <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 88, letterSpacing: "-0.05em", lineHeight: 0.98, textAlign: "center" }}>Every fact,</div>
        <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 88, color: C.accent, lineHeight: 1 }}>straight from the chain.</div>
        <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 14 }}>
          <Mark size={60} />
          <span style={{ fontFamily: F.mark, fontWeight: 700, fontSize: 52, letterSpacing: "-0.03em" }}>horman.dev/token</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
