/* Why did a client not get a confirmation email?
 *
 * Two separate reports came in: clients not receiving booking confirmations,
 * and existing Cliniko patients unable to use the portal. Both have the same
 * shape -- something that is configured in a place nobody can see, failing
 * silently. This makes both visible.
 *
 * Cliniko needs TWO gates open for a confirmation email to send:
 *
 *   1. The APPOINTMENT TYPE has a confirmation template linked. If it is set
 *      to "None", nothing sends -- and per Cliniko's own documentation this
 *      overrides the patient's setting entirely.
 *   2. The PATIENT has receives_confirmation_emails = true.
 *
 * Gate 1 is the usual culprit because it is per-appointment-type, so adding a
 * new service silently ships with confirmations off.
 *
 * Reads only. Nothing here writes to Cliniko.
 *
 *   CLINIKO_API_KEY=... node scripts/cliniko-doctor.mjs
 */

const key = (process.env.CLINIKO_API_KEY || '').trim();

if (!key) {
  console.error(`
  CLINIKO_API_KEY is not set in this shell.

  This is very likely the whole problem in production too. When the key is
  absent, lib/portal-store.ts isClientAllowed() falls through to returning
  false, so an existing Cliniko patient is refused -- with no error anywhere,
  because "not a client" is a legitimate answer.

  Check it in Vercel:   vercel env ls
  Then re-run:          CLINIKO_API_KEY=... node scripts/cliniko-doctor.mjs
`);
  process.exit(1);
}

/* The shard is the suffix on the key: ...-ca1 means the Canadian shard, and
 * the request 404s or 401s against any other. */
const shard = (key.match(/-([a-z]{2}\d)$/i) || [])[1];
if (!shard) {
  console.error(`  Key has no shard suffix (expected something like "-ca1"). Cannot build a URL.`);
  process.exit(1);
}

const auth = 'Basic ' + Buffer.from(`${key}:`).toString('base64');
const base = `https://api.${shard}.cliniko.com/v1`;

async function get(path) {
  const res = await fetch(`${base}${path}`, {
    headers: {
      Authorization: auth,
      Accept: 'application/json',
      'User-Agent': 'Westpeak Wellness doctor (info@westpeakwellness.com)',
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} on ${path}: ${(await res.text()).slice(0, 200)}`);
  return res.json();
}

const ok = (b) => (b ? '  ok  ' : ' FAIL ');

console.log(`\n  Cliniko shard: ${shard}\n  ${'='.repeat(72)}`);

/* ---- 1. Appointment types: is a confirmation template attached? ---------- */
let types = [];
try {
  const body = await get('/appointment_types?per_page=100');
  types = body.appointment_types || [];
} catch (e) {
  console.error(`  Could not read appointment types: ${e.message}`);
  process.exit(1);
}

console.log(`\n  APPOINTMENT TYPES (${types.length})`);
console.log(`  Gate 1 -- a confirmation template must be linked, or nothing sends.\n`);

let missingTemplate = 0;
for (const t of types) {
  /* Cliniko's field naming here is not stable across accounts and the docs are
   * thin on it, so rather than assert one name, look for any confirmation-ish
   * key and show what was actually found. Guessing a field name and printing a
   * confident FAIL would be worse than showing the raw truth. */
  const keys = Object.keys(t).filter((k) => /confirm/i.test(k));
  const vals = keys.map((k) => `${k}=${JSON.stringify(t[k])}`);
  const enabled = keys.some((k) => t[k] === true || (t[k] && t[k] !== 'None'));
  if (!enabled) missingTemplate++;
  console.log(`  ${ok(enabled)} ${String(t.name || t.id).slice(0, 38).padEnd(38)} ${vals.join(' ') || '(no confirmation field returned)'}`);
}

/* ---- 2. Patients: how many, and do they accept confirmations? ------------ */
let total = 0;
let sample = [];
try {
  const body = await get('/patients?per_page=50');
  total = body.total_entries ?? (body.patients || []).length;
  sample = body.patients || [];
} catch (e) {
  console.error(`\n  Could not read patients: ${e.message}`);
}

const optedOut = sample.filter((p) => p.receives_confirmation_emails === false).length;
const noEmail = sample.filter((p) => !p.email).length;

console.log(`\n  PATIENTS`);
console.log(`  Gate 2 -- the patient record must accept confirmation emails.\n`);
console.log(`  ${ok(total > 0)} ${total} patient(s) in the database`);
console.log(`  ${ok(optedOut === 0)} ${optedOut} of the ${sample.length} sampled have receives_confirmation_emails = false`);
console.log(`  ${ok(noEmail === 0)} ${noEmail} of the ${sample.length} sampled have no email address on file`);

/* ---- 3. The verdict ------------------------------------------------------ */
console.log(`\n  ${'='.repeat(72)}\n  VERDICT\n`);

if (missingTemplate > 0) {
  console.log(`  ${missingTemplate} of ${types.length} appointment types have no confirmation template.`);
  console.log(`  This is almost certainly why clients report no confirmation emails.`);
  console.log(`  Per Cliniko's docs this overrides the patient setting -- if the type`);
  console.log(`  sends nothing, ticking the patient's box changes nothing.\n`);
  console.log(`  Fix, in Cliniko (owner, ~10 minutes -- I cannot do this, it needs a login):`);
  console.log(`    Settings > Appointment reminders & confirmations > Confirmation templates`);
  console.log(`      1. Create a confirmation template if none exists.`);
  console.log(`      2. Settings > Appointment types > open each type above marked FAIL`);
  console.log(`      3. Below the colour picker, set the confirmation template (not "None")`);
  console.log(`      4. Save, then book a test appointment against your own address.\n`);
} else {
  console.log(`  Every appointment type has a confirmation template linked.`);
  console.log(`  If clients still report nothing, check in this order:`);
  console.log(`    - the practice's from-address is verified in Cliniko`);
  console.log(`    - the individual patient records (gate 2 above)`);
  console.log(`    - spam folders, which for a new sending domain is common\n`);
}

if (optedOut > 0) {
  console.log(`  ${optedOut} sampled patient(s) have confirmations switched off on their record.`);
  console.log(`  The portal can write this field -- see writeReminderPrefs in lib/cliniko.ts.\n`);
}
