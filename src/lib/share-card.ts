"use client";

import { SITE_NAME } from "@/data/game";

/**
 * Carte de progression à partager (image 1080×1350), dessinée sur le
 * téléphone : aucun envoi au serveur, aucun visuel Rockstar.
 */
const C = {
  nuit: "#0d1222",
  sable: "#f4eee6",
  brume: "#a6aec6",
  rose: "#ff5c93",
  lagon: "#3de3d3",
};

const nf = new Intl.NumberFormat("fr-FR");

export type ShareStats = { percent: number; done: number; total: number };

function cssFont(variable: string, fallback: string) {
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim();
  return v ? `${v}, ${fallback}` : fallback;
}

export async function drawShareCard({
  percent,
  done,
  total,
}: ShareStats): Promise<Blob> {
  const W = 1080;
  const H = 1350;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas indisponible");

  const display = cssFont("--font-shoulders", '"Arial Narrow", sans-serif');
  const body = cssFont("--font-figtree", "system-ui, sans-serif");
  await Promise.all([
    document.fonts.load(`800 100px ${display}`),
    document.fonts.load(`600 40px ${body}`),
  ]).catch(() => undefined);

  ctx.fillStyle = C.nuit;
  ctx.fillRect(0, 0, W, H);

  // Marque
  ctx.fillStyle = C.rose;
  ctx.font = `800 64px ${display}`;
  ctx.textBaseline = "alphabetic";
  ctx.fillText(SITE_NAME, 80, 140);

  // Soleil à rayures, levé selon la progression
  const horizon = 640;
  const r = 230;
  const p = Math.min(100, Math.max(0, percent)) / 100;
  const cy = horizon + r - (40 + (2 * r - 40) * p);
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, W, horizon);
  ctx.clip();
  ctx.fillStyle = C.rose;
  ctx.beginPath();
  ctx.arc(W / 2, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = C.nuit;
  [
    [horizon - 130, 16],
    [horizon - 85, 22],
    [horizon - 40, 28],
  ].forEach(([y, h]) => ctx.fillRect(0, y, W, h));
  ctx.restore();
  ctx.strokeStyle = C.lagon;
  ctx.lineWidth = 6;
  [
    [0, W, 1],
    [180, W - 180, 0.6],
    [320, W - 320, 0.35],
  ].forEach(([x1, x2, a], i) => {
    ctx.globalAlpha = a;
    ctx.beginPath();
    ctx.moveTo(x1, horizon + i * 36);
    ctx.lineTo(x2, horizon + i * 36);
    ctx.stroke();
  });
  ctx.globalAlpha = 1;

  // Pourcentage
  ctx.fillStyle = C.sable;
  ctx.textAlign = "center";
  ctx.font = `800 330px ${display}`;
  ctx.fillText(`${percent} %`, W / 2, 1000);

  ctx.font = `600 52px ${body}`;
  ctx.fillText("de mon 100 % sur GTA 6", W / 2, 1080);
  ctx.fillStyle = C.brume;
  ctx.font = `500 38px ${body}`;
  ctx.fillText(
    `${nf.format(done)} objectifs sur ${nf.format(total)}`,
    W / 2,
    1140,
  );

  // Pied
  ctx.fillStyle = C.lagon;
  ctx.font = `700 40px ${body}`;
  ctx.fillText(window.location.host, W / 2, 1240);
  ctx.fillStyle = C.brume;
  ctx.font = `400 26px ${body}`;
  ctx.fillText(
    "Site non officiel, non affilié à Rockstar Games ni à Take-Two Interactive.",
    W / 2,
    1295,
  );

  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Image impossible"))),
      "image/png",
    ),
  );
}

export type ShareResult = "partage" | "telecharge" | "annule";

/**
 * Partage la carte : image + lien via le menu de partage du téléphone,
 * sinon lien seul, sinon téléchargement de l'image (ordinateur).
 */
export async function shareProgress(stats: ShareStats): Promise<ShareResult> {
  const url = window.location.origin;
  const text = `Je suis à ${stats.percent} % du 100 % de GTA 6. Tu en es où ? Suis ta progression sur ${SITE_NAME} :`;
  const blob = await drawShareCard(stats);
  const file = new File([blob], `platine-city-${stats.percent}.png`, {
    type: "image/png",
  });

  try {
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], text: `${text} ${url}` });
      return "partage";
    }
    if (navigator.share) {
      await navigator.share({ text, url });
      return "partage";
    }
  } catch (e) {
    if ((e as Error).name === "AbortError") return "annule";
  }

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = file.name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  return "telecharge";
}
