"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

/* ── destination data ── */
interface Destination {
  id: number;
  name: string;
  lat: number;
  lng: number;
  x: number;
  y: number;
  distance: string;
  time: string;
  car: string;
  desc: string;
  tags: string[];
  season: string;
  isStart?: boolean;
}

const destinations: Destination[] = [
  { id: 1, name: "Beirut", lat: 33.8938, lng: 35.5018, x: 337.2, y: 491.9, distance: "—", time: "—", car: "—", desc: "Your starting point — the heart of Lebanon", tags: ["Capital"], season: "Year-round", isStart: true },
  { id: 2, name: "Jounieh", lat: 33.9808, lng: 35.6178, x: 384.9, y: 447.0, distance: "20km", time: "~30min", car: "Convertible", desc: "Casino nightlife and Harissa cable car", tags: ["Coast"], season: "Year-round" },
  { id: 3, name: "Byblos", lat: 34.1215, lng: 35.6480, x: 403.0, y: 348.7, distance: "40km", time: "~45min", car: "Sedan", desc: "Ancient Phoenician port, UNESCO World Heritage", tags: ["Coast", "UNESCO"], season: "Year-round" },
  { id: 4, name: "Batroun", lat: 34.2553, lng: 35.6580, x: 413.2, y: 252.1, distance: "55km", time: "~1hr", car: "Convertible", desc: "Stone beaches, rooftop bars, best lemonade in Lebanon", tags: ["Coast", "Nightlife"], season: "Apr–Oct" },
  { id: 5, name: "Tripoli", lat: 34.4361, lng: 35.8498, x: 493.9, y: 150.6, distance: "85km", time: "~1.5hrs", car: "Sedan", desc: "Souks, citadels, and the best street food in the country", tags: ["Culture", "Food"], season: "Year-round" },
  { id: 6, name: "Bcharre & Cedars", lat: 34.2509, lng: 36.0419, x: 557.0, y: 317.7, distance: "120km", time: "~2.5hrs", car: "4×4", desc: "Cedars of God and Gibran Museum", tags: ["Mountains", "UNESCO"], season: "Jun–Oct" },
  { id: 7, name: "Ehden", lat: 34.3065, lng: 35.9870, x: 539.1, y: 268.0, distance: "120km", time: "~2.5hrs", car: "SUV", desc: "Horsh Ehden nature reserve, mountain village paradise", tags: ["Mountains", "Nature"], season: "May–Oct" },
  { id: 8, name: "Tannourine", lat: 34.2122, lng: 35.9257, x: 511.6, y: 327.2, distance: "80km", time: "~2hrs", car: "4×4", desc: "Baatara gorge sinkhole and cedar forest", tags: ["Mountains", "Adventure"], season: "May–Oct" },
  { id: 9, name: "Wadi Qadisha", lat: 34.2400, lng: 35.9700, x: 529.5, y: 314.0, distance: "110km", time: "~2.5hrs", car: "4×4", desc: "Holy Valley with ancient cliff monasteries", tags: ["Mountains", "UNESCO"], season: "Apr–Nov" },
  { id: 10, name: "Faraya", lat: 33.9760, lng: 35.8180, x: 459.8, y: 483.0, distance: "50km", time: "~1hr", car: "4×4", desc: "Ski resorts in winter, hiking paradise in summer", tags: ["Mountains", "Ski"], season: "Dec–Mar / Jun–Sep" },
  { id: 11, name: "Laklouk", lat: 34.1280, lng: 35.8500, x: 479.1, y: 376.7, distance: "70km", time: "~1.5hrs", car: "4×4", desc: "High-altitude lake and mountain resort", tags: ["Mountains"], season: "Dec–Mar / Jun–Sep" },
  { id: 12, name: "Chouf", lat: 33.6965, lng: 35.5665, x: 352.0, y: 647.2, distance: "45km", time: "~1hr", car: "SUV", desc: "Chouf Cedar Reserve and historic palaces", tags: ["Mountains", "Nature"], season: "Apr–Nov" },
  { id: 13, name: "Sidon", lat: 33.5633, lng: 35.3757, x: 274.0, y: 713.9, distance: "45km", time: "~45min", car: "Sedan", desc: "Sea Castle, vibrant souks, Crusader heritage", tags: ["Coast", "History"], season: "Year-round" },
  { id: 14, name: "Tyre", lat: 33.2705, lng: 35.2038, x: 195.4, y: 900.8, distance: "80km", time: "~1.5hrs", car: "Sedan", desc: "Roman hippodrome, pristine beaches, UNESCO ruins", tags: ["Coast", "UNESCO"], season: "Year-round" },
  { id: 15, name: "Jezzine", lat: 33.5449, lng: 35.5807, x: 350.0, y: 760.7, distance: "82km", time: "~1.5hrs", car: "SUV", desc: "40-meter waterfall, pine forests, artisan cutlery", tags: ["Mountains", "Nature"], season: "Apr–Oct" },
  { id: 16, name: "Baalbek", lat: 34.0047, lng: 36.2110, x: 608.6, y: 525.7, distance: "85km", time: "~1.5hrs", car: "Sedan", desc: "The most impressive Roman temples on Earth", tags: ["History", "UNESCO"], season: "Year-round" },
  { id: 17, name: "Zahle", lat: 33.8463, lng: 35.9022, x: 485.1, y: 591.8, distance: "55km", time: "~1hr", car: "Sedan", desc: "Wine capital of Lebanon, Bardawni riverside restaurants", tags: ["Bekaa", "Wine"], season: "Year-round" },
  { id: 18, name: "Aanjar", lat: 33.7275, lng: 35.9302, x: 489.9, y: 683.5, distance: "60km", time: "~1hr", car: "Sedan", desc: "Umayyad palace ruins, unique in the region", tags: ["Bekaa", "History"], season: "Year-round" },
];

