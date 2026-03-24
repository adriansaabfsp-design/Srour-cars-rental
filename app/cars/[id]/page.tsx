"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Car, generateCarSlug } from "@/lib/types";
import ImageGallery from "@/components/ImageGallery";
import VideoModal from "@/components/VideoModal";
import WhatsAppButton from "@/components/WhatsAppButton";
import Breadcrumb from "@/components/Breadcrumb";
import { useCompare } from "@/components/CompareContext";
import PriceCalculator from "@/components/PriceCalculator";
import CarCalendar from "@/components/CarCalendar";
import Link from "next/link";

export default function CarDetailPage() {
  const params = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [showCalc, setShowCalc] = useState(false);
  const { addCar, removeCar, isComparing, compareCars } = useCompare();
  const inCompare = car ? isComparing(car.id) : false;

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const slug = params.id as string;
        // First try direct ID lookup (backwards compat)
        const docRef = doc(db, "cars", slug);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() } as Car;
          // Hide non-approved owner-submitted cars
          if (data.status && data.status !== "approved") {
            setCar(null);
          } else {
            setCar(data);
          }
        } else {
          // Slug-based lookup: fetch all cars and match by generated slug
          const snapshot = await getDocs(collection(db, "cars"));
          const allCars = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Car[];
          const match = allCars.find((c) => generateCarSlug(c) === slug && (!c.status || c.status === "approved"));
          if (match) setCar(match);
        }
      } catch (error) {
        console.error("Error fetching car:", error);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchCar();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-black">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="lux-pulse">
            <div className="h-5 w-28 bg-luxury-border" />
            <div className="mt-6 aspect-[16/10] bg-luxury-card" />
            <div className="mt-8 space-y-4">
              <div className="h-8 w-1/3 bg-luxury-border" />
              <div className="h-4 w-1/2 bg-luxury-border" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-luxury-black">
        <div className="mb-6 flex h-24 w-24 items-center justify-center border border-luxury-border">
          <svg className="h-10 w-10 text-gray-900/15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h2 className="font-serif text-3xl font-bold text-gray-900">VEHICLE NOT FOUND</h2>
        <p className="mt-2 text-gray-900/40">This listing may have been removed.</p>
        <Link
          href="/"
          className="mt-8 border border-navy bg-transparent px-10 py-3.5 text-[12px] font-bold uppercase tracking-[0.2em] text-navy transition-all duration-300 hover:bg-navy hover:text-white"
        >
          Return to Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb items={[
            { label: "Home", href: "/" },
            { label: "Cars", href: "/cars" },
            ...(car.category ? [{ label: car.category, href: `/cars?category=${encodeURIComponent(car.category)}` }] : []),
            { label: car.name },
          ]} />
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Gallery - takes 3 columns */}
          <div className="lg:col-span-3">
            <ImageGallery
              photos={car.photos}
              images={car.images}
              alt={car.name}
              videoUrl={car.videoUrl}
              onPlayVideo={car.videoUrl ? () => setShowVideo(true) : undefined}
            />
          </div>

          {/* Info Panel - takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="border border-luxury-border bg-luxury-card p-8">
              {/* Badges: brand, available, featured */}
              <div className="mb-2 flex items-center gap-3 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-navy">
                  {car.brand}
                </span>
                {car.available === false && (
                  <span className="bg-red-500/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-red-400">
                    {car.availableFrom
                      ? `Back from ${new Date(car.availableFrom + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                      : "Currently Rented"}
                  </span>
                )}
                {car.featured && (
                  <span className="flex items-center gap-1 bg-navy/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-navy-light">
                    <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    Featured
                  </span>
                )}
              </div>
              <h1 className="font-serif text-4xl font-bold text-gray-900 sm:text-5xl">
                {car.name}
              </h1>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-serif text-5xl font-bold text-navy">
                  ${car.price}
                </span>
                <span className="text-sm text-gray-900/30">/day</span>
              </div>
              {car.minDays && car.minDays > 1 && (
                <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.15em] text-navy/60">
                  Minimum {car.minDays} days rental
                </p>
              )}

              <div className="my-7 h-px bg-luxury-border" />

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-luxury-border bg-white p-4 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-900/30">Year</p>
                  <p className="mt-1 text-xl font-bold text-gray-900">{car.year}</p>
                </div>
                <div className="border border-luxury-border bg-white p-4 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-900/30">Mileage</p>
                  <p className="mt-1 text-xl font-bold text-gray-900">{car.mileage.toLocaleString()} km</p>
                </div>
                <div className="border border-luxury-border bg-white p-4 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-900/30">Fuel</p>
                  <p className="mt-1 text-xl font-bold text-gray-900">{car.fuel}</p>
                </div>
                <div className="border border-luxury-border bg-white p-4 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-900/30">Transmission</p>
                  <p className="mt-1 text-xl font-bold text-gray-900">{car.transmission}</p>
                </div>
                <div className="col-span-2 border border-luxury-border bg-white p-4 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-900/30">Seats</p>
                  <p className="mt-1 text-xl font-bold text-gray-900">{car.seats}</p>
                </div>
              </div>

              {/* Rent + Compare — right under specs */}
              <div className="mt-5 flex gap-2 sm:gap-3">
                <button
                  onClick={() => {
                    if (!car) return;
                    if (inCompare) removeCar(car.id);
                    else addCar(car);
                  }}
                  disabled={!inCompare && compareCars.length >= 2}
                  className={`flex shrink-0 items-center justify-center gap-1.5 border px-3 py-4 text-[11px] font-bold uppercase tracking-[0.12em] transition-all duration-300 sm:gap-2 sm:px-4 sm:text-[12px] sm:tracking-[0.15em] ${
                    inCompare
                      ? "border-navy bg-navy/10 text-navy"
                      : compareCars.length >= 2
                        ? "border-luxury-border bg-transparent text-gray-900/20 cursor-not-allowed"
                        : "border-luxury-border bg-transparent text-gray-900/50 hover:border-navy hover:text-navy"
                  }`}
                  title={inCompare ? "Remove from compare" : compareCars.length >= 2 ? "Max 2 cars" : "Add to compare"}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {inCompare ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    )}
                  </svg>
                  {inCompare ? "Added" : "Compare"}
                </button>
                <Link
                  href={`/book?car=${encodeURIComponent(car.name)}&price=${car.price}&phone=${car.whatsapp}`}
                  className="group inline-flex flex-1 items-center justify-center gap-2 bg-navy px-4 py-4 text-[12px] font-bold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:bg-navy-light hover:shadow-[0_0_30px_rgba(27,58,92,0.3)] active:scale-[0.98] sm:gap-3 sm:px-8 sm:text-[13px] sm:tracking-[0.15em]"
                >
                  <svg className="h-5 w-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Rent This Car
                </Link>
              </div>

              {/* Calculate Price button */}
              <button
                onClick={() => setShowCalc(!showCalc)}
                className={`mt-3 flex w-full items-center justify-center gap-2 border px-4 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] transition-all duration-300 sm:text-[12px] sm:tracking-[0.15em] ${
                  showCalc
                    ? "border-navy bg-navy/10 text-navy"
                    : "border-luxury-border bg-transparent text-gray-900/50 hover:border-navy hover:text-navy"
                }`}
              >
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6 2a2 2 0 00-2 2v1H3a1 1 0 000 2h1v2H3a1 1 0 000 2h1v2H3a1 1 0 000 2h1v1a2 2 0 002 2h8a2 2 0 002-2v-1h1a1 1 0 000-2h-1v-2h1a1 1 0 000-2h-1V7h1a1 1 0 000-2h-1V4a2 2 0 00-2-2H6z"/>
                </svg>
                {showCalc ? "Hide Calculator" : "Calculate Price"}
              </button>

              {/* Inline Price Calculator */}
              {showCalc && (
                <div className="mt-3">
                  <PriceCalculator
                    dailyPrice={car.price}
                    label={car.name}
                    minDays={car.minDays}
                    initialOpen={true}
                    inline={true}
                  />
                </div>
              )}

              {/* About — always visible */}
              {car.description && (
                <div className="mt-6">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-900/30">About This Vehicle</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-900/60">{car.description}</p>
                </div>
              )}

              {/* Features — always visible */}
              {car.features && car.features.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-900/30">Car Features</h3>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {car.features.map((feature) => (
                      <div
                        key={feature}
                        className="group relative overflow-hidden border border-navy/30 bg-gradient-to-r from-navy/10 via-white to-navy/5 px-3 py-2.5 shadow-[0_0_22px_rgba(27,58,92,0.12)] transition-all duration-300 hover:border-navy/50 hover:shadow-[0_0_30px_rgba(27,58,92,0.24)] animate-[pulse_3s_ease-in-out_infinite]"
                      >
                        <span className="absolute left-0 top-0 h-full w-1 bg-navy" />
                        <span className="pl-2 text-[11px] font-bold uppercase tracking-[0.08em] text-navy/90">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Blocked dates calendar — read only */}
              {car.blockedDates && car.blockedDates.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-900/30">Availability Calendar</h3>
                  <p className="mt-1 text-[11px] text-gray-500">Red dates are unavailable.</p>
                  <div className="mt-3">
                    <CarCalendar blockedDates={car.blockedDates} onChange={() => {}} readOnly />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideo && car.videoUrl && (
        <VideoModal videoUrl={car.videoUrl} onClose={() => setShowVideo(false)} />
      )}
    </div>
  );
}
