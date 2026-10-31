"use client";

import { Bell, CalendarClock, Check, LockKeyhole, Play, RotateCcw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { PiBinocularsDuotone, PiNewspaperDuotone, PiRocketLaunchDuotone, PiWalletDuotone } from "react-icons/pi";
import { HormanMark } from "@/components/logo";
import { SlidingTabs } from "@/components/watermelon/sliding-tabs";
import { AGENTS } from "@/lib/agents";
import { reducedMotion } from "@/lib/chat";
import type { IconLike } from "@/lib/icons";

const ICONS: Record<string, IconLike> = {
  brief: PiNewspaperDuotone,
  wallet: PiWalletDuotone,
  launch: PiRocketLaunchDuotone,
  research: PiBinocularsDuotone,
};

/** Pick a template, then preview one run: the steps tick off, then the result lands. */
export function AgentDemo() {
  const [id, setId] = useState(AGENTS[0].id);
  const [schedule, setSchedule] = useState("Weekly");
  const [step, setStep] = useState(-1);
  const agent = AGENTS.find((a) => a.id === id)!;
  const running = step >= 0 && step < agent.steps.length;
  const finished = step >= agent.steps.length;

  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => setStep((s) => s + 1), reducedMotion() ? 0 : 650);
    return () => clearTimeout(t);
  }, [running, step]);

  const choose = (next: string) => {
    setId(next);
    setStep(-1);
  };

  const trigger =
    agent.id === "brief" ? { Weekly: "Every Monday · 08:00", Daily: "Every day · 08:00", Monthly: "1st of the month · 08:00" }[schedule] : agent.trigger.text;

  return (
    <div className="agent-demo">
      <ul className="agent-list" role="radiogroup" aria-label="Agent templates">
        {AGENTS.map((a) => {
          const Icon = ICONS[a.id];
          const on = a.id === id;
          return (
            <li key={a.id}>
              <button type="button" role="radio" aria-checked={on} className="agent-option" onClick={() => choose(a.id)}>
                {on && <motion.span layoutId="agent-pick" className="agent-option-bg" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                <span className="tactile-icon agent-option-icon">
                  <Icon size={20} />
                </span>
                <span className="relative flex min-w-0 flex-col text-left">
                  <b>{a.name}</b>
                  <span>{a.blurb}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="folder tone-paper lined agent-panel">
        <span className="folder-tab">Agent · sample run</span>

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-[26px] font-bold tracking-[-0.02em]">{agent.name}</h3>
            <p className="mt-1 text-[15px] text-muted">{agent.blurb}</p>
          </div>
          <span className="agent-trigger">
            {agent.trigger.kind === "schedule" ? <CalendarClock size={14} /> : <Bell size={14} />}
            {trigger}
          </span>
        </div>

        {agent.schedules && (
          <div className="mt-4">
            <SlidingTabs size="sm" kind="radio" label="How often" value={schedule} onChange={setSchedule} items={agent.schedules.map((s) => ({ id: s, label: s }))} />
          </div>
        )}

        <ol className="agent-steps" aria-live="polite">
          {agent.steps.map((s, i) => {
            const state = step > i || finished ? "done" : step === i ? "now" : "wait";
            return (
              <li key={s} className={state}>
                <span className="agent-dot">{state === "done" ? <Check size={12} /> : state === "now" ? <span className="lookup-spin" /> : i + 1}</span>
                {s}
              </li>
            );
          })}
        </ol>

        <AnimatePresence mode="wait" initial={false}>
          {finished ? (
            <motion.div
              key={`result-${id}`}
              className="agent-result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <div className="flex items-center gap-3">
                <HormanMark size={30} />
                <div className="flex flex-col">
                  <b className="text-[15px]">{agent.result.title}</b>
                  <span className="inline-flex items-center gap-1.5 text-[12.5px] text-faint">
                    <LockKeyhole size={12} /> Delivered to your inbox, sealed to you
                  </span>
                </div>
              </div>
              <ul className="mt-3 flex flex-col gap-1.5">
                {agent.result.lines.map((l) => (
                  <li key={l} className="flex items-start gap-2 text-[14.5px]">
                    <Check size={15} className="mt-0.5 flex-none text-accent" /> {l}
                  </li>
                ))}
              </ul>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="mt-5 flex flex-wrap gap-2.5">
          <button type="button" className="btn btn-ink btn-sm" onClick={() => setStep(0)} disabled={running}>
            {finished ? <RotateCcw size={15} /> : <Play size={15} />}
            {finished ? "Run again" : running ? "Running…" : "Preview a run"}
          </button>
          <span className="self-center text-[13px] text-faint">Sample run. Live agents open with wave 1.</span>
        </div>
      </div>
    </div>
  );
}
