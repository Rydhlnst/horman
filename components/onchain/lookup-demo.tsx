"use client";

import { ArrowUp, Check, LockKeyhole, TriangleAlert, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { HormanMark } from "@/components/logo";
import { fadeUp, stagger } from "@/components/motion/reveal";
import { SlidingTabs } from "@/components/watermelon/sliding-tabs";
import { reducedMotion } from "@/lib/chat";
import { LOOKUPS, type Level, type Lookup } from "@/lib/onchain";

const READING = ["Reading blocks", "Tagging linked wallets", "Scoring the risk"];

function Mark({ level }: { level: Level }) {
  if (level === "ok") return <Check size={14} />;
  if (level === "warn") return <TriangleAlert size={14} />;
  return <X size={14} />;
}

/** A lookup you can switch between wallet, token and contract; each one "reads" for a moment, then reports. */
export function LookupDemo() {
  const [id, setId] = useState<Lookup["id"]>("wallet");
  const [phase, setPhase] = useState(0);
  const [run, setRun] = useState(0);
  const lookup = LOOKUPS.find((l) => l.id === id)!;
  const done = phase >= READING.length;

  // Step through the reading lines, then show the report.
  useEffect(() => {
    if (done) return;
    const t = setTimeout(() => setPhase((p) => p + 1), reducedMotion() ? 0 : 420);
    return () => clearTimeout(t);
  }, [phase, done, run]);

  const pick = (next: string) => {
    setId(next as Lookup["id"]);
    setPhase(0);
    setRun((r) => r + 1);
  };

  return (
    <div className="folder tone-paper lined lookup">
      <span className="folder-tab">Try a lookup · sample data</span>

      <div className="lookup-top">
        <SlidingTabs label="What to look up" value={id} onChange={pick} items={LOOKUPS.map((l) => ({ id: l.id, label: l.label }))} />
        <span className="lookup-chain">Robinhood Chain</span>
      </div>

      <div className="lookup-ask">
        <span className="lookup-query">{lookup.query}</span>
        <p>{lookup.ask}</p>
        <button type="button" className="send" aria-label="Ask again" onClick={() => pick(id)}>
          <ArrowUp size={18} />
        </button>
      </div>

      <div className="lookup-body" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          {!done ? (
            <motion.ul
              key={`reading-${run}`}
              className="lookup-reading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            >
              {READING.slice(0, phase + 1).map((r, i) => (
                <motion.li key={r} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}>
                  {i < phase ? <Check size={14} /> : <span className="lookup-spin" aria-hidden="true" />}
                  {r}
                </motion.li>
              ))}
            </motion.ul>
          ) : (
            <motion.div key={`report-${run}`} initial="hidden" animate="show" variants={stagger(0.06)} className="lookup-report">
              <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-display text-[24px] font-bold tracking-[-0.02em]">{lookup.title}</h3>
                <span className={`level-pill ${lookup.verdict.level}`}>
                  <Mark level={lookup.verdict.level} /> {lookup.verdict.text}
                </span>
              </motion.div>

              <motion.ul variants={fadeUp} className="lookup-metrics">
                {lookup.metrics.map((m) => (
                  <li key={m.label}>
                    <span className="label">{m.label}</span>
                    <b>{m.value}</b>
                    {m.note && <span className="text-[12.5px] text-faint">{m.note}</span>}
                  </li>
                ))}
              </motion.ul>

              <motion.ul variants={fadeUp} className="lookup-checks">
                {lookup.checks.map((c) => (
                  <li key={c.text} className={c.level}>
                    <span>
                      <Mark level={c.level} />
                    </span>
                    {c.text}
                  </li>
                ))}
              </motion.ul>

              <motion.div variants={fadeUp} className="lookup-answer">
                <HormanMark size={28} className="flex-none" />
                <div className="flex flex-col gap-2">
                  <p>{lookup.answer}</p>
                  <span className="inline-flex items-center gap-1.5 text-[12.5px] text-faint">
                    <LockKeyhole size={12} /> Sealed lookup: nobody else saw what you asked about.
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
