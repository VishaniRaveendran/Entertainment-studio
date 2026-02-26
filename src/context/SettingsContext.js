import React, { createContext, useContext, useState, useEffect } from "react";

const SettingsContext = createContext();
const STORAGE_KEY = "entertainment-studio-settings";

const defaultSettings = {
  language: "en-US",
  region: "US",
};

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...defaultSettings, ...parsed };
    }
  } catch (_) {}
  return defaultSettings;
}

export function SettingsProvider({ children }) {
  const [settings, setSettingsState] = useState(loadSettings);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (_) {}
  }, [settings]);

  const setSettings = (next) =>
    setSettingsState((prev) => (typeof next === "function" ? next(prev) : { ...prev, ...next }));

  const apiParams = { language: settings.language, region: settings.region };

  return (
    <SettingsContext.Provider value={{ settings, setSettings, apiParams }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
