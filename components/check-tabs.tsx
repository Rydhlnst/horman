import Link from "next/link";

/** Switches between the free checks: one token, a whole wallet, or one transaction. */
export function CheckTabs({ active }: { active: "token" | "wallet" | "tx" }) {
  const tabs = [
    { key: "token", href: "/check", label: "Token check" },
    { key: "wallet", href: "/scan", label: "Wallet scan" },
    { key: "tx", href: "/tx", label: "Transaction" },
  ] as const;
  return (
    <nav aria-label="Checks" className="inline-flex max-w-full flex-wrap gap-1 rounded-[14px] border border-line bg-surface p-1">
      {tabs.map((t) => (
        <Link
          key={t.key}
          href={t.href}
          aria-current={active === t.key ? "page" : undefined}
          className={`rounded-[10px] px-4 py-2 text-[14px] font-semibold ${active === t.key ? "bg-night text-white" : "text-muted hover:bg-raise"}`}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