const beirut = destinations.find((d) => d.isStart)!;
const popularIds = [3, 6, 14];

/* ── keyframe styles injected once ── */
const mapStyles = `
@keyframes pingRing {
  0% { r: 8; opacity: 0.7; }
  100% { r: 22; opacity: 0; }
}
@keyframes dashMove {
  to { stroke-dashoffset: -20; }
}
@keyframes slideInPanel {
  from { opacity: 0; transform: translateX(24px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes slideUpPanel {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
`;

export default function LebanonMap() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const selectedDest = selectedId
    ? destinations.find((d) => d.id === selectedId) ?? null
    : null;

  /* inject keyframes once */
  useEffect(() => {
    const id = "lebanon-map-keyframes";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = mapStyles;
    document.head.appendChild(style);
  }, []);

  function selectDestination(id: number) {
    if (id === 1) return; // can't select Beirut start pin
    setSelectedId(id);
  }

  return (
    <section className="border-b border-luxury-border bg-[#F0F4F8]">
      <div className="mx-auto max-w-6xl px-3 py-6 sm:px-6 sm:py-14">
        {/* Header */}
        <div className="mb-4 text-center sm:mb-8">
          <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#1B3A5C] sm:text-[10px] sm:tracking-[0.5em]">
            Explore Lebanon
          </p>
          <h2 className="mt-1 font-serif text-lg font-bold text-gray-900 sm:mt-3 sm:text-4xl">
            YOUR LEBANON DRIVE
          </h2>
          <p className="mt-1 text-[11px] text-gray-500 sm:mt-2 sm:text-sm">
            Click a destination. We&rsquo;ll match the car.
          </p>
        </div>

        {/* Mobile horizontal chips */}
        <div className="mb-3 flex gap-2 overflow-x-auto pb-2 sm:hidden" style={{ WebkitOverflowScrolling: "touch" }}>
          {destinations
            .filter((d) => !d.isStart)
            .map((d) => (
              <button
                key={d.id}
                onClick={() => selectDestination(d.id)}
                className={`flex-shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-medium whitespace-nowrap transition-all ${
                  selectedId === d.id
                    ? "border-[#1B3A5C] bg-[#1B3A5C] text-white"
                    : "border-gray-200 bg-white text-[#1B3A5C] hover:border-[#1B3A5C]"
                }`}
              >
                {d.name}
              </button>
            ))}
        </div>

        {/* Main layout: map + panel */}
        <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg sm:min-h-[520px] sm:flex-row">
          {/* ── Map container ── */}
          <div className="relative flex-1 bg-[#F0F4F8] sm:flex-[58]">
            <div className="relative h-[340px] w-full sm:h-full sm:min-h-[520px]">
              <svg
                viewBox="0 0 1000 1000"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inset-0 h-full w-full"
                style={{ padding: "12px" }}
              >
                <defs>
                  <filter id="mapGlow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Embed the real SVG map via <image> */}
                <image href="/lb.svg" x="0" y="0" width="1000" height="1000" />

                {/* Route line from Beirut to selected */}
                {selectedDest && (
                  <line
                    x1={beirut.x}
                    y1={beirut.y}
                    x2={selectedDest.x}
                    y2={selectedDest.y}
                    stroke="#1B3A5C"
                    strokeWidth="2.5"
                    strokeDasharray="8 6"
                    strokeLinecap="round"
                    opacity="0.7"
                    filter="url(#mapGlow)"
                    style={{ animation: "dashMove 0.8s linear infinite" }}
                  />
                )}

                {/* Destination pins */}
                {destinations.map((d) => {
                  const isSelected = selectedId === d.id;
                  const isHovered = hoveredId === d.id;
                  const isPopular = popularIds.includes(d.id);
                  const showLabel = d.isStart || isSelected || isHovered;
                  const shouldPulse = d.isStart || isSelected || isPopular;

                  return (
                    <g
                      key={d.id}
                      transform={`translate(${d.x}, ${d.y})`}
                      onClick={() => selectDestination(d.id)}
                      onMouseEnter={() => setHoveredId(d.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      className="cursor-pointer"
                    >
                      {/* Pulse ring */}
                      {shouldPulse && (
                        <circle
                          cx={0}
                          cy={0}
                          r={8}
                          fill="none"
                          stroke={d.isStart ? "#D4A853" : isSelected ? "#1B3A5C" : "#5B9BD5"}
                          strokeWidth={2}
                          opacity={0.6}
                          style={{ animation: "pingRing 2s ease-out infinite" }}
                        />
                      )}

                      {/* Pin dot */}
                      <circle
                        cx={0}
                        cy={0}
                        r={d.isStart ? 10 : isSelected ? 9 : 7}
                        fill={d.isStart ? "#D4A853" : isSelected ? "#1B3A5C" : "#5B9BD5"}
                        stroke="#fff"
                        strokeWidth={d.isStart ? 3 : 2}
                        style={{
                          filter: d.isStart || isSelected ? "url(#mapGlow)" : undefined,
                          transition: "r 0.3s, fill 0.3s",
                        }}
                      />

                      {/* Label */}
                      {d.isStart ? (
                        <text
                          y={-18}
                          textAnchor="middle"
                          fill="#D4A853"
                          fontWeight={700}
                          fontSize={13}
                          style={{ textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}
                        >
                          START
                        </text>
                      ) : (
                        <text
                          y={-16}
                          textAnchor="middle"
                          fill="#1B3A5C"
                          fontWeight={600}
                          fontSize={11}
                          opacity={showLabel ? 1 : 0}
                          style={{
                            transition: "opacity 0.25s",
                            textShadow: "0 1px 3px rgba(255,255,255,0.9)",
                            pointerEvents: "none",
                          }}
                        >
                          {d.name}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* ── Info panel ── */}
          <div
            ref={panelRef}
            className="border-t-4 border-[#1B3A5C] bg-white sm:flex-[42] sm:border-l-4 sm:border-t-0 sm:overflow-y-auto"
          >
            {!selectedDest ? (
              /* Default panel */
              <div className="flex h-full flex-col items-center justify-center p-6 text-center sm:p-10">
                <div className="mb-4 text-5xl sm:text-6xl opacity-40">&#x2022;</div>
                <h3 className="font-serif text-xl font-bold text-gray-900 sm:text-2xl">
                  Select a Destination
                </h3>
                <p className="mt-2 max-w-[260px] text-[12px] leading-relaxed text-gray-500 sm:text-sm">
                  Click any pin on the map to see drive details, recommended car type, and
                  best travel season
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {["Byblos", "Cedars", "Tyre"].map((n) => {
                    const d = destinations.find(
                      (dest) => dest.name.includes(n)
                    );
                    return d ? (
                      <button
                        key={d.id}
                        onClick={() => selectDestination(d.id)}
                        className="rounded-full border border-gray-200 px-3 py-1.5 text-[11px] font-medium text-[#1B3A5C] transition-all hover:border-[#1B3A5C] hover:bg-[#1B3A5C] hover:text-white sm:text-xs"
                      >
                        {d.name}
                      </button>
                    ) : null;
                  })}
                </div>
              </div>
            ) : (
              /* Destination detail */
              <div
                key={selectedDest.id}
                className="flex h-full flex-col p-5 sm:p-8"
                style={{ animation: "slideInPanel 0.4s ease" }}
              >
                <h2 className="font-serif text-2xl font-bold text-gray-900 sm:text-3xl">
                  {selectedDest.name}
                </h2>
                <p className="mt-2 text-[13px] italic leading-relaxed text-gray-500 sm:text-sm">
                  &ldquo;{selectedDest.desc}&rdquo;
                </p>

                {/* Stats grid */}
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-[#F0F4F8] p-3 text-center">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                      Distance
                    </div>
                    <div className="mt-1 text-lg font-bold text-[#1B3A5C]">
                      {selectedDest.distance}
                    </div>
                  </div>
                  <div className="rounded-xl bg-[#F0F4F8] p-3 text-center">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                      Drive Time
                    </div>
                    <div className="mt-1 text-lg font-bold text-[#1B3A5C]">
                      {selectedDest.time}
                    </div>
                  </div>
                </div>

                {/* Recommended car */}
                <div className="mt-4 flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#1B3A5C] to-[#2A5080] p-4">
                  <span className="text-sm font-bold text-white/80">CAR</span>
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-white/60">
                      Recommended
                    </div>
                    <div className="text-base font-bold text-white">
                      {selectedDest.car}
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedDest.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-gray-200 px-3 py-1 text-[11px] font-medium text-[#1B3A5C]"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Season */}
                <div className="mt-3 flex items-center gap-2 text-[12px] text-gray-500 sm:text-[13px]">
                  <span>{selectedDest.season.includes("Dec") ? "Winter" : "Season"}</span>
                  <span>Best: {selectedDest.season}</span>
                </div>

                {/* CTAs */}
                <div className="mt-auto flex flex-col gap-2.5 pt-6">
                  <Link
                    href={`/cars?category=${encodeURIComponent(selectedDest.car)}`}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#1B3A5C] px-5 py-3.5 text-[13px] font-semibold tracking-wide text-white transition-all hover:-translate-y-0.5 hover:bg-[#2A5080] hover:shadow-lg"
                  >
                    Browse {selectedDest.car} Cars &rarr;
                  </Link>
                  <Link
                    href="/road-trips"
                    className="flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 px-5 py-3.5 text-[13px] font-semibold tracking-wide text-[#1B3A5C] transition-all hover:border-[#1B3A5C] hover:bg-[#F0F4F8]"
                  >
                    View Road Trip Guide &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
