import { ArrowRight, Check, Lock, Smartphone, X as XIcon } from "lucide-react";
import { SiSolana } from "react-icons/si";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CA } from "./HowTo";
import { C, ease, F, Mark, SOL } from "./Launch";

// Second tweet series: ten clips that share colours and type, and nothing else.
const MONO = "'IBM Plex Mono', ui-monospace, monospace";
const EMBER = "#e2673a";
const MINT = "#cfe9dc";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const p = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
const up = (f: number, a: number, d = 16, dist = 24) => ({ opacity: p(f, a, a + d), transform: `translateY(${(1 - p(f, a, a + d)) * dist}px)` });
const typed = (text: string, f: number, start: number, cps = 1.6) => text.slice(0, Math.max(0, Math.floor((f - start) * cps)));
const rand = (i: number) => {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

/* 1 (9:16). The questions you'd never type into a normal AI. */
export function V1Private() {
  const f = useCurrentFrame();
  const qs = ["Is this mole something to worry about?", "How do I ask for a raise without burning the bridge?", "Can I afford to quit my job this year?"];
  const slot = 62;
  return (
    <AbsoluteFill style={{ background: "#0b100d", color: "#fff", padding: 90 }}>
      <div style={{ fontFamily: MONO, fontSize: 30, color: C.nightMuted, letterSpacing: "0.12em", ...up(f, 2) }}>3:12 AM</div>
      <div style={{ marginTop: 22, fontFamily: F.display, fontWeight: 800, fontSize: 104, lineHeight: 0.98, letterSpacing: "-0.05em", ...up(f, 8) }}>
        The questions you’d never type
      </div>
      <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 100, color: C.pale, ...up(f, 16) }}>into a normal AI.</div>
      <div style={{ position: "relative", marginTop: 90, height: 760 }}>
        {qs.map((q, i) => {
          const start = 40 + i * slot;
          const done = start + q.length / 1.6;
          const sealed = p(f, done + 8, done + 22);
          const y = i * 230;
          return (
            <div key={q} style={{ position: "absolute", left: 0, right: 0, top: y, opacity: f >= start ? 1 : 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 24, padding: "34px 36px", borderRadius: 34, background: `rgba(201,215,205,${0.08 + 0.06 * sealed})`, border: `2px solid rgba(201,215,205,${0.18 + 0.4 * sealed})` }}>
                <span style={{ flex: 1, fontFamily: F.body, fontSize: 46, lineHeight: 1.25, color: "#fff" }}>
                  {typed(q, f, start)}
                  {f < done && <span style={{ opacity: Math.floor(f / 8) % 2 ? 1 : 0 }}>|</span>}
                </span>
                <span style={{ flex: "none", display: "grid", placeItems: "center", width: 84, height: 84, borderRadius: 24, background: MINT, color: "#0f5a40", opacity: sealed, transform: `scale(${0.5 + 0.5 * sealed})` }}>
                  <Lock size={42} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 90, right: 90, bottom: 110, ...up(f, 250) }}>
        <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 92, letterSpacing: "-0.045em" }}>Ask them here.</div>
        <div style={{ marginTop: 10, fontFamily: F.body, fontSize: 40, color: C.pale }}>Horman keeps no copy. horman.dev</div>
      </div>
    </AbsoluteFill>
  );
}

