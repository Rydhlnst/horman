"use client";

// The ZEC payment step inside the chat: start a payment, show where and how much to send,
// and watch it until the credit lands.

import { Check, Copy, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SiZcash } from "react-icons/si";

type Started = { id: string; payAddress: string; payAmount: number; usd: number; status: string };
const DONE = new Set(["finished", "confirmed"]);
const LABEL: Record<string, string> = {
  waiting: "Waiting for your payment",
  confirming: "Payment seen, confirming on Zcash",
  confirmed: "Confirmed",
  sending: "Confirmed",
  finished: "Paid",
  partially_paid: "Partly paid: send the rest of the amount",
  expired: "This quote expired. Start a new one.",
  failed: "The payment failed. Start a new one.",
  refunded: "Refunded",
};

function CopyLine({ label, value }: { label: string; value: string }) {
  const [ok, setOk] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <span className="label !text-night-muted">{label}</span>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value);
            setOk(true);
            setTimeout(() => setOk(false), 1500);
          } catch {
            /* the value is on screen to select by hand */
          }
        }}
        className="flex items-center gap-3 rounded-[14px] bg-night-2 px-4 py-3 text-left font-mono text-[14px] text-white hover:bg-[#2f3d35]"
      >
        <span className="min-w-0 flex-1 break-all">{value}</span>
        {ok ? <Check size={16} className="flex-none text-pale" /> : <Copy size={16} className="flex-none text-pale" />}
      </button>
    </div>
  );
}

export function ZecCheckout({ amount, onBack, onPaid }: { amount: number; onBack: () => void; onPaid: (balance: number) => void }) {
  const [pay, setPay] = useState<Started | null>(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("starting");
  const paid = useRef(false);

  useEffect(() => {
    let off = false;
    fetch("/api/pay/zec", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amount }) })
      .then(async (r) => {
        const data = (await r.json().catch(() => ({}))) as Partial<Started> & { error?: string };
        if (off) return;
        if (!r.ok || !data.id) return setError(data.error ?? "The payment couldn’t be started.");
        setPay(data as Started);
        setStatus(data.status ?? "waiting");
      })
      .catch(() => !off && setError("Couldn’t reach Horman. Check your connection."));
    return () => {
      off = true;
    };
  }, [amount]);

  useEffect(() => {
    if (!pay || DONE.has(status) || ["expired", "failed", "refunded"].includes(status)) return;
    const t = setInterval(async () => {
      const r = await fetch(`/api/pay/status?id=${encodeURIComponent(pay.id)}`, { cache: "no-store" }).catch(() => null);
      const data = r ? ((await r.json().catch(() => ({}))) as { status?: string; balance?: number }) : {};
      if (data.status) setStatus(data.status);
      if (data.status && DONE.has(data.status) && !paid.current) {
        paid.current = true;
        onPaid(data.balance ?? 0);
      }
    }, 8000);
    return () => clearInterval(t);
  }, [pay, status, onPaid]);

  return (
    <div className="folder tone-night mt-0">
      <span className="folder-tab">Pay with Zcash</span>
      <div className="flex flex-col gap-5 p-7 max-[480px]:p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-[14px] bg-[#F4B728] text-black" aria-hidden="true">
            <SiZcash size={22} />
          </span>
          <div className="flex flex-col">
            <span className="font-display text-[30px] font-extrabold leading-none tracking-[-0.03em]">${amount} of credit</span>
            <span className="text-sm text-night-muted">paid in ZEC</span>
          </div>
        </div>

        {error && <p className="rounded-[12px] bg-[#3a2420] px-4 py-3 text-[14px] text-[#f0a49c]">{error}</p>}
        {!error && !pay && (
          <p className="flex items-center gap-2 text-night-muted">
            <Loader2 size={16} className="animate-spin" /> Getting a ZEC quote…
          </p>
        )}
        {pay && (
          <>
            <CopyLine label="Send exactly" value={`${pay.payAmount} ZEC`} />
            <CopyLine label="To this Zcash address" value={pay.payAddress} />
            <a href={`zcash:${pay.payAddress}?amount=${pay.payAmount}`} className="btn w-full border-pale !bg-none bg-pale text-night hover:border-white hover:bg-white">
              Open in my Zcash wallet
            </a>
            <p className={`flex items-center gap-2 text-[14px] ${DONE.has(status) ? "text-pale" : "text-night-muted"}`} role="status">
              {DONE.has(status) ? <Check size={16} /> : <Loader2 size={16} className="animate-spin" />}
              {DONE.has(status) ? `Paid. $${pay.usd} of credit added.` : (LABEL[status] ?? status)}
            </p>
            <p className="text-[13px] text-night-muted">The quote expires if no payment arrives in time. Credit lands on the wallet you’re signed in with.</p>
          </>
        )}
        <button type="button" onClick={onBack} className="self-start text-[14px] font-semibold text-pale underline underline-offset-2">
          Back
        </button>
      </div>
    </div>
  );
}
