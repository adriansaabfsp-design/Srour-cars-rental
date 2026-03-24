"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AdminCtx {
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminCtx>({ isAdmin: false, login: () => false, logout: () => {} });

const ADMIN_KEY = "clr_admin_auth";
const ADMIN_PASS = "srourcars@rentals";

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem(ADMIN_KEY) === "1") {
      setIsAdmin(true);
    }
  }, []);

  const login = (password: string) => {
    if (password === ADMIN_PASS) {
      setIsAdmin(true);
      localStorage.setItem(ADMIN_KEY, "1");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem(ADMIN_KEY);
    sessionStorage.removeItem("admin_auth");
  };

  return <AdminContext.Provider value={{ isAdmin, login, logout }}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  return useContext(AdminContext);
}
