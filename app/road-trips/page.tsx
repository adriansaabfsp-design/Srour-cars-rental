"use client";

import Link from "next/link";
import { useState } from "react";

/* ── colours ── */
const DIFF_STYLE: Record<string, string> = {
  Easy: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Moderate: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Adventure: "bg-red-500/15 text-red-400 border-red-500/30",
};

const SEASON_ICON: Record<string, string> = {
  Winter: "❄️",
  Summer: "☀️",
  Spring: "🌸",
  "Spring/Fall": "🍂",
  "Spring/Summer": "🌿",
  "Any season": "📅",
};

/* ── categories ── */
const CATEGORIES = [
  "All",
  "Mountains & Nature",
  "Historical & Cultural",
  "Coastal Drives",
  "Hidden Gems",
] as const;

type Category = (typeof CATEGORIES)[number];

/* ── data ── */
interface Trip {
  title: string;
  category: Category;
  distance: string;
  description: string;
  bestTime: string;
  recommendedCar: string;
  difficulty: "Easy" | "Moderate" | "Adventure";
}

const TRIPS: Trip[] = [
  // ─── Mountains & Nature ───
  {
    title: "Beirut to Faraya",
    category: "Mountains & Nature",
    distance: "46 km · ~1 hr",
    description:
      "Lebanon's premier ski resort via dramatic mountain switchbacks. Climb from sea level to 1,850 m through pine forests and panoramic Mediterranean views.",
    bestTime: "Winter",
    recommendedCar: "SUV",
    difficulty: "Moderate",
  },
  {
    title: "Beirut to Laklouk",
    category: "Mountains & Nature",
    distance: "70 km · ~1.5 hrs",
    description:
      "A quieter alternative to Faraya with pristine slopes and fewer crowds. The winding road passes through charming villages and snow-dusted cedars.",
    bestTime: "Winter",
    recommendedCar: "SUV",
    difficulty: "Moderate",
  },
  {
    title: "Beirut to Ehden",
    category: "Mountains & Nature",
    distance: "120 km · ~2.5 hrs",
    description:
      "Reach one of Lebanon's most beautiful mountain villages. Ehden Nature Reserve hosts ancient cedars, wild orchids, and cool summer breezes.",
    bestTime: "Summer",
    recommendedCar: "SUV",
    difficulty: "Moderate",
  },
  {
    title: "Beirut to Tannourine",
    category: "Mountains & Nature",
    distance: "80 km · ~2 hrs",
    description:
      "Home to the famous Tannourine Cedar Reserve and the spectacular Baatara Gorge sinkhole waterfall — one of Lebanon's natural wonders.",
    bestTime: "Spring",
    recommendedCar: "4×4",
    difficulty: "Adventure",
  },
  {
    title: "Beirut to Jezzine",
    category: "Mountains & Nature",
    distance: "82 km · ~1.5 hrs",
    description:
      "Southern Lebanon's jewel with the iconic 40-meter waterfall, pine-covered hillsides, and artisan cutlery shops in a scenic mountain town.",
    bestTime: "Spring/Summer",
    recommendedCar: "Sedan / SUV",
    difficulty: "Easy",
  },
  {
    title: "Wadi Qadisha Full Loop",
    category: "Mountains & Nature",
    distance: "140 km · ~4 hrs",
    description:
      "Explore the Holy Valley — one of the most scenic gorges in the Middle East — with ancient monasteries carved into cliff faces and breathtaking depths.",
    bestTime: "Spring/Fall",
    recommendedCar: "4×4",
    difficulty: "Adventure",
  },

  // ─── Historical & Cultural ───
  {
    title: "Beirut to Baalbek",
    category: "Historical & Cultural",
    distance: "86 km · ~2 hrs",
    description:
      "Cross the Mount Lebanon range into the Bekaa Valley to witness the most impressive Roman temple complex on Earth — the Temple of Jupiter.",
    bestTime: "Spring/Fall",
    recommendedCar: "SUV",
    difficulty: "Moderate",
  },
  {
    title: "Beirut to Byblos (Jbeil)",
    category: "Historical & Cultural",
    distance: "42 km · ~45 min",
    description:
      "Visit one of the oldest continuously inhabited cities in the world. Crusader castle, ancient harbour, and vibrant old souk by the sea.",
    bestTime: "Any season",
    recommendedCar: "Sedan",
    difficulty: "Easy",
  },
  {
    title: "Beirut to Sidon (Saida)",
    category: "Historical & Cultural",
    distance: "44 km · ~45 min",
    description:
      "Explore the ancient Phoenician port city with its iconic Sea Castle, bustling Khan el-Franj, and labyrinthine old souk.",
    bestTime: "Any season",
    recommendedCar: "Sedan",
    difficulty: "Easy",
  },
  {
    title: "Beirut to Anjar",
    category: "Historical & Cultural",
    distance: "58 km · ~1 hr",
    description:
      "Discover the unique Umayyad palace ruins in the Bekaa Valley — the only significant Umayyad remains in Lebanon, surrounded by vineyards.",
    bestTime: "Spring/Fall",
    recommendedCar: "Sedan",
    difficulty: "Easy",
  },
  {
    title: "Beirut to Deir el Qamar",
    category: "Historical & Cultural",
    distance: "42 km · ~1 hr",
    description:
      "A perfectly preserved Ottoman-era mountain town in the Chouf with palaces, churches, and a stunning central square frozen in time.",
    bestTime: "Any season",
    recommendedCar: "Sedan",
    difficulty: "Easy",
  },

  // ─── Coastal Drives ───
  {
    title: "Beirut to Tyre (Sour)",
    category: "Coastal Drives",
    distance: "83 km · ~1.5 hrs",
    description:
      "The full southern coastal Mediterranean drive past ancient cities, banana groves, and ending at UNESCO-listed Tyre with pristine beaches.",
    bestTime: "Summer",
    recommendedCar: "Sedan / Convertible",
    difficulty: "Easy",
  },
  {
    title: "Beirut to Jounieh",
    category: "Coastal Drives",
    distance: "20 km · ~30 min",
    description:
      "Cruise along the famous Jounieh Bay to the Casino du Liban, then ride the Téléférique cable car up to Harissa for sweeping coastal views.",
    bestTime: "Any season",
    recommendedCar: "Sedan",
    difficulty: "Easy",
  },
  {
    title: "The Full Coast Drive",
    category: "Coastal Drives",
    distance: "220 km · ~5 hrs",
    description:
      "The ultimate Lebanese coastal road trip — Tripoli all the way south to Naqoura along the entire Mediterranean shoreline. Top down, windows down.",
    bestTime: "Summer",
    recommendedCar: "Convertible",
    difficulty: "Moderate",
  },

  // ─── Hidden Gems ───
  {
    title: "Akkar Region",
    category: "Hidden Gems",
    distance: "140 km · ~3 hrs",
    description:
      "Untouched north Lebanon with secret waterfalls, ancient forests, and mountain villages barely known to tourists. True off-the-grid Lebanon.",
    bestTime: "Spring/Summer",
    recommendedCar: "4×4",
    difficulty: "Adventure",
  },
  {
    title: "Chouf Cedar Road",
    category: "Hidden Gems",
    distance: "60 km · ~2 hrs",
    description:
      "Journey through the UNESCO Al-Shouf Cedar Nature Reserve — Lebanon's largest protected area — past Druze villages and 2,000-year-old cedars.",
    bestTime: "Spring",
    recommendedCar: "SUV",
    difficulty: "Moderate",
  },
  {
    title: "North Lebanon Loop",
    category: "Hidden Gems",
    distance: "160 km · ~5 hrs",
    description:
      "Bcharre, Qadisha Valley, and Tripoli in one epic loop. Gibran Museum, Cedars of God, crusader castles, and the best street food in Lebanon.",
    bestTime: "Summer",
    recommendedCar: "SUV",
    difficulty: "Adventure",
  },
];

