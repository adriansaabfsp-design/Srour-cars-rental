"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Car, CAR_CATEGORIES, ROAD_TYPES, BRANDS, FUEL_TYPES, TRANSMISSIONS } from "@/lib/types";
import CarCard from "@/components/CarCard";
import Image from "next/image";
import Link from "next/link";

const PROPERTY_IMAGES = [
  "/property-1.jpeg",
  "/property-2.jpeg",
  "/property-3.jpeg",
  "/property-4.jpeg",
  "/property-5.jpeg",
  "/property-6.jpeg",
];

function PropertySlideshow() {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(false);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(true);
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
      transitionTimeoutRef.current = setTimeout(() => {
        setIdx((prevIdx) => {
          if (PROPERTY_IMAGES.length <= 1) return prevIdx;
          let nextIdx = (prevIdx + 1) % PROPERTY_IMAGES.length;
          let guard = 0;
          while (
            PROPERTY_IMAGES[nextIdx] === PROPERTY_IMAGES[prevIdx] &&
            guard < PROPERTY_IMAGES.length
          ) {
            nextIdx = (nextIdx + 1) % PROPERTY_IMAGES.length;
            guard += 1;
          }
          return nextIdx;
        });
        setFade(false);
      }, 600);
    }, 5000);
    return () => {
      clearInterval(timer);
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  return (
    <img
      src={PROPERTY_IMAGES[idx]}
      alt="Lebanon Rental property"
      className={`h-full w-full object-cover transition-opacity duration-600 ${fade ? "opacity-0" : "opacity-100"}`}
    />
  );
}

