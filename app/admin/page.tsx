import '@/app/private.css';
import type { Metadata } from 'next';
import { LOOKING, WHERE, TIMING, labelOf } from '@/lib/enquiry-fields';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth, signOut } from '@/auth';
import { isAdmin } from '@/lib/portal-store';
import { readClients } from '@/lib/clients';
import { listPasswordAccounts } from '@/lib/portal-users';
import { clinikoConfigured } from '@/lib/cliniko';
import { recentInbound, markHandled, deleteInbound, readInbound } from '@/lib/inbound';
import { isTestSubmission, awaitsHumanReply, isRealSubmission } from '@/lib/inbound-quality';
import ConfirmAnswered from '@/components/admin/ConfirmAnswered';
import BotCount from '@/components/admin/BotCount';
import { replyContextFor } from '@/lib/reply-context';
import { recordAudit, recentAudit } from '@/lib/admin-audit';
import { readCatalog } from '@/lib/cliniko-catalog';
import { topSearchTerms, readSearchTerms, searchGaps } from '@/lib/search-log';
import { REPLY_TEMPLATES, mailtoFor, businessDaysWaiting, replyTimeStats } from '@/lib/reply-templates';
import { eventTotals, topPagesFor, readConversions, detailsOf, bookClickBreakdown, funnelCuts, channelVisits, clicksOfLandings, bookingCredit } from '@/lib/conversion-log';
import { readBookingTally, tallyRows, tallyLine } from '@/lib/booking-tally-read';
import { funnelJoins, consultLines, enquiryLines, retentionLines } from '@/lib/funnel-report';
import { recentSnapshots, lastWeek, weekTable, type WeekRow } from '@/lib/conversion-snapshots';
import { readGscSummary, newestGscDate, gscLines } from '@/lib/gsc-summary';
import { practitioners } from '@/lib/practitioners';
import NoCountSwitch from '@/components/NoCountSwitch';
import { readLedger, recordContacted } from '@/lib/lifecycle';
import { reactivationEmail } from '@/lib/lifecycle-mail';
import { sendDetailed, mailConfigured } from '@/lib/portal-mail';
import { healthProblems } from '@/lib/health';
import { readCronHealth, cronProblems, storeFrozen, measurementWarnings } from '@/lib/cron-health';
import { consultationAvailabilityNow } from '@/lib/cliniko-availability';
import { site } from '@/lib/site';
import { revalidatePath } from 'next/cache';
import NotSeenLately from '@/components/admin/NotSeenLately';

export const metadata: Metadata = {
  title: { absolute: 'Practice admin | Westpeak Wellness' },
  robots: { index: false, follow: false },
};
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* Messages are looked up by key, so nothing user-supplied is ever reflected
 * back into the page. */
const CLIENT_MSG: Record<string, string> = {
  add: 'Client added. They can sign in straight away.',
  update: 'Saved.',
  remove: 'Removed, and any password for that address was cleared with it.',
  duplicate: 'That email is already on the list. Nothing was changed.',
  bademail: 'That does not look like an email address. Nothing was changed.',
  missing: 'That client no longer exists. The list may have changed in another tab.',
  conflict:
    'Someone else changed the list while this page was open, so nothing was saved. ' +
    'The table below is now current, make the change again.',
  unknown: 'Nothing was changed.',
};
const AVAIL_MSG: Record<string, string> = {
  add: 'Hours added. Remember to mirror this in Cliniko.',
  remove: 'Hours removed. Remember to mirror this in Cliniko.',
  bad: 'A day, a start and an end are all needed. Nothing was changed.',
  missing: 'That entry no longer exists.',
};
const PW_MSG: Record<string, string> = {
  set: 'Password set. Give it to the client directly. It is not emailed to them.',
  cleared: 'Password removed. That client can now only sign in with Google.',
  short: 'Nothing changed: passwords must be at least 10 characters.',
  missing: 'Nothing changed: no email address was given.',
  error: 'Could not save that. Nothing changed.',
};
const CLINIKO_MSG: Record<string, string> = {
  found: 'Connected, and Cliniko recognised that address, Cliniko patients can sign in without being listed here.',
  'not-found': 'Connected, and Cliniko has no patient with that address. The key works; try one you know is in Cliniko.',
  unconfigured: 'No CLINIKO_API_KEY is set, so Cliniko is not consulted at all.',
  'bad-key': 'Cliniko rejected the key. Check it was copied whole, including the shard suffix.',
  'no-shard': 'The key has no shard suffix (…-au1, …-ca1). Copy it again without trimming the end.',
  'unsupported-filter': 'Cliniko rejected the email filter, so searching patients by email is not available on this account. Keep using the list.',
  error: 'Could not reach Cliniko. Nothing changed; client access is unaffected.',
};

