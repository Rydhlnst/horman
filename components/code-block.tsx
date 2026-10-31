"use client";

import { useRef, useState } from "react";
import { CopyButton } from "@/components/watermelon/copy-button";
import { SlidingTabs } from "@/components/watermelon/sliding-tabs";

/** A dark code sheet: sliding tabs for each language and a Copy button in its top bar. */
export function CodeBlock({ tabs }: { tabs: { label: string; code: string }[] }) {
  const [index, setIndex] = useState(0);
  const [copyLabel, setCopyLabel] = useState("Copy");
  const pre = useRef<HTMLPreElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const flash = (label: string) => {
    setCopyLabel(label);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopyLabel("Copy"), 1600);
  };

  // Without clipboard access, select the code so it can be copied by hand.
  const selectCode = () => {
    if (!pre.current) return;
    const range = document.createRange();
    range.selectNodeContents(pre.current);
    const sel = getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
    flash("Selected");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(tabs[index].code);
      flash("Copied");
    } catch {
      selectCode();
    }
  };

  return (
    <div className="lift mt-8 min-w-0 overflow-hidden rounded-[22px] bg-code-bg">
      <div className="flex items-center justify-between gap-3 border-b border-white/8 p-2.5">
        {tabs.length > 1 ? (
          <SlidingTabs
            tone="dark"
            size="sm"
            label="Language"
            value={tabs[index].label}
            onChange={(id) => setIndex(tabs.findIndex((t) => t.label === id))}
            items={tabs.map((t) => ({ id: t.label, label: t.label }))}
          />
        ) : (
          <span className="px-2 text-[13px] font-medium text-[#9fb0a6]">{tabs[0].label}</span>
        )}
        <CopyButton label={copyLabel} onClick={copy} />
      </div>
      <pre ref={pre} className="m-0 overflow-x-auto p-6 font-mono text-[13px] leading-[1.7] text-code-fg">
        <code>{tabs[index].code}</code>
      </pre>
    </div>
  );
}
