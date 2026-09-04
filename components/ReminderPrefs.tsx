import { readReminderPrefs } from '@/lib/cliniko';

/* Reminder preferences, read from and written back to Cliniko.
 *
 * Cliniko is what sends the reminders, so it is the only place a preference can
 * actually take effect. This form therefore reads the live patient record on
 * every render rather than keeping a copy here: a setting that shows one thing
 * while the reminders do another is worse than no setting at all, and this is a
 * counselling practice — a client who asked not to be texted and gets texted
 * anyway has learned something about how carefully they are being handled.
 *
 * It is a plain form posting to a route handler. No client JavaScript, so it
 * works with JS blocked and the page stays server-rendered.
 *
 * When CLINIKO_API_KEY is absent, or the signed-in address does not match a
 * patient record, the form is not shown at all and the reason is stated. An
 * input that silently fails to save would be the exact failure this exists to
 * prevent.
 */
export default async function ReminderPrefs({
  email,
  notice,
}: {
  email: string;
  notice?: string;
}) {
  const result = await readReminderPrefs(email);

  const MESSAGES: Record<string, { tone: 'ok' | 'warn'; text: string }> = {
    saved: { tone: 'ok', text: 'Saved. Your reminder settings are updated.' },
    invalid: { tone: 'warn', text: 'That option was not recognised. Nothing was changed.' },
    nomatch: {
      tone: 'warn',
      text: 'That change could not be saved: this email does not match a client record.',
    },
    unconfigured: {
      tone: 'warn',
      text: 'That change could not be saved, reminder settings are not connected yet.',
    },
    error: {
      tone: 'warn',
      text: 'That change could not be saved. Please email and it will be set for you.',
    },
  };
  const msg = notice ? MESSAGES[notice] : undefined;

  if (result.status !== 'ok') {
    const why =
      result.status === 'not-found'
        ? 'These settings appear once your client record is linked to this email address.'
        : 'Reminder settings are being connected. Until then, email and your preference will be set for you.';
    return (
      <>
        <h2 id="reminders" style={{ marginTop: 38 }}>Reminders</h2>
        <div className="crisis">
          <p style={{ margin: 0 }}>{why}</p>
        </div>
      </>
    );
  }

  const { channels, confirmations } = result.prefs;

  const OPTIONS: { value: string; label: string; hint: string }[] = [
    { value: 'both', label: 'Text and email', hint: 'A reminder by both, before each session.' },
    { value: 'sms', label: 'Text only', hint: 'Nothing in your inbox.' },
    { value: 'email', label: 'Email only', hint: 'Nothing on your phone screen.' },
    { value: 'none', label: 'No reminders', hint: 'You keep track of the time yourself.' },
  ];

  return (
    <>
      <h2 id="reminders" style={{ marginTop: 38 }}>Reminders</h2>
      <p style={{ color: 'var(--ink-soft)', marginTop: -4 }}>
        How you would like to be reminded before a session. This takes effect immediately and you
        can change it whenever you like.
      </p>

      {msg && (
        <p className={msg.tone === 'ok' ? 'prefs-note prefs-note--ok' : 'prefs-note'}>{msg.text}</p>
      )}

      <form method="post" action="/api/portal/reminders" className="prefs-form">
        <fieldset>
          <legend className="prefs-legend">Session reminders</legend>
          {OPTIONS.map((o) => (
            <label className="prefs-option" key={o.value}>
              <input
                type="radio"
                name="channels"
                value={o.value}
                defaultChecked={channels === o.value}
              />
              <span>
                <strong>{o.label}</strong>
                <span className="prefs-hint">{o.hint}</span>
              </span>
            </label>
          ))}
        </fieldset>

        <label className="prefs-option prefs-option--check">
          <input type="checkbox" name="confirmations" defaultChecked={confirmations} />
          <span>
            <strong>Booking confirmations by email</strong>
            <span className="prefs-hint">
              Sent when a session is booked or changed. Separate from reminders.
            </span>
          </span>
        </label>

        <button className="btn btn--primary" type="submit">Save preferences</button>
      </form>

      <p className="prefs-foot">
        Reminders are sent by the practice&rsquo;s scheduling system, and this changes the setting
        there directly &mdash; nothing is stored on this website.
      </p>
    </>
  );
}
