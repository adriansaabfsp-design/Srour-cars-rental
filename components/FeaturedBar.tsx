"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Car } from "@/lib/types";

interface FeaturedBarProps {
  cars: Car[];
  visibleCount: number;
}

export default function FeaturedBar({ cars, visibleCount }: FeaturedBarProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const showCount = Math.min(visibleCount, cars.length);

  const goTo = useCallback(
    (newIndex: number) => {
      if (isTransitioning || newIndex === currentIndex) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(newIndex);
        setIsTransitioning(false);
      }, 400);
    },
    [isTransitioning, currentIndex]
  );

  const advance = useCallback(() => {
    if (cars.length <= showCount) return;
    const next = (currentIndex + showCount) % cars.length;
    goTo(next);
  }, [cars.length, showCount, currentIndex, goTo]);

  // Auto-cycle every 5 seconds
  useEffect(() => {
    if (cars.length <= showCount) return;
    const timer = setInterval(advance, 5000);
    return () => clearInterval(timer);
  }, [advance, cars.length, showCount]);

  if (cars.length === 0) return null;

  // Build visible slice (wraps around)
  const visibleCars: Car[] = [];
  for (let i = 0; i < showCount; i++) {
    visibleCars.push(cars[(currentIndex + i) % cars.length]);
  }

  const totalPages = Math.ceil(cars.length / showCount);

  return (
    <div className="mt-16 w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <svg className="h-4 w-4 text-gold" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-gold/80">
            Featured
          </span>
        </div>

        {/* Dots + arrows */}
        {totalPages > 1 && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageIdx = i * showCount;
                const isActive = currentIndex === pageIdx;
                return (
                  <button
                    key={i}
                    onClick={() => goTo(pageIdx)}
                    className={`transition-all duration-300 ${
                      isActive
                        ? "h-1.5 w-5 bg-gold"
                        : "h-1.5 w-1.5 bg-white/20 hover:bg-white/40"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Cards grid */}
      <div
        className={`grid gap-4 transition-all duration-400 ease-in-out ${
          isTransitioning
            ? "opacity-0 translate-y-2 scale-[0.98]"
            : "opacity-100 translate-y-0 scale-100"
        }`}
        style={{ gridTemplateColumns: `repeat(${showCount}, 1fr)` }}
      >
        {visibleCars.map((car) => (
          <Link
            key={car.id}
            href={`/cars/${car.id}`}
            className="group relative overflow-hidden border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm transition-all duration-500 hover:border-gold/30 hover:bg-white/[0.06]"
          >
            {/* Image */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
              {(car.photos?.main || car.images?.[0]) ? (
                <img
                  src={car.photos?.main || car.images[0]}
                  alt={car.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-luxury-card text-white/10">
                  <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                  </svg>
                </div>
              )}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Price badge */}
              <div className="absolute top-0 right-0 bg-gold px-3 py-1.5">
                <span className="text-sm font-extrabold text-black">${car.price}</span>
                <span className="text-[9px] font-bold text-black/50">/day</span>
              </div>

              {/* Bottom info */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="mb-1 text-[9px] font-bold uppercase tracking-[0.3em] text-gold/80">
                  {car.brand}
                </div>
                <h3 className="font-serif text-lg font-bold text-white sm:text-xl leading-tight">
                  {car.name}
                </h3>
                <div className="mt-2 flex items-center gap-4 text-[10px] font-semibold uppercase tracking-wider text-white/40">
                  <span>{car.year}</span>
                  <span>{car.transmission}</span>
                  <span>{car.fuel}</span>
                </div>
              </div>
            </div>

            {/* Hover arrow indicator */}
            <div className="absolute top-1/2 right-3 -translate-y-1/2 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2">
              <div className="flex h-8 w-8 items-center justify-center border border-gold/30 bg-black/60 backdrop-blur-sm">
                <svg className="h-3.5 w-3.5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
