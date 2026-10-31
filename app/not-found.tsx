import { ArrowUpRight, House } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Wordmark } from "@/components/logo";
import "./(site)/home.css";

export const metadata: Metadata = { title: "Page not found" };

// After Watermelon UI "error-1" (MIT): a big outlined 404 with a dashed stroke over
// a faint dotted grid, one line, one way back, here set inside a folder card.
export default function NotFound() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-10 px-4 py-16">
      <Link href="/" aria-label="Horman home" className="no-underline">
        <Wordmark size={30} />
      </Link>
      <div className="folder tone-paper lined error-folder">
        <span className="folder-tab">Error · 404</span>
        <div className="error-grid" aria-hidden="true" />
        <div className="relative flex flex-col items-center text-center">
          <svg viewBox="0 0 800 300" className="w-full max-w-[420px] select-none" aria-hidden="true">
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="error-code"
              style={{ fontSize: "20rem" }}
              strokeWidth="2"
              strokeDasharray="40 20"
            >
              404
            </text>
          </svg>
          <h1 className="mt-2 font-display text-[clamp(28px,4vw,40px)] font-extrabold tracking-[-0.03em]">This page isn’t here.</h1>
          <p className="mt-3 max-w-[40ch] text-[16px] leading-relaxed text-muted">
            The link may be old, or the page moved. Nothing you asked was kept along the way.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-2.5">
            <Link href="/" className="btn btn-ink">
              <House size={16} /> Back home
            </Link>
            <Link href="/chat" className="btn">
              Open a private chat <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
