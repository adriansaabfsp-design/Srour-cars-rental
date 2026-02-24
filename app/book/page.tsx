"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

const CITIES = [
  "Beirut",
  "Tripoli",
  "Jounieh",
  "Batroun",
  "Jbeil (Byblos)",
  "Sidon",
  "Tyre",
  "Faraya",
  "Zahle",
];

function BookingForm() {
  const searchParams = useSearchParams();

  const carName = searchParams.get("car") || "";
  const carPrice = searchParams.get("price") || "";
  const phone = searchParams.get("phone") || "96181062329";

  const [pickupCity, setPickupCity] = useState("Beirut");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  // Calculate number of days
  const days =
    pickupDate && returnDate
      ? Math.max(
          1,
          Math.ceil(
            (new Date(returnDate).getTime() - new Date(pickupDate).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;

  const totalPrice = days && carPrice ? days * Number(carPrice) : 0;

  const waMessage = encodeURIComponent(
    `Hi, I'd like to rent the following car:\n\n` +
      `🚗 Car: ${carName}\n` +
      `💰 Price: $${carPrice}/day\n` +
      `📍 Pickup Location: ${pickupCity}\n` +
      `📅 Pickup Date: ${pickupDate || "Not selected"}\n` +
      `📅 Return Date: ${returnDate || "Not selected"}\n` +
      (days ? `📆 Duration: ${days} day${days > 1 ? "s" : ""}\n` : "") +
      (totalPrice ? `💵 Estimated Total: $${totalPrice}\n` : "") +
      `\nIs this car available? Thank you!`
  );

  const waUrl = `https://wa.me/${phone}?text=${waMessage}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-16">
        {/* Back link */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 transition-colors hover:text-navy"
        >
          <svg
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Collection
        </Link>

        {/* Header */}
        <div className="mb-8 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-navy">
            Booking
          </p>
          <h1 className="mt-2 font-serif text-2xl font-bold text-gray-900 sm:text-4xl">
            RENT THIS CAR
          </h1>
        </div>

        {/* Booking card */}
        <div className="border border-gray-200 bg-white p-5 sm:p-8">
          {/* Selected car summary */}
          {carName && (
            <div className="mb-6 border border-navy/10 bg-navy/[0.03] p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-navy/50">
                Selected Vehicle
              </p>
              <p className="mt-1 font-serif text-xl font-bold text-gray-900">
                {carName}
              </p>
              {carPrice && (
                <p className="mt-1 text-sm text-navy font-semibold">
                  ${carPrice}
                  <span className="text-gray-400 font-normal">/day</span>
                </p>
              )}
            </div>
          )}

          {/* Form fields */}
          <div className="space-y-4">
            {/* Pickup Location */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900/40">
                Pickup Location
              </label>
              <select
                value={pickupCity}
                onChange={(e) => setPickupCity(e.target.value)}
                className="border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-navy/50"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Pickup Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900/40">
                Pickup Date
              </label>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-navy/50 [color-scheme:light]"
              />
            </div>

            {/* Return Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900/40">
                Return Date
              </label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-navy/50 [color-scheme:light]"
              />
            </div>

            {/* Summary */}
            {days > 0 && (
              <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="text-sm text-gray-500">
                  {days} day{days > 1 ? "s" : ""}
                </span>
                {totalPrice > 0 && (
                  <span className="font-serif text-xl font-bold text-navy">
                    ${totalPrice}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Check Availability Button */}
          <div className="mt-6">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex w-full items-center justify-center gap-3 bg-navy px-8 py-4 text-[13px] font-bold uppercase tracking-[0.15em] text-white transition-all duration-300 hover:bg-navy-light hover:shadow-[0_0_30px_rgba(27,58,92,0.3)] active:scale-[0.98]"
            >
              <svg
                className="h-5 w-5 transition-transform group-hover:scale-110"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Check Availability
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-navy border-t-transparent" />
        </div>
      }
    >
      <BookingForm />
    </Suspense>
  );
}
