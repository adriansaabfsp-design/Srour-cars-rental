"use client";

import { useState } from "react";

/* ── categories ── */
const CATEGORIES = [
  "All",
  "Rental Requirements",
  "Pricing & Payment",
  "Pickup & Delivery",
  "Insurance & Accidents",
  "Our Fleet & Service",
] as const;

type Category = (typeof CATEGORIES)[number];

/* ── data ── */
interface FaqItem {
  question: string;
  answer: string;
  category: Category;
}

const FAQS: FaqItem[] = [
  // ─── Rental Requirements ───
  {
    category: "Rental Requirements",
    question: "What documents do I need to rent a car?",
    answer:
      "You'll need a valid driver's license (held for at least one year), a valid passport or Lebanese ID card, and a credit or debit card for the security deposit. International visitors should also carry their international driving permit (IDP) alongside their home country license.",
  },
  {
    category: "Rental Requirements",
    question: "What is the minimum age to rent?",
    answer:
      "The minimum age to rent a car with us is 21 years old. Drivers under 25 may be subject to a young driver surcharge depending on the vehicle class. For luxury and sports cars, the minimum age is 25 with at least 3 years of driving experience.",
  },
  {
    category: "Rental Requirements",
    question: "Do I need an international driving license?",
    answer:
      "If you hold a valid Lebanese driving license, no additional permit is needed. Foreign visitors are advised to carry an International Driving Permit (IDP) alongside their home country license. Licenses from GCC countries and many European countries are generally accepted directly.",
  },
  {
    category: "Rental Requirements",
    question: "Can tourists rent a car in Lebanon?",
    answer:
      "Absolutely! We welcome tourists and make the process as smooth as possible. You'll need your passport, a valid driving license from your home country (plus an IDP if applicable), and a credit card. We can deliver the car to Beirut Airport or your hotel for maximum convenience.",
  },
  {
    category: "Rental Requirements",
    question: "Is a credit card required?",
    answer:
      "A credit card is preferred for the security deposit hold. We also accept debit cards with sufficient balance for most vehicle classes. For luxury and premium vehicles, a credit card is mandatory. The deposit is fully refunded upon return of the vehicle in good condition.",
  },
  {
    category: "Rental Requirements",
    question: "Can I add an additional driver?",
    answer:
      "Yes, you can add up to two additional drivers to your rental agreement. Each additional driver must meet the same age and license requirements as the primary renter. There is a small daily fee per additional driver — contact us for current rates.",
  },
  {
    category: "Rental Requirements",
    question: "Can I drive in the mountains or off-road?",
    answer:
      "Mountain driving is permitted with all our vehicles. However, off-road driving is only permitted with our designated SUV and 4×4 fleet. Damage caused by off-road driving in a vehicle not rated for it will not be covered by the standard insurance policy. Check our Road Trips page for recommended vehicles per route.",
  },

  // ─── Pricing & Payment ───
  {
    category: "Pricing & Payment",
    question: "How is the daily rate calculated?",
    answer:
      "Our daily rate is based on a 24-hour period starting from the time of pickup. For example, if you pick up at 10:00 AM, the car is due back by 10:00 AM the next day. We offer a 1-hour grace period — after that, an additional half-day charge applies.",
  },
  {
    category: "Pricing & Payment",
    question: "What is the security deposit?",
    answer:
      "The security deposit varies by vehicle class. Economy and sedan rentals typically require $200–$500, SUVs range from $500–$1,000, and luxury vehicles may require $1,000–$3,000. The deposit is held on your credit card and released within 5–7 business days after the car is returned in good condition.",
  },
  {
    category: "Pricing & Payment",
    question: "Are there any hidden fees?",
    answer:
      "Absolutely not. We pride ourselves on transparent pricing. The rate you see on our website includes basic insurance and 24/7 roadside assistance. Optional extras like GPS, child seats, additional drivers, and premium insurance are clearly listed with their costs before you confirm.",
  },
  {
    category: "Pricing & Payment",
    question: "Do you offer weekly or monthly rates?",
    answer:
      "Yes! We offer significant discounts for extended rentals. Weekly rentals receive 10–15% off the daily rate, and monthly rentals receive 25–35% off. Long-term rentals (3+ months) have special corporate rates available. Contact us on WhatsApp for a personalized quote.",
  },
  {
    category: "Pricing & Payment",
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, Mastercard, American Express), debit cards, bank transfers, and cash payments in USD or LBP. For online reservations, credit card payment is required to confirm the booking.",
  },
  {
    category: "Pricing & Payment",
    question: "What happens if I return the car late?",
    answer:
      "We offer a 1-hour grace period after your scheduled return time. Returns within 1–4 hours late incur a half-day charge. Returns more than 4 hours late are charged a full additional day. Please call us if you're running late — we're always happy to accommodate when possible.",
  },
  {
    category: "Pricing & Payment",
    question: "What happens if I return the car early?",
    answer:
      "If you return the car earlier than your scheduled drop-off, you will still be charged for the original rental period. However, for rentals of 7 days or more, we may offer a partial refund for unused days — please contact us to discuss your specific situation.",
  },

  // ─── Pickup & Delivery ───
  {
    category: "Pickup & Delivery",
    question: "Can you deliver the car to Beirut Airport?",
    answer:
      "Yes! We offer complimentary airport delivery and pickup at Rafic Hariri International Airport (BEY) for rentals of 3 days or more. For shorter rentals, a small delivery fee applies. Our driver will meet you at the arrivals hall with a sign bearing your name.",
  },
  {
    category: "Pickup & Delivery",
    question: "Can you deliver to my hotel or home?",
    answer:
      "Absolutely. We provide door-to-door delivery anywhere in Greater Beirut at no extra charge. Deliveries outside Beirut (Jounieh, Byblos, Sidon, etc.) are available for a small additional fee. We'll bring the car to your exact location at your preferred time.",
  },
  {
    category: "Pickup & Delivery",
    question: "What are your pickup locations?",
    answer:
      "Our main office is located in Beirut. We also have pickup points at Beirut Airport, Jounieh, and Byblos. For maximum flexibility, we recommend our free delivery service — we'll bring the car wherever you are in Beirut.",
  },
  {
    category: "Pickup & Delivery",
    question: "Can I return the car to a different location?",
    answer:
      "Yes, one-way rentals are available. You can pick up in one location and drop off at another within Lebanon. A one-way fee may apply depending on the distance between locations. Contact us for specific pricing.",
  },
  {
    category: "Pickup & Delivery",
    question: "Do you offer VIP delivery?",
    answer:
      "Yes! Our VIP delivery service includes a personal meet-and-greet, a full vehicle walkthrough, and a complimentary welcome package with water, snacks, and a guide to Lebanese road trips. This service is complimentary for all luxury and premium vehicle rentals.",
  },
  {
    category: "Pickup & Delivery",
    question: "What fuel type does the car use and who pays for it?",
    answer:
      "Each vehicle listing on our website specifies the fuel type (Petrol, Diesel, Hybrid, or Electric). Cars are delivered with a full tank and should be returned with a full tank. If returned with less fuel, a refueling charge will apply at market rate plus a small service fee.",
  },
  {
    category: "Pickup & Delivery",
    question: "Is there a GPS included in the car?",
    answer:
      "Most of our newer vehicles come equipped with built-in navigation systems. For vehicles without one, we offer portable GPS units for a small daily fee. Alternatively, we recommend downloading Waze or Google Maps, which work excellently for navigating Lebanon's roads.",
  },

  // ─── Insurance & Accidents ───
  {
    category: "Insurance & Accidents",
    question: "Is insurance included in the rental price?",
    answer:
      "Yes, all our rentals include basic Comprehensive Insurance (CDW — Collision Damage Waiver) and Third-Party Liability coverage. For full peace of mind, we offer premium Zero-Excess insurance that eliminates your deductible entirely. Ask us about upgrading when you book.",
  },
  {
    category: "Insurance & Accidents",
    question: "What should I do in case of an accident?",
    answer:
      "First, ensure everyone is safe. Call emergency services if needed (Red Cross: 140, Civil Defense: 125). Then call our 24/7 hotline immediately. Do not move the vehicle if possible. Take photos of all damage and exchange information with any other parties involved. We'll guide you through every step.",
  },
  {
    category: "Insurance & Accidents",
    question: "What is covered by the insurance?",
    answer:
      "Our basic CDW covers collision damage to the rental vehicle with a deductible (excess) that varies by vehicle class. Third-party liability is also included. Tire damage, windshield chips, undercarriage damage, and personal belongings are not covered under basic insurance but can be added with our premium package.",
  },
  {
    category: "Insurance & Accidents",
    question: "Can I drive to other countries?",
    answer:
      "Currently, cross-border travel is not permitted with our rental vehicles due to insurance restrictions. Our coverage is valid within Lebanese territory only. If you need to travel to Syria or Jordan, please contact us to discuss special arrangements.",
  },
  {
    category: "Insurance & Accidents",
    question: "What happens if the car breaks down?",
    answer:
      "Call our 24/7 roadside assistance hotline immediately. We'll dispatch a technician or tow truck to your location. If the issue cannot be resolved on-site, we'll provide a replacement vehicle at no additional charge. You'll never be stranded — we guarantee it.",
  },
  {
    category: "Insurance & Accidents",
    question: "Do you have 24/7 roadside assistance?",
    answer:
      "Yes! Every rental includes complimentary 24/7 roadside assistance anywhere in Lebanon. This covers flat tires, dead batteries, lockouts, towing, and emergency fuel delivery. Simply call our hotline and help will be on the way within 30–60 minutes depending on your location.",
  },
  {
    category: "Insurance & Accidents",
    question: "What happens if I get a traffic fine?",
    answer:
      "The renter is responsible for all traffic violations and fines incurred during the rental period. If a fine is received after the vehicle is returned, we will charge the amount plus a small administrative fee to the credit card on file. We recommend driving carefully, especially in Beirut!",
  },

  // ─── Our Fleet & Service ───
  {
    category: "Our Fleet & Service",
    question: "How old are the cars in your fleet?",
    answer:
      "We maintain a modern fleet with most vehicles being 2020 models or newer. Our luxury collection features the latest model years. Every vehicle in our fleet is regularly rotated to ensure you always drive a well-maintained, up-to-date car.",
  },
  {
    category: "Our Fleet & Service",
    question: "Are the cars regularly maintained and inspected?",
    answer:
      "Absolutely. Every vehicle undergoes a thorough 50-point inspection between rentals, including mechanical systems, tires, brakes, fluids, interior cleanliness, and exterior condition. We service our vehicles at authorized dealerships using genuine parts only.",
  },
  {
    category: "Our Fleet & Service",
    question: "Can I request a specific car color?",
    answer:
      "We do our best to accommodate color preferences! While we can't always guarantee a specific color, let us know your preference when booking and we'll try to match it. For special events like weddings, we recommend booking well in advance to secure your preferred color.",
  },
  {
    category: "Our Fleet & Service",
    question: "Do you offer chauffeur or driver service?",
    answer:
      "Yes, we offer professional chauffeur services with experienced, multilingual drivers who know Lebanon inside and out. This is perfect for business trips, airport transfers, city tours, or when you simply want to sit back and enjoy the scenery. Contact us for chauffeur rates.",
  },
  {
    category: "Our Fleet & Service",
    question: "Can I rent a car for a wedding or special event?",
    answer:
      "Absolutely! We offer premium wedding and event packages featuring our luxury fleet, decorated to your specifications. We provide red carpet service, a professional chauffeur in formal attire, and complimentary champagne. Book early for the best selection — wedding season fills up fast!",
  },
  {
    category: "Our Fleet & Service",
    question: "Can I see the car before confirming the rental?",
    answer:
      "Of course! You're welcome to visit our showroom in Beirut to inspect any vehicle in person before committing. We can also send additional photos and videos via WhatsApp if you prefer. Your satisfaction is guaranteed before you sign.",
  },
  {
    category: "Our Fleet & Service",
    question: "What if the car I want is not available?",
    answer:
      "If your preferred vehicle is unavailable for your dates, we'll suggest comparable alternatives from our fleet. If you'd like that specific car, we can place you on a priority waitlist and notify you the moment it becomes available. We always aim to match or exceed your expectations.",
  },
];

