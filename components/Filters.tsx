"use client";

import { BRANDS } from "@/lib/types";

interface FiltersProps {
  brand: string;
  setBrand: (brand: string) => void;
  minPrice: string;
  setMinPrice: (price: string) => void;
  maxPrice: string;
  setMaxPrice: (price: string) => void;
  minYear: string;
  setMinYear: (year: string) => void;
  maxYear: string;
  setMaxYear: (year: string) => void;
  showAvailableOnly: boolean;
  setShowAvailableOnly: (val: boolean) => void;
  onReset: () => void;
}

const inputClasses =
  "w-full border border-luxury-border bg-black px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-navy focus:ring-1 focus:ring-navy/20";

export default function Filters({
  brand,
  setBrand,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  minYear,
  setMinYear,
  maxYear,
  setMaxYear,
  showAvailableOnly,
  setShowAvailableOnly,
  onReset,
}: FiltersProps) {
  const currentYear = new Date().getFullYear();
  const hasActiveFilters =
    brand !== "All" || minPrice || maxPrice || minYear || maxYear || showAvailableOnly;

  return (
    <div className="border border-luxury-border bg-luxury-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-lg font-bold text-white">REFINE</h2>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-navy transition-colors hover:text-white"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Brand */}
      <div className="mb-5">
        <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">
          Brand
        </label>
        <select value={brand} onChange={(e) => setBrand(e.target.value)} className={inputClasses}>
          {BRANDS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="mb-5">
        <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">
          Price Range ($/day)
        </label>
        <div className="flex gap-2">
          <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className={inputClasses} />
          <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className={inputClasses} />
        </div>
      </div>

      {/* Year Range */}
      <div>
        <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">
          Year
        </label>
        <div className="flex gap-2">
          <input type="number" placeholder="From" min="1990" max={currentYear} value={minYear} onChange={(e) => setMinYear(e.target.value)} className={inputClasses} />
          <input type="number" placeholder="To" min="1990" max={currentYear} value={maxYear} onChange={(e) => setMaxYear(e.target.value)} className={inputClasses} />
        </div>
      </div>

      {/* Availability Toggle */}
      <div className="mt-5">
        <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">
          Availability
        </label>
        <button
          onClick={() => setShowAvailableOnly(!showAvailableOnly)}
          className={`flex w-full items-center gap-3 border px-4 py-3 text-sm transition-all ${
            showAvailableOnly
              ? "border-green-500/30 bg-green-500/10 text-green-400"
              : "border-luxury-border bg-black text-white/40 hover:border-white/20"
          }`}
        >
          <div
            className={`relative h-5 w-9 flex-shrink-0 transition-colors ${
              showAvailableOnly ? "bg-green-500" : "bg-luxury-border"
            }`}
          >
            <div
              className={`absolute top-0.5 h-4 w-4 bg-white transition-transform ${
                showAvailableOnly ? "translate-x-[18px]" : "translate-x-0.5"
              }`}
            />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider">
            {showAvailableOnly ? "Available only" : "Show all (incl. rented)"}
          </span>
        </button>
      </div>

      {/* Decorative line */}
      <div className="mt-6 h-[1px] w-full bg-gradient-to-r from-navy/30 via-navy/10 to-transparent" />
    </div>
  );
}
