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

const CarSvg = ({ className }: { className?: string }) => (
  <svg className={className} width="32" height="14" viewBox="0 0 48 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 14h32v2H8z" fill="#1B4F72"/>
    <path d="M6 12c0-2 2-4 4-4h6l4-4h8l2 4h6c2 0 4 2 4 4v4H6v-4z" fill="#1B4F72"/>
    <path d="M14 8h4l-2-3h-4l2 3z" fill="#2A7AB5" opacity="0.6"/>
    <path d="M20 8h6l-1-3h-4l-1 3z" fill="#2A7AB5" opacity="0.6"/>
    <circle cx="14" cy="16" r="3" fill="#0f2f47"/>
    <circle cx="14" cy="16" r="1.5" fill="#4a4a4a"/>
    <circle cx="34" cy="16" r="3" fill="#0f2f47"/>
    <circle cx="34" cy="16" r="1.5" fill="#4a4a4a"/>
  </svg>
);

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
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8 relative h-16 sm:h-20">
        {/* Mobile: hamburger left */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-10 w-10 items-center justify-center text-[#1a4b6e] sm:hidden"
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

        {/* Desktop: left links */}
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

        {/* Center logo — both mobile & desktop */}
        <Link href="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <div className="relative">
            <Image
              src="/logo-hd.png"
              alt="Lebanon Rental"
              width={500}
              height={500}
              className="h-14 w-auto sm:h-44 lg:h-52"
              priority
            />
            {/* Animated driving car */}
            <CarSvg className="nav-driving-car" />
          </div>
        </Link>

        {/* Desktop: right links */}
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

        {/* Mobile: phone icon right */}
        <a
          href="tel:+96181062329"
          className="flex h-10 w-10 items-center justify-center text-[#1a4b6e] sm:hidden"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
          </svg>
        </a>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-gray-200 bg-white px-6 py-5 sm:hidden">
          <div className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`text-[15px] font-bold uppercase tracking-[0.12em] ${
                  isActive(link.href) ? "text-[#1a6fa0]" : "text-[#1a4b6e]/70"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="h-px w-full bg-gray-200" />
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className={`text-[15px] font-bold uppercase tracking-[0.12em] ${
                pathname === "/admin" ? "text-[#1a6fa0]" : "text-[#1a4b6e]/70"
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
