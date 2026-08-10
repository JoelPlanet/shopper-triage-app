import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const repoRoot = process.cwd();
const sourceDir = resolve(repoRoot, "Spec Assets");
const targetDir = resolve(repoRoot, "public", "Spec Assets");

if (!existsSync(sourceDir)) {
  throw new Error(`Source asset directory not found: ${sourceDir}`);
}

mkdirSync(resolve(repoRoot, "public"), { recursive: true });

// Recreate the target directory to prevent stale files from old asset revisions.
rmSync(targetDir, { recursive: true, force: true });
cpSync(sourceDir, targetDir, { recursive: true });

console.log(`Synced assets: ${sourceDir} -> ${targetDir}`);
