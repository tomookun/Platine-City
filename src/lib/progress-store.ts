"use client";

import { useSyncExternalStore } from "react";
import type { Progress } from "./progress";
import {
  STORAGE_KEY,
  loadProgress,
  saveProgress,
  type KeyValueStore,
} from "./storage";

/**
 * Store client de la progression, branché sur localStorage.
 * Côté serveur (pré-rendu) le snapshot vaut null : l'UI affiche un état
 * neutre puis la vraie progression après hydratation.
 */
const SETTINGS_KEY = "platinecity:settings";

function browserStore(): KeyValueStore | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

let progress: Progress | null = null;
let saved = true;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      progress = loadProgress(browserStore());
      emit();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

const getSnapshot = () => (progress ??= loadProgress(browserStore()));
const getServerSnapshot = () => null;

export function setProgress(next: Progress) {
  progress = next;
  saved = saveProgress(browserStore(), next);
  emit();
}

/**
 * Applique une modification à l'état le plus récent (pas à celui du dernier
 * rendu) : deux appuis rapides ne s'écrasent pas. Renvoie l'état d'avant,
 * pour « Annuler ».
 */
export function updateProgress(fn: (p: Progress) => Progress): Progress {
  const previous = getSnapshot();
  setProgress(fn(previous));
  return previous;
}

export const isSaved = () => saved;

export function useProgress(): Progress | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/* Réglages (anti-spoiler…) */
export type Settings = { spoilerFree: boolean };
const defaultSettings: Settings = { spoilerFree: true };
let settings: Settings | null = null;
const settingsListeners = new Set<() => void>();

function readSettings(): Settings {
  try {
    const raw = browserStore()?.getItem(SETTINGS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return { spoilerFree: parsed.spoilerFree !== false };
  } catch {
    return defaultSettings;
  }
}

export function setSettings(next: Settings) {
  settings = next;
  try {
    browserStore()?.setItem(SETTINGS_KEY, JSON.stringify(next));
  } catch {
    /* navigation privée : le réglage vit le temps de la session */
  }
  settingsListeners.forEach((l) => l());
}

export function useSettings(): Settings {
  return useSyncExternalStore(
    (l) => {
      settingsListeners.add(l);
      return () => settingsListeners.delete(l);
    },
    () => (settings ??= readSettings()),
    () => defaultSettings,
  );
}
