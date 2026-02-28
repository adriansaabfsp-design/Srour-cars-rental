"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";

/* ═══════════════════════ TRANSLATIONS ═══════════════════════ */

type Lang = "en" | "fr" | "ar";

const T = {
  en: {
    planTrip: "Plan your trip",
    heroTitle1: "WHEN TO VISIT",
    heroTitle2: "LEBANON",
    heroSub: "Your friendly guide to every season in Lebanon, and the perfect car to match",
    weather: "Weather",
    topSpots: "Where to go",
    bestCar: "Best car for this season",
    viewFleet: "View Fleet",
    readMore: "Read the full guide",
    quickRef: "Quick Reference",
    monthByMonth: "MONTH BY MONTH",
    month: "Month",
    weatherCol: "Weather",
    crowds: "Crowds",
    prices: "Prices",
    bestActivity: "Best For",
    quiz: "Interactive",
    quizTitle: "NOT SURE WHICH CAR TO PICK?",
    quizSub: "Answer three quick questions and we'll recommend the perfect vehicle for your Lebanon adventure.",
    q1: "When are you visiting?",
    q2: "Where are you going?",
    q3: "How many people?",
    weRecommend: "We recommend",
    perfectFor: (season: string, dest: string, people: string) =>
      `Perfect for a ${season} trip to the ${dest} with ${people} travelers.`,
    askTeam: "Need personalized help?",
    askTeamTitle: "ASK OUR TEAM",
    askTeamSub: "Not sure which season suits you best? Our team knows Lebanon inside and out. Reach out for personalized advice tailored to your trip.",
    askTeamBtn: "Chat With Us on WhatsApp",
    seasons: {
      Winter: {
        name: "Winter",
        months: "December to February",
        weather: "The mountains get blanketed in snow while the coast stays mild and pleasant. Faraya, Laklouk, and the Cedars become a winter wonderland. It's cold up high but the scenery is absolutely magical.",
        spots: ["Faraya Ski Resort", "Laklouk", "Cedars of Lebanon", "Bcharre"],
        car: "SUV or 4×4 for mountain roads",
        highlight: "Snow, skiing, cozy lodges, and empty mountain roads all to yourself.",
      },
      Spring: {
        name: "Spring",
        months: "March to May",
        weather: "This is when Lebanon is at its most beautiful. Warm sunshine, green valleys, wildflowers covering every hillside. The air smells incredible and the light is perfect for exploring.",
        spots: ["Chouf Cedar Reserve", "Tannourine", "Qadisha Valley", "Byblos", "Jeita Grotto"],
        car: "Any car works perfectly in spring",
        highlight: "The best weather of the year. Nature in full bloom, perfect for road trips and hiking.",
      },
      Summer: {
        name: "Summer",
        months: "June to August",
        weather: "Hot and sunny along the coast, but head up to the mountains and it's pleasantly cool. This is peak season so expect energy, nightlife, and crowds. The beaches are incredible.",
        spots: ["Tyre Beaches", "Jounieh Bay", "Batroun", "Byblos", "Ehden"],
        car: "Convertible or Sedan for coast, SUV for mountains",
        highlight: "Beach life, rooftop dinners, and the most vibrant nightlife in the Middle East.",
      },
      Autumn: {
        name: "Autumn",
        months: "September to November",
        weather: "Warm and dry days that slowly get cooler. This is Lebanon's secret season. The crowds thin out, the light turns golden, and the Bekaa Valley harvest season makes everything feel special.",
        spots: ["Baalbek", "Anjar", "Deir el Qamar", "Bekaa Valley Wineries"],
        car: "Sedan or SUV",
        highlight: "Fewer tourists, wine festivals, golden light, and the most relaxed vibe of the year.",
      },
    },
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    activities: { Skiing: "Skiing", Hiking: "Hiking", Beach: "Beach", Culture: "Culture" },
    quizSeasons: ["Winter", "Spring", "Summer", "Autumn"],
    quizDests: ["Mountains", "Coast", "City", "Mix"],
    quizPeople: ["1-2", "3-4", "5+"],
  },
  fr: {
    planTrip: "Planifiez votre voyage",
    heroTitle1: "QUAND VISITER",
    heroTitle2: "LE LIBAN",
    heroSub: "Votre guide amical pour chaque saison au Liban, et la voiture idéale pour chacune",
    weather: "Météo",
    topSpots: "Où aller",
    bestCar: "Meilleure voiture pour cette saison",
    viewFleet: "Voir la flotte",
    readMore: "Lire le guide complet",
    quickRef: "Référence rapide",
    monthByMonth: "MOIS PAR MOIS",
    month: "Mois",
    weatherCol: "Météo",
    crowds: "Affluence",
    prices: "Prix",
    bestActivity: "Idéal pour",
    quiz: "Interactif",
    quizTitle: "PAS SÛR QUELLE VOITURE CHOISIR ?",
    quizSub: "Répondez à trois questions rapides et nous vous recommanderons le véhicule idéal pour votre aventure libanaise.",
    q1: "Quand visitez-vous ?",
    q2: "Où allez-vous ?",
    q3: "Combien de personnes ?",
    weRecommend: "Nous recommandons",
    perfectFor: (season: string, dest: string, people: string) =>
      `Parfait pour un voyage ${season} vers ${dest} avec ${people} voyageurs.`,
    askTeam: "Besoin d'aide personnalisée ?",
    askTeamTitle: "DEMANDEZ À NOTRE ÉQUIPE",
    askTeamSub: "Pas sûr quelle saison vous convient le mieux ? Notre équipe connaît le Liban par cœur. Contactez-nous pour des conseils personnalisés.",
    askTeamBtn: "Discutez avec nous sur WhatsApp",
    seasons: {
      Winter: {
        name: "Hiver",
        months: "Décembre à Février",
        weather: "Les montagnes se couvrent de neige tandis que la côte reste douce et agréable. Faraya, Laklouk et les Cèdres deviennent un monde enchanté. Il fait froid en altitude mais le paysage est absolument magique.",
        spots: ["Station de ski de Faraya", "Laklouk", "Cèdres du Liban", "Bcharré"],
        car: "SUV ou 4×4 pour les routes de montagne",
        highlight: "Neige, ski, chalets confortables, et des routes de montagne rien que pour vous.",
      },
      Spring: {
        name: "Printemps",
        months: "Mars à Mai",
        weather: "C'est quand le Liban est au plus beau. Soleil chaleureux, vallées verdoyantes, fleurs sauvages partout. L'air sent incroyablement bon et la lumière est parfaite pour explorer.",
        spots: ["Réserve des Cèdres du Chouf", "Tannourine", "Vallée de la Qadisha", "Byblos", "Grotte de Jeita"],
        car: "N'importe quelle voiture convient parfaitement au printemps",
        highlight: "Le meilleur temps de l'année. La nature en pleine floraison, parfait pour les road trips.",
      },
      Summer: {
        name: "Été",
        months: "Juin à Août",
        weather: "Chaud et ensoleillé le long de la côte, mais montez dans les montagnes et c'est agréablement frais. C'est la haute saison avec beaucoup d'énergie et de vie nocturne. Les plages sont incroyables.",
        spots: ["Plages de Tyr", "Baie de Jounieh", "Batroun", "Byblos", "Ehden"],
        car: "Cabriolet ou Berline pour la côte, SUV pour les montagnes",
        highlight: "Vie de plage, dîners sur les toits, et la vie nocturne la plus vibrante du Moyen-Orient.",
      },
      Autumn: {
        name: "Automne",
        months: "Septembre à Novembre",
        weather: "Journées chaudes et sèches qui se rafraîchissent progressivement. C'est la saison secrète du Liban. Les foules diminuent, la lumière devient dorée, et la saison des récoltes dans la Bekaa rend tout spécial.",
        spots: ["Baalbek", "Anjar", "Deir el Qamar", "Vignobles de la Bekaa"],
        car: "Berline ou SUV",
        highlight: "Moins de touristes, festivals du vin, lumière dorée, et l'ambiance la plus détendue de l'année.",
      },
    },
    months: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
    activities: { Skiing: "Ski", Hiking: "Randonnée", Beach: "Plage", Culture: "Culture" },
    quizSeasons: ["Hiver", "Printemps", "Été", "Automne"],
    quizDests: ["Montagnes", "Côte", "Ville", "Mixte"],
    quizPeople: ["1-2", "3-4", "5+"],
  },
  ar: {
    planTrip: "خطط لرحلتك",
    heroTitle1: "متى تزور",
    heroTitle2: "لبنان",
    heroSub: "دليلك الودّي لكل فصل في لبنان، مع السيارة المثالية لكل موسم",
    weather: "الطقس",
    topSpots: "أين تذهب",
    bestCar: "أفضل سيارة لهذا الموسم",
    viewFleet: "شاهد الأسطول",
    readMore: "اقرأ الدليل الكامل",
    quickRef: "مرجع سريع",
    monthByMonth: "شهر بشهر",
    month: "الشهر",
    weatherCol: "الطقس",
    crowds: "الزحمة",
    prices: "الأسعار",
    bestActivity: "الأفضل لـ",
    quiz: "تفاعلي",
    quizTitle: "مو متأكد شو سيارة تختار؟",
    quizSub: "جاوب على ثلاث أسئلة سريعة ومنقترح عليك السيارة المثالية لمغامرتك بلبنان.",
    q1: "إيمتى رح تزور؟",
    q2: "لوين رايح؟",
    q3: "قديش شخص؟",
    weRecommend: "منقترح عليك",
    perfectFor: (season: string, dest: string, people: string) =>
      `مثالية لرحلة ${season} إلى ${dest} مع ${people} مسافرين.`,
    askTeam: "بحاجة لمساعدة شخصية؟",
    askTeamTitle: "اسأل فريقنا",
    askTeamSub: "مو متأكد أي فصل بيناسبك أكتر؟ فريقنا بيعرف لبنان زي كف إيدو. تواصل معنا لنصائح مخصصة لرحلتك.",
    askTeamBtn: "تواصل معنا على واتساب",
    seasons: {
      Winter: {
        name: "الشتاء",
        months: "كانون الأول إلى شباط",
        weather: "الجبال بتتغطى بالتلج والساحل بيضل دافي وحلو. فاريا ولقلوق والأرز بيصيروا جنة شتوية. الجو بارد بالعالي بس المنظر ساحر.",
        spots: ["منتجع فاريا للتزلج", "لقلوق", "أرز لبنان", "بشري"],
        car: "SUV أو 4×4 لطرقات الجبل",
        highlight: "تلج وتزلج وشاليهات دافية وطرقات جبلية هادية كلها إلك.",
      },
      Spring: {
        name: "الربيع",
        months: "آذار إلى أيار",
        weather: "هيدا الوقت يلي لبنان بيكون أحلى شي. شمس دافية، وديان خضرا، وورود برية بكل مكان. الهوا ريحتو حلوة والضو مثالي للاستكشاف.",
        spots: ["محمية أرز الشوف", "تنورين", "وادي قاديشا", "جبيل", "مغارة جعيتا"],
        car: "أي سيارة بتمشي تمام بالربيع",
        highlight: "أحلى طقس بالسنة. الطبيعة بأجمل حالاتها، مثالي لرحلات السيارة والمشي.",
      },
      Summer: {
        name: "الصيف",
        months: "حزيران إلى آب",
        weather: "حر وشمس على الساحل، بس اطلع عالجبل وبتلاقيها منيحة ولطيفة. هيدا موسم الذروة يعني في طاقة وسهرات وناس. الشواطئ رهيبة.",
        spots: ["شواطئ صور", "خليج جونيه", "البترون", "جبيل", "إهدن"],
        car: "كشف أو سيدان للساحل، SUV للجبال",
        highlight: "حياة البحر، عشاء على السطوح، وأحلى سهرات بالشرق الأوسط.",
      },
      Autumn: {
        name: "الخريف",
        months: "أيلول إلى تشرين الثاني",
        weather: "أيام دافية وناشفة بتبرد شوي شوي. هيدا الموسم السري تبع لبنان. الناس بتقل، الضو بيصير ذهبي، وموسم القطاف بالبقاع بيخلي كل شي مميز.",
        spots: ["بعلبك", "عنجر", "دير القمر", "كروم البقاع"],
        car: "سيدان أو SUV",
        highlight: "سياح أقل، مهرجانات نبيذ، ضو ذهبي، وأهدى جو بالسنة.",
      },
    },
    months: ["كانون الثاني", "شباط", "آذار", "نيسان", "أيار", "حزيران", "تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول"],
    activities: { Skiing: "تزلج", Hiking: "مشي", Beach: "بحر", Culture: "ثقافة" },
    quizSeasons: ["الشتاء", "الربيع", "الصيف", "الخريف"],
    quizDests: ["جبال", "ساحل", "مدينة", "مزيج"],
    quizPeople: ["1-2", "3-4", "5+"],
  },
};

