import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(currentDir, "..");
const distDir = path.join(rootDir, "dist");
const umdSource = path.join(distDir, "zbt-accessibility.umd.js");
const legacySource = path.join(distDir, "zbt.min.js");

if (!fs.existsSync(umdSource) || !fs.existsSync(legacySource)) {
  throw new Error(
    "Missing build artifacts. Run `npm run build` before `npm run build:worker`."
  );
}

const filesToCopy = [
  {
    source: umdSource,
    target: path.join(rootDir, "worker", "public", "assets", "zbt-accessibility.umd.js")
  },
  {
    source: legacySource,
    target: path.join(rootDir, "worker", "public", "dist", "zbt.min.js")
  }
];

filesToCopy.forEach(({ source, target }) => {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
  console.log(`Copied ${source} to ${target}`);
});