/* ── page ── */
export default function RoadTripsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const filtered =
    activeCategory === "All"
      ? TRIPS
      : TRIPS.filter((t) => t.category === activeCategory);

  return (
    <div className="min-h-screen bg-luxury-black">
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden border-b border-luxury-border bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,_rgba(27,58,92,0.12),_transparent)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-luxury-black" />
        <div className="relative mx-auto max-w-5xl px-4 py-20 text-center sm:py-28 lg:py-36">
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-navy sm:text-xs">
            Explore the country
          </p>
          <h1 className="mt-4 font-serif text-4xl font-black tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
            DISCOVER
            <br />
            <span className="text-gray-900">
              LEBANON
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-gray-900/40 sm:text-base">
            Iconic Road Trips &amp; The Perfect Car for Each
          </p>
          <div className="mx-auto mt-5 h-[2px] w-20 bg-gradient-to-r from-transparent via-navy to-transparent" />
        </div>
      </section>

      {/* ─── CATEGORY TABS ─── */}
      <div className="sticky top-20 z-30 border-b border-luxury-border bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center gap-1 overflow-x-auto px-4 py-3 sm:justify-center sm:gap-2 sm:px-6">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            const count =
              cat === "All" ? TRIPS.length : TRIPS.filter((t) => t.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={
                  "flex-shrink-0 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] transition-all sm:text-[11px] " +
                  (isActive
                    ? "bg-navy text-white"
                    : "border border-luxury-border bg-luxury-card text-gray-900/50 hover:border-navy/30 hover:text-gray-900")
                }
              >
                {cat === "All" ? "All Routes" : cat}
                <span
                  className={
                    "ml-1.5 text-[9px] " + (isActive ? "text-gray-900/50" : "text-navy")
                  }
                >
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── TRIP CARDS ─── */}
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* category heading when filtered */}
        {activeCategory !== "All" && (
          <h2 className="mb-8 font-serif text-2xl font-bold text-gray-900 sm:text-3xl">
            {activeCategory}
            <span className="ml-3 text-sm font-normal text-gray-900/30">
              {filtered.length} route{filtered.length !== 1 ? "s" : ""}
            </span>
          </h2>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          {filtered.map((trip, i) => (
            <article
              key={trip.title}
              className="group flex flex-col overflow-hidden border border-luxury-border bg-luxury-card transition-all hover:border-navy/20"
            >
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                {/* badges row */}
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span
                    className={
                      "border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider " +
                      DIFF_STYLE[trip.difficulty]
                    }
                  >
                    {trip.difficulty}
                  </span>
                  <span className="border border-luxury-border bg-luxury-dark px-2.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-gray-900/30">
                    {SEASON_ICON[trip.bestTime] || "📅"} {trip.bestTime}
                  </span>
                </div>

                {/* title + distance */}
                <h3 className="font-serif text-xl font-bold text-gray-900 sm:text-2xl">
                  {trip.title}
                </h3>
                <div className="mt-1 flex items-center gap-1.5 text-[11px] text-gray-900/25">
                  <svg
                    className="h-3 w-3 text-navy/40"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {trip.distance}
                </div>

                {/* description */}
                <p className="mt-3 flex-1 text-[13px] leading-relaxed text-gray-900/35">
                  {trip.description}
                </p>

                {/* bottom row */}
                <div className="mt-5 flex items-center justify-between border-t border-luxury-border pt-4">
                  <div>
                    <div className="text-[8px] font-bold uppercase tracking-[0.25em] text-gray-900/20">
                      Recommended
                    </div>
                    <div className="mt-0.5 text-sm font-semibold text-navy">
                      {trip.recommendedCar}
                    </div>
                  </div>
                  <Link
                    href="/#collection"
                    className="inline-flex items-center gap-1.5 border border-navy/60 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.15em] text-navy transition-all hover:bg-navy hover:text-white"
                  >
                    View Fleet
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
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-lg text-gray-900/30">No routes in this category yet.</p>
          </div>
        )}
      </div>

      {/* ─── PLAN YOUR TRIP ─── */}
      <section className="border-t border-luxury-border bg-luxury-card">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:py-20">
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-navy">
            Ready to hit the road?
          </p>
          <h2 className="mt-4 font-serif text-3xl font-bold text-gray-900 sm:text-4xl">
            PLAN YOUR TRIP
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-gray-900/30">
            Our team can help you choose the perfect car, plan your itinerary, and arrange
            everything for an unforgettable Lebanese road trip.
          </p>
          <a
            href="https://wa.me/96181062329"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-3 bg-navy px-8 py-4 text-[12px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-navy-light"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.356 0-4.57-.652-6.454-1.785l-.45-.27-2.527.847.847-2.527-.27-.45A9.965 9.965 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
            </svg>
            Talk to Our Team
          </a>
        </div>
      </section>
    </div>
  );
}
