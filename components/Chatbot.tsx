"use client";

import { useState, useEffect, useRef } from "react";

const BRAND = {
  dark: "#0b1d2c",
  accent: "#1a3a4a",
  light: "#f0f2f4",
  bg: "#f7f8fa",
  white: "#ffffff",
  gold: "#c9a85c",
  text: "#2d3748",
  muted: "#718096",
};

const TOUR_STEPS = [
  {
    id: "welcome",
    message: "Welcome to Lebanon Rental! I'm your personal concierge. How can I help you today?",
    options: [
      { label: "Browse our collection", action: "collection" },
      { label: "Take a site tour", action: "tour" },
      { label: "Contact us", action: "contact" },
      { label: "Ask a question", action: "chat" },
    ],
  },
  {
    id: "tour",
    message: "Let me show you around! Lebanon Rental offers luxury car rentals across all of Lebanon. Here's what makes us special:",
    options: [
      { label: "Our 50+ luxury cars", action: "tour_cars" },
      { label: "Road trip routes", action: "tour_trips" },
      { label: "Extras & add-ons", action: "tour_extras" },
      { label: "Seasonal guide", action: "tour_seasonal" },
    ],
  },
  {
    id: "tour_cars",
    message: "We have 50+ vehicles — from elegant sedans to powerful SUVs, sporty convertibles, and electric cars. Filter by type, brand, or year. Every car is maintained to the highest standard.",
    link: "/#collection",
    linkLabel: "View Full Collection →",
    options: [
      { label: "Continue tour →", action: "tour_trips" },
      { label: "Ask about a specific car", action: "chat" },
      { label: "Back to menu", action: "welcome" },
    ],
  },
  {
    id: "tour_trips",
    message: "Love exploring? We've curated 16+ scenic road trip routes across Lebanon — from the cedars of Bsharri to the coastline of Batroun, the vineyards of Bekaa, and more. Each guide includes driving tips and stops.",
    link: "/road-trips",
    linkLabel: "Explore Road Trips →",
    options: [
      { label: "Continue tour →", action: "tour_extras" },
      { label: "Ask about routes", action: "chat" },
      { label: "Back to menu", action: "welcome" },
    ],
  },
  {
    id: "tour_extras",
    message: "Make your trip perfect with our extras: child seats, GPS devices, airport transfers, chauffeur service, and more. Lebanon Rental guests also enjoy FREE car delivery to 1,000+ partner properties!",
    link: "/extras",
    linkLabel: "See All Extras →",
    options: [
      { label: "Continue tour →", action: "tour_seasonal" },
      { label: "Book now", action: "contact" },
      { label: "Back to menu", action: "welcome" },
    ],
  },
  {
    id: "tour_seasonal",
    message: "Planning your trip? Our seasonal guide helps you pick the perfect car for any time of year — whether it's a 4x4 for winter mountains or a convertible for summer coastlines.",
    link: "/seasonal-guide",
    linkLabel: "Read Seasonal Guide →",
    options: [
      { label: "Ready to book!", action: "contact" },
      { label: "Ask a question", action: "chat" },
      { label: "Back to menu", action: "welcome" },
    ],
  },
  {
    id: "collection",
    message: "Great choice! Head over to our collection to browse all 50+ vehicles. You can filter by type (SUV, sedan, sports...), brand, or year. Every car comes with full insurance and 24/7 support.",
    link: "/#collection",
    linkLabel: "Browse Collection →",
    options: [
      { label: "Help me choose a car", action: "chat" },
      { label: "Contact us", action: "contact" },
      { label: "Back to menu", action: "welcome" },
    ],
  },
  {
    id: "contact",
    message: "We'd love to hear from you! Reach us anytime:\n\n+961 81 062 329 (WhatsApp)\nsupport@lebanon-rental.com\n\nWe respond within minutes!",
    link: "https://wa.me/96181062329",
    linkLabel: "Open WhatsApp →",
    options: [
      { label: "Ask a question first", action: "chat" },
      { label: "Back to menu", action: "welcome" },
    ],
  },
  {
    id: "chat",
    message: "Sure! Ask me anything about our cars, pricing, availability, road trips, delivery, or anything else. I'm here to help!",
    options: [] as { label: string; action: string }[],
    enableChat: true,
  },
];

type TourStep = (typeof TOUR_STEPS)[number];

