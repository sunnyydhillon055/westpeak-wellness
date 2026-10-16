import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
import { ogBase } from '@/lib/og-meta';
import { gurmukhi } from '@/app/fonts-gurmukhi';
import { CONSULT_MINUTES } from '@/lib/cliniko-catalog';
import { CONFIDENTIALITY_LIMITS } from '@/lib/practice-facts';
import MailLink from '@/components/MailLink';
import Breadcrumbs from '@/components/Breadcrumbs';
import {
  COUNSELLING_WORDS, FEELING_WORDS, FAMILY_WORDS, PHRASES,
  PDF_PATH, PRINT_PATH, SHEET_DATE, SHEET_DATE_LABEL, punjabiCounsellor, type WordRow,
} from './sheet';

/* A PRINTABLE "COUNSELLING WORDS IN PUNJABI" SHEET — 15 Oct 2026.
 *
 * For a gurdwara notice board, a community centre's front table or the
 * waiting room of a Punjabi-speaking family doctor: one page that explains
 * the words, says what counselling is and that it is confidential, and says
 * who offers it in Punjabi here. Everything Punjabi on it is copied from the
 * words page (see ./sheet.ts); the English is plain facts from the roster,
 * the catalogue's consultation length and practice-facts' confidentiality
 * limits. No fee, no hours, no phone number of the practice, no outcome.
 *
 * NOINDEX, FOLLOW, self-canonical. The sheet is the words page's two tables
 * reprinted for paper, so as a search result it would be a thinner copy of a
 * page that already ranks for the same queries; it is offered by link from
 * that page and from /punjabi instead, and kept out of the sitemap.
 *
 * The PDF in public/downloads is printed from this page by Chrome headless
 * (--print-to-pdf --no-pdf-header-footer). When the words page or the roster
 * changes, remake it and move SHEET_DATE. It should be read by the
 * Punjabi-speaking counsellor before a stack is printed.
 *
 * Static, no client code of its own: MailLink is the sitewide component. */

const TITLE = 'Counselling Words in Punjabi to Print';
const DESC =
  'A one-page sheet of the Punjabi words for counselling, therapy and consultation, with English meanings, to print for a gurdwara, community centre or clinic.';

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | ${site.name}` },
  description: DESC,
  robots: { index: false, follow: true },
  alternates: { canonical: `${site.domain}${PRINT_PATH}` },
  openGraph: { ...ogBase(PRINT_PATH), title: TITLE, description: DESC, url: `${site.domain}${PRINT_PATH}` },
};

const host = site.domain.replace(/^https?:\/\//, '').replace(/^www\./, '');

const Pa = ({ children }: { children: string }) => (
  <span lang="pa" className="gurmukhi pw-pa">{children}</span>
);

function WordTable({ caption, rows, withGloss }: { caption: string; rows: WordRow[]; withGloss?: boolean }) {
  return (
    <table className="pw-table">
      <caption>{caption}</caption>
      <thead>
        <tr>
          <th scope="col">English</th>
          <th scope="col">Punjabi</th>
          <th scope="col">Said as</th>
          {withGloss ? <th scope="col">Meaning</th> : null}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.pa}>
            <td>{r.en}</td>
            <td className="pw-nw"><Pa>{r.pa}</Pa></td>
            <td className="pw-nw"><em>{r.said}</em></td>
            {withGloss ? <td>{r.gloss}</td> : null}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const CSS = `.pw-sheet{border:1px solid var(--line);border-radius:12px;padding:28px;margin-top:24px;background:var(--bg-card)}
