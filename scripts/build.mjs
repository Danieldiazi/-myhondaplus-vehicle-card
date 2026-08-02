import { copyFile, mkdir } from "node:fs/promises";

await mkdir("dist", { recursive: true });
await copyFile(
  "src/myhondaplus-vehicle-card.js",
  "dist/myhondaplus-vehicle-card.js",
);
console.log("Built dist/myhondaplus-vehicle-card.js");
