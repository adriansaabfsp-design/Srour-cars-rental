"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Car } from "@/lib/types";

interface CompareContextValue {
  compareCars: Car[];
  addCar: (car: Car) => void;
  removeCar: (id: string) => void;
  isComparing: (id: string) => boolean;
  clearAll: () => void;
  showModal: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareCars, setCompareCars] = useState<Car[]>([]);
  const [showModal, setShowModal] = useState(false);

  const addCar = useCallback((car: Car) => {
    setCompareCars((prev) => {
      if (prev.length >= 2) return prev;
      if (prev.some((c) => c.id === car.id)) return prev;
      return [...prev, car];
    });
  }, []);

  const removeCar = useCallback((id: string) => {
    setCompareCars((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const isComparing = useCallback(
    (id: string) => compareCars.some((c) => c.id === id),
    [compareCars]
  );

  const clearAll = useCallback(() => {
    setCompareCars([]);
    setShowModal(false);
  }, []);

  const openModal = useCallback(() => setShowModal(true), []);
  const closeModal = useCallback(() => setShowModal(false), []);

  return (
    <CompareContext.Provider
      value={{ compareCars, addCar, removeCar, isComparing, clearAll, showModal, openModal, closeModal }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}
