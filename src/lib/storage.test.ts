import { describe, expect, it } from "vitest";
import { emptyProgress } from "./progress";
import {
  STORAGE_KEY,
  loadProgress,
  newest,
  parseProgress,
  saveProgress,
  tryParseProgress,
  type KeyValueStore,
} from "./storage";

const memory = (): KeyValueStore & { data: Map<string, string> } => {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => void data.set(k, v),
  };
};

describe("sauvegarde locale", () => {
  it("relit exactement ce qui a été sauvegardé", () => {
    const store = memory();
    const p = {
      ...emptyProgress(new Date("2026-11-19T10:00:00Z")),
      checked: { c1: true as const },
      counts: { cascades: 12 },
      lastCategoryId: "cascades",
    };
    expect(saveProgress(store, p)).toBe(true);
    expect(store.data.has(STORAGE_KEY)).toBe(true);
    expect(loadProgress(store)).toEqual(p);
  });

  it("démarre vide sans sauvegarde ni stockage", () => {
    expect(loadProgress(memory()).checked).toEqual({});
    expect(loadProgress(null).counts).toEqual({});
  });

  it("survit à un navigateur qui refuse l'accès", () => {
    const broken: KeyValueStore = {
      getItem: () => {
        throw new Error("SecurityError");
      },
      setItem: () => {
        throw new Error("QuotaExceededError");
      },
    };
    expect(loadProgress(broken).counts).toEqual({});
    expect(saveProgress(broken, emptyProgress())).toBe(false);
    expect(saveProgress(null, emptyProgress())).toBe(false);
  });
});

describe("parseProgress", () => {
  it("ignore un JSON cassé ou d'une autre version", () => {
    expect(parseProgress("{pas du json").checked).toEqual({});
    expect(
      parseProgress(JSON.stringify({ v: 2, counts: { a: 3 } })).counts,
    ).toEqual({});
    expect(parseProgress("[]").counts).toEqual({});
  });

  it("nettoie les valeurs invalides d'un fichier importé", () => {
    const p = parseProgress(
      JSON.stringify({
        v: 1,
        checked: { ok: true, faux: "oui", non: false },
        counts: { a: 3.7, b: -1, c: "12", d: null },
        lastCategoryId: 42,
      }),
    );
    expect(p.checked).toEqual({ ok: true });
    expect(p.counts).toEqual({ a: 3 });
    expect(p.lastCategoryId).toBeUndefined();
  });
});

describe("tryParseProgress (import de fichier)", () => {
  it("refuse ce qui n'est pas une sauvegarde", () => {
    expect(tryParseProgress(null)).toBeNull();
    expect(tryParseProgress("bonjour")).toBeNull();
    expect(tryParseProgress(JSON.stringify({ v: 2 }))).toBeNull();
  });

  it("relit un export complet", () => {
    const p = {
      ...emptyProgress(new Date("2026-11-19T10:00:00Z")),
      counts: { cascades: 4 },
    };
    expect(tryParseProgress(JSON.stringify(p))).toEqual(p);
  });
});

describe("newest", () => {
  it("garde la sauvegarde la plus récente", () => {
    const old = emptyProgress(new Date("2026-11-19T10:00:00Z"));
    const recent = emptyProgress(new Date("2026-11-20T10:00:00Z"));
    expect(newest(old, recent)).toBe(recent);
    expect(newest(recent, old)).toBe(recent);
  });
});
