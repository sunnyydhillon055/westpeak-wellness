/* THE SNIPPET LEDGER AND THE SNAPSHOT GUARD — 16 Oct 2026 (item 567).
 *
 * data/gsc/snippets.json holds dated snapshots of every built title and
 * description, and since 3 Oct a 'title-changes' ledger. On 16 Oct the
 * 2026-10-14 and 2026-10-15 snapshots turned out to have been taken from a
 * build older than the code: 28 of 418 titles differed from the build, and
 * 23 ledger pages still showed their pre-13-Oct titles, while browser checks
 * of production matched the build. Pages changed 13-15 Oct carry most of the
 * click shortfall being measured, so a stale baseline misreads the whole
 * experiment. These helpers let scripts/ctr-delta.mjs refuse a stale
 * snapshot, skip the ones marked pre-deploy, and read rewrites from the
 * ledger. Pure, so test/snippet-ledger.test.mts runs them on fixtures.
 *
 * Ledger rows: { date, path, item, field: 'title' | 'desc', before, after }.
 * A row with no field is a title (every row before 16 Oct was). */

export const LEDGER_KEY = 'title-changes';
export const NOTES_KEY = 'snapshot-notes';

/** True for a snapshot key ("2026-10-16"), false for the ledger and notes. */
export const isSnapshotKey = (k) => /^\d{4}-\d{2}-\d{2}$/.test(k);

/** Snapshot keys usable as a baseline: dated, and not noted as pre-deploy. */
export function usableSnapshotKeys(store) {
  const notes = store?.[NOTES_KEY] ?? {};
  return Object.keys(store ?? {})
    .filter(isSnapshotKey)
    .filter((k) => !/^pre-deploy\b/i.test(String(notes[k] ?? '')))
    .sort();
}

/** The handful of entities Next writes into <title> and the description. */
export function decodeEntities(s) {
  return String(s ?? '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

/** The field a ledger row records. */
export const fieldOf = (row) => (row?.field === 'desc' ? 'desc' : 'title');

/** The latest 'after' per path for one field; a later row wins a tie. */
export function latestAfters(ledger, field = 'title') {
  const out = new Map();
  const rows = (ledger ?? []).map((r, i) => ({ r, i })).filter(({ r }) => fieldOf(r) === field);
  rows.sort((a, b) => (a.r.date === b.r.date ? a.i - b.i : a.r.date < b.r.date ? -1 : 1));
  for (const { r } of rows) out.set(r.path, r.after);
  return out;
}

/** Ledger titles the build disagrees with: [{ path, built, ledger }]. A path
 *  the build does not have is reported too, as built: null. */
export function ledgerMismatches(built, ledger) {
  const bad = [];
  for (const [path, after] of latestAfters(ledger, 'title')) {
    const b = built[path];
    if (!b) { bad.push({ path, built: null, ledger: after }); continue; }
    if (decodeEntities(b.title) !== decodeEntities(after)) bad.push({ path, built: b.title, ledger: after });
  }
  return bad;
}

/** True when the build predates the commit it should reflect. Both in ms. */
export const buildIsStale = (buildMs, headMs) => Number.isFinite(buildMs) && Number.isFinite(headMs) && buildMs < headMs;

/** Whether the ledger records a change to `path` after `from` and on or
 *  before `to` (ISO dates). */
export function ledgerChanged(ledger, path, from, to) {
  return (ledger ?? []).some((r) => r.path === path && r.date > from && r.date <= to);
}
