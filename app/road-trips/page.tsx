"use client";

import Link from "next/link";

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Moderate: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Adventure: "bg-red-500/15 text-red-400 border-red-500/30",
};

interface RoadTrip {
  title: string;
  distance: string;
  description: string;
  bestTime: string;
  recommendedCar: string;
  carType: string;
  difficulty: "Easy" | "Moderate" | "Adventure";
  highlights: string[];
}

const ROAD_TRIPS: RoadTrip[] = [
  {
    title: "Beirut to Faraya",
    distance: "46 km · ~1 hr",
    description:
      "Wind through Mount Lebanon's dramatic switchbacks to reach Faraya-Mzaar, Lebanon's premier ski resort. The route climbs from sea level to 1,850m, passing through charming mountain villages, pine forests, and opening up to sweeping panoramic views of the Mediterranean below.",
    bestTime: "Winter (Dec – Mar)",
    recommendedCar: "SUV",
    carType: "SUV",
    difficulty: "Moderate",
    highlights: ["Jounieh Bay views", "Harissa statue", "Faqra ruins", "Mzaar ski slopes"],
  },
  {
    title: "Beirut to Tyre",
    distance: "83 km · ~1.5 hrs",
    description:
      "Cruise the stunning southern coastal highway along the Mediterranean. This relaxed drive takes you past ancient Sidon, through banana plantations, and ends at the UNESCO World Heritage site of Tyre with its pristine beaches and Roman-era hippodrome ruins.",
    bestTime: "Summer (Jun – Sep)",
    recommendedCar: "Sedan",
    carType: "Sedan",
    difficulty: "Easy",
    highlights: ["Sidon Sea Castle", "Orange groves", "Tyre Roman ruins", "Sour beaches"],
  },
  {
    title: "Beirut to Baalbek",
    distance: "86 km · ~2 hrs",
    description:
      "Cross the Mount Lebanon range into the Bekaa Valley to reach one of the most impressive Roman temple complexes in the world. The drive offers a dramatic contrast — from the bustling coast over a mountain pass into the wide, fertile Bekaa plain stretching to the Anti-Lebanon mountains.",
    bestTime: "Spring / Fall",
    recommendedCar: "SUV",
    carType: "SUV",
    difficulty: "Moderate",
    highlights: ["Dahr el Baydar pass", "Bekaa vineyards", "Ksara winery", "Temple of Jupiter"],
  },
  {
    title: "The Chouf Cedar Road",
    distance: "60 km · ~2 hrs",
    description:
      "Journey into the heart of the Chouf Mountains to witness the legendary cedars of Lebanon — some over 2,000 years old. The route passes through Druze villages, the magnificent Beiteddine Palace, and into the Al Shouf Cedar Nature Reserve, the largest protected area in Lebanon.",
    bestTime: "Spring (Apr – Jun)",
    recommendedCar: "4×4",
    carType: "SUV",
    difficulty: "Adventure",
    highlights: ["Beiteddine Palace", "Deir el Qamar", "Al Shouf Cedar Reserve", "Cedar forests"],
  },
  {
    title: "North Lebanon Loop",
    distance: "160 km · ~5 hrs",
    description:
      "The ultimate North Lebanon circuit: drive from Beirut to Bcharre — home of Khalil Gibran — descend into the breathtaking Qadisha Valley (Holy Valley), a UNESCO site carved into dramatic limestone gorges, then loop through Tripoli with its Crusader castle, souks, and the best street food in Lebanon.",
    bestTime: "Summer (Jun – Sep)",
    recommendedCar: "Any car",
    carType: "All",
    difficulty: "Adventure",
    highlights: ["Qadisha Valley", "Gibran Museum", "The Cedars of God", "Tripoli souks"],
  },
];

export default function RoadTripsPage() {
  return (
    <div className="min-h-screen bg-luxury-black">
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden border-b border-luxury-border bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,_rgba(201,168,76,0.12),_transparent)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-luxury-black" />
        <div className="relative mx-auto max-w-5xl px-4 py-24 text-center sm:py-32 lg:py-40">
          <div className="animate-fade-in-up">
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-gold/60 sm:text-xs">
              Explore the country
            </p>
            <h1 className="mt-4 font-serif text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
              DISCOVER
              <br />
              <span className="bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
                LEBANON
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-white/40 sm:text-base">
              Iconic Road Trips &amp; The Perfect Car for Each
            </p>
            <div className="mx-auto mt-6 h-[2px] w-20 bg-gradient-to-r from-transparent via-gold to-transparent" />
          </div>
        </div>
      </section>

      {/* ─── ROAD TRIP CARDS ─── */}
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="space-y-8">
          {ROAD_TRIPS.map((trip, index) => (
            <article
              key={trip.title}
              className="group overflow-hidden border border-luxury-border bg-luxury-card transition-all hover:border-gold/20"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-6 sm:p-8">
                {/* top row */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/25">
                        Route {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={
                          "border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider " +
                          DIFFICULTY_COLORS[trip.difficulty]
                        }
                      >
                        {trip.difficulty}
                      </span>
                    </div>
                    <h2 className="mt-2 font-serif text-2xl font-bold text-white sm:text-3xl">
                      {trip.title}
                    </h2>
                    <div className="mt-1 flex items-center gap-2 text-xs text-white/30">
                      <svg className="h-3.5 w-3.5 text-gold/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{trip.distance}</span>
                    </div>
                  </div>
                </div>

                {/* description */}
                <p className="mt-4 text-sm leading-relaxed text-white/40">
                  {trip.description}
                </p>

                {/* highlights */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {trip.highlights.map((h) => (
                    <span
                      key={h}
                      className="border border-luxury-border bg-luxury-dark px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-white/30"
                    >
                      {h}
                    </span>
                  ))}
                </div>

                {/* bottom info row */}
                <div className="mt-6 flex flex-wrap items-center gap-6 border-t border-luxury-border pt-5">
                  <div>
                    <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/20">
                      Best Time
                    </div>
                    <div className="mt-1 text-sm font-semibold text-white/70">
                      {trip.bestTime}
                    </div>
                  </div>
                  <div className="h-8 w-px bg-luxury-border" />
                  <div>
                    <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/20">
                      Recommended Car
                    </div>
                    <div className="mt-1 text-sm font-semibold text-gold">
                      {trip.recommendedCar}
                    </div>
                  </div>
                  <div className="ml-auto">
                    <Link
                      href={trip.carType === "All" ? "/#collection" : `/#collection`}
                      className="inline-flex items-center gap-2 border border-gold bg-transparent px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-gold transition-all hover:bg-gold hover:text-black"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17h8M8 17v-4m8 4v-4m-8 0h8m-8 0L6 9h12l-2 4M6 9l-2 4h2m12-4l2 4h-2" />
                      </svg>
                      Book This Car
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* ─── PLAN YOUR TRIP ─── */}
      <section className="border-t border-luxury-border bg-luxury-card">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:py-20">
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-gold/50">
            Ready to hit the road?
          </p>
          <h2 className="mt-4 font-serif text-3xl font-bold text-white sm:text-4xl">
            PLAN YOUR TRIP
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/30">
            Our team can help you choose the perfect car, plan your itinerary, and arrange
            everything for an unforgettable Lebanese road trip experience.
          </p>
          <a
            href="https://wa.me/961"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-3 bg-gold px-8 py-4 text-[12px] font-bold uppercase tracking-[0.2em] text-black transition-all hover:bg-gold-light"
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
