// Sample lookups for the Onchain demo. The addresses are made up and every number is
// a sample; the live site reads Robinhood Chain for real.

export type Level = "ok" | "warn" | "bad";

export type Lookup = {
  id: "wallet" | "token" | "contract";
  label: string;
  /** What you'd paste or ask. */
  query: string;
  ask: string;
  title: string;
  verdict: { text: string; level: Level };
  metrics: { label: string; value: string; note?: string }[];
  checks: { text: string; level: Level }[];
  answer: string;
};

export const LOOKUPS: Lookup[] = [
  {
    id: "wallet",
    label: "Wallet",
    query: "0x7a3f…e91c",
    ask: "What did 0x7a3f…e91c do in the last 24 hours?",
    title: "Market-making cluster",
    verdict: { text: "Low risk", level: "ok" },
    metrics: [
      { label: "Linked wallets", value: "12", note: "same funder" },
      { label: "Moves, 24h", value: "38" },
      { label: "Liquidity moved", value: "38%", note: "to a stable pair" },
      { label: "Active for", value: "214 days" },
    ],
    checks: [
      { text: "Funded from one source, 214 days ago", level: "ok" },
      { text: "Quotes both sides of 4 pools", level: "ok" },
      { text: "Pulled 38% of one pool’s liquidity in an hour", level: "warn" },
    ],
    answer:
      "This wallet is one of 12 run by the same market maker. In the last 24 hours it pulled 38% of its liquidity from one DEX pool and parked it in a stable pair. That looks like routine risk-trimming, not an exit.",
  },
  {
    id: "token",
    label: "Token",
    query: "$DEMO · 0x4c1d…a07b",
    ask: "Is the token at 0x4c1d…a07b safe to hold?",
    title: "$DEMO, launched 9 days ago",
    verdict: { text: "Medium risk", level: "warn" },
    metrics: [
      { label: "Holders", value: "3,412" },
      { label: "Top 10 hold", value: "41%" },
      { label: "Liquidity", value: "$286K", note: "locked 180 days" },
      { label: "Age", value: "9 days" },
    ],
    checks: [
      { text: "Contract source is verified", level: "ok" },
      { text: "Minting is turned off", level: "ok" },
      { text: "Liquidity is locked for 180 days", level: "ok" },
      { text: "One wallet holds 9.8% of supply", level: "warn" },
      { text: "The deployer sold 12% in the first two days", level: "warn" },
    ],
    answer:
      "The contract itself is clean: verified, no minting, liquidity locked. The risk is in who holds it. One wallet has nearly 10% and the deployer already sold 12%, so a few wallets can still move the price a lot.",
  },
  {
    id: "contract",
    label: "Contract",
    query: "0x91be…44d2",
    ask: "Explain what the contract at 0x91be…44d2 can do.",
    title: "Token with an owner fee switch",
    verdict: { text: "High risk", level: "bad" },
    metrics: [
      { label: "Type", value: "ERC-20" },
      { label: "Transfer tax", value: "2%", note: "owner can raise to 25%" },
      { label: "Upgradeable", value: "Yes", note: "proxy" },
      { label: "Owner", value: "1 wallet", note: "no timelock" },
    ],
    checks: [
      { text: "transfer() takes a 2% tax on every send", level: "warn" },
      { text: "setFee() lets the owner raise the tax to 25%", level: "bad" },
      { text: "blacklist() lets the owner freeze any wallet", level: "bad" },
      { text: "The code can be swapped through the proxy", level: "warn" },
    ],
    answer:
      "In plain words: it’s a normal token with a 2% tax, but one wallet can raise that tax to 25%, freeze any holder, and replace the code at any time, with no delay. Treat it as high risk until those powers are given up.",
  },
];