const FAQ_RESPONSES: Record<string, string> = {
  price: "Our daily rates vary by vehicle — sedans start around $35/day, SUVs from $55/day, and luxury/sports cars from $90/day. Prices may vary seasonally. For an exact quote, tell me which car you're interested in or contact us at +961 81 062 329!",
  deliver: "Yes! Lebanon Rental guests enjoy FREE car delivery to 1,000+ partner properties across Lebanon — Beirut, Tripoli, Jounieh, Batroun, Jbeil, Sidon, Tyre, Faraya, Zahle, and more.",
  document: "To rent, you'll need: a valid driver's license (international or Lebanese), a passport or ID, and a credit card for the security deposit. Minimum age is 21 for most vehicles.",
  insurance: "All our rentals include comprehensive insurance coverage. Additional coverage options are available for extra peace of mind.",
  airport: "We offer airport pickup and delivery service! Just let us know your flight details and we'll have your car waiting for you at Beirut–Rafic Hariri International Airport.",
  suv: "We have a great selection of SUVs including models from Toyota, Nissan, Hyundai, Kia, and more. Perfect for mountain trips and family travel. Check our collection to see what's available!",
  wedding: "Looking for a wedding car? We have elegant luxury sedans and convertibles perfect for your special day. Contact us for special wedding packages!",
};

function getQuickAnswer(text: string): string | null {
  const lower = text.toLowerCase();
  if (lower.match(/pric|cost|rate|how much|cheap|expens/)) return FAQ_RESPONSES.price;
  if (lower.match(/deliver|drop.?off|pick.?up|bring/)) return FAQ_RESPONSES.deliver;
  if (lower.match(/document|license|passport|id|requir|need to/)) return FAQ_RESPONSES.document;
  if (lower.match(/insur|cover|protect|damage/)) return FAQ_RESPONSES.insurance;
  if (lower.match(/airport|flight|arrive|land/)) return FAQ_RESPONSES.airport;
  if (lower.match(/suv|4x4|jeep|offroad|mountain/)) return FAQ_RESPONSES.suv;
  if (lower.match(/wedding|marry|bride|groom/)) return FAQ_RESPONSES.wedding;
  return null;
}

function Avatar({ size = 48 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${BRAND.dark} 0%, ${BRAND.accent} 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxShadow: "0 2px 12px rgba(11,29,44,0.3)",
      }}
    >
      <span style={{ fontSize: size * 0.4, fontWeight: 700, color: BRAND.gold, letterSpacing: 1 }}>LR</span>
    </div>
  );
}

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 4, padding: "8px 0", alignItems: "center" }}>
      <Avatar size={30} />
      <div
        style={{
          background: BRAND.light,
          borderRadius: "16px 16px 16px 4px",
          padding: "12px 18px",
          display: "flex",
          gap: 5,
          marginLeft: 8,
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: BRAND.accent,
              opacity: 0.5,
              animation: `lrBounce 1.2s ease-in-out ${i * 0.15}s infinite`,
              display: "inline-block",
            }}
          />
        ))}
      </div>
    </div>
  );
}

