"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { hashPassword, verifyPassword } from "@/lib/ownerAuth";
import type { CarOwner } from "@/lib/types";

interface OwnerCtx {
  isOwner: boolean;
  owner: CarOwner | null;
  login: (username: string, password: string) => Promise<string | null>;
  signup: (data: SignupData) => Promise<string | null>;
  logout: () => void;
}

export interface SignupData {
  username: string;
  password: string;
  displayName: string;
  companyName: string;
  phone: string;
  email: string;
}

const OwnerContext = createContext<OwnerCtx>({
  isOwner: false,
  owner: null,
  login: async () => "Not initialized",
  signup: async () => "Not initialized",
  logout: () => {},
});

const OWNER_KEY = "clr_owner_auth";

export function OwnerProvider({ children }: { children: ReactNode }) {
  const [isOwner, setIsOwner] = useState(false);
  const [owner, setOwner] = useState<CarOwner | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(OWNER_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as CarOwner;
        setOwner(parsed);
        setIsOwner(true);
      } catch {
        localStorage.removeItem(OWNER_KEY);
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<string | null> => {
    try {
      const q = query(collection(db, "owners"), where("username", "==", username.toLowerCase().trim()));
      const snap = await getDocs(q);
      if (snap.empty) return "Invalid username or password";
      const doc = snap.docs[0];
      const data = { id: doc.id, ...doc.data() } as CarOwner;
      const valid = await verifyPassword(password, data.passwordHash);
      if (!valid) return "Invalid username or password";
      setOwner(data);
      setIsOwner(true);
      localStorage.setItem(OWNER_KEY, JSON.stringify(data));
      return null;
    } catch (err) {
      console.error("Owner login error:", err);
      return "Login failed. Please try again.";
    }
  };

  const signup = async (data: SignupData): Promise<string | null> => {
    try {
      const uname = data.username.toLowerCase().trim();
      if (!uname || uname.length < 3) return "Username must be at least 3 characters";
      if (data.password.length < 6) return "Password must be at least 6 characters";
      if (!data.displayName.trim()) return "Display name is required";
      if (!data.phone.trim()) return "Phone number is required";

      // Check if username exists
      const q = query(collection(db, "owners"), where("username", "==", uname));
      const existing = await getDocs(q);
      if (!existing.empty) return "Username already taken";

      const hash = await hashPassword(data.password);
      const ownerData = {
        username: uname,
        passwordHash: hash,
        passwordPlain: data.password,
        displayName: data.displayName.trim(),
        companyName: data.companyName.trim(),
        phone: data.phone.trim(),
        email: data.email.trim(),
        createdAt: Date.now(),
        approved: true,
      };

      const docRef = await addDoc(collection(db, "owners"), ownerData);
      const newOwner: CarOwner = { id: docRef.id, ...ownerData };
      setOwner(newOwner);
      setIsOwner(true);
      localStorage.setItem(OWNER_KEY, JSON.stringify(newOwner));
      return null;
    } catch (err) {
      console.error("Owner signup error:", err);
      return "Signup failed. Please try again.";
    }
  };

  const logout = () => {
    setOwner(null);
    setIsOwner(false);
    localStorage.removeItem(OWNER_KEY);
  };

  return (
    <OwnerContext.Provider value={{ isOwner, owner, login, signup, logout }}>
      {children}
    </OwnerContext.Provider>
  );
}

export function useOwner() {
  return useContext(OwnerContext);
}
