import { ImageIcon, MessageSquare } from "lucide-react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, ease, F, Mark } from "./Launch";

// "Images, right in the chat": the Image tool, a prompt, and a picture developing.
// The picture is an illustration labelled "Example", not a model's output.
export const U03_FRAMES = 330;
const MONO = "'IBM Plex Mono', ui-monospace, monospace";
const MINT = "#cfe9dc";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const p = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
const up = (f: number, a: number, d = 14, dist = 20) => ({ opacity: p(f, a, a + d), transform: `translateY(${(1 - p(f, a, a + d)) * dist}px)` });

const PROMPT = "A quiet mountain lake at sunrise, in soft sage tones";

function Lake() {
  return (
    <svg viewBox="0 0 600 600" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e9efe9" />
          <stop offset="0.55" stopColor="#f6e6cf" />
          <stop offset="1" stopColor="#f2d9b8" />
        </linearGradient>
        <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b9cbbf" />
          <stop offset="1" stopColor="#6f8b7b" />
        </linearGradient>
        <radialGradient id="sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff4dc" />
          <stop offset="1" stopColor="#fbe3b8" />
        </radialGradient>
      </defs>
      <rect width="600" height="360" fill="url(#sky)" />
      <circle cx="400" cy="230" r="56" fill="url(#sun)" />
      <path d="M0 330 L90 220 L160 280 L250 170 L340 300 L430 200 L520 290 L600 240 L600 360 L0 360 Z" fill="#8fa898" />
      <path d="M0 345 L120 270 L210 330 L300 250 L390 335 L480 270 L600 330 L600 360 L0 360 Z" fill="#5f7b6c" />
      <rect y="360" width="600" height="240" fill="url(#water)" />
      <g opacity="0.45" transform="translate(0 720) scale(1 -1)">
        <path d="M0 345 L120 270 L210 330 L300 250 L390 335 L480 270 L600 330 L600 360 L0 360 Z" fill="#4e6b5c" />
      </g>
      <ellipse cx="400" cy="420" rx="70" ry="10" fill="#fff4dc" opacity="0.55" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={340 + i * 8} y={448 + i * 18} width={120 - i * 16} height="3" rx="1.5" fill="#fff" opacity={0.45 - i * 0.08} />
      ))}
    </svg>
  );
}

