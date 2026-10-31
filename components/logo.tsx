import { useId } from "react";

/** The Horman mark: four sage petals around a cut-out core on a dark green tile.
 *  Copied as-is from the approved design; only the gradient ids are made unique. */
export function HormanMark({ size = 30, className = "flex-none" }: { size?: number; className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const tile = `t${uid}`;
  const petal = `p${uid}`;
  const core = `m${uid}`;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <defs>
        <radialGradient id={tile} cx="0.5" cy="0.4" r="0.75">
          <stop offset="0" stopColor="#3A4D42" />
          <stop offset="1" stopColor="#1F2A24" />
        </radialGradient>
        <linearGradient id={petal} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#EEF3EF" />
          <stop offset="1" stopColor="#7E9A8A" />
        </linearGradient>
        <mask id={core}>
          <rect width="64" height="64" fill="#fff" />
          <circle cx="32" cy="32" r="5.5" fill="#000" />
        </mask>
      </defs>
      <rect width="64" height="64" rx="15" fill={`url(#${tile})`} />
      <g transform="translate(9.6 9.6) scale(0.7)">
        <g mask={`url(#${core})`}>
          <circle cx="32" cy="19" r="13" fill={`url(#${petal})`} fillOpacity="0.85" />
          <circle cx="45" cy="32" r="13" fill={`url(#${petal})`} fillOpacity="0.85" />
          <circle cx="32" cy="45" r="13" fill={`url(#${petal})`} fillOpacity="0.85" />
          <circle cx="19" cy="32" r="13" fill={`url(#${petal})`} fillOpacity="0.85" />
        </g>
      </g>
    </svg>
  );
}

export function Wordmark({ size = 30, light = false }: { size?: number; light?: boolean }) {
  return (
    <span
      className={`flex items-center gap-2.5 font-[family-name:var(--font-bricolage)] text-[22px] font-extrabold tracking-[-0.03em] ${light ? "wordmark-light" : "text-fg"}`}
    >
      <HormanMark size={size} />
      horman
    </span>
  );
}
