"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

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

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-navy-light bg-navy backdrop-blur-md">
      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Lebanon Rental"
            width={200}
            height={200}
            className="h-12 w-auto sm:h-20"
            priority
          />
        </Link>

        {/* Mobile inline quick-links */}
        <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap sm:hidden">
          {NAV_LINKS.slice(0, 5).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[9px] font-bold uppercase tracking-[0.12em] ${isActive(link.href) ? "text-white" : "text-white/60"}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 sm:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative text-[13px] font-medium uppercase tracking-[0.2em] transition-colors ${
                isActive(link.href)
                  ? "text-white"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="h-5 w-px bg-white/20" />
          <Link
            href="/admin"
            className={`relative text-[13px] font-medium uppercase tracking-[0.2em] transition-colors ${
              pathname === "/admin"
                ? "text-white"
                : "text-white/60 hover:text-white"
            }`}
          >
            Admin
            {pathname === "/admin" && (
              <span className="absolute -bottom-1 left-0 h-px w-full bg-white" />
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
