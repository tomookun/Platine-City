// Génère les icônes PWA à partir de scripts/icon.svg : node scripts/make-icons.mjs
import sharp from "sharp";
import { readFile } from "node:fs/promises";

const svg = await readFile(new URL("./icon.svg", import.meta.url));
for (const size of [192, 512]) {
  await sharp(svg).resize(size, size).png().toFile(`public/icon-${size}.png`);
}
await sharp(svg).resize(180, 180).png().toFile("src/app/apple-icon.png");
await sharp(svg).resize(48, 48).png().toFile("src/app/icon.png");
console.log("icônes générées");
