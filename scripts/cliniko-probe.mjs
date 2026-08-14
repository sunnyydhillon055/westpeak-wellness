/* The doctor said both confirmation gates are open, so the next question is
 * whether Cliniko actually sent anything -- and if it did, what the message
 * looked like.
 *
 * Read only. Probes a few endpoints and reports what comes back rather than
 * asserting a shape, because the Cliniko API surface here is not well
 * documented and a confident guess would be worse than raw output.
 */

const key = (process.env.CLINIKO_API_KEY || '').trim();
if (!key) { console.error('CLINIKO_API_KEY not set'); process.exit(1); }
const shard = (key.match(/-([a-z]{2}\d)$/i) || [])[1];
const auth = 'Basic ' + Buffer.from(`${key}:`).toString('base64');
const base = `https://api.${shard}.cliniko.com/v1`;

async function get(path) {
  const res = await fetch(`${base}${path}`, {
    headers: {
      Authorization: auth, Accept: 'application/json',
      'User-Agent': 'Westpeak Wellness probe (info@westpeakwellness.com)',
    },
  });
  return { status: res.status, body: res.ok ? await res.json() : (await res.text()).slice(0, 160) };
}

/* 1. The template that every appointment type points at. If it is linked but
 *    empty or disabled, the effect is identical to having none. */
console.log('\n  CONFIRMATION TEMPLATE 1466854655823711118');
for (const p of [
  '/appointment_confirmation_templates/1466854655823711118',
  '/communication_templates/1466854655823711118',
]) {
  const r = await get(p);
  console.log(`   ${String(r.status).padEnd(4)} ${p}`);
  if (r.status === 200) {
    const t = r.body.appointment_confirmation_template || r.body.communication_template || r.body;
    for (const [k, v] of Object.entries(t)) {
      if (typeof v === 'object' && v !== null) continue;
      const s = String(v ?? '');
      console.log(`         ${k.padEnd(28)} ${s.length > 90 ? s.slice(0, 90) + '…' : s}`);
    }
  }
}

/* 2. Did anything actually go out? A communications log is the only direct
 *    evidence; everything else is inference. */
console.log('\n  RECENT COMMUNICATIONS');
for (const p of ['/communications?per_page=10&sort=created_at:desc', '/patient_cases?per_page=1']) {
  const r = await get(p);
  console.log(`   ${String(r.status).padEnd(4)} ${p}`);
  if (r.status === 200 && r.body.communications) {
    const c = r.body.communications;
    console.log(`         ${r.body.total_entries ?? c.length} total`);
    for (const m of c.slice(0, 8)) {
      console.log(`         ${String(m.created_at || '').slice(0, 16)}  ${String(m.type || m.subject || '?').slice(0, 46)}`);
    }
  } else if (r.status === 200) {
    console.log(`         keys: ${Object.keys(r.body).join(', ')}`);
  }
}

/* 3. Recent appointments -- Cliniko stamps confirmation/reminder state on the
 *    appointment itself, which tells us per-booking whether mail was attempted. */
console.log('\n  RECENT APPOINTMENTS (confirmation-related fields)');
const appts = await get('/appointments?per_page=6&sort=created_at:desc');
if (appts.status === 200) {
  for (const a of appts.body.appointments || []) {
    const fields = Object.entries(a)
      .filter(([k]) => /confirm|remind|email|notif/i.test(k))
      .map(([k, v]) => `${k}=${JSON.stringify(v)}`);
    console.log(`   ${String(a.created_at || '').slice(0, 16)}  ${fields.join('  ') || '(no confirmation fields)'}`);
  }
} else {
  console.log(`   ${appts.status} ${JSON.stringify(appts.body).slice(0, 140)}`);
}

/* 4. Practice-level sender. A linked template still sends nothing if the
 *    practice has no verified reply-to / sender configured. */
console.log('\n  PRACTICE / SENDER');
const pr = await get('/practices');
if (pr.status === 200) {
  for (const p of pr.body.practices || []) {
    for (const [k, v] of Object.entries(p)) {
      if (typeof v === 'object' && v !== null) continue;
      if (!/mail|email|name|reply|time_zone|country/i.test(k)) continue;
      console.log(`   ${k.padEnd(28)} ${String(v ?? '')}`);
    }
  }
} else {
  console.log(`   ${pr.status}`);
}
console.log('');
