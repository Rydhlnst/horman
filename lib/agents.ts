// Sample agent templates for the Agents demo. Runs and results are samples.

export type Agent = {
  id: string;
  name: string;
  blurb: string;
  /** When it runs: a schedule or an onchain event. */
  trigger: { kind: "schedule" | "event"; text: string };
  schedules?: string[];
  steps: string[];
  result: { title: string; lines: string[] };
};

export const AGENTS: Agent[] = [
  {
    id: "brief",
    name: "Weekly market brief",
    blurb: "A one-page brief on what moved in your market, with sources.",
    trigger: { kind: "schedule", text: "Every Monday · 08:00" },
    schedules: ["Daily", "Weekly", "Monthly"],
    steps: ["Search 38 sources", "Cross-check 112 claims", "Drop anything unsourced", "Write a one-page brief"],
    result: {
      title: "Brief ready · 24 sources cited",
      lines: ["Four launches, two of them in your category", "Two price cuts from the market leader", "One new rule on stablecoin reserves"],
    },
  },
  {
    id: "wallet",
    name: "Watch a wallet",
    blurb: "Tells you the moment a wallet you follow makes a big move.",
    trigger: { kind: "event", text: "When 7xKp…Wq3F moves over $50K" },
    steps: ["Read each new slot", "Tag the counterparties", "Score the move", "Explain it in one line"],
    result: {
      title: "Alert · 14:02",
      lines: ["7xKp…Wq3F moved $412K into a USDC pair", "Counterparty: a known market-making cluster", "Read as routine risk-trimming, low risk"],
    },
  },
  {
    id: "launch",
    name: "Token launch radar",
    blurb: "Checks every new Solana token, pump.fun launches included, before you look at it.",
    trigger: { kind: "event", text: "New token with over $20K liquidity" },
    steps: ["Spot the launch", "Check mint and freeze authority", "Check holders and liquidity", "Score the risk"],
    result: {
      title: "3 new tokens today · 1 passed",
      lines: ["$DEMO: authorities revoked, LP burned, medium risk", "Two others: mint authority still live, skipped", "Full checks are in your inbox"],
    },
  },
  {
    id: "research",
    name: "Research a topic",
    blurb: "Plans the questions, reads the sources and writes the report.",
    trigger: { kind: "schedule", text: "Once · now" },
    steps: ["Plan 6 questions", "Read 40 sources", "Compare what they say", "Write the report with citations"],
    result: {
      title: "Report ready · 9 pages",
      lines: ["Answers to all 6 questions", "Where the sources disagree, and why", "31 citations you can open"],
    },
  },
];
