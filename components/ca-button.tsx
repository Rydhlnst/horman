"use client";

// The token's CA (its Solana mint address), copied in one click. It comes from the
// NEXT_PUBLIC_CA env var (set in Vercel, then redeploy); until it's set the
// button says the address is coming instead of showing a made-up one.

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";

export const CA = process.env.NEXT_PUBLIC_CA?.trim() ?? "";

const short = (ca: string) => (ca.length > 14 ? `${ca.slice(0, 6)}…${ca.slice(-4)}` : ca);

export function CaButton({ tone = "light", className = "" }: { tone?: "light" | "dark"; className?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  if (!CA) {
    return (
      <span className={`ca-btn ${tone} soon ${className}`} title="The CA (mint address) will be posted here at launch">
        <b>CA</b> Announced at launch
      </span>
    );
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CA);
    } catch {
      // Older browsers: select a hidden field and copy that.
      const field = document.createElement("textarea");
      field.value = CA;
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      field.remove();
    }
    setCopied(true);
  };

  return (
    <button type="button" className={`ca-btn ${tone} ${className}`} onClick={copy} aria-label={`Copy CA (mint address) ${CA}`} title={CA}>
      <b>CA</b>
      <span className={copied ? "" : "font-mono"} aria-live="polite">
        {copied ? "Copied" : short(CA)}
      </span>
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
}
