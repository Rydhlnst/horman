// Sample lookups for the Onchain demo. The addresses are made up and every number is
// a sample; the live site reads Solana for real.

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
    query: "7xKp…Wq3F",
    ask: "What did 7xKp…Wq3F do in the last 24 hours?",
    title: "Market-making cluster",
    verdict: { text: "Low risk", level: "ok" },
    metrics: [
      { label: "Linked wallets", value: "12", note: "same funder" },
      { label: "Transactions, 24h", value: "38" },
      { label: "Liquidity moved", value: "38%", note: "to a USDC pair" },
      { label: "Active for", value: "214 days" },
    ],
    checks: [
      { text: "Funded from one source, 214 days ago", level: "ok" },
      { text: "Quotes both sides of 4 Raydium and Orca pools", level: "ok" },
      { text: "Pulled 38% of one pool’s liquidity in an hour", level: "warn" },
    ],
    answer:
      "This wallet is one of 12 run by the same market maker. In the last 24 hours it pulled 38% of its liquidity from one Raydium pool and parked it in a USDC pair. That looks like routine risk-trimming, not an exit.",
  },
  {
    id: "token",
    label: "Token",
    query: "$DEMO · 4cWb…pump",
    ask: "Is the token at 4cWb…pump safe to hold?",
    title: "$DEMO, launched 9 days ago",
    verdict: { text: "Medium risk", level: "warn" },
    metrics: [
      { label: "Holders", value: "3,412" },
      { label: "Top 10 hold", value: "41%" },
      { label: "Liquidity", value: "$286K", note: "LP burned" },
      { label: "Age", value: "9 days" },
    ],
    checks: [
      { text: "Mint authority is revoked", level: "ok" },
      { text: "Freeze authority is revoked", level: "ok" },
      { text: "LP tokens are burned", level: "ok" },
      { text: "One wallet holds 9.8% of supply", level: "warn" },
      { text: "The dev wallet sold 12% in the first two days", level: "warn" },
    ],
    answer:
      "The mint itself is clean: no one can mint more or freeze your tokens, and the liquidity can’t be pulled. The risk is in who holds it. One wallet has nearly 10% and the dev wallet already sold 12%, so a few wallets can still move the price a lot.",
  },
  {
    id: "contract",
    label: "Program",
    query: "Stk9…Vb2e",
    ask: "Explain what the program at Stk9…Vb2e can do.",
    title: "Staking program with one admin key",
    verdict: { text: "High risk", level: "bad" },
    metrics: [
      { label: "Type", value: "Anchor program" },
      { label: "Fee", value: "2%", note: "admin can raise to 25%" },
      { label: "Upgradeable", value: "Yes", note: "1 upgrade authority" },
      { label: "Admin", value: "1 wallet", note: "no multisig" },
    ],
    checks: [
      { text: "withdraw takes a 2% fee on every exit", level: "warn" },
      { text: "set_fee lets the admin raise the fee to 25%", level: "bad" },
      { text: "emergency_withdraw lets the admin move every deposit", level: "bad" },
      { text: "The upgrade authority can replace the code at any time", level: "warn" },
    ],
    answer:
      "In plain words: it’s a staking pool with a 2% exit fee, but one wallet can raise that fee to 25%, move everyone’s deposits, and upgrade the program at any time, with no multisig and no delay. Treat it as high risk until those keys are given up.",
  },
];
