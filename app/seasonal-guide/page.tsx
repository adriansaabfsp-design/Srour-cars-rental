"use client";

import { useState, useMemo } from "react";

/* ─────────────────── icons ─────────────────── */
function SnowflakeIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v20m0-20l-3 3m3-3l3 3m-3 17l-3-3m3 3l3-3M2 12h20m-20 0l3-3m-3 3l3 3m17-3l-3-3m3 3l-3 3M6.34 6.34l11.32 11.32M6.34 6.34l1.41 3.18m-1.41-3.18l3.18 1.41m6.73 6.73l1.41 3.18m-1.41-3.18l3.18 1.41M17.66 6.34L6.34 17.66m11.32-11.32l-1.41 3.18m1.41-3.18l-3.18 1.41M6.34 17.66l-1.41-3.18m1.41 3.18l-3.18-1.41" />
    </svg>
  );
}
function FlowerIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 22V12m0 0c2-3.5 6-5 6-8a6 6 0 00-12 0c0 3 4 4.5 6 8z" />
      <circle cx="12" cy="9" r="2" />
    </svg>
  );
}
function SunIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="4" />
      <path strokeLinecap="round" d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.07-7.07l-1.41 1.41M8.34 15.66l-1.41 1.41m0-12.14l1.41 1.41m7.32 7.32l1.41 1.41" />
    </svg>
  );
}
function LeafIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89-.66C8 13 14 12 17 8zm0 0c4-2 5-7 5-7s-5 1-7 5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

/* ─────────────────── data ─────────────────── */
interface Season {
  name: string;
  months: string;
  icon: React.FC<{ className?: string }>;
  color: string; // tailwind bg class for accent
  weather: string;
  destinations: string[];
  recommendedCar: string;
  pros: string[];
  cons: string[];
}

const SEASONS: Season[] = [
  {
    name: "Winter",
    months: "December — February",
    icon: SnowflakeIcon,
    color: "from-sky-400/20 to-sky-600/5",
    weather:
      "Cold in the mountains with heavy snowfall, mild on the Mediterranean coast. Snow blankets Faraya, Laklouk, and the legendary Cedars.",
    destinations: [
      "Faraya Ski Resort",
      "Laklouk",
      "Cedars of Lebanon",
      "Bcharre",
    ],
    recommendedCar: "SUV or 4×4 for mountain roads",
    pros: [
      "World-class skiing and snow scenery",
      "Less tourist crowds",
      "Lower rental prices",
      "Cozy mountain lodge culture",
    ],
    cons: [
      "Mountain roads can be icy and dangerous",
      "Some roads close in heavy snow",
      "Limited daylight hours",
    ],
  },
  {
    name: "Spring",
    months: "March — May",
    icon: FlowerIcon,
    color: "from-emerald-400/20 to-emerald-600/5",
    weather:
      "Perfect — warm sunshine, lush green landscapes, and wildflowers blooming everywhere across the countryside.",
    destinations: [
      "Chouf Cedar Reserve",
      "Tannourine",
      "Qadisha Valley",
      "Byblos",
      "Jeita Grotto",
    ],
    recommendedCar: "Any — perfect driving conditions",
    pros: [
      "Best weather of the year",
      "Nature is absolutely stunning",
      "Festivals and cultural events",
      "Ideal for hiking and road trips",
    ],
    cons: [
      "Some rain in March",
      "Roads can be busy on weekends",
      "Accommodation books up for Easter",
    ],
  },
  {
    name: "Summer",
    months: "June — August",
    icon: SunIcon,
    color: "from-amber-400/20 to-amber-600/5",
    weather:
      "Hot and sunny on the coast, pleasantly cool in the mountains. This is peak tourist season with maximum energy.",
    destinations: [
      "Tyre Beaches",
      "Jounieh Bay",
      "Batroun",
      "Byblos",
      "Ehden",
      "Full Coastal Drive",
    ],
    recommendedCar: "Convertible or Sedan for coast, SUV for mountains",
    pros: [
      "Beach weather and water sports",
      "Vibrant nightlife scene",
      "All attractions and restaurants open",
      "Long daylight hours",
    ],
    cons: [
      "Heavy traffic in Beirut",
      "Higher rental prices",
      "Very hot in the Bekaa Valley",
    ],
  },
  {
    name: "Autumn",
    months: "September — November",
    icon: LeafIcon,
    color: "from-orange-400/20 to-orange-600/5",
    weather:
      "Warm and dry, gradually cooling as November approaches. Lebanon's best-kept secret season for travel.",
    destinations: [
      "Baalbek",
      "Anjar",
      "Deir el Qamar",
      "Bekaa Valley Wine Regions",
    ],
    recommendedCar: "Sedan or SUV",
    pros: [
      "Fewer crowds than summer",
      "Fantastic weather for sightseeing",
      "Harvest season and wine festivals",
      "Golden light for photography",
    ],
    cons: [
      "Some beach clubs close in October",
      "Shorter daylight hours",
      "Can get rainy toward late November",
    ],
  },
];

