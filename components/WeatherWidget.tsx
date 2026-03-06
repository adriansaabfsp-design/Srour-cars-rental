"use client";

import { useEffect, useState, useRef } from "react";

/* ── Lebanese cities with coordinates ── */
const CITIES = [
  { name: "Beirut", lat: 33.8938, lon: 35.5018 },
  { name: "Jounieh", lat: 33.9808, lon: 35.6178 },
  { name: "Byblos", lat: 34.1236, lon: 35.6511 },
  { name: "Batroun", lat: 34.2553, lon: 35.6581 },
  { name: "Tripoli", lat: 34.4332, lon: 35.8498 },
  { name: "Faraya", lat: 33.9764, lon: 35.8178 },
  { name: "Zahle", lat: 33.8463, lon: 35.9020 },
  { name: "Sidon", lat: 33.5633, lon: 35.3697 },
  { name: "Tyre", lat: 33.2705, lon: 35.2038 },
];

type CityWeather = {
  name: string;
  temp: number;
  code: number;
  wind: number;
};

/* ── WMO weather code → icon + label ── */
function weatherMeta(code: number): { icon: string; label: string } {
  if (code === 0) return { icon: "☀️", label: "Clear" };
  if (code <= 3) return { icon: "⛅", label: "Partly Cloudy" };
  if (code <= 49) return { icon: "🌫️", label: "Foggy" };
  if (code <= 59) return { icon: "🌦️", label: "Drizzle" };
  if (code <= 69) return { icon: "🌧️", label: "Rain" };
  if (code <= 79) return { icon: "🌨️", label: "Snow" };
  if (code <= 84) return { icon: "🌧️", label: "Showers" };
  if (code <= 94) return { icon: "🌨️", label: "Snow Showers" };
  return { icon: "⛈️", label: "Thunderstorm" };
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<CityWeather[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Build batch request for all cities
        const lats = CITIES.map((c) => c.lat).join(",");
        const lons = CITIES.map((c) => c.lon).join(",");
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m,weather_code,wind_speed_10m&timezone=Asia/Beirut`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Weather API error");
        const data = await res.json();

        // Open-Meteo returns an array when multiple coordinates are given
        const results: CityWeather[] = (Array.isArray(data) ? data : [data]).map(
          (d: { current: { temperature_2m: number; weather_code: number; wind_speed_10m: number } }, i: number) => ({
            name: CITIES[i].name,
            temp: Math.round(d.current.temperature_2m),
            code: d.current.weather_code,
            wind: Math.round(d.current.wind_speed_10m),
          })
        );

        setWeather(results);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  /* ── Scroll arrows logic ── */
  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      if (el) el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [weather]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -220 : 220, behavior: "smooth" });
  };

  if (error) return null; // Silently hide if API fails — non-essential feature

  return (
    <section className="relative border-b border-luxury-border bg-white">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between sm:mb-4">
          <div className="flex items-center gap-2">
            <svg
              className="h-4 w-4 text-navy"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z"
              />
            </svg>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-navy sm:text-[13px]">
              Live Weather
            </span>
          </div>
          <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-gray-400 sm:text-[10px]">
            Lebanon • Now
          </span>
        </div>

        {/* Scrollable weather cards */}
        <div className="relative">
          {/* Left arrow */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute -left-1 top-1/2 z-10 -translate-y-1/2 bg-white/90 p-1.5 shadow-md backdrop-blur transition-colors hover:bg-white sm:-left-3 sm:p-2 rounded-full"
            >
              <svg className="h-3.5 w-3.5 text-navy sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Right arrow */}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute -right-1 top-1/2 z-10 -translate-y-1/2 bg-white/90 p-1.5 shadow-md backdrop-blur transition-colors hover:bg-white sm:-right-3 sm:p-2 rounded-full"
            >
              <svg className="h-3.5 w-3.5 text-navy sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          <div
            ref={scrollRef}
            className="flex gap-2.5 overflow-x-auto scroll-smooth pb-1 sm:gap-3 no-scrollbar"
          >
            {loading
              ? Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 w-[120px] sm:w-[140px] border border-gray-100 bg-gray-50 p-3 sm:p-4 rounded-sm animate-pulse"
                  >
                    <div className="h-3 w-14 bg-gray-200 rounded mb-2" />
                    <div className="h-8 w-8 bg-gray-200 rounded-full mx-auto mb-2" />
                    <div className="h-4 w-10 bg-gray-200 rounded mx-auto" />
                  </div>
                ))
              : weather.map((city) => {
                  const meta = weatherMeta(city.code);
                  return (
                    <div
                      key={city.name}
                      className="group flex-shrink-0 w-[120px] sm:w-[140px] border border-gray-100 bg-gradient-to-b from-white to-gray-50/50 p-3 sm:p-4 text-center transition-all hover:border-navy/20 hover:shadow-sm rounded-sm"
                    >
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-navy/60 sm:text-[11px]">
                        {city.name}
                      </p>
                      <div className="my-1.5 text-2xl sm:my-2 sm:text-3xl leading-none">
                        {meta.icon}
                      </div>
                      <p className="text-lg font-extrabold text-gray-900 sm:text-xl leading-none">
                        {city.temp}°
                      </p>
                      <p className="mt-1 text-[9px] font-semibold text-gray-400 sm:text-[10px]">
                        {meta.label}
                      </p>
                      <p className="mt-0.5 text-[8px] font-medium text-gray-300 sm:text-[9px]">
                        💨 {city.wind} km/h
                      </p>
                    </div>
                  );
                })}
          </div>
        </div>
      </div>
    </section>
  );
}
