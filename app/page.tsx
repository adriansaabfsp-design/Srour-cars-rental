"use client";

import { useEffect, useState, useCallback } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Car, CAR_CATEGORIES, ROAD_TYPES, BRANDS, FUEL_TYPES, TRANSMISSIONS } from "@/lib/types";
import CarCard from "@/components/CarCard";
import Link from "next/link";

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
      {/* ─── HERO CAROUSEL ─── */}
      <section className="relative w-full overflow-hidden bg-black">
        <div className="relative h-[65vh] w-full sm:h-[70vh] lg:h-[80vh]">
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
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,_rgba(201,168,76,0.15),_transparent)]" />
          )}

          {/* overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-black/50 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30" />

          {/* corner logo */}
          <div className="absolute left-3 top-3 z-10 pointer-events-none sm:left-8 sm:top-8 lg:left-12 lg:top-10">
            <div className="hero-corner-enter">
              <h1 className="font-serif leading-[0.95] drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
                <span className="flex items-baseline">
                  <span className="text-xl font-black tracking-wider text-gold sm:text-5xl lg:text-6xl">Leb</span>
                  <span className="cedar-sun-glow relative inline-flex items-center justify-center mx-[-1px] sm:mx-[-2px]">
                    <svg className="h-5 w-5 text-gold drop-shadow-[0_2px_12px_rgba(201,168,76,0.5)] sm:h-12 sm:w-12 lg:h-14 lg:w-14" viewBox="0 0 64 64" fill="currentColor">
                      <path d="M32 4c-1.2 3.2-4 6.4-4 9.6 0 2.4 1.6 4 2.8 5.6-2-.8-4.8-1.6-6.8-.8-2.4 1-3.2 3.2-2.4 5.2.8 1.6 2.8 2.8 4.4 3.2-2.4.4-5.6 1.2-7.2 3.2-1.4 2-.8 4.4.8 6 1.6 1.4 4 2 6 2-1.6 1.2-3.6 2.8-4 4.8-.4 2.4 1.2 4 3.2 4.8H32V4z" />
                      <path d="M32 4c1.2 3.2 4 6.4 4 9.6 0 2.4-1.6 4-2.8 5.6 2-.8 4.8-1.6 6.8-.8 2.4 1 3.2 3.2 2.4 5.2-.8 1.6-2.8 2.8-4.4 3.2 2.4.4 5.6 1.2 7.2 3.2 1.4 2 .8 4.4-.8 6-1.6 1.4-4 2-6 2 1.6 1.2 3.6 2.8 4 4.8.4 2.4-1.2 4-3.2 4.8H32V4z" />
                      <rect x="30" y="48" width="4" height="14" rx="1" />
                    </svg>
                  </span>
                  <span className="text-xl font-black tracking-wider text-gold sm:text-5xl lg:text-6xl">non</span>
                </span>
                <span className="block text-xs font-bold uppercase tracking-[0.4em] text-gold/70 sm:text-2xl lg:text-3xl">Rental</span>
              </h1>
            </div>
          </div>

          {/* center tagline */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center px-4">
              <div className="hero-tagline-reveal">
                <p className="font-serif text-lg font-light italic tracking-wide text-white/80 drop-shadow-lg sm:text-4xl lg:text-5xl">
                  Rent Your
                </p>
                <p className="hero-tagline-word mt-1 font-serif text-2xl font-black uppercase tracking-[0.15em] sm:text-6xl lg:text-7xl">
                  <span className="bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent drop-shadow-[0_2px_20px_rgba(201,168,76,0.4)]">Dream Ride</span>
                </p>
                <div className="hero-tagline-line mx-auto mt-4 h-[2px] w-0 bg-gradient-to-r from-transparent via-gold to-transparent" />
              </div>
            </div>
          </div>

          {/* car info bar */}
          {currentHeroCar && (
            <div className="absolute bottom-8 left-0 right-0 px-4 sm:bottom-12 sm:px-8 lg:px-12">
              <div
                className={
                  "transition-all duration-400 " +
                  (heroTransition ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0")
                }
              >
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <div className="text-[9px] font-bold uppercase tracking-[0.35em] text-gold sm:text-[11px]">
                      {currentHeroCar.brand} &middot; {currentHeroCar.year}
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                      {currentHeroCar.name}
                    </h2>
                    <div className="mt-1 flex items-center gap-3 text-[10px] text-white/40 sm:text-xs">
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
                    <div className="bg-gold px-5 py-2.5 sm:px-6 sm:py-3">
                      <span className="text-xl font-extrabold text-black sm:text-2xl">
                        ${currentHeroCar.price}
                      </span>
                      <span className="text-[10px] font-bold text-black/50 sm:text-xs">/day</span>
                    </div>
                    <Link
                      href={"/cars/" + currentHeroCar.id}
                      className="mt-2 inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-gold transition-colors hover:text-gold-light sm:text-[11px]"
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
                className="absolute left-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center bg-black/40 text-white/70 backdrop-blur-sm transition-all hover:bg-gold hover:text-black sm:left-6 sm:h-12 sm:w-12"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={heroNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center bg-black/40 text-white/70 backdrop-blur-sm transition-all hover:bg-gold hover:text-black sm:right-6 sm:h-12 sm:w-12"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* dots */}
          {featuredCars.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:bottom-5">
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
                      ? "h-2 w-7 bg-gold"
                      : "h-2 w-2 bg-white/30 hover:bg-white/50")
                  }
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── COMPLETE YOUR STAY ─── */}
      <section className="relative overflow-hidden border-b border-luxury-border">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,_rgba(201,168,76,0.06),_transparent)]" />
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M20 0L40 20L20 40L0 20Z\' fill=\'none\' stroke=\'%23C9A84C\' stroke-width=\'0.5\'/%3E%3C/svg%3E")', backgroundSize: '40px 40px' }} />
        <div className="relative mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 sm:py-20">
          <div className="mx-auto mb-6 h-[1px] w-24 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-gold/50 sm:text-xs">
            Cross Promotion
          </p>
          <h2 className="mt-4 font-serif text-2xl font-bold text-white sm:text-4xl">
            STAYING IN LEBANON?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-medium text-gold/60 sm:text-base">
            Complete your experience with a premium car delivered to your villa or chalet
          </p>
          <p className="mx-auto mt-4 max-w-xl text-[13px] leading-relaxed text-white/30">
            Lebanon Rental guests enjoy priority delivery to over 1,000+ properties across Lebanon
            — from Batroun to Beirut, Jbeil to the Chouf.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <a
              href="/#collection"
              className="inline-block border border-gold bg-gold px-7 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-black transition-all hover:bg-gold-light"
            >
              Browse Our Fleet
            </a>
            <a
              href="https://lebanon-rental.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-gold/40 bg-transparent px-7 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-gold transition-all hover:bg-gold hover:text-black"
            >
              Browse Lebanon Rental Properties &rarr;
            </a>
          </div>
          <div className="mx-auto mt-8 h-[1px] w-24 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        </div>
      </section>

      {/* ─── GOOGLE REVIEWS ─── */}
      <section className="border-b border-luxury-border bg-black/40">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="mb-10 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-gold/50">Testimonials</p>
            <h2 className="mt-3 font-serif text-2xl font-bold text-white sm:text-4xl">
              WHAT OUR CLIENTS SAY
            </h2>
            <div className="mx-auto mt-4 h-[2px] w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
            {/* star rating */}
            <div className="mt-6 flex items-center justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="h-6 w-6 text-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="mt-2 text-sm text-white/40">
              <span className="font-semibold text-gold/70">Excellent</span> — Based on Google Reviews
            </p>
            <a
              href="https://share.google/ZeLTQsAdf6nb6EQlP"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block border border-gold/30 bg-gold/5 px-6 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-gold transition-all hover:bg-gold hover:text-black"
            >
              Read Our Reviews
            </a>
          </div>

          {/* review cards */}
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              { name: "Marc D.", quote: "Absolutely incredible service! The car was spotless, delivered right to our Airbnb in Batroun. Made our Lebanon trip unforgettable. Will definitely rent again next summer." },
              { name: "Sarah K.", quote: "Best rental experience I've ever had — anywhere in the world. The team was responsive on WhatsApp within minutes, and the SUV was perfect for mountain roads. Highly recommend!" },
              { name: "Omar R.", quote: "Rented a sedan for a week-long road trip from Beirut to Baalbek and back. Smooth process, fair prices, and the car was in perfect condition. Five stars all the way." },
            ].map((review) => (
              <div key={review.name} className="border border-luxury-border bg-luxury-card p-6">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-4 w-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="mt-4 text-[13px] leading-relaxed text-white/40 italic">
                  &ldquo;{review.quote}&rdquo;
                </p>
                <p className="mt-4 text-xs font-bold uppercase tracking-wider text-gold/60">
                  {review.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BROWSE BY CATEGORY ─── */}
      <section className="border-b border-luxury-border">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="mb-8 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-gold/50">Find your perfect match</p>
            <h2 className="mt-3 font-serif text-2xl font-bold text-white sm:text-4xl">BROWSE BY CATEGORY</h2>
            <div className="mx-auto mt-3 h-[2px] w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 sm:justify-center sm:flex-wrap sm:overflow-visible sm:pb-0">
            {([
              { name: "Sedan", icon: <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M5 17h14M3 13l2.5-5h13L21 13M7 17a2 2 0 11-4 0M21 17a2 2 0 11-4 0" strokeLinecap="round" strokeLinejoin="round" /><rect x="3" y="13" width="18" height="4" rx="1" strokeLinecap="round" strokeLinejoin="round" /></svg> },
              { name: "SUV", icon: <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M5 17h14M3 13l1.5-4h15L21 13M7 17a2 2 0 11-4 0M21 17a2 2 0 11-4 0" strokeLinecap="round" strokeLinejoin="round" /><rect x="3" y="9" width="18" height="8" rx="2" strokeLinecap="round" strokeLinejoin="round" /></svg> },
              { name: "Luxury", icon: <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4.5L6 21l1.5-7.5L2 9h7l3-7z" strokeLinecap="round" strokeLinejoin="round" /></svg> },
              { name: "Economy", icon: <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 0V4m0 16v-4m8-4h-4M8 12H4" strokeLinecap="round" strokeLinejoin="round" /></svg> },
              { name: "4x4", icon: <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M5 17h14M2 13l2-5h16l2 5M7 17a2.5 2.5 0 11-5 0M22 17a2.5 2.5 0 11-5 0M10 8V5M14 8V5" strokeLinecap="round" strokeLinejoin="round" /><rect x="2" y="13" width="20" height="4" rx="1" strokeLinecap="round" strokeLinejoin="round" /></svg> },
              { name: "Convertible", icon: <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M5 17h14M3 13l2.5-5h8l4.5 1L21 13M7 17a2 2 0 11-4 0M21 17a2 2 0 11-4 0" strokeLinecap="round" strokeLinejoin="round" /><rect x="3" y="13" width="18" height="4" rx="1" strokeLinecap="round" strokeLinejoin="round" /></svg> },
            ] as const).map((cat) => (
              <button
                key={cat.name}
                onClick={() => {
                  setActiveCategory(cat.name);
                  document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="group flex-shrink-0 flex flex-col items-center gap-3 border border-luxury-border bg-luxury-card px-8 py-6 transition-all hover:border-gold/40 hover:bg-gold/5 sm:px-10"
              >
                <div className="text-white/20 transition-colors group-hover:text-gold">{cat.icon}</div>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 transition-colors group-hover:text-gold">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COLLECTION ─── */}
      <div id="collection" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* heading */}
        <div className="mb-6 text-center">
          <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">
            CHOOSE YOUR CAR RENTAL
          </h2>
          <div className="mx-auto mt-3 h-[2px] w-20 bg-gold" />
        </div>

        {/* search */}
        <div className="mx-auto mb-5 max-w-2xl">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30"
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
              className="w-full border border-luxury-border bg-luxury-card py-3.5 pl-12 pr-4 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-gold/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* category tabs */}
        <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
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
                  "px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.12em] transition-all " +
                  (isActive
                    ? "bg-gold text-black"
                    : "border border-luxury-border bg-luxury-card text-white/50 hover:border-gold/30 hover:text-white")
                }
              >
                {cat}
                {count > 0 && (
                  <span className={"ml-1.5 text-[9px] " + (isActive ? "text-black/50" : "text-gold/60")}>
                    ({count})
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* road type pills */}
        <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
          <span className="mr-1 text-[9px] font-bold uppercase tracking-[0.25em] text-white/25">
            Best for:
          </span>
          {ROAD_TYPES.map((road) => {
            const isActive = activeRoad === road;
            return (
              <button
                key={road}
                onClick={() => setActiveRoad(road)}
                className={
                  "px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all " +
                  (isActive
                    ? "border border-gold bg-gold/15 text-gold"
                    : "border border-luxury-border text-white/30 hover:border-white/20 hover:text-white/50")
                }
              >
                {road === "All Terrain" ? "All" : road}
              </button>
            );
          })}
        </div>

        {/* dropdowns row */}
        <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="border border-luxury-border bg-luxury-card px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white/50 outline-none transition-colors focus:border-gold [color-scheme:dark]"
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
            className="border border-luxury-border bg-luxury-card px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white/50 outline-none transition-colors focus:border-gold [color-scheme:dark]"
          >
            <option value="All">All Fuel Types</option>
            {FUEL_TYPES.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
          <select
            value={transmission}
            onChange={(e) => setTransmission(e.target.value)}
            className="border border-luxury-border bg-luxury-card px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white/50 outline-none transition-colors focus:border-gold [color-scheme:dark]"
          >
            <option value="All">All Transmissions</option>
            {TRANSMISSIONS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {hasFilters && (
            <button
              onClick={resetFilters}
              className="text-[10px] font-bold uppercase tracking-wider text-gold hover:text-gold-light transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* result count */}
        <div className="mb-4">
          <p className="text-sm text-luxury-muted">
            {loading ? (
              <span className="lux-pulse">Loading fleet...</span>
            ) : (
              <>
                {filteredCars.length} vehicle{filteredCars.length !== 1 ? "s" : ""}
                {activeCategory !== "All" && (
                  <span className="text-gold"> &middot; {activeCategory}</span>
                )}
                {activeRoad !== "All Terrain" && (
                  <span className="text-gold"> &middot; {activeRoad}</span>
                )}
              </>
            )}
          </p>
        </div>

        {/* car grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
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
          <div className="flex flex-col items-center justify-center border border-luxury-border bg-luxury-card py-20">
            <svg className="h-16 w-16 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="mt-4 font-serif text-2xl font-bold text-white">NO VEHICLES FOUND</h3>
            <p className="mt-2 text-sm text-white/40">Adjust your filters to discover more</p>
            <button
              onClick={resetFilters}
              className="mt-6 border border-gold bg-transparent px-8 py-3 text-[12px] font-bold uppercase tracking-[0.2em] text-gold transition-all hover:bg-gold hover:text-black"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 stagger-children">
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
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="mb-10 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-gold/50">From our blog</p>
            <h2 className="mt-3 font-serif text-2xl font-bold text-white sm:text-4xl">TRAVEL INSIGHTS</h2>
            <div className="mx-auto mt-4 h-[2px] w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
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
                className="group border border-luxury-border bg-luxury-card p-6 transition-all hover:border-gold/30"
              >
                <div className="mb-4 h-[2px] w-8 bg-gold/30 transition-all group-hover:w-12 group-hover:bg-gold" />
                <h3 className="font-serif text-lg font-bold text-white transition-colors group-hover:text-gold">
                  {article.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-white/30">
                  {article.desc}
                </p>
                <span className="mt-4 inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-gold/50 transition-colors group-hover:text-gold">
                  Read More &rarr;
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATS (bottom) ─── */}
      <section className="border-t border-luxury-border bg-luxury-card">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-8 px-4 py-12 sm:gap-12 sm:py-16 md:gap-16">
          <div className="text-center">
            <div className="font-serif text-4xl font-bold text-gold sm:text-5xl">50+</div>
            <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40">
              Luxury Cars
            </div>
          </div>
          <div className="h-12 w-px bg-luxury-border" />
          <div className="text-center">
            <div className="font-serif text-4xl font-bold text-gold sm:text-5xl">24/7</div>
            <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40">
              Support
            </div>
          </div>
          <div className="h-12 w-px bg-luxury-border" />
          <div className="text-center">
            <div className="font-serif text-4xl font-bold text-gold sm:text-5xl">VIP</div>
            <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40">
              Service
            </div>
          </div>
          <div className="h-12 w-px bg-luxury-border" />
          <a href="https://lebanon-rental.com" target="_blank" rel="noopener noreferrer" className="text-center group">
            <div className="font-serif text-4xl font-bold text-gold transition-colors group-hover:text-gold-light sm:text-5xl">1000+</div>
            <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40 transition-colors group-hover:text-gold/50">
              Partner Properties
            </div>
          </a>
        </div>
      </section>
    </div>
  );
}
