"use client";

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react";

type FontSize = "normal" | "large" | "xlarge";

const FONT_SIZE_KEY = "nadeshiko-font-size";

const FONT_SIZE_CLASS: Record<FontSize, string> = {
  normal: "",
  large: "text-lg",
  xlarge: "text-xl",
};

type FontSizeContextType = {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  fontSizeClass: string;
};

const FontSizeContext = createContext<FontSizeContextType>({
  fontSize: "normal",
  setFontSize: () => {},
  fontSizeClass: "",
});

export function FontSizeProvider({ children }: { children: ReactNode }) {
  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    if (typeof window === "undefined") return "normal";
    const saved = localStorage.getItem(FONT_SIZE_KEY);
    if (saved === "normal" || saved === "large" || saved === "xlarge") return saved;
    return "normal";
  });

  const isInitial = useRef(true);

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size);
    localStorage.setItem(FONT_SIZE_KEY, size);
  };

  useEffect(() => {
    if (isInitial.current) {
      isInitial.current = false;
    }
    const html = document.documentElement;
    html.classList.remove("font-size-normal", "font-size-large", "font-size-xlarge");
    html.classList.add(`font-size-${fontSize}`);
  }, [fontSize]);

  return (
    <FontSizeContext.Provider
      value={{ fontSize, setFontSize, fontSizeClass: FONT_SIZE_CLASS[fontSize] }}
    >
      {children}
    </FontSizeContext.Provider>
  );
}

export function useFontSize() {
  return useContext(FontSizeContext);
}
