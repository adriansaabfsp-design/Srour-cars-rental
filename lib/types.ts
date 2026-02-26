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
  "Cadillac",
  "Chevrolet",
  "Chrysler",
  "Citroën",
  "Dacia",
  "Daewoo",
  "Daihatsu",
  "Dodge",
  "Ferrari",
  "Fiat",
  "Fisker",
  "Ford",
  "GAC",
  "Genesis",
  "GMC",
  "Great Wall",
  "Haval",
  "Honda",
  "Hummer",
  "Hyundai",
  "Infiniti",
  "Isuzu",
  "Jaguar",
  "Jeep",
  "Jetour",
  "Kia",
  "Koenigsegg",
  "Lamborghini",
  "Lancia",
  "Land Rover",
  "Lexus",
  "Lincoln",
  "Lotus",
  "Lucid",
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
  "Smart",
  "SsangYong",
  "Subaru",
  "Suzuki",
  "Tank",
  "Tata",
  "Tesla",
  "Toyota",
  "Volkswagen",
  "Volvo",
  "Wuling",
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
