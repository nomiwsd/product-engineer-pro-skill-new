// Loads evaluation cases and benchmark tasks, expanding task variants into separate items.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const BENCH = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const REPO = resolve(BENCH, "..");

export function loadItems() {
  const items = [];
  for (const kind of ["cases", "tasks"]) {
    for (const id of readdirSync(join(BENCH, kind)).sort()) {
      const file = join(BENCH, kind, id, "case.json");
      if (!existsSync(file)) continue;
      const definition = JSON.parse(readFileSync(file, "utf8"));
      const variants = definition.variants ?? [{ fixture: definition.fixture, checks: definition.checks }];
      for (const variant of variants) {
        items.push({ ...definition, ...variant, variants: undefined, id: definition.variants ? `${id}@${variant.fixture}` : id, dir: join(BENCH, kind, id), kind });
      }
    }
  }
  return items;
}

export const workdirFor = (stamp, id, condition, repeat) => join(BENCH, "results", "work", stamp, id.replace("@", "__"), `${condition}-${repeat}`);

// Replaces local absolute paths in published results with neutral placeholders.
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const variants = (path) => [path, path.replace(/\\/g, "/"), path.replace(/\\/g, "\\\\")];
export function scrub(text, home = process.env.USERPROFILE ?? process.env.HOME ?? "") {
  let out = text;
  for (const [path, label] of [[REPO, "<repo>"], [home, "<home>"]]) {
    if (!path) continue;
    for (const form of variants(path)) out = out.replace(new RegExp(escapeRegex(form), "gi"), label);
  }
  // Truncated details can cut a path short of a full match; drop any remaining absolute path.
  return out
    .replace(/file:\/\/\/[A-Za-z]:\/[^\s"'`)]*/g, "<path>")
    .replace(/\b[A-Za-z]:(?:\\\\|\\|\/)[^\s"'`)<>|]*/g, "<path>");
}
