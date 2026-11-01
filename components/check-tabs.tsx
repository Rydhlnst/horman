import Link from "next/link";

/** Switches between the two free checks: one token, or a whole wallet. */
export function CheckTabs({ active }: { active: "token" | "wallet" }) {
  const tabs = [
    { key: "token", href: "/check", label: "Token check" },
    { key: "wallet", href: "/scan", label: "Wallet scan" },
  ] as const;
  return (
    <nav aria-label="Checks" className="inline-flex gap-1 rounded-[14px] border border-line bg-surface p-1">
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
