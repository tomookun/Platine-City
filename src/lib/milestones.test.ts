import { describe, expect, it } from "vitest";
import { celebrate, milestoneToCelebrate, parseCelebrated, reached } from "./milestones";

describe("paliers", () => {
  it("liste les paliers atteints", () => {
    expect(reached(0)).toEqual([]);
    expect(reached(24)).toEqual([]);
    expect(reached(50)).toEqual([25, 50]);
    expect(reached(100)).toEqual([25, 50, 75, 100]);
  });

  it("fête le palier franchi une seule fois", () => {
    expect(milestoneToCelebrate(26, [])).toBe(25);
    const c = celebrate([], 25);
    expect(milestoneToCelebrate(30, c)).toBeNull();
    // Redescendre puis remonter ne refait pas la fête.
    expect(milestoneToCelebrate(25, c)).toBeNull();
  });

  it("ne fête que le plus haut si plusieurs sont franchis d'un coup", () => {
    expect(milestoneToCelebrate(80, [])).toBe(75);
    expect(celebrate([], 75)).toEqual([25, 50, 75]);
    expect(milestoneToCelebrate(100, celebrate([], 75))).toBe(100);
  });

  it("relit une valeur stockée et ignore le reste", () => {
    expect(parseCelebrated("[25, 50, 33]")).toEqual([25, 50]);
    expect(parseCelebrated("oups")).toBeNull();
    expect(parseCelebrated(null)).toBeNull();
  });
});
