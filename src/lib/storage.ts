import { emptyProgress, type Progress } from "./progress";

export const STORAGE_KEY = "platinecity:progress";

/** Sous-ensemble de l'API Storage, pour pouvoir tester sans navigateur. */
export type KeyValueStore = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
};

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/**
 * Lit une sauvegarde (localStorage ou fichier importé) et la nettoie.
 * Toute donnée invalide est ignorée plutôt que de casser l'app.
 */
export function parseProgress(raw: string | null): Progress {
  return tryParseProgress(raw) ?? emptyProgress();
}

/** Comme parseProgress, mais renvoie null si ce n'est pas une sauvegarde (pour l'import). */
export function tryParseProgress(raw: string | null): Progress | null {
  if (!raw) return null;
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!isRecord(json) || json.v !== 1) return null;

  const checked: Progress["checked"] = {};
  if (isRecord(json.checked)) {
    for (const [id, val] of Object.entries(json.checked)) {
      if (val === true) checked[id] = true;
    }
  }
  const counts: Progress["counts"] = {};
  if (isRecord(json.counts)) {
    for (const [id, val] of Object.entries(json.counts)) {
      if (typeof val === "number" && Number.isFinite(val) && val >= 0) {
        counts[id] = Math.floor(val);
      }
    }
  }
  return {
    v: 1,
    checked,
    counts,
    lastCategoryId:
      typeof json.lastCategoryId === "string" ? json.lastCategoryId : undefined,
    updatedAt:
      typeof json.updatedAt === "string"
        ? json.updatedAt
        : new Date(0).toISOString(),
  };
}

export const serializeProgress = (p: Progress) => JSON.stringify(p);

export function loadProgress(store: KeyValueStore | null): Progress {
  if (!store) return emptyProgress();
  try {
    return parseProgress(store.getItem(STORAGE_KEY));
  } catch {
    return emptyProgress();
  }
}

/** Renvoie false si le navigateur refuse l'écriture (navigation privée, quota). */
export function saveProgress(store: KeyValueStore | null, p: Progress): boolean {
  if (!store) return false;
  try {
    store.setItem(STORAGE_KEY, serializeProgress(p));
    return true;
  } catch {
    return false;
  }
}

/** Fusion pour un import ou une future synchro : la plus récente gagne. */
export function newest(a: Progress, b: Progress): Progress {
  return Date.parse(b.updatedAt) > Date.parse(a.updatedAt) ? b : a;
}
