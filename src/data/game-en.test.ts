import { describe, expect, it } from "vitest";
import { game, getCategory, getGame } from "./game";
import { CATEGORIES_EN } from "./game-en";

describe("version anglaise des données", () => {
  const en = getGame("en");

  it("traduit chaque catégorie, avec des slugs anglais uniques", () => {
    expect(Object.keys(CATEGORIES_EN).sort()).toEqual(
      game.categories.map((c) => c.id).sort(),
    );
    const slugs = en.categories.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9-]+$/);
  });

  it("garde les mêmes identifiants et nombres (progression partagée)", () => {
    en.categories.forEach((c, i) => {
      const fr = game.categories[i];
      expect([c.id, c.required, c.total, c.items.map((x) => x.id)]).toEqual([
        fr.id,
        fr.required,
        fr.total,
        fr.items.map((x) => x.id),
      ]);
    });
  });

  it("traduit les chapitres et retrouve une catégorie par son slug anglais", () => {
    const story = getCategory("story-missions", "en");
    expect(story?.items[0].where).toBe("Chapter 1");
    expect(story?.items.every((it) => !it.where?.includes("Chapitre"))).toBe(
      true,
    );
    expect(
      story?.items.every((it) => !/Absente|Titre exact/.test(it.where ?? "")),
    ).toBe(true);
    expect(getCategory("story-missions", "fr")).toBeUndefined();
  });
});
