import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

/**
 * Sitemap `<lastmod>` source for content pages.
 *
 * Mirrors `src/pages/[...slug].astro`, which resolves each page's date as
 * `entry.data.lastUpdated ?? getLastUpdated(entry)` — frontmatter wins,
 * git last-commit time is the fallback. We rebuild that mapping here so the
 * sitemap and the page/JSON-LD `<dateModified>` agree.
 *
 * URLs that don't map to a `src/content/docs` file (404, `/llms.txt`, etc.)
 * get no `lastmod` — we never fabricate a build time.
 */

/** Mirrors Nimbus's own `SitemapOptions.serialize` item shape. */
type SitemapItem = {
  url: string;
  lastmod?: string;
  changefreq?:
    "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
  links?: { lang: string; url: string }[];
};

// Relative to the project root so the paths line up with `git log --relative`
// output (which is what Nimbus's `getLastUpdated` keys on).
const CONTENT_DIR = path.join("src", "content", "docs");
const CONTENT_PATHSPEC = "src/content";

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
    } else if (entry.name.endsWith(".mdx") || entry.name.endsWith(".md")) {
      out.push(full);
    }
  }
  return out;
}

/** `src/content/docs/features/serve.mdx` → `/features/serve/`; `index.mdx` → `/`. */
function filePathToUrlPath(filePath: string): string {
  const rel = path
    .relative(CONTENT_DIR, filePath)
    .replace(/\.(mdx|md)$/, "")
    .replace(/\\/g, "/");
  if (rel === "index") return "/";
  if (rel.endsWith("/index")) return `/${rel.slice(0, -"/index".length)}/`;
  return `/${rel}/`;
}

/**
 * Git last-commit time per file, with the same `git log` semantics as
 * Nimbus (`_internal/git-last-updated.ts`): newest-first walk, first
 * occurrence wins, author timestamp.
 */
function buildGitLastUpdated(): Map<string, Date> {
  const map = new Map<string, Date>();
  let stdout: string;
  try {
    stdout = execFileSync(
      "git",
      [
        "-c",
        "core.quotePath=false",
        "log",
        "--format=t:%at",
        "--name-status",
        "--relative",
        "--",
        CONTENT_PATHSPEC,
      ],
      { encoding: "utf8", windowsHide: true, maxBuffer: 64 * 1024 * 1024 }
    );
  } catch {
    // No .git (or shallow clone without history) → no dates.
    return map;
  }

  let currentMs: number | null = null;
  for (const raw of stdout.split("\n")) {
    const line = raw.endsWith("\r") ? raw.slice(0, -1) : raw;
    if (line.startsWith("t:")) {
      const sec = Number(line.slice(2));
      currentMs = Number.isFinite(sec) ? sec * 1e3 : null;
      continue;
    }
    if (currentMs === null) continue;
    const tab = line.lastIndexOf("\t");
    if (tab === -1) continue;
    const filePath = line.slice(tab + 1);
    if (filePath && !map.has(filePath)) map.set(filePath, new Date(currentMs));
  }
  return map;
}

/** Frontmatter `lastUpdated` (a date scalar), parsed minimally to avoid a YAML dep. */
function readFrontmatterLastUpdated(filePath: string): Date | undefined {
  let raw: string;
  try {
    raw = readFileSync(filePath, "utf8");
  } catch {
    return undefined;
  }
  if (!raw.startsWith("---")) return undefined;
  const end = raw.indexOf("\n---", 3);
  if (end === -1) return undefined;
  const fm = raw.slice(4, end);
  const m = /^lastUpdated:\s*(.+)$/m.exec(fm);
  if (!m) return undefined;
  let value = m[1].trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function urlPathname(url: string): string {
  try {
    return decodeURI(new URL(url).pathname);
  } catch {
    return new URL(url).pathname;
  }
}

/**
 * Build the `serialize` callback for `@astrojs/sitemap` (via Nimbus's
 * `sitemap` option). Precomputes the URL→file map and git index once.
 */
export function createSitemapSerialize() {
  const urlToFile = new Map<string, string>();
  for (const filePath of walk(CONTENT_DIR)) {
    urlToFile.set(filePathToUrlPath(filePath), filePath);
  }
  const git = buildGitLastUpdated();

  return (item: SitemapItem): SitemapItem => {
    const filePath = urlToFile.get(urlPathname(item.url));
    if (!filePath) return item; // not a content page — leave untouched
    const date = readFrontmatterLastUpdated(filePath) ?? git.get(filePath);
    return date ? { ...item, lastmod: date.toISOString() } : item;
  };
}
