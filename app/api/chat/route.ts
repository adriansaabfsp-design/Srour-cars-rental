import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCD_rNJjKorAUF0pjcGg7M65fndBUdaI2Y",
  authDomain: "srour-cars-rental.firebaseapp.com",
  projectId: "srour-cars-rental",
  storageBucket: "srour-cars-rental.firebasestorage.app",
  messagingSenderId: "412387741709",
  appId: "1:412387741709:web:ea194e356f5d96245a0544",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

interface CarDoc {
  id: string;
  name?: string;
  brand?: string;
  year?: number;
  price?: number;
  fuel?: string;
  transmission?: string;
  seats?: number;
  description?: string;
  category?: string;
  available?: boolean;
  mileage?: number;
}

// Cache car data for 5 minutes to avoid hitting Firebase on every chat message
let cachedCarData: string | null = null;
let cachedBrands: string[] = [];
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000;

async function getCarData(): Promise<{ carSummary: string; brands: string[] }> {
  if (cachedCarData && Date.now() - cacheTimestamp < CACHE_TTL) {
    return { carSummary: cachedCarData, brands: cachedBrands };
  }

  const snapshot = await getDocs(collection(db, "cars"));
  const cars: CarDoc[] = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as CarDoc));

  const available = cars.filter((c) => c.available !== false);
  const brands = [...new Set(available.map((c) => c.brand).filter(Boolean))] as string[];

  const carLines = available.map((c) => {
    const parts = [
      c.name || "Unknown",
      c.year ? `(${c.year})` : "",
      c.price ? `$${c.price}/day` : "",
      c.fuel || "",
      c.transmission || "",
      c.seats ? `${c.seats} seats` : "",
      c.category || "",
      c.mileage ? `${c.mileage.toLocaleString()} km` : "",
    ].filter(Boolean);
    const desc = c.description ? ` — ${c.description.slice(0, 120)}` : "";
    const link = `https://lebanese-cars.vercel.app/cars/${c.id}`;
    return `• ${parts.join(" | ")}${desc}\n  Link: ${link}`;
  });

  const summary = `CURRENT INVENTORY (${available.length} available cars):\n\nAvailable brands: ${brands.sort().join(", ")}\n\n${carLines.join("\n\n")}`;

  cachedCarData = summary;
  cachedBrands = brands;
  cacheTimestamp = Date.now();

  return { carSummary: summary, brands };
}

const BASE_PROMPT = `You are the friendly, knowledgeable virtual concierge for Lebanon Rental — a premium car rental company operating across Lebanon.

Key facts about Lebanon Rental:
- Locations: Beirut, Tripoli, Jounieh, Batroun, Jbeil, Sidon, Tyre, Faraya, Zahle, and more
- FREE car delivery to 1,000+ partner hotels/properties across Lebanon
- Airport pickup/delivery at Beirut–Rafic Hariri International Airport
- Extras: child seats, GPS, chauffeur service, airport transfers, wedding packages
- Requirements: valid driver's license (international or Lebanese), passport/ID, credit card for deposit, minimum age 21
- All rentals include comprehensive insurance
- Contact: +961 81 062 329 (WhatsApp), support@lebanon-rental.com
- Website: https://lebanese-cars.vercel.app
- Curated road trip routes across Lebanon (16+ routes): https://lebanese-cars.vercel.app/road-trips
- Seasonal guide: https://lebanese-cars.vercel.app/seasonal-guide
- Full collection: https://lebanese-cars.vercel.app/cars

Personality guidelines:
- Warm, professional, and concise
- Use "Marhaba" or similar Lebanese greetings when appropriate
- Always be helpful and redirect to WhatsApp (+961 81 062 329) or email for bookings
- Keep responses under 3-4 sentences unless the user asks for detail
- You can recommend cars based on trip type (e.g., 4x4 for mountains, convertible for coast)
- When recommending or mentioning a specific car, ALWAYS include its direct link so the user can view it
- If a user asks about a brand or car you don't have in inventory, honestly say "We don't currently have [brand] in our collection" and suggest similar alternatives from what's available
- When listing cars, format each with its name, price, and a clickable link
- Never make up cars or prices that aren't in the inventory below`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  try {
    const { message, history } = await req.json();

    // Fetch real car data from Firebase
    const { carSummary } = await getCarData();
    const systemPrompt = `${BASE_PROMPT}\n\n${carSummary}`;

    const messages = [
      ...(history || []),
      { role: "user", content: message },
    ];

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        system: systemPrompt,
        messages,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Anthropic API error:", err);
      return NextResponse.json(
        { error: "Failed to get response" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text || "Sorry, I couldn't generate a response.";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