/* ── month table data ── */
interface MonthRow {
  month: string;
  weatherIcon: React.FC<{ className?: string }>;
  crowd: "Low" | "Medium" | "High";
  price: "Low" | "Medium" | "High";
  bestActivity: string;
}

const MONTHS: MonthRow[] = [
  { month: "January",   weatherIcon: SnowflakeIcon, crowd: "Low",    price: "Low",    bestActivity: "Skiing" },
  { month: "February",  weatherIcon: SnowflakeIcon, crowd: "Low",    price: "Low",    bestActivity: "Skiing" },
  { month: "March",     weatherIcon: FlowerIcon,     crowd: "Medium", price: "Medium", bestActivity: "Hiking" },
  { month: "April",     weatherIcon: FlowerIcon,     crowd: "Medium", price: "Medium", bestActivity: "Hiking" },
  { month: "May",       weatherIcon: FlowerIcon,     crowd: "Medium", price: "Medium", bestActivity: "Culture" },
  { month: "June",      weatherIcon: SunIcon,        crowd: "High",   price: "High",   bestActivity: "Beach" },
  { month: "July",      weatherIcon: SunIcon,        crowd: "High",   price: "High",   bestActivity: "Beach" },
  { month: "August",    weatherIcon: SunIcon,        crowd: "High",   price: "High",   bestActivity: "Beach" },
  { month: "September", weatherIcon: LeafIcon,       crowd: "Medium", price: "Medium", bestActivity: "Culture" },
  { month: "October",   weatherIcon: LeafIcon,       crowd: "Low",    price: "Medium", bestActivity: "Culture" },
  { month: "November",  weatherIcon: LeafIcon,       crowd: "Low",    price: "Low",    bestActivity: "Hiking" },
  { month: "December",  weatherIcon: SnowflakeIcon,  crowd: "Low",    price: "Low",    bestActivity: "Skiing" },
];

function levelColor(level: string) {
  if (level === "Low") return "text-green-400";
  if (level === "Medium") return "text-amber-400";
  return "text-red-400";
}

function activityBadge(activity: string) {
  const map: Record<string, string> = {
    Skiing:  "bg-sky-500/15 text-sky-300 border-sky-500/20",
    Hiking:  "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
    Beach:   "bg-amber-500/15 text-amber-300 border-amber-500/20",
    Culture: "bg-purple-500/15 text-purple-300 border-purple-500/20",
  };
  return map[activity] || "bg-white/10 text-white/50";
}

/* ── quiz logic ── */
type QuizSeason = "Winter" | "Spring" | "Summer" | "Autumn" | null;
type QuizDest = "Mountains" | "Coast" | "City" | "Mix" | null;
type QuizPeople = "1-2" | "3-4" | "5+" | null;

function getRecommendation(season: QuizSeason, dest: QuizDest, people: QuizPeople): string {
  if (!season || !dest || !people) return "";

  // Mountain + many people or winter → SUV
  if (dest === "Mountains" || season === "Winter") {
    return people === "5+" ? "Full-Size SUV" : "Compact SUV or 4×4";
  }
  // Coast + summer → convertible / sedan
  if (dest === "Coast" && season === "Summer") {
    return people === "1-2" ? "Convertible" : people === "3-4" ? "Sedan" : "Full-Size SUV";
  }
  // City
  if (dest === "City") {
    return people === "5+" ? "Full-Size SUV" : people === "1-2" ? "Compact Sedan or Hatchback" : "Sedan";
  }
  // Mix
  if (people === "5+") return "Full-Size SUV";
  if (people === "1-2") return "Crossover SUV";
  return "Mid-Size SUV";
}

