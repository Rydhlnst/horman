"use client";

// Light motion for the whole site: things fade up a few pixels as they come into
// view, and lists arrive one item after another. With reduced motion on, the
// MotionProvider keeps the fade and drops the movement.

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

export const EASE = [0.22, 0.8, 0.24, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

export const stagger = (gap = 0.07, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});

const VIEW = { once: true, amount: 0.2 } as const;

type Tag = "div" | "section" | "li" | "ul" | "ol" | "p" | "span";

type Props = { children: ReactNode; className?: string; as?: Tag; id?: string; delay?: number };

/** One block that fades up when it scrolls into view. */
export function Reveal({ children, className, as = "div", id, delay = 0 }: Props) {
  const M = motion[as];
  return (
    <M
      id={id}
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={VIEW}
      variants={{ hidden: fadeUp.hidden, show: { ...fadeUp.show, transition: { duration: 0.55, ease: EASE, delay } } }}
    >
      {children}
    </M>
  );
}

/** A list whose items (StaggerItem) arrive one after another once it is in view. */
export function Stagger({ children, className, as = "ul", id, gap = 0.07 }: Props & { gap?: number }) {
  const M = motion[as];
  return (
    <M id={id} className={className} initial="hidden" whileInView="show" viewport={VIEW} variants={stagger(gap)}>
      {children}
    </M>
  );
}

/** `lift` raises the item a few pixels under the pointer (motion owns the transform, so CSS hovers can't). */
export function StaggerItem({ children, className, as = "li", id, lift = false }: Props & { lift?: boolean }) {
  const M = motion[as];
  return (
    <M
      id={id}
      className={className}
      variants={fadeUp}
      whileHover={lift ? { y: -3, transition: { type: "spring", stiffness: 400, damping: 28 } } : undefined}
    >
      {children}
    </M>
  );
}