/* ═══════════════════════ SEASON DATA ═══════════════════════ */

const SEASON_KEYS = ["Winter", "Spring", "Summer", "Autumn"] as const;
type SeasonKey = (typeof SEASON_KEYS)[number];

const SEASON_IMAGES: Record<SeasonKey, string> = {
  Winter: "/season-winter.jpg",
  Spring: "/season-spring.jpg",
  Summer: "/season-summer.jpg",
  Autumn: "/season-autumn.jpg",
};

const SEASON_COLORS: Record<SeasonKey, { accent: string; accentBg: string }> = {
  Winter: { accent: "text-navy", accentBg: "bg-navy" },
  Spring: { accent: "text-navy", accentBg: "bg-navy" },
  Summer: { accent: "text-navy", accentBg: "bg-navy" },
  Autumn: { accent: "text-navy", accentBg: "bg-navy" },
};

/* ═══════════════════════ MONTH TABLE ═══════════════════════ */

interface MonthRow {
  seasonKey: SeasonKey;
  crowd: "Low" | "Medium" | "High";
  price: "Low" | "Medium" | "High";
  activity: "Skiing" | "Hiking" | "Beach" | "Culture";
}

const MONTH_DATA: MonthRow[] = [
  { seasonKey: "Winter",  crowd: "Low",    price: "Low",    activity: "Skiing" },
  { seasonKey: "Winter",  crowd: "Low",    price: "Low",    activity: "Skiing" },
  { seasonKey: "Spring",  crowd: "Medium", price: "Medium", activity: "Hiking" },
  { seasonKey: "Spring",  crowd: "Medium", price: "Medium", activity: "Hiking" },
  { seasonKey: "Spring",  crowd: "Medium", price: "Medium", activity: "Culture" },
  { seasonKey: "Summer",  crowd: "High",   price: "High",   activity: "Beach" },
  { seasonKey: "Summer",  crowd: "High",   price: "High",   activity: "Beach" },
  { seasonKey: "Summer",  crowd: "High",   price: "High",   activity: "Beach" },
  { seasonKey: "Autumn",  crowd: "Medium", price: "Medium", activity: "Culture" },
  { seasonKey: "Autumn",  crowd: "Low",    price: "Medium", activity: "Culture" },
  { seasonKey: "Autumn",  crowd: "Low",    price: "Low",    activity: "Hiking" },
  { seasonKey: "Winter",  crowd: "Low",    price: "Low",    activity: "Skiing" },
];

