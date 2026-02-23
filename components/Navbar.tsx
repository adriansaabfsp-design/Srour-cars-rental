"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Collection", href: "/#collection" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-black/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <svg className="h-8 w-8 text-gold" viewBox="0 0 64 64" fill="currentColor">
            <path d="M32 2c-1.5 4-5 8-5 12 0 3 2 5 3.5 7-2.5-1-6-2-8.5-1-3 1.2-4 4-3 6.5 1 2 3.5 3.5 5.5 4-3 .5-7 1.5-9 4-1.8 2.5-1 5.5 1 7.5 2 1.8 5 2.5 7.5 2.5-2 1.5-4.5 3.5-5 6-.5 3 1.5 5 4 6H32V2z" />
            <path d="M32 2c1.5 4 5 8 5 12 0 3-2 5-3.5 7 2.5-1 6-2 8.5-1 3 1.2 4 4 3 6.5-1 2-3.5 3.5-5.5 4 3 .5 7 1.5 9 4 1.8 2.5 1 5.5-1 7.5-2 1.8-5 2.5-7.5 2.5 2 1.5 4.5 3.5 5 6 .5 3-1.5 5-4 6H32V2z" />
            <rect x="30" y="50" width="4" height="12" rx="1" />
          </svg>
          <div className="flex items-baseline gap-1">
            <span className="font-serif text-xl font-bold tracking-wider text-gold">
              Lebanon
            </span>
            <span className="text-sm font-bold uppercase tracking-[0.3em] text-gold/70">
              Rental
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 sm:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative text-[13px] font-medium uppercase tracking-[0.2em] transition-colors ${
                isActive(link.href)
                  ? "text-gold"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="h-5 w-px bg-white/10" />
          <Link
            href="/admin"
            className={`relative text-[13px] font-medium uppercase tracking-[0.2em] transition-colors ${
              pathname === "/admin"
                ? "text-gold"
                : "text-white/60 hover:text-white"
            }`}
          >
            Admin
            {pathname === "/admin" && (
              <span className="absolute -bottom-1 left-0 h-px w-full bg-gold" />
            )}
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-10 w-10 items-center justify-center text-white/60 sm:hidden"
        >
          {menuOpen ? (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-white/5 bg-black/98 px-4 py-4 backdrop-blur-md sm:hidden">
          <div className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`text-[13px] font-medium uppercase tracking-[0.2em] ${
                  isActive(link.href) ? "text-gold" : "text-white/60"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="h-px w-full bg-white/5" />
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className={`text-[13px] font-medium uppercase tracking-[0.2em] ${
                pathname === "/admin" ? "text-gold" : "text-white/60"
              }`}
            >
              Admin
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