/* 2 (16:9). A terminal changelog of what shipped this week. */
export function V2Changelog() {
  const f = useCurrentFrame();
  const log = [
    ["a1f3", "Live AI chat through OpenRouter"],
    ["b7c2", "Sign in with Solana, one signature, no fee"],
    ["c9e0", "Live $HORMAN holder check"],
    ["d4a8", "Every model in every mode, with honest labels"],
    ["e2b6", "Top-ups start at $1"],
    ["f8d1", "CA live on horman.dev"],
  ];
  const cmd = "git log --oneline --since=monday";
  const stamp = spring({ frame: f - 205, fps: 30, config: { damping: 10, stiffness: 150 } });
  return (
    <AbsoluteFill style={{ background: "#e9eeea", display: "grid", placeItems: "center" }}>
      <div style={{ width: 1500, height: 840, borderRadius: 28, background: "#0f1512", boxShadow: "0 60px 120px -50px rgba(20,30,25,0.6)", overflow: "hidden", position: "relative" }}>
        <div style={{ height: 64, display: "flex", alignItems: "center", gap: 12, padding: "0 26px", background: "#161e1a" }}>
          {["#e2673a", "#e5b04a", "#5fbf8f"].map((c) => (
            <span key={c} style={{ width: 16, height: 16, borderRadius: 99, background: c }} />
          ))}
          <span style={{ marginLeft: 20, fontFamily: MONO, fontSize: 22, color: C.nightMuted }}>horman — shipped this week</span>
        </div>
        <div style={{ padding: "40px 54px", fontFamily: MONO, fontSize: 36, lineHeight: 1.75, color: "#d6e2da" }}>
          <div>
            <span style={{ color: MINT }}>horman.dev $ </span>
            {typed(cmd, f, 8, 1.4)}
            {f < 34 && <span style={{ opacity: Math.floor(f / 8) % 2 ? 1 : 0 }}>▋</span>}
          </div>
          {log.map(([h, t], i) => {
            const at = 40 + i * 24;
            return (
              <div key={h} style={{ opacity: p(f, at, at + 6), whiteSpace: "nowrap" }}>
                <span style={{ color: "#e5b04a" }}>{h}</span> {typed(t, f, at, 2.6)}
              </div>
            );
          })}
          <div style={{ opacity: p(f, 200, 206) }}>
            <span style={{ color: MINT }}>horman.dev $ </span>
            <span style={{ opacity: Math.floor(f / 8) % 2 ? 1 : 0 }}>▋</span>
          </div>
        </div>
        <div style={{ position: "absolute", right: 70, bottom: 80, padding: "14px 34px", border: `6px solid ${MINT}`, borderRadius: 18, color: MINT, fontFamily: F.display, fontWeight: 800, fontSize: 84, letterSpacing: "-0.03em", transform: `rotate(-9deg) scale(${1.8 - 0.8 * stamp})`, opacity: stamp }}>
          SHIPPED
        </div>
      </div>
    </AbsoluteFill>
  );
}

/* 3 (1:1). Ephemeral: close the tab and the chat turns to dust. */
export function V3Ephemeral() {
  const f = useCurrentFrame();
  const lines = [
    { me: true, t: "Help me plan what to say to my landlord about the deposit." },
    { me: false, t: "Start with the facts: dates, photos, and the clause in your lease. Then ask for a reply by a set date." },
  ];
  const close = 150;
  return (
    <AbsoluteFill style={{ background: "#f7f9f8", fontFamily: F.body }}>
      <div style={{ position: "absolute", left: 70, top: 70, right: 70, display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ padding: "10px 22px", borderRadius: 999, background: C.ink, color: "#fff", fontWeight: 600, fontSize: 26 }}>Ephemeral</span>
        <span style={{ fontSize: 26, color: C.muted }}>not saved anywhere</span>
        <span style={{ marginLeft: "auto", display: "grid", placeItems: "center", width: 64, height: 64, borderRadius: 18, border: `2px solid ${f > close - 14 && f < close ? C.fg : C.line}`, background: f > close - 14 && f < close ? C.mist : "#fff", color: C.fg }}>
          <XIcon size={30} />
        </span>
      </div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 190, display: "flex", flexDirection: "column", gap: 26 }}>
        {lines.map((l, li) => (
          <div key={li} style={{ alignSelf: l.me ? "flex-end" : "flex-start", maxWidth: 820, padding: "26px 32px", borderRadius: 30, background: l.me ? C.ink : "#fff", border: l.me ? "none" : `1.5px solid ${C.line}`, color: l.me ? "#fff" : C.fg, fontSize: 40, lineHeight: 1.3, opacity: p(f, 10 + li * 34, 22 + li * 34), boxShadow: l.me ? "none" : "0 20px 40px -26px rgba(20,30,25,0.35)" }}>
            {l.t.split(" ").map((word, wi, words) => (
              <span key={wi} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
                {word.split("").map((ch, ci) => {
                  const k = li * 400 + wi * 20 + ci;
                  const t = p(f, close + rand(k) * 40, close + 30 + rand(k) * 40);
                  return (
                    <span key={ci} style={{ display: "inline-block", opacity: 1 - t, transform: `translate(${t * (rand(k + 7) * 160 - 40)}px, ${-t * (60 + rand(k + 3) * 160)}px) rotate(${t * (rand(k + 5) * 120 - 60)}deg)`, filter: `blur(${t * 4}px)` }}>
                      {ch}
                    </span>
                  );
                })}
                {wi < words.length - 1 ? "\u00a0" : ""}
              </span>
            ))}
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 70, right: 70, bottom: 120, textAlign: "center" }}>
        <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 96, letterSpacing: "-0.05em", color: C.fg, ...up(f, 210) }}>Close the tab.</div>
        <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 96, color: C.fg, ...up(f, 222) }}>It’s gone.</div>
      </div>
    </AbsoluteFill>
  );
}