function levelColor(level: string) {
  if (level === "Low") return "text-green-600";
  if (level === "Medium") return "text-amber-600";
  return "text-red-500";
}

function activityBadge(activity: string) {
  const map: Record<string, string> = {
    Skiing:  "bg-sky-100 text-sky-700 border-sky-200",
    Hiking:  "bg-emerald-100 text-emerald-700 border-emerald-200",
    Beach:   "bg-amber-100 text-amber-700 border-amber-200",
    Culture: "bg-purple-100 text-purple-700 border-purple-200",
  };
  return map[activity] || "bg-gray-100 text-gray-600";
}

/* ═══════════════════════ QUIZ LOGIC ═══════════════════════ */

type QuizSeason = 0 | 1 | 2 | 3 | null;
type QuizDest = 0 | 1 | 2 | 3 | null;
type QuizPeople = 0 | 1 | 2 | null;

function getRecommendation(season: QuizSeason, dest: QuizDest, people: QuizPeople): string {
  if (season === null || dest === null || people === null) return "";
  if (dest === 0 || season === 0) {
    return people === 2 ? "Full-Size SUV" : "Compact SUV or 4×4";
  }
  if (dest === 1 && season === 2) {
    return people === 0 ? "Convertible" : people === 1 ? "Sedan" : "Full-Size SUV";
  }
  if (dest === 2) {
    return people === 2 ? "Full-Size SUV" : people === 0 ? "Compact Sedan or Hatchback" : "Sedan";
  }
  if (people === 2) return "Full-Size SUV";
  if (people === 0) return "Crossover SUV";
  return "Mid-Size SUV";
}

