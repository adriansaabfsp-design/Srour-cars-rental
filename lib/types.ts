/** Generate a URL-friendly slug from car name + brand + year */
export function generateCarSlug(car: { name: string; brand: string; year: number }): string {
  return `${car.name}-${car.brand}-${car.year}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export interface CarPhotos {
  main?: string;
  front?: string;
  back?: string;
  left?: string;
  right?: string;
}

export const PHOTO_SLOTS = [
  { key: "main" as const, label: "Main Photo", required: true },
  { key: "front" as const, label: "Front View", required: false },
  { key: "back" as const, label: "Back View", required: false },
  { key: "left" as const, label: "Left Side", required: false },
  { key: "right" as const, label: "Right Side", required: false },
] as const;

export type PhotoSlotKey = keyof CarPhotos;

export interface RentalRecord {
  renterName: string;
  renterPhone?: string;
  startDate: string;
  endDate: string;
  notes?: string;
}

export interface Car {
  id: string;
  name: string;
  brand: string;
  year: number;
  price: number;
  mileage: number;
  fuel: string;
  transmission: string;
  seats: number;
  description: string;
  images: string[];
  photos?: CarPhotos;
  gallery?: string[];
  whatsapp: string;
  createdAt: number;
  available?: boolean;
  availableFrom?: string;
  availableEta?: string;
  currentRenterName?: string;
  currentRenterPhone?: string;
  featured?: boolean;
  videoUrl?: string;
  adminNotes?: string;
  rentals?: RentalRecord[];
  category?: string;
  roadTypes?: string[];
  tripCategory?: string;
  features?: string[];
  minDays?: number;
  /* owner portal fields */
  ownerId?: string;
  ownerName?: string;
  status?: CarStatus;
  blockedDates?: string[];
}

export type CarStatus = "pending" | "approved" | "rejected";

export interface CarOwner {
  id: string;
  username: string;
  passwordHash: string;
  passwordPlain: string;
  displayName: string;
  companyName: string;
  phone: string;
  email: string;
  createdAt: number;
  approved: boolean;
}

export const BRANDS = [
  "All",
  "Acura",
  "Alfa Romeo",
  "Aston Martin",
  "Audi",
  "Bentley",
  "BMW",
  "Bugatti",
  "Buick",
  "BYD",
  "Cadillac",
  "Changan",
  "Chery",
  "Chevrolet",
  "Chrysler",
  "Citroën",
  "Dacia",
  "Daewoo",
  "Daihatsu",
  "Datsun",
  "Dodge",
  "DS Automobiles",
  "Exeed",
  "Ferrari",
  "Fiat",
  "Fisker",
  "Ford",
  "Foton",
  "GAC",
  "Geely",
  "Genesis",
  "GMC",
  "Great Wall",
  "Haval",
  "Hongqi",
  "Honda",
  "Hummer",
  "Hyundai",
  "Infiniti",
  "Isuzu",
  "JAC",
  "Jaguar",
  "Jeep",
  "Jetour",
  "JMC",
  "Kia",
  "Koenigsegg",
  "Lada",
  "Lamborghini",
  "Lancia",
  "Land Rover",
  "Lexus",
  "Li Auto",
  "Lincoln",
  "Lotus",
  "Lucid",
  "Mahindra",
  "Maserati",
  "Maybach",
  "Mazda",
  "McLaren",
  "Mercedes-Benz",
  "MG",
  "Mini",
  "Mitsubishi",
  "Nio",
  "Nissan",
  "Opel",
  "Pagani",
  "Peugeot",
  "Polestar",
  "Porsche",
  "Proton",
  "Ram",
  "Range Rover",
  "Renault",
  "Rivian",
  "Rolls-Royce",
  "Saab",
  "SEAT",
  "Škoda",
  "Skywell",
  "Smart",
  "SsangYong",
  "Subaru",
  "Suzuki",
  "Tank",
  "Tata",
  "Tesla",
  "Toyota",
  "Vauxhall",
  "Volkswagen",
  "Volvo",
  "Wuling",
  "Xpeng",
  "Zeekr",
] as const;

export const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Electric"] as const;
export const TRANSMISSIONS = ["Automatic", "Manual"] as const;

export const CAR_CATEGORIES = [
  "All",
  "Sedan",
  "SUV",
  "Hatchback",
  "Coupe",
  "Convertible",
  "Pickup",
  "Van",
  "Wagon",
  "Luxury",
  "Sports",
  "Electric",
] as const;

export const ROAD_TYPES = [
  "All Terrain",
  "City",
  "Mountain",
  "Coastal",
  "Off-Road",
  "Snow",
  "Desert",
] as const;

export const TRIP_CATEGORIES = [
  "None",
  "Sedan",
  "SUV",
  "Luxury",
  "Economy",
  "4×4",
  "Convertible",
] as const;

export const CAR_FEATURES = [
  "Bluetooth",
  "Apple CarPlay",
  "Android Auto",
  "Backup Camera",
  "360° Camera",
  "Navigation System",
  "Leather Seats",
  "Heated Seats",
  "Cooled Seats",
  "Sunroof",
  "Panoramic Roof",
  "Cruise Control",
  "Adaptive Cruise Control",
  "Blind Spot Monitor",
  "Lane Departure Warning",
  "Parking Sensors",
  "Keyless Entry",
  "Push Button Start",
  "USB Ports",
  "Wireless Charging",
  "LED Headlights",
  "Fog Lights",
  "Tinted Windows",
  "Power Seats",
  "Memory Seats",
  "Rear AC Vents",
  "Roof Rack",
  "Third Row Seating",
  "Dashcam",
  "ABS",
  "Airbags",
  "Traction Control",
  "All-Wheel Drive (AWD)",
  "4×4",
  "Rain Sensing Wipers",
  "Power Windows",
  "Power Mirrors",
  "Rear Spoiler",
  "Sport Mode",
  "Turbo Engine",
] as const;

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverImage: string;
  published: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  createdAt: number;
  updatedAt: number;
}

export const FAQ_CATEGORIES = [
  "How to Rent a Car in Lebanon",
  "Rental Requirements",
  "Pricing & Payment",
  "Pickup & Delivery",
  "Insurance & Accidents",
  "Our Fleet & Service",
] as const;