export function U03Images() {
  const f = useCurrentFrame();
  const tab = p(f, 34, 46);
  const typed = PROMPT.slice(0, Math.max(0, Math.floor((f - 52) * 1.7)));
  const send = f > 88;
  const card = p(f, 92, 104);
  const develop = p(f, 106, 196);
  const done = f > 198;
  const outro = p(f, 296, 310);

  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #ffffff 0%, #f6f9f7 60%, #eaf1ec 100%)", color: C.fg, fontFamily: F.body }}>
      {/* Header */}
      <div style={{ position: "absolute", left: 70, right: 70, top: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, ...up(f, 2) }}>
          <span style={{ padding: "6px 14px", borderRadius: 999, background: C.ink, color: "#fff", fontFamily: MONO, fontSize: 21, letterSpacing: "0.1em" }}>NEW</span>
          <span style={{ fontFamily: MONO, fontSize: 21, color: C.muted }}>Image creation in chat</span>
        </div>
        <div style={{ marginTop: 18, fontFamily: F.display, fontWeight: 800, fontSize: 80, lineHeight: 0.98, letterSpacing: "-0.05em", ...up(f, 8) }}>Images, right in the chat.</div>
        <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 76, lineHeight: 1.04, color: C.accent, ...up(f, 16) }}>For $HORMAN holders.</div>
      </div>

      {/* The picture */}
      <div style={{ position: "absolute", left: 230, top: 300, width: 620, height: 500, opacity: card, transform: `translateY(${(1 - card) * 24}px)` }}>
        <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 28, overflow: "hidden", background: "#e9efeb", border: `1.5px solid ${C.line}`, boxShadow: "0 40px 80px -46px rgba(20,30,25,0.55)" }}>
          <div style={{ position: "absolute", inset: 0, filter: `blur(${(1 - develop) * 26}px) saturate(${0.3 + 0.7 * develop})`, opacity: 0.25 + 0.75 * develop, transform: `scale(${1.08 - 0.08 * develop})` }}>
            <Lake />
          </div>
          <span style={{ position: "absolute", left: 16, top: 16, padding: "6px 12px", borderRadius: 999, background: "rgba(255,255,255,0.85)", fontFamily: MONO, fontSize: 17, color: C.muted }}>Example</span>
          {!done && (
            <div style={{ position: "absolute", left: 24, right: 24, bottom: 24, display: "flex", flexDirection: "column", gap: 10 }}>
              <span style={{ fontFamily: F.body, fontWeight: 600, fontSize: 24, color: C.fg }}>Creating your image…</span>
              <span style={{ height: 8, borderRadius: 99, background: "rgba(255,255,255,0.7)", overflow: "hidden" }}>
                <span style={{ display: "block", height: "100%", width: `${develop * 100}%`, background: C.accent }} />
              </span>
            </div>
          )}
          {done && (
            <span style={{ position: "absolute", left: 16, bottom: 16, padding: "8px 14px", borderRadius: 999, background: "rgba(255,255,255,0.9)", fontSize: 20, fontWeight: 600, color: C.fg, ...up(f, 200, 10, 8) }}>
              Made with Google’s Gemini image model
            </span>
          )}
        </div>
      </div>

      {/* Composer */}
      <div style={{ position: "absolute", left: 70, right: 70, bottom: 70, ...up(f, 22) }}>
        <div style={{ borderRadius: 28, background: "#fff", border: `1.5px solid ${C.line}`, boxShadow: "0 24px 50px -34px rgba(20,30,25,0.45)", padding: "20px 24px" }}>
          <div style={{ minHeight: 44, fontSize: 30, color: send ? C.muted : typed ? C.fg : C.muted }}>
            {send ? "Describe the image you want…" : typed || "Ask anything…"}
            {!send && f > 52 && <span style={{ opacity: Math.floor(f / 8) % 2 ? 1 : 0 }}>|</span>}
          </div>
          <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ position: "relative", display: "flex", padding: 4, borderRadius: 14, background: "#eef2ef" }}>
              <span style={{ position: "absolute", top: 4, bottom: 4, left: `calc(4px + ${tab} * 50%)`, width: "calc(50% - 4px)", borderRadius: 11, background: "#fff", boxShadow: "0 2px 6px rgba(20,30,25,0.12)" }} />
              <span style={{ position: "relative", display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", fontSize: 22, fontWeight: 600, color: tab < 0.5 ? C.fg : C.muted }}>
                <MessageSquare size={20} /> Chat
              </span>
              <span style={{ position: "relative", display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", fontSize: 22, fontWeight: 600, color: tab >= 0.5 ? C.fg : C.muted }}>
                <ImageIcon size={20} /> Image
              </span>
            </span>
            <span style={{ marginLeft: "auto", display: "grid", placeItems: "center", width: 56, height: 56, borderRadius: 18, background: C.ink, color: "#fff", fontSize: 28, transform: `scale(${f > 84 && f < 92 ? 0.9 : 1})` }}>↑</span>
          </div>
        </div>
        <div style={{ marginTop: 10, textAlign: "center", fontSize: 20, color: C.muted, opacity: p(f, 210, 224) }}>
          Google reads the prompt to make the image. Horman stores nothing.
        </div>
      </div>

      {/* Closing */}
      <AbsoluteFill style={{ opacity: outro, background: "linear-gradient(180deg, #ffffff 0%, #eef3ef 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
        <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 104, letterSpacing: "-0.05em", lineHeight: 0.98 }}>Describe it.</div>
        <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 104, color: C.accent, lineHeight: 1 }}>See it.</div>
        <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 14 }}>
          <Mark size={60} />
          <span style={{ fontFamily: F.mark, fontWeight: 700, fontSize: 52, letterSpacing: "-0.03em" }}>horman.dev</span>
        </div>
        <span style={{ marginTop: 6, padding: "8px 18px", borderRadius: 999, background: MINT, color: "#0f5a40", fontSize: 24, fontWeight: 600 }}>Live now for holders</span>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
