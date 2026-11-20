/**
 * Lit un lien YouTube collé tel quel (youtu.be, watch?v=, shorts, embed)
 * et en tire l'identifiant de la vidéo et le moment de départ en secondes.
 */
export type YouTubeRef = { id: string; start: number };

const ID = /^[A-Za-z0-9_-]{11}$/;

/** « 272 », « 272s », « 4m32s », « 1h2m3s » → secondes. */
export function parseTime(t: string | null | undefined): number {
  if (!t) return 0;
  if (/^\d+s?$/.test(t)) return parseInt(t, 10);
  const m = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(t);
  if (!m || !t) return 0;
  return +(m[1] ?? 0) * 3600 + +(m[2] ?? 0) * 60 + +(m[3] ?? 0);
}

export function parseYouTube(link: string): YouTubeRef | null {
  let url: URL;
  try {
    url = new URL(link.trim());
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^(www\.|m\.)/, "");
  let id: string | null = null;
  if (host === "youtu.be") id = url.pathname.slice(1);
  else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (url.pathname === "/watch") id = url.searchParams.get("v");
    else {
      const m = /^\/(?:shorts|embed|live)\/([^/]+)/.exec(url.pathname);
      id = m?.[1] ?? null;
    }
  }
  if (!id || !ID.test(id)) return null;
  const start = parseTime(
    url.searchParams.get("t") ?? url.searchParams.get("start"),
  );
  return { id, start };
}

/** « 4:32 » pour l'affichage. */
export function formatTime(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${sec}` : `${m}:${sec}`;
}