const STATUS_LABEL: Record<string, string> = {
  active: 'Active',
  paused: 'Paused',
  former: 'Former',
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: {
    c?: string; a?: string; pw?: string; cliniko?: string;
    sync?: string; added?: string; welcomed?: string; total?: string; named?: string;
    noemail?: string; why?: string;
    sort?: string; dir?: string; digest?: string; indexnow?: string;
    funnel?: string;
    answered?: string; t?: string;
  };
}) {
  const session = await auth();
  const email = session?.user?.email ?? '';
  // Re-checked here, not only at sign-in, so removing an administrator takes
  // effect on their next request rather than when their token expires.
  if (!email || !isAdmin(email)) redirect('/signin?next=%2Fadmin');

  const book = await readClients({ fresh: true });
  const withPasswords = await listPasswordAccounts();
  const inbox = await recentInbound(40);
  const audit = await recentAudit(30);
  const catalog = await readCatalog();
  /* People waiting, not rows waiting. Every unhandled row used to count, and
     on 17 Sep that made 33 out of an inbox whose human content was three: the
     rest were this project's own probes and newsletter scripts. See
     lib/inbound-quality.ts. */
  const waiting = inbox.filter((i) => !i.handled && awaitsHumanReply(i)).length;
  /* Real submissions only (1 Oct 2026): monthlyOptIn was true on 68 of 69
     stored leads, nearly all of them honeypot-tripped scripts. */
  const monthlyOptIns = inbox.filter((i) => i.monthlyOptIn && isRealSubmission(i)).length;
  const searches = await topSearchTerms(30);
  const gaps = await searchGaps();
  const totals = await eventTotals();
  const enquiryPages = await topPagesFor('enquiry_submit');
  const bookPages = await topPagesFor('book_click');
  const aiPages = await topPagesFor('ai_referral');
  /* The second cut of the same counts — by button, by counsellor, by tool
     outcome — added 1 Oct 2026 when the log started keeping a detail. One
     read, split in lib/conversion-log.ts so the funnel email shows the same
     numbers. Rows appear only once an event has carried a detail, so a fresh
     deploy shows nothing new here rather than a table of zeros. */
  const log = await readConversions();
  const bookClicks = bookClickBreakdown(log);
  /* Shared with the monthly email (lib/conversion-log.ts funnelCuts), so
     the two print the same rows. The calendar is split by surface since
     1 Oct 2026: /book's free consultation and the portal's paid calendar. */
  const { calendar: calendarRows, toolOutcomes, magnets } = funnelCuts(log);
  /* THE BOOKING TALLY, written by the booking-mail job. Absent until its
     first run that writes one, and said so rather than shown as zeros. */
  const tallyRead = await readBookingTally();
  const tallyMonth = new Date().toISOString().slice(0, 7);
  const tallyPrev = (() => { const d = new Date(); d.setUTCDate(1); d.setUTCMonth(d.getUTCMonth() - 1); return d.toISOString().slice(0, 7); })();
  /* CONSULTATION TO PAID, on request. It reads every appointment for six
     months and one patient record per consultation, which is too many
     Cliniko calls to spend on every load of this page, so it runs when
     asked (?funnel=1). Same function as the monthly email. Counts only. */
  const joinsAsked = searchParams?.funnel === '1';
  const joinsFrom = (() => { const d = new Date(); d.setUTCDate(1); d.setUTCHours(0, 0, 0, 0); d.setUTCMonth(d.getUTCMonth() - 1); return d; })();
  const joinsTo = (() => { const d = new Date(); d.setUTCDate(1); d.setUTCHours(0, 0, 0, 0); return d; })();
  const joinsMonth = joinsFrom.toLocaleDateString('en-CA', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  const joins = joinsAsked && clinikoConfigured()
    ? await funnelJoins(joinsFrom, joinsTo, (await readInbound({ fresh: true })).items)
    : null;
  const joinsText = joins
    ? [
        ...(joins.truncated ? ['Truncated: more appointments than the read allows; every count is a floor.', ''] : []),
        ...consultLines(joins, joinsMonth, new Date().toLocaleDateString('en-CA', { day: 'numeric', month: 'long', year: 'numeric' })),
        '',
        ...enquiryLines(joins),
        '',
        ...retentionLines(joins.retention, joinsMonth),
      ].join('\n')
    : '';
  /* Where visits came from (1 Oct 2026): the kind of organisation whose
     link was followed, and the landing page's referrer class. Booking
     clicks per page are printed against the landings on that page, and the
     note beside them says from when each was counted, because clicks began
     on 18 Aug and landings on the day this shipped. */
  const channels = channelVisits(log);
  const landingClasses = detailsOf(log, 'landing');
  const bookVsLanding = clicksOfLandings(log);
  const landingsSince = log.firstSeen?.landing ?? '';
  /* Last week: the two newest Monday snapshots, subtracted. Null until the
     cron has run twice. See lib/conversion-snapshots.ts. Nine since 1 Oct
     2026, for the eight-week table: every neighbouring pair, per
     counsellor, with the booking tally and the consultation slots each
     snapshot copied, and the messages written on /book that week. */
  const snapshots = await recentSnapshots(9);
  const week = lastWeek(snapshots);
  const rosterSlugs = practitioners.filter((p) => p.acceptingNewClients && p.bookable).map((p) => p.slug);
  const bookMessages = snapshots.length > 1
    ? (await readInbound()).items
        .filter((i) => i.kind === 'enquiry' && isRealSubmission(i) && (i.source || '').split('?')[0] === '/book')
        .map((i) => ({ createdAt: i.createdAt, practitioner: i.practitioner }))
    : [];
  const weeks = weekTable(snapshots, rosterSlugs, bookMessages);
  /* Which landing and which button led to a click and to a confirmed
     booking (1 Oct 2026), and mailto: presses beside the messages. */
  const credit = bookingCredit(log);
  const emailClicks = detailsOf(log, 'email_click');
  /* Enquiries the server turned back, by the rule they failed (1 Oct 2026). */
  const refused = detailsOf(log, 'enquiry_refused');
  /* Search Console from the newest committed export, beside this site's own
     count of sessions that arrived from Google. */
  const gsc = readGscSummary();
  const googleLandings = landingClasses.rows.find((r) => r.detail === 'google')?.count;
  const searchTotal = (await readSearchTerms()).total;
  /* Jobs that failed, or that have not reported in twice their expected
     interval — which looks identical to "fine" without the second check. */
  const cronHealth = await readCronHealth();
  /* Plus the measurement that can go stale with every job green: the
     Search Console export, the Monday snapshot, and this month's report. */
  const cronTrouble = (() => {
    const jobs = cronProblems(cronHealth);
    const extra = measurementWarnings({ gscNewest: newestGscDate(), snapshotNewest: snapshots[0]?.takenAt ?? null, health: cronHealth })
      .filter((w) => !jobs.some((j) => j.job === w.job));
    return [...jobs, ...extra];
  })();
  /* One sentence that outranks the list below it when true - see storeFrozen. */
  const cronStoreFrozen = storeFrozen(cronHealth);
  const availability = await consultationAvailabilityNow();
  /* Whether the reply promise printed on every page is actually being kept.
     Stays quiet below five answered messages — see lib/reply-templates.ts. */
  const replyTime = replyTimeStats(inbox);
  /* Probes left by this project's own smoke checks and by hand. */
  const testRows = inbox.filter(isTestSubmission);

  /* Paused and former clients who have never had a reactivation note.
   * lib/clients.ts keeps these states specifically so the history survives, and
   * until now nothing ever read them. */
  const ledger = await readLedger({ fresh: true });
  const dormant = book.clients
    .filter((c) => c.status !== 'active')
    .map((c) => ({ ...c, contactedAt: ledger.reactivation[c.email] ?? null }));
  const canContact = dormant.filter((d) => !d.contactedAt).length;

  const active = book.clients.filter((c) => c.status === 'active').length;
  /* Result of a manual "Sync from Cliniko now". Counts only — the redirect
     deliberately carries no addresses. */
  const SORT_KEYS = ['name', 'email', 'status', 'note', 'added'] as const;
  type SortKey = (typeof SORT_KEYS)[number];
  const sortKey = (SORT_KEYS as readonly string[]).includes(searchParams?.sort ?? '') ? (searchParams!.sort as SortKey) : undefined;
  const sortDir: 'asc' | 'desc' = searchParams?.dir === 'desc' ? 'desc' : 'asc';
  const STATUS_ORDER: Record<string, number> = { active: 0, paused: 1, former: 2 };
  const sortedClients = sortKey
    ? [...book.clients].sort((a, b) => {
        const va = sortKey === 'added' ? (a.addedAt ?? '') : sortKey === 'status' ? STATUS_ORDER[a.status] ?? 9 : String((a as Record<string, unknown>)[sortKey] ?? '').toLowerCase();
        const vb = sortKey === 'added' ? (b.addedAt ?? '') : sortKey === 'status' ? STATUS_ORDER[b.status] ?? 9 : String((b as Record<string, unknown>)[sortKey] ?? '').toLowerCase();
        const r = va < vb ? -1 : va > vb ? 1 : 0;
        return sortDir === 'asc' ? r : -r;
      })
    : book.clients;
  const sortHeader = (key: SortKey, label: string) => {
    const active = sortKey === key;
    const nextDir = active && sortDir === 'asc' ? 'desc' : 'asc';
    return (
      <th scope="col" aria-sort={active ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}>
        <Link href={`/admin?sort=${key}&dir=${nextDir}#clients`} style={{ textDecoration: 'none', color: 'inherit' }}>
          {label}{active ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''}
        </Link>
      </th>
    );
  };
  const syncOk = searchParams?.sync === 'ok';
  const syncNote = searchParams?.sync
    ? syncOk
      ? `Synced. ${searchParams.total ?? '0'} active patient(s) in Cliniko · ` +
        `${searchParams.added ?? '0'} newly added · ${searchParams.welcomed ?? '0'} welcome email(s) sent · ${searchParams.named ?? '0'} name(s) filled` +
        (Number(searchParams.noemail ?? 0) > 0
          ? ` · ${searchParams.noemail} skipped with no email on file`
          : '')
      : `Sync failed: ${searchParams.why ?? 'unknown'}`
    : null;

  const notices = [
    searchParams?.c && CLIENT_MSG[searchParams.c],
    searchParams?.a && AVAIL_MSG[searchParams.a],
    searchParams?.pw && PW_MSG[searchParams.pw],
    searchParams?.cliniko && CLINIKO_MSG[searchParams.cliniko],
  ].filter(Boolean) as string[];

  return (
    <section className="section" style={{ paddingTop: 44 }}>
      <div className="container container--wide">
        <div className="admin-head">
          <div>
            <p className="eyebrow">Practice admin</p>
            <h1 style={{ fontSize: 'var(--fs-h2)', margin: 0 }}>Clients &amp; availability</h1>
          </div>
          <form
            action={async () => {
              'use server';
              await signOut({ redirectTo: '/' });
            }}
          >
            <button type="submit" className="btn btn--ghost">Sign out</button>
          </form>
        </div>

        {notices.map((n) => (
          <div className="crisis" style={{ marginTop: 18 }} key={n}>
            <p style={{ margin: 0 }}>{n}</p>
          </div>
        ))}

        {searchParams?.indexnow && (
          <p className="book-credential" style={{ marginTop: 14 }}>
            {searchParams.indexnow.startsWith('ok-')
              ? `Sitemap submitted to IndexNow: ${searchParams.indexnow.slice(3)} URLs, run recorded.`
              : 'The IndexNow submission failed; the reason is recorded under scheduled jobs.'}
          </p>
        )}
        <div className="card" style={{ marginTop: 18 }}>
          <h2 style={{ marginTop: 0, fontSize: '1.1rem' }}>Availability feed</h2>
          <p style={{ margin: '0 0 8px', fontSize: '.92rem', color: 'var(--ink-soft)' }}>
            What /book and /contact print, read from Cliniko just now (the public pages cache it for thirty minutes).
          </p>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: '.92rem' }}>
            {Object.values(availability).map((a) => (
              <li key={a.slug}>
                <strong>{a.slug}</strong>:{' '}
                {a.error ? `could not read (${a.error})` : `${a.count} consultation ${a.count === 1 ? 'time' : 'times'} in the next two weeks${a.count ? `, ${a.days.join(' ')}, ${a.earliest} to ${a.latest}` : ''}`}
              </li>
            ))}
            {!Object.keys(availability).length && <li>No counsellor is bookable online and accepting.</li>}
          </ul>
        </div>

        <form method="POST" action="/api/admin/indexnow" style={{ margin: '12px 0 0' }}>
          <button type="submit" className="btn btn--ghost">Submit the sitemap to IndexNow now</button>
          <span style={{ marginLeft: 12, fontSize: '.9rem', color: 'var(--ink-soft)' }}>
            Tells Bing and the engines it feeds about every page today; the weekly job does the same on Mondays.
          </span>
        </form>

        {/* Scheduled jobs. Eight of them run unattended, and until 2026-08-23
            none had a try/catch — a throw was a 500 in a log nobody reads. The
            ones that fail invisibly are the ones that matter: reply-watch is
            the only thing verifying the reply promise printed on every page,
            and funnel-report is the summary that would have shown the rest had
            stopped. */}
        {cronStoreFrozen && (
          <div className="crisis" style={{ marginTop: 18 }}>
            <p style={{ margin: 0 }}><strong>The job health store is not being written.</strong> {cronStoreFrozen}</p>
          </div>
        )}

        {cronTrouble.length > 0 && (
          <div className="admin-panel" style={{ marginTop: 20, borderLeft: '3px solid var(--clay)' }}>
            <h2 style={{ marginTop: 0, fontSize: '1.05rem' }}>Scheduled jobs needing a look</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: '14px 0 0', display: 'grid', gap: 10 }}>
              {cronTrouble.map((c) => (
                <li key={c.job} style={{ paddingLeft: 12, borderLeft: '2px solid var(--line)' }}>
                  <p style={{ margin: 0, fontWeight: 600 }}>{c.job}</p>
                  <p style={{ margin: '2px 0 0', color: 'var(--ink-soft)', fontSize: '.92rem' }}>
                    {c.detail}
                    {c.at ? ` · last reported ${new Date(c.at).toLocaleString('en-CA')}` : ''}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* --------------------------------------------------- IS IT WORKING?
            Above everything, including the inbox, because if the answer is no
            then the empty inbox below is not information — it is a symptom.

            The 23 August audit could not determine from outside whether
            enquiries were being stored or whether anyone was being told about
            them. Both fail silently. This is that question, answered on sight.

            Renders nothing when all is well: a permanent green tick is a thing
            you stop reading. */}
        {healthProblems().length > 0 && (
          <div className="admin-panel" style={{ marginTop: 20, borderLeft: '3px solid var(--danger, #b4472f)' }}>
            <h2 style={{ marginTop: 0, fontSize: '1.05rem' }}>
              {healthProblems().some((c) => c.severity === 'critical')
                ? 'Something here can lose an enquiry'
                : 'Some things are not switched on'}
            </h2>
            <p style={{ color: 'var(--ink-soft)', maxWidth: '40.38em' }}>
              Each of these fails quietly. Nothing errors, nothing bounces, and the only way to
              notice is to look. Nothing below reports a password or a key, only whether one is set.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '18px 0 0', display: 'grid', gap: 14 }}>
              {healthProblems().map((c) => (
                <li key={c.id} style={{ paddingLeft: 14, borderLeft: '2px solid var(--line)' }}>
                  <p style={{ margin: 0, fontWeight: 600 }}>
                    {c.severity === 'critical' ? '✕ ' : '• '}{c.title}, <em>no</em>
                    {c.severity !== 'critical' && (
                      <span style={{ color: 'var(--ink-faint)', fontWeight: 400, fontSize: '.86rem' }}>
                        {' '}({c.severity === 'degraded' ? 'degraded' : 'optional'})
                      </span>
                    )}
                  </p>
                  <p style={{ margin: '4px 0 0', color: 'var(--ink-soft)', fontSize: '.92rem' }}>
                    {c.consequence}
                  </p>
                  <p style={{ margin: '4px 0 0', fontSize: '.86rem', color: 'var(--ink-faint)' }}>
                    <strong>Fix:</strong> {c.fix}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* The promise, measured. Every page says "a reply within one business
            day"; this is the only thing that can tell you whether that is true.
            Silent until there are five answered messages to draw on. */}
        {replyTime.ready && (
          <div className="admin-panel" style={{ marginTop: 20 }}>
            <h2 style={{ marginTop: 0, fontSize: '1.05rem' }}>Are you keeping the reply promise?</h2>
            <p style={{ margin: '8px 0 0', color: 'var(--ink-soft)' }}>
              Median reply <strong>{replyTime.medianHours < 1
                ? `${Math.round(replyTime.medianHours * 60)} minutes`
                : `${replyTime.medianHours} hours`}</strong>{' '}
              across {replyTime.sample} answered {replyTime.sample === 1 ? 'message' : 'messages'} ·{' '}
              <strong>{replyTime.withinOneBusinessDay} of {replyTime.sample}</strong> inside 24 hours.
            </p>
            {replyTime.withinOneBusinessDay < replyTime.sample && (
              <p style={{ margin: '8px 0 0', fontSize: '.92rem', color: 'var(--ink-faint)' }}>
                The site promises one business day on every page that carries a form. If that stops
                being true, the honest fix is to change the sentence rather than the record.
              </p>
            )}
          </div>
        )}

        <div className="admin-stats">
          <div><strong>{waiting}</strong><span>awaiting a reply</span></div>
          <div><strong>{canContact}</strong><span>could be reached back</span></div>
          <div><strong>{active}</strong><span>can sign in</span></div>
          <div><strong>{book.clients.length}</strong><span>on the books</span></div>
          <div><strong>{withPasswords.length}</strong><span>with a password</span></div>
        </div>

        {/* ------------------------------------------------------------ INBOX */}
        {/* First on the page, above the client list, because it is the only
            section that is time-sensitive. Everything below it will still be
            true tomorrow; a person who wrote in yesterday and heard nothing
            has already formed a view of the practice. */}
        <h2 id="inbox" style={{ marginTop: 40 }}>Inbox</h2>
        {searchParams?.digest && (
          <p className="book-credential" style={{ marginTop: 8 }}>
            {searchParams.digest.startsWith('sent-')
              ? `Sent: every enquiry to date (${searchParams.digest.slice(5)}) to Camille and Savneet, info@ in copy.`
              : searchParams.digest === 'noaddress'
                ? 'No counsellor has an alert address on the roster, so nothing was sent.'
                : 'The digest did not send — check the mail configuration.'}
          </p>
        )}
        {/* THE PROBES THIS PROJECT LEFT BEHIND - 17 Sep 2026.
            Eight submissions in the inbox below are self-tests written by the
            build's own smoke checks and by hand: selftest-ask@example.com,
            probe@example.com and their like. They are not people, they were
            counted as people by the reply-time watch for weeks, and they are
            still sitting in a list the practice is meant to work through. One
            button, because deleting them one at a time is eight confirmations
            of something nobody chose to keep. Only addresses that cannot
            belong to a client are touched - see lib/inbound-quality.ts. */}
        {testRows.length > 0 && (
          <form
            action={async () => {
              'use server';
              const s = await auth();
              const who = s?.user?.email ?? '';
              if (!who || !isAdmin(who)) return;
              let gone = 0;
              for (const t of testRows) if (await deleteInbound(t.id)) gone += 1;
              await recordAudit({ actor: who, action: 'delete test submissions', subject: `${gone} row(s)` });
              revalidatePath('/admin');
            }}
            style={{ margin: '8px 0 12px' }}
          >
            <button type="submit" className="btn btn--ghost">
              Remove {testRows.length} test submission{testRows.length === 1 ? '' : 's'}
            </button>
            <span style={{ marginLeft: 12, fontSize: '.9rem', color: 'var(--ink-soft)' }}>
              Self-tests and throwaway addresses left by the build. Not counted as waiting for a reply.
            </span>
          </form>
        )}

        <form method="POST" action="/api/admin/digest" style={{ margin: '8px 0 18px' }}>
          <button type="submit" className="btn btn--ghost">
            Send every enquiry to date to the counsellors
          </button>
          <span style={{ marginLeft: 12, fontSize: '.9rem', color: 'var(--ink-soft)' }}>
            One email, oldest first, to each counsellor taking new clients, info@ in copy. New enquiries
            already go to the right counsellor automatically.
          </span>
        </form>
        <p style={{ color: 'var(--ink-soft)', maxWidth: '40.38em' }}>
          Messages and checklist signups from the site. Each one was also
          emailed to <strong>{site.email}</strong> as it arrived. This is the copy that
          survives if that email is missed, and the record that a reply is owed.
        </p>
        {/* Shown so the list is visible before anybody builds a monthly send.
            A monthly email to four people is not a channel, and starting one
            and stopping is worse than never starting. */}
        {/* The alert's "mark answered" link lands here, and the bot count sits
            beside the figures it was taken out of. 1 Oct 2026. */}
        <ConfirmAnswered id={searchParams?.answered} token={searchParams?.t} />
        <BotCount />
        {monthlyOptIns > 0 && (
          <p style={{ color: 'var(--ink-soft)', maxWidth: '40.38em' }}>
            <strong>{monthlyOptIns}</strong> {monthlyOptIns === 1 ? 'person has' : 'people have'}{' '}
            separately opted in to a monthly email. Nothing sends to them yet. That is a
            standing commitment to write something worth reading every month, and it is
            deliberately your call rather than a switch that got flipped.
          </p>
        )}

        {inbox.length === 0 ? (
          <div className="admin-panel">
            <p style={{ margin: 0 }}>
              Nothing yet. The forms on <Link href="/contact">/contact</Link>,{' '}
              <Link href="/book">/book</Link> and <Link href="/pricing">/pricing</Link> write
              here.
            </p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>When</th><th>Who</th><th>Kind</th><th>Message</th><th>Page</th><th />
                </tr>
              </thead>
              <tbody>
                {inbox.map((i) => (
                  <tr key={i.id} style={i.handled ? { opacity: 0.55 } : undefined}>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {new Date(i.createdAt).toLocaleDateString('en-CA', {
                        timeZone: 'America/Vancouver', month: 'short', day: 'numeric',
                      })}
                    </td>
                    <td>
                      {i.name || <em style={{ color: 'var(--ink-faint)' }}>no name</em>}<br />
                      <a href={`mailto:${i.email}`} style={{ fontSize: '.9em' }}>{i.email}</a>

                      {/* Triage chip. A hint about the submission, never a
                          verdict about the person — see the header of
                          lib/triage.ts. Read the message anyway; the flags say
                          what looked automated, not who is not worth a reply.
                          Records written before 30 Aug 2026 carry no verdict
                          and correctly show nothing. */}
                      {i.triage && i.triage.band !== 'clear' && (
                        <>
                          <br />
                          <span
                            title={i.triage.why}
                            style={{
                              display: 'inline-block', marginTop: 3, padding: '1px 7px',
                              borderRadius: 2, fontSize: '.72em', fontWeight: 600,
                              letterSpacing: '.04em', textTransform: 'uppercase',
                              color: `var(${i.triage.band === 'quarantine' ? '--flag-ink' : '--check-ink'})`,
                              background: `var(${i.triage.band === 'quarantine' ? '--flag-bg' : '--check-bg'})`,
                            }}
                          >
                            {i.triage.band === 'quarantine' ? 'bot' : 'check'}
                          </span>{' '}
                          <span style={{ fontSize: '.78em', color: 'var(--ink-faint)' }}>
                            {i.triage.why}
                          </span>
                        </>
                      )}

                      {/* Someone asked to be phoned. Until 30 Aug 2026 this was
                          collected and then dropped before the store, so it
                          never reached here or the alert email. */}
                      {i.phone && (
                        <>
                          <br />
                          <strong style={{ fontSize: '.82em', color: 'var(--blue-deep)' }}>
                            asked to be called:{' '}
                            <a href={`tel:${i.phone.replace(/[^\d+]/g, '')}`}>{i.phone}</a>
                            {i.callWindow ? ` · ${i.callWindow}` : ''}
                          </strong>
                        </>
                      )}
                      {/* Every page promises a reply within one business day.
                          reply-watch emails when that slips; this makes it
                          visible here, where the reply actually gets written.
                          Business days, so a Saturday-old message is not late. */}
                      {!i.handled && businessDaysWaiting(i.createdAt) >= 1 && (
                        <>
                          <br />
                          <strong style={{ fontSize: '.82em', color: 'var(--clay-deep)' }}>
                            waiting {businessDaysWaiting(i.createdAt)} business day
                            {businessDaysWaiting(i.createdAt) === 1 ? '' : 's'}
                          </strong>
                        </>
                      )}
                      {!i.handled && (
                        <>
                          <br />
                          {/* Drafts, not sends. Opens the mail client with the
                              reply already written; nothing leaves without a
                              person reading it. See lib/reply-templates.ts. */}
                          <span style={{ fontSize: '.8em', color: 'var(--ink-faint)' }}>
                            reply:{' '}
                            {REPLY_TEMPLATES.map((t, n) => (
                              <span key={t.key}>
                                {n > 0 && ' · '}
                                <a href={mailtoFor(i, t.key, replyContextFor(i, catalog))} title={t.when}>
                                  {t.label.split(' —')[0].split(' -')[0]}
                                </a>
                              </span>
                            ))}
                          </span>
                        </>
                      )}
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {i.kind === 'enquiry' ? 'Message' : 'Checklist'}
                      {/* Someone who left a number asked for a different kind of
                          reply than everyone else in this queue, and answering
                          by email is the wrong answer. It has to be visible in
                          the list, not one click away. */}
                      {i.phone && (
                        <>
                          <br />
                          <strong style={{ fontSize: '.85em' }}>Wants a call</strong>
                        </>
                      )}
                    </td>
                    <td style={{ maxWidth: 360 }}>
                      {i.phone && (
                        <div style={{ marginBottom: 6, fontSize: '.92em' }}>
                          <a href={`tel:${i.phone.replace(/[^\d+]/g, '')}`}>{i.phone}</a>
                          {i.callWindow && (
                            <span style={{ color: 'var(--ink-faint)' }}> · {i.callWindow}</span>
                          )}
                        </div>
                      )}
                      {(i.looking || i.where || i.timing) && (
                        <div style={{ marginBottom: 6, fontSize: '.85em', color: 'var(--ink-faint)' }}>
                          {[labelOf(LOOKING, i.looking), labelOf(WHERE, i.where), labelOf(TIMING, i.timing)].filter(Boolean).join(' · ')}
                        </div>
                      )}
                      {i.message || (
                        !i.phone && <em style={{ color: 'var(--ink-faint)' }}>, </em>
                      )}
                    </td>
                    <td style={{ fontSize: '.9em', color: 'var(--ink-faint)' }}>{i.source}</td>
                    <td>
                      <form
                        action={async () => {
                          'use server';
                          /* Re-checked inside the action. A server action is a
                             POST endpoint of its own — the page-level admin
                             check above does not protect it. */
                          const s = await auth();
                          const who = s?.user?.email ?? '';
                          if (!who || !isAdmin(who)) return;
                          await markHandled(i.id, !i.handled);
                          revalidatePath('/admin');
                        }}
                      >
                        <button type="submit" className="btn btn--ghost btn--sm">
                          {i.handled ? 'Reopen' : 'Done'}
                        </button>
                      </form>
                      {/* Erasure, for somebody who has asked to be forgotten.
                          Separate from Done deliberately: one is workflow, the
                          other is irreversible, and putting them side by side
                          without a confirm is how the wrong one gets pressed.
                          The record is removed outright rather than flagged —
                          a "deleted" row still in the file has not been
                          deleted, and saying otherwise to the person who asked
                          would be untrue. */}
                      <form
                        action={async () => {
                          'use server';
                          const s = await auth();
                          const who = s?.user?.email ?? '';
                          if (!who || !isAdmin(who)) return;
                          const gone = await deleteInbound(i.id);
                          if (gone) {
                            /* The id and kind only. An audit line that quoted
                               what was deleted would have moved the data, not
                               removed it. */
                            await recordAudit({
                              actor: who,
                              action: 'delete enquiry',
                              subject: `${i.kind} ${i.id}`,
                            });
                          }
                          revalidatePath('/admin');
                        }}
                      >
                        <button
                          type="submit"
                          className="btn btn--ghost btn--sm"
                          style={{ marginTop: 4, color: 'var(--danger, #9a3412)' }}
                        >
                          Erase
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ------------------------------------------------------ REACHING BACK */}
        {/* Deliberately one button per person and not a "send to all".
            Whether it is appropriate to write to a particular former client is
            a clinical judgement — they may have finished because the work was
            done, or because they could not afford it, or because something
            happened they would rather not revisit. A batch send makes that
            judgement for all of them at once, which is the one thing it must
            not do. The ledger then guarantees once, ever. */}
        <h2 id="reaching-back" style={{ marginTop: 44 }}>Reaching back</h2>
        <p style={{ color: 'var(--ink-soft)', maxWidth: '40.38em' }}>
          Paused and former clients. A single, once-only note saying the practice has openings.
          No urgency, nothing implying they should still be in therapy, and nothing that needs a
          reply. <strong>One message per person, ever.</strong> Send them one at a time, and only
          where you judge it appropriate; that judgement is not something this page should make
          for you.
        </p>

        {!mailConfigured() && (
          <div className="crisis" style={{ marginTop: 14 }}>
            <p style={{ margin: 0 }}>
              Email is not configured on this deployment, so nothing can be sent.
            </p>
          </div>
        )}

        {dormant.length === 0 ? (
          <div className="admin-panel">
            <p style={{ margin: 0 }}>
              Nobody is paused or former. This fills as clients finish or pause.
            </p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Client</th><th>Status</th><th>Since</th><th /></tr>
              </thead>
              <tbody>
                {dormant.map((d) => (
                  <tr key={d.id}>
                    <td>
                      {d.name || <em style={{ color: 'var(--ink-faint)' }}>no name</em>}<br />
                      <span className="admin-email">{d.email}</span>
                    </td>
                    <td>{STATUS_LABEL[d.status] ?? d.status}</td>
                    <td className="admin-date">{d.updatedAt ? d.updatedAt.slice(0, 10) : '—'}</td>
                    <td>
                      {d.contactedAt ? (
                        <span style={{ color: 'var(--ink-faint)', fontSize: '.86rem' }}>
                          Sent {d.contactedAt.slice(0, 10)}
                        </span>
                      ) : (
                        <form
                          action={async () => {
                            'use server';
                            const sess = await auth();
                            const who = sess?.user?.email ?? '';
                            if (!who || !isAdmin(who)) return;
                            /* Re-checked inside the action, not just on the
                               page: a server action is its own POST endpoint. */
                            if (await readLedger({ fresh: true }).then((l) => Boolean(l.reactivation[d.email]))) return;
                            const mail = reactivationEmail((d.name || '').split(/\s+/)[0] ?? '');
                            const sent = await sendDetailed(d.email, mail.subject, mail.text, mail.html, { replyTo: site.email });
                            /* Recorded only on a confirmed send. Recording
                               first would silently burn somebody's one message
                               on an email that never arrived. */
                            if (sent.ok) await recordContacted(d.email);
                            revalidatePath('/admin');
                          }}
                        >
                          <button type="submit" className="btn btn--ghost btn--sm" disabled={!mailConfigured()}>
                            Send note
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <NotSeenLately />

        {/* ----------------------------------------------------- SEARCH TERMS */}
        {/* The only first-party keyword research this practice will ever get:
            the words visitors use for their own problem, before Google rewrites
            them. Counts, not logs — no timestamps, no sessions, nothing that
            joins two searches to one person. See lib/search-log.ts. */}
        {/* WHICH PAGES ACTUALLY PRODUCE CONTACT.
            Every track() call on this site went through gtag, and gtag only
            exists when NEXT_PUBLIC_GA_ID is set — which it was not. So every
            conversion event was being discarded, and "which page earns
            enquiries" had never been answerable. lib/conversion-log.ts now
            counts them first-party. Counts only: no session, no identifier,
            nothing that joins two actions to one person. */}
        <h2 id="conversions" style={{ marginTop: 44 }}>What actually produces contact</h2>
        <p style={{ color: 'var(--ink-soft)', maxWidth: '40.38em' }}>
          Counted on this site rather than in Google Analytics, so it works whether or not
          GA is configured. Counts only &mdash; no sessions and no identifiers.
        </p>
        <div className="admin-panel">
          <h3 style={{ marginTop: 0 }}>Your own visits</h3>
          <NoCountSwitch />
        </div>
        <WeekPanel week={week} snapshots={snapshots.length} weeks={weeks} />
        {totals.length === 0 ? (
          <div className="admin-panel">
            <p style={{ margin: 0 }}>
              Nothing counted yet. Events appear here once people use the forms, the booking
              links or the tools.
            </p>
          </div>
        ) : (
          <div className="admin-panel">
            <ul className="admin-terms">
              {totals.map((t) => (
                <li key={t.event}>
                  <span>{t.event.replace(/_/g, ' ')}</span>
                  <span>{t.count}</span>
                </li>
              ))}
            </ul>
            {channels.length > 0 && (
              <>
                <h3 style={{ marginTop: 22 }}>Visits by channel</h3>
                <p style={{ color: 'var(--ink-soft)', margin: '4px 0 8px', fontSize: '.92em' }}>
                  Visits whose link carried ?utm_source= naming a kind of organisation: gbp is the
                  Google Business Profile (including the earlier gbp-only count), the others are the
                  tags in docs/LISTINGS_PACK.md and docs/OUTREACH.md. Once per session. Never a person.
                </p>
                <ul className="admin-terms">
                  {channels.map((r) => (
                    <li key={r.detail}>
                      <span>{r.detail}</span>
                      <span>{r.count}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {landingClasses.rows.length > 0 && (
              <>
                <h3 style={{ marginTop: 22 }}>Where sessions began, by referrer</h3>
                <p style={{ color: 'var(--ink-soft)', margin: '4px 0 8px', fontSize: '.92em' }}>
                  The first page of each session, by the kind of site that linked to it. Only the
                  class is recorded, never the address.{landingsSince && ` Counted since ${landingsSince}.`}
                </p>
                <ul className="admin-terms">
                  {landingClasses.rows.map((r) => (
                    <li key={r.detail}>
                      <span>{r.detail}</span>
                      <span>{r.count}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {aiPages.length > 0 && (
              <>
                <h3 style={{ marginTop: 22 }}>Pages that AI assistants send people to</h3>
                <p style={{ color: 'var(--ink-soft)', margin: '4px 0 8px', fontSize: '.92rem' }}>
                  Visits whose referrer was ChatGPT, Gemini, Claude, Perplexity or Copilot. Most
                  assistant hand-offs carry no referrer, so this is a floor, not the total.
                </p>
                <ul className="admin-terms">
                  {aiPages.map((p) => (
                    <li key={p.path}>
                      <Link href={p.path}>{p.path}</Link>
                      <span>{p.count}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {(emailClicks.rows.length > 0 || emailClicks.unattributed > 0) && (
              <>
                <h3 style={{ marginTop: 22 }}>The email address, pressed</h3>
                <p style={{ color: 'var(--ink-soft)', margin: '4px 0 8px', fontSize: '.92rem' }}>
                  Presses of a mailto: link, by place, beside the messages written through the forms
                  ({totals.find((t) => t.event === 'enquiry_submit')?.count ?? 0}). A press opens the
                  visitor&rsquo;s own mail app; whether they sent anything shows in the inbox, not here.
                </p>
                <ul className="admin-terms">
                  {emailClicks.rows.map((r) => (
                    <li key={r.detail}>
                      <span>{r.detail}</span>
                      <span>{r.count}</span>
                    </li>
                  ))}
                  {emailClicks.unattributed > 0 && <li><span>no place recorded</span><span>{emailClicks.unattributed}</span></li>}
                </ul>
              </>
            )}
            {enquiryPages.length > 0 && (
              <>
                <h3 style={{ marginTop: 22 }}>Pages that earn messages</h3>
                <ul className="admin-terms">
                  {enquiryPages.map((p) => (
                    <li key={p.path}>
                      <Link href={p.path}>{p.path}</Link>
                      <span>{p.count}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {refused.rows.length > 0 && (
              <>
                <h3 style={{ marginTop: 22 }}>Messages the form turned back</h3>
                <p style={{ color: 'var(--ink-soft)', fontSize: 14 }}>Counted since 1 Oct 2026, by the rule the message failed. Nothing of what was typed is kept. A high &ldquo;detail&rdquo; count means the twenty-word rule is stopping people.</p>
                <ul className="admin-terms">
                  {refused.rows.map((r) => (
                    <li key={r.detail}>
                      <span>{({ email: 'email address not valid', detail: 'under about twenty words or one sentence', choices: 'a required choice missing', repeated: 'same text in every field' } as Record<string, string>)[r.detail] ?? r.detail}</span>
                      <span>{r.count}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {bookPages.length > 0 && (
              <>
                <h3 style={{ marginTop: 22 }}>Pages that earn booking clicks</h3>
                <p style={{ color: 'var(--ink-soft)', margin: '4px 0 8px', fontSize: '.92em' }}>
                  Each page&rsquo;s booking clicks against the sessions that began on it.
                  {landingsSince
                    ? ` Clicks are counted since ${log.since.slice(0, 10) || 'the log began'} and landings since ${landingsSince}, so read the ratio in the last-7-days panel above once it exists.`
                    : ' Landings are not counted yet; they start with the first visit after this deploy.'}
                </p>
                <ul className="admin-terms">
                  {bookVsLanding.map((p) => (
                    <li key={p.path}>
                      <Link href={p.path}>{p.path}</Link>
                      <span>{p.clicks} clicks of {p.landings} landings</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {/* WHICH BUTTON, AND WHOSE. The same clicks as the list above, cut
                the other way. Until 1 Oct 2026 the log held only the page, so
                "the sticky bar or the band?" and "Camille or Savneet?" were
                unanswerable; the older clicks are shown as unattributed
                rather than left out, so the two tables still sum. */}
            {bookClicks.byLocation.length > 0 && (
              <>
                <h3 style={{ marginTop: 22 }}>Booking clicks by button</h3>
                <p style={{ color: 'var(--ink-soft)', margin: '4px 0 8px', fontSize: '.92rem' }}>
                  Which call to action produced the click. The sticky bar on phones was not counted
                  before 1 Oct 2026.
                  {bookClicks.unattributed > 0 && ` ${bookClicks.unattributed} earlier click${bookClicks.unattributed === 1 ? '' : 's'} carry no button.`}
                </p>
                <ul className="admin-terms">
                  {bookClicks.byLocation.map((r) => (
                    <li key={r.detail}>
                      <span>{r.detail}</span>
                      <span>{r.count}</span>
                    </li>
                  ))}
                </ul>
                <h3 style={{ marginTop: 22 }}>Booking clicks by counsellor</h3>
                <p style={{ color: 'var(--ink-soft)', margin: '4px 0 8px', fontSize: '.92rem' }}>
                  The counsellor the link named, which it does on her own pages. A click from the
                  header or a band names nobody; /book then offers both.
                </p>
                <ul className="admin-terms">
                  {bookClicks.byCounsellor.map((r) => (
                    <li key={r.detail}>
                      <Link href={`/practitioners/${r.detail}`}>{r.detail}</Link>
                      <span>{r.count}</span>
                    </li>
                  ))}
                  <li>
                    <span>no counsellor named</span>
                    <span>{bookClicks.noCounsellor}</span>
                  </li>
                </ul>
              </>
            )}
            {calendarRows.length > 0 && (
              <>
                <h3 style={{ marginTop: 22 }}>The calendar, by counsellor</h3>
                <p style={{ color: 'var(--ink-soft)', margin: '4px 0 8px', fontSize: '.92rem' }}>
                  Once a counsellor was chosen: her calendar seen, touched, opened in its own tab, and
                  booked (Cliniko&rsquo;s own confirmation from inside the calendar, counted from 1 Oct 2026),
                  on /book (the free consultation) and in the client portal (paid sessions) apart. The
                  portal counted under /book until 1 Oct 2026. The practice-wide calendar, with nobody
                  chosen, is the difference from the totals above.
                </p>
                <ul className="admin-terms">
                  {calendarRows.map((r) => (
                    <li key={`${r.surface}:${r.who}`}>
                      <span><Link href={`/practitioners/${r.who}`}>{r.who}</Link>, {r.surface === 'portal' ? 'portal' : '/book'}</span>
                      <span>{r.seen} seen · {r.touched} touched · {r.opened} opened · {r.booked} booked</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {(credit.byLanding.length > 0 || credit.byButton.some((b) => b.booked > 0)) && (
              <>
                <h3 style={{ marginTop: 22 }}>Bookings by the page the visit began on</h3>
                <p style={{ color: 'var(--ink-soft)', margin: '4px 0 8px', fontSize: '.92rem' }}>
                  A booking click, and a booking Cliniko confirmed on /book, credited to the first page of
                  the visit and how it arrived (the link&rsquo;s channel, else the referrer class). Counted
                  from 1 Oct 2026; a visit that began before then credits nothing
                  {credit.booked - credit.bookedWithLanding > 0 && `, which is ${credit.booked - credit.bookedWithLanding} booking${credit.booked - credit.bookedWithLanding === 1 ? '' : 's'} so far`}.
                </p>
                <ul className="admin-terms">
                  {credit.byLanding.map((r) => (
                    <li key={`${r.path}|${r.via}`}>
                      <span><Link href={r.path}>{r.path}</Link> <small style={{ color: 'var(--ink-soft)' }}>({r.via})</small></span>
                      <span>{r.clicks} clicks · {r.booked} booked</span>
                    </li>
                  ))}
                </ul>
                <h3 style={{ marginTop: 22 }}>Clicks and bookings per button</h3>
                <p style={{ color: 'var(--ink-soft)', margin: '4px 0 8px', fontSize: '.92rem' }}>
                  Bookings are credited to the last booking button pressed in the visit before Cliniko
                  confirmed; &ldquo;direct&rdquo; pressed none.
                </p>
                <ul className="admin-terms">
                  {credit.byButton.map((r) => (
                    <li key={r.button}>
                      <span>{r.button}</span>
                      <span>{r.clicks} clicks · {r.booked} booked</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {toolOutcomes.rows.length > 0 && (
              <>
                <h3 style={{ marginTop: 22 }}>What the tools concluded</h3>
                <p style={{ color: 'var(--ink-soft)', margin: '4px 0 8px', fontSize: '.92rem' }}>
                  Finished tools, by the outcome they led with. The two reflection tools reach no
                  verdict and are counted by name only. Never the answers.
                </p>
                <ul className="admin-terms">
                  {toolOutcomes.rows.map((r) => (
                    <li key={r.detail}>
                      <span>{r.detail}</span>
                      <span>{r.count}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {magnets.rows.length > 0 && (
              <>
                <h3 style={{ marginTop: 22 }}>One-pagers asked for</h3>
                <ul className="admin-terms">
                  {magnets.rows.map((r) => (
                    <li key={r.detail}>
                      <span>{r.detail}</span>
                      <span>{r.count}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}

        <div id="search-console" className="admin-panel" style={{ marginTop: 22 }}>
          <h3 style={{ marginTop: 0 }}>Search Console</h3>
          <pre style={{ margin: '4px 0 0', fontSize: '.85rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{gscLines(gsc, googleLandings).join('\n')}</pre>
        </div>

        <div id="funnel" className="admin-panel" style={{ marginTop: 22 }}>
            {/* FUNNEL: what the booking-mail job counted in Cliniko, and the
                consult-to-paid join on request. Counts by roster slug only. */}
            <h3 style={{ marginTop: 22 }}>Bookings by counsellor</h3>
            {tallyRead.status !== 'ok' ? (
              <p style={{ color: 'var(--ink-soft)', margin: '4px 0 8px', fontSize: '.92rem' }}>
                No booking tally yet: {tallyRead.reason}.
              </p>
            ) : (
              <>
                <p style={{ color: 'var(--ink-soft)', margin: '4px 0 8px', fontSize: '.92rem' }}>
                  Counted by the booking-mail job as it reads Cliniko
                  {tallyRead.tally.updatedAt ? `, last at ${new Date(tallyRead.tally.updatedAt).toLocaleString('en-CA')}` : ''}.
                </p>
                {[tallyMonth, tallyPrev].map((m) => (
                  <div key={m}>
                    <p style={{ margin: '8px 0 4px', fontWeight: 600 }}>{m}</p>
                    <ul className="admin-terms">
                      {tallyRows(tallyRead.tally, m).map((r) => (
                        <li key={r.slug}>
                          <span>{r.slug}</span>
                          <span>{tallyLine(r.row)}</span>
                        </li>
                      ))}
                      {!tallyRows(tallyRead.tally, m).length && <li><span>nothing recorded</span><span /></li>}
                    </ul>
                  </div>
                ))}
              </>
            )}
            <h3 style={{ marginTop: 22 }}>Consultations → paid, and messages → bookings</h3>
            {!clinikoConfigured() ? (
              <p style={{ color: 'var(--ink-soft)', margin: '4px 0 8px', fontSize: '.92rem' }}>No CLINIKO_API_KEY is set, so this cannot be read.</p>
            ) : !joinsAsked ? (
              <p style={{ margin: '4px 0 8px', fontSize: '.92rem' }}>
                <Link href="/admin?funnel=1#funnel">Read it from Cliniko now</Link>
                <span style={{ color: 'var(--ink-soft)' }}> (for {joinsMonth}; a few seconds, the same figures the monthly email carries)</span>
              </p>
            ) : !joins?.ok ? (
              <p style={{ color: 'var(--ink-soft)', margin: '4px 0 8px', fontSize: '.92rem' }}>Cliniko could not be read just now.</p>
            ) : (
              <pre style={{ margin: '4px 0 8px', fontSize: '.85rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{joinsText}</pre>
            )}
        </div>

        <h2 id="searches" style={{ marginTop: 44 }}>What people search for</h2>
        <p style={{ color: 'var(--ink-soft)', maxWidth: '40.38em' }}>
          Submitted terms from the site&rsquo;s own search box, counted rather than logged.
          There is no record of who searched or when, only how often a term has been used.
          A term with no matching page is a page worth writing.
        </p>
        {searches.length === 0 ? (
          <div className="admin-panel">
            <p style={{ margin: 0 }}>
              Nothing counted yet. Terms appear here once people use{' '}
              <Link href="/search">the search box</Link>.
            </p>
          </div>
        ) : (
          <div className="admin-panel">
            <p style={{ marginTop: 0, color: 'var(--ink-faint)', fontSize: '.92rem' }}>
              {searchTotal} search{searchTotal === 1 ? '' : 'es'} counted · {searches.length} distinct
              term{searches.length === 1 ? '' : 's'} shown, most used first
            </p>
            <ul className="admin-terms">
              {searches.map((t) => (
                <li key={t.term}>
                  <Link href={`/search?q=${encodeURIComponent(t.term)}`}>{t.term}</Link>
                  <span>{t.n}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* The inverse of the list above, and the more useful half. A popular
            term is usually something the site already answers; a term that
            returns nothing is somebody who wanted a page that does not exist
            and left. These are content briefs, written by the people who
            wanted the content. See searchGaps() in lib/search-log.ts. */}
        {gaps.length > 0 && (
          <>
            <h3 style={{ marginTop: 30 }}>Searched for, and not found here</h3>
            <p style={{ color: 'var(--ink-soft)', maxWidth: '40.38em' }}>
              Terms where this site&rsquo;s own search returns nothing, or a single weak match.
              Each one is a visitor who looked for something and hit a dead end. Ordered by how
              many people asked.
            </p>
            <div className="admin-panel">
              <ul className="admin-terms">
                {gaps.map((g) => (
                  <li key={g.term}>
                    <Link href={`/search?q=${encodeURIComponent(g.term)}`}>{g.term}</Link>
                    <span>
                      {g.count}&times; · {g.hits === 0 ? 'no match' : '1 weak match'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* ---------------------------------------------------------- CLIENTS */}
        <h2 id="clients" style={{ marginTop: 40 }}>Clients</h2>
        <p style={{ color: 'var(--ink-soft)', maxWidth: '40.38em' }}>
          Only <strong>active</strong> clients can sign in. <em>Paused</em> keeps the record but
          closes access, for someone between blocks of sessions. <em>Former</em> is for people
          who have finished. Removing deletes the record and any password with it.
        </p>

        {/* SORTABLE BY ANY HEADING — 8 Sep 2026, at the owner's request. Plain
            links carrying ?sort=&dir=, so it works with no JavaScript and the
            row forms are untouched. Default order is the stored order (newest
            added last), which is what the list was before. */}
        {book.clients.length === 0 ? (
          <p className="admin-empty">
            No clients yet. Add the first one below. They can sign in as soon as you do.
          </p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <caption className="sr-only">Clients, their access status and administrative notes</caption>
              <thead>
                <tr>
                  {sortHeader('name', 'Name')}
                  {sortHeader('email', 'Email')}
                  {sortHeader('status', 'Status')}
                  {sortHeader('note', 'Note')}
                  {sortHeader('added', 'Added')}
                  <th scope="col"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {sortedClients.map((c) => (
                  <tr key={c.id} className={c.status !== 'active' ? 'is-muted' : undefined}>
                    <td data-label="Name">
                      <input
                        form={`f-${c.id}`} name="name" defaultValue={c.name}
                        placeholder="Not recorded" aria-label={`Name for ${c.email}`}
                      />
                    </td>
                    <td data-label="Email"><span className="admin-email">{c.email}</span></td>
                    <td data-label="Status">
                      <select
                        form={`f-${c.id}`} name="status" defaultValue={c.status}
                        aria-label={`Status for ${c.email}`}
                      >
                        {Object.entries(STATUS_LABEL).map(([v, l]) => (
                          <option key={v} value={v}>{l}</option>
                        ))}
                      </select>
                    </td>
                    <td data-label="Note">
                      <input
                        form={`f-${c.id}`} name="note" defaultValue={c.note ?? ''}
                        placeholder="Admin only, not clinical"
                        aria-label={`Note for ${c.email}`}
                      />
                    </td>
                    <td data-label="Added" className="admin-date">
                      {c.addedAt ? new Date(c.addedAt).toLocaleDateString('en-CA') : '—'}
                    </td>
                    <td data-label="Actions" className="admin-actions">
                      {/* One form per row: an edit or a removal names the person
                          it affects, so a mistake costs one record rather than
                          rewriting the whole list. */}
                      <form method="POST" action="/api/admin/clients" id={`f-${c.id}`}>
                        <input type="hidden" name="id" value={c.id} />
                        <input type="hidden" name="version" value={book.version} />
                        <button type="submit" name="action" value="update" className="admin-btn">
                          Save
                        </button>
                        <button
                          type="submit" name="action" value="remove"
                          className="admin-btn admin-btn--danger"
                        >
                          Remove
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <form method="POST" action="/api/admin/clients" className="admin-add">
          <h3>Add a client</h3>
          <input type="hidden" name="action" value="add" />
          <input type="hidden" name="version" value={book.version} />
          <div className="admin-add-row">
            <label htmlFor="new-name" className="sr-only">Name</label>
            <input id="new-name" name="name" placeholder="Name" autoComplete="off" />
            <label htmlFor="new-email" className="sr-only">Email</label>
            <input
              id="new-email" name="email" type="email" required placeholder="name@example.com"
              autoComplete="off" autoCapitalize="none" spellCheck={false}
            />
            <label htmlFor="new-note" className="sr-only">Note</label>
            <input id="new-note" name="note" placeholder="Note (optional)" autoComplete="off" />
            <button type="submit" className="btn btn--primary">Add</button>
          </div>
        </form>

        <p className="admin-meta">
          {book.updatedAt
            ? `Last changed ${new Date(book.updatedAt).toLocaleString('en-CA')} by ${book.updatedBy}. Version ${book.version}.`
            : 'No changes recorded yet.'}
        </p>

        {/* No availability editor. There was one here until 6 Sep 2026, driving
            the hours in the footer, on /contact and in the schema. The owner
            asked for no hours to be published anywhere — they depend on which
            counsellor a person sees, and Cliniko is the only thing that knows
            what is actually open — so the editor went with them. */}

        {/* --------------------------------------------------------- BOOKINGS */}
        <h2 id="bookings" style={{ marginTop: 44 }}>Bookings</h2>
        <div className="admin-panel">
          <p style={{ marginTop: 0 }}>
            <strong>Bookings are not held here, deliberately.</strong> Cliniko is the record.
            It takes the payment, issues the invoice and holds the clinical file. A copy on this
            site would drift out of step within a day, and would put clinical information in a
            second system in another country for no benefit.
          </p>
          <p style={{ marginBottom: 0 }}>
            {site.bookingReady ? (
              <a className="btn btn--ghost" href={site.bookingsUrl} target="_blank" rel="noopener">
                Open Cliniko bookings
              </a>
            ) : (
              <>
                Set <code>NEXT_PUBLIC_CLINIKO_URL</code> to embed the calendar on{' '}
                <Link href="/book">/book</Link> and in the client portal.
              </>
            )}
          </p>
        </div>

        {/* -------------------------------------------------------- PASSWORDS */}
        <h2 id="passwords" style={{ marginTop: 44 }}>Passwords</h2>
        <div className="admin-panel">
          <p style={{ marginTop: 0 }}>
            Rarely needed. Anyone on the list can set or reset their own from{' '}
            <Link href="/forgot">the reset page</Link>, which emails a one-time link. Use this
            only when someone cannot receive that email. Clients signing in with Google never
            need one.
          </p>
          <form method="POST" action="/api/admin/password" className="admin-add-row">
            <label htmlFor="pw-target" className="sr-only">Client email</label>
            <input
              id="pw-target" name="target" type="email" required placeholder="name@example.com"
              autoComplete="off" autoCapitalize="none" spellCheck={false}
            />
            <label htmlFor="pw-value" className="sr-only">New password</label>
            <input
              id="pw-value" name="password" type="text" minLength={10}
              placeholder="At least 10 characters" autoComplete="off" spellCheck={false}
            />
            <button type="submit" className="btn btn--primary">Set</button>
            <button type="submit" name="clear" value="1" className="btn btn--ghost">Remove</button>
          </form>
          {withPasswords.length > 0 && (
            <p className="admin-meta" style={{ marginBottom: 0 }}>
              Has a password: {withPasswords.join(', ')}
            </p>
          )}
        </div>

        {/* ----------------------------------------------------- PAID SESSIONS */}
        <h2 id="paid-sessions" style={{ marginTop: 44 }}>Paid sessions</h2>
        <div className="admin-panel">
          <p style={{ marginTop: 0 }}>
            The detail behind the monthly report&rsquo;s &ldquo;paid sessions&rdquo; line: one tab
            per practitioner, listing every session that <strong>received funds</strong> in the
            period, plus a summary tab. Free consultations are excluded &mdash; they belong to
            &ldquo;consultations booked&rdquo;.
          </p>
          <p style={{ color: 'var(--ink-soft)', fontSize: '.94rem' }}>
            Counted as invoices <em>closed</em> in the month, because that is when the money
            arrived. A session that happened and was never paid does not appear; an invoice paid
            this month for last month&rsquo;s session does.
          </p>
          <form method="GET" action="/api/admin/paid-sessions" className="admin-add-row">
            <label htmlFor="ps-month" className="sr-only">Month</label>
            <input
              id="ps-month"
              name="month"
              type="month"
              defaultValue={new Date(Date.now() - 15 * 864e5).toISOString().slice(0, 7)}
            />
            <button className="btn btn--primary" type="submit">Download spreadsheet</button>
          </form>
          <p style={{ fontSize: '.88rem', color: 'var(--ink-faint)', marginBottom: 0 }}>
            The file contains client names against amounts. Treat it like the client list.
          </p>
          <p style={{ marginBottom: 0 }}>
            <Link href="/admin/revenue">Every invoice by month, with the session, type and payment behind it</Link>
          </p>
        </div>

        {/* ---------------------------------------------------------- CLINIKO */}
        <h2 id="cliniko" style={{ marginTop: 44 }}>Cliniko connection</h2>
        <div className="admin-panel">
          <p style={{ marginTop: 0 }}>
            {clinikoConfigured()
              ? 'A key is set. Enter an address that exists in Cliniko to confirm lookups work.'
              : 'No key set, so the client list above is the only thing granting access.'}{' '}
            Cliniko can only ever <em>add</em> a way to qualify, if it is unreachable, everyone
            on the list still gets in.
          </p>
          <form method="POST" action="/api/admin/cliniko" className="admin-add-row">
            <label htmlFor="ck" className="sr-only">Test an address</label>
            <input
              id="ck" name="probe" type="email" required placeholder="someone@example.com"
              autoComplete="off" autoCapitalize="none" spellCheck={false}
            />
            <button type="submit" className="btn btn--ghost">Test connection</button>
          </form>

          <hr style={{ border: 'none', borderTop: '1px solid var(--rule)', margin: '22px 0 18px' }} />

          {/* WHETHER THE PUBLIC FEES ARE THE REAL ONES.
              readCatalog() has always returned `live` — true when the prices
              came from Cliniko, false when they are the hardcoded fallback —
              and nothing anywhere read it. So a lapsed API key showed as a
              working site: /pricing kept rendering, from a copy of the fees
              that stops being checked the moment the connection stops working.
              Silent, and on the page where being wrong costs the most. */}
          <p role="status" className={catalog.live ? 'admin-ok' : 'portal-gate-error'} style={{ marginTop: 0 }}>
            {catalog.live ? (
              <>
                <strong>Fees on /pricing are live from Cliniko.</strong>{' '}
                {catalog.fetchedAt
                  ? `Last read ${new Date(catalog.fetchedAt).toLocaleString('en-CA', { timeZone: 'America/Vancouver' })}.`
                  : ''}
              </>
            ) : (
              <>
                <strong>Fees on /pricing are the built-in fallback, not Cliniko.</strong>{' '}
                The page still works and the numbers still match what was last verified, but
                a fee changed in Cliniko will not appear until the connection is working.
                Check the key, then use Sync now.
              </>
            )}
          </p>

          <p style={{ marginTop: 0 }}>
            Every active Cliniko patient is pulled onto the list automatically every two hours,
            along with session prices and durations. Use this to pull now rather than waiting,
            after adding someone in Cliniko, or after changing a fee.
          </p>
          {syncNote && (
            <p role="status" className={syncOk ? 'admin-ok' : 'portal-gate-error'} style={{ marginTop: 0 }}>
              {syncNote}
            </p>
          )}
          <form method="POST" action="/api/admin/sync">
            <button type="submit" className="btn btn--primary">Sync from Cliniko now</button>
          </form>
        </div>

        <h2 id="audit" style={{ marginTop: 44 }}>Recent changes</h2>
        {/* Not a security control — anyone who can reach this page can reach
            the store behind it. It answers the ordinary question instead: two
            people share this login, something is missing, and nobody could say
            what happened. Actions and identifiers only; never what changed,
            because an erasure log that quoted what was erased would have moved
            the data rather than removed it. */}
        {audit.length === 0 ? (
          <p className="admin-meta">
            Nothing recorded yet. Adding, editing, removing a client and erasing an enquiry
            are logged here from now on.
          </p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>When</th><th>Who</th><th>Action</th><th>What</th></tr>
              </thead>
              <tbody>
                {audit.map((a, n) => (
                  <tr key={`${a.at}-${n}`}>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {new Date(a.at).toLocaleString('en-CA', { timeZone: 'America/Vancouver' })}
                    </td>
                    <td>{a.actor}</td>
                    <td>{a.action}</td>
                    <td style={{ fontSize: '.9em', color: 'var(--ink-faint)' }}>{a.subject}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="admin-meta" style={{ marginTop: 34 }}>
          Signed in as {email}. Client changes take effect on the person&rsquo;s next request.
          Availability changes regenerate the public pages that show them, which usually takes
          a few seconds. Environment variables still need a redeploy. See{' '}
          <code>ADMIN_NOTES.md</code>.
        </p>
      </div>
    </section>
  );
}

/* LAST 7 DAYS — 1 Oct 2026. The two newest Monday snapshots of the counters,
   subtracted (lib/conversion-snapshots.ts), so the week reads as counts for
   that week rather than one total since 18 Aug. Booking clicks are shown
   against landings here as well, where both cover the same seven days. */
function WeekPanel({ week, snapshots, weeks }: { week: ReturnType<typeof lastWeek>; snapshots: number; weeks: WeekRow[] }) {
  if (!week) {
    return (
      <div className="admin-panel">
        <h3 style={{ marginTop: 0 }}>Last 7 days</h3>
        <p style={{ margin: 0, color: 'var(--ink-soft)' }}>
          {snapshots === 0
            ? 'No weekly snapshot yet. The counters are copied every Monday; this shows the week between the two newest copies.'
            : 'One Monday snapshot so far. The first weekly counts appear after the next one.'}
        </p>
      </div>
    );
  }
  const day = (iso: string) => iso.slice(0, 10);
  const clicks = week.events.find((e) => e.event === 'book_click');
  const landings = week.events.find((e) => e.event === 'landing');
  const landingOn = (path: string) => landings?.byPath.find((r) => r.key === path)?.count ?? 0;
  return (
    <div className="admin-panel">
      <h3 style={{ marginTop: 0 }}>Week by week</h3>
      <WeekTable rows={weeks} />
      <details style={{ marginTop: 14 }}>
      <summary style={{ cursor: 'pointer' }}>
        Everything counted between {day(week.from)} and {day(week.to)}: {week.total} event{week.total === 1 ? '' : 's'}
      </summary>
      {week.events.length === 0 ? (
        <p style={{ margin: 0 }}>Nothing counted that week.</p>
      ) : (
        <ul className="admin-terms">
          {week.events.map((e) => (
            <li key={e.event}>
              <span>
                {e.event.replace(/_/g, ' ')}
                {e.byDetail.length > 0 && (
                  <small style={{ color: 'var(--ink-soft)' }}>
                    {' '}({e.byDetail.slice(0, 4).map((r) => `${r.key} ${r.count}`).join(', ')})
                  </small>
                )}
              </span>
              <span>{e.count}</span>
            </li>
          ))}
        </ul>
      )}
      </details>
      {clicks && clicks.byPath.length > 0 && (
        <>
          <h3 style={{ marginTop: 18 }}>Booking clicks that week, against landings</h3>
          <ul className="admin-terms">
            {clicks.byPath.slice(0, 10).map((r) => (
              <li key={r.key}>
                <Link href={r.key}>{r.key}</Link>
                <span>{r.count} clicks of {landingOn(r.key)} landings</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

/* EIGHT WEEKS, PER COUNSELLOR — 1 Oct 2026. Built by weekTable() in
   lib/conversion-snapshots.ts from the newest nine Monday snapshots: the
   site's counters, the booking tally and the open consultation slots each
   one copied, plus the messages written on /book that week (mostly "None of
   these times work?"). A dash is a column that was not counted yet; a
   marked week says why it is partial. */
function WeekTable({ rows }: { rows: WeekRow[] }) {
  if (!rows.length) return null;
  const who = Array.from(new Set(rows.map((r) => r.who)));
  const n = (v: number | null) => (v === null ? '–' : v);
  const cell: React.CSSProperties = { padding: '4px 8px', borderBottom: '1px solid var(--line)', textAlign: 'right', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' };
  const head: React.CSSProperties = { ...cell, fontWeight: 600, fontSize: '.8rem', color: 'var(--ink-soft)' };
  return (
    <>
      {who.map((w) => (
        <div key={w} style={{ marginTop: 12, overflowX: 'auto' }}>
          <p style={{ margin: '0 0 4px', fontWeight: 600 }}>{w === 'all' ? 'The practice (/book; the portal is left out)' : w}</p>
          <table style={{ borderCollapse: 'collapse', fontSize: '.85rem', minWidth: 640 }}>
            <thead>
              <tr>
                <th style={{ ...head, textAlign: 'left' }}>week to</th>
                <th style={head}>landings</th>
                <th style={head}>book clicks</th>
                <th style={head}>calendar seen</th>
                <th style={head}>touched</th>
                <th style={head}>booked</th>
                <th style={head}>consults booked</th>
                <th style={head}>held</th>
                <th style={head}>paid booked</th>
                <th style={head}>missed</th>
                <th style={head}>open consult slots</th>
                <th style={head}>time asked for</th>
              </tr>
            </thead>
            <tbody>
              {rows.filter((r) => r.who === w).map((r) => (
                <tr key={r.to} title={r.partial.join('; ') || undefined}>
                  <td style={{ ...cell, textAlign: 'left' }}>{r.to.slice(0, 10)}{r.partial.length > 0 && ' *'}</td>
                  <td style={cell}>{n(r.landing)}</td>
                  <td style={cell}>{n(r.bookClick)}</td>
                  <td style={cell}>{n(r.visible)}</td>
                  <td style={cell}>{n(r.interact)}</td>
                  <td style={cell}>{n(r.booked)}</td>
                  <td style={cell}>{n(r.consultBooked)}</td>
                  <td style={cell}>{n(r.consultHeld)}</td>
                  <td style={cell}>{n(r.paidBooked)}</td>
                  <td style={cell}>{n(r.dna)}</td>
                  <td style={cell}>{r.slots === null ? '–' : `${r.slots}${r.slotDays.length ? ` (${r.slotDays.join(', ')})` : ''}`}</td>
                  <td style={cell}>{r.timeRequests}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      {rows.some((r) => r.partial.length) && (
        <ul style={{ margin: '8px 0 0', paddingLeft: 18, color: 'var(--ink-soft)', fontSize: '.85rem' }}>
          {Array.from(new Set(rows.filter((r) => r.who === 'all' && r.partial.length).map((r) => `* week to ${r.to.slice(0, 10)}: ${r.partial.join('; ')}`))).map((t) => <li key={t}>{t}</li>)}
        </ul>
      )}
      <p style={{ margin: '8px 0 0', color: 'var(--ink-soft)', fontSize: '.85rem' }}>
        Open consult slots are the free consultations Cliniko showed for the 14 days after the week
        began. A counsellor&rsquo;s book clicks are the ones whose link named her; her calendar
        columns are her calendar on /book.
      </p>
    </>
  );
}