/* 4 (9:16). On your phone, inside your wallet's browser. */
export function V4Phone() {
  const f = useCurrentFrame();
  const screen = f < 70 ? 0 : f < 140 ? 1 : f < 210 ? 2 : 3;
  const sheet = p(f, 74, 90) - p(f, 126, 140);
  const caps = ["Open horman.dev in your wallet’s browser", "Tap Connect, sign one message", "Signed in. No fee, nothing sent.", "Ask anything, every model unlocked"];
  return (
    <AbsoluteFill style={{ background: `radial-gradient(90% 60% at 50% 40%, #dfe8e2, #f4f7f5)`, alignItems: "center" }}>
      <div style={{ marginTop: 120, textAlign: "center", ...up(f, 2) }}>
        <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 92, letterSpacing: "-0.05em", color: C.fg }}>Your phone.</div>
        <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 92, color: C.fg }}>Your wallet. Your AI.</div>
      </div>
      <div style={{ position: "relative", marginTop: 70, width: 600, height: 1180, borderRadius: 86, background: C.ink, padding: 22, boxShadow: "0 80px 120px -60px rgba(20,30,25,0.6)" }}>
        <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 66, overflow: "hidden", background: "#fff" }}>
          <div style={{ height: 120, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 18, background: "#f4f6f5", borderBottom: `1.5px solid ${C.line}` }}>
            <span style={{ padding: "10px 30px", borderRadius: 999, background: "#fff", border: `1.5px solid ${C.line}`, fontFamily: F.body, fontSize: 26, color: C.muted }}>horman.dev</span>
          </div>
          <div style={{ padding: 34, fontFamily: F.body }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Mark size={44} />
              <span style={{ fontFamily: F.mark, fontWeight: 700, fontSize: 36, color: C.fg }}>horman</span>
              <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 999, border: `1.5px solid ${C.line}`, fontSize: 22, fontWeight: 600, color: C.fg }}>
                {screen >= 2 ? <><span style={{ width: 12, height: 12, borderRadius: 99, background: "#14b88a" }} /> 7xKp…Wq3F</> : "Connect"}
              </span>
            </div>
            {screen < 3 ? (
              <div style={{ marginTop: 120, textAlign: "center" }}>
                <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 64, letterSpacing: "-0.045em", color: C.fg }}>Ask anything.</div>
                <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 60, color: C.fg }}>Keep it private.</div>
                {screen === 2 && (
                  <div style={{ marginTop: 50, display: "inline-flex", alignItems: "center", gap: 12, padding: "14px 26px", borderRadius: 999, background: MINT, color: "#0f5a40", fontWeight: 600, fontSize: 28, ...up(f, 142) }}>
                    <Check size={28} /> Holder · every model
                  </div>
                )}
              </div>
            ) : (
              <div style={{ marginTop: 50, display: "flex", flexDirection: "column", gap: 22 }}>
                <div style={{ alignSelf: "flex-end", padding: "20px 24px", borderRadius: 26, background: C.ink, color: "#fff", fontSize: 28, maxWidth: 420, ...up(f, 212) }}>Summarise this contract in 3 lines</div>
                <div style={{ padding: "20px 24px", borderRadius: 26, border: `1.5px solid ${C.line}`, color: C.fg, fontSize: 28, lineHeight: 1.35, ...up(f, 226) }}>
                  {typed("It’s a 12-month lease, rent is due on the 1st, and you need 60 days’ notice to leave.", f, 232, 2.2)}
                </div>
              </div>
            )}
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: 34, borderRadius: "40px 40px 0 0", background: "#fff", boxShadow: "0 -30px 60px -20px rgba(20,30,25,0.4)", transform: `translateY(${(1 - sheet) * 110}%)` }}>
            <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 36, color: C.fg }}>Sign message</div>
            <div style={{ marginTop: 12, fontFamily: MONO, fontSize: 20, color: C.muted, lineHeight: 1.5 }}>horman.dev wants you to sign in with your Solana account. It sends nothing and costs nothing.</div>
            <div style={{ marginTop: 22, padding: "18px 0", borderRadius: 999, background: C.ink, color: "#fff", textAlign: "center", fontFamily: F.body, fontWeight: 600, fontSize: 28, transform: `scale(${f > 118 && f < 126 ? 0.96 : 1})` }}>Sign</div>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 80, left: 60, right: 60, display: "flex", justifyContent: "center" }}>
        <div key={screen} style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "16px 30px", borderRadius: 999, background: C.ink, color: "#fff", fontFamily: F.body, fontWeight: 500, fontSize: 34, ...up(f, [0, 70, 140, 210][screen] + 2, 10, 12) }}>
          <Smartphone size={30} /> {caps[screen]}
        </div>
      </div>
    </AbsoluteFill>
  );
}

