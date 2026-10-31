"use client";

import { MotionConfig } from "motion/react";

/** Springs and slides stand still for anyone who has reduced motion on; fades still run. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