interface Message {
  type: "bot" | "user";
  text: string;
  step?: TourStep | null;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState<TourStep | null>(null);
  const [chatMode, setChatMode] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [bubbleDismissed, setBubbleDismissed] = useState(false);
  const chatHistoryRef = useRef<{ role: string; content: string }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!hasOpened && !bubbleDismissed) {
      const timer = setTimeout(() => setShowBubble(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [hasOpened, bubbleDismissed]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (chatMode && isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [chatMode, isOpen]);

  function addBotMessage(text: string, step: TourStep | null = null) {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, { type: "bot", text, step }]);
      if (step) setCurrentStep(step);
    }, 600 + Math.random() * 400);
  }

  function handleOpen() {
    setIsOpen(true);
    setShowBubble(false);
    setBubbleDismissed(true);
    if (!hasOpened) {
      setHasOpened(true);
      const welcome = TOUR_STEPS.find((s) => s.id === "welcome")!;
      addBotMessage(welcome.message, welcome);
    }
  }

  function handleOptionClick(action: string) {
    const step = TOUR_STEPS.find((s) => s.id === action);
    if (!step) return;

    const option = currentStep?.options?.find((o) => o.action === action);
    if (option) {
      setMessages((prev) => [...prev, { type: "user", text: option.label }]);
    }

    if ("enableChat" in step && step.enableChat) {
      setChatMode(true);
    } else {
      setChatMode(false);
    }

    addBotMessage(step.message, step);
  }

  async function handleSend() {
    const text = inputValue.trim();
    if (!text) return;

    setInputValue("");
    setMessages((prev) => [...prev, { type: "user", text }]);

    const quickAnswer = getQuickAnswer(text);

    if (quickAnswer) {
      chatHistoryRef.current.push({ role: "user", content: text });
      chatHistoryRef.current.push({ role: "assistant", content: quickAnswer });
      addBotMessage(quickAnswer);
    } else {
      setIsTyping(true);
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            history: chatHistoryRef.current.slice(-10),
          }),
        });
        const data = await res.json();
        const reply = data.reply || data.error || "Sorry, something went wrong. Please try again.";
        chatHistoryRef.current.push({ role: "user", content: text });
        chatHistoryRef.current.push({ role: "assistant", content: reply });
        setIsTyping(false);
        setMessages((prev) => [...prev, { type: "bot", text: reply, step: null }]);
      } catch {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            text: "I'm having trouble connecting right now. You can reach us at +961 81 062 329 (WhatsApp) or support@lebanon-rental.com!",
            step: null,
          },
        ]);
      }
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <>
      <style>{`
        @keyframes lrBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes lrSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes lrFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes lrPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(11,29,44,0.35); }
          50% { box-shadow: 0 0 0 10px rgba(11,29,44,0); }
        }
        @keyframes lrBubbleIn {
          from { opacity: 0; transform: translateX(10px) scale(0.9); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
      `}</style>

      <div style={{ fontFamily: "var(--font-montserrat), -apple-system, sans-serif" }}>
        {/* Greeting bubble */}
        {showBubble && !isOpen && (
          <div
            onClick={handleOpen}
            style={{
              position: "fixed",
              bottom: 92,
              right: 24,
              zIndex: 9998,
              background: BRAND.white,
              border: `1px solid ${BRAND.light}`,
              borderRadius: "16px 16px 4px 16px",
              padding: "12px 18px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
              maxWidth: 220,
              animation: "lrBubbleIn 0.4s ease-out",
              cursor: "pointer",
            }}
          >
            <span style={{ fontWeight: 600, fontSize: 13, color: BRAND.dark }}>
              Marhaba!
            </span>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: BRAND.muted, lineHeight: 1.5 }}>
              Looking for the perfect car in Lebanon?
            </p>
          </div>
        )}

        {/* FAB */}
        <button
          onClick={() => (isOpen ? setIsOpen(false) : handleOpen())}
          aria-label="Chat with us"
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 9999,
            width: 56,
            height: 56,
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `linear-gradient(135deg, ${BRAND.dark} 0%, ${BRAND.accent} 100%)`,
            boxShadow: "0 4px 20px rgba(11,29,44,0.35)",
            transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            animation: isOpen ? "none" : "lrPulse 2.5s ease-in-out infinite",
          }}
        >
          {isOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          )}
        </button>

        {/* Chat window */}
        {isOpen && (
          <div
            style={{
              position: "fixed",
              bottom: 92,
              right: 24,
              zIndex: 9999,
              width: 370,
              maxWidth: "calc(100vw - 32px)",
              height: 520,
              maxHeight: "calc(100vh - 140px)",
              background: BRAND.white,
              borderRadius: 20,
              boxShadow: "0 12px 48px rgba(11,29,44,0.15), 0 0 0 1px rgba(11,29,44,0.06)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              animation: "lrSlideUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            {/* Header */}
            <div
              style={{
                background: `linear-gradient(135deg, ${BRAND.dark} 0%, ${BRAND.accent} 100%)`,
                color: BRAND.white,
                padding: "16px 18px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                flexShrink: 0,
              }}
            >
              <Avatar size={38} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, letterSpacing: 0.5 }}>
                  Lebanon Rental
                </p>
                <p style={{ margin: "2px 0 0", fontSize: 11, opacity: 0.7 }}>
                  <span style={{
                    display: "inline-block",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#4ade80",
                    marginRight: 5,
                    verticalAlign: "middle",
                  }} />
                  Online · Replies instantly
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: "rgba(255,255,255,0.12)",
                  border: "none",
                  color: "white",
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                }}
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: 14,
                background: BRAND.bg,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {messages.map((msg, i) => (
                <div key={i}>
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      flexDirection: msg.type === "user" ? "row-reverse" : "row",
                      animation: "lrFadeIn 0.3s ease-out",
                    }}
                  >
                    {msg.type === "bot" && <Avatar size={28} />}
                    <div
                      style={{
                        maxWidth: "78%",
                        padding: "10px 14px",
                        fontSize: 13,
                        lineHeight: 1.6,
                        color: msg.type === "user" ? BRAND.white : BRAND.text,
                        whiteSpace: "pre-wrap",
                        background:
                          msg.type === "user"
                            ? `linear-gradient(135deg, ${BRAND.dark}, ${BRAND.accent})`
                            : BRAND.white,
                        borderRadius:
                          msg.type === "user"
                            ? "16px 16px 4px 16px"
                            : "16px 16px 16px 4px",
                        boxShadow: msg.type === "bot" ? "0 1px 3px rgba(0,0,0,0.04)" : "none",
                      }}
                    >
                      {msg.text}
                      {msg.step?.link && (
                        <div style={{ marginTop: 8 }}>
                          <a
                            href={msg.step.link}
                            target={msg.step.link.startsWith("http") ? "_blank" : "_self"}
                            rel={msg.step.link.startsWith("http") ? "noopener noreferrer" : undefined}
                            style={{
                              display: "inline-block",
                              background: BRAND.gold,
                              color: BRAND.dark,
                              padding: "7px 14px",
                              borderRadius: 20,
                              fontSize: 12,
                              fontWeight: 600,
                              textDecoration: "none",
                              letterSpacing: 0.3,
                            }}
                          >
                            {msg.step.linkLabel}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Options for latest bot message */}
                  {msg.type === "bot" &&
                    msg.step?.options &&
                    msg.step.options.length > 0 &&
                    i === messages.length - 1 && (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 5,
                          padding: "6px 0 0 36px",
                          animation: "lrFadeIn 0.4s ease-out 0.1s both",
                        }}
                      >
                        {msg.step.options.map((opt, j) => (
                          <button
                            key={j}
                            onClick={() => handleOptionClick(opt.action)}
                            style={{
                              background: BRAND.white,
                              border: `1.5px solid ${BRAND.accent}33`,
                              color: BRAND.accent,
                              padding: "7px 13px",
                              borderRadius: 20,
                              fontSize: 12,
                              fontWeight: 500,
                              cursor: "pointer",
                              transition: "all 0.2s",
                              fontFamily: "inherit",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = BRAND.accent;
                              e.currentTarget.style.color = BRAND.white;
                              e.currentTarget.style.borderColor = BRAND.accent;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = BRAND.white;
                              e.currentTarget.style.color = BRAND.accent;
                              e.currentTarget.style.borderColor = `${BRAND.accent}33`;
                            }}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              ))}
              {isTyping && <TypingDots />}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            {chatMode && (
              <div
                style={{
                  padding: "10px 14px",
                  background: BRAND.white,
                  borderTop: `1px solid ${BRAND.light}`,
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  flexShrink: 0,
                }}
              >
                <input
                  ref={inputRef}
                  placeholder="Ask me anything..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  style={{
                    flex: 1,
                    border: `1.5px solid ${BRAND.light}`,
                    borderRadius: 24,
                    padding: "9px 14px",
                    fontSize: 13,
                    outline: "none",
                    fontFamily: "inherit",
                    color: BRAND.text,
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = BRAND.accent)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = BRAND.light)}
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isTyping}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    border: "none",
                    background: `linear-gradient(135deg, ${BRAND.dark}, ${BRAND.accent})`,
                    color: "white",
                    cursor: !inputValue.trim() || isTyping ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: !inputValue.trim() || isTyping ? 0.4 : 1,
                    flexShrink: 0,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            )}

            <div style={{
              textAlign: "center",
              fontSize: 9,
              color: BRAND.muted,
              padding: "4px 0 8px",
              background: BRAND.white,
              letterSpacing: 1.5,
              textTransform: "uppercase" as const,
            }}>
              Lebanon Rental · Luxury Car Rentals
            </div>
          </div>
        )}
      </div>
    </>
  );
}
