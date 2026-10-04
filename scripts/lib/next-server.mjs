/* BOOT THE BUILT SITE, ASK IT FOR PAGES, TAKE IT DOWN AGAIN — 4 Oct 2026.
 *
 * Moved here out of scripts/smoke.mjs so the page scorer (scripts/page-score.mjs)
 * can fetch the routes that have no HTML on disk (/book, /contact, /refer)
 * with exactly the server handling smoke has already been burnt by. The
 * reasons for each step are smoke's, and stay with the code:
 *
 *   - a busy port is a hard stop. On 31 Aug 2026 a `next start` from an
 *     earlier run still held 3123 and every local smoke run checked a build
 *     several commits old. A green result against a server this process did
 *     not start describes that server, not this build.
 *   - the busy-port probe is a raw socket, not fetch: process.exit() while an
 *     undici request is tearing down trips a libuv assertion on Windows.
 *   - `detached` on POSIX gives the server its own process group, so the npx
 *     grandchild dies with it; on Windows `taskkill /T` takes the tree. A
 *     leaked grandchild holds the port and the pipes, and the run never ends.
 *   - wait for the server by asking it (robots.txt), never by a fixed sleep.
 */
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import net from 'node:net';

/** True when something already answers on the port. */
export const portBusy = (port) =>
  new Promise((resolve) => {
    const sock = net.connect({ port: Number(port), host: '127.0.0.1' });
    const done = (v) => { sock.destroy(); resolve(v); };
    sock.once('connect', () => done(true));
    sock.once('error', () => done(false));
    sock.setTimeout(1500, () => done(false));
  });

/**
 * Start `next start -p <port>` against the existing build and wait for it.
 * Resolves { base, stop, output } once it answers, or { error, stop, output }
 * when the port is taken or the server never comes up. The caller decides
 * what a failure means; this never exits the process.
 */
export async function bootNext({ port, waitSeconds = 60, cwd = process.cwd() } = {}) {
  const base = `http://127.0.0.1:${port}`;
  const noop = () => {};
  if (await portBusy(port)) {
    return { error: `Port ${port} is already in use by something this script did not start.`, stop: noop, output: () => '' };
  }
  const isWin = process.platform === 'win32';
  const server = spawn('npx', ['next', 'start', '-p', String(port)], {
    cwd,
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: isWin,
    detached: !isWin,
  });
  let out = '';
  server.stdout.on('data', (d) => { out += d; });
  server.stderr.on('data', (d) => { out += d; });

  let stopped = false;
  const stop = () => {
    if (stopped) return;
    stopped = true;
    try {
      if (!isWin && server.pid) process.kill(-server.pid, 'SIGTERM');
      else if (isWin && server.pid) spawn('taskkill', ['/pid', String(server.pid), '/T', '/F'], { stdio: 'ignore' });
      else server.kill();
    } catch { /* already gone */ }
    try { server.stdout?.destroy(); server.stderr?.destroy(); } catch { /* fine */ }
  };
  process.on('exit', stop);

  for (let i = 0; i < waitSeconds; i++) {
    await sleep(1000);
    try {
      const r = await fetch(`${base}/robots.txt`, { redirect: 'manual' });
      if (r.status) return { base, stop, output: () => out };
    } catch { /* not listening yet */ }
  }
  stop();
  return { error: `server did not come up within ${waitSeconds}s`, stop, output: () => out };
}
