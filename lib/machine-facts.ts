/* PURE HELPERS FOR THE MACHINE FILES (/ai.json, /llms.txt) — 1 Oct 2026.
 *
 * Kept free of the roster and the content modules so they can be tested with
 * small fixtures; the routes pass the real data in. */

/** The founder appears only on /about, /practitioners and her own profile.
 *  The same pattern scripts/ai-crawl-audit.mjs fails on. */
export const FOUNDER_RE = /Aman Bains|Bains Dhillon|aman-bains-dhillon/i;

type Lang = { tag: string; name: string; nativeName?: string };
type Person = { slug: string; name: string; languages: { tag: string }[] };

/** Where each language is served: the service page in English about it, and
 *  the page written in the language (null where none is published). */
export type LanguagePages = Record<string, { service: string; inLanguage: string | null }>;

/** Each practice language with the accepting counsellors who work in it, its
 *  service page and its in-language page. A language nobody accepting speaks
 *  is dropped rather than listed with an empty counsellor list. */
export function languageEntries(
  languages: Lang[],
  taking: Person[],
  pages: LanguagePages,
  abs: (p: string) => string,
  bookingPathFor: (slug: string) => string,
) {
  return languages
    .map((l) => {
      const who = taking.filter((p) => p.languages.some((x) => x.tag === l.tag));
      const pg = pages[l.tag];
      return {
        tag: l.tag,
        name: l.name,
        ...(l.nativeName && l.nativeName !== l.name ? { native: l.nativeName } : {}),
        counsellors: who.map((p) => ({ name: p.name, url: abs(`/practitioners/${p.slug}`), booking_url: abs(bookingPathFor(p.slug)) })),
        service_page: pg ? abs(pg.service) : null,
        in_language_page: pg?.inLanguage ? abs(pg.inLanguage) : null,
      };
    })
    .filter((l) => l.counsellors.length > 0);
}

/** How a session is paid for, and what is and is not billed directly. One
 *  flag (site.icbcVendor) decides the ICBC wording. */
export function fundingBlock(icbcVendor: boolean, abs: (p: string) => string) {
  return {
    payment: 'Credit card (Visa, Mastercard or Amex), taken when a paid session is booked. The first consultation is free and needs no card.',
    direct_billing: false,
    model: 'Pay-and-submit: the client pays the practice and submits the receipt, which carries the counsellor’s registration number, to their insurer.',
    direct_billing_note: 'Pacific Blue Cross has accepted direct claims from Registered Clinical Counsellors since 11 July 2025; this practice does not direct-bill it or any other insurer.',
    extended_health: 'Many extended health plans reimburse a Registered Clinical Counsellor, depending on the plan; check yours.',
    icbc_vendor: icbcVendor,
    icbc: icbcVendor
      ? 'This practice is registered with ICBC.'
      : 'This practice is not currently registered with ICBC and does not direct-bill; the ICBC counselling entitlement after a crash can be used with a registered vendor.',
    coverage_check: abs('/resources/does-my-plan-cover-counselling-bc'),
    icbc_page: abs('/resources/icbc-counselling-after-a-crash-bc'),
    fees: abs('/pricing'),
  };
}

/** The concerns the city pages are built around: each distinct topic once,
 *  with the service it is worked through and the city pages that carry it. */
export function concernsFromPairs(
  pairs: { city: string; service: string }[],
  topic: (slug: string) => { name: string; bookingService: string } | undefined,
  abs: (p: string) => string,
) {
  const order: string[] = [];
  const cities = new Map<string, string[]>();
  for (const p of pairs) {
    if (!cities.has(p.service)) { cities.set(p.service, []); order.push(p.service); }
    cities.get(p.service)!.push(p.city);
  }
  return order
    .map((slug) => {
      const t = topic(slug);
      if (!t) return null;
      return {
        name: t.name,
        through_service: abs(`/services/${t.bookingService}`),
        city_pages: (cities.get(slug) ?? []).map((c) => abs(`/online-counselling/${c}/${slug}`)),
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);
}

/** Every <loc> page URL in a sitemap.xml body (image locs excluded). */
export function sitemapUrls(xml: string, origin: string): string[] {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1].trim())
    .filter((u) => u.startsWith(origin) && !/\/img\//.test(u));
}

/** Sitemap URLs that `body` does not already link, founder routes removed.
 *  A URL counts as linked when it appears followed by ")" or whitespace, so
 *  /refer being listed does not hide /refer/doctor. */
export function missingUrls(urls: string[], body: string): string[] {
  const linked = new Set([...body.matchAll(/https?:\/\/[^\s)\]]+/g)].map((m) => m[0].replace(/\/$/, '')));
  return urls
    .map((u) => u.replace(/\/$/, ''))
    .filter((u) => !FOUNDER_RE.test(u))
    .filter((u, i, all) => all.indexOf(u) === i)
    .filter((u) => !linked.has(u));
}