/* ── accordion item ── */
function AccordionItem({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-luxury-border last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-gold"
      >
        <span className={"text-sm font-semibold sm:text-base " + (open ? "text-gold" : "text-white/80")}>
          {item.question}
        </span>
        <svg
          className={
            "h-4 w-4 flex-shrink-0 text-gold transition-transform duration-300 " +
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
          <p className="pb-5 text-[13px] leading-relaxed text-white/35 sm:text-sm">
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

  const filtered =
    activeCategory === "All"
      ? FAQS
      : FAQS.filter((f) => f.category === activeCategory);

  return (
    <div className="min-h-screen bg-luxury-black">
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden border-b border-luxury-border bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,_rgba(201,168,76,0.12),_transparent)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-luxury-black" />
        <div className="relative mx-auto max-w-5xl px-4 py-20 text-center sm:py-28 lg:py-32">
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-gold/60 sm:text-xs">
            We&apos;re here to help
          </p>
          <h1 className="mt-4 font-serif text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            FREQUENTLY ASKED
            <br />
            <span className="bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
              QUESTIONS
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/40 sm:text-base">
            Everything you need to know about renting with Lebanon Rental
          </p>
          <div className="mx-auto mt-5 h-[2px] w-20 bg-gradient-to-r from-transparent via-gold to-transparent" />
        </div>
      </section>

      {/* ─── CATEGORY TABS ─── */}
      <div className="sticky top-20 z-30 border-b border-luxury-border bg-black/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center gap-1 overflow-x-auto px-4 py-3 sm:justify-center sm:gap-2 sm:px-6">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            const count =
              cat === "All" ? FAQS.length : FAQS.filter((f) => f.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={
                  "flex-shrink-0 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.1em] transition-all sm:px-4 sm:text-[11px] " +
                  (isActive
                    ? "bg-gold text-black"
                    : "border border-luxury-border bg-luxury-card text-white/50 hover:border-gold/30 hover:text-white")
                }
              >
                {cat === "All" ? "All" : cat}
                <span className={"ml-1 text-[8px] sm:text-[9px] " + (isActive ? "text-black/50" : "text-gold/50")}>
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
          <h2 className="mb-6 font-serif text-xl font-bold text-white sm:text-2xl">
            {activeCategory}
            <span className="ml-3 text-sm font-normal text-white/30">
              {filtered.length} question{filtered.length !== 1 ? "s" : ""}
            </span>
          </h2>
        )}

        <div className="border-t border-luxury-border bg-luxury-card">
          {filtered.map((item) => (
            <AccordionItem key={item.question} item={item} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-lg text-white/30">No questions in this category.</p>
          </div>
        )}
      </div>

      {/* ─── STILL HAVE QUESTIONS ─── */}
      <section className="border-t border-luxury-border bg-luxury-card">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:py-20">
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-gold/50">
            Can&apos;t find what you&apos;re looking for?
          </p>
          <h2 className="mt-4 font-serif text-3xl font-bold text-white sm:text-4xl">
            STILL HAVE QUESTIONS?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/30">
            Our team is available around the clock to help you with anything. Reach out on WhatsApp
            for an instant response.
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
            Contact Us on WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