.pw-sheet h1{font-size:1.7rem;margin:0 0 4px}.pw-sheet h2{font-size:1.05rem;margin:18px 0 6px}
.pw-sheet p{margin:6px 0}.pw-kicker{font-weight:700;margin:0 0 6px}
.pw-pa{font-size:1.08em;line-height:1.4}.pw-nw{white-space:nowrap}
.pw-table{width:100%;border-collapse:collapse;margin:10px 0;font-size:.95rem}
.pw-table caption{text-align:left;font-weight:700;padding:4px 0}
.pw-table th,.pw-table td{border:1px solid var(--line);padding:4px 8px;text-align:left;vertical-align:top}
.pw-pair{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px}
.pw-who{border:1.5px solid var(--ink);border-radius:8px;padding:12px 14px;margin-top:14px}
.pw-foot{font-size:.85rem;margin-top:12px}
@media print{
@page{margin:12mm}
.pw-page .section{padding:0!important;margin:0!important}
.pw-page .section>.container>:not(.pw-sheet){display:none!important}
.pw-sheet{border:0!important;padding:0!important;margin:0!important;font-size:10pt;line-height:1.3}
.pw-sheet h1{font-size:17pt}.pw-sheet h2{font-size:11pt;margin:7pt 0 3pt}.pw-sheet p{margin:3pt 0}
.pw-table{margin:5pt 0;font-size:9.5pt}.pw-table th,.pw-table td{padding:1.5pt 5pt!important;border:.5pt solid var(--line)!important}
.pw-pair{grid-template-columns:1fr 1fr!important;gap:6mm!important}
.pw-who{border:1.2pt solid var(--ink)!important;padding:6pt 9pt!important;margin-top:7pt;break-inside:avoid}
.pw-foot{font-size:8.5pt;margin-top:6pt}
.pw-sheet a{text-decoration:none!important}
}`;

export default function PunjabiWordsSheet() {
  const who = punjabiCounsellor();

  return (
    <div className={`pw-page ${gurmukhi.variable}`}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <section className="section" style={{ paddingTop: 32 }}>
        <div className="container container--narrow">
          <Breadcrumbs
            trail={[
              { name: 'Counselling words in Punjabi', path: '/resources/counselling-in-punjabi-what-the-words-mean' },
              { name: 'Printable sheet', path: PRINT_PATH },
            ]}
          />
          <div className="prose no-print">
            <p className="eyebrow">To print</p>
            <p>
              A one-page sheet for a gurdwara notice board, a community centre or the waiting room
              of a Punjabi-speaking family doctor. It explains the words families use for
              counselling, says what counselling is and that it is confidential, and who offers it
              in Punjabi here. Every Punjabi word on it comes from{' '}
              <Link href="/resources/counselling-in-punjabi-what-the-words-mean">what counselling
              means in Punjabi, word by word</Link>, which has the examples and the longer notes.
            </p>
            <p>
              <a href={PDF_PATH} download>Download the sheet as a PDF</a> (one page, Letter or A4),
              or press Ctrl&nbsp;+&nbsp;P (⌘&nbsp;+&nbsp;P on a Mac) and everything except the
              sheet drops away. It is free to copy and hand out as it stands.
            </p>
          </div>

          <article className="pw-sheet" lang="en-CA">
            <p className="pw-kicker">{site.name}</p>
            <h1>Counselling words in Punjabi</h1>
            <p>
              <strong>What counselling is.</strong> A private conversation with a Registered
              Clinical Counsellor about sleep, work, marriage, grief, parents, money and the things
              that are keeping you up. A counsellor does not prescribe medicine or make a diagnosis,
              and you do not need a referral.
            </p>
            <p>
              <strong>It is confidential.</strong> Nothing said in a session goes to your family,
              your community or your employer. The only exceptions are the narrow legal ones every
              counsellor has ({CONFIDENTIALITY_LIMITS}), and they are explained at the first meeting.
            </p>

            <WordTable caption="The words for counselling" rows={COUNSELLING_WORDS} withGloss />

            <div className="pw-pair">
              <WordTable caption="Feeling words" rows={FEELING_WORDS} />
              <div>
                <WordTable caption="Words families worry about" rows={FAMILY_WORDS} />
                <p>
                  <Pa>{FAMILY_WORDS[2]!.pa}</Pa> ({FAMILY_WORDS[2]!.said}) is the word most families
                  fear, and it has nothing to do with counselling.
                </p>
              </div>
            </div>

            <p>
              <strong>Explaining it to a parent:</strong> <Pa>{PHRASES.explain.pa}</Pa>,{' '}
              {PHRASES.explain.en}, is usually understood more easily than either word for
              counselling, because it says what happens.
            </p>

            <div className="pw-who">
              {who ? (
                <p>
                  <strong>Counselling in Punjabi.</strong> {who.letters}, offers individual
                  counselling in Punjabi or English, by secure video anywhere in British Columbia.
                  The first {CONSULT_MINUTES} minutes are {PHRASES.freeConsult.en},{' '}
                  <Pa>{PHRASES.freeConsult.pa}</Pa>, and nothing is decided in it.
                </p>
              ) : (
                <p>
                  <strong>Counselling online across British Columbia.</strong> The first{' '}
                  {CONSULT_MINUTES} minutes are {PHRASES.freeConsult.en},{' '}
                  <Pa>{PHRASES.freeConsult.pa}</Pa>, and nothing is decided in it.
                </p>
              )}
              <p>
                <strong>{host}/punjabi</strong>
                {' · '}
                <MailLink where="refer" />
              </p>
              <p>
                Not a crisis service. In crisis, call or text 9-8-8, or call 310-6789. In danger,
                9-1-1.
              </p>
            </div>

            <p className="pw-foot">
              {site.name} · online counselling across British Columbia ·{' '}
              <time dateTime={SHEET_DATE}>{SHEET_DATE_LABEL}</time> · free to copy as it stands
            </p>
          </article>

          <div className="prose no-print" style={{ marginTop: 28 }}>
            <p>
              The same practice in Punjabi is at <Link href="/punjabi" lang="pa">ਪੰਜਾਬੀ ਵਿੱਚ ਕਾਊਂਸਲਿੰਗ</Link>
              {who ? (
                <>
                  , and <Link href={`/practitioners/${who.slug}`}>{who.letters}</Link>&rsquo;s profile
                  says how she works
                </>
              ) : null}
              . A clinic that wants the sheet worded for its own setting can write to{' '}
              <MailLink where="refer" />.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
