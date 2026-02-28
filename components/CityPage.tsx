"use client";

import { CityData } from "@/lib/cities";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";

export default function CityPage({ city }: { city: CityData }) {
  const whatsappMsg = encodeURIComponent(
    `Hi, I would like to rent a car in ${city.name}. Could you help me with availability and pricing?`
  );

  return (
    <div className="min-h-screen bg-luxury-black">
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,_rgba(27,58,92,0.12),_transparent)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-white" />
        <div className="relative mx-auto max-w-4xl px-4 pb-16 pt-32 text-center sm:px-6 sm:pb-24 sm:pt-40">
          <div className="mb-6 flex justify-center">
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: `Car Rental ${city.name}` }]} />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-navy sm:text-xs">
            Leb🌲non Rental
          </p>
          <h1 className="mt-4 font-serif text-3xl font-bold text-gray-900 sm:text-5xl lg:text-6xl">
            CAR RENTAL IN{" "}
            <span className="text-gray-900">
              {city.name.toUpperCase()}
            </span>
          </h1>
          <div className="mx-auto mt-4 h-[2px] w-20 bg-gradient-to-r from-transparent via-navy to-transparent" />
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-gray-900/40 sm:text-base">
            {city.heroDescription}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/#collection"
              className="inline-block border border-navy bg-navy px-7 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-navy-light"
            >
              View Our Fleet
            </Link>
            <a
              href={`https://wa.me/96181062329?text=${whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-navy/40 bg-transparent px-7 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-navy transition-all hover:bg-navy hover:text-white"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.356 0-4.57-.652-6.454-1.785l-.45-.27-2.527.847.847-2.527-.27-.45A9.965 9.965 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
              </svg>
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* ─── WHY RENT IN [CITY] ─── */}
      <section className="border-b border-luxury-border">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="mb-8 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-navy">
              Explore {city.name}
            </p>
            <h2 className="mt-3 font-serif text-2xl font-bold text-gray-900 sm:text-3xl">
              WHY RENT A CAR IN {city.name.toUpperCase()}?
            </h2>
            <div className="mx-auto mt-4 h-[2px] w-16 bg-gradient-to-r from-transparent via-navy to-transparent" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {city.whyRent.map((reason, i) => (
              <div
                key={i}
                className="flex items-start gap-3 border border-luxury-border bg-luxury-card p-5"
              >
                <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center bg-navy/10">
                  <svg
                    className="h-3.5 w-3.5 text-navy"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-[13px] leading-relaxed text-gray-900/40">{reason}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DELIVERY ─── */}
      <section className="border-b border-luxury-border bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 sm:py-20">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center border border-navy/20 bg-navy/5">
            <svg
              className="h-8 w-8 text-navy"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H21M3.375 14.25h-.375a3 3 0 013-3h.095M17.25 18.75h3.375a1.125 1.125 0 001.125-1.125v-3.057a3 3 0 00-.879-2.122L18.75 10.5h-1.5a3 3 0 00-3 3v5.25"
              />
            </svg>
          </div>
          <h2 className="font-serif text-2xl font-bold text-gray-900 sm:text-3xl">
            DELIVERED TO YOUR DOOR IN {city.name.toUpperCase()}
          </h2>
          <div className="mx-auto mt-4 h-[2px] w-16 bg-gradient-to-r from-transparent via-navy to-transparent" />
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-gray-900/40">
            {city.deliveryText}
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="tel:+96181062329"
              className="inline-flex items-center gap-2 text-sm font-semibold text-navy transition-colors hover:text-gray-900"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              +961 81 062 329
            </a>
            <span className="hidden text-gray-900/10 sm:inline">|</span>
            <a
              href="mailto:support@lebanon-rental.com"
              className="text-sm text-gray-900/30 transition-colors hover:text-gray-900"
            >
              support@lebanon-rental.com
            </a>
          </div>
        </div>
      </section>

      {/* ─── CROSS PROMO (if applicable) ─── */}
      {city.crossPromo && (
        <section className="relative overflow-hidden border-b border-luxury-border">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,_rgba(27,58,92,0.06),_transparent)]" />
          <div className="relative mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 sm:py-20">
            <div className="mx-auto mb-6 h-[1px] w-24 bg-gradient-to-r from-transparent via-navy/40 to-transparent" />
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-navy">
              Complete Your Stay
            </p>
            <h2 className="mt-4 font-serif text-2xl font-bold text-gray-900 sm:text-3xl">
              STAYING IN {city.name.toUpperCase()}?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-gray-900/40">
              {city.crossPromo}
            </p>
            {city.propertyCount && (
              <div className="mt-6 inline-flex items-center gap-2 border border-navy/20 bg-navy/5 px-5 py-2.5">
                <span className="font-serif text-2xl font-bold text-navy">
                  {city.propertyCount}+
                </span>
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900/40">
                  Properties Available
                </span>
              </div>
            )}
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/#collection"
                className="inline-block border border-navy bg-navy px-7 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-navy-light"
              >
                Browse Our Fleet
              </Link>
              <a
                href="https://lebanon-rental.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border border-navy/40 bg-transparent px-7 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-navy transition-all hover:bg-navy hover:text-white"
              >
                Browse Properties &rarr;
              </a>
            </div>
            <div className="mx-auto mt-8 h-[1px] w-24 bg-gradient-to-r from-transparent via-navy/40 to-transparent" />
          </div>
        </section>
      )}

      {/* ─── OTHER CITIES ─── */}
      <section className="border-b border-luxury-border">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="mb-8 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-navy">
              More locations
            </p>
            <h2 className="mt-3 font-serif text-2xl font-bold text-gray-900 sm:text-3xl">
              EXPLORE OTHER CITIES
            </h2>
            <div className="mx-auto mt-4 h-[2px] w-16 bg-gradient-to-r from-transparent via-navy to-transparent" />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { name: "Beirut", slug: "car-rental-beirut" },
              { name: "Tripoli", slug: "car-rental-tripoli" },
              { name: "Jounieh", slug: "car-rental-jounieh" },
              { name: "Batroun", slug: "car-rental-batroun" },
              { name: "Jbeil (Byblos)", slug: "car-rental-jbeil" },
              { name: "Sidon", slug: "car-rental-sidon" },
              { name: "Tyre", slug: "car-rental-tyre" },
              { name: "Faraya", slug: "car-rental-faraya" },
              { name: "Zahle", slug: "car-rental-zahle" },
            ]
              .filter((c) => c.slug !== city.slug)
              .map((c) => (
                <Link
                  key={c.slug}
                  href={`/${c.slug}`}
                  className="border border-luxury-border bg-luxury-card px-5 py-3 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900/40 transition-all hover:border-navy/40 hover:text-gray-900"
                >
                  {c.name}
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 sm:py-20">
          <h2 className="font-serif text-2xl font-bold text-gray-900 sm:text-3xl">
            READY TO EXPLORE {city.name.toUpperCase()}?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-gray-900/30">
            Book your premium rental car today. We deliver to your door in{" "}
            {city.name} — free delivery, 24/7 support, and the best rates in
            Lebanon.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <a
              href={`https://wa.me/96181062329?text=${whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-navy bg-navy px-7 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-navy-light"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.356 0-4.57-.652-6.454-1.785l-.45-.27-2.527.847.847-2.527-.27-.45A9.965 9.965 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
              </svg>
              Book via WhatsApp
            </a>
            <Link
              href="/#collection"
              className="inline-block border border-navy/40 bg-transparent px-7 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-navy transition-all hover:bg-navy hover:text-white"
            >
              View Full Fleet &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
