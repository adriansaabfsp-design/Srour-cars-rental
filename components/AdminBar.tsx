"use client";

import Link from "next/link";
import { useAdmin } from "./AdminContext";

export default function AdminBar() {
  const { isAdmin, logout } = useAdmin();
  if (!isAdmin) return null;

  return (
    <div className="bg-[#1B3A5C] text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 sm:px-6">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
            Admin Mode
          </span>
          <Link
            href="/carslebanonrental9x2dashboard847auth"
            className="text-[11px] font-semibold text-white/90 transition-colors hover:text-white"
          >
            Dashboard
          </Link>
        </div>
        <button
          onClick={logout}
          className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/50 transition-colors hover:text-white"
        >
          Exit Admin
        </button>
      </div>
    </div>
  );
}
