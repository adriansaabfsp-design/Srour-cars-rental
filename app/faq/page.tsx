"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FaqItem, FAQ_CATEGORIES } from "@/lib/types";
import Breadcrumb from "@/components/Breadcrumb";

/* ── categories ── */
const CATEGORIES = ["All", ...FAQ_CATEGORIES] as const;

type Category = (typeof CATEGORIES)[number];

/* ── accordion item ── */
function AccordionItem({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-luxury-border last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-gray-900"
      >
        <span className={"text-sm font-semibold sm:text-base " + (open ? "text-navy" : "text-gray-900/80")}>
          {item.question}
        </span>
        <svg
          className={
            "h-4 w-4 flex-shrink-0 text-navy transition-transform duration-300 " +
            (open ? "rotate-180" : "rotate-0")
          }
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className="grid transition-all duration-300 ease-in-out"
        style={{
          gridTemplateRows: open ? "1fr" : "0fr",
          opacity: open ? 1 : 0,
        }}
      >
        <div className="overflow-hidden">
          <p className="pb-5 text-[13px] leading-relaxed text-gray-700 sm:text-sm">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── page ── */
export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const q = query(collection(db, "faqs"), orderBy("order", "asc"));
        const snapshot = await getDocs(q);
        setFaqs(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as FaqItem[]);
      } catch (err) {
        console.error("Error fetching FAQs:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered =
    activeCategory === "All"
      ? faqs
      : faqs.filter((f) => f.category === activeCategory);

  return (
    <div className="min-h-screen bg-luxury-black">
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden border-b border-luxury-border bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,_rgba(27,58,92,0.12),_transparent)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-luxury-black" />
        <div className="relative mx-auto max-w-5xl px-4 py-20 text-center sm:py-28 lg:py-32">
          <div className="mb-6 flex justify-center">
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "FAQ" }]} />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-navy sm:text-xs">
            We&apos;re here to help
          </p>
          <h1 className="mt-4 font-serif text-3xl font-black tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            FREQUENTLY ASKED
            <br />
            <span className="text-gray-900">
              QUESTIONS
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-gray-600 sm:text-base">
            Everything you need to know about renting with Cars Lebanon Rental
          </p>
          <div className="mx-auto mt-5 h-[2px] w-20 bg-gradient-to-r from-transparent via-navy to-transparent" />
        </div>
      </section>

      {/* ─── CATEGORY TABS ─── */}
      <div className="sticky top-20 z-30 border-b border-luxury-border bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center gap-1 overflow-x-auto px-4 py-3 sm:justify-center sm:gap-2 sm:px-6">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            const count =
              cat === "All" ? faqs.length : faqs.filter((f) => f.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={
                  "flex-shrink-0 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.1em] transition-all sm:px-4 sm:text-[11px] " +
                  (isActive
                    ? "bg-navy text-white"
                    : "border border-luxury-border bg-luxury-card text-gray-900/50 hover:border-navy/30 hover:text-gray-900")
                }
              >
                {cat === "All" ? "All" : cat}
                <span className={"ml-1 text-[8px] sm:text-[9px] " + (isActive ? "text-gray-900/50" : "text-navy")}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── FAQ ACCORDION ─── */}
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        {activeCategory !== "All" && (
          <h2 className="mb-6 font-serif text-xl font-bold text-gray-900 sm:text-2xl">
            {activeCategory}
            <span className="ml-3 text-sm font-normal text-gray-900/30">
              {filtered.length} question{filtered.length !== 1 ? "s" : ""}
            </span>
          </h2>
        )}

        {loading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded bg-luxury-card" />
            ))}
          </div>
        ) : (
          <div className="border-t border-luxury-border bg-luxury-card">
            {filtered.map((item) => (
              <AccordionItem key={item.id} item={item} />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-lg text-gray-900/30">No questions in this category.</p>
          </div>
        )}
      </div>

      {/* ─── STILL HAVE QUESTIONS ─── */}
      <section className="border-t border-luxury-border bg-luxury-card">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:py-20">
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-navy">
            Can&apos;t find what you&apos;re looking for?
          </p>
          <h2 className="mt-4 font-serif text-3xl font-bold text-gray-900 sm:text-4xl">
            STILL HAVE QUESTIONS?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-gray-900/30">
            Our team is available around the clock to help you with anything. Reach out on WhatsApp
            for an instant response.
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
            Contact Us on WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
