import type { ComponentType } from "react";

/** Any icon component: lucide (small UI marks) or react-icons Phosphor Duotone (feature icons). */
export type IconLike = ComponentType<{ size?: number | string; className?: string }>;
