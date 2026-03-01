"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════ */

type Vibe = "adventure" | "coastal" | "luxury" | "family";
type Passengers = "1-2" | "3-4" | "5-7";
type Scenery = "mountains" | "coast" | "history" | "hidden";
type Budget = "economy" | "mid" | "premium";

interface Question {
  id: string;
  title: string;
  subtitle: string;
  options: { value: string; label: string; desc: string; image?: string; rotate?: number }[];
}

const QUESTIONS: Question[] = [
  {
    id: "vibe",
    title: "WHAT'S THE VIBE?",
    subtitle: "Choose the mood for your trip",
    options: [
      { value: "adventure", label: "Adventure", desc: "Mountains, off-road, nature", image: "/quiz/adventure.jpg" },
      { value: "coastal", label: "Coastal Chill", desc: "Beach towns, seaside drives", image: "/quiz/coastal.jpg" },
      { value: "luxury", label: "Luxury Escape", desc: "Premium experience", image: "/quiz/luxury.jpg" },
      { value: "family", label: "Family Trip", desc: "Comfortable & spacious", image: "/quiz/family.jpg?v=2" },
    ],
  },
  {
    id: "passengers",
    title: "HOW MANY PASSENGERS?",
    subtitle: "Select your group size",
    options: [
      { value: "1-2", label: "1–2", desc: "Couple or solo" },
      { value: "3-4", label: "3–4", desc: "Small group" },
      { value: "5-7", label: "5–7", desc: "Family or large group" },
    ],
  },
  {
    id: "scenery",
    title: "PICK YOUR SCENERY",
    subtitle: "What do you want to see?",
    options: [
      { value: "mountains", label: "Mountains & Cedars", desc: "Alpine roads & ancient forests" },
      { value: "coast", label: "Coast & Beaches", desc: "Mediterranean shoreline" },
      { value: "history", label: "History & Culture", desc: "Ancient ruins & old towns" },
      { value: "hidden", label: "Hidden Gems", desc: "Off-the-beaten-path" },
    ],
  },
  {
    id: "budget",
    title: "WHAT'S YOUR BUDGET?",
    subtitle: "Daily rental budget range",
    options: [
      { value: "economy", label: "Economy", desc: "Under $60/day" },
      { value: "mid", label: "Mid-Range", desc: "$60–$100/day" },
      { value: "premium", label: "Premium", desc: "$100+/day" },
    ],
  },
];

/* ── road trips ── */
interface TripResult {
  name: string;
  distance: string;
  duration: string;
  description: string;
}

const TRIPS: Record<string, TripResult> = {
  ehden: {
    name: "Beirut to Ehden",
    distance: "120 km",
    duration: "~2.5 hrs",
    description: "Mountain village with ancient cedars and cool summer breezes",
  },
  tannourine: {
    name: "Beirut to Tannourine",
    distance: "80 km",
    duration: "~2 hrs",
    description: "Cedar reserve and the spectacular Baatara Gorge waterfall",
  },
  jezzine: {
    name: "Beirut to Jezzine",
    distance: "82 km",
    duration: "~1.5 hrs",
    description: "Pine-covered hillsides and a stunning 40-meter waterfall",
  },
  qadisha: {
    name: "Wadi Qadisha Full Loop",
    distance: "140 km",
    duration: "~4 hrs",
    description: "The Holy Valley — ancient monasteries carved into cliff faces",
  },
  batrounCoast: {
    name: "Batroun Coastal Drive",
    distance: "55 km",
    duration: "~1 hr",
    description: "Seaside roads, beach bars, and Phoenician sea walls",
  },
  byblosBatroun: {
    name: "Byblos to Batroun",
    distance: "15 km",
    duration: "~30 min",
    description: "Ancient harbour city to lively coastal town along the Med",
  },
  baalbek: {
    name: "Beirut to Baalbek",
    distance: "86 km",
    duration: "~2 hrs",
    description: "The most impressive Roman temple complex on Earth",
  },
  chouf: {
    name: "Chouf Cedar Road",
    distance: "60 km",
    duration: "~2 hrs",
    description: "UNESCO-listed cedar reserve and Druze mountain villages",
  },
  farayaLaklouk: {
    name: "Faraya & Laklouk Loop",
    distance: "100 km",
    duration: "~3 hrs",
    description: "Lebanon's premier mountain resorts with dramatic switchbacks",
  },
  tripoliBcharre: {
    name: "Tripoli to Bcharre",
    distance: "70 km",
    duration: "~2 hrs",
    description: "Gibran Museum, Cedars of God, and deep Qadisha views",
  },
  fullCoast: {
    name: "The Full Coast Drive",
    distance: "220 km",
    duration: "~5 hrs",
    description: "The ultimate Lebanese Mediterranean shoreline road trip",
  },
  akkar: {
    name: "Akkar Region",
    distance: "140 km",
    duration: "~3 hrs",
    description: "Untouched north with secret waterfalls and ancient forests",
  },
  northLoop: {
    name: "North Lebanon Loop",
    distance: "160 km",
    duration: "~5 hrs",
    description: "Bcharre, Qadisha Valley, and Tripoli in one epic loop",
  },
};

