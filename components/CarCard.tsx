"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Car, CarPhotos } from "@/lib/types";

const PHOTO_ORDER: { key: keyof CarPhotos; label: string }[] = [
  { key: "main", label: "Main" },
  { key: "front", label: "Front" },
  { key: "back", label: "Back" },
  { key: "left", label: "Left" },
  { key: "right", label: "Right" },
];

export default function CarCard({ car }: { car: Car }) {
  const isUnavailable = car.available === false;

  // Build photo list from photos or fallback to images
  const photoList = (() => {
    if (car.photos && Object.values(car.photos).some(Boolean)) {
      return PHOTO_ORDER.filter((p) => car.photos![p.key]).map((p) => car.photos![p.key]!);
    }
    if (car.images && car.images.length > 0) return car.images;
    return [];
  })();

  const [currentIndex, setCurrentIndex] = useState(0);

  const goPrev = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setCurrentIndex((i) => (i === 0 ? photoList.length - 1 : i - 1));
    },
    [photoList.length]
  );

  const goNext = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setCurrentIndex((i) => (i === photoList.length - 1 ? 0 : i + 1));
    },
    [photoList.length]
  );

  return (
    <Link
      href={`/cars/${car.id}`}
      className={`card-dramatic group relative block overflow-hidden border border-luxury-border bg-luxury-card ${isUnavailable ? "opacity-60 grayscale-[30%]" : ""}`}
    >
      {/* Image — prominent, no rounding */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
        {photoList.length > 0 ? (
          <img
            src={photoList[currentIndex]}
            alt={car.name}
            className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-luxury-dark text-white/10">
            <svg className="h-20 w-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
          </div>
        )}
        {/* Heavy gradient from bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

        {/* Hover arrows */}
        {photoList.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-2 top-1/2 z-20 -translate-y-1/2 border border-white/10 bg-black/70 p-2 backdrop-blur-sm opacity-0 transition-all duration-300 group-hover:opacity-100 hover:border-gold/30 hover:bg-black/90"
            >
              <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goNext}
              className="absolute right-2 top-1/2 z-20 -translate-y-1/2 border border-white/10 bg-black/70 p-2 backdrop-blur-sm opacity-0 transition-all duration-300 group-hover:opacity-100 hover:border-gold/30 hover:bg-black/90"
            >
              <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Dot indicators — visible on hover */}
            <div className="absolute bottom-14 left-1/2 z-20 -translate-x-1/2 flex gap-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {photoList.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentIndex(i);
                  }}
                  className={`h-1.5 transition-all duration-300 ${
                    i === currentIndex ? "w-4 bg-gold" : "w-1.5 bg-white/40 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Top-left badges */}
        <div className="absolute top-0 left-0 flex flex-col gap-1 z-10">
          {car.featured && (
            <div className="flex items-center gap-1.5 bg-gold px-3 py-1.5">
              <svg className="h-3 w-3 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-black">Featured</span>
            </div>
          )}
          {isUnavailable && (
            <div className="bg-red-600 px-3 py-1.5">
              <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-white">
                {car.availableFrom
                  ? `Back ${new Date(car.availableFrom + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                  : "Rented"}
              </span>
            </div>
          )}
        </div>

        {/* Gold price badge — sharp, bold */}
        <div className="absolute top-0 right-0 bg-gold px-4 py-2 z-10">
          <span className="text-sm font-extrabold text-black">${car.price}</span>
          <span className="text-[10px] font-bold text-black/60">/day</span>
        </div>

        {/* Video indicator */}
        {car.videoUrl && (
          <div className="absolute bottom-14 right-4 flex h-8 w-8 items-center justify-center bg-white/10 backdrop-blur-sm z-10">
            <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}

        {/* Bottom info overlay on image */}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-10 pointer-events-none">
          <div className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-gold">
            {car.brand}
          </div>
          <h3 className="font-serif text-2xl font-bold text-white">{car.name}</h3>
        </div>
      </div>

      {/* Details bar — sharp, minimal */}
      <div className="flex items-center justify-between border-t border-luxury-border bg-luxury-card px-5 py-4">
        <div className="flex items-center gap-6 text-[11px] font-semibold uppercase tracking-wider text-white/40">
          <span className="flex items-center gap-1.5">
            <span className="text-gold">{car.year}</span>
          </span>
          <span className="flex items-center gap-1.5">
            {car.mileage.toLocaleString()} km
          </span>
          <span className="flex items-center gap-1.5">
            {car.transmission}
          </span>
        </div>
        <svg className="h-4 w-4 text-gold/30 transition-all duration-300 group-hover:translate-x-2 group-hover:text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
