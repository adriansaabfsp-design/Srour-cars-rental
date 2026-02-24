"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Car } from "@/lib/types";
import ImageGallery from "@/components/ImageGallery";
import VideoModal from "@/components/VideoModal";
import WhatsAppButton from "@/components/WhatsAppButton";
import Link from "next/link";

export default function CarDetailPage() {
  const params = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const docRef = doc(db, "cars", params.id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCar({ id: docSnap.id, ...docSnap.data() } as Car);
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
          <svg className="h-10 w-10 text-white/15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h2 className="font-serif text-3xl font-bold text-white">VEHICLE NOT FOUND</h2>
        <p className="mt-2 text-white/40">This listing may have been removed.</p>
        <Link
          href="/"
          className="mt-8 border border-terra bg-transparent px-10 py-3.5 text-[12px] font-bold uppercase tracking-[0.2em] text-terra transition-all duration-300 hover:bg-terra hover:text-white"
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
        <nav className="mb-8 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em]">
          <Link
            href="/"
            className="text-white/40 transition-colors hover:text-terra"
          >
            Home
          </Link>
          <svg className="h-3 w-3 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link
            href="/#collection"
            className="text-white/40 transition-colors hover:text-terra"
          >
            Collection
          </Link>
          <svg className="h-3 w-3 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-terra">{car.name}</span>
        </nav>

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
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-terra">
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
              <h1 className="font-serif text-4xl font-bold text-white sm:text-5xl">
                {car.name}
              </h1>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-serif text-5xl font-bold text-terra">
                  ${car.price}
                </span>
                <span className="text-sm text-white/30">/day</span>
              </div>

              <div className="my-7 h-px bg-luxury-border" />

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-luxury-border bg-black p-4 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30">Year</p>
                  <p className="mt-1 text-xl font-bold text-white">{car.year}</p>
                </div>
                <div className="border border-luxury-border bg-black p-4 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30">Mileage</p>
                  <p className="mt-1 text-xl font-bold text-white">{car.mileage.toLocaleString()} km</p>
                </div>
                <div className="border border-luxury-border bg-black p-4 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30">Fuel</p>
                  <p className="mt-1 text-xl font-bold text-white">{car.fuel}</p>
                </div>
                <div className="border border-luxury-border bg-black p-4 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30">Transmission</p>
                  <p className="mt-1 text-xl font-bold text-white">{car.transmission}</p>
                </div>
                <div className="col-span-2 border border-luxury-border bg-black p-4 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30">Seats</p>
                  <p className="mt-1 text-xl font-bold text-white">{car.seats}</p>
                </div>
              </div>

              {car.description && (
                <div className="mt-7">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30">About This Vehicle</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">{car.description}</p>
                </div>
              )}

              {/* Divider */}
              <div className="my-7 h-px bg-luxury-border" />

              {/* WhatsApp */}
              <WhatsAppButton phone={car.whatsapp} carName={car.name} />
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
