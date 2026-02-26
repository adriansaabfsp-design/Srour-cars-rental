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
  const [currentIdx, setCurrentIdx] = useState(0);
  const [nextIdx, setNextIdx] = useState(1);
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* Preload every property image so transitions are seamless on mobile */
  useEffect(() => {
    PROPERTY_IMAGES.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  /* Kick off fade every 5 s — only set the flag, don't touch indices */
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTransitioning(true);
    }, 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  /* After the 700 ms fade completes, promote next → current */
  useEffect(() => {
    if (!transitioning) return;
    const t = setTimeout(() => {
      setCurrentIdx(nextIdx);
      setNextIdx((nextIdx + 1) % PROPERTY_IMAGES.length);
      setTransitioning(false);
    }, 700);
    return () => clearTimeout(t);
  }, [transitioning, nextIdx]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Current image (always visible underneath) */}
      <img
        src={PROPERTY_IMAGES[currentIdx]}
        alt="Lebanon Rental property"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Next image (fades in on top) */}
      <img
        src={PROPERTY_IMAGES[nextIdx]}
        alt="Lebanon Rental property"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${transitioning ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}

/* ── Travel Insights animated tab section ── */
const INSIGHT_TABS = [
  {
    tab: "Road Trips",
    title: "Iconic Road Trips in Lebanon",
    desc: "Discover 17 unforgettable driving routes across mountains, coast, and hidden gems — curated for every season.",
    href: "/road-trips",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
      </svg>
    ),
  },
  {
    tab: "Seasonal Guide",
    title: "Best Time to Visit Lebanon",
    desc: "A complete seasonal guide to weather, crowds, prices, and the perfect car for every month of the year.",
    href: "/seasonal-guide",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    ),
  },
  {
    tab: "FAQ",
    title: "Everything You Need to Know About Renting",
    desc: "From documents to fuel policy — our comprehensive FAQ covers every question first-time renters ask.",
    href: "/faq",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
      </svg>
    ),
  },
  {
    tab: "Extras",
    title: "Rental Extras & Add-ons",
    desc: "GPS, child seats, extra drivers, insurance upgrades — enhance your trip with our curated add-on packages.",
    href: "/extras",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

function InsightsSection() {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  // Auto-advance every 5s
  useEffect(() => {
    autoRef.current = setInterval(() => {
      setDirection("right");
      setAnimating(true);
      setTimeout(() => {
        setActive((prev) => (prev + 1) % INSIGHT_TABS.length);
        setTimeout(() => setAnimating(false), 50);
      }, 250);
    }, 5000);
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
      }, 5000);
    },
    [goTo]
  );

  const current = INSIGHT_TABS[active];

  return (
    <section className="border-t border-luxury-border">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-20">
        <div className="mb-5 text-center sm:mb-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-navy">
            From our blog
          </p>
          <h2 className="mt-2 font-serif text-2xl font-bold text-gray-900 sm:mt-3 sm:text-4xl">
            TRAVEL INSIGHTS
          </h2>
        </div>

        {/* Tab pills */}
        <div className="mb-5 flex justify-center gap-1.5 overflow-x-auto sm:gap-2 sm:mb-8">
          {INSIGHT_TABS.map((tab, i) => (
            <button
              key={tab.tab}
              onClick={() => handleTabClick(i)}
              className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] transition-all duration-300 sm:px-5 sm:py-2.5 sm:text-[11px] sm:tracking-[0.15em] ${
                i === active
                  ? "bg-navy text-white"
                  : "border border-gray-200 bg-white text-gray-400 hover:border-navy/30 hover:text-navy"
              }`}
            >
              {tab.icon}
              <span className="hidden min-[400px]:inline">{tab.tab}</span>
            </button>
          ))}
        </div>

        {/* Animated card */}
        <div className="relative overflow-hidden">
          <a
            href={current.href}
            className={`group block border border-luxury-border bg-luxury-card p-6 transition-all duration-300 hover:border-navy/30 sm:p-10 ${
              animating
                ? direction === "right"
                  ? "translate-x-8 opacity-0"
                  : "-translate-x-8 opacity-0"
                : "translate-x-0 opacity-100"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="hidden sm:block flex-shrink-0 mt-1 text-navy/30">{current.icon}</div>
              <div>
                <div className="mb-3 h-[2px] w-8 bg-navy/30 transition-all group-hover:w-12 group-hover:bg-navy" />
                <h3 className="font-serif text-xl font-bold text-gray-900 sm:text-2xl">
                  {current.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-gray-900/40 sm:text-sm">
                  {current.desc}
                </p>
                <span className="mt-4 inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-navy transition-colors group-hover:text-gray-900/60 sm:text-[11px]">
                  Read More &rarr;
                </span>
              </div>
            </div>
          </a>
        </div>

        {/* Progress dots */}
        <div className="mt-4 flex justify-center gap-2">
          {INSIGHT_TABS.map((_, i) => (
            <button
              key={i}
              onClick={() => handleTabClick(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === active ? "w-6 bg-navy" : "w-1.5 bg-gray-200 hover:bg-gray-300"
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
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeRoad, setActiveRoad] = useState("All Terrain");
  const [brand, setBrand] = useState("All");
  const [fuel, setFuel] = useState("All");
  const [transmission, setTransmission] = useState("All");


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
      {/* MOBILE: video hero + logo/tagline + car train marquee */}
      <section className="relative overflow-hidden sm:hidden bg-luxury-black">
        {/* Video background */}
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="h-full w-full object-cover"
            src="/updated.mp4"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/70" />
        </div>

        {/* Crossfading Logo ↔ Tagline */}
        <div className="relative flex items-center justify-center px-4 pt-6 pb-4" style={{ height: "360px" }}>
          {/* Lebanon Rental logo */}
          <div className="hero-crossfade-a absolute inset-0 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Lebanon Rental"
              width={600}
              height={600}
              className="h-[22rem] w-auto drop-shadow-[0_6px_42px_rgba(0,0,0,0.65)]"
              priority
            />
          </div>
          {/* Rent Your Dream Ride tagline */}
          <div className="hero-crossfade-b absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="font-serif text-lg font-light italic tracking-wide text-white/80">
              Rent Your
            </p>
            <p className="mt-1 font-serif text-[2.1rem] font-black uppercase tracking-[0.16em] text-white leading-tight drop-shadow-[0_3px_24px_rgba(0,0,0,0.6)]">
              Dre<img src="/cedar.png" alt="a" className="inline-block h-[0.85em] w-auto mx-[-0.06em] align-baseline" style={{ letterSpacing: 0 }} />m Ride
            </p>
          </div>
          <div className="hero-tagline-line absolute bottom-5 left-1/2 -translate-x-1/2 h-[1px] w-28 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>

        {/* Auto-scrolling car train */}
        <div className="relative w-full overflow-hidden pb-3">
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

      {/* DESKTOP: video hero */}
      <section className="relative hidden w-full overflow-hidden bg-black sm:block">
        <div className="relative h-[70vh] lg:h-[80vh]">
          {/* Video background */}
          <div className="absolute inset-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="h-full w-full object-cover"
              src="/updated.mp4"
            />
          </div>

          {/* overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30" />

          {/* Crossfading Logo ↔ Tagline (desktop) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Lebanon Rental logo */}
            <div className="hero-crossfade-a absolute inset-0 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Lebanon Rental"
                width={600}
                height={600}
                className="h-[26rem] lg:h-[30rem] w-auto drop-shadow-[0_6px_42px_rgba(0,0,0,0.65)]"
                priority
              />
            </div>
            {/* Rent Your Dream Ride tagline */}
            <div className="hero-crossfade-b absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <p className="font-serif text-4xl font-light italic tracking-wide text-white/80 drop-shadow-lg lg:text-5xl">
                Rent Your
              </p>
              <p className="mt-1 font-serif text-6xl font-black uppercase tracking-[0.15em] text-white leading-tight drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)] lg:text-7xl">
                Dre<img src="/cedar.png" alt="a" className="inline-block h-[0.85em] w-auto mx-[-0.06em] align-baseline" style={{ letterSpacing: 0 }} />m Ride
              </p>
              <div className="mx-auto mt-4 h-[2px] w-28 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </div>
          </div>
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
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white sm:left-4 sm:h-5 sm:w-5"
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
              className="w-full border border-navy/30 bg-navy py-2.5 pl-10 pr-4 text-[13px] text-white placeholder-white/50 outline-none transition-all focus:border-navy-light focus:ring-1 focus:ring-navy-light sm:py-3.5 sm:pl-12 sm:text-sm rounded-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
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

      {/* ─── TRAVEL INSIGHTS (animated tabs) ─── */}
      <InsightsSection />

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
