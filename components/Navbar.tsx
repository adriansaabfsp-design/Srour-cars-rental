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
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:h-32 sm:px-6 lg:px-8 relative">
        <div className="hidden flex-1 items-center gap-7 sm:flex">
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
            width={300}
            height={300}
            className="h-16 w-auto sm:h-24 lg:h-28"
            priority
          />
        </Link>

        <div className="hidden flex-1 items-center justify-end gap-7 sm:flex">
          <a
            href="tel:+96181062329"
            className="flex items-center gap-1.5 text-[14px] font-extrabold text-[#1a6fa0]/80 transition-colors hover:text-[#1a6fa0]"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 7.318 5.932 13.25 13.25 13.25h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.965-.852-1.089l-4.423-1.106a1.125 1.125 0 00-1.173.417l-.97 1.293a1.125 1.125 0 01-1.21.379 10.503 10.503 0 01-6.119-6.119 1.125 1.125 0 01.379-1.21l1.293-.97a1.125 1.125 0 00.417-1.173L6.961 2.852A1.125 1.125 0 005.872 2.25H4.5a2.25 2.25 0 00-2.25 2.25v2.25z" />
            </svg>
            +96181062329
          </a>
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
