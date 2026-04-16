import React, { createContext, useContext, useEffect, useState } from "react";
import i18n from "../../i18n";

type Theme = "dark" | "light" | "system";
type Language = "en" | "vi" | "fr" | "ru";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultLanguage?: Language;
  storageThemeKey?: string;
  storageLanguageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  language: Language;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  language: "vi",
  setTheme: () => null,
  setLanguage: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  defaultLanguage = "vi",
  storageThemeKey = "vite-ui-theme",
  storageLanguageKey = "vite-ui-language",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageThemeKey) as Theme) || defaultTheme
  );
  
  const [language, setLanguage] = useState<Language>(
    () => (localStorage.getItem(storageLanguageKey) as Language) || defaultLanguage
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);


  const value = {
    theme,
    language,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageThemeKey, theme);
      setTheme(theme);
    },
    setLanguage: (language: Language) => {
      localStorage.setItem(storageLanguageKey, language);
      setLanguage(language);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
