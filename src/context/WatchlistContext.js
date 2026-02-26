import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

const WatchlistContext = createContext();
const STORAGE_KEY = "entertainment-studio-watchlist";

function loadWatchlist() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveWatchlist(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (_) {}
}

export function WatchlistProvider({ children }) {
  const [items, setItems] = useState(loadWatchlist);

  useEffect(() => {
    saveWatchlist(items);
  }, [items]);

  const add = useCallback((item) => {
    setItems((prev) => {
      const key = `${item.media_type}-${item.id}`;
      if (prev.some((i) => `${i.media_type}-${i.id}` === key)) return prev;
      return [...prev, { ...item, addedAt: Date.now() }];
    });
  }, []);

  const remove = useCallback((mediaType, id) => {
    setItems((prev) => prev.filter((i) => !(i.media_type === mediaType && i.id === id)));
  }, []);

  const isInWatchlist = useCallback(
    (mediaType, id) => items.some((i) => i.media_type === mediaType && i.id === id),
    [items]
  );

  const toggle = useCallback(
    (item) => {
      if (isInWatchlist(item.media_type, item.id)) remove(item.media_type, item.id);
      else add(item);
    },
    [add, remove, isInWatchlist]
  );

  return (
    <WatchlistContext.Provider value={{ items, add, remove, isInWatchlist, toggle }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error("useWatchlist must be used within WatchlistProvider");
  return ctx;
}
