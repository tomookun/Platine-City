import { describe, expect, it } from "vitest";
import { alternates } from "./alternates";
import { parsePath, switchPath } from "./switch-path";

describe("changement de langue", () => {
  it("passe d'une page à son équivalent dans l'autre langue", () => {
    expect(switchPath("/", "en")).toBe("/en");
    expect(switchPath("/en", "fr")).toBe("/");
    expect(switchPath("/gta-6", "en")).toBe("/en/gta-6");
    expect(switchPath("/gta-6/flamants-cocaine", "en")).toBe(
      "/en/gta-6/cocaine-flamingos",
    );
    expect(switchPath("/en/gta-6/cocaine-flamingos", "fr")).toBe(
      "/gta-6/flamants-cocaine",
    );
    expect(switchPath("/nouveautes", "en")).toBe("/en/news");
    expect(switchPath("/en/contribute", "fr")).toBe("/contribuer");
    expect(switchPath("/guides/installer-application-hors-ligne", "en")).toBe(
      "/en/guides/install-app-offline",
    );
  });

  it("renvoie à l'accueil pour une adresse inconnue", () => {
    expect(parsePath("/n-importe-quoi")).toBeNull();
    expect(switchPath("/n-importe-quoi", "en")).toBe("/en");
  });

  it("déclare les liens hreflang des deux langues", () => {
    expect(alternates({ page: "category", id: "flamants" }, "en")).toEqual({
      canonical: "/en/gta-6/cocaine-flamingos",
      languages: {
        fr: "/gta-6/flamants-cocaine",
        en: "/en/gta-6/cocaine-flamingos",
        "x-default": "/gta-6/flamants-cocaine",
      },
    });
  });
});
