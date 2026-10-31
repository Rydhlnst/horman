import { Fragment, useId, useMemo, type ReactNode } from "react";
import { AGENTS } from "@/lib/agents";
import { LOOKUPS } from "@/lib/onchain";

/** Asks that should make an image even when the Chat tool is on. */
export const IMAGE_INTENT =
  /^(please\s+)?(create|make|draw|generate|paint|design)\s+(me\s+)?(an?\s+)?(image|picture|photo|illustration|drawing|poster|logo|wallpaper)/i;

const ONCHAIN = /0x[0-9a-f]|\b(wallet|token|contract|onchain|on-chain|holders?|liquidity|tx|transaction)\b/i;
const AGENT = /\b(agent|every (day|week|monday|morning)|watch|alert|brief me|remind|monitor)\b/i;

const LEVEL_WORD = { ok: "fine", warn: "worth a look", bad: "risky" } as const;

/** A sample onchain report in chat form, picked by what the question is about. */
function onchainReply(question: string) {
  const id = /contract|function|explain/i.test(question) ? "contract" : /token|holder|safe|liquidity|\$/i.test(question) ? "token" : "wallet";
  const l = LOOKUPS.find((x) => x.id === id)!;
  const facts = l.metrics.map((m) => `${m.label}: **${m.value}**${m.note ? ` (${m.note})` : ""}`).join("\n");
  const checks = l.checks.map((c) => `${c.level === "ok" ? "✓" : "!"} ${c.text} — ${LEVEL_WORD[c.level]}`).join("\n");
  return `**${l.title} · ${l.verdict.text}** (sample onchain answer)\n\n${facts}\n\n${checks}\n\n${l.answer}`;
}

/** A sample agent setup, picked by what the question asks to watch or repeat. */
function agentReply(question: string) {
  const id = /0x|wallet/i.test(question) ? "wallet" : /launch|new token/i.test(question) ? "launch" : /research|report/i.test(question) ? "research" : "brief";
  const a = AGENTS.find((x) => x.id === id)!;
  const steps = a.steps.map((s, i) => `${i + 1}. ${s}`).join("\n");
  return `**Agent ready: ${a.name}** (sample)\n\nRuns: **${a.trigger.text}**\n${steps}\n\nResults land in your Horman inbox, sealed to you. Live agents open with wave 1.`;
}

/** The preview's stand-in answer. */
export function sampleReply(question: string) {
  const asked = question.slice(0, 160);
  if (AGENT.test(question)) return agentReply(question);
  if (ONCHAIN.test(question)) return onchainReply(question);
  return `**This is a website preview.** On the live site, a real AI model answers here.\n\nYou asked: “${asked}”`;
}

function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

/** Tiny markdown: paragraphs, line breaks and **bold**. */
export function Markdown({ text }: { text: string }) {
  return (
    <div className="flex flex-col gap-3 [overflow-wrap:anywhere]">
      {text.split(/\n{2,}/).map((para, i) => (
        <p key={i}>
          {para.split("\n").map((line, j) => (
            <Fragment key={j}>
              {j > 0 && <br />}
              {inline(line)}
            </Fragment>
          ))}
        </p>
      ))}
    </div>
  );
}

// A valley at sunrise over still water. Ridges are smooth curves seeded by the
// prompt; the water mirrors them, softened, below the horizon.
const HORIZON = 252;