export default function Home() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeRoad, setActiveRoad] = useState("All Terrain");
  const [brand, setBrand] = useState("All");
  const [fuel, setFuel] = useState("All");
  const [transmission, setTransmission] = useState("All");
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroTransition, setHeroTransition] = useState(false);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const q = query(collection(db, "cars"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Car[];
        setCars(data);
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const featuredCars = cars.filter((c) => c.featured);

  const heroNext = useCallback(() => {
    if (featuredCars.length <= 1) return;
    setHeroTransition(true);
    setTimeout(() => {
      setHeroIndex((p) => (p + 1) % featuredCars.length);
      setHeroTransition(false);
    }, 400);
  }, [featuredCars.length]);

  const heroPrev = useCallback(() => {
    if (featuredCars.length <= 1) return;
    setHeroTransition(true);
    setTimeout(() => {
      setHeroIndex((p) => (p - 1 + featuredCars.length) % featuredCars.length);
      setHeroTransition(false);
    }, 400);
  }, [featuredCars.length]);

  useEffect(() => {
    if (featuredCars.length <= 1) return;
    const timer = setInterval(heroNext, 5000);
    return () => clearInterval(timer);
  }, [heroNext, featuredCars.length]);

  const currentHeroCar =
    featuredCars.length > 0 ? featuredCars[heroIndex % featuredCars.length] : null;

  const filteredCars = cars
    .filter((car) => {
      if (car.available === false) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const s = (
          car.name + " " + car.brand + " " + car.year + " " + car.fuel + " " +
          car.transmission + " " + (car.category || "")
        ).toLowerCase();
        if (!s.includes(q)) return false;
      }
      if (activeCategory !== "All" && car.category !== activeCategory) return false;
      if (activeRoad !== "All Terrain" && (!car.roadTypes || !car.roadTypes.includes(activeRoad)))
        return false;
      if (brand !== "All" && car.brand !== brand) return false;
      if (fuel !== "All" && car.fuel !== fuel) return false;
      if (transmission !== "All" && car.transmission !== transmission) return false;
      return true;
    })
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });

  const resetFilters = () => {
    setSearchQuery("");
    setActiveCategory("All");
    setActiveRoad("All Terrain");
    setBrand("All");
    setFuel("All");
    setTransmission("All");
  };


  const hasFilters =
    searchQuery || activeCategory !== "All" || activeRoad !== "All Terrain" || brand !== "All" || fuel !== "All" || transmission !== "All";

  return (
    <div className="min-h-screen bg-luxury-black">
      {/* ─── HERO ─── */}
      {/* MOBILE: crossfading logo/tagline + car train marquee */}
      <section className="relative overflow-hidden sm:hidden bg-luxury-black">
        {/* Hero background with subtle overlay to fill the top bar on mobile */}
        <div className="absolute inset-0">
          {currentHeroCar ? (
            <img
              src={currentHeroCar.photos?.main || currentHeroCar.images?.[0] || ""}
              alt={currentHeroCar.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-[radial-gradient(ellipse_90%_55%_at_50%_-10%,_rgba(27,58,92,0.18),_transparent)]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/70" />
        </div>

        {/* Crossfading Logo ↔ Tagline */}
        <div className="relative flex items-center justify-center px-4 pt-6 pb-4" style={{ height: "180px" }}>
          {/* Lebanon Rental logo */}
          <div className="hero-crossfade-a absolute inset-0 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Lebanon Rental"
              width={400}
              height={400}
              className="h-44 w-auto drop-shadow-[0_6px_42px_rgba(0,0,0,0.65)]"
              priority
            />
          </div>
          {/* Rent Your Dream Ride tagline */}
          <div className="hero-crossfade-b absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="font-serif text-lg font-light italic tracking-wide text-white/80">
              Rent Your
            </p>
            <p className="mt-1 font-serif text-[2.1rem] font-black uppercase tracking-[0.16em] text-white leading-tight drop-shadow-[0_3px_24px_rgba(0,0,0,0.6)]">
              Dre<img src="/cedar.png" alt="a" className="inline-block h-[0.85em] w-auto mx-[-0.02em] align-baseline" />m Ride
            </p>
          </div>
          <div className="hero-tagline-line absolute bottom-5 left-1/2 -translate-x-1/2 h-[1px] w-28 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>

        {/* Auto-scrolling car train + search icon */}
        <div className="relative w-full overflow-hidden pb-3">
          {/* Search icon overlay */}
          <button
            onClick={() => document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" })}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-all hover:bg-white"
            aria-label="Search cars"
          >
            <svg className="h-4 w-4 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <div className="car-train-track flex">
            {/* Duplicate the list for seamless infinite scroll */}
            {[...featuredCars, ...featuredCars, ...featuredCars, ...featuredCars].map((car, i) => (
              <Link
                key={car.id + "-" + i}
                href={"/cars/" + car.id}
                className="car-train-card relative flex-shrink-0 w-36 mx-1 overflow-hidden group"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={car.photos?.main || car.images?.[0] || ""}
                    alt={car.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-2.5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                      {car.brand}
                    </p>
                    <p className="text-sm font-bold text-white leading-tight truncate">
                      {car.name}
                    </p>
                    <p className="mt-0.5 text-xs font-extrabold text-white/90">
                      ${car.price}<span className="text-[9px] font-normal text-white/50">/day</span>
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* DESKTOP: existing immersive hero */}
      <section className="relative hidden w-full overflow-hidden bg-white sm:block">
        <div className="relative h-[70vh] lg:h-[80vh]">
          {/* background image */}
          {currentHeroCar ? (
            <div
              className={
                "absolute inset-0 transition-all duration-500 ease-in-out " +
                (heroTransition ? "opacity-0 scale-[1.03]" : "opacity-100 scale-100")
              }
            >
              <img
                src={currentHeroCar.photos?.main || currentHeroCar.images?.[0] || ""}
                alt={currentHeroCar.name}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,_rgba(27,58,92,0.15),_transparent)]" />
          )}

          {/* overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30" />

          {/* corner logo */}
          <div className="absolute left-8 top-8 z-10 pointer-events-none lg:left-12 lg:top-10">
            <div className="hero-corner-enter">
              <Image
                src="/logo.png"
                alt="Lebanon Rental"
                width={400}
                height={400}
                className="h-40 w-auto drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)] lg:h-52"
                priority
              />
            </div>
          </div>

          {/* center tagline */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center px-4">
              <div className="hero-tagline-reveal">
                <p className="font-serif text-4xl font-light italic tracking-wide text-white/80 drop-shadow-lg lg:text-5xl">
                  Rent Your
                </p>
                <p className="hero-tagline-word mt-1 font-serif text-6xl font-black uppercase tracking-[0.15em] lg:text-7xl">
                  <span className="text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]">Dre<img src="/cedar.png" alt="a" className="inline-block h-[0.85em] w-auto mx-[-0.01em] align-baseline drop-shadow-[0_2px_12px_rgba(27,58,92,0.5)]" />m Ride</span>
                </p>
                <div className="hero-tagline-line mx-auto mt-4 h-[2px] w-0 bg-gradient-to-r from-transparent via-navy to-transparent" />
              </div>
            </div>
          </div>

          {/* car info bar */}
          {currentHeroCar && (
            <div className="absolute bottom-12 left-0 right-0 px-8 lg:px-12">
              <div
                className={
                  "transition-all duration-400 " +
                  (heroTransition ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0")
                }
              >
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-[0.35em] text-white/50">
                      {currentHeroCar.brand} &middot; {currentHeroCar.year}
                    </div>
                    <h2 className="font-serif text-3xl font-bold text-white lg:text-4xl">
                      {currentHeroCar.name}
                    </h2>
                    <div className="mt-1 flex items-center gap-3 text-xs text-white/40">
                      <span>{currentHeroCar.transmission}</span>
                      <span>&middot;</span>
                      <span>{currentHeroCar.fuel}</span>
                      {currentHeroCar.category && (
                        <>
                          <span>&middot;</span>
                          <span>{currentHeroCar.category}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="bg-white/90 backdrop-blur-sm px-6 py-3">
                      <span className="text-2xl font-extrabold text-black">
                        ${currentHeroCar.price}
                      </span>
                      <span className="text-xs font-bold text-black/50">/day</span>
                    </div>
                    <Link
                      href={"/cars/" + currentHeroCar.id}
                      className="mt-2 inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-white"
                    >
                      View Details &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* arrows */}
          {featuredCars.length > 1 && (
            <>
              <button
                onClick={heroPrev}
                className="absolute left-6 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center bg-black/40 text-white/70 backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={heroNext}
                className="absolute right-6 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center bg-black/40 text-white/70 backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* dots */}
          {featuredCars.length > 1 && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {featuredCars.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setHeroTransition(true);
                    setTimeout(() => {
                      setHeroIndex(i);
                      setHeroTransition(false);
                    }, 400);
                  }}
                  className={
                    "transition-all duration-300 " +
                    (i === heroIndex % featuredCars.length
                      ? "h-2 w-7 bg-white"
                      : "h-2 w-2 bg-white/30 hover:bg-white/50")
                  }
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── BROWSE BY CATEGORY ─── */}
      <section className="border-b border-luxury-border">
        <div className="mx-auto max-w-6xl px-3 py-3 sm:px-6 sm:py-16">
          <div className="mb-2 text-center sm:mb-8">
            <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-navy sm:text-[10px] sm:tracking-[0.5em]">Find your perfect match</p>
            <h2 className="mt-1 font-serif text-lg font-bold text-gray-900 sm:mt-3 sm:text-4xl">BROWSE BY CATEGORY</h2>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:gap-4 sm:justify-center sm:flex-wrap sm:overflow-visible sm:pb-0">
            {([
              { name: "Sedan", icon: <svg className="h-6 w-6 sm:h-10 sm:w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M5 17h14M3 13l2.5-5h13L21 13M7 17a2 2 0 11-4 0M21 17a2 2 0 11-4 0" strokeLinecap="round" strokeLinejoin="round" /><rect x="3" y="13" width="18" height="4" rx="1" strokeLinecap="round" strokeLinejoin="round" /></svg> },
              { name: "SUV", icon: <svg className="h-6 w-6 sm:h-10 sm:w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M5 17h14M3 13l1.5-4h15L21 13M7 17a2 2 0 11-4 0M21 17a2 2 0 11-4 0" strokeLinecap="round" strokeLinejoin="round" /><rect x="3" y="9" width="18" height="8" rx="2" strokeLinecap="round" strokeLinejoin="round" /></svg> },
              { name: "Luxury", icon: <svg className="h-6 w-6 sm:h-10 sm:w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4.5L6 21l1.5-7.5L2 9h7l3-7z" strokeLinecap="round" strokeLinejoin="round" /></svg> },
              { name: "Economy", icon: <svg className="h-6 w-6 sm:h-10 sm:w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 0V4m0 16v-4m8-4h-4M8 12H4" strokeLinecap="round" strokeLinejoin="round" /></svg> },
              { name: "4x4", icon: <svg className="h-6 w-6 sm:h-10 sm:w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M5 17h14M2 13l2-5h16l2 5M7 17a2.5 2.5 0 11-5 0M22 17a2.5 2.5 0 11-5 0M10 8V5M14 8V5" strokeLinecap="round" strokeLinejoin="round" /><rect x="2" y="13" width="20" height="4" rx="1" strokeLinecap="round" strokeLinejoin="round" /></svg> },
              { name: "Convertible", icon: <svg className="h-6 w-6 sm:h-10 sm:w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M5 17h14M3 13l2.5-5h8l4.5 1L21 13M7 17a2 2 0 11-4 0M21 17a2 2 0 11-4 0" strokeLinecap="round" strokeLinejoin="round" /><rect x="3" y="13" width="18" height="4" rx="1" strokeLinecap="round" strokeLinejoin="round" /></svg> },
            ] as const).map((cat) => (
              <button
                key={cat.name}
                onClick={() => {
                  setActiveCategory(cat.name);
                  document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="group flex-shrink-0 flex min-w-[72px] flex-col items-center gap-1.5 border border-luxury-border bg-luxury-card px-3 py-2 transition-all hover:border-navy/40 hover:bg-white/[0.02] sm:min-w-0 sm:gap-2 sm:px-10 sm:py-6"
              >
                <div className="text-gray-900/20 transition-colors group-hover:text-gray-900/60">{cat.icon}</div>
                <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-gray-900/40 transition-colors group-hover:text-gray-900/70 sm:text-[11px] sm:tracking-[0.2em]">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

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
                  href="/#collection"
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
              <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-white to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-white to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-white to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-white to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── COLLECTION ─── */}
      <div id="collection" className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-8 lg:px-8">
        {/* heading */}
        <div className="mb-4 text-center sm:mb-6">
          <h2 className="font-serif text-2xl font-bold text-gray-900 sm:text-4xl">
            CHOOSE YOUR CAR RENTAL
          </h2>
          <div className="mx-auto mt-2 h-[2px] w-16 bg-navy/30 sm:mt-3 sm:w-20" />
        </div>

        {/* search */}
        <div className="mx-auto mb-3 max-w-2xl sm:mb-5">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-900/30 sm:left-4 sm:h-5 sm:w-5"
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
              placeholder="Search by name, brand, year..."
              className="w-full border border-luxury-border bg-luxury-card py-2.5 pl-10 pr-4 text-[13px] text-gray-900 placeholder-white/30 outline-none transition-all focus:border-navy/50 sm:py-3.5 sm:pl-12 sm:text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-900/30 hover:text-gray-900"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* category tabs */}
        <div className="mb-3 flex items-center gap-2 overflow-x-auto pb-1 whitespace-nowrap sm:mb-4 sm:flex-wrap sm:justify-center sm:overflow-visible sm:pb-0">
          {CAR_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            const count =
              cat === "All"
                ? cars.filter((c) => c.available !== false).length
                : cars.filter((c) => c.category === cat && c.available !== false).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={
                  "px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] transition-all sm:px-4 sm:py-2.5 sm:text-[11px] " +
                  (isActive
                    ? "bg-navy text-white"
                    : "border border-luxury-border bg-luxury-card text-gray-900/50 hover:border-navy/30 hover:text-gray-900")
                }
              >
                {cat}
                {count > 0 && (
                  <span className={"ml-1.5 text-[9px] " + (isActive ? "text-gray-900/50" : "text-navy")}>
                    ({count})
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* road type pills */}
        <div className="mb-3 flex items-center gap-2 overflow-x-auto pb-1 whitespace-nowrap sm:mb-4 sm:flex-wrap sm:justify-center sm:overflow-visible sm:pb-0">
          <span className="mr-1 text-[8px] font-bold uppercase tracking-[0.2em] text-gray-900/25 sm:text-[9px] sm:tracking-[0.25em]">
            Best for:
          </span>
          {ROAD_TYPES.map((road) => {
            const isActive = activeRoad === road;
            return (
              <button
                key={road}
                onClick={() => setActiveRoad(road)}
                className={
                  "px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider transition-all sm:px-3 sm:text-[10px] " +
                  (isActive
                    ? "border border-navy bg-navy/15 text-gray-900"
                    : "border border-luxury-border text-gray-900/30 hover:border-white/20 hover:text-gray-900/50")
                }
              >
                {road === "All Terrain" ? "All" : road}
              </button>
            );
          })}
        </div>

        {/* dropdowns row */}
        <div className="mb-4 grid grid-cols-2 gap-2 sm:mb-6 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-3">
          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full border border-luxury-border bg-luxury-card px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-900/50 outline-none transition-colors focus:border-navy [color-scheme:light] sm:w-auto sm:px-4 sm:py-2.5 sm:text-[11px]"
          >
            {BRANDS.map((b) => (
              <option key={b} value={b}>
                {b === "All" ? "All Brands" : b}
              </option>
            ))}
          </select>
          <select
            value={fuel}
            onChange={(e) => setFuel(e.target.value)}
            className="w-full border border-luxury-border bg-luxury-card px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-900/50 outline-none transition-colors focus:border-navy [color-scheme:light] sm:w-auto sm:px-4 sm:py-2.5 sm:text-[11px]"
          >
            <option value="All">All Fuel Types</option>
            {FUEL_TYPES.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
          <select
            value={transmission}
            onChange={(e) => setTransmission(e.target.value)}
            className="col-span-2 w-full border border-luxury-border bg-luxury-card px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-900/50 outline-none transition-colors focus:border-navy [color-scheme:light] sm:col-span-1 sm:w-auto sm:px-4 sm:py-2.5 sm:text-[11px]"
          >
            <option value="All">All Transmissions</option>
            {TRANSMISSIONS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {hasFilters && (
            <button
              onClick={resetFilters}
              className="col-span-2 text-[9px] font-bold uppercase tracking-wider text-gray-900/50 transition-colors hover:text-gray-900 sm:col-span-1 sm:text-[10px]"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* result count */}
        <div className="mb-3 sm:mb-4">
          <p className="text-xs text-luxury-muted sm:text-sm">
            {loading ? (
              <span className="lux-pulse">Loading fleet...</span>
            ) : (
              <>
                {filteredCars.length} vehicle{filteredCars.length !== 1 ? "s" : ""}
                {activeCategory !== "All" && (
                  <span className="text-gray-900/60"> &middot; {activeCategory}</span>
                )}
                {activeRoad !== "All Terrain" && (
                  <span className="text-gray-900/60"> &middot; {activeRoad}</span>
                )}
              </>
            )}
          </p>
        </div>

        {/* car grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
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
        ) : filteredCars.length === 0 ? (
          <div className="flex flex-col items-center justify-center border border-luxury-border bg-luxury-card py-14 sm:py-20">
            <svg className="h-16 w-16 text-gray-900/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="mt-4 font-serif text-2xl font-bold text-gray-900">NO VEHICLES FOUND</h3>
            <p className="mt-2 text-sm text-gray-900/40">Adjust your filters to discover more</p>
            <button
              onClick={resetFilters}
              className="mt-6 border border-navy bg-transparent px-8 py-3 text-[12px] font-bold uppercase tracking-[0.2em] text-gray-900/60 transition-all hover:bg-navy hover:text-white"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4 stagger-children">
            {filteredCars.map((car) => (
              <div key={car.id} className="animate-fade-in-up opacity-0">
                <CarCard car={car} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── TRAVEL INSIGHTS ─── */}
      <section className="border-t border-luxury-border">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-20">
          <div className="mb-6 text-center sm:mb-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-navy">From our blog</p>
            <h2 className="mt-3 font-serif text-2xl font-bold text-gray-900 sm:text-4xl">TRAVEL INSIGHTS</h2>
            <div className="mx-auto mt-4 h-[2px] w-16 bg-gradient-to-r from-transparent via-navy to-transparent" />
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              {
                title: "Iconic Road Trips in Lebanon",
                desc: "Discover 17 unforgettable driving routes across mountains, coast, and hidden gems — curated for every season.",
                href: "/road-trips",
              },
              {
                title: "Best Time to Visit Lebanon",
                desc: "A complete seasonal guide to weather, crowds, prices, and the perfect car for every month of the year.",
                href: "/seasonal-guide",
              },
              {
                title: "Everything You Need to Know About Renting",
                desc: "From documents to fuel policy — our comprehensive FAQ covers every question first-time renters ask.",
                href: "/faq",
              },
            ].map((article) => (
              <a
                key={article.title}
                href={article.href}
                className="group border border-luxury-border bg-luxury-card p-6 transition-all hover:border-navy/30"
              >
                <div className="mb-4 h-[2px] w-8 bg-navy/30 transition-all group-hover:w-12 group-hover:bg-navy" />
                <h3 className="font-serif text-lg font-bold text-gray-900 transition-colors group-hover:text-gray-900">
                  {article.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-gray-900/30">
                  {article.desc}
                </p>
                <span className="mt-4 inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-navy transition-colors group-hover:text-gray-900/60">
                  Read More &rarr;
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ─── INSTAGRAM WIDGET ─── */}
      <section className="border-t border-luxury-border">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-20">
          <div className="mb-6 text-center sm:mb-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-navy">Follow us</p>
            <h2 className="mt-3 font-serif text-2xl font-bold text-gray-900 sm:text-4xl">
              @LEBANON.RENTAL
            </h2>
            <div className="mx-auto mt-4 h-[2px] w-16 bg-gradient-to-r from-transparent via-navy to-transparent" />
          </div>
          <div className="relative w-full overflow-hidden rounded-sm">
            <iframe
              src="https://f2ebe9a82e094dde98dfe2f1d10431fd.elf.site"
              title="Instagram Feed"
              className="h-[460px] w-full border-0 sm:h-[640px]"
              loading="lazy"
              allowTransparency
            />
            {/* Cover Elfsight branding */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-14 bg-white" />
          </div>
        </div>
      </section>

      {/* ─── GOOGLE REVIEWS WIDGET ─── */}
      <section className="border-t border-luxury-border">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,_rgba(27,58,92,0.05),_transparent)]" />
          <div className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-20">
            <div className="mb-6 text-center sm:mb-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-navy">Reviews</p>
              <h2 className="mt-3 font-serif text-2xl font-bold text-gray-900 sm:text-4xl">
                TRUSTED BY OUR CLIENTS
              </h2>
              <div className="mx-auto mt-4 h-[2px] w-16 bg-gradient-to-r from-transparent via-navy to-transparent" />
            </div>
            <div className="relative w-full overflow-hidden rounded-sm">
              <iframe
                src="https://e4d32f7c7ba948688a5a5396616a4f69.elf.site"
                title="Google Reviews"
                className="h-[420px] w-full border-0 sm:h-[540px]"
                loading="lazy"
                allowTransparency
              />
              {/* Cover Elfsight branding */}
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-14 bg-white" />
            </div>
            <p className="mx-auto mt-6 max-w-md text-center text-[11px] leading-relaxed text-gray-900/20">
              Reviews are for Lebanon Rental, our parent property rental company. Srour Cars is our dedicated car rental service.
            </p>
          </div>
        </div>
      </section>

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
