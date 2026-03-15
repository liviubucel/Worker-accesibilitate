import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(currentDir, "..");
const sourceFile = path.join(rootDir, "dist", "zbt-accessibility.umd.js");
const targetDir = path.join(rootDir, "worker", "public", "assets");
const targetFile = path.join(targetDir, "zbt-accessibility.umd.js");

fs.mkdirSync(targetDir, { recursive: true });
fs.copyFileSync(sourceFile, targetFile);

console.log(`Copied ${sourceFile} to ${targetFile}`);
