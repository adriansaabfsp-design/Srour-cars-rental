"use client";
import { useState, useRef, useEffect } from "react";

interface PriceCalculatorProps {
  /** Daily price (e.g. from a selected / hovered car) */
  dailyPrice?: number;
  /** Label shown next to the price (e.g. car name) */
  label?: string;
}

export default function PriceCalculator({ dailyPrice, label }: PriceCalculatorProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [open, setOpen] = useState(false);
  const [customPrice, setCustomPrice] = useState("");
  const barRef = useRef<HTMLDivElement>(null);

  // Resolve active daily price
  const price = dailyPrice ?? (customPrice ? Number(customPrice) : 0);

  // Calculate rental days
  const days =
    startDate && endDate
      ? Math.max(
          1,
          Math.ceil(
            (new Date(endDate).getTime() - new Date(startDate).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;

  const total = days > 0 && price > 0 ? days * price : 0;

  // Today string for min attr
  const today = new Date().toISOString().split("T")[0];

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div
      ref={barRef}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] w-[95vw] max-w-lg"
    >
      {/* Collapsed pill */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-between gap-2 rounded-full border border-[#1B4F72]/20 bg-[#0d2a3f]/95 px-5 py-3 text-white shadow-[0_4px_30px_rgba(0,0,0,0.35)] backdrop-blur-lg transition-all hover:shadow-[0_4px_40px_rgba(27,79,114,0.4)]"
        >
          <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em]">
            <svg className="h-4 w-4 text-[#5bafdf]" viewBox="0 0 20 20" fill="currentColor"><path d="M6 2a2 2 0 00-2 2v1H3a1 1 0 000 2h1v2H3a1 1 0 000 2h1v2H3a1 1 0 000 2h1v1a2 2 0 002 2h8a2 2 0 002-2v-1h1a1 1 0 000-2h-1v-2h1a1 1 0 000-2h-1V7h1a1 1 0 000-2h-1V4a2 2 0 00-2-2H6z"/></svg>
            Price Calculator
          </span>
          {total > 0 ? (
            <span className="rounded-sm bg-white/15 px-3 py-1 text-[12px] font-bold tabular-nums">
              ${total}
              <span className="ml-1 text-[9px] font-normal text-white/50">
                ({days}d)
              </span>
            </span>
          ) : (
            <span className="text-[10px] text-white/50">Tap to estimate</span>
          )}
        </button>
      )}

      {/* Expanded panel */}
      {open && (
        <div className="rounded-2xl border border-[#1B4F72]/20 bg-[#0d2a3f]/95 px-5 py-4 text-white shadow-[0_8px_40px_rgba(0,0,0,0.45)] backdrop-blur-lg">
          {/* Header row */}
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em]">
              <svg className="mr-1.5 inline h-4 w-4 text-[#5bafdf]" viewBox="0 0 20 20" fill="currentColor"><path d="M6 2a2 2 0 00-2 2v1H3a1 1 0 000 2h1v2H3a1 1 0 000 2h1v2H3a1 1 0 000 2h1v1a2 2 0 002 2h8a2 2 0 002-2v-1h1a1 1 0 000-2h-1v-2h1a1 1 0 000-2h-1V7h1a1 1 0 000-2h-1V4a2 2 0 00-2-2H6z"/></svg>
              Price Calculator
            </p>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full p-1 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Collapse calculator"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          {/* Date inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[9px] font-bold uppercase tracking-widest text-white/40">
                Pick-up
              </label>
              <input
                type="date"
                min={today}
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  if (endDate && e.target.value > endDate) setEndDate("");
                }}
                className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-[12px] text-white outline-none transition-colors focus:border-[#5bafdf] [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="mb-1 block text-[9px] font-bold uppercase tracking-widest text-white/40">
                Return
              </label>
              <input
                type="date"
                min={startDate || today}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-[12px] text-white outline-none transition-colors focus:border-[#5bafdf] [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Price input (when no dailyPrice prop) */}
          {!dailyPrice && (
            <div className="mt-3">
              <label className="mb-1 block text-[9px] font-bold uppercase tracking-widest text-white/40">
                Daily rate ($)
              </label>
              <input
                type="number"
                min={0}
                placeholder="e.g. 45"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-[12px] text-white outline-none transition-colors focus:border-[#5bafdf] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>
          )}

          {/* Result */}
          <div className="mt-4 flex items-end justify-between border-t border-white/10 pt-3">
            <div className="space-y-0.5">
              {label && (
                <p className="text-[10px] font-semibold text-[#5bafdf] truncate max-w-[200px]">
                  {label}
                </p>
              )}
              {price > 0 && days > 0 && (
                <p className="text-[10px] text-white/50">
                  ${price}/day &times; {days} day{days > 1 ? "s" : ""}
                </p>
              )}
              {days === 0 && (
                <p className="text-[10px] text-white/40">Select dates above</p>
              )}
              {days > 0 && price === 0 && (
                <p className="text-[10px] text-white/40">
                  {dailyPrice ? "Loading..." : "Enter a daily rate"}
                </p>
              )}
            </div>
            <div>
              {total > 0 ? (
                <span className="text-xl font-bold tabular-nums tracking-tight">
                  ${total}
                </span>
              ) : (
                <span className="text-lg font-bold text-white/20">$--</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