/* 5 (16:9). A manifesto in hard cuts. */
export function V5Manifesto() {
  const f = useCurrentFrame();
  const beats: [string, boolean][] = [
    ["Your questions.", false],
    ["Your data.", true],
    ["Your keys.", false],
    ["Not ours.", true],
  ];
  const b = Math.floor(f / 28);
  if (b < beats.length) {
    const [word, dark] = beats[b];
    const lf = f - b * 28;
    return (
      <AbsoluteFill style={{ background: dark ? C.ink : "#f4f7f5", display: "grid", placeItems: "center" }}>
        <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 250, letterSpacing: "-0.06em", color: dark ? "#fff" : C.fg, transform: `scale(${1.08 - 0.08 * p(lf, 0, 10)})`, opacity: p(lf, 0, 4) }}>{word}</div>
      </AbsoluteFill>
    );
  }
  const lf = f - beats.length * 28;
  return (
    <AbsoluteFill style={{ background: C.ink, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 40 }}>
      <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 150, color: C.pale, ...up(lf, 4, 18, 30) }}>That’s the whole idea.</div>
      <div style={{ display: "flex", alignItems: "center", gap: 22, ...up(lf, 40) }}>
        <Mark size={96} />
        <span style={{ fontFamily: F.mark, fontWeight: 700, fontSize: 92, letterSpacing: "-0.035em", color: "#fff" }}>horman</span>
      </div>
      <div style={{ fontFamily: MONO, fontSize: 30, color: C.nightMuted, ...up(lf, 60) }}>private AI · live on Solana · horman.dev</div>
    </AbsoluteFill>
  );
}

