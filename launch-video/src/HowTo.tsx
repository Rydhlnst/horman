import { AbsoluteFill, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, Caption, F, fadeUp, Hills, Mark } from "./Launch";

// "How to use Horman": real screen recordings of the site, framed in a browser window.
export const CA = "6W4SEuy1DEHbPKrRJNHyoAHYJ63M3JQadgAhHUv8pump";

const INTRO = 75;
const STEPS = [
  { clip: "clip1-home.mp4", frames: 262, url: "horman.dev", text: "Ask anything on horman.dev. Free, no sign-up." },
  { clip: "clip2-wallet.mp4", frames: 300, url: "horman.dev/chat", text: "Connect your Solana wallet. One signature, no fee." },
  { clip: "clip3-holder.mp4", frames: 412, url: "horman.dev/chat", text: "Holders unlock every model, like Claude in Open mode." },
  { clip: "clip4-ca.mp4", frames: 133, url: "horman.dev", text: "Copy the CA from horman.dev, nowhere else." },
];
const OUTRO = 150;
const FADE = 10;
export const HOWTO_FRAMES = INTRO + STEPS.reduce((n, s) => n + s.frames, 0) + OUTRO;

function Window({ url, u, children }: { url: string; u: number; children: React.ReactNode }) {
  const w = 1408 * u;
  const bar = 46 * u;
  return (
    <div
      style={{
        position: "absolute",
        left: (1920 * u - w) / 2,
        top: 34 * u,
        width: w,
        borderRadius: 20 * u,
        overflow: "hidden",
        background: "#fff",
        border: `${1.5 * u}px solid ${C.line}`,
        boxShadow: `0 ${40 * u}px ${80 * u}px -${40 * u}px rgba(20,30,25,0.45)`,
      }}
    >
      <div style={{ height: bar, display: "flex", alignItems: "center", gap: 10 * u, padding: `0 ${18 * u}px`, borderBottom: `${1.5 * u}px solid ${C.line}`, background: "#f7f9f8" }}>
        {["#e0e5e1", "#e0e5e1", "#e0e5e1"].map((c, i) => (
          <span key={i} style={{ width: 13 * u, height: 13 * u, borderRadius: 99, background: c }} />
        ))}
        <span
          style={{
            margin: "0 auto",
            minWidth: 420 * u,
            textAlign: "center",
            padding: `${6 * u}px ${18 * u}px`,
            borderRadius: 99,
            background: "#fff",
            border: `${1.5 * u}px solid ${C.line}`,
            fontFamily: F.body,
            fontWeight: 500,
            fontSize: 20 * u,
            color: C.muted,
          }}
        >
          {url}
        </span>
        <span style={{ width: 59 * u }} />
      </div>
      <div style={{ position: "relative", width: w, height: w * (1350 / 2160) }}>{children}</div>
    </div>
  );
}

export function HowTo() {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const u = Math.min(width / 1920, height / 1080);

  const starts = STEPS.map((_, i) => INTRO + STEPS.slice(0, i).reduce((n, s) => n + s.frames, 0));
  const outroStart = HOWTO_FRAMES - OUTRO;
  const current = Math.max(0, starts.findIndex((s, i) => frame >= s && frame < s + STEPS[i].frames));

  const introOp = interpolate(frame, [INTRO - FADE, INTRO], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const windowOp = interpolate(frame, [INTRO - FADE, INTRO, outroStart - FADE, outroStart], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const outroOp = interpolate(frame, [outroStart - FADE, outroStart + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #f4f7f5 0%, #ffffff 55%, #eef3ef 100%)", overflow: "hidden" }}>
      <Hills frame={frame} />

      {/* Intro */}
      <AbsoluteFill style={{ opacity: introOp, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 30 * u, paddingBottom: 80 * u }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 * u, ...fadeUp(frame, 2) }}>
          <Mark size={56 * u} />
          <span style={{ fontFamily: F.body, fontWeight: 600, fontSize: 36 * u, color: C.fg }}>Tutorial</span>
        </div>
        <div style={{ textAlign: "center", lineHeight: 0.98 }}>
          <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 150 * u, letterSpacing: "-0.05em", color: C.fg, ...fadeUp(frame, 8, 18, 34) }}>How to use Horman</div>
          <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 120 * u, color: C.fg, ...fadeUp(frame, 18, 18, 26) }}>in four steps.</div>
        </div>
      </AbsoluteFill>

      {/* Steps: real recordings of horman.dev */}
      <div style={{ opacity: windowOp }}>
        <Window url={STEPS[current].url} u={u}>
          {STEPS.map((s, i) => (
            <Sequence key={s.clip} from={starts[i]} durationInFrames={s.frames + FADE} layout="none">
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: interpolate(frame, [starts[i], starts[i] + FADE, starts[i] + s.frames, starts[i] + s.frames + FADE], [i === 0 ? 1 : 0, 1, 1, i === STEPS.length - 1 ? 1 : 0], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                }}
              >
                <OffthreadVideo src={staticFile(s.clip)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            </Sequence>
          ))}
        </Window>
        {STEPS.map((s, i) =>
          frame >= starts[i] && frame < starts[i] + s.frames ? (
            <div key={s.clip} style={{ position: "absolute", inset: 0, top: 20 * u }}>
              <Caption n={i + 1} text={s.text} u={u} frame={frame} start={starts[i] + 4} />
            </div>
          ) : null,
        )}
      </div>

      {/* Outro */}
      <AbsoluteFill
        style={{
          opacity: outroOp,
          background: `radial-gradient(120% 90% at 50% 30%, ${C.night} 0%, ${C.ink} 70%)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 32 * u,
          color: "#fff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 * u, ...fadeUp(frame, outroStart + 4) }}>
          <Mark size={84 * u} />
          <span style={{ fontFamily: F.mark, fontWeight: 700, fontSize: 76 * u, letterSpacing: "-0.035em" }}>horman</span>
        </div>
        <div style={{ textAlign: "center", ...fadeUp(frame, outroStart + 10) }}>
          <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 96 * u, letterSpacing: "-0.045em", lineHeight: 1 }}>Try it now.</div>
          <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 84 * u, color: C.pale, lineHeight: 1.05 }}>It’s free to start.</div>
        </div>
        <div
          style={{
            padding: `${18 * u}px ${44 * u}px`,
            borderRadius: 999,
            background: "#fff",
            color: C.ink,
            fontFamily: F.display,
            fontWeight: 700,
            fontSize: 42 * u,
            letterSpacing: "-0.02em",
            ...fadeUp(frame, outroStart + 18),
          }}
        >
          horman.dev
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 * u, padding: `${12 * u}px ${22 * u}px`, borderRadius: 16 * u, background: "rgba(255,255,255,0.08)", ...fadeUp(frame, outroStart + 26, 16, 12) }}>
          <span style={{ fontFamily: F.body, fontWeight: 600, fontSize: 26 * u, color: C.pale }}>CA</span>
          <span style={{ fontFamily: "'IBM Plex Mono', ui-monospace, monospace", fontSize: 30 * u, letterSpacing: "0.01em" }}>{CA}</span>
        </div>
        <div style={{ fontFamily: F.body, fontSize: 28 * u, color: C.pale, ...fadeUp(frame, outroStart + 32, 16, 10) }}>Only trust the CA on horman.dev and @hormandotdev</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
