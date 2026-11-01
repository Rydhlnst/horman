import { Check, Copy, Loader2, Ticket } from "lucide-react";
import { SiSolana, SiZcash } from "react-icons/si";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, ease, F, Mark, SOL } from "./Launch";

// "Top up with Zcash": pick ZEC, send it, watch the credit land on the signed-in Solana wallet.
// Amounts and the address are examples and say so.
export const U06_FRAMES = 330;
const MONO = "'IBM Plex Mono', ui-monospace, monospace";
const ZEC = "#F4B728";
const NIGHT = "#1a231e";
const NIGHT2 = "#26322b";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const p = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
const up = (f: number, a: number, d = 14, dist = 20) => ({ opacity: p(f, a, a + d), transform: `translateY(${(1 - p(f, a, a + d)) * dist}px)` });

const STATUS: [number, string][] = [
  [0, "Waiting for your payment"],
  [150, "Payment seen, confirming on Zcash"],
  [196, "Paid. $10 of credit added."],
];

function Row({ label, value, f, at, tag }: { label: string; value: string; f: number; at: number; tag?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, ...up(f, at, 12, 12) }}>
      <span style={{ fontSize: 20, color: C.nightMuted }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", borderRadius: 16, background: NIGHT2 }}>
        <span style={{ flex: 1, fontFamily: MONO, fontSize: 25, color: "#fff" }}>{value}</span>
        {tag && <span style={{ padding: "4px 10px", borderRadius: 999, background: "rgba(255,255,255,0.1)", fontFamily: MONO, fontSize: 15, color: C.nightMuted }}>{tag}</span>}
        <Copy size={22} color={C.pale} />
      </div>
    </div>
  );
}

