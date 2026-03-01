"use client";

import { CompareProvider } from "@/components/CompareContext";
import CompareBar from "@/components/CompareBar";
import { ReactNode } from "react";

export default function CompareWrapper({ children }: { children: ReactNode }) {
  return (
    <CompareProvider>
      {children}
      <CompareBar />
    </CompareProvider>
  );
}