/* ── car categories ── */
interface CarResult {
  category: string;
  tagline: string;
}

const CARS: Record<string, CarResult> = {
  sedan: { category: "Sedan", tagline: "Smooth rides on Lebanon's scenic highways" },
  suv: { category: "SUV", tagline: "Conquer every mountain road with comfort" },
  luxury: { category: "Luxury", tagline: "The ultimate premium driving experience" },
  economy: { category: "Economy", tagline: "Smart value without compromising the adventure" },
  fourByFour: { category: "4×4", tagline: "Built for Lebanon's wildest mountain roads" },
  convertible: { category: "Convertible", tagline: "Feel the Mediterranean breeze, top down" },
};

/* ═══════════════════════════════════════════════════════
   MATCHING LOGIC
   ═══════════════════════════════════════════════════════ */

interface MatchResult {
  car: CarResult;
  trip: TripResult;
}

function getMatch(answers: {
  vibe: Vibe;
  passengers: Passengers;
  scenery: Scenery;
  budget: Budget;
}): MatchResult {
  const { vibe, passengers, scenery, budget } = answers;

  // Budget override for economy
  if (budget === "economy") {
    const trip = getEconomyTrip(scenery);
    return { car: CARS.economy, trip };
  }

  // Luxury vibe always gets luxury car
  if (vibe === "luxury") {
    const trip = getLuxuryTrip(scenery);
    const car = CARS.luxury;
    return { car, trip };
  }

  // Adventure vibe
  if (vibe === "adventure") {
    return getAdventureMatch(scenery, passengers, budget);
  }

  // Coastal chill
  if (vibe === "coastal") {
    return getCoastalMatch(scenery, passengers, budget);
  }

  // Family trip
  if (vibe === "family") {
    return getFamilyMatch(scenery, passengers, budget);
  }

  // Fallback
  return { car: CARS.sedan, trip: TRIPS.jezzine };
}

function getAdventureMatch(scenery: Scenery, passengers: Passengers, budget: Budget): MatchResult {
  if (scenery === "mountains") {
    const car = passengers === "5-7" ? CARS.suv : CARS.fourByFour;
    const trip = Math.random() > 0.5 ? TRIPS.qadisha : TRIPS.tannourine;
    return { car, trip };
  }
  if (scenery === "coast") {
    const car = budget === "premium" ? CARS.convertible : CARS.suv;
    return { car, trip: TRIPS.fullCoast };
  }
  if (scenery === "history") {
    const car = passengers === "5-7" ? CARS.suv : CARS.fourByFour;
    return { car, trip: TRIPS.baalbek };
  }
  // hidden gems
  const car = CARS.fourByFour;
  const trip = Math.random() > 0.5 ? TRIPS.akkar : TRIPS.northLoop;
  return { car, trip };
}

