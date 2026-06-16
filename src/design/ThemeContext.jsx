// Groply — ThemeContext.js
// Contexte de thème : auto (système) / light / dark
// Usage dans un composant : const C = useC();
import { createContext, useContext, useEffect, useState } from "react";
import { LIGHT, DARK, FONTS, R } from "./tokens.js";

export const ThemeContext = createContext({ C: LIGHT, theme: "light", resolvedTheme: "light" });

export function ThemeProvider({ children, theme = "auto" }) {
  const [sysDark, setSysDark] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => setSysDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const resolvedTheme = theme === "auto" ? (sysDark ? "dark" : "light") : theme;
  const C = resolvedTheme === "dark" ? DARK : LIGHT;

  // Sync couleur de fond sur <html> pour éviter le flash blanc/noir
  useEffect(() => {
    document.documentElement.style.background = C.bg;
    document.documentElement.setAttribute("data-theme", resolvedTheme);
  }, [C.bg, resolvedTheme]);

  return (
    <ThemeContext.Provider value={{ C, theme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook principal : remplace "import { C } from ./tokens.js" partout
export function useC() {
  return useContext(ThemeContext).C;
}

export function useTheme() {
  return useContext(ThemeContext);
}