/* 6 (1:1). Many AI apps vs Horman, row by row. */
export function V6Compare() {
  const f = useCurrentFrame();
  const rows = [
    ["Account and email", "A wallet signature"],
    ["Chats kept on their servers", "Nothing stored by Horman"],
    ["One house model", "Claude, GPT, Gemini and more"],
    ["Card and billing address", "USDC on Solana, coming soon"],
  ];
  const glow = p(f, 200, 230);
  return (
    <AbsoluteFill style={{ background: "#fff", fontFamily: F.body }}>
      <div style={{ display: "flex", height: "100%" }}>
        <div style={{ flex: 1, background: "#eef0ef", padding: "70px 44px" }}>
          <div style={{ fontFamily: MONO, fontSize: 24, color: C.muted, letterSpacing: "0.1em" }}>MANY AI APPS</div>
        </div>
        <div style={{ flex: 1, background: `color-mix(in srgb, #dfeee6 ${glow * 100}%, #f4f7f5)`, padding: "70px 44px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Mark size={40} />
            <span style={{ fontFamily: F.mark, fontWeight: 700, fontSize: 36, color: C.fg }}>horman</span>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 190, display: "flex", flexDirection: "column", gap: 28 }}>
        {rows.map(([a, b], i) => {
          const s = 20 + i * 42;
          const strike = p(f, s + 14, s + 26);
          return (
            <div key={a} style={{ display: "flex" }}>
              <div style={{ flex: 1, padding: "0 44px", ...up(f, s) }}>
                <div style={{ fontSize: 38, lineHeight: 1.2, color: `rgba(77,85,80,${1 - 0.45 * strike})`, textDecoration: "line-through", textDecorationThickness: 4, textDecorationColor: `rgba(226,103,58,${strike})` }}>{a}</div>
              </div>
              <div style={{ flex: 1, padding: "0 44px", display: "flex", alignItems: "center", gap: 14, ...up(f, s + 20) }}>
                <span style={{ flex: "none", display: "grid", placeItems: "center", width: 46, height: 46, borderRadius: 14, background: MINT, color: "#0f5a40" }}>
                  <Check size={26} strokeWidth={3} />
                </span>
                <span style={{ fontFamily: F.display, fontWeight: 700, fontSize: 38, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.fg }}>{b}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 540, right: 44, bottom: 80, ...up(f, 214) }}>
        <div style={{ display: "inline-flex", padding: "16px 36px", borderRadius: 999, background: C.ink, color: "#fff", fontFamily: F.display, fontWeight: 700, fontSize: 40 }}>horman.dev</div>
      </div>
    </AbsoluteFill>
  );
}

/* 7 (1:1). Ask the community what ships next. */
export function V7Vote() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opts = [
    ["A", "Onchain lookups"],
    ["B", "Agents that watch wallets"],
    ["C", "Image models"],
    ["D", "Sealed enclaves"],
  ];
  const hover = Math.floor(Math.max(0, f - 120) / 22) % 4;
  return (
    <AbsoluteFill style={{ background: C.ink, padding: 80, color: "#fff" }}>
      <div style={{ fontFamily: MONO, fontSize: 28, color: C.nightMuted, letterSpacing: "0.12em", ...up(f, 2) }}>YOU DECIDE</div>
      <div style={{ marginTop: 16, fontFamily: F.display, fontWeight: 800, fontSize: 96, lineHeight: 0.98, letterSpacing: "-0.05em", ...up(f, 8) }}>What should</div>
      <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 96, color: C.pale, ...up(f, 14) }}>we ship next?</div>
      <div style={{ marginTop: 60, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {opts.map(([k, t], i) => {
          const s = spring({ frame: f - (36 + i * 10), fps, config: { damping: 12, stiffness: 140 } });
          const on = f > 120 && hover === i;
          return (
            <div key={k} style={{ height: 230, padding: 32, borderRadius: 32, background: on ? MINT : "rgba(201,215,205,0.08)", border: `2px solid ${on ? MINT : "rgba(201,215,205,0.25)"}`, color: on ? C.ink : "#fff", transform: `scale(${(0.6 + 0.4 * s) * (on ? 1.03 : 1)})`, opacity: s, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <span style={{ fontFamily: F.display, fontWeight: 800, fontSize: 70 }}>{k}</span>
              <span style={{ fontFamily: F.display, fontWeight: 700, fontSize: 40, lineHeight: 1.1, letterSpacing: "-0.02em" }}>{t}</span>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 80, right: 80, bottom: 80, fontFamily: F.body, fontSize: 38, color: C.pale, ...up(f, 100) }}>Reply with A, B, C or D.</div>
    </AbsoluteFill>
  );
}

/* 8 (16:9). A messy draft becomes the message you meant. */
export function V8Draft() {
  const f = useCurrentFrame();
  const messy = "hey so um about the invoice... i know its late, things were crazy, can u maybe give me till friday?? sorry!!";
  const clean = "Hi Sam, thanks for your patience on the invoice. I can have the full payment to you by Friday. Sorry for the delay, and I appreciate the flexibility.";
  const sweep = p(f, 70, 100);
  return (
    <AbsoluteFill style={{ background: "#f4f7f5", padding: "90px 110px", fontFamily: F.body }}>
      <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 84, letterSpacing: "-0.05em", color: C.fg, ...up(f, 2) }}>
        The message you meant, <span style={{ fontFamily: F.serif, fontStyle: "italic", fontWeight: 400 }}>from the one you typed.</span>
      </div>
      <div style={{ marginTop: 70, display: "flex", alignItems: "center", gap: 50 }}>
        <div style={{ flex: 1, height: 520, padding: 44, borderRadius: 32, background: "#fffdf6", border: "2px dashed #d9cfb0", opacity: up(f, 14).opacity, transform: `${up(f, 14).transform} rotate(-1.5deg)` }}>
          <div style={{ fontFamily: MONO, fontSize: 22, color: "#a08a4a", marginBottom: 18 }}>YOUR DRAFT</div>
          <div style={{ fontFamily: MONO, fontSize: 34, lineHeight: 1.55, color: "#5b5340" }}>{messy}</div>
        </div>
        <div style={{ flex: "none", display: "grid", placeItems: "center", width: 110, height: 110, borderRadius: 999, background: C.ink, color: "#fff", transform: `translateX(${(sweep - 0.5) * 30}px) scale(${0.8 + 0.2 * sweep})`, boxShadow: `0 0 ${50 * sweep}px rgba(78,107,92,0.6)` }}>
          <Mark size={70} />
        </div>
        <div style={{ flex: 1, height: 520, padding: 44, borderRadius: 32, background: "#fff", border: `2px solid ${C.line}`, boxShadow: "0 40px 80px -46px rgba(20,30,25,0.5)", opacity: p(f, 96, 110) }}>
          <div style={{ fontFamily: MONO, fontSize: 22, color: C.accent, marginBottom: 18 }}>WITH HORMAN</div>
          <div style={{ fontSize: 40, lineHeight: 1.45, color: C.fg }}>{typed(clean, f, 106, 1.9)}</div>
        </div>
      </div>
      <div style={{ position: "absolute", right: 110, bottom: 70, display: "flex", alignItems: "center", gap: 14, fontFamily: MONO, fontSize: 26, color: C.muted, ...up(f, 196) }}>
        example · horman.dev <ArrowRight size={26} />
      </div>
    </AbsoluteFill>
  );
}

/* 9 (1:1). Your wallet is your membership card. */
export function V9Card() {
  const f = useCurrentFrame();
  const flip = p(f, 130, 170) * 180;
  const sheen = ((f * 9) % 1400) - 300;
  const face = (back: boolean): React.CSSProperties => ({
    position: "absolute",
    inset: 0,
    borderRadius: 40,
    padding: 50,
    backfaceVisibility: "hidden",
    transform: back ? "rotateY(180deg)" : undefined,
    background: back ? "linear-gradient(135deg, #1a231e, #0e1411)" : `linear-gradient(135deg, #2b3a32 0%, #1a231e 45%, #3b2a5c 100%)`,
    color: "#fff",
    overflow: "hidden",
    boxShadow: "0 60px 100px -50px rgba(0,0,0,0.6)",
  });
  return (
    <AbsoluteFill style={{ background: `radial-gradient(80% 70% at 50% 40%, #dfe8e2, #f4f7f5)`, alignItems: "center" }}>
      <div style={{ marginTop: 90, textAlign: "center", ...up(f, 2) }}>
        <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 84, letterSpacing: "-0.05em", color: C.fg }}>Your wallet is your</div>
        <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 84, color: C.fg }}>membership card.</div>
      </div>
      <div style={{ marginTop: 80, width: 820, height: 500, perspective: 2000, ...up(f, 16, 20, 40) }}>
        <div style={{ position: "relative", width: "100%", height: "100%", transformStyle: "preserve-3d", transform: `rotateY(${flip}deg) rotateX(${Math.sin(f / 30) * 4}deg)` }}>
          <div style={face(false)}>
            <div style={{ position: "absolute", top: 0, bottom: 0, left: sheen, width: 160, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)", transform: "skewX(-20deg)" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Mark size={60} />
              <span style={{ fontFamily: F.mark, fontWeight: 700, fontSize: 52 }}>horman</span>
              <span style={{ marginLeft: "auto", display: "grid", placeItems: "center", width: 64, height: 64, borderRadius: 18, background: SOL }}>
                <SiSolana size={34} />
              </span>
            </div>
            <div style={{ position: "absolute", left: 50, bottom: 120, fontFamily: MONO, fontSize: 40, letterSpacing: "0.08em" }}>7xKp ···· ···· Wq3F</div>
            <div style={{ position: "absolute", left: 50, bottom: 56, fontFamily: MONO, fontSize: 24, color: C.nightMuted, letterSpacing: "0.16em" }}>$HORMAN HOLDER</div>
          </div>
          <div style={face(true)}>
            <div style={{ fontFamily: MONO, fontSize: 24, color: C.nightMuted, letterSpacing: "0.14em" }}>UNLOCKS</div>
            <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 20 }}>
              {["Every model", "Every mode", "Checked live on Solana"].map((t) => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: F.display, fontWeight: 700, fontSize: 46 }}>
                  <Check size={38} color={MINT} strokeWidth={3} /> {t}
                </div>
              ))}
            </div>
            <div style={{ position: "absolute", left: 50, bottom: 50, fontFamily: MONO, fontSize: 18, color: C.nightMuted }}>CA {CA}</div>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 90, fontFamily: F.body, fontSize: 36, color: C.muted, ...up(f, 190) }}>No card to order. Just hold $HORMAN.</div>
    </AbsoluteFill>
  );
}

