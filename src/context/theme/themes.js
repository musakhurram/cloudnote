import React, { useCallback, useEffect, useMemo, useState } from "react";
import ThemeContext from "./ThemeContext";

const STORAGE_KEY = "cloudnote-theme";

const getInitialTheme = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch (e) {
    // localStorage unavailable — fall through to system
  }
  return "system";
};

const resolveTheme = (preference) => {
  if (preference === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return preference;
};

const ThemeProvider = (props) => {
  const [preference, setPreference] = useState(getInitialTheme);
  const [theme, setTheme] = useState(() => resolveTheme(preference));

  // Listen for OS theme changes while in "system" mode
  useEffect(() => {
    if (preference !== "system") return undefined;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => setTheme(e.matches ? "dark" : "light");
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [preference]);

  // Persist and apply the chosen preference
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, preference);
    } catch (e) {
      // ignore storage errors
    }
    setTheme(resolveTheme(preference));
  }, [preference]);

  // Reflect the resolved theme on <html>
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  const setThemePreference = useCallback((next) => {
    setPreference(next);
  }, []);

  const value = useMemo(
    () => ({
      preference,
      theme,
      setThemePreference,
    }),
    [preference, theme, setThemePreference]
  );

  return <ThemeContext.Provider value={value}>{props.children}</ThemeContext.Provider>;
};

export default ThemeProvider;
