"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Nunito_Sans } from "next/font/google";

const nunito = Nunito_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
});

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Collection", href: "/#collection" },
  { label: "Extras", href: "/extras" },
  { label: "Road Trips", href: "/road-trips" },
  { label: "Seasonal Guide", href: "/seasonal-guide" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const leftLinks = NAV_LINKS.slice(0, 4);
  const rightLinks = NAV_LINKS.slice(4);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className={`${nunito.className} sticky top-0 z-50 border-b border-gray-200 bg-white`}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8 relative">
        <div className="hidden flex-1 items-center justify-start gap-4 lg:gap-5 sm:flex">
          {leftLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative text-[15px] font-extrabold transition-colors ${
                isActive(link.href)
                  ? "text-[#1a6fa0]"
                  : "text-[#1a6fa0]/70 hover:text-[#1a6fa0]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link href="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <Image
            src="/logo-hd.png"
            alt="Lebanon Rental"
            width={500}
            height={500}
            className="h-20 w-auto sm:h-44 lg:h-52"
            priority
          />
        </Link>

        <div className="hidden flex-1 items-center justify-end gap-4 lg:gap-5 sm:flex">
          {rightLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative text-[15px] font-extrabold transition-colors ${
                isActive(link.href)
                  ? "text-[#1a6fa0]"
                  : "text-[#1a6fa0]/70 hover:text-[#1a6fa0]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/admin"
            className={`relative text-[15px] font-extrabold transition-colors ${
              pathname === "/admin"
                ? "text-[#1a6fa0]"
                : "text-[#1a6fa0]/70 hover:text-[#1a6fa0]"
            }`}
          >
            Admin
          </Link>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="absolute right-4 flex h-10 w-10 items-center justify-center text-navy sm:hidden"
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
        <div className="border-t border-gray-200 bg-white/98 px-4 py-4 backdrop-blur-md sm:hidden">
          <div className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`text-[13px] font-medium uppercase tracking-[0.2em] ${
                  isActive(link.href) ? "text-gray-900" : "text-gray-900/60"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="tel:+96181062329"
              className="text-[13px] font-semibold text-navy/80"
            >
              +96181062329
            </a>
            <div className="h-px w-full bg-white/5" />
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className={`text-[13px] font-medium uppercase tracking-[0.2em] ${
                pathname === "/admin" ? "text-gray-900" : "text-gray-900/60"
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
