"use client";

// Adapted from Watermelon UI "copy-confirm" (MIT, https://ui.watermelon.sh):
// the icon swaps and the label re-types itself letter by letter when copied.

import { Check, Copy } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

function Letters({ text }: { text: string }) {
  return (
    <span className="flex">
      <AnimatePresence mode="popLayout" initial={false}>
        {text.split("").map((ch, i) => (
          <motion.span
            key={text + i}
            layout
            initial={{ opacity: 0, y: 5, scale: 0.7 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 200, damping: 20, delay: 0.03 * i } }}
            exit={{ opacity: 0, y: -5, scale: 0.7 }}
          >
            {ch === " " ? " " : ch}
          </motion.span>
        ))}
      </AnimatePresence>
    </span>
  );
}

/** `label` is "Copy" at rest; anything else (Copied, Selected) shows the done state. */
export function CopyButton({ label, onClick, className = "" }: { label: string; onClick: () => void; className?: string }) {
  const done = label !== "Copy";
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      animate={{ backgroundColor: done ? "#4e6b5c" : "rgba(255,255,255,0.08)" }}
      className={`inline-flex h-9 items-center gap-1.5 overflow-hidden rounded-full px-3.5 text-[13px] font-medium text-code-fg ${className}`}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={done ? "done" : "copy"}
          initial={{ opacity: 0, scale: 0.25 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.25 }}
          transition={{ type: "spring", duration: 0.3, bounce: 0 }}
        >
          {done ? <Check size={14} /> : <Copy size={14} />}
        </motion.span>
      </AnimatePresence>
      <Letters text={label} />
    </motion.button>
  );
}
