#!/usr/bin/env node
/* Run a gate, and treat one nominated exit code as "could not check" rather
 * than "failed".
 *
 * WHY THIS EXISTS
 *
 * price-drift.mjs distinguishes two outcomes on purpose: exit 1 means a
 * published fee disagrees with Cliniko, exit 2 means CLINIKO_API_KEY was not
 * set so nothing could be compared. That distinction is worth keeping — a gate
 * that reports success when it could not run is the failure mode this
 * repository has a file of lessons about.
 *
 * But `&&` in an npm script treats every non-zero the same, so adding
 * price-drift to verify:ci made every local run fail, where the key is
 * deliberately absent. Flattening the script's exit codes would have destroyed
 * the distinction to fix the chaining.
 *
 * So the chain tolerates the "could not check" code and says so loudly, and a
 * real drift still fails the build. In CI, where the key is set, neither branch
 * applies and the gate simply runs.
 *
 *   node scripts/soft-gate.mjs 2 npm run price-drift
 */
import { spawnSync } from 'node:child_process';

const [tolerated, cmd, ...args] = process.argv.slice(2);
if (!cmd) {
  console.error('usage: soft-gate <tolerated-exit-code> <command> [args...]');
  process.exit(1);
}

const r = spawnSync(cmd, args, { stdio: 'inherit', shell: true });
const code = r.status ?? 1;

if (code === Number(tolerated)) {
  console.log(`\n  soft-gate: "${cmd} ${args.join(' ')}" exited ${code} — could not check, not a failure.`);
  console.log('  This is tolerated here and nowhere else. A real failure still stops the build.\n');
  process.exit(0);
}
process.exit(code);
