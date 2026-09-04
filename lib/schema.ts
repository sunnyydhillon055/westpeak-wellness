import { site } from './site';

/* ============================================================================
   ONE ENTITY GRAPH
   ----------------------------------------------------------------------------
   Answer engines resolve "who is this" by reconciling entities across pages.
   Fourteen separate inline `{ '@type': 'Organization', name, url }` objects read
   as fourteen loosely-related things; a single @id referenced everywhere reads
   as one practice with many pages about it.

   Every page therefore emits `{ '@id': ORG_ID }` as a *reference* and lets the
   root layout carry the one full definition. Same for the WebSite node and the
   Person node on /about.
   ========================================================================= */

export const ORG_ID = `${site.domain}/#organization`;
export const SITE_ID = `${site.domain}/#website`;
export const PERSON_ID = `${site.domain}/about#person`;

/** Reference to the practice. Use anywhere a publisher/provider/author is named. */
export const orgRef = { '@id': ORG_ID } as const;

/** Reference to the site itself, for isPartOf. */
export const siteRef = { '@id': SITE_ID } as const;

/** Reference to the counsellor. Only valid to *reference*; the definition lives
 *  on /about, because the personal name is scoped to that page. */
export const personRef = { '@id': PERSON_ID } as const;

/** Canonical absolute URL for a path. */
export const abs = (path: string) => `${site.domain}${path === '/' ? '' : path}`;

/** BreadcrumbList for an arbitrary trail. */
export const breadcrumbs = (trail: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((t, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: t.name,
    item: abs(t.path),
  })),
});

/**
 * Article node for a guide-shaped page.
 *
 * `author` and `publisher` both point at the practice entity rather than
 * restating it. The counsellor is credited as the reviewer via `reviewedBy`,
 * which is the E-E-A-T signal answer engines look for, without repeating the
 * personal name outside /about — the reference resolves to the Person node
 * that /about defines.
 */
export const articleSchema = ({
  path, headline, description, updated, images = [], section,
}: {
  path: string;
  headline: string;
  description: string;
  updated: string;
  images?: string[];
  section?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  '@id': `${abs(path)}#article`,
  headline,
  description,
  datePublished: updated,
  dateModified: updated,
  inLanguage: 'en-CA',
  isAccessibleForFree: true,
  mainEntityOfPage: { '@type': 'WebPage', '@id': abs(path) },
  author: orgRef,
  publisher: orgRef,
  reviewedBy: personRef,
  isPartOf: siteRef,
  ...(section ? { articleSection: section } : {}),
  ...(images.length ? { image: images } : {}),
});

/** FAQPage node. Each answer must stand alone — answer engines quote them whole. */
export const faqSchema = (faqs: { q: string; a: string }[], path: string) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': `${abs(path)}#faq`,
  isPartOf: siteRef,
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});

/* ============================================================================
   THE ORDINARY PAGE TYPE, WHICH FIVE COMMERCIAL PAGES DID NOT HAVE AT ALL
   ----------------------------------------------------------------------------
   /about, /services, /online-counselling, /refer and /refer/doctor emitted no
   page-level entity of any kind. The layout's organisation and website nodes
   were on them, so a validator saw structured data and said nothing was wrong,
   but nothing described the PAGE: no name, no description, no language, no
   date, no author. A retrieval system had the practice and the site, and for
   the page in front of it, nothing.

   Deliberately not MedicalWebPage. That type carries `lastReviewed` and
   `reviewedBy` and says "this is health information a clinician stands
   behind". /services is a menu and /refer is a form. Claiming clinical review
   for them would be the same over-claim the byline was fixed for.
   ========================================================================= */
export const webPage = ({
  path, name, description, updated, lang = 'en-CA', type = 'WebPage',
}: {
  path: string;
  name: string;
  description: string;
  /** From lib/page-dates.ts, so it is a real commit date and not a guess. */
  updated?: string;
  lang?: string;
  /** CollectionPage for an index, AboutPage for /about, WebPage otherwise. */
  type?: 'WebPage' | 'CollectionPage' | 'AboutPage' | 'ContactPage';
}) => ({
  '@context': 'https://schema.org',
  '@type': type,
  '@id': `${abs(path)}#webpage`,
  url: abs(path),
  name,
  description,
  inLanguage: lang,
  isPartOf: siteRef,
  about: orgRef,
  author: orgRef,
  publisher: orgRef,
  ...(updated ? { datePublished: updated, dateModified: updated } : {}),
});

