import fs from "fs";
import path from "path";
import type { Build } from "./types";

const DATA_FILE = path.join(process.cwd(), "data", "builds.json");

export function readBuilds(): Build[] {
  const raw = fs.readFileSync(DATA_FILE, "utf8");
  return JSON.parse(raw) as Build[];
}

export function writeBuilds(builds: Build[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(builds, null, 2), "utf8");
}

export function getBuild(id: string): Build | undefined {
  return readBuilds().find((b) => b.id === id);
}

export function addBuild(build: Build): void {
  const builds = readBuilds();
  builds.unshift(build);
  writeBuilds(builds);
}
