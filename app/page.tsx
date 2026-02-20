"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Car } from "@/lib/types";
import CarCard from "@/components/CarCard";
import Filters from "@/components/Filters";
import FeaturedBar from "@/components/FeaturedBar";

export default function Home() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [brand, setBrand] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");
  const [showAvailableOnly, setShowAvailableOnly] = useState(true);
  const [featuredBarCount, setFeaturedBarCount] = useState(1);

  // Search & mobile filters toggle
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showHeroSearch, setShowHeroSearch] = useState(false);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const q = query(collection(db, "cars"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Car[];
        setCars(data);
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
    // Load homepage settings
    getDoc(doc(db, "settings", "homepage")).then((snap) => {
      if (snap.exists() && snap.data().featuredBarCount) {
        setFeaturedBarCount(snap.data().featuredBarCount);
      }
    });
  }, []);

  const filteredCars = cars
    .filter((car) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const searchable = `${car.name} ${car.brand} ${car.year} ${car.fuel} ${car.transmission}`.toLowerCase();
        if (!searchable.includes(q)) return false;
      }
      if (brand !== "All" && car.brand !== brand) return false;
      if (minPrice && car.price < Number(minPrice)) return false;
      if (maxPrice && car.price > Number(maxPrice)) return false;
      if (minYear && car.year < Number(minYear)) return false;
      if (maxYear && car.year > Number(maxYear)) return false;
      if (showAvailableOnly && car.available === false) return false;
      return true;
    })
    .sort((a, b) => {
      // Featured cars first
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });

  const resetFilters = () => {
    setBrand("All");
    setMinPrice("");
    setMaxPrice("");
    setMinYear("");
    setMaxYear("");
    setShowAvailableOnly(false);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-luxury-black">
      {/* HERO — Full viewport dramatic */}
      <section className="relative flex items-center justify-center overflow-hidden py-16 sm:min-h-[90vh] sm:py-0">
        {/* Dark radial gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,_rgba(201,168,76,0.12),_transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(201,168,76,0.05),_transparent_50%)]" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        {/* Animated golden car silhouettes background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Car silhouette SVG — sleek sedan profile */}
          {[
            { top: "12%", size: 220, duration: 38, delay: 0, opacity: 0.08 },
            { top: "28%", size: 160, duration: 52, delay: -18, opacity: 0.06 },
            { top: "55%", size: 280, duration: 44, delay: -8, opacity: 0.1 },
            { top: "72%", size: 140, duration: 60, delay: -30, opacity: 0.05 },
            { top: "40%", size: 110, duration: 70, delay: -45, opacity: 0.07 },
            { top: "85%", size: 200, duration: 48, delay: -22, opacity: 0.06 },
            { top: "18%", size: 180, duration: 56, delay: -35, opacity: 0.09 },
          ].map((car, i) => (
            <svg
              key={i}
              viewBox="0 0 200 60"
              fill="none"
              style={{
                position: "absolute",
                top: car.top,
                width: car.size,
                opacity: car.opacity,
                willChange: "left",
                animation: `heroCarDrift ${car.duration}s linear ${car.delay}s infinite`,
              }}
            >
              <path
                d="M10 42 C10 42 14 42 18 42 C20 42 22 38 26 34 C30 30 38 22 52 20 C60 18.5 72 18 86 18 C100 18 120 18 138 20 C148 21 156 24 162 28 C166 30 170 34 174 38 C176 40 178 42 182 42 L190 42 C192 42 194 40 194 38 L194 36 C194 34 192 32 190 32 L188 32 C186 30 184 28 180 26 C174 22 166 18 156 16 C150 15 140 14 130 13.5 C118 13 106 13 94 13 C82 13 70 13.5 60 14.5 C50 15.5 42 17 36 20 C30 23 24 28 20 32 L14 32 C12 32 10 34 10 36 L10 42Z"
                fill="#C9A84C"
              />
              <ellipse cx="50" cy="44" rx="12" ry="12" fill="#C9A84C" />
              <ellipse cx="50" cy="44" rx="7" ry="7" fill="#0a0a0a" />
              <ellipse cx="156" cy="44" rx="12" ry="12" fill="#C9A84C" />
              <ellipse cx="156" cy="44" rx="7" ry="7" fill="#0a0a0a" />
              <path
                d="M60 19 C68 18 80 18 92 18.5 C92 18.5 88 22 82 24 C76 26 66 26 60 24 C56 22.5 56 20 60 19Z"
                fill="#C9A84C"
                opacity="0.4"
              />
              <path
                d="M100 18.5 C112 18 126 19 136 20.5 C142 21.5 146 23 148 24 C140 26 126 26 116 24 C108 22.5 102 20 100 18.5Z"
                fill="#C9A84C"
                opacity="0.4"
              />
            </svg>
          ))}
        </div>

        {/* Horizontal gold line accent */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
          <div className="mb-4 inline-flex items-center gap-3 border border-gold/20 bg-gold/5 px-6 py-2 sm:mb-8">
            <div className="h-1 w-6 bg-gold" />
            <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-gold">
              Premium Car Rentals — Lebanon
            </span>
            <div className="h-1 w-6 bg-gold" />
          </div>

          <h1 className="font-serif text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-7xl lg:text-8xl xl:text-9xl">
            SROUR
            <br />
            <span className="gold-shimmer">CARS</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/50 sm:mt-8 sm:text-xl">
            An exclusive fleet of premium vehicles available for rent across Lebanon.
            From exotic supercars to elegant sedans — find your perfect drive.
          </p>

          {/* Featured Cars Showcase — right after title on mobile */}
          <FeaturedBar
            cars={cars.filter((c) => c.featured)}
            visibleCount={featuredBarCount}
          />

          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:mt-12 sm:flex-row sm:gap-4">
            <a
              href="#collection"
              className="group inline-flex items-center gap-3 bg-gold px-10 py-4 text-[13px] font-bold uppercase tracking-[0.2em] text-black transition-all duration-300 hover:bg-gold-light hover:shadow-[0_0_40px_rgba(201,168,76,0.3)]"
            >
              View All Cars
              <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <button
              onClick={() => setShowHeroSearch(true)}
              className="inline-flex items-center gap-2 border border-white/20 px-10 py-4 text-[13px] font-bold uppercase tracking-[0.2em] text-white/80 transition-all duration-300 hover:border-gold hover:text-gold"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </button>
          </div>

          {/* Hero search overlay */}
          {showHeroSearch && (
            <div className="mt-8 w-full max-w-xl mx-auto animate-fade-in-up">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" });
                    }
                    if (e.key === "Escape") {
                      setShowHeroSearch(false);
                      setSearchQuery("");
                    }
                  }}
                  placeholder="Search by name, brand, year..."
                  className="w-full border border-white/15 bg-black/60 py-4 pl-12 pr-20 text-base text-white placeholder-white/30 outline-none backdrop-blur-xl transition-all focus:border-gold/50"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {searchQuery && (
                    <button
                      onClick={() => {
                        document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="bg-gold px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-black transition-colors hover:bg-gold-light"
                    >
                      Go
                    </button>
                  )}
                  <button
                    onClick={() => { setShowHeroSearch(false); setSearchQuery(""); }}
                    className="p-2 text-white/30 transition-colors hover:text-white"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <p className="mt-2 text-[10px] text-white/25">Press Enter to jump to results · Esc to close</p>
            </div>
          )}

          {/* Stats bar */}
          <div className="mx-auto mt-8 flex max-w-lg items-center justify-center gap-8 border-t border-white/10 pt-6 sm:mt-16 sm:gap-12 sm:pt-10">
            <div className="text-center">
              <div className="font-serif text-3xl font-bold text-gold">50+</div>
              <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">Luxury Cars</div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-center">
              <div className="font-serif text-3xl font-bold text-gold">24/7</div>
              <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">Support</div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-center">
              <div className="font-serif text-3xl font-bold text-gold">VIP</div>
              <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">Service</div>
            </div>
          </div>
        </div>

        {/* Bottom fade to pure black */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-luxury-black to-transparent" />
      </section>

      {/* Main Content */}
      <div id="collection" className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-12 flex flex-col items-center text-center">
          <span className="mb-4 text-[11px] font-bold uppercase tracking-[0.4em] text-gold">Our Fleet</span>
          <h2 className="font-serif text-4xl font-bold text-white sm:text-5xl">THE COLLECTION</h2>
          <div className="mt-4 h-[2px] w-20 bg-gold" />

          {/* Search bar */}
          <div className="relative mt-8 w-full max-w-lg">
            <svg className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, brand, year..."
              className="w-full border border-luxury-border bg-luxury-card py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-gold/50 focus:bg-luxury-dark"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 transition-colors hover:text-white"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Mobile filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="mb-6 flex items-center gap-2 border border-luxury-border bg-luxury-card px-5 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white/60 transition-all hover:border-gold/40 hover:text-gold lg:hidden"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          {showFilters ? "Hide Filters" : "Refine Search"}
        </button>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar Filters */}
          <aside className={`w-full flex-shrink-0 lg:block lg:w-72 ${showFilters ? "block" : "hidden"}`}>
            <div className="lg:sticky lg:top-28">
              <Filters
                brand={brand}
                setBrand={setBrand}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                minYear={minYear}
                setMinYear={setMinYear}
                maxYear={maxYear}
                setMaxYear={setMaxYear}
                showAvailableOnly={showAvailableOnly}
                setShowAvailableOnly={setShowAvailableOnly}
                onReset={resetFilters}
              />
            </div>
          </aside>

          {/* Car Grid */}
          <main className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-luxury-muted">
                {loading ? (
                  <span className="lux-pulse">Curating your selection...</span>
                ) : (
                  `${filteredCars.length} vehicle${filteredCars.length !== 1 ? "s" : ""} available`
                )}
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="overflow-hidden border border-luxury-border bg-luxury-card">
                    <div className="aspect-[16/10] lux-pulse bg-luxury-dark" />
                    <div className="border-t border-luxury-border p-5 space-y-3">
                      <div className="h-2.5 w-16 bg-luxury-border lux-pulse" />
                      <div className="h-4 w-3/4 bg-luxury-border lux-pulse" />
                      <div className="h-2.5 w-1/2 bg-luxury-border lux-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredCars.length === 0 ? (
              <div className="flex flex-col items-center justify-center border border-luxury-border bg-luxury-card py-28">
                <div className="mb-5 flex h-20 w-20 items-center justify-center border border-luxury-border">
                  <svg className="h-8 w-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="font-serif text-2xl font-bold text-white">NO VEHICLES FOUND</h3>
                <p className="mt-2 text-sm text-white/40">Adjust your filters to discover more</p>
                <button
                  onClick={resetFilters}
                  className="mt-8 border border-gold bg-transparent px-8 py-3 text-[12px] font-bold uppercase tracking-[0.2em] text-gold transition-all duration-300 hover:bg-gold hover:text-black"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 stagger-children">
                {filteredCars.map((car) => (
                  <div key={car.id} className="animate-fade-in-up opacity-0">
                    <CarCard car={car} />
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