/* ============================================================================
   MEDICAL PAGE TYPE
   ----------------------------------------------------------------------------
   Every clinical page here was typed as a generic `Article`, which is what a
   blog post is. This content is health information that somebody may act on,
   and schema.org has a type that says exactly that — `MedicalWebPage`, a
   WebPage subtype carrying `lastReviewed` and `reviewedBy`.

   The two coexist deliberately. `Article` describes the writing; MedicalWebPage
   describes the page as a piece of health information, and it is the node that
   makes the review date machine-readable. `reviewedBy` was already emitted on
   69 pages; `lastReviewed` existed on 4, so the review date was visible to a
   human in the byline and invisible to everything else.

   `speakable` points at the short-answer block, which is already written to be
   the sentence worth quoting. It is the closest thing in schema to "if you are
   going to read one part of this page aloud, read this."
   ========================================================================= */
export const medicalWebPage = ({
  path, name, description, reviewed, updated, lang = 'en-CA', specialty,
}: {
  path: string;
  name: string;
  description: string;
  /* WHEN THIS PAGE LAST CHANGED, which 157 of 250 pages were not saying.
   *
   * `lastReviewed` above is a CLINICAL claim and stays optional and rare:
   * inventing one would put a fabricated statement into structured data.
   * `dateModified` is a different and much weaker claim — this text changed on
   * this date — and every page can make it honestly, because git knows.
   *
   * The pages that were missing it were not a random sample. They were all 66
   * city pages, all 38 counsellor pages and all 19 Tagalog pages: the ones
   * somebody would actually cite. When two sources say the same thing, recency
   * is one of the few tie-breakers a retrieval system can apply cheaply, and no
   * date does not read as fresh, it reads as unknown.
   *
   * Sourced from lib/page-dates.ts, which is generated from real commit
   * history, so it cannot drift into a claim nobody checked. */
  updated?: string;
  /** ISO date of the last clinical review. Drives `lastReviewed`.
   *  Optional because service pages carry no review date, and inventing one
   *  would put a fabricated clinical claim into structured data. Omitted is
   *  correct there; wrong is not. */
  reviewed?: string;
  /** BCP-47. Punjabi pages pass 'pa'. */
  lang?: string;
  specialty?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'MedicalWebPage',
  '@id': `${abs(path)}#webpage`,
  url: abs(path),
  name,
  description,
  inLanguage: lang,
  isPartOf: siteRef,
  about: orgRef,
  ...(reviewed ? { lastReviewed: reviewed } : {}),
  ...(updated ? { datePublished: updated, dateModified: updated } : {}),
  reviewedBy: personRef,
  /* The practice, not a person. Every page on this site is published by the
     practice and the byline says so in words; this makes the same statement
     machine-readable. Naming an individual is a separate decision recorded in
     DECISIONS.md and not one a schema helper should make. */
  author: orgRef,
  publisher: orgRef,
  ...(specialty ? { medicalAudience: 'Patient', specialty } : {}),
  /* Both selectors, because guides render the answer as .short-answer and
     service pages as .direct-answer. A selector that matches nothing is not an
     error in schema, it is just silently useless — so name both rather than
     assume the markup is uniform. */
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: ['.short-answer', '.direct-answer'],
  },
});

/**
 * Offer node for a service that has one honest price.
 *
 * Only call this where a single figure is true. Several services span session
 * types at different prices and the page deliberately shows no figure rather
 * than a misleading one — passing a made-up number here would put that wrong
 * number into search results, where nobody visits the page to be corrected.
 */
export const priceOffer = (dollars: number, url: string) => ({
  '@type': 'Offer',
  price: dollars.toFixed(2),
  priceCurrency: 'CAD',
  availability: 'https://schema.org/InStock',
  url: abs(url),
  seller: orgRef,
});
