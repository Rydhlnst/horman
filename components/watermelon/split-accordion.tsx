"use client";

// Adapted from Watermelon UI "card-split-accordian" (MIT, https://ui.watermelon.sh):
// one stacked list whose open item splits off as its own card, with spring motion.

import { ChevronDown } from "lucide-react";
import { motion, MotionConfig, type Transition } from "motion/react";
import { useId, useState } from "react";
import useMeasure from "react-use-measure";
import type { IconLike } from "@/lib/icons";

export type SplitItem = { q: string; a: string; Icon: IconLike };

const SPRING: Transition = { type: "spring", stiffness: 600, damping: 50, mass: 1 };
const R = 22;

function Item({ item, i, total, openIndex, onToggle, base }: { item: SplitItem; i: number; total: number; openIndex: number; onToggle: () => void; base: string }) {
  const [ref, bounds] = useMeasure();
  const open = i === openIndex;
  const first = i === 0;
  const last = i === total - 1;
  const beforeOpen = i === openIndex - 1;
  const afterOpen = i === openIndex + 1;

  // Corners round where the item meets a gap: its own edges when open, or the
  // edge next to the open card.
  const top = open || first || afterOpen ? R : 0;
  const bottom = open || last || beforeOpen ? R : 0;
  const { Icon } = item;

  return (
    <motion.li layout>
      <motion.div
        animate={{ borderTopLeftRadius: top, borderTopRightRadius: top, borderBottomLeftRadius: bottom, borderBottomRightRadius: bottom }}
        className={`split-card ${open ? "open" : ""}`}
        style={{
          borderTopWidth: first || afterOpen || open ? 1 : 0,
          borderBottomWidth: last || beforeOpen || open ? 1 : 0,
          marginBlock: open ? 10 : 0,
        }}
      >
        <button type="button" onClick={onToggle} aria-expanded={open} aria-controls={`${base}-${i}`} className="split-head">
          <span className="flex items-center gap-3.5">
            <span className="split-icon">
              <Icon size={18} />
            </span>
            {item.q}
          </span>
          <motion.span animate={{ rotate: open ? 180 : 0 }} className="flex-none text-faint">
            <ChevronDown size={20} />
          </motion.span>
        </button>
        <motion.div
          id={`${base}-${i}`}
          role="region"
          initial={false}
          animate={{ height: open ? bounds.height : 0, opacity: open ? 1 : 0 }}
          className="overflow-hidden"
        >
          <div ref={ref}>
            <p className="max-w-[62ch] px-5 pb-5 pl-[62px] leading-relaxed text-muted max-[480px]:pl-5">{item.a}</p>
          </div>
        </motion.div>
      </motion.div>
    </motion.li>
  );
}

export function SplitAccordion({ items }: { items: SplitItem[] }) {
  const base = useId();
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <MotionConfig transition={SPRING}>
      <ul className="w-full">
        {items.map((item, i) => (
          <Item
            key={item.q}
            item={item}
            i={i}
            total={items.length}
            openIndex={openIndex}
            base={base}
            onToggle={() => setOpenIndex((o) => (o === i ? -1 : i))}
          />
        ))}
      </ul>
    </MotionConfig>
  );
}
