"use client";

// Adapted from Watermelon UI "continuous-tabs" (MIT, https://ui.watermelon.sh):
// a tactile track with one dark pill that springs to the picked item.
// Controlled here, sized for Horman, and usable as tabs or as a radio group.

import { LayoutGroup, motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { useId } from "react";

export type SlidingItem = { id: string; label: string; Icon?: LucideIcon };

type Props = {
  items: SlidingItem[];
  value: string;
  onChange: (id: string) => void;
  label: string;
  /** "tab" for tab lists, "radio" for a choice such as a privacy mode. */
  kind?: "tab" | "radio";
  size?: "sm" | "md";
  /** Stretch the items to equal widths across the track. */
  fill?: boolean;
  /** Dark track for dark surfaces such as the code block. */
  tone?: "light" | "dark";
  className?: string;
};

const SPRING = { type: "spring", stiffness: 380, damping: 30, mass: 0.9 } as const;

export function SlidingTabs({ items, value, onChange, label, kind = "tab", size = "md", fill = false, tone = "light", className = "" }: Props) {
  const group = useId();
  const sm = size === "sm";
  return (
    <LayoutGroup id={group}>
      <div
        role={kind === "tab" ? "tablist" : "radiogroup"}
        aria-label={label}
        className={`slide-track ${tone === "dark" ? "dark" : ""} ${fill ? "grid grid-flow-col auto-cols-fr" : "inline-flex"} ${className}`}
      >
        {items.map(({ id, label: text, Icon }) => {
          const on = id === value;
          return (
            <button
              key={id}
              type="button"
              role={kind}
              {...(kind === "tab" ? { "aria-selected": on } : { "aria-checked": on })}
              onClick={() => onChange(id)}
              className={`slide-item ${sm ? "sm" : ""}`}
            >
              {on && <motion.span layoutId="pill" transition={SPRING} className="slide-pill" />}
              <span className={`relative z-10 inline-flex items-center justify-center gap-1.5 ${on ? "on" : ""}`}>
                {Icon && <Icon size={sm ? 12 : 14} />}
                {text}
              </span>
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
