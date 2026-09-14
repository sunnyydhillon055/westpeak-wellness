import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
import { abs, orgRef, siteRef } from '@/lib/schema';
import { ogBase } from '@/lib/og-meta';
import Breadcrumbs from '@/components/Breadcrumbs';
import CtaBand from '@/components/CtaBand';
import Updated from '@/components/Updated';
import { COLLECTION_DATES } from '@/lib/page-dates';
import { buildAnswers, TOPICS } from '@/lib/answers';

/* INSTANT ANSWERS — /answers, rebuilt 14 Sep 2026 at the owner's request.
 *
 * The route was retired on 31 Aug ("one FAQ, not two"). It comes back as a
 * different thing: not a second FAQ but every question the site answers
 * anywhere — guides, resources, comparisons, services, audience pages and
 * the counsellors' own words — gathered by lib/answers.ts, searchable as you
 * type, each answer linking to the page it came from. No third-party chat
 * script: the "instant" part is a filter over text that is already on the
 * page, so it works with JavaScript off (everything is rendered) and with
 * it on (type, and the list narrows).
 *
 * The build fails if fewer than a hundred answers assemble: the page's
 * promise is in its title. */

const answers = buildAnswers();
if (answers.length < 100) throw new Error(`/answers has ${answers.length} answers; the page promises over a hundred`);

const TITLE = `Instant answers to ${Math.floor(answers.length / 10) * 10}+ counselling questions | Westpeak`;
const DESC = `Every question this practice answers, in one searchable place: cost and coverage, first sessions, stress leave, choosing a counsellor. Type to find yours.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: `${site.domain}/answers` },
  openGraph: { ...ogBase('/answers'), title: TITLE, description: DESC, url: `${site.domain}/answers` },
};

export default function AnswersPage() {
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': abs('/answers#faq'),
      name: TITLE,
      description: DESC,
      datePublished: COLLECTION_DATES['faq'],
      dateModified: COLLECTION_DATES['faq'],
      author: orgRef,
      publisher: orgRef,
      isPartOf: siteRef,
      /* The first hundred; the page holds them all. A FAQPage of
         several hundred entries is a payload a crawler skims, not reads. */
      mainEntity: answers.slice(0, 100).map((x) => ({
        '@type': 'Question',
        name: x.q,
        acceptedAnswer: { '@type': 'Answer', text: x.a },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: site.domain },
        { '@type': 'ListItem', position: 2, name: 'Answers', item: abs('/answers') },
      ],
    },
  ];

  const byTopic = TOPICS.map((t) => ({ t, n: answers.filter((a) => a.topic === t).length })).filter((x) => x.n > 0);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />

      <section className="hero" style={{ paddingBottom: 30 }}>
        <div className="container">
          <p className="eyebrow">Instant answers · {answers.length} questions</p>
          <h1>Ask it here first.</h1>
          <p className="lede">
            Every question this practice answers anywhere on the site, in one place. Start typing and
            the list narrows to what matches; each answer links to the page that says more.
          </p>
          <p className="direct-answer">
            Westpeak Wellness answers {answers.length} questions about online counselling in British
            Columbia and Alberta: what it costs and what extended health covers, what a first session
            and the free 30-minute consultation are like, how stress leave and sick days work, how to
            choose between a counsellor, a psychologist and a psychiatrist, and what each counsellor
            would say to the questions people ask before booking. Anything not here can be asked at
            the consultation, or by message with a reply within one business day.
          </p>
          <Updated iso={COLLECTION_DATES['faq']} />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 28 }}>
        <div className="container" style={{ maxWidth: '52rem' }}>
          <Breadcrumbs trail={[{ name: 'Answers', path: '/answers' }]} />

          <div className="answers-search" style={{ margin: '18px 0 10px' }}>
            <label htmlFor="ask" className="sr-only">Search the answers</label>
            <input
              id="ask"
              type="search"
              placeholder="Type a question or a word: cost, stress leave, Punjabi, first session…"
              autoComplete="off"
              style={{ width: '100%', padding: '14px 16px', fontSize: '1.05rem', border: '1px solid var(--line)', borderRadius: 12, background: 'var(--surface-1)' }}
            />
            <p id="ask-count" style={{ margin: '8px 0 0', fontSize: '.9rem', color: 'var(--ink-soft)' }} aria-live="polite">
              {answers.length} answers
            </p>
          </div>

          <div className="chip-grid" id="ask-topics" style={{ marginBottom: 18 }}>
            <button type="button" className="chip" data-topic="" aria-pressed="true">All</button>
            {byTopic.map((x) => (
              <button type="button" className="chip" data-topic={x.t} aria-pressed="false" key={x.t}>{x.t} · {x.n}</button>
            ))}
          </div>

          <div id="ask-list">
            {answers.map((x, i) => (
              <details className="faq-item ans" key={i} data-topic={x.topic}>
                <summary>{x.q}</summary>
                <p>{x.a}</p>
                <p style={{ fontSize: '.88rem', color: 'var(--ink-soft)', margin: '6px 0 0' }}>
                  From <Link href={x.href}>{x.from}</Link>
                </p>
              </details>
            ))}
          </div>

          <p id="ask-none" hidden style={{ color: 'var(--ink-soft)' }}>
            Nothing matches that yet. <Link href="/contact">Ask it in a message</Link> and you will have an
            answer within one business day, or bring it to the <Link href={site.bookingPath}>free consultation</Link>.
          </p>

          <div className="crisis" style={{ marginTop: 30 }}>
            <p style={{ margin: 0 }}>
              <strong>This is not a crisis service.</strong> Call or text <a href="tel:988"><strong>9-8-8</strong></a> at
              any hour. In immediate danger, call <a href="tel:911"><strong>9-1-1</strong></a>.
            </p>
          </div>
        </div>
      </section>

      <CtaBand />

      {/* The filter. Plain DOM, no dependency; the page is complete without it. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){var q=document.getElementById('ask'),list=document.getElementById('ask-list'),count=document.getElementById('ask-count'),none=document.getElementById('ask-none'),chips=document.querySelectorAll('#ask-topics .chip');if(!q||!list)return;var topic='';function run(){var t=q.value.trim().toLowerCase().split(/\\s+/).filter(Boolean);var n=0;list.querySelectorAll('.ans').forEach(function(el){var ok=(!topic||el.dataset.topic===topic)&&t.every(function(w){return (el._t||(el._t=el.textContent.toLowerCase())).indexOf(w)>=0});el.hidden=!ok;if(ok)n++;if(ok&&t.length)el.open=n<=8;});count.textContent=n+' answer'+(n===1?'':'s')+(t.length||topic?' match':'');none.hidden=n>0;}q.addEventListener('input',run);chips.forEach(function(c){c.addEventListener('click',function(){topic=c.dataset.topic||'';chips.forEach(function(x){x.setAttribute('aria-pressed',String(x===c))});run();})});var p=new URLSearchParams(location.search).get('q');if(p){q.value=p;run();}})();`,
        }}
      />
    </>
  );
}
