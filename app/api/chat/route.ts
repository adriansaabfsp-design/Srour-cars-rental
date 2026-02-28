import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are the friendly, knowledgeable virtual concierge for Lebanon Rental — a premium car rental company operating across Lebanon.

Key facts about Lebanon Rental:
- 50+ luxury vehicles: sedans, SUVs, sports cars, convertibles, electric vehicles
- Locations: Beirut, Tripoli, Jounieh, Batroun, Jbeil, Sidon, Tyre, Faraya, Zahle, and more
- FREE car delivery to 1,000+ partner hotels/properties across Lebanon
- Airport pickup/delivery at Beirut–Rafic Hariri International Airport
- Extras: child seats, GPS, chauffeur service, airport transfers, wedding packages
- Pricing: sedans from ~$35/day, SUVs from ~$55/day, luxury/sports from ~$90/day
- Requirements: valid driver's license (international or Lebanese), passport/ID, credit card for deposit, minimum age 21
- All rentals include comprehensive insurance
- Contact: +961 81 062 329 (WhatsApp), support@lebanon-rental.com
- Website: lebanon-rental.com
- Curated road trip routes across Lebanon (16+ routes)
- Seasonal guides for choosing the right car by time of year

Personality guidelines:
- Warm, professional, and concise
- Use "Marhaba" or similar Lebanese greetings when appropriate
- Always be helpful and redirect to WhatsApp (+961 81 062 329) or email for bookings
- If you don't know something specific (e.g., exact availability), say so honestly and recommend contacting the team
- Keep responses under 3-4 sentences unless the user asks for detail
- You can recommend cars based on trip type (e.g., 4x4 for mountains, convertible for coast)
- Never make up prices for specific cars — give general ranges and suggest contacting for exact quotes`;

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
        max_tokens: 300,
        system: SYSTEM_PROMPT,
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
