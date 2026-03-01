"use client";

import { useCompare } from "@/components/CompareContext";
import { Car, CarPhotos } from "@/lib/types";
import Link from "next/link";

/* ── helper: first available image from a car ── */
function carThumb(car: Car) {
  if (car.photos) {
    const p = car.photos as CarPhotos;
    return p.main || p.front || p.back || p.left || p.right || "";
  }
  return car.images?.[0] ?? "";
}

/* ── Spec row used inside the modal ── */
function SpecRow({
  label,
  a,
  b,
  highlight,
}: {
  label: string;
  a: string;
  b: string;
  highlight?: "lower" | "higher" | "none";
}) {
  const aNum = parseFloat(a.replace(/[^0-9.]/g, ""));
  const bNum = parseFloat(b.replace(/[^0-9.]/g, ""));
  const bothNumeric = !isNaN(aNum) && !isNaN(bNum) && aNum !== bNum;

  let aWin = false;
  let bWin = false;
  if (bothNumeric && highlight === "lower") {
    aWin = aNum < bNum;
    bWin = bNum < aNum;
  } else if (bothNumeric && highlight === "higher") {
    aWin = aNum > bNum;
    bWin = bNum > aNum;
  }

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 py-2.5 border-b border-white/5 last:border-0">
      <p className={`text-right text-[11px] sm:text-[12px] font-semibold tabular-nums ${aWin ? "text-emerald-400" : "text-white/80"}`}>{a}</p>
      <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.22em] text-white/30 text-center w-20 sm:w-28">
        {label}
      </p>
      <p className={`text-left text-[11px] sm:text-[12px] font-semibold tabular-nums ${bWin ? "text-emerald-400" : "text-white/80"}`}>{b}</p>
    </div>
  );
}

/* ══════════════════════════════════════════
   COMPARE BAR  – fixed bottom bar + modal
   ══════════════════════════════════════════ */