/* ─────────────────── components ─────────────────── */

function SeasonCard({ season, index }: { season: Season; index: number }) {
  const Icon = season.icon;
  const isEven = index % 2 === 0;

  return (
    <div className="relative overflow-hidden border border-luxury-border bg-luxury-card">
      {/* gradient accent */}
      <div className={`absolute inset-0 bg-gradient-to-br ${season.color} pointer-events-none`} />

      <div className="relative flex flex-col lg:flex-row">
        {/* ─ left: header ─ */}
        <div
          className={
            "flex flex-col items-center justify-center gap-3 border-b border-luxury-border px-8 py-10 lg:w-72 lg:border-b-0 lg:py-14 " +
            (isEven ? "lg:border-r" : "lg:order-2 lg:border-l")
          }
        >
          <Icon className="h-10 w-10 text-navy" />
          <h3 className="font-serif text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">
            {season.name}
          </h3>
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-navy">
            {season.months}
          </p>
        </div>

        {/* ─ right: content ─ */}
        <div className={"flex-1 px-6 py-8 sm:px-10 sm:py-10 " + (!isEven ? "lg:order-1" : "")}>
          {/* weather */}
          <div className="mb-6">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.3em] text-navy">Weather</p>
            <p className="text-sm leading-relaxed text-white/50">{season.weather}</p>
          </div>

          {/* destinations */}
          <div className="mb-6">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-navy">
              Best Destinations
            </p>
            <div className="flex flex-wrap gap-2">
              {season.destinations.map((d) => (
                <span
                  key={d}
                  className="border border-navy/15 bg-navy/5 px-3 py-1.5 text-[11px] font-medium text-navy/80"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>

          {/* recommended car */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-navy">
              Recommended Car:
            </p>
            <span className="text-sm font-semibold text-white/70">{season.recommendedCar}</span>
            <a
              href="/#collection"
              className="ml-auto border border-navy/30 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-navy transition-all hover:bg-navy hover:text-white"
            >
              View Fleet →
            </a>
          </div>

          {/* pros/cons */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-green-400/60">
                Pros
              </p>
              <ul className="space-y-2">
                {season.pros.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-[13px] leading-snug text-white/45">
                    <CheckIcon /> {p}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-red-400/40">
                Cons
              </p>
              <ul className="space-y-2">
                {season.cons.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-[13px] leading-snug text-white/35">
                    <XIcon /> {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── quiz option button ── */
function QuizBtn({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "border px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] transition-all sm:px-5 " +
        (active
          ? "border-navy bg-navy text-white"
          : "border-luxury-border bg-luxury-card text-white/50 hover:border-navy/30 hover:text-white")
      }
    >
      {label}
    </button>
  );
}

/* ─────────────────── page ─────────────────── */
export default function SeasonalGuidePage() {
  const [qSeason, setQSeason] = useState<QuizSeason>(null);
  const [qDest, setQDest] = useState<QuizDest>(null);
  const [qPeople, setQPeople] = useState<QuizPeople>(null);

  const recommendation = useMemo(
    () => getRecommendation(qSeason, qDest, qPeople),
    [qSeason, qDest, qPeople],
  );

  return (
    <div className="min-h-screen bg-luxury-black">
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden border-b border-luxury-border bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,_rgba(27,58,92,0.12),_transparent)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-luxury-black" />

        <div className="relative mx-auto max-w-5xl px-4 py-20 text-center sm:py-28 lg:py-32">
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-navy sm:text-xs">
            Plan your trip
          </p>
          <h1 className="mt-4 font-serif text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            WHEN TO VISIT
            <br />
            <span className="text-white">
              LEBANON
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/40 sm:text-base">
            Your seasonal guide to exploring Lebanon in style
          </p>
          <div className="mx-auto mt-5 h-[2px] w-20 bg-gradient-to-r from-transparent via-navy to-transparent" />
        </div>
      </section>

      {/* ─── SEASON CARDS ─── */}
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="space-y-8">
          {SEASONS.map((s, i) => (
            <SeasonCard key={s.name} season={s} index={i} />
          ))}
        </div>
      </section>

      {/* ─── MONTH BY MONTH ─── */}
      <section className="border-t border-luxury-border bg-black/40">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="mb-10 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-navy">
              Quick Reference
            </p>
            <h2 className="mt-3 font-serif text-2xl font-bold text-white sm:text-4xl">
              MONTH BY MONTH
            </h2>
            <div className="mx-auto mt-4 h-[2px] w-16 bg-gradient-to-r from-transparent via-navy to-transparent" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr className="border-b border-luxury-border">
                  {["Month", "Weather", "Crowds", "Prices", "Best Activity"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.25em] text-navy"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MONTHS.map((m) => {
                  const WIcon = m.weatherIcon;
                  return (
                    <tr
                      key={m.month}
                      className="border-b border-luxury-border/50 transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="px-4 py-3.5 text-sm font-semibold text-white/70">
                        {m.month}
                      </td>
                      <td className="px-4 py-3.5">
                        <WIcon className="h-5 w-5 text-navy" />
                      </td>
                      <td className={`px-4 py-3.5 text-xs font-bold uppercase tracking-wider ${levelColor(m.crowd)}`}>
                        {m.crowd}
                      </td>
                      <td className={`px-4 py-3.5 text-xs font-bold uppercase tracking-wider ${levelColor(m.price)}`}>
                        {m.price}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-block border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${activityBadge(m.bestActivity)}`}
                        >
                          {m.bestActivity}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── QUIZ ─── */}
      <section className="border-t border-luxury-border">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="mb-10 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-navy">
              Interactive
            </p>
            <h2 className="mt-3 font-serif text-2xl font-bold text-white sm:text-4xl">
              NOT SURE WHICH CAR TO PICK?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-white/30">
              Answer three quick questions and we&apos;ll recommend the perfect vehicle for your
              Lebanon adventure.
            </p>
            <div className="mx-auto mt-4 h-[2px] w-16 bg-gradient-to-r from-transparent via-navy to-transparent" />
          </div>

          <div className="space-y-8">
            {/* Q1 */}
            <div className="border border-luxury-border bg-luxury-card p-6 sm:p-8">
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-navy">
                1 &mdash; When are you visiting?
              </p>
              <div className="flex flex-wrap gap-2">
                {(["Winter", "Spring", "Summer", "Autumn"] as const).map((s) => (
                  <QuizBtn key={s} label={s} active={qSeason === s} onClick={() => setQSeason(s)} />
                ))}
              </div>
            </div>

            {/* Q2 */}
            <div className="border border-luxury-border bg-luxury-card p-6 sm:p-8">
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-navy">
                2 &mdash; Where are you going?
              </p>
              <div className="flex flex-wrap gap-2">
                {(["Mountains", "Coast", "City", "Mix"] as const).map((d) => (
                  <QuizBtn key={d} label={d} active={qDest === d} onClick={() => setQDest(d)} />
                ))}
              </div>
            </div>

            {/* Q3 */}
            <div className="border border-luxury-border bg-luxury-card p-6 sm:p-8">
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-navy">
                3 &mdash; How many people?
              </p>
              <div className="flex flex-wrap gap-2">
                {(["1-2", "3-4", "5+"] as const).map((p) => (
                  <QuizBtn key={p} label={p} active={qPeople === p} onClick={() => setQPeople(p)} />
                ))}
              </div>
            </div>

            {/* result */}
            {recommendation && (
              <div className="border border-navy/30 bg-navy/5 p-6 text-center sm:p-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-navy">
                  We recommend
                </p>
                <p className="mt-3 font-serif text-2xl font-bold text-navy sm:text-3xl">
                  {recommendation}
                </p>
                <p className="mt-2 text-sm text-white/35">
                  Perfect for a {qSeason?.toLowerCase()} trip to the {qDest?.toLowerCase()} with{" "}
                  {qPeople} traveler{qPeople === "1-2" ? "s" : "s"}.
                </p>
                <a
                  href="/#collection"
                  className="mt-6 inline-block bg-navy px-8 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-navy-light"
                >
                  View Fleet →
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── WHATSAPP CTA ─── */}
      <section className="border-t border-luxury-border bg-luxury-card">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:py-20">
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-navy">
            Need personalized help?
          </p>
          <h2 className="mt-4 font-serif text-3xl font-bold text-white sm:text-4xl">
            ASK OUR TEAM
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/30">
            Not sure which season suits you best? Our team knows Lebanon inside and out — reach
            out for personalized advice tailored to your trip.
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
            Ask Our Team for Personalized Advice
          </a>
        </div>
      </section>
    </div>
  );
}
