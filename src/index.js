import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { WatchlistProvider } from "./context/WatchlistContext";
import { SettingsProvider } from "./context/SettingsContext";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider>
      <SettingsProvider>
        <WatchlistProvider>
          <App />
        </WatchlistProvider>
      </SettingsProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(`${process.env.PUBLIC_URL || ""}/sw.js`).catch(() => {});
  });
}

