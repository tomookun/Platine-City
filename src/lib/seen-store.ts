"use client";

import { useSyncExternalStore } from "react";
import { emptySeen, parseSeen, type Seen } from "./seen";

/** Store client de « ce qui a déjà été vu », dans localStorage. Null côté serveur. */
const KEY = "platinecity:seen";

function storage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

let seen: Seen | null = null;
const listeners = new Set<() => void>();

function write(next: Seen) {
  seen = next;
  try {
    storage()?.setItem(KEY, JSON.stringify(next));
  } catch {
    /* navigation privée : gardé le temps de la session */
  }
}

function load(): Seen {
  const parsed = parseSeen(storage()?.getItem(KEY));
  if (parsed) return parsed;
  const fresh = emptySeen();
  write(fresh);
  return fresh;
}

const getSnapshot = () => (seen ??= load());

/** Applique une modification ; ne notifie que si quelque chose change. */
export function updateSeen(fn: (s: Seen) => Seen) {
  const current = getSnapshot();
  const next = fn(current);
  if (next === current) return;
  write(next);
  listeners.forEach((l) => l());
}

export function useSeen(): Seen | null {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    getSnapshot,
    () => null,
  );
}
