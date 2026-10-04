import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { parseCsv } from '../scripts/lib/query-topics.mjs';
import { exportsByDate, summarise, adminLine } from '../scripts/lib/bing-ai-core.mjs';

/* COPILOT CITATIONS ON /admin — 3 Oct 2026.
 *
 * One line from the newest Bing AI Performance export in data/bing/, against
 * the one before it. The summary is the same code scripts/bing-ai.mjs prints,
 * so the two cannot disagree. A missing or unreadable folder reads "no Bing
 * export yet", never zero citations. Server only: /admin is a server
 * component and nothing here reaches the browser. */

export function bingAiLine(dir = join(process.cwd(), 'data', 'bing')): string {
  let files: string[] = [];
  try {
    files = readdirSync(dir);
  } catch {
    return adminLine(null, null) as string;
  }
  const dates = exportsByDate(files) as { date: string; files: string[] }[];
  if (!dates.length) return adminLine(null, null) as string;
  const load = (d: { date: string; files: string[] }) =>
    summarise(d.date, d.files.map((name) => ({ name, rows: parseCsv(readFileSync(join(dir, name), 'utf8')) })));
  try {
    const latest = load(dates[dates.length - 1]!);
    const previous = dates.length > 1 ? load(dates[dates.length - 2]!) : null;
    return adminLine(latest, previous) as string;
  } catch {
    return 'Copilot citations, 7 days: the Bing export could not be read.';
  }
}
