import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parseYouTube } from "@/lib/youtube";
import { details } from "./details";
import { game } from "./game";

/** Garde-fou pour les saisies à la main dans details.ts. */
describe("details.ts", () => {
  const itemIds = new Set(game.categories.flatMap((c) => c.items.map((i) => i.id)));

  it("ne vise que des objets qui existent", () => {
    const unknown = Object.keys(details).filter((id) => !itemIds.has(id));
    expect(unknown).toEqual([]);
  });

  it("n'a que des liens YouTube lisibles, des photos présentes et des crédits", () => {
    for (const [id, d] of Object.entries(details)) {
      for (const m of d.media ?? []) {
        expect(m.credit, `crédit manquant pour ${id}`).not.toBe("");
        if ("youtube" in m) expect(parseYouTube(m.youtube), `lien illisible pour ${id}`).not.toBeNull();
        else {
          expect(m.image.startsWith("/photos/"), `photo hors de /photos pour ${id}`).toBe(true);
          expect(existsSync(join(process.cwd(), "public", m.image)), `photo absente : ${m.image}`).toBe(true);
          expect(m.alt.length, `texte alternatif manquant pour ${id}`).toBeGreaterThan(5);
        }
      }
    }
  });
});
