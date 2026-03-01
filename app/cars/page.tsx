"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Car, CAR_CATEGORIES, ROAD_TYPES, BRANDS, TRANSMISSIONS } from "@/lib/types";
import CarCard from "@/components/CarCard";
import Breadcrumb from "@/components/Breadcrumb";
import PriceCalculator from "@/components/PriceCalculator";
import Link from "next/link";
import { Suspense } from "react";

const CARS_PER_PAGE = 12;

function AllCarsInner() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const tripParam = searchParams.get("trip");
  const minPriceParam = searchParams.get("minPrice");
  const maxPriceParam = searchParams.get("maxPrice");
  const searchParam = searchParams.get("search");
  const roadParam = searchParams.get("road");
  const brandParam = searchParams.get("brand");
  const transmissionParam = searchParams.get("transmission");
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(searchParam || "");
  const [activeCategory, setActiveCategory] = useState(categoryParam || "All");
  const [activeRoad, setActiveRoad] = useState(roadParam || "All Terrain");
  const [brand, setBrand] = useState(brandParam || "All");
  const [transmission, setTransmission] = useState(transmissionParam || "All");
  const [activeTripCategory, setActiveTripCategory] = useState(tripParam || "");
  const [showMoreFilters, setShowMoreFilters] = useState(
    !!(roadParam || brandParam || transmissionParam)
  );

  // Price range slider state
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 9999]);
  const [priceInited, setPriceInited] = useState(false);
  const [activePriceThumb, setActivePriceThumb] = useState<"min" | "max" | null>(null);
  const [priceBounce, setPriceBounce] = useState(false);
  const bounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Compute available brands from actual car data
  const availableBrands = ["All", ...Array.from(new Set(cars.filter(c => c.available !== false).map(c => c.brand).filter(Boolean))).sort()];

  // Sync category from URL param on mount / param change
  useEffect(() => {
    if (categoryParam) setActiveCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    if (tripParam) setActiveTripCategory(tripParam);
  }, [tripParam]);

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

  // Compute min/max prices from available cars
  const availableCars = cars.filter((c) => c.available !== false);
  const dataMinPrice = availableCars.length > 0 ? Math.min(...availableCars.map((c) => c.price)) : 0;
  const dataMaxPrice = availableCars.length > 0 ? Math.max(...availableCars.map((c) => c.price)) : 9999;

  // Initialize price range once cars load (respecting URL params)
  useEffect(() => {
    if (availableCars.length > 0 && !priceInited) {
      const initMin = minPriceParam ? Math.max(Number(minPriceParam), dataMinPrice) : dataMinPrice;
      const initMax = maxPriceParam ? Math.min(Number(maxPriceParam), dataMaxPrice) : dataMaxPrice;
      setPriceRange([initMin, initMax]);
      setPriceInited(true);
    }
  }, [availableCars.length, dataMinPrice, dataMaxPrice, priceInited, minPriceParam, maxPriceParam]);

  useEffect(() => {
    return () => { if (bounceRef.current) clearTimeout(bounceRef.current); };
  }, []);

  const handlePriceRelease = () => {
    setActivePriceThumb(null);
    setPriceBounce(true);
    if (bounceRef.current) clearTimeout(bounceRef.current);
    bounceRef.current = setTimeout(() => setPriceBounce(false), 400);
  };

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
      if (activeTripCategory && car.tripCategory !== activeTripCategory) return false;
      if (activeRoad !== "All Terrain" && (!car.roadTypes || !car.roadTypes.includes(activeRoad)))
        return false;
      if (brand !== "All" && car.brand !== brand) return false;
      if (transmission !== "All" && car.transmission !== transmission) return false;
      if (priceInited && (car.price < priceRange[0] || car.price > priceRange[1])) return false;
      return true;
    })
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });

  const totalPages = Math.ceil(filteredCars.length / CARS_PER_PAGE);
  const paginatedCars = filteredCars.slice((page - 1) * CARS_PER_PAGE, page * CARS_PER_PAGE);

  const hasFilters =
    searchQuery || activeCategory !== "All" || activeRoad !== "All Terrain" || brand !== "All" || transmission !== "All" || activeTripCategory || (priceInited && (priceRange[0] !== dataMinPrice || priceRange[1] !== dataMaxPrice));

  const resetFilters = () => {
    setSearchQuery("");
    setActiveCategory("All");
    setActiveRoad("All Terrain");
    setBrand("All");
    setTransmission("All");
    setActiveTripCategory("");
    if (priceInited) setPriceRange([dataMinPrice, dataMaxPrice]);
    setPage(1);
  };

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, activeCategory, activeRoad, brand, transmission]);

  return (
    <div className="min-h-screen bg-luxury-black">
      {/* Header */}
      <div className="border-b border-luxury-border bg-luxury-card">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
          <Breadcrumb items={[
            { label: "Home", href: "/" },
            ...(activeCategory !== "All"
              ? [{ label: "Cars", href: "/cars" }, { label: activeCategory }]
              : [{ label: "All Cars" }]
            ),
          ]} />
          <h1 className="mt-3 font-serif text-3xl font-bold text-gray-900 sm:mt-4 sm:text-5xl">
            {activeCategory !== "All" ? activeCategory.toUpperCase() : "ALL CARS"}
          </h1>
          <div className="mt-2 h-[2px] w-16 bg-navy/30 sm:mt-3 sm:w-20" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-8 lg:px-8">
        {/* search + filter trigger */}
        <div className="mx-auto mb-3 max-w-2xl sm:mb-5">
          <div className="flex items-stretch gap-2">
            <div className="relative flex-1">
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
            <button
              onClick={() => setShowMoreFilters(!showMoreFilters)}
              className="flex items-center gap-1.5 border border-navy bg-white px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-navy transition-colors hover:bg-navy hover:text-white sm:px-4 sm:text-[11px] rounded-sm"
            >
              <svg className={`h-3.5 w-3.5 transition-transform ${showMoreFilters ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              {showMoreFilters ? "Hide" : "Filters"}
            </button>
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

        {/* collapsible extra filters */}
        <div className="mb-3 sm:mb-4">
          {showMoreFilters && (
            <div className="mt-3 space-y-3">
              {/* road type pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 whitespace-nowrap sm:flex-wrap sm:justify-center sm:overflow-visible sm:pb-0">
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
              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-3">
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full border border-luxury-border bg-luxury-card px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-900/50 outline-none transition-colors focus:border-navy [color-scheme:light] sm:w-auto sm:px-4 sm:py-2.5 sm:text-[11px]"
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
                  className="w-full border border-luxury-border bg-luxury-card px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-900/50 outline-none transition-colors focus:border-navy [color-scheme:light] sm:w-auto sm:px-4 sm:py-2.5 sm:text-[11px]"
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
            </div>
          )}
        </div>

        {/* Price range slider — always visible */}
        {priceInited && dataMaxPrice > dataMinPrice && (
          <div className="mx-auto max-w-2xl mb-3 sm:mb-4">
            <p className="text-[11px] font-bold text-[#1a4b6e] mb-2 sm:text-[12px]">
              Price Range
            </p>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-semibold text-[#1a4b6e]/50">${dataMinPrice}</span>
              <div className="relative flex-1 h-6 flex items-center">
                {/* Track background */}
                <div className="absolute left-0 right-0 h-[5px] rounded-full bg-gray-200/80" />
                {/* Active track */}
                <div
                  className={`absolute h-[5px] rounded-full ${
                    activePriceThumb
                      ? "bg-[#1B4F72] shadow-[0_0_12px_3px_rgba(27,79,114,0.45)]"
                      : "bg-[#1B4F72]/70 shadow-none"
                  }`}
                  style={{
                    left: `${((priceRange[0] - dataMinPrice) / (dataMaxPrice - dataMinPrice)) * 100}%`,
                    right: `${100 - ((priceRange[1] - dataMinPrice) / (dataMaxPrice - dataMinPrice)) * 100}%`,
                  }}
                />
                {/* Min handle */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none"
                  style={{ left: `${((priceRange[0] - dataMinPrice) / (dataMaxPrice - dataMinPrice)) * 100}%` }}
                >
                  <svg
                    className={`text-[#1B4F72] transition-all duration-200 ${
                      activePriceThumb === "min" ? "h-12 w-12 drop-shadow-[0_0_10px_rgba(27,79,114,0.45)]" : "h-10 w-10"
                    }`}
                    viewBox="0 0 48 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
                  >
                    <path d="M8 14h32v2H8z" fill="currentColor" />
                    <path d="M6 12c0-2 2-4 4-4h6l4-4h8l2 4h6c2 0 4 2 4 4v4H6v-4z" fill="currentColor" />
                    <path d="M14 8h4l-2-3h-4l2 3z" fill="white" opacity="0.45" />
                    <path d="M20 8h6l-1-3h-4l-1 3z" fill="white" opacity="0.45" />
                    <circle cx="14" cy="16" r="3" fill="#0f2f47" />
                    <circle cx="34" cy="16" r="3" fill="#0f2f47" />
                  </svg>
                </div>
                {/* Max handle */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none"
                  style={{ left: `${((priceRange[1] - dataMinPrice) / (dataMaxPrice - dataMinPrice)) * 100}%` }}
                >
                  <svg
                    className={`text-[#1B4F72] [transform:scaleX(-1)] transition-all duration-200 ${
                      activePriceThumb === "max" ? "h-12 w-12 drop-shadow-[0_0_10px_rgba(27,79,114,0.45)]" : "h-10 w-10"
                    }`}
                    viewBox="0 0 48 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
                  >
                    <path d="M8 14h32v2H8z" fill="currentColor" />
                    <path d="M6 12c0-2 2-4 4-4h6l4-4h8l2 4h6c2 0 4 2 4 4v4H6v-4z" fill="currentColor" />
                    <path d="M14 8h4l-2-3h-4l2 3z" fill="white" opacity="0.45" />
                    <path d="M20 8h6l-1-3h-4l-1 3z" fill="white" opacity="0.45" />
                    <circle cx="14" cy="16" r="3" fill="#0f2f47" />
                    <circle cx="34" cy="16" r="3" fill="#0f2f47" />
                  </svg>
                </div>
                {/* Invisible range inputs */}
                <input
                  type="range"
                  min={dataMinPrice}
                  max={dataMaxPrice}
                  value={priceRange[0]}
                  onPointerDown={() => setActivePriceThumb("min")}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setPriceRange([Math.min(v, priceRange[1]), priceRange[1]]);
                  }}
                  onPointerUp={handlePriceRelease}
                  onTouchEnd={handlePriceRelease}
                  className={"price-slider absolute inset-0 w-full opacity-0 " + (activePriceThumb === "min" ? "z-30" : "z-20")}
                  aria-label="Minimum daily price"
                />
                <input
                  type="range"
                  min={dataMinPrice}
                  max={dataMaxPrice}
                  value={priceRange[1]}
                  onPointerDown={() => setActivePriceThumb("max")}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setPriceRange([priceRange[0], Math.max(v, priceRange[0])]);
                  }}
                  onPointerUp={handlePriceRelease}
                  onTouchEnd={handlePriceRelease}
                  className={"price-slider absolute inset-0 w-full opacity-0 " + (activePriceThumb === "max" ? "z-30" : "z-20")}
                  aria-label="Maximum daily price"
                />
              </div>
              <span className="text-[10px] font-semibold text-[#1a4b6e]/50">${dataMaxPrice}</span>
            </div>
            {/* Price badges */}
            <div className="flex justify-between mt-2">
              <span className={`inline-block bg-[#1B4F72] text-white text-[10px] font-bold px-2.5 py-1 rounded-sm transition-transform duration-200 ${activePriceThumb === "min" ? "scale-125" : ""} ${priceBounce ? "price-badge-bounce" : ""}`}>
                ${priceRange[0]}<span className="text-white/50 font-normal">/day</span>
              </span>
              <span className={`inline-block bg-[#1B4F72] text-white text-[10px] font-bold px-2.5 py-1 rounded-sm transition-transform duration-200 ${activePriceThumb === "max" ? "scale-125" : ""} ${priceBounce ? "price-badge-bounce" : ""}`}>
                ${priceRange[1]}<span className="text-white/50 font-normal">/day</span>
              </span>
            </div>
          </div>
        )}

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
                {totalPages > 1 && (
                  <span className="text-gray-900/40"> &middot; Page {page} of {totalPages}</span>
                )}
              </>
            )}
          </p>
        </div>

        {/* car grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
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
          <>
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4 stagger-children">
              {paginatedCars.map((car) => (
                <div key={car.id} className="animate-fade-in-up opacity-0">
                  <CarCard car={car} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2 sm:mt-12">
                <button
                  onClick={() => { setPage(Math.max(1, page - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  disabled={page === 1}
                  className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider border border-luxury-border text-gray-900/50 transition-all hover:border-navy/30 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed sm:px-4 sm:text-[11px]"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className={
                      "h-9 w-9 text-[11px] font-bold transition-all sm:h-10 sm:w-10 sm:text-[12px] " +
                      (p === page
                        ? "bg-navy text-white"
                        : "border border-luxury-border text-gray-900/50 hover:border-navy/30 hover:text-gray-900")
                    }
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => { setPage(Math.min(totalPages, page + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  disabled={page === totalPages}
                  className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider border border-luxury-border text-gray-900/50 transition-all hover:border-navy/30 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed sm:px-4 sm:text-[11px]"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Floating Price Calculator */}
      <PriceCalculator />
    </div>
  );
}

export default function AllCarsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-luxury-black" />}>
      <AllCarsInner />
    </Suspense>
  );
}
