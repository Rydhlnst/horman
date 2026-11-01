// Token safety checks built from live mint facts. They read the contract, not the team.
import type { MintFacts } from "@/lib/solana";

export type Level = "ok" | "warn" | "bad";
export type Check = { title: string; level: Level; detail: string };
export type Report = { verdict: string; level: Level; checks: Check[] };

const pct = (n: number) => `${(n * 100).toLocaleString("en-US", { maximumFractionDigits: 1 })}%`;
const short = (a: string) => `${a.slice(0, 4)}…${a.slice(-4)}`;

export function checkToken(f: MintFacts): Report {
  const checks: Check[] = [];

  checks.push(
    f.mintAuthority
      ? { title: "Mint authority is active", level: "bad", detail: `${short(f.mintAuthority)} can create more tokens at any time, which dilutes every holder.` }
      : { title: "Mint authority is revoked", level: "ok", detail: "No one can ever create more of this token." },
  );
  checks.push(
    f.freezeAuthority
      ? { title: "Freeze authority is active", level: "bad", detail: `${short(f.freezeAuthority)} can freeze any holder’s tokens so they can’t sell.` }
      : { title: "Freeze authority is revoked", level: "ok", detail: "No one can freeze your tokens." },
  );

  if (f.top10 !== null) {
    const level: Level = f.top10 > 0.6 ? "bad" : f.top10 > 0.3 ? "warn" : "ok";
    checks.push({
      title: `Largest ten accounts hold ${pct(f.top10)}`,
      level,
      detail: level === "ok" ? "Supply is spread out." : "A few accounts can move the price a lot. Some of them may be the liquidity pool or an exchange.",
    });
  }
  if (f.top1 !== null) {
    const level: Level = f.top1 > 0.25 ? "bad" : f.top1 > 0.1 ? "warn" : "ok";
    checks.push({
      title: `Largest account holds ${pct(f.top1)}`,
      level,
      detail: level === "ok" ? "No single account dominates." : "Check on Solscan whether this is the pool or one wallet.",
    });
  }

  for (const e of f.extensionData) {
    const st = e.state ?? {};
    switch (e.extension) {
      case "permanentDelegate":
        checks.push({ title: "Permanent delegate", level: "bad", detail: `${short(String(st.delegate ?? "an account"))} can move or burn tokens from any holder’s wallet.` });
        break;
      case "transferFeeConfig": {
        const fee = (st.newerTransferFee as { transferFeeBasisPoints?: number } | undefined)?.transferFeeBasisPoints ?? 0;
        if (fee > 0) checks.push({ title: `Transfer fee of ${(fee / 100).toLocaleString("en-US")}%`, level: "warn", detail: "Every transfer, including a sale, pays this fee." });
        if (st.transferFeeConfigAuthority) checks.push({ title: "Fee can be changed", level: "warn", detail: `${short(String(st.transferFeeConfigAuthority))} can raise the transfer fee later.` });
        break;
      }
      case "transferHook":
        if (st.programId) checks.push({ title: "Transfer hook", level: "warn", detail: `Every transfer runs program ${short(String(st.programId))}, which can block or change transfers.` });
        break;
      case "nonTransferable":
        checks.push({ title: "Non-transferable", level: "bad", detail: "These tokens can’t be sent or sold." });
        break;
      case "defaultAccountState":
        if (st.accountState === "frozen") checks.push({ title: "New holders start frozen", level: "bad", detail: "Fresh token accounts are frozen until someone unfreezes them." });
        break;
      case "mintCloseAuthority":
        if (st.closeAuthority) checks.push({ title: "Mint can be closed", level: "warn", detail: `${short(String(st.closeAuthority))} can close the mint account.` });
        break;
    }
  }

  const bad = checks.filter((c) => c.level === "bad").length;
  const warn = checks.filter((c) => c.level === "warn").length;
  return bad
    ? { verdict: `High risk · ${bad} serious ${bad === 1 ? "issue" : "issues"}`, level: "bad", checks }
    : warn
      ? { verdict: `Some risks · ${warn} to look at`, level: "warn", checks }
      : { verdict: "Clean on every check", level: "ok", checks };
}
