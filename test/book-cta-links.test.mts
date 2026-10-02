import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { FALLBACK_CATALOG, money } from '../lib/cliniko-catalog.ts';
import { sessionFees, sessionFeesPhrase, couplesFees, sessionLengthsLine } from '../lib/book-fees.ts';
import { askForTimeHref, audienceConsultSlugs, bookingFor, ASK_FOR_A_TIME } from '../lib/booking-cta.ts';
import { audiences, getAudience, ROTATION } from '../lib/audiences.ts';
import { practitioners } from '../lib/practitioners.ts';
import { allowedDetail, BOOK_LOCATIONS } from '../lib/conversion-detail.ts';
import { withSlugOf } from '../lib/conversion-detail-client.ts';
import { opensCalendar } from '../lib/scheduler-open.ts';
import { bookHrefFor } from '../lib/city-service-page.ts';
import { readdirSync } from 'node:fs';

/* wf/book-and-cta, 1 Oct 2026: items 259, 270, 280, 281, 288, 289. */

const ROOT = process.cwd();
const src = (p: string) => readFileSync(join(ROOT, p), 'utf8');
const fee = (name: string) => FALLBACK_CATALOG.items.find((i) => i.name === name)!;
const savneet = practitioners.find((p) => p.slug === 'savneet-singh')!;
const camille = practitioners.find((p) => p.slug === 'camille-granda')!;

/* ---------- 280: /book?with= shows only her session types ---------- */

test('the /book fee line narrows to the chosen counsellor’s services', () => {
  const ind = fee('Individual Counselling');
  assert.ok(!savneet.services.includes('couples-therapy'), 'premise: Savneet offers no couples work');
  assert.equal(sessionFeesPhrase(FALLBACK_CATALOG, { services: savneet.services }), `individual ${money(ind.cents)}, ${ind.minutes} minutes`);
  assert.deepEqual(sessionFees(FALLBACK_CATALOG, savneet.services).map((f) => f.label), ['individual']);
  assert.deepEqual(sessionFees(FALLBACK_CATALOG, camille.services).map((f) => f.label), ['individual', 'couples']);
  assert.equal(sessionFeesPhrase(FALLBACK_CATALOG), sessionFeesPhrase(FALLBACK_CATALOG, {}), 'bare /book is unchanged');
  assert.equal(sessionFeesPhrase(FALLBACK_CATALOG, { services: [] }), null, 'nobody’s services, no line');
});

test('the session-length bullet comes from the catalogue, narrowed the same way', () => {
  const ind = fee('Individual Counselling').minutes;
  const c1 = fee('Couples Counselling').minutes;
  const c2 = fee('Couples Extended').minutes;
  assert.equal(sessionLengthsLine(FALLBACK_CATALOG), `Individual sessions are ${ind} minutes; couples sessions are ${c1} or ${c2} minutes`);
  assert.equal(sessionLengthsLine(FALLBACK_CATALOG, { services: savneet.services }), `Individual sessions are ${ind} minutes`);
  assert.equal(sessionLengthsLine(FALLBACK_CATALOG, { couples: true }), `Couples sessions are ${c1} or ${c2} minutes`);
  const page = src('app/book/page.tsx');
  assert.doesNotMatch(page, /couples sessions are 50 or 110/, 'the typed bullet is gone');
});

test('/book links her profile, not /about', () => {
  const page = src('app/book/page.tsx');
  assert.match(page, /href=\{`\/practitioners\/\$\{who\.slug\}`\}>about \{who\.name\.split\(' '\)\[0\]\}<\/Link>/);
  assert.match(page, /<Link href="\/practitioners">the counsellors&rsquo; profiles<\/Link>/);
  assert.doesNotMatch(page, /href="\/about"/);
});

/* ---------- 270: a couples consultation ---------- */

