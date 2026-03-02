import { useState, useCallback } from "react";
import type { HistoryEntry, QrType, QrData, QrColors, QrStyles } from "../types";

const STORAGE_KEY = "qr-history";
const MAX_ENTRIES = 20;

function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

function saveHistory(entries: HistoryEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // storage quota exceeded — skip silently
  }
}

export function useQrHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory);

  const addEntry = useCallback(
    (
      qrType: QrType,
      qrData: QrData,
      qrColors: QrColors,
      qrStyles: QrStyles,
      thumbnail: string
    ) => {
      const entry: HistoryEntry = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        qrType,
        qrData,
        qrColors,
        qrStyles: { ...qrStyles, logoFile: null },
        thumbnail,
      };
      setHistory((prev) => {
        const next = [entry, ...prev].slice(0, MAX_ENTRIES);
        saveHistory(next);
        return next;
      });
    },
    []
  );

  const removeEntry = useCallback((id: string) => {
    setHistory((prev) => {
      const next = prev.filter((e) => e.id !== id);
      saveHistory(next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { history, addEntry, removeEntry, clearHistory };
}
