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

/* ---------- wf/article-templates, 1 Oct 2026: items 366, 370, 379, 383, 384, 385 ---------- */

test('379: the next free consultation prints once per page, mid-article or in the closing block', () => {
  for (const [file, loc] of [['app/resources/[slug]/page.tsx', 'next-resource-close'], ['app/guides/[slug]/page.tsx', 'next-guide-close']]) {
    const page = src(file);
    assert.ok(page.includes(`consult={cards && !next ? { location: '${loc}'`), file);
    assert.match(page, /const next = NEXT_CONSULT_AFTER\[/, file);
    /* Exactly one mid-article render, keyed on the same `next`. */
    assert.equal(page.split('<NextConsultLine').length - 1, 1, file);
    assert.match(page, /next\?\.h2 === s\.h2 && /, file);
  }
});

test('385: the one-pager form renders after the closing next step, not before it', () => {
  for (const file of ['app/resources/[slug]/page.tsx', 'app/guides/[slug]/page.tsx']) {
    const page = src(file);
    const step = page.indexOf('<NextStep');
    const form = page.indexOf('<LeadCapture');
    assert.ok(step > 0 && form > step, `${file}: LeadCapture must follow NextStep`);
    assert.ok(form < page.indexOf('Related pages'), `${file}: and still precede the link footer`);
  }
  const log = JSON.parse(src('data/changes.json')).changes as { id: string; metric: string }[];
  assert.ok(log.some((c) => c.id === '2026-10-02-lead-after-next-step' && c.metric === 'conv:book_click'));
  assert.ok(log.some((c) => c.id === '2026-10-02-lead-after-next-step-leads' && c.metric === 'conv:lead_magnet_submit'));
});

test('384: every resource midCta label rendered through BookLink names booking or a consultation', async () => {
  const { resources } = await import('../lib/resources.ts');
  for (const r of resources) {
    assert.match(r.midCta.label, /book|consultation/i, `${r.slug}: "${r.midCta.label}" opens the calendar`);
  }
  const page = src('app/resources/[slug]/page.tsx');
  assert.match(page, /<BookLink location="mid-resource" href=\{cta\.href\} className="">\{r\.midCta\.label\}<\/BookLink>/);
});

test('384: an Alberta resource closes with Alberta’s helpline and no BC link footer', () => {
  const page = src('app/resources/[slug]/page.tsx');
  assert.match(page, /r\.province === 'AB' \? \(\s*<>the Recovery Alberta Mental Health Helpline at <strong>1-877-303-2642<\/strong>/);
  assert.match(src('lib/resources-alberta.ts'), /Mental Health Helpline is 1-877-303-2642/, 'the number the body already cites');
  assert.match(page, /\{r\.province !== 'AB' && \(\s*<>\s*<MoreFrom/);
  assert.match(page, /filter\(\(s\) => r\.province !== 'AB' \|\| !s\.href\.endsWith\('-bc'\)\)/);
});

test('383: the year-end block follows the first section, is in the contents, and the Alberta copy names no BC insurer', async () => {
  const { getResource } = await import('../lib/resources.ts');
  const page = src('app/resources/[slug]/page.tsx');
  assert.match(page, /i === 0 && seasonal \? \[s\.h2, seasonal\.h2\] : \[s\.h2\]/);
  assert.match(page, /\{i === 0 && seasonal && \(/);
  assert.ok(page.indexOf('{i === 0 && seasonal && (') > page.indexOf('{r.sections.map((s, i) => ('), 'inside the section loop');
  const ab = getResource('counselling-coverage-in-alberta')!.seasonal!.body.join('\n');
  const bc = getResource('does-my-plan-cover-counselling-bc')!;
  assert.doesNotMatch(ab, /Pacific Blue Cross/);
  assert.match(bc.seasonal!.body.join('\n'), /Pacific Blue Cross/);
  /* One session-count paragraph on the BC page: the plan-maximum one. */
  assert.doesNotMatch(bc.seasonal!.body.join('\n'), /\$300 left/);
  assert.equal(JSON.stringify(bc).split('annual maximum covers about').length - 1, 1);
  assert.match(ab, /\$300 left/, 'the Alberta page has no plan-maximum paragraph, so it keeps the balance sentence');
});

test('366: the ICBC page prints ICBC’s own figures, in date, beside the catalogue fee', async () => {
  const { getResource } = await import('../lib/resources.ts');
  const { ICBC_COUNSELLING, icbcFeeSentence } = await import('../lib/session-arithmetic.ts');
  const r = getResource('icbc-counselling-after-a-crash-bc')!;
  const all = JSON.stringify(r);
  assert.ok(all.includes(money(ICBC_COUNSELLING.cents)), 'ICBC’s rate');
  assert.match(all, /12 pre-approved counselling treatments/);
  assert.match(all, /at least 50 minutes/);
  assert.match(all, /1 April 2026 to 31 March 2027/);
  assert.match(all, /to the level of our approved rates/);
  assert.match(all, /accessing-treatment-during-your-first-12-weeks-of-recovery/);
  assert.doesNotMatch(all, /own one-pager/);
  assert.match(all, /not an ICBC vendor and does not bill ICBC directly/);
  assert.match(all, /confirm with your adjuster/);
  const ind = fee('Individual Counselling');
  assert.ok(icbcFeeSentence().includes(money(ind.cents)), 'the fee is the catalogue’s');
  assert.ok(all.includes(icbcFeeSentence().slice(0, 60)));
  /* Follows the catalogue, either side of ICBC’s rate. */
  const at = (cents: number) => ({ ...FALLBACK_CATALOG, items: FALLBACK_CATALOG.items.map((i) => (i.name === 'Individual Counselling' ? { ...i, cents } : i)) });
  assert.match(icbcFeeSentence(at(ICBC_COUNSELLING.cents - 2000)), /below ICBC’s/);
  assert.match(icbcFeeSentence(at(ICBC_COUNSELLING.cents)), /the same as ICBC’s/);
  assert.ok(icbcFeeSentence(at(ICBC_COUNSELLING.cents + 1500)).includes(`the ${money(1500)} difference`));
  assert.doesNotMatch(icbcFeeSentence(), /'/, 'a straight apostrophe in prose');
  /* ICBC re-sets its rate every 1 April: past the window this fails, rather than the page printing last year’s rate. */
  assert.ok(new Date().toISOString().slice(0, 10) <= ICBC_COUNSELLING.to, 'ICBC’s 2026-27 rate has lapsed: re-read the ICBC page and update ICBC_COUNSELLING');
});

test('370: FAQ answers render through rich() and reach JSON-LD as plain text', async () => {
  const { plainText, RAW_MD_LINK } = await import('../lib/plain-text.ts');
  assert.equal(plainText('See [how long therapy takes](/guides/how-long-does-therapy-take).'), 'See how long therapy takes.');
  assert.equal(plainText('**[Foundry](https://foundrybc.ca/)** for anyone aged 12–24'), 'Foundry for anyone aged 12–24');
  assert.equal(plainText('a [paper](https://x.org/a%20(1).pdf) and *Journal*'), 'a paper and Journal');
  assert.equal(RAW_MD_LINK.test(plainText('[a](/b) and [c](https://d.e)')), false);
  for (const file of ['app/resources/[slug]/page.tsx', 'app/guides/[slug]/page.tsx', 'app/compare/[slug]/page.tsx', 'app/approaches/[slug]/page.tsx', 'app/for/[slug]/page.tsx']) {
    const page = src(file);
    assert.doesNotMatch(page, /<p>\{f\.a\}<\/p>/, file);
    assert.match(page, /text: plainText\(f\.a\)/, file);
  }
  const place = src('app/practitioners/[slug]/[place]/page.tsx');
  assert.doesNotMatch(place, /<p>\{f\.a\}<\/p>|<p key=\{x\.slice\(0, 24\)\}>\{x\}<\/p>|, \{a\.detail\}<\/li>/);
  assert.match(src('lib/rich.tsx'), /<strong key=\{i\}>\{rich\(bold\[1\]\)\}<\/strong>/, 'a bold run may wrap a link');
  assert.match(src('scripts/quality-audit.mjs'), /'raw-markdown-link'/);
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

/* ---------- wf/r6-book-paths, 3 Oct 2026: items 402, 424, 425, 456, 459, 460 ---------- */

test('402: no hand-built /book?with= href in app/**/*.tsx misses #calendar', () => {
  const files = (readdirSync(join(ROOT, 'app'), { recursive: true }) as string[])
    .filter((f) => f.endsWith('.tsx'))
    .map((f) => `app/${f.replace(/\\/g, '/')}`);
  assert.ok(files.length > 50, 'the scan found the app tree');
  for (const f of files) {
    const text = src(f);
    const built = [...text.matchAll(/`\$\{site\.bookingPath\}\?with=\$\{[^}]+\}([^`]*)`/g)].map((m) => m[0]);
    const typed = [...text.matchAll(/['"`](\/book\?with=[a-z-]+[^'"`\s]*)['"`]/g)].map((m) => m[1]);
    for (const href of [...built, ...typed]) {
      if (/#(ask-for-a-time|form)/.test(href)) continue;
      assert.match(href, /#calendar/, `${f}: ${href} opens /book without its calendar`);
    }
  }
});

test('402: the profile, place pages, their twins and the Tagalog guides book through bookHrefFor', () => {
  const profile = src('app/practitioners/[slug]/page.tsx');
  assert.match(profile, /\? bookHrefFor\(\[p\]\)\s*: alts\[0\]/);
  assert.match(profile, /<BookLink location="next-practitioner" className="" href=\{bookHref\}>\{d\}<\/BookLink>/);
  const place = src('app/practitioners/[slug]/[place]/page.tsx');
  assert.equal(place.split('const bookHref = bookHrefFor([p]);').length - 1, 2);
  assert.match(place, /href=\{p\.acceptingNewClients \? bookHrefFor\(\[p\]\) : site\.bookingPath\}/);
  for (const f of ['app/practitioners/[slug]/[place]/pa/page.tsx', 'app/practitioners/[slug]/[place]/tl/page.tsx']) {
    assert.match(src(f), /const bookHref = bookHrefFor\(\[p\]\);/, f);
  }
  assert.match(src('app/tagalog/gabay/[slug]/page.tsx'), /href=\{speaker \? bookHrefFor\(\[speaker\]\) : site\.bookingPath\}/);
  for (const l of ['next-practitioner', 'hero-next-language', 'next-message-sent']) assert.ok(BOOK_LOCATIONS.includes(l), l);
  assert.deepEqual(BOOK_LOCATIONS.slice(BOOK_LOCATIONS.indexOf('hero-online') + 1), ['next-practitioner', 'hero-next-language', 'next-message-sent']);
});

test('456: a profile not taking new clients says so and names the colleague who shares her language', async () => {
  const { notAcceptingSentence, closedProfileDescription } = await import('../lib/closed-profile-snippet.ts');
  const { metaLength } = await import('../lib/snippet-facts.ts');
  const closed = practitioners.filter((p) => !p.acceptingNewClients);
  assert.ok(closed.length >= 1, 'premise: someone on the roster is not accepting');
  for (const p of closed) {
    const s = notAcceptingSentence(p, practitioners)!;
    assert.match(s, /^Not taking new clients at present\./);
    const shared = practitioners.find((q) => q.acceptingNewClients && q.slug !== p.slug
      && p.languages.some((l) => !l.tag.startsWith('en') && q.languages.some((m) => m.tag === l.tag)));
    if (shared) assert.ok(s.includes(`see ${shared.name}, ${shared.postNominals}.`), s);
    const lead = `${p.name}, online counselling across BC in ${p.languages.map((l) => l.name).join(' or ')}. ${p.focus.map((f) => f.label).join(', ')}.`;
    const d = closedProfileDescription(lead, p, practitioners);
    assert.ok(d.includes(s), d);
    assert.ok(metaLength(d) <= 155, `${d} (${metaLength(d)})`);
    /* No reason, no dates. */
    assert.doesNotMatch(d, /leave|return|until|20\d\d|January|February|March|April|June|July|August|September|October|November|December/i);
  }
  assert.equal(notAcceptingSentence(savneet, practitioners), null);
  /* A closed profile that works in Punjabi names the Punjabi-speaking colleague. */
  const shape = { name: 'A B', postNominals: 'RCC', slug: 'a', acceptingNewClients: false, languages: [{ tag: 'en-CA', name: 'English' }, { tag: 'pa', name: 'Punjabi' }] };
  assert.equal(notAcceptingSentence(shape, practitioners), `Not taking new clients at present. For counselling in Punjabi, see ${savneet.name}, ${savneet.postNominals}.`);
  assert.equal(notAcceptingSentence({ ...shape, languages: [{ tag: 'en-CA', name: 'English' }] }, practitioners), 'Not taking new clients at present.');
  /* Too long for the lead: the sentence stays and the lead gives way. */
  const long = closedProfileDescription('x'.repeat(200) + '.', shape, practitioners);
  assert.ok(long.includes('Not taking new clients') && metaLength(long) <= 155, long);
  assert.match(src('app/practitioners/[slug]/page.tsx'), /: closedProfileDescription\(lead, p, practitioners\);/);
});

test('425: the acknowledgement lists each routed counsellor’s next free days, days only', async () => {
  const { enquiryAck } = await import('../lib/inbound-mail.ts');
  const { openDays, consultDaysLine } = await import('../lib/availability-summary.ts');
  const a = {
    slug: 'camille-granda', count: 5, days: ['Thu', 'Sat'], earliest: '9 am', latest: '7 pm', weekend: true, evening: true,
    next: ['Thu 8 Oct from 10 am (3 times)', 'Sat 10 Oct from 9 am', 'Thu 15 Oct from 1 pm (2 times)'],
  };
  assert.deepEqual(openDays(a), ['Thu 8 Oct', 'Sat 10 Oct', 'Thu 15 Oct']);
  assert.deepEqual(openDays({ ...a, error: 'HTTP 500' }), []);
  assert.deepEqual(openDays({ ...a, count: 0 }), []);
  assert.deepEqual(openDays(null), []);
  assert.equal(consultDaysLine('Camille', []), null);
  const line = consultDaysLine('Camille', openDays(a))!;
  assert.equal(line, 'Camille’s next free consultation days: Thu 8 Oct · Sat 10 Oct · Thu 15 Oct (Pacific time)');
  const href = 'https://www.westpeakwellness.com/book?with=camille-granda#calendar';
  const one = enquiryAck('Sam', { who: 'Camille Granda, RCC, CCC', bookHref: href }, [{ first: 'Camille', bookHref: href, days: openDays(a) }]);
  const flat = one.text.replace(/\s+/g, ' ');
  assert.ok(flat.includes(line), flat);
  assert.ok(one.html.indexOf('next free consultation days') < one.html.indexOf('Or pick a time for a free consultation'), 'above the button');
  for (const m of [one.text, one.html]) assert.doesNotMatch(m, /\b\d{1,2}\s?(am|pm)\b/, 'no hour reaches the person');
  /* Two counsellors: one line each, each with her own calendar. */
  const sHref = 'https://www.westpeakwellness.com/book?with=savneet-singh#calendar';
  const two = enquiryAck('Sam', undefined, [
    { first: 'Camille', bookHref: href, days: ['Thu 8 Oct'] },
    { first: 'Savneet', bookHref: sHref, days: ['Tue 6 Oct'] },
    { first: 'Nobody', bookHref: sHref, days: [] },
  ]);
  assert.match(two.text.replace(/\s+/g, ' '), /Camille’s next free consultation days: Thu 8 Oct \(Pacific time\)/);
  assert.match(two.text.replace(/\s+/g, ' '), /Savneet’s next free consultation days: Tue 6 Oct \(Pacific time\)/);
  assert.doesNotMatch(two.text, /Nobody/, 'a failed read prints no line');
  assert.ok(two.html.includes('?with=savneet-singh'), 'her own calendar');
  /* No days, no change. */
  assert.equal(enquiryAck('Sam').text, enquiryAck('Sam', undefined, []).text);
  const submit = src('lib/inbound-submit.ts');
  assert.match(submit, /enquiryAck\(firstName, by, open\)/);
  assert.match(submit, /days: openDays\(/);
});

test('424: an enquiry routed to one counsellor carries a mailto reply draft, and sends nothing', async () => {
  const { practiceAlert, replyDraftBody, replyDraftHref, REPLY_SUBJECT } = await import('../lib/inbound-mail.ts');
  const item = {
    id: 'abc12345', kind: 'enquiry' as const, name: 'Sam Lee', email: 'sam@gmail.com',
    message: 'I would like to talk to someone.', source: '/contact', createdAt: '2026-10-01T17:00:00Z', handled: false,
  };
  const fees = sessionFeesPhrase(FALLBACK_CATALOG, { services: savneet.services });
  const draft = { counsellor: 'Savneet', bookHref: 'https://www.westpeakwellness.com/book?with=savneet-singh#calendar', days: ['Tue 6 Oct', 'Fri 9 Oct', 'Tue 13 Oct'], fees };
  const body = replyDraftBody('Sam', draft);
  assert.match(body, /^Hi Sam,/);
  assert.ok(body.includes('My next free 30-minute consultation days are Tue 6 Oct, Fri 9 Oct and Tue 13 Oct (Pacific time).'), body);
  assert.ok(body.includes(draft.bookHref));
  assert.ok(body.includes(`sessions are ${fees}.`) && fees!.includes(money(fee('Individual Counselling').cents)), 'the catalogue fee');
  assert.doesNotMatch(body, /couples/, 'only what she offers');
  assert.doesNotMatch(body, /\b\d{1,2}\s?(am|pm)\b|evening|weekend/i);
  assert.match(body, /Savneet$/);
  const href = replyDraftHref(item.email, 'Sam', draft);
  assert.ok(href.startsWith('mailto:sam@gmail.com?subject='));
  const q = new URLSearchParams(href.slice(href.indexOf('?') + 1));
  assert.equal(q.get('subject'), REPLY_SUBJECT);
  assert.equal(REPLY_SUBJECT, 'Re: your message to Westpeak Wellness');
  assert.equal(q.get('body'), body.replace(/\n/g, '\r\n'));
  const a = practiceAlert(item, draft);
  assert.ok(a.text.includes(href));
  assert.match(a.html, /Reply with your next times/);
  assert.match(a.html, /href="mailto:sam@gmail\.com\?subject=[^"]*&amp;body=/);
  /* Not routed to one counsellor, or not an enquiry: no draft. */
  assert.doesNotMatch(practiceAlert(item).html, /Reply with your next times/);
  assert.doesNotMatch(practiceAlert({ ...item, kind: 'lead' as const, magnet: 'coverage-checklist' }, draft).html, /Reply with your next times/);
  /* No days read: the draft still opens her calendar, naming none. */
  assert.match(replyDraftBody('', { ...draft, days: [] }), /^Hi,\n[\s\S]*You can choose a time for a free 30-minute consultation here:/);
  const submit = src('lib/inbound-submit.ts');
  assert.match(submit, /practiceAlert\(\{ \.\.\.item, triage: finalVerdict \}, draft\)/);
  const mail = src('lib/inbound-mail.ts');
  const block = mail.slice(mail.indexOf('A ONE-TAP REPLY DRAFT'), mail.indexOf('export function practiceAlert'));
  assert.doesNotMatch(block, /sendDetailed|fetch\(/, 'the draft sends nothing');
});

test('459: /message-sent drops the solo-practice line and "always within two", and links the next free calls', () => {
  const page = src('app/message-sent/page.tsx');
  assert.doesNotMatch(page, /solo practice|always within two/);
  assert.match(page, /usually within one business\s+day\./);
  assert.match(page, /The counsellor your message is\s+for is the one who reads it and answers it\./);
  assert.match(page, /Forgot something, like a\s+phone number\? Reply to the copy in your inbox; no need to send the form again\./);
  assert.match(page, /location="next-message-sent"/);
  assert.match(page, /href=\{bookHrefFor\(practitioners\.filter\(\(p\) => p\.slug === e\.slug\)\)\}/);
  assert.match(page, /\{PACIFIC\}/);
});

test('460: /punjabi names its counsellor in one Latin-script line, with her next free day as a link', () => {
  const page = src('app/punjabi/page.tsx');
  const at = page.indexOf('{speaker && (');
  assert.ok(at > page.indexOf('Read this in English') && at < page.indexOf('</section>', at), 'under the hero buttons');
  const block = page.slice(at, page.indexOf('</p>', at));
  assert.match(block, /<p lang="en"/);
  assert.match(block, /<Link href=\{`\/practitioners\/\$\{speaker\.slug\}`\}>\{withLetters\(speaker\)\}<\/Link>/);
  assert.match(block, /<BookLink location="hero-next-language" className="" href=\{bookHrefFor\(\[speaker\]\)\}>\{speakerNext\.day\}<\/BookLink>/);
  assert.doesNotMatch(block, /[਀-੿]/, 'no new Punjabi prose');
  const speaker = practitioners.find((p) => p.acceptingNewClients && p.languages.some((l) => l.tag === 'pa') && p.placePages)!;
  assert.equal(speaker.slug, savneet.slug);
  assert.equal(bookHrefFor([speaker]), '/book?with=savneet-singh#calendar');
});
