import test from 'node:test';
import assert from 'node:assert/strict';
import { checklistEmail, icbcEmail, startingEmail, enquiryAck } from '../lib/inbound-mail.ts';
import { email2, email3, unsubHeaders, unsubLink, unsubToken } from '../lib/nurture.ts';
import { rosterLines, rosterButtons } from '../lib/lead-roster.ts';
import { links, tagged } from '../lib/booking-mail.ts';
import { sendDetailed } from '../lib/portal-mail.ts';
import { inviteBody } from '../lib/portal-invite.ts';
import { site } from '../lib/site.ts';

/* The client mail outside the booking job, 1 Oct 2026 (wf/client-mail):
   the inbox preview line on the lead, nurture, acknowledgement and portal
   mail (#287), the booking step in nurture email 2 and the roster buttons in
   email 1 (#293), the reply-to and the shell on the portal mail (#285), and
   the one-click List-Unsubscribe headers with their POST handler (#286).
   Nothing here sends: the one test of the Resend call replaces fetch. */

const preheaderOf = (html: string) => (/<div style="display:none;[^"]*">\s*([\s\S]*?)(?:&#8203;|<\/div>)/.exec(html)?.[1] ?? '').trim();
const h1Of = (html: string) => (/<h1[^>]*>([\s\S]*?)<\/h1>/.exec(html)?.[1] ?? '').trim();
const hrefs = (html: string) => [...html.matchAll(/href="([^"]+)"/g)].map((x) => x[1]);
const buttons = (html: string) =>
  [...html.matchAll(/<a href="([^"]+)" style="display:inline-block;[^"]*">([^<]+)<\/a>/g)].map((x) => ({ href: x[1], label: x[2] }));

const UNSUB = `${site.domain}/api/unsubscribe?e=sam%40gmail.com&t=abc`;

/* ---- #287 preview lines ---------------------------------------------------- */

test('no lead, nurture, acknowledgement or portal email has a preview line equal to its heading', () => {
  const roster = rosterLines();
  const mails = [
    checklistEmail('Sam', { unsub: UNSUB, roster }), icbcEmail('Sam', { unsub: UNSUB, roster }), startingEmail('', { roster }),
    enquiryAck('Sam'), enquiryAck('Sam', { who: 'Camille Granda, RCC, CCC', bookHref: `${site.domain}/book?with=camille-granda#calendar` }),
    email2('Sam', 'sam@gmail.com', undefined, { roster }), email3('Sam', 'sam@gmail.com', undefined, { roster }),
    { subject: 'invite', ...inviteBody('Sam', `${site.domain}/reset?token=x`) },
    { subject: 'welcome', ...inviteBody('Sam', `${site.domain}/reset?token=x`, true) },
  ];
  for (const m of mails) {
    const pre = preheaderOf(m.html);
    assert.ok(pre.length > 10, m.subject);
    assert.notEqual(pre, h1Of(m.html), m.subject);
  }
});

test('the acknowledgement preview says who replies and by when, without letters', () => {
  const named = enquiryAck('Sam', { who: 'Camille Granda, RCC, CCC', bookHref: `${site.domain}/book?with=camille-granda#calendar` });
  assert.equal(preheaderOf(named.html), 'Camille Granda will reply within one business day');
  assert.equal(preheaderOf(enquiryAck('Sam').html), 'The practice will reply within one business day');
});

/* ---- #293 a booking step in the lead and nurture mail --------------------- */

test('nurture email 2 leads to the free call: its button is the consultation page, then each counsellor', () => {
  const roster = rosterLines();
  const m = email2('Sam', 'sam@gmail.com', undefined, { roster });
  const first = buttons(m.html)[0];
  assert.equal(first.label, 'What the free 15 minutes is like');
  assert.equal(first.href, tagged(links.consultPrep, 'nurture2'));
  /* The paid first-session guide stays, as a link rather than the button. */
  assert.ok(hrefs(m.html).includes(tagged(links.firstSession, 'nurture2')));
  assert.ok(!buttons(m.html).some((b) => b.href.startsWith(links.firstSession)));
  for (const l of roster) {
    assert.ok(hrefs(m.html).includes(tagged(l.href, 'nurture2')), l.slug);
    assert.ok(m.text.includes(tagged(l.href, 'nurture2')), l.slug);
  }
  assert.ok(m.text.includes(tagged(links.consultPrep, 'nurture2')));
  /* With nobody accepting, the practice calendar instead of an empty list. */
  const none = email2('Sam', 'sam@gmail.com', undefined, { roster: [] });
  assert.ok(buttons(none.html).some((b) => b.href === tagged(links.book, 'nurture2')));
});

test('email 1 ends with a button per counsellor, "Free 15-minute call with <name>", to her calendar', () => {
  const roster = rosterLines();
  assert.ok(roster.length >= 1);
  for (const make of [checklistEmail, icbcEmail, startingEmail]) {
    const m = make('Sam', { unsub: UNSUB, roster });
    const bs = buttons(m.html);
    for (const l of roster) {
      assert.ok(bs.some((b) => b.label === `Free 15-minute call with ${l.firstName}` && b.href === tagged(l.href, 'magnet')), `${make.name}: ${l.slug}`);
    }
  }
  assert.equal(rosterButtons([]), '');
  assert.ok(!rosterButtons(roster).includes('aman-bains-dhillon'));
});

