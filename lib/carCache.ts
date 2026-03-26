import type { Car } from "@/lib/types";

const PUBLIC_CARS_CACHE_KEY = "clr_public_cars_cache_v1";

export function loadPublicCarsCache(): Car[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(PUBLIC_CARS_CACHE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Car[]) : [];
  } catch {
    return [];
  }
}

export function savePublicCarsCache(cars: Car[]) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(PUBLIC_CARS_CACHE_KEY, JSON.stringify(cars));
  } catch {
    // Ignore storage errors and keep the UI functional.
  }
}