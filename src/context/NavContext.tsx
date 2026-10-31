"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface NavContextType {
  isNavOpen: boolean;
  toggleNav: () => void;
  openNav: () => void;
  closeNav: () => void;
}

const NavContext = createContext<NavContextType>({
  isNavOpen: true,
  toggleNav: () => {},
  openNav: () => {},
  closeNav: () => {},
});

export function NavProvider({ children }: { children: React.ReactNode }) {
  const [isNavOpen, setIsNavOpen] = useState(true);

  // Sync with localStorage on client
  useEffect(() => {
    try {
      const saved = localStorage.getItem("sunpower_nav_open");
      if (saved !== null) {
        setIsNavOpen(saved === "true");
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const toggleNav = () => {
    setIsNavOpen((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("sunpower_nav_open", String(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  const openNav = () => {
    setIsNavOpen(true);
    try {
      localStorage.setItem("sunpower_nav_open", "true");
    } catch {
      // Ignore
    }
  };

  const closeNav = () => {
    setIsNavOpen(false);
    try {
      localStorage.setItem("sunpower_nav_open", "false");
    } catch {
      // Ignore
    }
  };

  return (
    <NavContext.Provider value={{ isNavOpen, toggleNav, openNav, closeNav }}>
      {children}
    </NavContext.Provider>
  );
}

export function useNav() {
  return useContext(NavContext);
}
