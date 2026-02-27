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
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8 relative">
        {/* Mobile: logo left + quick links */}
        <div className="flex items-center gap-3 sm:hidden">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-hd.png"
              alt="Lebanon Rental"
              width={200}
              height={200}
              className="h-10 w-auto"
              priority
            />
          </Link>
          <div className="flex items-center gap-2.5 overflow-x-auto whitespace-nowrap">
            {["Collection", "Extras", "FAQ"].map((label) => {
              const href = label === "Collection" ? "/#collection" : label === "Extras" ? "/extras" : "/faq";
              return (
                <Link key={label} href={href} className="text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#1a6fa0]/60">
                  {label}
                </Link>
              );
            })}
          </div>
        </div>

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

        <Link href="/" className="hidden sm:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center">
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
        <div className="border-t border-gray-200 bg-white px-4 py-4 sm:hidden">
          <div className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`text-[14px] font-bold uppercase tracking-[0.15em] ${
                  isActive(link.href) ? "text-[#1a6fa0]" : "text-[#1a6fa0]/70"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="h-px w-full bg-gray-200" />
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className={`text-[14px] font-bold uppercase tracking-[0.15em] ${
                pathname === "/admin" ? "text-[#1a6fa0]" : "text-[#1a6fa0]/70"
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
