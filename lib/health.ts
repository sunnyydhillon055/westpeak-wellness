import { mailConfigured } from '@/lib/portal-mail';
import { clinikoConfigured } from '@/lib/cliniko';

/* IS THE PRACTICE ACTUALLY REACHABLE? — a configuration check for /admin.
 *
 * WHY THIS EXISTS
 *
 * The audit of 23 August 2026 asked why nobody was enquiring and could not
 * fully answer it, because two facts are invisible from outside the deployment:
 * whether `BLOB_READ_WRITE_TOKEN` is set, and whether Resend is configured.
 *
 * Both fail silently, and the second fails worst. If mail is unconfigured an
 * enquiry is still stored — it simply sits in the inbox below with nobody told
 * it arrived. There is no error, no bounce, and no way to notice except by
 * opening this page and looking. Somebody who wrote to a counsellor and heard
 * nothing for a week does not write again.
 *
 * The recommendation in that audit was "send yourself a test enquiry", which is
 * fine advice and a poor system. A practice should not have to run an
 * experiment to find out whether its contact form works. This makes the answer
 * visible.
 *
 * WHAT IT DELIBERATELY DOES NOT DO
 *
 * It reports only whether a variable is SET, never any part of its value. A
 * page that prints a key prefix to be helpful is a page that leaks a key. And
 * it stays quiet when everything is fine: a permanent green tick trains you to
 * stop reading it, so the panel only appears when something is actually wrong.
 */

export type Check = {
  id: string;
  ok: boolean;
  /** Critical = an enquiry can be lost or go unseen. */
  severity: 'critical' | 'degraded' | 'info';
  title: string;
  /** What breaks, in plain terms, for somebody who is not a developer. */
  consequence: string;
  fix: string;
};

const set = (v: string | undefined) => Boolean(v && v.trim());

export function healthChecks(): Check[] {
  return [
    {
      id: 'store',
      ok: set(process.env.BLOB_READ_WRITE_TOKEN),
      severity: 'critical',
      title: 'Enquiries are being saved',
      consequence:
        'Without this, a message is held only in the memory of whichever server handled it and ' +
        'disappears within minutes. The inbox below would stay empty no matter how many people wrote in.',
      fix: 'Set BLOB_READ_WRITE_TOKEN in the Vercel project environment, then redeploy.',
    },
    {
      id: 'mail',
      ok: mailConfigured(),
      severity: 'critical',
      title: 'You are told when somebody writes in',
      consequence:
        'Without this, enquiries are still saved but no alert is sent and the person gets no ' +
        'acknowledgement. They would hear nothing at all unless you opened this page and looked.',
      fix: 'Set RESEND_API_KEY and PORTAL_FROM_EMAIL, then redeploy.',
    },
    {
      id: 'booking',
      ok: set(process.env.NEXT_PUBLIC_CLINIKO_URL),
      severity: 'degraded',
      title: 'The booking page points at your Cliniko',
      consequence:
        'Falls back to a hard-coded URL. That URL currently works, so this is a warning rather ' +
        'than a fault — but if the Cliniko address ever changes, every booking button on the site breaks at once.',
      fix: 'Set NEXT_PUBLIC_CLINIKO_URL to your bookings URL.',
    },
    {
      id: 'cron',
      ok: set(process.env.CRON_SECRET),
      severity: 'degraded',
      title: 'Scheduled jobs can run',
      consequence:
        'The reply-watch nudge, the waitlist check-in and the monthly funnel report all need this. ' +
        'Without it they return 401 and simply never happen.',
      fix: 'Set CRON_SECRET to match the value the Vercel cron uses.',
    },
    {
      id: 'cliniko-api',
      ok: clinikoConfigured(),
      severity: 'info',
      title: 'Appointment sync is connected',
      consequence:
        'Booking still works without it — this only affects the client and revenue figures on this page.',
      fix: 'Set CLINIKO_API_KEY.',
    },
    {
      id: 'analytics',
      ok: set(process.env.NEXT_PUBLIC_GA_ID),
      severity: 'info',
      title: 'Analytics is recording',
      consequence:
        'Conversion counts on this page still work — they are first-party. What is missing is ' +
        'everything about how people move through the site: where they arrive, how far they read, where they leave.',
      fix: 'Set NEXT_PUBLIC_GA_ID.',
    },
  ];
}

/** Only the failures, worst first. Empty means there is nothing to say. */
export function healthProblems(): Check[] {
  const order = { critical: 0, degraded: 1, info: 2 } as const;
  return healthChecks()
    .filter((c) => !c.ok)
    .sort((a, b) => order[a.severity] - order[b.severity]);
}
