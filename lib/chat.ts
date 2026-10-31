import type { ModeKey } from "@/lib/site";

export type Message =
  | { id: string; role: "user"; text: string }
  | { id: string; role: "assistant"; kind: "text"; text: string; shown: number; model?: string; error?: boolean }
  | { id: string; role: "assistant"; kind: "image"; prompt: string; ready: boolean };

export type Chat = { id: string; title: string; mode: ModeKey; messages: Message[] };

/** Saved chats (never Ephemeral ones). */
export const STORE = "horman.chats.v1";
/** One chat started in the home page hero, waiting for /chat to pick it up. Tab only. */
export const HANDOFF = "horman.handoff.v1";

export const uid = () => Math.random().toString(36).slice(2, 10);

export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
