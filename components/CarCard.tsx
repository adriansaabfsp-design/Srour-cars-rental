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
      className={`group relative block overflow-hidden border border-gray-200 bg-white transition-all duration-500 hover:border-navy/40 hover:shadow-[0_0_30px_rgba(27,58,92,0.15)] ${isUnavailable ? "opacity-60 grayscale-[30%]" : ""}`}
    >
      {/* Image — clean, no overlay */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-white">
        {photoList.length > 0 ? (
          <img
            src={photoList[currentIndex]}
            alt={car.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-100 text-gray-300">
            <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
          </div>
        )}

        {/* Hover arrows */}
        {photoList.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-2 top-1/2 z-20 -translate-y-1/2 bg-black/60 p-2 backdrop-blur-sm opacity-0 transition-all duration-300 group-hover:opacity-100 hover:bg-black/80"
            >
              <svg className="h-3 w-3 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goNext}
              className="absolute right-2 top-1/2 z-20 -translate-y-1/2 bg-black/60 p-2 backdrop-blur-sm opacity-0 transition-all duration-300 group-hover:opacity-100 hover:bg-black/80"
            >
              <svg className="h-3 w-3 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-3 left-1/2 z-20 -translate-x-1/2 flex gap-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {photoList.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentIndex(i);
                  }}
                  className={`h-1.5 rounded-sm transition-all duration-300 ${
                    i === currentIndex ? "w-4 bg-white" : "w-1.5 bg-white/40 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Featured badge — clean white with blue star */}
        {car.featured && (
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2.5 py-1">
            <svg className="h-3 w-3 text-navy" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-[8px] font-bold uppercase tracking-[0.15em] text-black/70">Featured</span>
          </div>
        )}

        {/* Rented badge */}
        {isUnavailable && (
          <div className="absolute top-3 left-3 z-10 bg-red-600 px-2.5 py-1">
            <span className="text-[8px] font-bold uppercase tracking-[0.15em] text-white">
              {car.availableFrom
                ? `Back ${new Date(car.availableFrom + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                : "Rented"}
            </span>
          </div>
        )}

        {/* Price pill — white, top right */}
        <div className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-sm">
          <span className="text-xs font-bold text-black">${car.price}</span>
          <span className="text-[9px] font-medium text-black/50">/day</span>
        </div>

        {/* Video indicator */}
        {car.videoUrl && (
          <div className="absolute bottom-3 right-3 flex h-7 w-7 items-center justify-center bg-black/50 backdrop-blur-sm z-10">
            <svg className="h-3.5 w-3.5 text-white/70" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}
      </div>

      {/* Info section — clean, minimal */}
      <div className="px-4 py-4 sm:px-5 sm:py-5">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-gray-900/30">
          {car.brand}
        </p>
        <h3 className="mt-1 font-serif text-lg font-bold text-gray-900 sm:text-xl">{car.name}</h3>
        <div className="mt-3 flex items-center gap-4 text-[10px] font-medium uppercase tracking-wider text-gray-900/25">
          <span>{car.year}</span>
          <span className="hidden min-[400px]:inline">{car.mileage.toLocaleString()} km</span>
          <span>{car.transmission === "Automatic" ? "Auto" : car.transmission}</span>
        </div>
      </div>
    </Link>
  );
}