function drawLandscape(prompt: string) {
  let h = 7;
  for (let i = 0; i < prompt.length; i++) h = (h * 33 + prompt.charCodeAt(i)) >>> 0;
  const r = () => {
    h = (h * 1664525 + 1013904223) >>> 0;
    return h / 4294967296;
  };
  const ridge = (peak: number, amp: number, step: number) => {
    const p1 = r() * 6;
    const p2 = r() * 6;
    const pts: [number, number][] = [];
    for (let x = -40; x <= 680; x += step) {
      const y = HORIZON - peak - amp * (0.6 * Math.sin(x / 170 + p1) + 0.3 * Math.sin(x / 61 + p2) + 0.25 * (r() - 0.5));
      pts.push([x, Math.min(HORIZON, y)]);
    }
    // Quadratic curves through the midpoints keep the ridge soft.
    let d = `M-40,${HORIZON}L${pts[0][0]},${pts[0][1].toFixed(1)}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const mx = (pts[i][0] + pts[i + 1][0]) / 2;
      const my = (pts[i][1] + pts[i + 1][1]) / 2;
      d += `Q${pts[i][0]},${pts[i][1].toFixed(1)} ${mx},${my.toFixed(1)}`;
    }
    return `${d}L680,${HORIZON}Z`;
  };
  // The sun sits just clear of the tallest ridge.
  const sun = { cx: Math.round(170 + r() * 300), cy: Math.round(72 + r() * 30) };
  return { sun, far: ridge(118, 46, 36), mid: ridge(74, 30, 30), near: ridge(36, 18, 26) };
}

/** A sample landscape seeded by the prompt, so the same prompt gives the same picture. */
export function SampleImage({ prompt }: { prompt: string }) {
  const art = useMemo(() => drawLandscape(prompt), [prompt]);
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const u = (name: string) => `url(#${name}${id})`;

  const hills = (
    <>
      <path d={art.far} fill={u("far")} />
      <path d={art.mid} fill={u("mid")} />
      <path d={art.near} fill={u("near")} />
    </>
  );

  return (
    <svg viewBox="0 0 640 400" role="img" aria-label="Sample image" className="block w-full">
      <defs>
        <linearGradient id={`sky${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d7e3db" />
          <stop offset="0.5" stopColor="#e9eee3" />
          <stop offset="1" stopColor="#f7e8cc" />
        </linearGradient>
        <radialGradient id={`glow${id}`}>
          <stop offset="0" stopColor="#fdebc4" stopOpacity="0.95" />
          <stop offset="0.45" stopColor="#f8e3b8" stopOpacity="0.35" />
          <stop offset="1" stopColor="#f8e3b8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`far${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b4c6ba" />
          <stop offset="1" stopColor="#d9e2d6" />
        </linearGradient>
        <linearGradient id={`mid${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8aa394" />
          <stop offset="1" stopColor="#b3c4b6" />
        </linearGradient>
        <linearGradient id={`near${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#56735f" />
          <stop offset="1" stopColor="#6f8b78" />
        </linearGradient>
        <linearGradient id={`water${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d3dfd5" />
          <stop offset="1" stopColor="#93aa9b" />
        </linearGradient>
        <linearGradient id={`mist${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.6" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`shade${id}`} cx="0.5" cy="0.45" r="0.75">
          <stop offset="0.6" stopColor="#1f2a24" stopOpacity="0" />
          <stop offset="1" stopColor="#1f2a24" stopOpacity="0.18" />
        </radialGradient>
        <clipPath id={`below${id}`}>
          <rect y={HORIZON} width="640" height={400 - HORIZON} />
        </clipPath>
        <filter id={`soft${id}`} x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
      </defs>

      <rect width="640" height="400" fill={u("sky")} />
      <circle cx={art.sun.cx} cy={art.sun.cy} r="150" fill={u("glow")} />
      <circle cx={art.sun.cx} cy={art.sun.cy} r="30" fill="#fae4b2" />
      {hills}
      <rect y={HORIZON} width="640" height={400 - HORIZON} fill={u("water")} />
      {/* The reflection: everything above the horizon, flipped, faint and soft. */}
      <g clipPath={u("below")}>
        <g transform={`translate(0 ${HORIZON * 2}) scale(1 -1)`} opacity="0.38" filter={u("soft")}>
          <circle cx={art.sun.cx} cy={art.sun.cy} r="34" fill="#fbe8bf" />
          {hills}
        </g>
      </g>
      {[16, 34, 58, 86].map((dy, i) => (
        <rect key={dy} x={art.sun.cx - 46 + i * 9} y={HORIZON + dy} width={92 - i * 18} height="1.6" rx="0.8" fill="#fff" opacity={0.55 - i * 0.1} />
      ))}
      <rect y={HORIZON - 46} width="640" height="70" fill={u("mist")} />
      <rect width="640" height="400" fill={u("shade")} />
    </svg>
  );
}

/** A generated image in its frame, with a small caption over the corner. */
export function GeneratedImage({ prompt, className = "" }: { prompt: string; className?: string }) {
  return (
    <figure className={`gen-image ${className}`}>
      <SampleImage prompt={prompt} />
      <figcaption>Sample · 1024 × 1024</figcaption>
    </figure>
  );
}