/* 10 (1:1). Ask in your language; the answer comes back in it. */
export function V10Languages() {
  const f = useCurrentFrame();
  const qa = [
    ["English", "What is Solana?", "A fast blockchain with very low fees."],
    ["Español", "¿Qué es Solana?", "Una blockchain rápida y de muy bajo costo."],
    ["Français", "C’est quoi Solana ?", "Une blockchain rapide aux frais très bas."],
    ["Deutsch", "Was ist Solana?", "Eine schnelle Blockchain mit sehr niedrigen Gebühren."],
    ["Português", "O que é Solana?", "Uma blockchain rápida e de taxas muito baixas."],
    ["Italiano", "Cos’è Solana?", "Una blockchain veloce con commissioni bassissime."],
  ];
  const idx = Math.min(qa.length - 1, Math.floor(f / 34));
  const lf = f - idx * 34;
  const [lang, q, a] = qa[idx];
  return (
    <AbsoluteFill style={{ background: "#f4f7f5", fontFamily: F.body }}>
      <div style={{ position: "absolute", left: 70, top: 70, right: 70, display: "flex", flexWrap: "wrap", gap: 12 }}>
        {qa.map(([l], i) => (
          <span key={l} style={{ padding: "10px 22px", borderRadius: 999, fontSize: 26, fontWeight: 600, background: i === idx ? C.ink : i < idx ? C.mist : "#fff", color: i === idx ? "#fff" : C.muted, border: `1.5px solid ${i === idx ? C.ink : C.line}` }}>{l}</span>
        ))}
      </div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 260, display: "flex", flexDirection: "column", gap: 26 }} key={idx}>
        <div style={{ alignSelf: "flex-end", padding: "28px 36px", borderRadius: 32, background: C.ink, color: "#fff", fontSize: 54, ...up(lf, 0, 8, 16) }}>{q}</div>
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start", ...up(lf, 8, 8, 16) }}>
          <Mark size={64} />
          <div style={{ padding: "26px 34px", borderRadius: 32, background: "#fff", border: `1.5px solid ${C.line}`, fontSize: 50, lineHeight: 1.3, color: C.fg, boxShadow: "0 24px 50px -30px rgba(20,30,25,0.4)" }}>{typed(a, lf, 10, 3.2)}</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 70, right: 70, bottom: 90 }}>
        <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 80, letterSpacing: "-0.05em", color: C.fg, ...up(f, 200) }}>Ask in your language.</div>
        <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 76, color: C.fg, ...up(f, 210) }}>Get answers in it.</div>
      </div>
    </AbsoluteFill>
  );
}

export const SERIES2 = [
  ["T01-private-questions", V1Private, 1080, 1920, 300],
  ["T02-shipped-this-week", V2Changelog, 1920, 1080, 270],
  ["T03-ephemeral", V3Ephemeral, 1080, 1080, 270],
  ["T04-on-your-phone", V4Phone, 1080, 1920, 300],
  ["T05-manifesto", V5Manifesto, 1920, 1080, 200],
  ["T06-compare", V6Compare, 1080, 1080, 260],
  ["T07-you-decide", V7Vote, 1080, 1080, 240],
  ["T08-messy-draft", V8Draft, 1920, 1080, 250],
  ["T09-membership-card", V9Card, 1080, 1080, 240],
  ["T10-any-language", V10Languages, 1080, 1080, 260],
] as const;
