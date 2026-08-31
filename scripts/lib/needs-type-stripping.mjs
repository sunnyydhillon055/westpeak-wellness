/**
 * Guard for gates that import TypeScript directly.
 *
 * WHY THIS EXISTS
 *
 * scripts/triage-guard.mjs and scripts/booking-mapping.mjs load .ts modules so
 * they can exercise the real code rather than a copy of it. That needs Node's
 * type stripping — 22.6+ behind `--experimental-strip-types`, native from 23.
 *
 * On 30 Aug 2026 CI was pinned to Node 20 while those two gates were added.
 * Node 20 does not merely ignore the flag; it does not recognise it, so the
 * process exits with `bad option: --experimental-strip-types` before a line
 * runs. `npm run verify:ci` went red on three consecutive pushes and the error
 * said nothing about TypeScript, Node versions, or which gate was at fault.
 *
 * It was invisible locally because the machine ran Node 24, which strips types
 * with no flag at all — the gates passed every time they were tested.
 *
 * This turns that into a sentence. It cannot prevent the `bad option` exit,
 * which happens before any JavaScript executes, but it catches every other
 * shape of the same problem: a runtime that parses the flag but cannot strip
 * types, or a future change that drops support.
 */

export function needsTypeStripping(scriptName) {
  const [major, minor] = process.versions.node.split('.').map(Number);
  const ok = major > 22 || (major === 22 && minor >= 6);
  if (ok) return;

  console.log(`
  ${scriptName} needs Node 22.6 or newer.

  This gate imports TypeScript directly so it tests the real module instead of
  a copy that can drift. Node ${process.versions.node} cannot strip types.

  The version lives in .nvmrc and package.json "engines". CI reads .nvmrc via
  actions/setup-node's node-version-file, so bump it in one place.
`);
  process.exit(1);
}
