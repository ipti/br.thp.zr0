// context/SlideBarContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const MOBILE_BREAKPOINT = 768;

interface SlideBarContextType {
  isVisible: boolean;
  toggleVisibility: () => void;
  setVisibility: (visible: boolean) => void;
  isMobile: boolean;
}

const SlideBarContext = createContext<SlideBarContextType | undefined>(undefined);

export function SlideBarProvider({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);

    // No mobile o menu é um drawer sobreposto: começa fechado para não
    // cobrir a página ao carregar. No desktop, mantém o padrão expandido.
    const applyViewport = (matches: boolean) => {
      setIsMobile(matches);
      setIsVisible(!matches);
    };

    applyViewport(mql.matches);
    const handleChange = (event: MediaQueryListEvent) => applyViewport(event.matches);
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  const toggleVisibility = () => setIsVisible((prev) => !prev);
  const setVisibility = (visible: boolean) => setIsVisible(visible);

  return (
    <SlideBarContext.Provider value={{ isVisible, toggleVisibility, setVisibility, isMobile }}>
      {children}
    </SlideBarContext.Provider>
  );
}

export const useSlideBar = () => {
  const context = useContext(SlideBarContext);
  if (!context) <></>;
  return context;
}
