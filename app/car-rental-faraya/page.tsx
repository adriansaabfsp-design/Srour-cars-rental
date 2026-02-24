import { Metadata } from "next";
import { CITIES } from "@/lib/cities";
import CityPage from "@/components/CityPage";

const city = CITIES.find((c) => c.slug === "car-rental-faraya")!;

export const metadata: Metadata = {
  title: city.title,
  description: city.metaDescription,
};

export default function Page() {
  return <CityPage city={city} />;
}
