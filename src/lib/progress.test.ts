import { describe, expect, it } from "vitest";
import type { GameData } from "@/data/types";
import {
  categoryProgress,
  doneInCategory,
  emptyProgress,
  globalProgress,
  increment,
  setCount,
  toggleItem,
} from "./progress";

const v = { status: "verified", verifiedAt: "2026-11-19" } as const;
const data: GameData = {
  version: "test",
  sample: true,
  updatedAt: "2026-11-19",
  sections: [{ id: "activites", name: "Activités" }],
  categories: [
    {
      id: "cascades",
      slug: "cascades",
      name: "Cascades",
      unit: "cascade",
      section: "activites",
      required: 8,
      total: 10,
      description: "",
      reliability: v,
      items: [
        { id: "c1", n: 1, title: "C1", reliability: v },
        { id: "c2", n: 2, title: "C2", reliability: v },
      ],
    },
    {
      id: "banques",
      slug: "banques",
      name: "Banques",
      unit: "banque",
      section: "activites",
      required: 5,
      total: 5,
      description: "",
      reliability: v,
      items: [],
    },
  ],
};
const [cascades, banques] = data.categories;
const t0 = new Date("2026-11-19T10:00:00Z");

describe("toggleItem", () => {
  it("coche puis décoche un élément et suit le compteur", () => {
    let p = toggleItem(data, emptyProgress(t0), "c1", t0);
    expect(p.checked.c1).toBe(true);
    expect(doneInCategory(p, cascades)).toBe(1);
    expect(p.lastCategoryId).toBe("cascades");
    p = toggleItem(data, p, "c1", t0);
    expect(p.checked.c1).toBeUndefined();
    expect(doneInCategory(p, cascades)).toBe(0);
  });

  it("ajoute la coche au compteur existant", () => {
    let p = setCount(cascades, emptyProgress(t0), 6, t0);
    p = toggleItem(data, p, "c2", t0);
    expect(doneInCategory(p, cascades)).toBe(7);
  });

  it("ignore un id inconnu", () => {
    const p = emptyProgress(t0);
    expect(toggleItem(data, p, "inconnu", t0)).toBe(p);
  });

  it("ne mute pas l'état d'origine", () => {
    const p = emptyProgress(t0);
    toggleItem(data, p, "c1", t0);
    expect(p.checked).toEqual({});
  });
});

describe("setCount / increment", () => {
  it("borne entre les cases cochées et le total", () => {
    let p = toggleItem(data, emptyProgress(t0), "c1", t0);
    p = toggleItem(data, p, "c2", t0);
    expect(doneInCategory(setCount(cascades, p, 0, t0), cascades)).toBe(2);
    expect(doneInCategory(setCount(cascades, p, 99, t0), cascades)).toBe(10);
  });

  it("ignore les valeurs non numériques", () => {
    const p = emptyProgress(t0);
    expect(setCount(banques, p, Number.NaN, t0)).toBe(p);
  });

  it("incrémente et décrémente sans sortir des bornes", () => {
    let p = increment(banques, emptyProgress(t0), 1, t0);
    expect(doneInCategory(p, banques)).toBe(1);
    p = increment(banques, p, -5, t0);
    expect(doneInCategory(p, banques)).toBe(0);
  });
});

describe("pourcentages", () => {
  it("calcule une catégorie (arrondi à l'inférieur)", () => {
    const p = setCount(cascades, emptyProgress(t0), 3, t0);
    expect(categoryProgress(p, cascades)).toEqual({
      done: 3,
      total: 8,
      percent: 37,
      all: 3,
      max: 10,
    });
    const q = setCount(banques, emptyProgress(t0), 4.6, t0);
    expect(categoryProgress(q, banques).percent).toBe(100);
  });

  it("n'affiche jamais 100 % avant la fin", () => {
    const p = setCount(cascades, emptyProgress(t0), 7, t0);
    expect(categoryProgress(p, cascades).percent).toBe(87);
    const big = { ...cascades, required: 1000, total: 1000 };
    expect(
      categoryProgress(setCount(big, emptyProgress(t0), 999, t0), big).percent,
    ).toBe(99);
  });

  it("atteint 100 % au requis et compte le bonus jusqu'au total du jeu", () => {
    const p = setCount(cascades, emptyProgress(t0), 10, t0);
    expect(categoryProgress(p, cascades)).toEqual({
      done: 8,
      total: 8,
      percent: 100,
      all: 10,
      max: 10,
    });
  });

  it("calcule le global sur les objectifs requis, sans compter le bonus", () => {
    let p = setCount(cascades, emptyProgress(t0), 10, t0);
    p = setCount(banques, p, 2, t0);
    expect(globalProgress(data, p)).toEqual({
      done: 10,
      total: 13,
      percent: 76,
    });
  });

  it("vaut 0 % sans progression", () => {
    expect(globalProgress(data, emptyProgress(t0)).percent).toBe(0);
  });
});
