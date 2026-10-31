"use client";

// After Watermelon UI "newsletter-3" (MIT): a badge, a big line, and one email
// field with an arrow key, over a faint grid. Here the address is handed to the
// early-access form (in this tab only), which opens with it filled in.

import { ArrowUpRight, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const ACCESS_EMAIL = "horman.access.email";

export function NewsletterFolder() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    try {
      sessionStorage.setItem(ACCESS_EMAIL, email.trim());
    } catch {
      /* storage blocked: the form opens empty */
    }
    router.push("/access");
  };

  return (
    <div className="folder tone-paper lined newsletter-folder">
      <span className="folder-tab">Wave 1</span>
      <div className="newsletter-grid" aria-hidden="true" />
      <div className="relative mx-auto flex max-w-[620px] flex-col items-center text-center">
        <span className="newsletter-badge">Early access</span>
        <h2 className="mt-4 font-display text-[clamp(32px,4.6vw,56px)] font-extrabold leading-[1] tracking-[-0.04em]">
          Get your invite to wave 1
        </h2>
        <p className="mt-4 max-w-[46ch] text-[17px] leading-relaxed text-muted">
          Leave your email and finish a short form. We’ll send your invite, plus an API key if you build with Horman.
        </p>
        <form onSubmit={submit} className="newsletter-form" noValidate>
          <Mail size={19} className="flex-none text-faint" aria-hidden="true" />
          <label htmlFor="wave-email" className="sr-only">
            Email
          </label>
          <input
            id="wave-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "wave-error" : undefined}
          />
          <button type="submit" aria-label="Continue to early access">
            <ArrowUpRight size={20} />
          </button>
        </form>
        {error ? (
          <p id="wave-error" className="text-[14px] text-bad">
            {error}
          </p>
        ) : (
          <p className="text-[14px] text-faint">
            We only use it to send your invite.{" "}
            <Link href="/#sealed" className="font-medium text-fg underline-offset-4 hover:underline">
              See how Sealed works
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
