"use client";

import { useState } from "react";

export default function TopBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="relative z-50 flex items-center justify-center gap-2 bg-gradient-to-r from-gold via-gold-light to-gold px-4 py-2 text-center">
      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-black sm:text-[11px] sm:tracking-[0.2em]">
        Lebanon Rental guests enjoy{" "}
        <span className="font-extrabold">FREE</span> car delivery to their
        property —{" "}
        <a
          href="tel:+96181062329"
          className="underline underline-offset-2 hover:no-underline"
        >
          Call +961 81 062 329
        </a>
      </p>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-2 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center text-black/50 transition-colors hover:text-black sm:right-4"
        aria-label="Dismiss banner"
      >
        <svg
          className="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
