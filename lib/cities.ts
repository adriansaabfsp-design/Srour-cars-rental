export interface CityData {
  slug: string;
  name: string;
  title: string;
  metaDescription: string;
  heroDescription: string;
  whyRent: string[];
  deliveryText: string;
  crossPromo: string | null; // null if no property count
  propertyCount: number | null;
  region: string | null; // for lebanon-rental.com filter
}

export const CITIES: CityData[] = [
  {
    slug: "car-rental-beirut",
    name: "Beirut",
    title: "Car Rental in Beirut Lebanon | Srour Cars",
    metaDescription:
      "Rent a luxury car in Beirut with free delivery to your hotel or address. SUVs, sedans, convertibles and more — 24/7 support. Book via WhatsApp today.",
    heroDescription:
      "Lebanon's vibrant capital and your gateway to the country. From the buzzing nightlife of Gemmayzeh to the historic streets of Downtown, Beirut is best explored with the freedom of your own car.",
    whyRent: [
      "Navigate Beirut's diverse neighborhoods — from Hamra to Achrafieh — on your own schedule",
      "Easy access to highway routes heading north to Jounieh and Byblos, or south to Sidon and Tyre",
      "Visit the National Museum, Pigeon Rocks, and the Corniche waterfront promenade",
      "Perfect base for day trips to Jeita Grotto, Harissa, and the Chouf Mountains",
    ],
    deliveryText:
      "We deliver directly to your hotel, Airbnb, or any address in Beirut — including Hamra, Verdun, Achrafieh, Downtown, and Beirut Rafic Hariri International Airport. Free delivery within Greater Beirut for all rentals.",
    crossPromo:
      "Staying in Beirut? Lebanon Rental has 20 properties in Beirut — browse apartments and suites at lebanon-rental.com",
    propertyCount: 20,
    region: "beirut",
  },
  {
    slug: "car-rental-tripoli",
    name: "Tripoli",
    title: "Car Rental in Tripoli Lebanon | Srour Cars",
    metaDescription:
      "Rent a car in Tripoli with doorstep delivery. Explore North Lebanon's historic capital with a premium vehicle. Book now via WhatsApp.",
    heroDescription:
      "The historic capital of North Lebanon, Tripoli is a city of ancient souks, Crusader castles, and the best street food in the country. A car opens up the entire northern region to you.",
    whyRent: [
      "Explore the Citadel of Raymond de Saint-Gilles and Tripoli's medieval souks",
      "Drive to the Cedars of God, Bcharre, and the Qadisha Valley — all within 90 minutes",
      "Visit the palm-lined El Mina waterfront and enjoy fresh seafood",
      "Gateway to Ehden, Tannourine waterfalls, and Balamand monasteries",
    ],
    deliveryText:
      "We deliver your rental car to any address in Tripoli and the surrounding North Lebanon area, including El Mina, Al Tall, and Anfeh. Delivery available 7 days a week.",
    crossPromo: null,
    propertyCount: null,
    region: null,
  },
  {
    slug: "car-rental-jounieh",
    name: "Jounieh",
    title: "Car Rental in Jounieh Lebanon | Srour Cars",
    metaDescription:
      "Rent a car in Jounieh with free delivery. Explore Jounieh Bay, Casino du Liban, and Harissa. Premium vehicles at competitive prices.",
    heroDescription:
      "Nestled in a stunning bay with the mountains rising behind it, Jounieh is a Mediterranean gem known for its nightlife, the Téléphérique to Harissa, and its proximity to Beirut.",
    whyRent: [
      "Cruise the Jounieh Bay corniche and explore Casino du Liban and the famous nightlife strip",
      "Take the Téléphérique up to Our Lady of Lebanon in Harissa for panoramic views",
      "Easy 20-minute drive to Beirut and 30 minutes to Byblos",
      "Access Faraya ski resort in just 40 minutes during winter",
    ],
    deliveryText:
      "We deliver directly to your hotel or residence in Jounieh, Haret Sakher, Kaslik, or anywhere in the Kesrouan district. Free delivery for rentals of 3+ days.",
    crossPromo:
      "Staying in Jounieh? Lebanon Rental has 262 properties in Keserouan — browse villas and chalets at lebanon-rental.com",
    propertyCount: 262,
    region: "keserouan",
  },
  {
    slug: "car-rental-batroun",
    name: "Batroun",
    title: "Car Rental in Batroun Lebanon | Srour Cars",
    metaDescription:
      "Rent a car in Batroun for the ultimate coastal experience. Beach clubs, vineyards, and historic sites. Free delivery to your villa or chalet.",
    heroDescription:
      "Batroun is Lebanon's hottest coastal destination — a Phoenician town turned trendy beach-club capital. Its old souk, wineries, and turquoise waters make it the perfect summer base.",
    whyRent: [
      "Explore Batroun's famous beach clubs, rooftop bars, and the Phoenician sea wall",
      "Drive through the vineyards of IXSIR and Batroun Mountains for wine tasting",
      "Visit the stunning Mseilha Fort and Tannourine Cedar Reserve nearby",
      "Perfect starting point for coastal road trips north to Tripoli or south to Byblos",
    ],
    deliveryText:
      "We deliver to your villa, chalet, or Airbnb anywhere in Batroun and the surrounding area — including Kfar Abida, Chekka, and Thoum. Weekend delivery available.",
    crossPromo:
      "Staying in Batroun? Lebanon Rental has 228 properties in El Batroun — browse villas and chalets at lebanon-rental.com",
    propertyCount: 228,
    region: "batroun",
  },
  {
    slug: "car-rental-jbeil",
    name: "Jbeil (Byblos)",
    title: "Car Rental in Jbeil Byblos Lebanon | Srour Cars",
    metaDescription:
      "Rent a car in Jbeil / Byblos with doorstep delivery. Explore one of the world's oldest cities with a premium rental vehicle.",
    heroDescription:
      "One of the oldest continuously inhabited cities in the world, Jbeil (Byblos) is a UNESCO World Heritage treasure with a medieval harbor, Crusader castle, and vibrant modern dining scene.",
    whyRent: [
      "Walk the ancient harbor, explore the Crusader Castle, and browse the charming old souk",
      "Drive to the ski slopes of Laqlouq in under an hour during winter",
      "Explore the surrounding Jbeil district — from Amchit to Nahr Ibrahim valley",
      "Perfect central location between Beirut (35 min) and Batroun (20 min)",
    ],
    deliveryText:
      "We deliver to any address in Jbeil / Byblos and the surrounding Jbeil district, including Amchit, Blat, and the coastal highway hotels. Free delivery for 3+ day rentals.",
    crossPromo:
      "Staying in Jbeil? Lebanon Rental has 94 properties in the Jbeil district — browse villas and apartments at lebanon-rental.com",
    propertyCount: 94,
    region: "jbeil",
  },
  {
    slug: "car-rental-sidon",
    name: "Sidon",
    title: "Car Rental in Sidon Lebanon | Srour Cars",
    metaDescription:
      "Rent a car in Sidon (Saida) with delivery to your door. Explore South Lebanon's capital and the surrounding historic sites.",
    heroDescription:
      "Sidon (Saida) is South Lebanon's largest city — a historic port town with Crusader sea castles, the Khan el-Franj, and colorful souks overflowing with sweets and spices.",
    whyRent: [
      "Visit the iconic Sea Castle, the Soap Museum, and the underground Temple of Eshmun",
      "Drive south to Tyre's Roman ruins and golden beaches in just 40 minutes",
      "Explore the Chouf Cedar Reserve and Beiteddine Palace — both within an hour",
      "Experience authentic Lebanese street food in Sidon's bustling old souks",
    ],
    deliveryText:
      "We deliver your car to any address in Sidon and the surrounding South Lebanon area. Hotel, residence, or office — just give us your location and we'll be there.",
    crossPromo:
      "Staying near Sidon? Lebanon Rental has 44 properties in the Chouf district — browse villas at lebanon-rental.com",
    propertyCount: 44,
    region: "chouf",
  },
  {
    slug: "car-rental-tyre",
    name: "Tyre",
    title: "Car Rental in Tyre Lebanon | Srour Cars",
    metaDescription:
      "Rent a car in Tyre (Sour) with free delivery. Explore Roman ruins, golden beaches, and South Lebanon at your own pace.",
    heroDescription:
      "Tyre (Sour) is a UNESCO World Heritage city on Lebanon's southern coast — famous for its Roman hippodrome, golden sand beaches, and fresh fish restaurants by the ancient harbor.",
    whyRent: [
      "Explore the UNESCO-listed Roman ruins — one of the largest and best-preserved in the world",
      "Relax on Tyre's famous public beach — the cleanest and most beautiful in Lebanon",
      "Drive along the scenic southern coastal road to Naqoura and the Blue Line",
      "Visit the charming fishing harbor and enjoy fresh seafood at sunset",
    ],
    deliveryText:
      "We deliver to your hotel, guesthouse, or any address in Tyre and the surrounding area. Whether you're by the beach or in the old city, we'll bring the car to you.",
    crossPromo: null,
    propertyCount: null,
    region: null,
  },
  {
    slug: "car-rental-faraya",
    name: "Faraya",
    title: "Car Rental in Faraya Lebanon | Srour Cars",
    metaDescription:
      "Rent an SUV or 4x4 in Faraya for skiing and mountain driving. Door-to-door delivery to your chalet. Winter-ready vehicles available.",
    heroDescription:
      "Lebanon's premier ski destination, Faraya-Mzaar is a mountain paradise just 45 minutes from Beirut. In winter it's a snowy wonderland; in summer, a cool escape for hiking and paragliding.",
    whyRent: [
      "Hit the slopes at Mzaar Ski Resort — Lebanon's largest — with a reliable SUV or 4×4",
      "Navigate snowy mountain roads safely with our winter-ready fleet",
      "Enjoy Faraya's chalets, restaurants, and après-ski scene at your own pace",
      "Combine skiing with a coastal day trip — Jounieh Bay is just 30 minutes downhill",
    ],
    deliveryText:
      "We deliver SUVs and 4×4 vehicles directly to your chalet or hotel in Faraya, Kfardebian, and the Mzaar area. Our mountain-ready vehicles come equipped with winter tires when needed.",
    crossPromo:
      "Staying in Faraya? Lebanon Rental has 262 properties in the Keserouan region — browse chalets and mountain lodges at lebanon-rental.com",
    propertyCount: 262,
    region: "keserouan",
  },
  {
    slug: "car-rental-zahle",
    name: "Zahle",
    title: "Car Rental in Zahle Lebanon | Srour Cars",
    metaDescription:
      "Rent a car in Zahle to explore the Bekaa Valley. Wine tours, Baalbek temples, and Anjar ruins — all at your fingertips.",
    heroDescription:
      "The capital of the Bekaa Valley, Zahle is known as the 'Bride of the Bekaa' — famous for its riverside restaurants along the Berdawni, its arak production, and its position as the gateway to Baalbek.",
    whyRent: [
      "Drive to the legendary Baalbek temples — one of the world's greatest Roman sites — in 45 minutes",
      "Tour the Bekaa Valley's famous wineries: Ksara, Kefraya, Massaya, and more",
      "Visit the Umayyad ruins of Anjar, a UNESCO World Heritage Site",
      "Enjoy Zahle's famous Berdawni riverside meze restaurants with the family",
    ],
    deliveryText:
      "We deliver to any address in Zahle and throughout the Bekaa Valley. Whether you're at a winery, a hotel, or a private residence, we'll bring your car to you.",
    crossPromo: null,
    propertyCount: null,
    region: null,
  },
];
