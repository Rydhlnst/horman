/** Where the site lives. */
export const SITE_URL = "https://horman.dev";

export type ModeKey = "sealed" | "ephemeral" | "open";

type Access = "yes" | "no";

export type Mode = {
  key: ModeKey;
  label: string;
  /** One line under the mode's name. */
  short: string;
  /** Text under the hero switch and in the empty chat. */
  hero: string;
  desc: string;
  fit: string;
  rows: [who: string, prompt: Access, answer: Access, logs: string][];
};

export const MODES: Mode[] = [
  {
    key: "sealed",
    label: "Sealed",
    short: "Private providers now, enclave next",
    hero: "Answered by open-weight models through providers that don’t keep or train on your data. Horman stores nothing. Sealed enclaves are next.",
    desc: "Today: open-weight models through providers that don’t keep or train on your data, and Horman stores nothing. Next: your prompt encrypted on your device to an attested enclave, so not even Horman can read it.",
    fit: "Best for contracts, financials, strategies and anything sensitive.",
    rows: [
      ["You", "yes", "yes", "—"],
      ["Horman", "yes", "yes", "none"],
      ["Model provider", "yes", "yes", "none"],
    ],
  },
  {
    key: "ephemeral",
    label: "Ephemeral",
    short: "Processed in memory, never stored",
    hero: "Processed in memory and wiped the moment your answer arrives. Nothing is stored, logged or used for training.",
    desc: "Requests are processed in memory and discarded as soon as the answer is sent. Nothing is stored or used for analytics.",
    fit: "Best for everyday work where speed matters and nothing should be kept.",
    rows: [
      ["You", "yes", "yes", "—"],
      ["Horman", "yes", "yes", "none"],
      ["Model provider", "yes", "yes", "none"],
    ],
  },
  {
    key: "open",
    label: "Open",
    short: "Widest model choice, lowest cost",
    hero: "The widest choice of models for public, everyday questions. Standard logs apply.",
    desc: "Gives you the widest choice of hosted models. The provider reads the request to answer it and logs may be kept for a limited time.",
    fit: "Best for public information and casual questions.",
    rows: [
      ["You", "yes", "yes", "—"],
      ["Horman", "yes", "yes", "none"],
      ["Model provider", "yes", "yes", "per provider"],
    ],
  },
];

export type NavItem = { href: string; title: string; note: string };

export const PRODUCT_MENU: NavItem[] = [
  { href: "/chat", title: "Chat", note: "Ask anything with leading models" },
  { href: "/#models", title: "Models", note: "Every model and the modes it runs in" },
  { href: "/#create", title: "Create", note: "Images, video, voice and music" },
  { href: "/agents", title: "Agents", note: "Briefs, wallet watches and launch radar" },
  { href: "/onchain", title: "Onchain", note: "Solana wallets, tokens and programs, explained" },
  { href: "/#modes", title: "Privacy modes", note: "Sealed, Ephemeral and Open" },
];

export const DEV_MENU: NavItem[] = [
  { href: "/developers#quickstart", title: "API and SDKs", note: "Chat, images and onchain in your app" },
  { href: "/developers#mcp", title: "MCP tools", note: "Plug Horman into any agent" },
  { href: "/developers#modes", title: "Privacy modes", note: "How each mode handles your data" },
  { href: "/developers", title: "Docs", note: "Guides and reference" },
];

export const TOPUP_MIN = 1;
export const TOPUP_MAX = 200;
export const TOPUP_PRESETS = [1, 5, 10, 25];
/** Top-ups are paid in USDC on Solana. */
export const TOPUP_TOKENS = ["USDC"] as const;
export type TopupToken = (typeof TOPUP_TOKENS)[number];

/** What unlocks every model: holding $HORMAN. The amount is still a placeholder. */
export const TICKER = "$HORMAN";
/** Horman on X. */
export const X_URL = "https://x.com/hormandotdev";
/** The $HORMAN mint (CA) on Solana. NEXT_PUBLIC_CA overrides it. */
export const CA_ADDRESS = "6W4SEuy1DEHbPKrRJNHyoAHYJ63M3JQadgAhHUv8pump";
export const HOLD = `[N] ${TICKER}`;
/** The $HORMAN a wallet needs for every model. null until the amount is set: then any balance counts. */
export const HOLD_MIN: number | null = null;

