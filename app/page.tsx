"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Car, CAR_CATEGORIES, TRANSMISSIONS } from "@/lib/types";
import { loadPublicCarsCache, savePublicCarsCache } from "@/lib/carCache";
import CarCard from "@/components/CarCard";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const MatchMyTrip = dynamic(() => import("@/components/MatchMyTrip"));
const LebanonMap = dynamic(() => import("@/components/LebanonMap"));
const WeatherWidget = dynamic(() => import("@/components/WeatherWidget"));

const PROPERTY_IMAGES = [
  "/property-1.jpeg",
  "/property-2.jpeg",
  "/property-3.jpeg",
  "/property-4.jpeg",
  "/property-5.jpeg",
  "/property-6.jpeg",
];

function PropertySlideshow() {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % PROPERTY_IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <img
        src={PROPERTY_IMAGES[currentIdx]}
        alt="Lebanon Rental property"
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}

/* ── Travel Insights animated tab section ── */
const INSIGHT_TABS = [
  {
    tab: "Road Trips",
    title: "Iconic Road Trips in Lebanon",
    desc: "Explore 17 curated driving routes through the Qadisha Valley, Batroun coast, and Lebanon's mountain passes, with distance, drive time, and recommended car for each.",
    href: "/road-trips",
    image: "/IMG_1657.jpg",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
      </svg>
    ),
  },
  {
    tab: "Seasonal Guide",
    title: "Best Time to Visit Lebanon",
    desc: "Ski Faraya in winter, cruise the Jounieh coast in summer, or enjoy autumn in the Shouf. Our guide covers weather, prices, and the best car for each season.",
    href: "/seasonal-guide",
    image: "/IMG_1658.jpg",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    ),
  },
  {
    tab: "FAQ",
    title: "Everything You Need to Know About Renting",
    desc: "Documents, insurance, fuel policy, age requirements. Our FAQ answers every question so you can book with confidence.",
    href: "/faq",
    image: "/IMG_1660.jpg",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
      </svg>
    ),
  },
];