test('lead and nurture links carry their template; the unsubscribe link is never tagged', () => {
  const m = checklistEmail('Sam', { unsub: UNSUB, roster: rosterLines() });
  for (const h of hrefs(m.html).filter((x) => x.startsWith(site.domain))) {
    if (h.startsWith(`${site.domain}/api/`)) assert.equal(h, UNSUB);
    else assert.ok(h.includes('utm_campaign=magnet'), h);
  }
  const n3 = email3('Sam', 'sam@gmail.com', undefined, { roster: rosterLines() });
  assert.ok(hrefs(n3.html).includes(unsubLink('sam@gmail.com')));
  assert.ok(hrefs(n3.html).filter((h) => h.startsWith(site.domain) && !h.includes('/api/')).every((h) => h.includes('utm_campaign=nurture3')));
});

/* ---- #286 List-Unsubscribe ------------------------------------------------- */

test('the List-Unsubscribe headers name the signed link and the practice address, one-click', () => {
  const h = unsubHeaders('Sam@Gmail.com');
  assert.equal(h['List-Unsubscribe'], `<${unsubLink('Sam@Gmail.com')}>, <mailto:${site.email}?subject=unsubscribe>`);
  assert.equal(h['List-Unsubscribe-Post'], 'List-Unsubscribe=One-Click');
  assert.ok(unsubLink('Sam@Gmail.com').startsWith('https://'), 'RFC 8058 requires an https URI');
});

test('the unsubscribe route answers a one-click POST the same way whatever the token', async () => {
  const { POST, GET } = await import('../app/api/unsubscribe/route.ts');
  assert.equal(typeof GET, 'function');
  const good = unsubLink('sam@gmail.com');
  for (const url of [good, `${site.domain}/api/unsubscribe?e=sam%40gmail.com&t=${'0'.repeat(32)}`, `${site.domain}/api/unsubscribe`]) {
    for (const body of ['List-Unsubscribe=One-Click', '', 'anything']) {
      const res = await POST(new Request(url, { method: 'POST', body, headers: { 'content-type': 'application/x-www-form-urlencoded' } }));
      assert.equal(res.status, 200);
      assert.equal(await res.text(), '');
    }
  }
  assert.equal(unsubToken('sam@gmail.com').length, 32);
});

/* ---- #285 reply-to and headers in the one send call ------------------------ */

test('sendDetailed defaults reply_to to the practice, keeps a given one, and passes headers only when given', async () => {
  const saved = { fetch: globalThis.fetch, key: process.env.RESEND_API_KEY, from: process.env.PORTAL_FROM_EMAIL };
  const bodies: Record<string, unknown>[] = [];
  globalThis.fetch = (async (_url: string, init: { body: string }) => {
    bodies.push(JSON.parse(init.body));
    return new Response('{}', { status: 200 });
  }) as unknown as typeof fetch;
  process.env.RESEND_API_KEY = 'test-key-not-real';
  process.env.PORTAL_FROM_EMAIL = 'test@example.invalid';
  try {
    await sendDetailed('a@example.invalid', 's', 't');
    await sendDetailed('a@example.invalid', 's', 't', undefined, { replyTo: ['x@example.invalid', site.email] });
    await sendDetailed('a@example.invalid', 's', 't', undefined, { headers: unsubHeaders('a@example.invalid') });
  } finally {
    globalThis.fetch = saved.fetch;
    if (saved.key === undefined) delete process.env.RESEND_API_KEY; else process.env.RESEND_API_KEY = saved.key;
    if (saved.from === undefined) delete process.env.PORTAL_FROM_EMAIL; else process.env.PORTAL_FROM_EMAIL = saved.from;
  }
  assert.deepEqual(bodies[0].reply_to, [site.email]);
  assert.equal(bodies[0].headers, undefined, 'no headers unless asked: booking and portal mail is transactional');
  assert.deepEqual(bodies[1].reply_to, ['x@example.invalid', site.email]);
  assert.equal((bodies[2].headers as Record<string, string>)['List-Unsubscribe-Post'], 'List-Unsubscribe=One-Click');
});

test('the portal invite uses the shared shell and escapes the first name', () => {
  const { html, text } = inviteBody('<b>Sam&Co', `${site.domain}/reset?token=abc`, true);
  assert.ok(html.includes('&lt;b&gt;Sam&amp;Co') && !html.includes('<b>Sam'));
  assert.ok(html.includes('<meta name="color-scheme" content="light">'));
  assert.ok(html.includes('9-8-8') && html.includes(`${site.domain}/privacy`), 'the standard footer');
  assert.ok(hrefs(html).includes(`${site.domain}/reset?token=abc`));
  assert.ok(text.startsWith('Hi <b>Sam&Co,'), 'plain text is not HTML and is left as given');
});