export function U06Zcash() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const coin = spring({ frame: f - 6, fps, config: { damping: 12, stiffness: 120 } });
  const card = p(f, 34, 50);
  const toCheckout = p(f, 92, 108);
  const status = [...STATUS].reverse().find(([t]) => f >= t)?.[1] ?? STATUS[0][1];
  const paid = f >= 196;
  const pop = spring({ frame: f - 196, fps, config: { damping: 11, stiffness: 170 } });
  const credit = interpolate(f, [200, 236], [0, 10], { ...clamp, easing: ease });
  const outro = p(f, 280, 294);

  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #ffffff 0%, #f6f9f7 60%, #eaf1ec 100%)", color: C.fg, fontFamily: F.body }}>
      {/* Headline */}
      <div style={{ position: "absolute", left: 70, right: 70, top: 64, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, ...up(f, 2) }}>
            <span style={{ padding: "6px 14px", borderRadius: 999, background: C.ink, color: "#fff", fontFamily: MONO, fontSize: 21, letterSpacing: "0.1em" }}>NEW</span>
            <span style={{ fontFamily: MONO, fontSize: 21, color: C.muted }}>horman.dev · top up</span>
          </div>
          <div style={{ marginTop: 18, fontFamily: F.display, fontWeight: 800, fontSize: 92, lineHeight: 0.96, letterSpacing: "-0.05em", ...up(f, 8) }}>Pay for AI</div>
          <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 92, lineHeight: 1.02, color: C.accent, ...up(f, 16) }}>in Zcash.</div>
        </div>
        <div style={{ display: "grid", placeItems: "center", width: 150, height: 150, borderRadius: 999, background: ZEC, color: "#111", boxShadow: "0 30px 60px -30px rgba(160,110,0,0.6)", transform: `scale(${coin}) rotate(${(1 - coin) * -90}deg)` }}>
          <SiZcash size={92} />
        </div>
      </div>

      {/* Signed-in wallet with credit */}
      <div style={{ position: "absolute", left: 70, top: 318, display: "flex", alignItems: "center", gap: 14, ...up(f, 26, 14, 14) }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 18px 10px 10px", borderRadius: 999, background: "#fff", border: `1.5px solid ${C.line}` }}>
          <span style={{ display: "grid", placeItems: "center", width: 36, height: 36, borderRadius: 999, background: SOL, color: "#fff" }}>
            <SiSolana size={18} />
          </span>
          <span style={{ fontFamily: MONO, fontSize: 21 }}>9WzD…AWWM</span>
        </span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 20px",
            borderRadius: 999,
            background: paid ? "#cfe9dc" : NIGHT,
            color: paid ? "#0f5a40" : "#fff",
            transform: `scale(${paid ? 1 + 0.08 * Math.sin(Math.min(1, pop) * Math.PI) : 1})`,
          }}
        >
          <Ticket size={22} />
          <span style={{ fontSize: 19, opacity: 0.8 }}>Credit</span>
          <span style={{ fontFamily: MONO, fontSize: 24, fontWeight: 600 }}>${credit.toFixed(2)}</span>
        </span>
        <span style={{ fontFamily: MONO, fontSize: 16, color: C.muted }}>example</span>
      </div>

      {/* The top-up card, then the checkout */}
      <div style={{ position: "absolute", left: 70, right: 70, top: 420, height: 480, borderRadius: 30, background: NIGHT, color: "#fff", overflow: "hidden", boxShadow: "0 40px 90px -50px rgba(20,30,25,0.7)", opacity: card, transform: `translateY(${(1 - card) * 30}px)` }}>
        {/* Picker */}
        <div style={{ position: "absolute", inset: 0, padding: "34px 40px", opacity: 1 - toCheckout, transform: `translateX(${-toCheckout * 60}px)` }}>
          <span style={{ fontSize: 20, color: C.nightMuted }}>You get</span>
          <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 120, lineHeight: 1, letterSpacing: "-0.04em" }}>$10</div>
          <span style={{ fontSize: 22, color: C.nightMuted }}>of credit, paid in ZEC</span>
          <div style={{ margin: "30px 0", borderTop: "2px dashed rgba(255,255,255,0.15)" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 24, color: C.nightMuted }}>Token</span>
            <span style={{ display: "flex", gap: 6, padding: 6, borderRadius: 16, background: NIGHT2 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 12, background: C.pale, color: NIGHT, fontWeight: 700, fontSize: 22 }}>
                <SiZcash size={20} /> ZEC
              </span>
              <span style={{ padding: "10px 18px", fontWeight: 600, fontSize: 22, color: "#fff" }}>
                USDC <span style={{ fontSize: 15, opacity: 0.6 }}>soon</span>
              </span>
            </span>
          </div>
          <div style={{ marginTop: 36, display: "flex", alignItems: "center", justifyContent: "center", height: 74, borderRadius: 999, background: C.pale, color: NIGHT, fontFamily: F.display, fontWeight: 700, fontSize: 28, transform: `scale(${f > 80 && f < 88 ? 0.96 : 1})` }}>
            Pay $10 in ZEC
          </div>
        </div>

        {/* Checkout */}
        <div style={{ position: "absolute", inset: 0, padding: "34px 40px", display: "flex", flexDirection: "column", gap: 22, opacity: toCheckout, transform: `translateX(${(1 - toCheckout) * 60}px)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ display: "grid", placeItems: "center", width: 58, height: 58, borderRadius: 16, background: ZEC, color: "#111" }}>
              <SiZcash size={30} />
            </span>
            <span style={{ fontFamily: F.display, fontWeight: 800, fontSize: 44, letterSpacing: "-0.03em" }}>$10 of credit</span>
          </div>
          <Row f={f} at={110} label="Send exactly" value="0.27 ZEC" tag="example" />
          <Row f={f} at={118} label="To this Zcash address" value="t1Xk…9qPa" tag="example" />
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 25, color: paid ? C.pale : C.nightMuted, ...up(f, 128, 12, 10) }}>
            {paid ? <Check size={26} strokeWidth={3} /> : <Loader2 size={26} style={{ transform: `rotate(${f * 12}deg)` }} />}
            {status}
          </div>
        </div>
      </div>

      {/* Closing */}
      <AbsoluteFill style={{ opacity: outro, background: "linear-gradient(180deg, #ffffff 0%, #eef3ef 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
        <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 92, letterSpacing: "-0.05em", lineHeight: 0.98 }}>No card. No billing.</div>
        <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 78, color: C.accent, lineHeight: 1.05 }}>Credit on your Solana wallet.</div>
        <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 14 }}>
          <Mark size={60} />
          <span style={{ fontFamily: F.mark, fontWeight: 700, fontSize: 52, letterSpacing: "-0.03em" }}>horman.dev/topup</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