/** Free access (no token held) gets the free tier only, which is Auto. Holders can pick any model. */
export const FREE_LIMIT = "[N] chats a day";

/**
 * `logo` is a file in /public/models (LobeHub Icons, MIT); Auto uses the Horman mark.
 * `free` marks the free tier, open to everyone; every other model needs HOLD.
 */
export type ModelEntry = { name: string; maker: string; note: string; modes: ModeKey[]; logo?: string; free?: boolean };
export type ModelGroup = { id: string; label: string; models: ModelEntry[] };

const EVERY_MODE: ModeKey[] = ["sealed", "ephemeral", "open"];
const OPEN_ONLY: ModeKey[] = ["open"];

/**
 * Preview lineup, to be confirmed before launch. Open-weight models run inside the
 * enclave, so they work in every mode; hosted models from the big labs read the
 * request themselves, so they are offered in Open mode only.
 */
export const MODEL_GROUPS: ModelGroup[] = [
  {
    id: "chat",
    label: "Chat",
    models: [
      { name: "Auto", maker: "Horman", note: "Picks the right model for each question", modes: EVERY_MODE, free: true },
      { name: "Llama", logo: "meta-color", maker: "Meta", note: "Everyday chat and writing", modes: EVERY_MODE },
      { name: "DeepSeek", logo: "deepseek-color", maker: "DeepSeek", note: "Reasoning, maths and code", modes: EVERY_MODE },
      { name: "Qwen", logo: "qwen-color", maker: "Alibaba", note: "Many languages, long documents", modes: EVERY_MODE },
      { name: "Kimi", logo: "kimi-color", maker: "Moonshot AI", note: "Agents and tool use", modes: EVERY_MODE },
      { name: "gpt-oss", logo: "openai", maker: "OpenAI", note: "Open-weight reasoning", modes: EVERY_MODE },
      { name: "GPT", logo: "openai", maker: "OpenAI", note: "Hosted by OpenAI", modes: OPEN_ONLY },
      { name: "Claude", logo: "claude-color", maker: "Anthropic", note: "Hosted by Anthropic", modes: OPEN_ONLY },
      { name: "Gemini", logo: "gemini-color", maker: "Google", note: "Hosted by Google", modes: OPEN_ONLY },
    ],
  },
  {
    id: "image",
    label: "Image",
    models: [
      { name: "FLUX", logo: "flux", maker: "Black Forest Labs", note: "Photoreal and illustration", modes: EVERY_MODE },
      { name: "Stable Diffusion", logo: "stability-color", maker: "Stability AI", note: "Styles, edits and inpainting", modes: EVERY_MODE },
      { name: "Imagen", logo: "google-color", maker: "Google", note: "Hosted by Google", modes: OPEN_ONLY },
      { name: "GPT Image", logo: "openai", maker: "OpenAI", note: "Hosted by OpenAI", modes: OPEN_ONLY },
    ],
  },
  {
    id: "video",
    label: "Video",
    models: [
      { name: "Wan", logo: "alibaba-color", maker: "Alibaba", note: "Short clips from text or a photo", modes: EVERY_MODE },
      { name: "Veo", logo: "google-color", maker: "Google", note: "Hosted by Google", modes: OPEN_ONLY },
      { name: "Kling", logo: "kling-color", maker: "Kuaishou", note: "Hosted by Kuaishou", modes: OPEN_ONLY },
    ],
  },
  {
    id: "voice",
    label: "Voice",
    models: [
      { name: "Whisper", logo: "openai", maker: "OpenAI", note: "Speech to text, open weights", modes: EVERY_MODE },
      { name: "Fish Speech", logo: "fishaudio", maker: "Fish Audio", note: "Natural voiceovers, open weights", modes: EVERY_MODE },
      { name: "ElevenLabs", logo: "elevenlabs", maker: "ElevenLabs", note: "Hosted by ElevenLabs", modes: OPEN_ONLY },
    ],
  },
];
