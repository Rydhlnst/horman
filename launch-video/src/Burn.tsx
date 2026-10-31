import { ArrowRight, Flame, Wallet } from "lucide-react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, Caption, ease, F, fadeUp, Hills, Mark, window4 } from "./Launch";

// "Dev buy burned": no amounts and no CA, so it can go out as soon as the burn is done.
const EMBER = "#e2673a";
const EMBER_SOFT = "#fbe7dd";

function WalletCard({ u, frame, square }: { u: number; frame: number; square: boolean }) {
  // The bag drains while it moves to the burn.
  const left = interpolate(frame, [120, 172], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  return (
    <div
      style={{
        width: (square ? 820 : 560) * u,
        display: "flex",
        flexDirection: "column",
        gap: 20 * u,
        padding: 36 * u,
        borderRadius: 30 * u,
        background: "#fff",
        border: `${1.5 * u}px solid ${C.line}`,
        boxShadow: `0 ${24 * u}px ${54 * u}px -${28 * u}px rgba(20,30,25,0.4)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 * u }}>
        <span style={{ display: "grid", placeItems: "center", width: 64 * u, height: 64 * u, borderRadius: 18 * u, background: C.mist, color: C.accent }}>
          <Wallet size={34 * u} />
        </span>
        <span style={{ fontFamily: F.display, fontWeight: 700, fontSize: 46 * u, letterSpacing: "-0.03em", color: C.fg }}>Dev buy</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 * u }}>
        <Mark size={44 * u} />
        <span style={{ fontFamily: F.body, fontWeight: 600, fontSize: 34 * u, color: C.fg }}>$HORMAN</span>
        <span style={{ marginLeft: "auto", fontFamily: F.body, fontWeight: 500, fontSize: 28 * u, color: left > 0.02 ? C.muted : EMBER }}>
          {left > 0.02 ? "Held" : "Burned"}
        </span>
      </div>
      <div style={{ height: 18 * u, borderRadius: 999, background: C.mist, overflow: "hidden" }}>
        <div style={{ width: `${left * 100}%`, height: "100%", borderRadius: 999, background: `linear-gradient(90deg, ${C.accent}, #7e9a8a)` }} />
      </div>
    </div>
  );
}

function BurnCard({ u, frame, fps, square }: { u: number; frame: number; fps: number; square: boolean }) {
  const lit = interpolate(frame, [124, 150], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flicker = 1 + Math.sin(frame / 3) * 0.04 * lit;
  const stamp = spring({ frame: frame - 176, fps, config: { damping: 11, stiffness: 160 } });
  return (
    <div
      style={{
        position: "relative",
        width: (square ? 820 : 460) * u,
        display: "flex",
        flexDirection: square ? "row" : "column",
        alignItems: "center",
        justifyContent: "center",
        gap: (square ? 26 : 18) * u,
        padding: 36 * u,
        borderRadius: 30 * u,
        background: `color-mix(in srgb, ${EMBER_SOFT} ${lit * 100}%, #ffffff)`,
        border: `${1.5 * u}px solid ${lit > 0.5 ? "#f2c3ad" : C.line}`,
        boxShadow: `0 ${24 * u}px ${54 * u}px -${28 * u}px rgba(120,50,20,${0.15 + 0.25 * lit})`,
      }}
    >
      <span
        style={{
          display: "grid",
          placeItems: "center",
          width: 104 * u,
          height: 104 * u,
          borderRadius: 30 * u,
          background: lit > 0.05 ? EMBER : C.mist,
          color: lit > 0.05 ? "#fff" : C.accent,
          transform: `scale(${flicker})`,
          boxShadow: `0 0 ${60 * lit * u}px ${10 * lit * u}px rgba(226,103,58,0.35)`,
        }}
      >
        <Flame size={56 * u} />
      </span>
      <span style={{ fontFamily: F.display, fontWeight: 700, fontSize: 46 * u, letterSpacing: "-0.03em", color: C.fg }}>Burned</span>
      <span
        style={{
          position: "absolute",
          top: -22 * u,
          right: -18 * u,
          padding: `${10 * u}px ${22 * u}px`,
          borderRadius: 999,
          background: C.ink,
          color: "#fff",
          fontFamily: F.body,
          fontWeight: 600,
          fontSize: 26 * u,
          opacity: Math.min(1, stamp * 1.4),
          transform: `rotate(${(1 - stamp) * 12 + 4}deg) scale(${0.6 + 0.4 * stamp})`,
        }}
      >
        Burned for good
      </span>
    </div>
  );
}

/** Small tokens that travel from the dev buy into the burn. */
function Flow({ u, frame, square }: { u: number; frame: number; square: boolean }) {
  const len = (square ? 120 : 200) * u;
  return (
    <div style={{ position: "relative", width: square ? 120 * u : len, height: square ? len : 120 * u, display: "grid", placeItems: "center", color: C.muted }}>
      <ArrowRight size={54 * u} style={{ transform: square ? "rotate(90deg)" : undefined, opacity: 0.35 }} />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const t = (frame - 118 - i * 8) / 26;
        if (t < 0 || t > 1) return null;
        const p = ease(t);
        const size = 30 * u * (1 - 0.5 * p);
        return (
          <span
            key={i}
            style={{
              position: "absolute",
              left: square ? `calc(50% - ${size / 2}px)` : -40 * u + p * (len + 40 * u),
              top: square ? -40 * u + p * (len + 40 * u) : `calc(50% - ${size / 2}px)`,
              width: size,
              height: size,
              borderRadius: 999,
              background: `linear-gradient(135deg, #7e9a8a, ${EMBER})`,
              opacity: 1 - p * 0.6,
            }}
          />
        );
      })}
    </div>
  );
}

export function Burn() {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const square = width / height < 1.2;
  const u = height / 1080;

  // 30 fps, 10 s.
  const head = window4(frame, 0, 1, 92, 106);
  const show = window4(frame, 96, 110, 236, 250);
  const outro = interpolate(frame, [238, 254], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #f4f7f5 0%, #ffffff 55%, #eef3ef 100%)", overflow: "hidden" }}>
      <Hills frame={frame} />

      {/* 1. The news */}
      <AbsoluteFill style={{ opacity: head, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 36 * u, paddingBottom: 90 * u }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 * u, ...fadeUp(frame, 4) }}>
          <Mark size={56 * u} />
          <span style={{ fontFamily: F.body, fontWeight: 600, fontSize: 36 * u, color: C.fg }}>$HORMAN update</span>
        </div>
        <div style={{ textAlign: "center", lineHeight: 0.95 }}>
          <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: (square ? 200 : 240) * u, letterSpacing: "-0.055em", color: C.fg, ...fadeUp(frame, 12, 20, 40) }}>
            Dev buy
          </div>
          <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: (square ? 170 : 200) * u, color: EMBER, marginTop: 4 * u, ...fadeUp(frame, 28, 20, 30) }}>
            burned.
          </div>
        </div>
      </AbsoluteFill>

      {/* 2. Where it went */}
      <AbsoluteFill style={{ opacity: show, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 50 * u, paddingBottom: 150 * u }}>
        <div style={{ textAlign: "center", ...fadeUp(frame, 100) }}>
          <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: (square ? 76 : 88) * u, letterSpacing: "-0.045em", color: C.fg, lineHeight: 1 }}>Out of supply.</div>
          <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: (square ? 72 : 84) * u, color: C.fg, lineHeight: 1.02 }}>For good.</div>
        </div>
        <div style={{ display: "flex", flexDirection: square ? "column" : "row", alignItems: "center", gap: (square ? 6 : 26) * u, ...fadeUp(frame, 108, 18, 24) }}>
          <WalletCard u={u} frame={frame} square={square} />
          <Flow u={u} frame={frame} square={square} />
          <BurnCard u={u} frame={frame} fps={fps} square={square} />
        </div>
      </AbsoluteFill>
      {show > 0 && (
        <div style={{ opacity: show }}>
          <Caption n={1} text="The dev buy is burned, on-chain" u={u} frame={frame} start={150} />
        </div>
      )}

      {/* 3. Outro */}
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
        <div style={{ display: "flex", alignItems: "center", gap: 20 * u, ...fadeUp(frame, 246) }}>
          <Mark size={84 * u} />
          <span style={{ fontFamily: F.mark, fontWeight: 700, fontSize: 76 * u, letterSpacing: "-0.035em" }}>horman</span>
        </div>
        <div style={{ textAlign: "center", ...fadeUp(frame, 252) }}>
          <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 92 * u, letterSpacing: "-0.045em", lineHeight: 1 }}>Dev buy burned.</div>
          <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 84 * u, color: C.pale, lineHeight: 1.05 }}>Check it on Solscan.</div>
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
            ...fadeUp(frame, 262),
          }}
        >
          horman.dev
        </div>
        <div style={{ fontFamily: F.body, fontSize: 32 * u, color: C.pale, ...fadeUp(frame, 270, 16, 12) }}>Only trust the CA on horman.dev and @hormandotdev</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
