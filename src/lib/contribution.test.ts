import { describe, expect, it } from "vitest";
import type { GameData } from "@/data/types";
import { PHOTO_MAX_BYTES, checkPhoto, validateContribution } from "./contribution";

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

describe("checkPhoto", () => {
  const pad = (head: number[]) => new Uint8Array([...head, ...new Array(20).fill(0)]);

  it("reconnaît JPG, PNG et WebP d'après leur contenu", () => {
    expect(checkPhoto(pad([0xff, 0xd8, 0xff, 0xe0]))).toMatchObject({ ok: true, ext: "jpg" });
    expect(checkPhoto(pad([0x89, 0x50, 0x4e, 0x47]))).toMatchObject({ ok: true, ext: "png" });
    const webp = pad([0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50]);
    expect(checkPhoto(webp)).toMatchObject({ ok: true, ext: "webp" });
  });

  it("refuse un faux fichier image, un fichier vide ou trop lourd", () => {
    expect(checkPhoto(new TextEncoder().encode("<svg onload=alert(1)>                "))).toMatchObject({ ok: false });
    expect(checkPhoto(new Uint8Array())).toMatchObject({ ok: false });
    const big = new Uint8Array(PHOTO_MAX_BYTES + 1);
    big.set([0xff, 0xd8, 0xff]);
    expect(checkPhoto(big)).toMatchObject({ ok: false });
  });
});
