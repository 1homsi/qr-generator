import { useState, useCallback } from "react";

interface History<T> {
  past: T[];
  present: T;
  future: T[];
}

export interface UndoRedoReturn<T> {
  state: T;
  set: (next: T | ((prev: T) => T)) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const MAX_HISTORY = 50;

export function useUndoRedo<T>(initialState: T): UndoRedoReturn<T> {
  const [history, setHistory] = useState<History<T>>({
    past: [],
    present: initialState,
    future: [],
  });

  const set = useCallback((next: T | ((prev: T) => T)) => {
    setHistory((h) => {
      const nextState =
        typeof next === "function"
          ? (next as (prev: T) => T)(h.present)
          : next;
      return {
        past: [...h.past.slice(-(MAX_HISTORY - 1)), h.present],
        present: nextState,
        future: [],
      };
    });
  }, []);

  const undo = useCallback(() => {
    setHistory((h) => {
      if (h.past.length === 0) return h;
      const previous = h.past[h.past.length - 1];
      return {
        past: h.past.slice(0, -1),
        present: previous,
        future: [h.present, ...h.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((h) => {
      if (h.future.length === 0) return h;
      const next = h.future[0];
      return {
        past: [...h.past, h.present],
        present: next,
        future: h.future.slice(1),
      };
    });
  }, []);

  return {
    state: history.present,
    set,
    undo,
    redo,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
  };
}
