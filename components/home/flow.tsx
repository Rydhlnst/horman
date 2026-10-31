"use client";

import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { fadeUp, stagger } from "@/components/motion/reveal";

const CIPHER = "kQ7v2Lm9XbT0pW3eZr8cN1yHs4dJ6uFa5gVoE+/iB2tR9wKqY0nM3xC7lP8jUh=";

const STEPS = [
  {
    title: "Check the enclave",
    text: "Before anything leaves your device, your browser checks the enclave’s attestation, which proves exactly which code will handle your request.",
    detail: ["Attestation signed", "Code hash matches the published build"],
  },
  {
    title: "Encrypt on your side",
    text: "Your prompt and files are encrypted to that enclave’s key, so they travel as noise to everyone in between.",
    detail: null,
  },
  {
    title: "Work happens inside",
    text: "The model, agent or onchain engine runs in isolated memory. Horman runs the machine but cannot look into it.",
    detail: ["Isolated memory", "No operator access"],
  },
  {
    title: "Only you open the answer",
    text: "The answer comes back encrypted and is opened on your device. You get a receipt; the enclave keeps nothing.",
    detail: ["Opened on your device", "Nothing kept"],
  },
];

/** Sealed mode as a numbered ledger; once on screen the steps light up in turn. */
export function SealedFlow() {
  const box = useRef<HTMLOListElement>(null);
  const [seen, setSeen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setSeen(true);
        io.disconnect();
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setStep((s) => (s + 1) % STEPS.length), 2400);
    return () => clearInterval(t);
  }, [seen]);

  return (
    <motion.ol className="steps" ref={box} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger(0.09)}>
      {STEPS.map((s, i) => (
        <motion.li key={s.title} variants={fadeUp} className={`step ${i <= step ? "on" : ""}`} onMouseEnter={() => setStep(i)}>
          <span className="step-n">{i + 1}</span>
          <div>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </div>
          {s.detail ? (
            <ul className="step-detail">
              {s.detail.map((d) => (
                <li key={d}>
                  <Check /> {d}
                </li>
              ))}
            </ul>
          ) : (
            <div className="step-detail">
              <span className="label">What the network sees</span>
              <code className="cipher">{CIPHER}</code>
            </div>
          )}
        </motion.li>
      ))}
    </motion.ol>
  );
}
