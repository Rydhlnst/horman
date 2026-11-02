import { ArrowRight, Check, Wallet } from "lucide-react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, ease, F, Mark, SOL } from "./Launch";

// "88 characters, one story": a signature decodes into what happened, as a flow and then
// in plain words. The transaction is a made-up example.
export const U09_FRAMES = 360;
const MONO = "'IBM Plex Mono', ui-monospace, monospace";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const p = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
const up = (f: number, a: number, d = 14, dist = 20) => ({ opacity: p(f, a, a + d), transform: `translateY(${(1 - p(f, a, a + d)) * dist}px)` });

const SIG = "4XR92Zct9ZodXzisJ4kov3upmTvMotYVrg65MHP8aoCjSPJwUa7vjaXK5VhDF7ZiiF16v7cY5BPazCLnVqZ3yzbQ";
const B58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const STORY = "You swapped 1 SOL for 159.5 USDC through Jupiter, which routed it via Raydium. It worked, and the network fee was 0.000005 SOL.";

function Node({ label, sub, color, f, at }: { label: string; sub: string; color: string; f: number; at: number }) {
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - at, fps, config: { damping: 12, stiffness: 150 } });
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: 200, opacity: s, transform: `scale(${0.7 + 0.3 * s})` }}>
      <div style={{ display: "grid", placeItems: "center", width: 108, height: 108, borderRadius: 30, background: color, color: "#fff", boxShadow: "0 24px 50px -28px rgba(20,30,25,0.6)", fontFamily: F.display, fontWeight: 800, fontSize: 30 }}>
        {label === "Your wallet" ? <Wallet size={46} /> : label.slice(0, 1)}
      </div>
      <span style={{ fontFamily: F.display, fontWeight: 700, fontSize: 28, letterSpacing: "-0.02em" }}>{label}</span>
      <span style={{ fontSize: 19, color: C.muted, marginTop: -6 }}>{sub}</span>
    </div>
  );
}

function Link({ f, at, label, back }: { f: number; at: number; label: string; back?: boolean }) {
  const on = p(f, at, at + 16);
  const dot = ((f - at) % 30) / 30;
  return (
    <div style={{ position: "relative", flex: 1, height: 108, display: "flex", alignItems: "center", opacity: on }}>
      <div style={{ position: "absolute", left: 0, right: 0, height: 4, borderRadius: 4, background: C.line }} />
      <div style={{ position: "absolute", left: 0, width: `${on * 100}%`, height: 4, borderRadius: 4, background: C.accent }} />
      {on > 0.9 && <span style={{ position: "absolute", left: `${(back ? 1 - dot : dot) * 100}%`, width: 14, height: 14, marginLeft: -7, borderRadius: 99, background: C.accent, boxShadow: "0 0 14px rgba(78,107,92,0.7)" }} />}
      <span style={{ position: "absolute", top: -6, left: 0, right: 0, textAlign: "center", fontFamily: MONO, fontSize: 19, color: C.fg }}>{label}</span>
    </div>
  );
}

