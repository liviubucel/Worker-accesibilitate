import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(currentDir, "..");
const filesToCopy = [
  {
    source: path.join(rootDir, "dist", "zbt-accessibility.umd.js"),
    target: path.join(rootDir, "worker", "public", "assets", "zbt-accessibility.umd.js")
  },
  {
    source: path.join(rootDir, "dist", "zbt.min.js"),
    target: path.join(rootDir, "worker", "public", "dist", "zbt.min.js")
  }
];

filesToCopy.forEach(({ source, target }) => {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
  console.log(`Copied ${source} to ${target}`);
});
