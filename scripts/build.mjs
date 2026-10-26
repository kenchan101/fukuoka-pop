import { build } from "esbuild";
import { cp, mkdir, readFile, writeFile, rm, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const dist = path.join(root, "dist");

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await mkdir(path.join(dist, "icons"), { recursive: true });

const result = await build({
  entryPoints: [path.join(root, "src/main.js")],
  bundle: true,
  minify: true,
  format: "iife",
  target: ["es2020"],
  outfile: path.join(dist, "app.js"),
  legalComments: "none",
  sourcemap: false,
  logLevel: "info",
});

for (const file of ["index.html", "manifest.webmanifest", "sw.js"]) {
  if (existsSync(path.join(root, file))) {
    await cp(path.join(root, file), path.join(dist, file));
  }
}

const css = await readFile(path.join(root, "src/styles.css"), "utf8");
await writeFile(path.join(dist, "styles.css"), css, "utf8");

for (const iconFile of ["icon-192.png", "icon-512.png", "apple-touch-icon.png"]) {
  if (existsSync(path.join(root, "assets", iconFile))) {
    await cp(path.join(root, "assets", iconFile), path.join(dist, "icons", iconFile));
  }
}

await mkdir(path.join(dist, "fonts"), { recursive: true });
for (const fontFile of ["fukuoka-rounded.woff2", "OFL.txt"]) {
  if (existsSync(path.join(root, "assets", "fonts", fontFile))) {
    await cp(path.join(root, "assets", "fonts", fontFile), path.join(dist, "fonts", fontFile));
  }
}

const appStat = await stat(path.join(dist, "app.js"));
console.log(`built dist/app.js (${(appStat.size / 1024).toFixed(1)} kB)`);
