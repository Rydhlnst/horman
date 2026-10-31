"use client";

import { PiCpuDuotone, PiCurrencyBtcDuotone, PiImageDuotone, PiKeyDuotone, PiLockKeyDuotone, PiProhibitDuotone } from "react-icons/pi";
import { SplitAccordion, type SplitItem } from "@/components/watermelon/split-accordion";
import { FREE_LIMIT, HOLD } from "@/lib/site";

const FAQ: SplitItem[] = [
  {
    Icon: PiLockKeyDuotone,
    q: "Can Horman read my chats?",
    a: "Horman doesn’t store your chats. Saved chats live only in your browser, and Ephemeral chats aren’t saved at all. Your message passes through Horman to the model: open-weight models use providers that don’t keep or train on it, and hosted models such as GPT, Claude and Gemini are read by their host. Sealed enclaves, where not even Horman could read a chat, are next.",
  },
  {
    Icon: PiImageDuotone,
    q: "Can Horman make images and videos?",
    a: "Not yet. Image, video and voice models are on the way. Until then, images in the chat are samples.",
  },
  {
    Icon: PiCpuDuotone,
    q: "Which AI models can I use?",
    a: `Everyone can use Auto, which picks a light open model for each question. Holders can choose any model in any mode: open-weight ones such as Llama, DeepSeek, Qwen and Kimi, and hosted ones such as GPT, Claude and Gemini. The launch lineup may still change.`,
  },
  {
    Icon: PiKeyDuotone,
    q: "Do I need to hold a token?",
    a: `Not to start. Without a token you get Auto for free, up to ${FREE_LIMIT}. Hold ${HOLD} in your wallet to unlock every model; use is then paid with credit, from $1.`,
  },
  {
    Icon: PiCurrencyBtcDuotone,
    q: "Do I need to know anything about crypto?",
    a: "No. Chat and Create work for any kind of question. Onchain answers are there when you need them.",
  },
  { Icon: PiProhibitDuotone, q: "Is my data used for training?", a: "No. Nothing you send through Horman is used to train models, in any mode." },
];

export function Faq() {
  return <SplitAccordion items={FAQ} />;
}