function getCoastalMatch(scenery: Scenery, passengers: Passengers, budget: Budget): MatchResult {
  if (scenery === "coast") {
    const car = budget === "premium" || passengers === "1-2" ? CARS.convertible : CARS.sedan;
    return { car, trip: TRIPS.batrounCoast };
  }
  if (scenery === "mountains") {
    return { car: CARS.suv, trip: TRIPS.ehden };
  }
  if (scenery === "history") {
    return { car: CARS.sedan, trip: TRIPS.byblosBatroun };
  }
  // hidden gems
  return { car: passengers === "5-7" ? CARS.suv : CARS.sedan, trip: TRIPS.northLoop };
}

function getFamilyMatch(scenery: Scenery, passengers: Passengers, budget: Budget): MatchResult {
  const car = passengers === "5-7" || scenery === "mountains" ? CARS.suv : CARS.sedan;
  if (scenery === "mountains") {
    return { car, trip: TRIPS.ehden };
  }
  if (scenery === "coast") {
    return { car, trip: TRIPS.byblosBatroun };
  }
  if (scenery === "history") {
    return { car, trip: TRIPS.baalbek };
  }
  // hidden
  return { car: CARS.suv, trip: TRIPS.chouf };
}

function getLuxuryTrip(scenery: Scenery): TripResult {
  if (scenery === "mountains") return TRIPS.ehden;
  if (scenery === "coast") return TRIPS.batrounCoast;
  if (scenery === "history") return TRIPS.baalbek;
  return TRIPS.chouf;
}

function getEconomyTrip(scenery: Scenery): TripResult {
  if (scenery === "mountains") return TRIPS.jezzine;
  if (scenery === "coast") return TRIPS.byblosBatroun;
  if (scenery === "history") return TRIPS.baalbek;
  return TRIPS.chouf;
}

/* ═══════════════════════════════════════════════════════
   SPARKLE / CONFETTI ANIMATION
   ═══════════════════════════════════════════════════════ */

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
  angle: number;
}

