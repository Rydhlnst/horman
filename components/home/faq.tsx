"use client";

import { PiCpuDuotone, PiCurrencyBtcDuotone, PiImageDuotone, PiKeyDuotone, PiLockKeyDuotone, PiProhibitDuotone } from "react-icons/pi";
import { SplitAccordion, type SplitItem } from "@/components/watermelon/split-accordion";
import { FREE_LIMIT, HOLD } from "@/lib/site";

const FAQ: SplitItem[] = [
  {
    Icon: PiLockKeyDuotone,
    q: "Can Horman read my chats?",
    a: "In Sealed mode, no. Your prompt is encrypted to an attested enclave on your device and the answer comes back encrypted to you. In Ephemeral mode, requests are processed in memory and nothing is stored. Open mode keeps standard logs.",
  },
  {
    Icon: PiImageDuotone,
    q: "Can Horman make images and videos?",
    a: "Yes. Describe what you want and Horman creates images, short video clips, voiceovers or music, under the same privacy modes as chat.",
  },
  {
    Icon: PiCpuDuotone,
    q: "Which AI models can I use?",
    a: `Everyone can use Auto, which picks a light open model for each question. Holders can choose any model: open-weight ones such as Llama, DeepSeek, Qwen and Kimi in every mode, and hosted ones such as GPT, Claude and Gemini in Open mode. The launch lineup may still change.`,
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