export function U09Tx() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  // The signature scrambles, then settles character by character.
  const settled = Math.floor(interpolate(f, [44, 92], [0, SIG.length], clamp));
  const shown = SIG.split("")
    .map((ch, i) => (i < settled ? ch : B58[(i * 7 + Math.floor(f / 2) * 13) % 58]))
    .join("");
  const sigOut = p(f, 104, 118);
  const flow = p(f, 112, 126);
  const status = spring({ frame: f - 190, fps, config: { damping: 12, stiffness: 160 } });
  const typed = STORY.slice(0, Math.max(0, Math.floor((f - 214) * 2.2)));
  const outro = p(f, 312, 326);

  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #ffffff 0%, #f6f9f7 60%, #eaf1ec 100%)", color: C.fg, fontFamily: F.body }}>
      <div style={{ position: "absolute", left: 70, right: 70, top: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, ...up(f, 2) }}>
          <span style={{ padding: "6px 14px", borderRadius: 999, background: C.ink, color: "#fff", fontFamily: MONO, fontSize: 21, letterSpacing: "0.1em" }}>NEW</span>
          <span style={{ fontFamily: MONO, fontSize: 21, color: C.muted }}>horman.dev/tx · and in the chat</span>
        </div>
        <div style={{ marginTop: 18, fontFamily: F.display, fontWeight: 800, fontSize: 92, lineHeight: 0.96, letterSpacing: "-0.05em", ...up(f, 8) }}>88 characters.</div>
        <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 92, lineHeight: 1.02, color: C.accent, ...up(f, 16) }}>One plain story.</div>
      </div>

      {/* The signature */}
      <div style={{ position: "absolute", left: 70, right: 70, top: 380, padding: "26px 30px", borderRadius: 24, background: "#fff", border: `1.5px solid ${C.line}`, boxShadow: "0 30px 70px -45px rgba(20,30,25,0.5)", opacity: p(f, 28, 42) * (1 - sigOut), transform: `translateY(${sigOut * -40}px) scale(${1 - 0.06 * sigOut})` }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 18, color: C.muted, letterSpacing: "0.08em" }}>
          <span>TRANSACTION SIGNATURE</span>
          <span>EXAMPLE</span>
        </div>
        <div style={{ marginTop: 14, fontFamily: MONO, fontSize: 31, lineHeight: 1.45, wordBreak: "break-all", color: C.fg }}>
          {shown.split("").map((ch, i) => (
            <span key={i} style={{ color: i < settled ? C.fg : C.accent, opacity: i < settled ? 1 : 0.55 }}>
              {ch}
            </span>
          ))}
        </div>
      </div>

      {/* The flow */}
      <div style={{ position: "absolute", left: 50, right: 50, top: 360, opacity: flow }}>
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          <Node label="Your wallet" sub="9WzD…AWWM" color={C.night} f={f} at={116} />
          <Link f={f} at={130} label="1 SOL" />
          <Node label="Jupiter" sub="routes the swap" color="#2b8a6e" f={f} at={140} />
          <Link f={f} at={152} label="via" />
          <Node label="Raydium" sub="pool" color="#5b4bd6" f={f} at={162} />
        </div>
        <div style={{ margin: "26px 100px 0", display: "flex", alignItems: "center", gap: 14, justifyContent: "center", fontFamily: MONO, fontSize: 24, opacity: p(f, 174, 188) }}>
          <span style={{ padding: "8px 16px", borderRadius: 999, background: "#cfe9dc", color: "#0f5a40" }}>+159.5 USDC</span>
          <ArrowRight size={24} color={C.muted} />
          <span>back to your wallet</span>
        </div>
      </div>

      {/* Status and the story */}
      <div style={{ position: "absolute", left: 70, right: 70, top: 712, display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, alignSelf: "flex-start", padding: "12px 22px", borderRadius: 999, background: "#cfe9dc", color: "#0f5a40", fontFamily: F.display, fontWeight: 700, fontSize: 28, opacity: status, transform: `scale(${0.85 + 0.15 * status})` }}>
          <Check size={26} strokeWidth={3} /> It worked
          <span style={{ fontFamily: MONO, fontWeight: 400, fontSize: 19, opacity: 0.8 }}>fee 0.000005 SOL</span>
        </div>
        <div style={{ minHeight: 170, padding: "24px 28px", borderRadius: 24, background: C.night, color: "#fff", fontSize: 30, lineHeight: 1.42, opacity: p(f, 206, 218) }}>
          <span style={{ display: "block", marginBottom: 8, fontFamily: MONO, fontSize: 17, letterSpacing: "0.08em", color: C.nightMuted }}>HORMAN</span>
          {typed}
          {typed.length > 0 && typed.length < STORY.length && <span style={{ display: "inline-block", width: 12, height: 30, marginLeft: 3, background: C.pale, verticalAlign: "-5px" }} />}
        </div>
      </div>

      <AbsoluteFill style={{ opacity: outro, background: "linear-gradient(180deg, #ffffff 0%, #eef3ef 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
        <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 90, letterSpacing: "-0.05em", lineHeight: 0.98 }}>Paste a signature.</div>
        <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 86, color: C.accent, lineHeight: 1 }}>Get the story.</div>
        <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 10, fontSize: 30, color: C.muted }}>
          <span style={{ width: 22, height: 22, borderRadius: 99, background: SOL }} /> Any Solana transaction. Free.
        </div>
        <div style={{ marginTop: 22, display: "flex", alignItems: "center", gap: 14 }}>
          <Mark size={60} />
          <span style={{ fontFamily: F.mark, fontWeight: 700, fontSize: 52, letterSpacing: "-0.03em" }}>horman.dev/tx</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