function Sparkles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const colors = ["#1B3A5C", "#2A5080", "#F0F4F8", "#FFD700", "#ffffff", "#87CEEB"];
    const p: Particle[] = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.8,
      duration: Math.random() * 1.5 + 1,
      angle: Math.random() * 360,
    }));
    setParticles(p);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-sparkle-fall"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.size > 8 ? "2px" : "50%",
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.angle}deg)`,
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */

export default function MatchMyTrip() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<MatchResult | null>(null);
  const [slideDir, setSlideDir] = useState<"left" | "right">("left");
  const [isAnimating, setIsAnimating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalSteps = QUESTIONS.length;
  const isLastStep = step === totalSteps - 1;
  const showingResult = result !== null && showResult;

  const open = useCallback(() => {
    setIsOpen(true);
    setStep(0);
    setAnswers({});
    setResult(null);
    setShowResult(false);
    setIsAnimating(false);
    document.body.style.overflow = "hidden";
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    document.body.style.overflow = "";
    // Mark as seen so popup doesn't reappear
    try { localStorage.setItem("matchMyTripSeen", "1"); } catch {}
  }, []);

  /* ── Auto-popup on first visit ── */
  useEffect(() => {
    try {
      if (!localStorage.getItem("matchMyTripSeen")) {
        const timer = setTimeout(() => {
          setIsOpen(true);
          document.body.style.overflow = "hidden";
        }, 2500);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);

  /* ── Preload quiz images ── */
  useEffect(() => {
    QUESTIONS.forEach((q) => {
      q.options.forEach((opt) => {
        if (opt.image) {
          const img = new window.Image();
          img.src = opt.image;
        }
      });
    });
  }, []);

  const selectOption = useCallback(
    (value: string) => {
      if (isAnimating) return;

      const currentQ = QUESTIONS[step];
      const newAnswers = { ...answers, [currentQ.id]: value };
      setAnswers(newAnswers);

      if (isLastStep) {
        setSlideDir("left");
        setIsAnimating(true);
        setTimeout(() => {
          const matchResult = getMatch(newAnswers as {
            vibe: Vibe;
            passengers: Passengers;
            scenery: Scenery;
            budget: Budget;
          });
          setResult(matchResult);
          setTimeout(() => {
            setShowResult(true);
            setIsAnimating(false);
          }, 100);
        }, 400);
      } else {
        setSlideDir("left");
        setIsAnimating(true);
        setTimeout(() => {
          setStep((s) => s + 1);
          setTimeout(() => setIsAnimating(false), 50);
        }, 300);
      }
    },
    [step, answers, isLastStep, isAnimating]
  );

  const goBack = useCallback(() => {
    if (isAnimating) return;
    if (showingResult) {
      setSlideDir("right");
      setIsAnimating(true);
      setTimeout(() => {
        setResult(null);
        setShowResult(false);
        setTimeout(() => setIsAnimating(false), 50);
      }, 300);
      return;
    }
    if (step > 0) {
      setSlideDir("right");
      setIsAnimating(true);
      setTimeout(() => {
        setStep((s) => s - 1);
        setTimeout(() => setIsAnimating(false), 50);
      }, 300);
    }
  }, [step, isAnimating, showingResult]);

  const retake = useCallback(() => {
    setStep(0);
    setAnswers({});
    setResult(null);
    setShowResult(false);
    setIsAnimating(false);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [close]);

  const getSlideClass = () => {
    if (isAnimating) {
      return slideDir === "left"
        ? "translate-x-[-100%] opacity-0"
        : "translate-x-[100%] opacity-0";
    }
    return "translate-x-0 opacity-100";
  };

  const progressPercent = showingResult
    ? 100
    : ((step + (answers[QUESTIONS[step]?.id] ? 1 : 0)) / totalSteps) * 100;

  return (
    <>
      {/* ── TRIGGER BUTTON (CTA section) ── */}
      <section className="border-t border-luxury-border bg-[#D6EEFB]">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center sm:py-20">
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-navy sm:text-[12px]">
            Not sure where to start?
          </p>
          <h2 className="mt-3 font-serif text-3xl font-black tracking-tight text-gray-900 sm:text-5xl">
            MATCH MY TRIP
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-[#1a4b6e]/50 sm:text-base">
            Answer 4 quick questions and we&apos;ll recommend the perfect car &amp; road trip
            combo for your Lebanon adventure.
          </p>
          <button
            onClick={open}
            className="group mt-8 inline-flex items-center gap-3 bg-navy px-10 py-4 text-[12px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-navy-light hover:shadow-lg hover:shadow-navy/20"
          >
            <span>Take the Quiz</span>
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </section>

      {/* ── FULLSCREEN MODAL ── */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={close}
          />

          {/* Modal container */}
          <div
            ref={containerRef}
            className="relative z-10 flex h-full w-full flex-col overflow-hidden bg-[#F0F4F8] sm:h-auto sm:max-h-[94vh] sm:max-w-2xl sm:rounded-xl sm:shadow-2xl"
          >
            {/* ── Top bar ── */}
            <div className="relative flex items-center justify-between border-b border-gray-200/80 bg-white/95 px-4 py-3 backdrop-blur-sm sm:rounded-t-xl sm:px-6">
              <div className="flex items-center gap-3">
                {(step > 0 || showingResult) && (
                  <button
                    onClick={goBack}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-navy"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-navy">
                  Match My Trip
                </span>
              </div>

              {!showingResult && (
                <span className="text-[11px] font-semibold text-gray-400">
                  {step + 1} / {totalSteps}
                </span>
              )}

              <button
                onClick={close}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* ── Progress bar ── */}
            <div className="h-1 w-full bg-gray-200">
              <div
                className="h-full bg-navy transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* ── Content area ── */}
            <div className="flex-1 overflow-y-auto">
              <div className={`transition-all duration-300 ease-out ${getSlideClass()}`}>
                {showingResult ? (
                  <ResultScreen result={result!} close={close} retake={retake} />
                ) : (
                  <QuestionScreen
                    question={QUESTIONS[step]}
                    selectedValue={answers[QUESTIONS[step].id]}
                    onSelect={selectOption}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Keyframes ── */}
      <style jsx global>{`
        @keyframes sparkle-fall {
          0% { opacity: 0; transform: translateY(-20px) scale(0); }
          20% { opacity: 1; transform: translateY(0) scale(1); }
          80% { opacity: 1; }
          100% { opacity: 0; transform: translateY(60px) scale(0.5) rotate(180deg); }
        }
        .animate-sparkle-fall {
          animation: sparkle-fall 2s ease-out forwards;
        }
        @keyframes reveal-up {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-reveal-up { animation: reveal-up 0.6s ease-out forwards; }
        .animate-reveal-up-delayed { animation: reveal-up 0.6s 0.2s ease-out forwards; opacity: 0; }
        .animate-reveal-up-delayed-2 { animation: reveal-up 0.6s 0.4s ease-out forwards; opacity: 0; }
        .animate-reveal-up-delayed-3 { animation: reveal-up 0.6s 0.6s ease-out forwards; opacity: 0; }
      `}</style>
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   QUESTION SCREEN — image hero with overlay title + cards
   ═══════════════════════════════════════════════════════ */

function QuestionScreen({
  question,
  selectedValue,
  onSelect,
}: {
  question: Question;
  selectedValue?: string;
  onSelect: (value: string) => void;
}) {
  const hasImages = question.options.some((o) => o.image);

  return (
    <div className="flex flex-col">
      {/* ── Header ── */}
      <div className="px-4 pt-7 pb-2 text-center sm:px-8 sm:pt-10">
        <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.4em] text-navy/40 sm:text-[10px]">
          Let us help you find your perfect car
        </p>
        <h2 className="font-serif text-2xl font-black tracking-wide text-gray-900 sm:text-3xl">
          {question.title}
        </h2>
        <p className="mt-1 text-[11px] font-medium text-gray-400 sm:text-sm">
          {question.subtitle}
        </p>
      </div>

      {/* ── Option cards ── */}
      <div className="px-4 py-5 sm:px-8 sm:py-7">
        <div
          className={`mx-auto grid max-w-lg gap-3 ${
            hasImages
              ? "grid-cols-2"
              : question.options.length <= 3
                ? "grid-cols-1 sm:grid-cols-3"
                : "grid-cols-2"
          }`}
        >
          {question.options.map((opt) => {
            const isSelected = selectedValue === opt.value;

            /* ── Image card (vibe question) ── */
            if (opt.image) {
              return (
                <button
                  key={opt.value}
                  onClick={() => onSelect(opt.value)}
                  className={`group relative aspect-[4/3] overflow-hidden rounded-lg border-2 shadow-sm transition-all duration-200 hover:shadow-xl ${
                    isSelected
                      ? "border-navy shadow-xl ring-2 ring-navy/20"
                      : "border-transparent hover:border-navy/60"
                  }`}
                >
                  {/* Background image */}
                  <img
                    src={opt.image}
                    alt={opt.label}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    style={opt.rotate ? { transform: `rotate(${opt.rotate}deg) scale(1.05)` } : undefined}
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  {/* Title overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-end pb-4 sm:pb-5">
                    <span className="text-[13px] font-bold uppercase tracking-[0.12em] text-white drop-shadow-lg sm:text-[15px]">
                      {opt.label}
                    </span>
                    <span className="mt-0.5 text-[10px] font-medium text-white/60 sm:text-[11px]">
                      {opt.desc}
                    </span>
                  </div>
                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-navy text-white shadow-lg">
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            }

            /* ── Plain card (other questions) ── */
            return (
              <button
                key={opt.value}
                onClick={() => onSelect(opt.value)}
                className={`group relative flex flex-col items-center justify-center gap-1.5 rounded-lg border-2 bg-white px-3 py-5 text-center shadow-sm transition-all duration-200 hover:border-navy hover:shadow-lg sm:py-6 ${
                  isSelected
                    ? "border-navy shadow-lg ring-2 ring-navy/20"
                    : "border-gray-100 hover:border-navy/60"
                }`}
              >
                <span className="text-[12px] font-bold uppercase tracking-[0.08em] text-gray-900 sm:text-[13px]">
                  {opt.label}
                </span>
                <span className="text-[10px] leading-tight text-gray-400 sm:text-[11px]">
                  {opt.desc}
                </span>
                {isSelected && (
                  <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-navy text-white">
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   RESULT SCREEN
   ═══════════════════════════════════════════════════════ */

function ResultScreen({
  result,
  close,
  retake,
}: {
  result: MatchResult;
  close: () => void;
  retake: () => void;
}) {
  return (
    <div className="relative px-4 py-8 sm:px-8 sm:py-12">
      {/* Sparkle particles */}
      <Sparkles />

      {/* Heading */}
      <div className="relative z-10 mb-8 text-center animate-reveal-up">
        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-navy sm:text-[12px]">
          We found it
        </p>
        <h2 className="mt-2 font-serif text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
          YOUR PERFECT MATCH 🇱🇧
        </h2>
      </div>

      {/* Car recommendation */}
      <div className="relative z-10 mx-auto max-w-md animate-reveal-up-delayed">
        <div className="rounded-lg border-2 border-navy/10 bg-white p-6 shadow-lg">
          <div className="mb-1 text-[9px] font-bold uppercase tracking-[0.3em] text-navy/40">
            Recommended Car
          </div>
          <h3 className="font-serif text-2xl font-black text-gray-900 sm:text-3xl">
            {result.car.category}
          </h3>
          <p className="mt-1 text-sm text-gray-400">{result.car.tagline}</p>

          <div className="mt-4">
            <Link
              href={`/cars?trip=${encodeURIComponent(result.car.category)}`}
              onClick={close}
              className="inline-flex items-center gap-2 bg-navy px-6 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-white transition-all hover:bg-navy-light"
            >
              Browse {result.car.category} Cars
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Trip recommendation */}
      <div className="relative z-10 mx-auto mt-4 max-w-md animate-reveal-up-delayed-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-1 text-[9px] font-bold uppercase tracking-[0.3em] text-navy/40">
            Recommended Road Trip
          </div>
          <h3 className="font-serif text-xl font-black text-gray-900 sm:text-2xl">
            {result.trip.name}
          </h3>
          <div className="mt-2 flex items-center gap-3 text-[11px] text-gray-400">
            <span className="flex items-center gap-1">
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {result.trip.distance}
            </span>
            <span className="flex items-center gap-1">
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {result.trip.duration}
            </span>
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-gray-400">
            {result.trip.description}
          </p>

          <div className="mt-4">
            <Link
              href="/road-trips"
              onClick={close}
              className="inline-flex items-center gap-2 border border-navy/60 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-navy transition-all hover:bg-navy hover:text-white"
            >
              View This Road Trip
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Retake */}
      <div className="relative z-10 mt-6 text-center animate-reveal-up-delayed-3">
        <button
          onClick={retake}
          className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400 underline-offset-4 transition-colors hover:text-navy hover:underline"
        >
          ↺ Retake Quiz
        </button>
      </div>
    </div>
  );
}
