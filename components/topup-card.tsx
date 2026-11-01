"use client";

import { ArrowUpRight, LockKeyhole, Ticket, Wallet } from "lucide-react";
import Link from "next/link";
import { useId, useState } from "react";
import { SiSolana, SiZcash } from "react-icons/si";
import { TOPUP_LIVE, TOPUP_MAX, TOPUP_MIN, TOPUP_PRESETS, TOPUP_TOKENS, type TopupToken } from "@/lib/site";

const STEPS = [
  {
    Icon: Wallet,
    title: "Connect your wallet",
    text: "Sign in with your Solana wallet in the chat, so the credit has a home. No card, no billing address.",
  },
  {
    Icon: SiZcash,
    title: "Pay with Zcash",
    text: "Send the exact ZEC amount shown. Payments run through NOWPayments. USDC on Solana opens soon.",
  },
  {
    Icon: Ticket,
    title: "Credit lands on your wallet",
    text: "Once the payment confirms, the credit shows up in the chat, tied to the wallet you signed in with.",
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
 * to the chat, where you're signed in; inside the chat it starts the payment.
 */
export function TopupVoucher({ onPay, zecOpen = true }: { onPay?: (amount: number, token: TopupToken) => void; zecOpen?: boolean }) {
  const labelId = useId();
  const [token, setToken] = useState<TopupToken>(TOPUP_TOKENS[0]);
  const isLive = (t: TopupToken) => TOPUP_LIVE[t] && (t !== "ZEC" || zecOpen);
  const live = isLive(token);
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
      <span className="folder-tab">Top up</span>
      <div className="flex items-end justify-between gap-4 border-b-2 border-dashed border-white/15 p-7 max-[480px]:p-5">
        <div className="flex flex-col gap-1">
          <span className="label !text-night-muted">You get</span>
          <span className="font-display text-[64px] font-extrabold leading-[0.9] tracking-[-0.05em] tabular-nums">${amount}</span>
          <span className="text-sm text-night-muted">of credit, paid in {token}</span>
        </div>
        <Ticket size={44} className="mb-2 text-pale" strokeWidth={1.5} />
      </div>

      <dl className="flex flex-col gap-4 p-7 text-[15px] max-[480px]:p-5">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-night-muted">Network</dt>
          <dd className="flex items-center gap-2.5 font-medium">
            {token === "ZEC" ? (
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F4B728] text-black" aria-hidden="true">
                <SiZcash size={15} />
              </span>
            ) : (
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#9945FF,#14F195)] text-white" aria-hidden="true">
                <SiSolana size={14} />
              </span>
            )}
            {token === "ZEC" ? "Zcash" : "Solana"}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-night-muted">Token</dt>
          <dd className="flex gap-1.5 rounded-[12px] bg-night-2 p-1" role="radiogroup" aria-label="Token">
            {TOPUP_TOKENS.map((t) => (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={token === t}
                onClick={() => setToken(t)}
                className={`flex items-center gap-1.5 rounded-[9px] px-3 py-1.5 text-[14px] font-semibold transition ${token === t ? "bg-pale text-night" : "text-white hover:bg-[#2f3d35]"}`}
              >
                {t}
                {!isLive(t) && <span className="text-[11px] font-medium opacity-70">soon</span>}
              </button>
            ))}
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
          <button
            type="button"
            disabled={!live}
            className="btn w-full border-pale !bg-none bg-pale text-night hover:border-white hover:bg-white disabled:opacity-50"
            onClick={() => onPay(amount, token)}
          >
            <Wallet size={18} />
            {live ? `Pay $${amount} in ${token}` : `${token} opens soon`}
          </button>
        ) : (
          <Link className="btn w-full border-pale !bg-none bg-pale text-night hover:border-white hover:bg-white" href="/chat#topup">
            Top up ${amount} in {token} <ArrowUpRight size={17} />
          </Link>
        )}
        <p className="flex gap-2.5 text-[13px] text-night-muted">
          <LockKeyhole size={15} className="mt-0.5 flex-none" />
          {token === "ZEC"
            ? "Paid through NOWPayments to a transparent ZEC address. The credit is tied to your signed-in wallet, never to what you ask."
            : "USDC on Solana opens soon."}
        </p>
      </div>
    </div>
  );
}
