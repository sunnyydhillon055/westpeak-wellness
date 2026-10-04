import Link from 'next/link';
import type { Source } from '@/lib/health-authorities';

/* THE ENGLISH CLOSE OF A PUNJABI OR TAGALOG GUIDE — 4 Oct 2026.
 *
 * Server-rendered, no client JS. The guides said everything a reader needed
 * about the subject and nothing about the practical next step: no fee, no
 * mention that the first conversation is free, no way to check a counsellor's
 * registration, and on the Punjabi guides no way to write instead of book.
 * Those facts already live in English on /pricing, /contact and
 * /resources/verify-a-counsellor-in-bc, and no new Punjabi or Tagalog prose is
 * written without a native reviewer, so this is one English sentence and the
 * guide's own sources. The sources differ per guide (lib/punjabi-guides.ts
 * GUIDE_SOURCES); the sentence is the same fact on every guide and stays short
 * for that reason. The 15 minutes is CONSULT_MINUTES in lib/cliniko-catalog.ts. */
export default function LanguageGuideNextSteps({ sources }: { sources: readonly Source[] }) {
  return (
    <div lang="en-CA" style={{ marginTop: 26 }}>
      <p>
        In English: the first step is a free 15-minute video consultation, with no card and no
        obligation. <Link href="/pricing">Session fees and insurance coverage</Link> are listed in
        full, you can <Link href="/resources/verify-a-counsellor-in-bc">check a counsellor’s
        registration on the public register</Link>, and if you would rather write than book,{' '}
        <Link href="/contact">send a short note</Link> and the reply comes within one business day.
      </p>
      {sources.length > 0 && (
        <>
          <p className="eyebrow">Sources</p>
          <ul style={{ color: 'var(--ink-soft)', fontSize: '.94rem', paddingLeft: 20, margin: 0 }}>
            {sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener">{s.label}</a>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
