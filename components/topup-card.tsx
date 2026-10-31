"use client";

import { ArrowUpRight, LockKeyhole, MessageSquare, Ticket, Wallet } from "lucide-react";
import Link from "next/link";
import { useId, useState } from "react";
import { SiRobinhood } from "react-icons/si";
import { SlidingTabs } from "@/components/watermelon/sliding-tabs";
import { TOPUP_MAX, TOPUP_MIN, TOPUP_PRESETS, TOPUP_TOKENS, type TopupToken } from "@/lib/site";

const STEPS = [
  {
    Icon: MessageSquare,
    title: "Open it from the chat",
    text: "Top up in the chat opens the payment for the chat in this browser.",
  },
  {
    Icon: Wallet,
    title: "Pay from your wallet",
    text: "Send USDC, USDT or USDG on Robinhood Chain. No card, no billing address.",
  },
  {
    Icon: Ticket,
    title: "Credit lands as private vouchers",
    text: "Your browser turns the payment into vouchers, one for each $1, so a payment never links to your chats.",
  },
];

/** How a top-up works, as three numbered petals. */
export function TopupSteps({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`folder tone-paper lined mt-0 flex flex-col gap-5 ${compact ? "p-5" : "p-8 max-[480px]:p-6"}`}>
      <span className="folder-tab">How a top-up works</span>
      <ol className="flex flex-col gap-2.5">
        {STEPS.map(({ Icon, title, text }, i) => (
          <li key={title} className="flex gap-4 rounded-[18px] bg-bg p-4">
            <span className={`grid h-11 w-11 flex-none place-items-center rounded-[14px] ${i === 2 ? "bg-accent text-white" : "bg-surface text-accent"}`}>
              <Icon size={18} />
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="label">Step {i + 1}</span>
              <b className="text-[16px] font-semibold">{title}</b>
              <span className="text-sm text-muted">{text}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/**
 * The amount picker, shaped like a voucher. On the Top up page the button sends you
 * to the chat (vouchers live in the chat's browser storage); inside the chat it pays.
 */
export function TopupVoucher({ onPay }: { onPay?: (amount: number, token: TopupToken) => void }) {
  const labelId = useId();
  const [token, setToken] = useState<TopupToken>("USDC");
  const [amount, setAmount] = useState(10);
  const [preset, setPreset] = useState<number | null>(10);
  const [custom, setCustom] = useState("");
  const [error, setError] = useState("");

  const pick = (n: number) => {
    setCustom("");
    setError("");
    setAmount(n);
    setPreset(n);
  };

  const type = (raw: string) => {
    const v = raw.replace(/[^\d.]/g, "");
    setCustom(v);
    if (!v) {
      setError("");
      return;
    }
    const n = Number(v);
    if (!Number.isFinite(n) || n < TOPUP_MIN || n > TOPUP_MAX) {
      setError(`Enter an amount from $${TOPUP_MIN} to $${TOPUP_MAX}.`);
      return;
    }
    setError("");
    setAmount(Math.round(n));
    setPreset(null);
  };

  return (
    <div className="folder tone-night mt-0">
      <span className="folder-tab">Voucher · Robinhood Chain</span>
      <div className="flex items-end justify-between gap-4 border-b-2 border-dashed border-white/15 p-7 max-[480px]:p-5">
        <div className="flex flex-col gap-1">
          <span className="label !text-night-muted">You get</span>
          <span className="font-display text-[64px] font-extrabold leading-[0.9] tracking-[-0.05em] tabular-nums">${amount}</span>
          <span className="text-sm text-night-muted">
            {amount} private voucher{amount === 1 ? "" : "s"}
          </span>
        </div>
        <Ticket size={44} className="mb-2 text-pale" strokeWidth={1.5} />
      </div>

      <dl className="flex flex-col gap-4 p-7 text-[15px] max-[480px]:p-5">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-night-muted">Network</dt>
          <dd className="flex items-center gap-2.5 font-medium">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#CCFF00] text-black" aria-hidden="true">
              <SiRobinhood size={15} />
            </span>
            Robinhood Chain
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-night-muted">Token</dt>
          <dd>
            <SlidingTabs
              kind="radio"
              tone="dark"
              size="sm"
              label="Token"
              value={token}
              onChange={(id) => setToken(id as TopupToken)}
              items={TOPUP_TOKENS.map((t) => ({ id: t, label: t }))}
            />
          </dd>
        </div>
        <div className="flex flex-col gap-3">
          <dt className="text-night-muted" id={labelId}>
            Amount
          </dt>
          <dd className="grid grid-cols-[repeat(4,minmax(0,1fr))_minmax(0,1.6fr)] gap-2 max-[480px]:grid-cols-4" role="group" aria-labelledby={labelId}>
            {TOPUP_PRESETS.map((n) => {
              const on = preset === n;
              return (
                <button
                  key={n}
                  type="button"
                  aria-pressed={on}
                  onClick={() => pick(n)}
                  className={`h-12 rounded-[14px] text-[15px] font-semibold transition ${on ? "bg-pale text-night" : "bg-night-2 text-white hover:bg-[#2f3d35]"}`}
                >
                  ${n}
                </button>
              );
            })}
            <label className="flex h-12 items-center gap-1.5 rounded-[14px] border border-white/15 px-3.5 text-sm focus-within:border-pale max-[480px]:col-span-4">
              <span className="text-night-muted">$</span>
              <span className="sr-only">Custom amount</span>
              <input
                inputMode="numeric"
                placeholder={`Any up to ${TOPUP_MAX}`}
                className="w-full min-w-0 bg-transparent text-white outline-none placeholder:text-[#7f9488] focus-visible:outline-none"
                value={custom}
                onChange={(e) => type(e.target.value)}
                aria-invalid={error ? true : undefined}
              />
            </label>
          </dd>
        </div>
        {error && <p className="text-right text-[13px] text-[#f0a49c]">{error}</p>}
      </dl>

      <div className="flex flex-col gap-4 px-7 pb-7 max-[480px]:px-5 max-[480px]:pb-5">
        {onPay ? (
          <button type="button" className="btn w-full border-pale !bg-none bg-pale text-night hover:border-white hover:bg-white" onClick={() => onPay(amount, token)}>
            <Wallet size={18} />
            Pay ${amount} in {token}
          </button>
        ) : (
          <Link className="btn w-full border-pale !bg-none bg-pale text-night hover:border-white hover:bg-white" href="/chat#topup">
            Top up ${amount} in {token} <ArrowUpRight size={17} />
          </Link>
        )}
        <p className="flex gap-2.5 text-[13px] text-night-muted">
          <LockKeyhole size={15} className="mt-0.5 flex-none" />
          Vouchers are made in your browser, so Horman never sees which payment paid for which chat.
        </p>
      </div>
    </div>
  );
}
