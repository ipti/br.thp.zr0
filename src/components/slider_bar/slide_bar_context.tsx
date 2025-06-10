// context/SlideBarContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface SlideBarContextType {
  isVisible: boolean;
  toggleVisibility: () => void;
  setVisibility: (visible: boolean) => void;
}

const SlideBarContext = createContext<SlideBarContextType | undefined>(undefined);

export function SlideBarProvider({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => setIsVisible((prev) => !prev);
  const setVisibility = (visible: boolean) => setIsVisible(visible);

  return (
    <SlideBarContext.Provider value={{ isVisible, toggleVisibility, setVisibility }}>
      {children}
    </SlideBarContext.Provider>
  );
}

export const useSlideBar = () => {
  const context = useContext(SlideBarContext);
  if (!context) <></>;
  return context;
}
