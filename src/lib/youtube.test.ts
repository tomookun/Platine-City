import { describe, expect, it } from "vitest";
import { formatTime, parseTime, parseYouTube } from "./youtube";

describe("parseYouTube", () => {
  it("lit les formats de lien courants", () => {
    expect(parseYouTube("https://youtu.be/dQw4w9WgXcQ?t=272")).toEqual({ id: "dQw4w9WgXcQ", start: 272 });
    expect(parseYouTube("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=4m32s")).toEqual({ id: "dQw4w9WgXcQ", start: 272 });
    expect(parseYouTube("https://m.youtube.com/shorts/dQw4w9WgXcQ")).toEqual({ id: "dQw4w9WgXcQ", start: 0 });
    expect(parseYouTube("https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?start=90")).toEqual({ id: "dQw4w9WgXcQ", start: 90 });
  });

  it("refuse ce qui n'est pas une vidéo YouTube", () => {
    expect(parseYouTube("https://vimeo.com/123")).toBeNull();
    expect(parseYouTube("https://youtube.com/watch?v=court")).toBeNull();
    expect(parseYouTube("pas un lien")).toBeNull();
  });
});

describe("temps", () => {
  it("convertit les formats de temps", () => {
    expect(parseTime("90")).toBe(90);
    expect(parseTime("1h2m3s")).toBe(3723);
    expect(parseTime("")).toBe(0);
    expect(formatTime(272)).toBe("4:32");
    expect(formatTime(3723)).toBe("1:02:03");
  });
});