test('a couples consultation shows the two couples formats and nothing else', () => {
  const c1 = fee('Couples Counselling');
  const c2 = fee('Couples Extended');
  assert.deepEqual(couplesFees(FALLBACK_CATALOG).map((f) => f.fee), [money(c1.cents), money(c2.cents)]);
  assert.equal(
    sessionFeesPhrase(FALLBACK_CATALOG, { couples: true }),
    `couples ${money(c1.cents)} (${c1.minutes} minutes), couples extended ${money(c2.cents)} (${c2.minutes} minutes)`,
  );
  assert.doesNotMatch(sessionFeesPhrase(FALLBACK_CATALOG, { couples: true })!, /individual/);
});

test('/book honours for=couples only with a counsellor who offers couples work, and says only what is already said', () => {
  const page = src('app/book/page.tsx');
  assert.match(page, /searchParams\?\.for === 'couples' && !!who && who\.services\.includes\('couples-therapy'\)/);
  assert.match(page, /What brought \{couples \? 'the two of you' : 'you'\} here/);
  assert.match(page, /openDetail=\{couples \? 'couples' : undefined\}/);
  /* Owner check pending (two devices, a separate $0 type): the line says no
     more than lib/depth-services.ts already does. */
  assert.match(src('lib/depth-services.ts'), /free 30-minute consultation that both partners can join/);
  assert.match(page, /both partners\s+can join the free 30-minute consultation/);
  assert.doesNotMatch(page, /two devices|same video link/);
});

test('couples links carry for=couples and open the calendar; scheduler_open counts couples', () => {
  const href = bookingFor('couples-therapy').href;
  assert.equal(href, `/book?with=${camille.slug}&for=couples#calendar`);
  assert.equal(withSlugOf(href), camille.slug, 'the click is still attributed to her');
  assert.equal(opensCalendar(href, '/book'), true);
  assert.equal(getAudience('couples')!.service, 'couples-therapy');
  assert.equal(allowedDetail('scheduler_open', 'couples'), 'couples');
  assert.equal(allowedDetail('scheduler_open', 'button'), 'button');
});

/* ---------- 259: a link that names her opens her calendar ---------- */