export default function CompareBar() {
  const { compareCars, removeCar, clearAll, showModal, openModal, closeModal } = useCompare();

  if (compareCars.length === 0) return null;

  const [carA, carB] = compareCars;

  return (
    <>
      {/* ── Floating bottom bar ── */}
      {!showModal && (
        <div className="fixed bottom-20 left-1/2 z-[90] w-[94vw] max-w-xl animate-slide-up sm:bottom-16">
          <div className="flex items-center gap-2 rounded-full border border-[#1B4F72]/25 bg-[#0d2a3f]/95 px-4 py-2.5 shadow-[0_6px_36px_rgba(0,0,0,0.4)] backdrop-blur-lg sm:gap-3 sm:px-5">
            {/* Car thumbnails */}
            <div className="flex -space-x-2">
              {compareCars.map((c) => (
                <div key={c.id} className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border-2 border-[#1B4F72] bg-gray-800 sm:h-10 sm:w-10">
                  {carThumb(c) ? (
                    <img src={carThumb(c)} alt={c.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[8px] font-bold text-white/40">
                      {c.brand?.[0]}
                    </div>
                  )}
                  <button
                    onClick={() => removeCar(c.id)}
                    className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[7px] font-bold text-white transition hover:bg-red-400"
                    aria-label={`Remove ${c.name}`}
                  >
                    &times;
                  </button>
                </div>
              ))}
              {compareCars.length < 2 && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-white/20 sm:h-10 sm:w-10">
                  <span className="text-[10px] text-white/30">+1</span>
                </div>
              )}
            </div>

            {/* Label */}
            <p className="flex-1 text-[10px] font-bold tracking-wide text-white/60 sm:text-[11px]">
              {compareCars.length}/2 selected
            </p>

            {/* Actions */}
            <button
              onClick={clearAll}
              className="text-[9px] font-bold uppercase tracking-wider text-white/30 transition hover:text-white/70 sm:text-[10px]"
            >
              Clear
            </button>
            <button
              onClick={openModal}
              disabled={compareCars.length < 2}
              className="rounded-sm bg-navy px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-white transition-all hover:bg-navy-light disabled:opacity-30 disabled:cursor-not-allowed sm:px-5 sm:text-[11px]"
            >
              Compare
            </button>
          </div>
        </div>
      )}

      {/* ── Full-screen comparison modal ── */}
      {showModal && carA && carB && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-black/80 backdrop-blur-md">
          <div className="relative mx-auto w-full max-w-2xl px-3 py-6 sm:px-4 sm:py-10">
            {/* Close */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/50 transition hover:bg-white/20 hover:text-white sm:top-4 sm:right-4"
              aria-label="Close comparison"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>

            {/* Header */}
            <p className="mb-5 text-center text-[9px] font-bold uppercase tracking-[0.35em] text-white/30 sm:mb-7 sm:text-[10px]">
              Side-by-Side Comparison
            </p>

            {/* Car headers */}
            <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2 mb-4 sm:mb-6">
              {/* Car A */}
              <div className="text-center">
                <div className="mx-auto mb-2 aspect-[4/3] w-full max-w-[180px] overflow-hidden rounded-md border border-white/10 bg-gray-900 sm:max-w-[220px]">
                  {carThumb(carA) ? (
                    <img src={carThumb(carA)} alt={carA.name} className="h-full w-full object-contain" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-white/20 text-xs">No Image</div>
                  )}
                </div>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/35">{carA.brand}</p>
                <p className="mt-0.5 text-[12px] font-bold text-white leading-tight sm:text-[15px]">{carA.name}</p>
                <Link href={`/cars/${carA.id}`} onClick={closeModal} className="mt-1 inline-block text-[9px] font-bold uppercase tracking-wider text-[#5bafdf] hover:text-white transition-colors">
                  View Details &rarr;
                </Link>
              </div>

              {/* VS badge */}
              <div className="flex flex-col items-center pb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5">
                  <span className="text-[11px] font-extrabold tracking-wide text-white/50">VS</span>
                </div>
              </div>

              {/* Car B */}
              <div className="text-center">
                <div className="mx-auto mb-2 aspect-[4/3] w-full max-w-[180px] overflow-hidden rounded-md border border-white/10 bg-gray-900 sm:max-w-[220px]">
                  {carThumb(carB) ? (
                    <img src={carThumb(carB)} alt={carB.name} className="h-full w-full object-contain" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-white/20 text-xs">No Image</div>
                  )}
                </div>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/35">{carB.brand}</p>
                <p className="mt-0.5 text-[12px] font-bold text-white leading-tight sm:text-[15px]">{carB.name}</p>
                <Link href={`/cars/${carB.id}`} onClick={closeModal} className="mt-1 inline-block text-[9px] font-bold uppercase tracking-wider text-[#5bafdf] hover:text-white transition-colors">
                  View Details &rarr;
                </Link>
              </div>
            </div>

            {/* Specs table */}
            <div className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 sm:px-5 sm:py-3">
              <SpecRow label="Price / Day" a={`$${carA.price}`} b={`$${carB.price}`} highlight="lower" />
              <SpecRow label="Year" a={String(carA.year)} b={String(carB.year)} highlight="higher" />
              <SpecRow label="Category" a={carA.category || "—"} b={carB.category || "—"} />
              <SpecRow label="Fuel" a={carA.fuel} b={carB.fuel} />
              <SpecRow label="Transmission" a={carA.transmission} b={carB.transmission} />
              <SpecRow label="Seats" a={String(carA.seats)} b={String(carB.seats)} highlight="higher" />
              <SpecRow label="Mileage" a={`${carA.mileage.toLocaleString()} km`} b={`${carB.mileage.toLocaleString()} km`} highlight="lower" />
              <SpecRow label="Road Types" a={carA.roadTypes?.join(", ") || "—"} b={carB.roadTypes?.join(", ") || "—"} />
              <SpecRow label="Trip Type" a={carA.tripCategory || "—"} b={carB.tripCategory || "—"} />
              <SpecRow label="Available" a={carA.available === false ? "Rented" : "Yes"} b={carB.available === false ? "Rented" : "Yes"} />
            </div>

            {/* Bottom actions */}
            <div className="mt-5 flex items-center justify-center gap-3 sm:mt-7">
              <button
                onClick={clearAll}
                className="border border-white/15 px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white/50 transition hover:border-white/30 hover:text-white sm:text-[11px]"
              >
                Clear &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
