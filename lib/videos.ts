// Product videos made with Remotion (the `video/` folder) and rendered into
// public/videos as <id>.mp4 with an <id>.jpg poster. They show sample data.

export type ProductVideo = {
  id: string;
  /** Short name for tabs. */
  tab: string;
  kind: "Tutorial" | "How it works";
  title: string;
  text: string;
  length: string;
};

export const VIDEOS: ProductVideo[] = [
  {
    id: "getting-started",
    tab: "First chat",
    kind: "Tutorial",
    title: "Your first private chat",
    text: "Pick Sealed mode, ask in your own words, and read an answer only you can open, with a receipt of what was kept.",
    length: "0:17",
  },
  {
    id: "how-sealed-works",
    tab: "Sealed mode",
    kind: "How it works",
    title: "How a chat stays sealed",
    text: "Your device checks the enclave, encrypts the prompt, and is the only place the answer is opened. Nothing is kept.",
    length: "0:17",
  },
  {
    id: "agents-tutorial",
    tab: "Agents",
    kind: "Tutorial",
    title: "Set up an agent",
    text: "Pick a template, choose when it runs, and preview a run that ends in a brief sealed to you.",
    length: "0:17",
  },
  {
    id: "onchain-lookup",
    tab: "Onchain",
    kind: "How it works",
    title: "Ask the chain in plain words",
    text: "Paste a wallet, ask a question, and get a plain report on Robinhood Chain without anyone seeing what you looked up.",
    length: "0:17",
  },
  {
    id: "topup-tutorial",
    tab: "Top up",
    kind: "Tutorial",
    title: "Top up credit privately",
    text: "Pay in USDC, USDT or USDG on Robinhood Chain and watch it land as private vouchers that never point back to your chats.",
    length: "0:17",
  },
];

export const videoById = (id: string) => VIDEOS.find((v) => v.id === id)!;