test('every narrowed booking href ends in #calendar; bare /book never does', () => {
  for (const svc of [undefined, 'individual-therapy', 'couples-therapy', 'emdr-therapy', 'family-counselling', 'punjabi-counselling']) {
    for (const lang of [undefined, 'pa', 'tl']) {
      const t = bookingFor(svc, lang);
      if (t.slug) assert.match(t.href, /\?with=[a-z-]+(&for=couples)?#calendar$/, `${svc}/${lang}`);
      else assert.equal(t.href, '/book', `${svc}/${lang}`);
    }
  }
  /* Since 2 Oct 2026 the line builds its href with bookHrefFor, which ends
     in #calendar and adds for=couples on a couples page (item 354). */
  assert.match(src('components/NextConsultLine.tsx'), /href=\{bookHrefFor\(practitioners\.filter\(\(p\) => p\.slug === e\.slug\), service\)\}/);
  assert.doesNotMatch(src('lib/lead-roster.ts'), /bookHrefFor\(\[p\]\)\}#calendar/, 'no doubled hash');
});

/* ---------- 288: the Gurmukhi line, moved not duplicated ---------- */

test('the Gurmukhi line on /book is the reviewed /punjabi sentence, once, and moves under the heading for a Punjabi booking', () => {
  const sentence = 'ਸੈਸ਼ਨ ਪੰਜਾਬੀ ਵਿੱਚ, ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ, ਜਾਂ ਦੋਹਾਂ ਵਿੱਚ ਹੋ ਸਕਦੇ ਹਨ।';
  const page = src('app/book/page.tsx');
  /* /punjabi runs the clause on with a comma; the words are the same. */
  assert.ok(src('app/punjabi/page.tsx').includes(sentence.slice(0, -1)), 'the sentence is the reviewed /punjabi copy');
  assert.equal(page.split(sentence).length - 1, 1, 'on /book exactly once in the source');
  assert.equal(page.split('ਪੰਜਾਬੀ ਵਿੱਚ ਜਾਣਕਾਰੀ').length - 1, 1, 'the link label once');
  assert.match(page, /\{paFirst && <p style=\{\{ margin: '10px 0 0' \}\}>\{punjabiLine\}<\/p>\}/);
  assert.match(page, /&& !paFirst && <p>\{punjabiLine\}<\/p>/);
  /* No Gurmukhi on the page beyond those two strings. */
  const gurmukhi = page.match(/[਀-੿][਀-੿\s,।]*/g) ?? [];
  assert.deepEqual(gurmukhi.map((g) => g.trim()), [sentence, 'ਪੰਜਾਬੀ ਵਿੱਚ ਜਾਣਕਾਰੀ']);
});

/* ---------- 281: next consultation on /for and the Punjabi region pages ---------- */

test('an audience page names only who speaks its language and offers its service', () => {
  const accepting = practitioners.filter((p) => p.acceptingNewClients && p.bookable).map((p) => p.slug);
  assert.deepEqual(audienceConsultSlugs({}), accepting);
  assert.deepEqual(audienceConsultSlugs(getAudience('couples')!), [camille.slug]);
  assert.deepEqual(audienceConsultSlugs(getAudience('punjabi-speaking-couples')!), [], 'nobody accepting does couples work in Punjabi');
  assert.deepEqual(audienceConsultSlugs(getAudience('filipino-healthcare-workers-and-caregivers')!), [camille.slug]);
  for (const a of audiences) assert.ok(!audienceConsultSlugs(a).includes('aman-bains-dhillon'), a.slug);
  assert.match(src('app/for/[slug]/page.tsx'), /<NextConsultLine\s+location="next-audience"\s+slugs=\{audienceConsultSlugs\(a\)\}/);
  assert.match(src('app/punjabi-counselling/[region]/page.tsx'), /<NextConsultLine\s+location="next-language-region"\s+slugs=\{\[speaker\.slug\]\}/);
});

/* ---------- 289: shift and rotation pages reach "Ask for a time" ---------- */

test('the six rotation pages exist, are flagged, and link the form with the counsellor the button books', () => {
  assert.equal(ROTATION.length, 6);
  for (const slug of ROTATION) {
    const a = getAudience(slug);
    assert.ok(a, `${slug} is not an audience page`);
    assert.equal(a!.rotation, true, slug);
  }
  assert.equal(audiences.filter((a) => a.rotation).length, 6);
  assert.equal(askForTimeHref(), `/book${ASK_FOR_A_TIME}`);
  assert.equal(askForTimeHref('camille-granda'), '/book?with=camille-granda#ask-for-a-time');
  assert.equal(opensCalendar(askForTimeHref('camille-granda'), '/book'), false, 'the form, not the calendar');
  const tl = getAudience('filipino-healthcare-workers-and-caregivers')!;
  assert.equal(askForTimeHref(bookingFor(tl.service, tl.language).slug), '/book?with=camille-granda#ask-for-a-time');
  const hc = getAudience('healthcare-and-shift-workers')!;
  const faq = hc.faqs.find((f) => /random days off/.test(f.q))!;
  assert.ok(faq.a.includes(`](${askForTimeHref(bookingFor(hc.service, hc.language).slug)})`), 'the FAQ link is the hero link');
  assert.match(src('app/book/page.tsx'), /id="ask-for-a-time"/, 'the anchor exists');
});

test('the rotation copy promises no hours, evenings or weekends', () => {
  const page = src('app/for/[slug]/page.tsx');
  const block = page.slice(page.indexOf('{askHref && ('), page.indexOf('<CoverageLine />'));
  assert.match(block, /Open times don&rsquo;t fit your rotation\? Ask for one/);
  assert.match(block, /a time that is not on the calendar yet/);
  const hc = getAudience('healthcare-and-shift-workers')!.faqs.find((f) => /random days off/.test(f.q))!.a;
  for (const text of [block.replace(/\{\/\*[\s\S]*?\*\/\}/g, ''), hc]) {
    assert.doesNotMatch(text, /evening|weekend|night|\b\d{1,2}\s?(am|pm)\b|hours/i);
  }
});

test('the new booking buttons are counted, in the middle of the list', () => {
  for (const l of ['next-audience', 'next-language-region', 'ask-time-audience']) assert.ok(BOOK_LOCATIONS.includes(l), l);
  const at = BOOK_LOCATIONS.indexOf('access-city-service');
  assert.deepEqual(BOOK_LOCATIONS.slice(at + 1, at + 4), ['next-audience', 'next-language-region', 'ask-time-audience']);
});

/* ---------- 354, 2 Oct 2026: the cards and next-consult lines book through bookHrefFor ---------- */

test('a single-counsellor link ends in #calendar, and carries for=couples only on a couples page', () => {
  for (const p of practitioners.filter((x) => x.acceptingNewClients && x.bookable)) {
    for (const svc of [undefined, 'individual-therapy', 'emdr-therapy', 'punjabi-counselling', 'tagalog-counselling']) {
      assert.equal(bookHrefFor([p], svc), `/book?with=${p.slug}#calendar`, `${p.slug}/${svc}`);
    }
    assert.equal(bookHrefFor([p], 'couples-therapy'), `/book?with=${p.slug}&for=couples#calendar`);
  }
});

test('the cards and the next-consult line build their href with bookHrefFor and the page’s service', () => {
  const cards = src('components/CounsellorCards.tsx');
  assert.match(cards, /href=\{bookHrefFor\(\[p\], service\)\}/);
  assert.doesNotMatch(cards, /\?with=\$\{p\.slug\}`/, 'no hand-built href without the hash');
  /* Every template that has a service passes it. */
  assert.match(src('app/services/[slug]/page.tsx'), /counsellors=\{offering\}\s+service=\{s\.slug\}/);
  assert.match(src('app/services/[slug]/page.tsx'), /location="next-service" slugs=\{offering\.map\(\(p\) => p\.slug\)\} service=\{s\.slug\}/);
  assert.match(src('app/online-counselling/[city]/[service]/page.tsx'), /counsellors=\{counsellors\}\s+service=\{svc\.bookingService\}/);
  assert.match(src('app/online-counselling/[city]/[service]/page.tsx'), /location="next-city-service"[^\n]*service=\{svc\.bookingService\}/);
  assert.match(src('app/search/page.tsx'), /counsellors=\{offering\}\s+service=\{top\.slug\}/);
  const step = src('components/NextStep.tsx');
  assert.equal(step.split('service={service}').length - 1, 2, 'NextStep passes it to both the cards and the line');
});

test('no typed /book?with= link in lib/*.ts misses #calendar, and couples links carry for=couples', () => {
  const dir = join(ROOT, 'lib');
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.ts'))) {
    const text = readFileSync(join(dir, f), 'utf8');
    /* Markdown links and quoted literals with a concrete slug; comments that
       name a URL in prose are not links. */
    const links = [
      ...[...text.matchAll(/\]\((\/book\?with=[^)\s]+)\)/g)].map((m) => m[1]),
      ...[...text.matchAll(/['"`](\/book\?with=[a-z-]+[^'"`\s]*)['"`]/g)].map((m) => m[1]),
    ];
    for (const href of links) {
      /* The two forms on /book are deliberate destinations of their own:
         Ask for a time (item 289) and the returned-message anchor. */
      if (/#(ask-for-a-time|form)$/.test(href)) continue;
      assert.match(href, /#calendar$/, `lib/${f}: ${href} opens /book without its calendar`);
    }
  }
  const depth = src('lib/depth-services.ts');
  assert.match(depth, /\(\/book\?with=camille-granda&for=couples#calendar\) with the counsellor who takes couples work/);
});

test('every /book?with= link on a couples page’s typed copy carries for=couples', async () => {
  const { depthServices } = await import('../lib/depth-services.ts');
  for (const key of ['services/couples-therapy']) {
    const text = JSON.stringify(depthServices[key] ?? []);
    for (const m of text.matchAll(/\/book\?with=[^)\s"]+/g)) assert.match(m[0], /&for=couples#calendar$/, `${key}: ${m[0]}`);
  }
});