function InsightsSection() {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    INSIGHT_TABS.forEach((tab) => {
      const img = new window.Image();
      img.src = tab.image;
    });
  }, []);

  const goTo = useCallback(
    (idx: number) => {
      if (idx === active || animating) return;
      setDirection(idx > active ? "right" : "left");
      setAnimating(true);
      setTimeout(() => {
        setActive(idx);
        setTimeout(() => setAnimating(false), 50);
      }, 250);
    },
    [active, animating]
  );

  // Auto-advance every 12s
  useEffect(() => {
    autoRef.current = setInterval(() => {
      setDirection("right");
      setAnimating(true);
      setTimeout(() => {
        setActive((prev) => (prev + 1) % INSIGHT_TABS.length);
        setTimeout(() => setAnimating(false), 50);
      }, 250);
    }, 12000);
    return () => {
      if (autoRef.current) clearInterval(autoRef.current);
    };
  }, []);

  // Reset timer on manual click
  const handleTabClick = useCallback(
    (idx: number) => {
      if (autoRef.current) clearInterval(autoRef.current);
      goTo(idx);
      autoRef.current = setInterval(() => {
        setDirection("right");
        setAnimating(true);
        setTimeout(() => {
          setActive((prev) => (prev + 1) % INSIGHT_TABS.length);
          setTimeout(() => setAnimating(false), 50);
        }, 250);
      }, 12000);
    },
    [goTo]
  );

  const current = INSIGHT_TABS[active];

  return (
    <section className="bg-[#D6EEFB]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-24">
        <div className="mb-6 text-center sm:mb-14">
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-navy sm:text-[12px]">
            Your Lebanon Travel Magazine
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-gray-900 sm:mt-4 sm:text-5xl lg:text-6xl">
            TRAVEL INSIGHTS
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-[#1a4b6e]/50 sm:mt-4 sm:text-base">
            Tips, routes, and local knowledge to help you make the most of every drive.
          </p>
        </div>

        {/* Tab pills */}
        <div className="mb-6 flex justify-center gap-1.5 overflow-x-auto sm:gap-3 sm:mb-10">
          {INSIGHT_TABS.map((tab, i) => (
            <button
              key={tab.tab}
              onClick={() => handleTabClick(i)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-sm px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.12em] transition-all duration-300 sm:px-6 sm:py-3 sm:text-[12px] sm:tracking-[0.15em] ${
                i === active
                  ? "bg-navy text-white shadow-lg shadow-navy/20"
                  : "border border-gray-200 bg-white text-gray-400 hover:border-navy/30 hover:text-navy"
              }`}
            >
              {tab.icon}
              <span className="hidden min-[400px]:inline">{tab.tab}</span>
            </button>
          ))}
        </div>

        {/* Animated magazine card */}
        <div className="relative overflow-hidden rounded-sm shadow-xl shadow-black/5">
          <a
            href={current.href}
            className={`group block bg-white transition-all duration-300 ${
              animating
                ? direction === "right"
                  ? "translate-x-8 opacity-0"
                  : "-translate-x-8 opacity-0"
                : "translate-x-0 opacity-100"
            }`}
          >
            <div className="flex flex-col sm:flex-row">
              {/* Image — bigger */}
              <div className="relative h-56 w-full flex-shrink-0 overflow-hidden sm:h-[420px] sm:w-[50%]">
                <Image
                  key={current.image}
                  src={current.image}
                  alt={current.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-black/5" />
              </div>
              {/* Content — more spacious */}
              <div className="flex flex-1 flex-col justify-center p-6 sm:p-12 lg:p-16">
                <div className="mb-3 flex items-center gap-2 text-navy/40 sm:mb-4">
                  {current.icon}
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] sm:text-[12px]">{current.tab}</span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-gray-900 leading-tight sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
                  {current.title}
                </h3>
                <p className="mt-3 text-[13px] leading-relaxed text-gray-900/50 sm:mt-5 sm:text-lg sm:leading-relaxed">
                  {current.desc}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-navy transition-colors group-hover:text-navy/60 sm:mt-8 sm:text-[13px]">
                  Read Full Guide
                  <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </div>
            </div>
          </a>
        </div>

        {/* Progress dots */}
        <div className="mt-6 flex justify-center gap-2.5 sm:mt-8">
          {INSIGHT_TABS.map((_, i) => (
            <button
              key={i}
              onClick={() => handleTabClick(i)}
              className={`h-2 rounded-full transition-all duration-500 ${
                i === active ? "w-8 bg-navy" : "w-2 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const [transmission, setTransmission] = useState("All");

  // Price range slider state
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 9999]);
  const [priceInited, setPriceInited] = useState(false);
  const [activePriceThumb, setActivePriceThumb] = useState<"min" | "max" | null>(null);
  const [priceBounce, setPriceBounce] = useState(false);
  const bounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);


  useEffect(() => {
    const cachedCars = loadPublicCarsCache();
    if (cachedCars.length > 0) {
      setCars(cachedCars);
      setLoading(false);
    }

    const fetchCars = async () => {
      try {
        const q = query(collection(db, "cars"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Car[];
        const publicCars = data.filter((c) => !c.status || c.status === "approved");
        setCars(publicCars);
        savePublicCarsCache(publicCars);
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const featuredCars = cars.filter((c) => c.featured);

  // Compute available brands from actual car data
  const availableBrands = ["All", ...Array.from(new Set(cars.filter(c => c.available !== false).map(c => c.brand).filter(Boolean))).sort()];

  // Compute min/max prices from available cars
  const availableCars = cars.filter((c) => c.available !== false);
  const dataMinPrice = availableCars.length > 0 ? Math.min(...availableCars.map((c) => c.price)) : 0;
  const dataMaxPrice = availableCars.length > 0 ? Math.max(...availableCars.map((c) => c.price)) : 9999;

  // Initialize price range once cars load
  useEffect(() => {
    if (availableCars.length > 0 && !priceInited) {
      setPriceRange([dataMinPrice, dataMaxPrice]);
      setPriceInited(true);
    }
  }, [availableCars.length, dataMinPrice, dataMaxPrice, priceInited]);

  useEffect(() => {
    return () => { if (bounceRef.current) clearTimeout(bounceRef.current); };
  }, []);

  const handlePriceRelease = () => {
    setActivePriceThumb(null);
    setPriceBounce(true);
    if (bounceRef.current) clearTimeout(bounceRef.current);
    bounceRef.current = setTimeout(() => setPriceBounce(false), 400);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (activeCategory !== "All") params.set("category", activeCategory);
    if (brand !== "All") params.set("brand", brand);
    if (transmission !== "All") params.set("transmission", transmission);
    if (priceInited && priceRange[0] > dataMinPrice) params.set("minPrice", String(priceRange[0]));
    if (priceInited && priceRange[1] < dataMaxPrice) params.set("maxPrice", String(priceRange[1]));
    router.push(`/cars${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <div className="min-h-screen bg-luxury-black">
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden" style={{ height: "clamp(480px, 60vw, 85vh)" }}>
        <Image
          src="/hero-car.png"
          alt="Luxury car on Lebanese mountain road"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
        <div className="absolute inset-x-0 bottom-0 px-4 pb-8 sm:pb-14 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-5 text-2xl font-extrabold leading-tight text-white drop-shadow-lg sm:text-4xl lg:text-5xl">
              Discover Lebanon&apos;s Premium Car Rentals
            </h1>
            <div className="flex items-stretch gap-2">
              <div className="relative flex-1">
                <svg
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 sm:left-4 sm:h-5 sm:w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
                  placeholder="Search by name, brand, year..."
                  className="w-full border border-white/20 bg-white/95 py-3 pl-10 pr-4 text-[13px] font-bold text-gray-900 placeholder-gray-400 placeholder:font-bold outline-none transition-all focus:border-navy focus:ring-1 focus:ring-navy sm:py-4 sm:pl-12 sm:text-sm rounded-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <button
                onClick={handleSearch}
                className="flex items-center gap-1.5 bg-navy px-4 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-navy-light sm:px-6 sm:py-4 sm:text-[12px] rounded-sm"
              >
                <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FILTERS (under hero) ─── */}
      <div className="bg-[#D6EEFB]">
        <div id="collection" className="mx-auto max-w-7xl px-4 pt-4 pb-4 sm:px-6 sm:pt-6 sm:pb-6 lg:px-8">
          <p className="mx-auto max-w-xl text-center text-sm text-[#1a4b6e]/60 mb-3">
            50+ handpicked cars for every road, season, and adventure across Lebanon.
          </p>

              {/* Price range slider - always visible */}
              {priceInited && dataMaxPrice > dataMinPrice && (
                <div className="mx-auto max-w-2xl mb-4">
                  <p className="text-[11px] font-bold text-[#1a4b6e] mb-2 sm:text-[12px]">Price Range</p>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-semibold text-[#1a4b6e]/50">${dataMinPrice}</span>
                    <div className="relative flex-1 h-6 flex items-center">
                      <div className="absolute left-0 right-0 h-[5px] rounded-full bg-gray-200/80" />
                      <div
                        className={`absolute h-[5px] rounded-full ${activePriceThumb ? "bg-[#1B4F72] shadow-[0_0_12px_3px_rgba(27,79,114,0.45)]" : "bg-[#1B4F72]/70 shadow-none"}`}
                        style={{ left: `${((priceRange[0] - dataMinPrice) / (dataMaxPrice - dataMinPrice)) * 100}%`, right: `${100 - ((priceRange[1] - dataMinPrice) / (dataMaxPrice - dataMinPrice)) * 100}%` }}
                      />
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none" style={{ left: `${((priceRange[0] - dataMinPrice) / (dataMaxPrice - dataMinPrice)) * 100}%` }}>
                        <svg className={`text-[#1B4F72] transition-all duration-200 ${activePriceThumb === "min" ? "h-12 w-12 drop-shadow-[0_0_10px_rgba(27,79,114,0.45)]" : "h-10 w-10"}`} viewBox="0 0 48 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                          <path d="M8 14h32v2H8z" fill="currentColor" /><path d="M6 12c0-2 2-4 4-4h6l4-4h8l2 4h6c2 0 4 2 4 4v4H6v-4z" fill="currentColor" /><path d="M14 8h4l-2-3h-4l2 3z" fill="white" opacity="0.45" /><path d="M20 8h6l-1-3h-4l-1 3z" fill="white" opacity="0.45" /><circle cx="14" cy="16" r="3" fill="#0f2f47" /><circle cx="34" cy="16" r="3" fill="#0f2f47" />
                        </svg>
                      </div>
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none" style={{ left: `${((priceRange[1] - dataMinPrice) / (dataMaxPrice - dataMinPrice)) * 100}%` }}>
                        <svg className={`text-[#1B4F72] [transform:scaleX(-1)] transition-all duration-200 ${activePriceThumb === "max" ? "h-12 w-12 drop-shadow-[0_0_10px_rgba(27,79,114,0.45)]" : "h-10 w-10"}`} viewBox="0 0 48 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                          <path d="M8 14h32v2H8z" fill="currentColor" /><path d="M6 12c0-2 2-4 4-4h6l4-4h8l2 4h6c2 0 4 2 4 4v4H6v-4z" fill="currentColor" /><path d="M14 8h4l-2-3h-4l2 3z" fill="white" opacity="0.45" /><path d="M20 8h6l-1-3h-4l-1 3z" fill="white" opacity="0.45" /><circle cx="14" cy="16" r="3" fill="#0f2f47" /><circle cx="34" cy="16" r="3" fill="#0f2f47" />
                        </svg>
                      </div>
                      <input type="range" min={dataMinPrice} max={dataMaxPrice} value={priceRange[0]} onPointerDown={() => setActivePriceThumb("min")} onChange={(e) => { const v = Number(e.target.value); setPriceRange([Math.min(v, priceRange[1]), priceRange[1]]); }} onPointerUp={handlePriceRelease} onTouchEnd={handlePriceRelease} className={"price-slider absolute inset-0 w-full opacity-0 " + (activePriceThumb === "min" ? "z-30" : "z-20")} aria-label="Minimum daily price" />
                      <input type="range" min={dataMinPrice} max={dataMaxPrice} value={priceRange[1]} onPointerDown={() => setActivePriceThumb("max")} onChange={(e) => { const v = Number(e.target.value); setPriceRange([priceRange[0], Math.max(v, priceRange[0])]); }} onPointerUp={handlePriceRelease} onTouchEnd={handlePriceRelease} className={"price-slider absolute inset-0 w-full opacity-0 " + (activePriceThumb === "max" ? "z-30" : "z-20")} aria-label="Maximum daily price" />
                    </div>
                    <span className="text-[10px] font-semibold text-[#1a4b6e]/50">${dataMaxPrice}</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className={`inline-block bg-[#1B4F72] text-white text-[10px] font-bold px-2.5 py-1 rounded-sm transition-transform duration-200 ${activePriceThumb === "min" ? "scale-125" : ""} ${priceBounce ? "price-badge-bounce" : ""}`}>${priceRange[0]}<span className="text-white/50 font-normal">/day</span></span>
                    <span className={`inline-block bg-[#1B4F72] text-white text-[10px] font-bold px-2.5 py-1 rounded-sm transition-transform duration-200 ${activePriceThumb === "max" ? "scale-125" : ""} ${priceBounce ? "price-badge-bounce" : ""}`}>${priceRange[1]}<span className="text-white/50 font-normal">/day</span></span>
                  </div>
                </div>
              )}

              {/* FILTERS toggle */}
              <div className="mx-auto max-w-2xl mb-1">
                <button
                  onClick={() => setShowMoreFilters(!showMoreFilters)}
                  className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#1a4b6e] transition-colors hover:text-[#1a4b6e]/70 sm:text-[12px]"
                >
                  <svg className={`h-4 w-4 transition-transform ${showMoreFilters ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  Filters
                </button>
              </div>

              {/* Collapsible filter panel */}
              {showMoreFilters && (
                <div className="mx-auto max-w-3xl space-y-4 mb-2 animate-fade-in-up">
                  {/* Category tabs */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 whitespace-nowrap sm:flex-wrap sm:justify-center sm:overflow-visible sm:pb-0">
                    {CAR_CATEGORIES.map((cat) => {
                      const isActive = activeCategory === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          className={
                            "px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] transition-all sm:px-4 sm:py-2.5 sm:text-[11px] rounded-sm " +
                            (isActive
                              ? "bg-[#1a4b6e] text-white"
                              : "border border-gray-300 bg-white text-gray-500 hover:border-[#1a4b6e]/30 hover:text-gray-700")
                          }
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>

                  {/* Brand & Transmission */}
                  <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-3">
                    <select
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full border border-gray-300 bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-500 outline-none transition-colors focus:border-[#1a4b6e] [color-scheme:light] sm:w-auto sm:px-4 sm:py-2.5 sm:text-[11px] rounded-sm"
                    >
                      {availableBrands.map((b) => (
                        <option key={b} value={b}>
                          {b === "All" ? "All Brands" : b}
                        </option>
                      ))}
                    </select>
                    <select
                      value={transmission}
                      onChange={(e) => setTransmission(e.target.value)}
                      className="w-full border border-gray-300 bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-500 outline-none transition-colors focus:border-[#1a4b6e] [color-scheme:light] sm:w-auto sm:px-4 sm:py-2.5 sm:text-[11px] rounded-sm"
                    >
                      <option value="All">All Transmissions</option>
                      {TRANSMISSIONS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-4 pb-6 sm:px-6 sm:pt-8 sm:pb-8 lg:px-8">
        {/* Featured section header */}
        <div className="mb-3 flex items-center justify-between sm:mb-4">
          <div className="flex items-center gap-2.5">
            <svg className="h-4 w-4 text-navy" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-navy sm:text-[13px]">
              Featured Cars
            </span>
          </div>
          <Link
            href="/cars"
            className="inline-flex items-center gap-1.5 bg-navy px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white transition-colors hover:bg-navy-light sm:px-6 sm:py-3 sm:text-[11px] rounded-sm"
          >
            View All
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </Link>
        </div>

        {/* Featured car grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="overflow-hidden border border-luxury-border bg-luxury-card">
                <div className="aspect-[16/10] lux-pulse bg-luxury-dark" />
                <div className="border-t border-luxury-border p-3 sm:p-5 space-y-2 sm:space-y-3">
                  <div className="h-2.5 w-16 bg-luxury-border lux-pulse" />
                  <div className="h-4 w-3/4 bg-luxury-border lux-pulse" />
                  <div className="h-2.5 w-1/2 bg-luxury-border lux-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : featuredCars.length === 0 ? (
          <p className="text-center text-sm text-navy/40 py-8">No featured cars yet.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
              {featuredCars.map((car) => (
                <div key={car.id} className="car-grid-card">
                  <CarCard car={car} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ─── BROWSE BY CATEGORY ─── */}
      <section className="bg-[#D6EEFB]">
        <div className="mx-auto max-w-6xl px-3 py-3 sm:px-6 sm:py-16">
          <div className="mb-2 text-center sm:mb-8">
            <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-navy sm:text-[10px] sm:tracking-[0.5em]">Find your perfect match</p>
            <h2 className="mt-1 font-serif text-lg font-bold text-gray-900 sm:mt-3 sm:text-4xl">BROWSE BY CATEGORY</h2>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
            {([
              { name: "Sedan", img: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop&q=80" },
              { name: "SUV", img: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&h=300&fit=crop&q=80" },
              { name: "Luxury", img: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=300&fit=crop&q=80" },
              { name: "Economy", img: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&h=300&fit=crop&q=80" },
              { name: "4x4", img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=300&fit=crop&q=80" },
              { name: "Convertible", img: "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=400&h=300&fit=crop&q=80" },
            ] as const).map((cat) => (
              <Link
                key={cat.name}
                href={`/cars?category=${encodeURIComponent(cat.name)}`}
                className="group relative flex-shrink-0 overflow-hidden border border-luxury-border transition-all hover:border-navy/40"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
                    <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-white sm:text-[12px] sm:tracking-[0.2em]">
                      {cat.name}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── EXPLORE LEBANON MAP ─── */}
      <LebanonMap />

      {/* ─── LIVE WEATHER ─── */}
      <WeatherWidget />

      {/* ─── COMPLETE YOUR STAY ─── */}
      <section className="relative overflow-hidden border-b border-luxury-border">
        <div className="relative mx-auto max-w-6xl px-3 py-4 sm:px-6 sm:py-10">
          <div className="flex items-stretch gap-3 sm:gap-8">
            {/* Left: text */}
            <div className="flex flex-1 flex-col justify-center">
              <p className="text-[8px] font-bold uppercase tracking-[0.4em] text-navy sm:text-[10px] sm:tracking-[0.5em]">
                Cross Promotion
              </p>
              <h2 className="mt-1 font-serif text-base font-bold text-gray-900 leading-tight sm:mt-2 sm:text-2xl lg:text-3xl">
                STAYING IN LEBANON?
              </h2>
              <p className="mt-1 text-[11px] font-medium leading-snug text-navy sm:mt-2 sm:text-sm">
                Get a premium car delivered to your villa or chalet
              </p>
              <p className="mt-1 hidden text-[12px] leading-relaxed text-gray-900/30 sm:block">
                Priority delivery to 1,000+ properties across Lebanon.
              </p>
              <div className="mt-2 flex items-center gap-2 sm:mt-3">
                <Link
                  href="/cars"
                  className="inline-block border border-navy bg-navy px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-white transition-all hover:bg-navy-light sm:px-5 sm:py-2.5 sm:text-[11px] sm:tracking-[0.2em]"
                >
                  Our Fleet
                </Link>
                <a
                  href="https://lebanon-rental.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block border border-gray-300 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-gray-900/50 transition-all hover:bg-gray-100 sm:px-5 sm:py-2.5 sm:text-[11px] sm:tracking-[0.2em]"
                >
                  Properties &rarr;
                </a>
              </div>
            </div>

            {/* Right: looping property photos */}
            <div className="relative w-[42%] flex-shrink-0 overflow-hidden rounded-sm sm:w-[340px] lg:w-[400px]">
              <div className="relative h-full min-h-[140px] sm:min-h-[200px]">
                <PropertySlideshow />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TRAVEL INSIGHTS (animated tabs) ─── */}
      <InsightsSection />

      {/* ─── MATCH MY TRIP QUIZ ─── */}
      <MatchMyTrip />

      {/* ─── STATS (bottom) ─── */}
      <section className="border-t border-luxury-border bg-luxury-card">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-6 px-4 py-8 sm:gap-12 sm:py-16 md:gap-16">
          <div className="text-center">
            <div className="font-serif text-4xl font-bold text-gray-900 sm:text-5xl">50+</div>
            <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-900/40">
              Luxury Cars
            </div>
          </div>
          <div className="h-12 w-px bg-luxury-border" />
          <div className="text-center">
            <div className="font-serif text-4xl font-bold text-gray-900 sm:text-5xl">24/7</div>
            <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-900/40">
              Support
            </div>
          </div>
          <div className="h-12 w-px bg-luxury-border" />
          <div className="text-center">
            <div className="font-serif text-4xl font-bold text-gray-900 sm:text-5xl">VIP</div>
            <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-900/40">
              Service
            </div>
          </div>
          <div className="h-12 w-px bg-luxury-border" />
          <a href="https://lebanon-rental.com" target="_blank" rel="noopener noreferrer" className="text-center group">
            <div className="font-serif text-4xl font-bold text-gray-900 transition-colors group-hover:text-navy-light sm:text-5xl">1000+</div>
            <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-900/40 transition-colors group-hover:text-navy">
              Partner Properties
            </div>
          </a>
        </div>
      </section>
    </div>
  );
}
