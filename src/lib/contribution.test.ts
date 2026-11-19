import { describe, expect, it } from "vitest";
import type { GameData } from "@/data/types";
import { validateContribution } from "./contribution";

const data: GameData = {
  version: "t",
  sample: true,
  updatedAt: "2026-11-19",
  sections: [],
  categories: [
    { id: "cascades", slug: "cascades", name: "Cascades", unit: "cascade", section: "activites", required: 3, total: 3, description: "", reliability: { status: "rumor" }, items: [] },
  ],
};

const form = (fields: Record<string, string>) => {
  const f = new FormData();
  for (const [k, v] of Object.entries(fields)) f.set(k, v);
  return f;
};

const valid = {
  kind: "emplacement",
  categoryId: "cascades",
  itemRef: "  Cascade   152 ",
  message: "Le saut est sur le toit du hangar bleu, côté mer.",
  sourceUrl: "https://example.com/video",
  pseudo: "Lucie",
  consent: "on",
};

describe("validateContribution", () => {
  it("accepte une contribution complète et nettoie les espaces", () => {
    const r = validateContribution(form(valid), data);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.itemRef).toBe("Cascade 152");
      expect(r.value.categoryId).toBe("cascades");
    }
  });

  it("accepte les champs facultatifs vides (null)", () => {
    const r = validateContribution(form({ kind: "autre", message: "Une idée pour le site, merci !", consent: "on" }), data);
    expect(r).toEqual({
      ok: true,
      value: { kind: "autre", categoryId: null, itemRef: null, message: "Une idée pour le site, merci !", sourceUrl: null, pseudo: null },
    });
  });

  it("refuse un message trop court ou trop long", () => {
    expect(validateContribution(form({ ...valid, message: "court" }), data).ok).toBe(false);
    expect(validateContribution(form({ ...valid, message: "x".repeat(1001) }), data).ok).toBe(false);
  });

  it("refuse un type, une catégorie ou un lien invalides", () => {
    const r = validateContribution(form({ ...valid, kind: "pub", categoryId: "inconnue", sourceUrl: "javascript:alert(1)" }), data);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errors).sort()).toEqual(["categoryId", "kind", "sourceUrl"]);
  });

  it("exige le consentement", () => {
    const r = validateContribution(form({ ...valid, consent: "" }), data);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.consent).toBeDefined();
  });

  it("repère le champ piège rempli par un robot", () => {
    const r = validateContribution(form({ ...valid, website: "http://spam.example" }), data);
    expect(r).toEqual({ ok: false, errors: {}, spam: true });
  });
});