/* ═══════════════════════ PAGE ═══════════════════════ */

function SeasonalGuideInner() {
  const searchParams = useSearchParams();
  const langParam = searchParams.get("lang") as Lang | null;
  const initialLang: Lang = langParam && ["en", "fr", "ar"].includes(langParam) ? langParam : "en";

  const [lang, setLang] = useState<Lang>(initialLang);
  const [qSeason, setQSeason] = useState<QuizSeason>(null);
  const [qDest, setQDest] = useState<QuizDest>(null);
  const [qPeople, setQPeople] = useState<QuizPeople>(null);

  const t = T[lang];
  const isRtl = lang === "ar";
  const recommendation = useMemo(() => getRecommendation(qSeason, qDest, qPeople), [qSeason, qDest, qPeople]);

  return (
    <div className="min-h-screen bg-white" dir={isRtl ? "rtl" : "ltr"}>

      {/* Language Switcher */}
      <div className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2 sm:px-6">
          <Breadcrumb items={[{ label: lang === "ar" ? "الرئيسية" : lang === "fr" ? "Accueil" : "Home", href: "/" }, { label: lang === "ar" ? "دليل المواسم" : lang === "fr" ? "Guide saisonnier" : "Seasonal Guide" }]} />
          <div className="flex items-center gap-1">
            {([["en", "EN"], ["fr", "FR"], ["ar", "عربي"]] as [Lang, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setLang(key)}
                className={
                  "rounded-full px-3 py-1 text-[11px] font-bold transition-all " +
                  (lang === key
                    ? "bg-navy text-white"
                    : "text-gray-400 hover:text-gray-700")
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f0f4f8] to-white">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:py-24">
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-navy sm:text-xs">
            {t.planTrip}
          </p>
          <h1 className="mt-4 font-serif text-4xl font-black tracking-tight text-gray-900 sm:text-6xl">
            {t.heroTitle1}
            <br />
            <span className="text-navy">{t.heroTitle2}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-gray-500">
            {t.heroSub}
          </p>
        </div>
      </section>

      {/* Season Cards */}
      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <div className="space-y-10 sm:space-y-14">
          {SEASON_KEYS.map((key, i) => {
            const s = t.seasons[key];
            const isEven = i % 2 === 0;

            return (
              <div key={key} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                <div className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"}`}>
                  {/* Image */}
                  <div className="relative h-72 w-full lg:h-auto lg:min-h-[420px] lg:w-[45%]">
                    <img
                      src={SEASON_IMAGES[key]}
                      alt={s.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                    <div className="absolute bottom-5 left-5 sm:bottom-6 sm:left-6">
                      <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/60">
                        {s.months}
                      </span>
                      <h2 className="mt-1 font-serif text-3xl font-bold text-white sm:text-4xl">
                        {s.name}
                      </h2>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col justify-between p-6 sm:p-8 lg:p-10">
                    {/* Weather */}
                    <div>
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-navy">
                        {t.weather}
                      </p>
                      <p className="text-[15px] leading-relaxed text-gray-500">
                        {s.weather}
                      </p>
                    </div>

                    {/* Spots */}
                    <div className="mt-6">
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-navy">
                        {t.topSpots}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {s.spots.map((spot) => (
                          <span
                            key={spot}
                            className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[12px] font-medium text-gray-600"
                          >
                            {spot}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Car recommendation */}
                    <div className="mt-6 border-t border-gray-100 pt-5">
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-navy">
                        {t.bestCar}
                      </p>
                      <span className="mt-1 block text-sm font-semibold text-gray-700">{s.car}</span>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <Link
                        href={`/seasonal-guide/${key.toLowerCase()}?lang=${lang}`}
                        className="rounded-lg border border-gray-200 px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-600 transition-all hover:border-navy hover:text-navy"
                      >
                        {t.readMore} →
                      </Link>
                      <Link
                        href="/#collection"
                        className="rounded-lg bg-navy px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-white transition-all hover:bg-navy/90"
                      >
                        {t.viewFleet}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Month by Month Table */}
      <section className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="mb-10 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-navy">
              {t.quickRef}
            </p>
            <h2 className="mt-3 font-serif text-2xl font-bold text-gray-900 sm:text-4xl">
              {t.monthByMonth}
            </h2>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full min-w-[600px] border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  {[t.month, t.weatherCol, t.crowds, t.prices, t.bestActivity].map((h) => (
                    <th key={h} className="px-4 py-3 text-start text-[10px] font-bold uppercase tracking-[0.2em] text-navy">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MONTH_DATA.map((m, i) => (
                  <tr key={i} className="border-b border-gray-100 transition-colors hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-sm font-semibold text-gray-700">
                      {t.months[i]}
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold text-gray-500">
                      {t.seasons[m.seasonKey].name}
                    </td>
                    <td className={`px-4 py-3 text-xs font-bold uppercase tracking-wider ${levelColor(m.crowd)}`}>
                      {m.crowd}
                    </td>
                    <td className={`px-4 py-3 text-xs font-bold uppercase tracking-wider ${levelColor(m.price)}`}>
                      {m.price}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${activityBadge(m.activity)}`}>
                        {t.activities[m.activity]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Quiz */}
      <section className="border-t border-gray-200">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="mb-10 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-navy">
              {t.quiz}
            </p>
            <h2 className="mt-3 font-serif text-2xl font-bold text-gray-900 sm:text-4xl">
              {t.quizTitle}
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-gray-400">
              {t.quizSub}
            </p>
          </div>

          <div className="space-y-6">
            {/* Q1 */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
              <p className="mb-4 text-sm font-bold text-gray-700">
                1. {t.q1}
              </p>
              <div className="flex flex-wrap gap-2">
                {t.quizSeasons.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQSeason(idx as QuizSeason)}
                    className={
                      "rounded-lg border px-4 py-2.5 text-[12px] font-bold transition-all " +
                      (qSeason === idx
                        ? "border-navy bg-navy text-white"
                        : "border-gray-200 text-gray-500 hover:border-navy/30 hover:text-gray-700")
                    }
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Q2 */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
              <p className="mb-4 text-sm font-bold text-gray-700">
                2. {t.q2}
              </p>
              <div className="flex flex-wrap gap-2">
                {t.quizDests.map((d, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQDest(idx as QuizDest)}
                    className={
                      "rounded-lg border px-4 py-2.5 text-[12px] font-bold transition-all " +
                      (qDest === idx
                        ? "border-navy bg-navy text-white"
                        : "border-gray-200 text-gray-500 hover:border-navy/30 hover:text-gray-700")
                    }
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Q3 */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
              <p className="mb-4 text-sm font-bold text-gray-700">
                3. {t.q3}
              </p>
              <div className="flex flex-wrap gap-2">
                {t.quizPeople.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQPeople(idx as QuizPeople)}
                    className={
                      "rounded-lg border px-4 py-2.5 text-[12px] font-bold transition-all " +
                      (qPeople === idx
                        ? "border-navy bg-navy text-white"
                        : "border-gray-200 text-gray-500 hover:border-navy/30 hover:text-gray-700")
                    }
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Result */}
            {recommendation && (
              <div className="rounded-xl border-2 border-navy/20 bg-navy/5 p-6 text-center sm:p-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-navy">
                  {t.weRecommend}
                </p>
                <p className="mt-3 font-serif text-2xl font-bold text-navy sm:text-3xl">
                  {recommendation}
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  {t.perfectFor(
                    t.quizSeasons[qSeason!],
                    t.quizDests[qDest!],
                    t.quizPeople[qPeople!],
                  )}
                </p>
                <Link
                  href="/#collection"
                  className="mt-6 inline-block rounded-lg bg-navy px-8 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-navy/90"
                >
                  {t.viewFleet} →
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="border-t border-gray-200 bg-navy">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:py-20">
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/50">
            {t.askTeam}
          </p>
          <h2 className="mt-4 font-serif text-3xl font-bold text-white sm:text-4xl">
            {t.askTeamTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/50">
            {t.askTeamSub}
          </p>
          <a
            href="https://wa.me/96181062329"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-3 rounded-lg bg-white px-8 py-4 text-[12px] font-bold uppercase tracking-[0.15em] text-navy transition-all hover:bg-gray-100"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.356 0-4.57-.652-6.454-1.785l-.45-.27-2.527.847.847-2.527-.27-.45A9.965 9.965 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
            </svg>
            {t.askTeamBtn}
          </a>
        </div>
      </section>
    </div>
  );
}

export default function SeasonalGuidePage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-navy" /></div>}>
      <SeasonalGuideInner />
    </Suspense>
  );
}
