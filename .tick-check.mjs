import { readFileSync } from 'node:fs';
import { get, list } from '@vercel/blob';
for (const line of readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  const m = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
  if (m) process.env[m[1]] = m[2].replace(/^"|"$/g, '');
}
const wait = Date.parse('2026-09-17T18:02:00Z') - Date.now();
if (wait > 0) await new Promise((r) => setTimeout(r, wait));
const found = await list({ prefix: 'ops/cron/', limit: 100 });
console.log('per-job files after the 18:00 UTC tick:', found.blobs.length);
for (const b of found.blobs) {
  const hit = await get(b.pathname, { access: 'private', useCache: false });
  const run = await new Response(hit.stream).json();
  const age = ((Date.now() - Date.parse(run.at)) / 60000).toFixed(0);
  console.log(` ${run.job.padEnd(24)} ${run.at}  ${age} min ago  ok=${run.ok}  ${run.detail}`);
}
