import { describe, expect, it } from "vitest";
import type { Change } from "@/data/changelog";
import {
  emptySeen,
  isCategoryNew,
  latestChangeFor,
  markCategorySeen,
  markFeedSeen,
  newChanges,
  parseSeen,
} from "./seen";

const log: Change[] = [
  {
    id: "b",
    at: "2026-11-21T10:00:00Z",
    kind: "verification",
    title: "B",
    categories: ["flamants"],
  },
  {
    id: "a",
    at: "2026-11-20T10:00:00Z",
    kind: "ajout",
    title: "A",
    categories: ["histoire", "flamants"],
  },
];
const d = (s: string) => new Date(s);

describe("nouveau venu", () => {
  it("ne voit rien de « nouveau » parmi ce qui existait avant sa première visite", () => {
    const s = emptySeen(d("2026-11-22T00:00:00Z"));
    expect(newChanges(s, log)).toEqual([]);
    expect(isCategoryNew(s, "flamants", log)).toBe(false);
  });
});

describe("fil des nouveautés", () => {
  it("garde les pastilles pendant la visite, puis les retire à la visite suivante", () => {
    let s = emptySeen(d("2026-11-19T00:00:00Z"));
    s = markFeedSeen(s, d("2026-11-19T12:00:00Z")); // 1re visite
    s = markFeedSeen(s, d("2026-11-21T12:00:00Z")); // retour 2 jours plus tard
    expect(newChanges(s, log).map((c) => c.id)).toEqual(["b", "a"]);
    s = markFeedSeen(s, d("2026-11-21T12:10:00Z")); // même visite : inchangé
    expect(newChanges(s, log)).toHaveLength(2);
    s = markFeedSeen(s, d("2026-11-22T12:00:00Z")); // visite suivante
    expect(newChanges(s, log)).toEqual([]);
  });
});

describe("pastilles des catégories", () => {
  it("s'allument quand une entrée cite la catégorie, s'éteignent à l'ouverture", () => {
    let s = emptySeen(d("2026-11-19T00:00:00Z"));
    expect(isCategoryNew(s, "flamants", log)).toBe(true);
    expect(isCategoryNew(s, "animaux", log)).toBe(false);
    s = markCategorySeen(s, "flamants", d("2026-11-21T11:00:00Z"));
    expect(isCategoryNew(s, "flamants", log)).toBe(false);
    expect(isCategoryNew(s, "histoire", log)).toBe(true);
  });

  it("trouve la dernière mise à jour d'une catégorie", () => {
    expect(latestChangeFor("flamants", log)?.id).toBe("b");
    expect(latestChangeFor("animaux", log)).toBeUndefined();
  });
});

describe("parseSeen", () => {
  it("relit une valeur valide et nettoie les dates invalides", () => {
    const raw = JSON.stringify({
      v: 1,
      since: "2026-11-19T00:00:00Z",
      categories: { a: "2026-11-20T00:00:00Z", b: "pas une date" },
    });
    expect(parseSeen(raw)?.categories).toEqual({ a: "2026-11-20T00:00:00Z" });
  });

  it("refuse le contenu cassé", () => {
    expect(parseSeen("{")).toBeNull();
    expect(parseSeen(JSON.stringify({ v: 2 }))).toBeNull();
    expect(parseSeen(null)).toBeNull();
  });
});
