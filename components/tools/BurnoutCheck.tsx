'use client';

import Link from 'next/link';
import Quiz from '@/components/tools/Quiz';
import ResultCta from '@/components/tools/ResultCta';
import { BURNOUT_CHECK, BURNOUT_REFLECTIONS } from '@/lib/tools';

/* No score, no verdict, same rule as StressCheckTool.
 *
 * A tool that announced "you have burnout" would be a diagnosis from a website,
 * which is not something a Registered Clinical Counsellor does in a room, let
 * alone in a browser. BCACC advertising standards do not permit implying
 * otherwise, and it would be useless anyway: the two overlap, and burnout that
 * has run long enough frequently becomes the other one.
 *
 * What it does instead is weigh which way the answers lean and say so, because
 * the distinction — does this travel with you, or is it bound to a context — is
 * the one people cannot make for themselves and the one that changes what
 * helps. Leaning both ways is a real outcome and gets its own reflection rather
 * than being resolved arbitrarily. */
export default function BurnoutCheck() {
  return (
    <Quiz
      slug="burnout-or-depression"
      questions={BURNOUT_CHECK}
      onResult={(tags) => {
        const counts = tags.filter(Boolean).reduce<Record<string, number>>((acc, t) => {
          acc[t] = (acc[t] ?? 0) + 1;
          return acc;
        }, {});
        const context = counts.context ?? 0;
        const travels = counts.travels ?? 0;
        const load = counts.load ?? 0;

        /* "Mixed" is a genuine finding rather than a tie-break. Two answers
           apart is not a lean, and saying so is more honest than rounding. */
        const keys: string[] = [];
        if (load >= 3) keys.push('load');
        if (context > 0 || travels > 0) {
          if (Math.abs(context - travels) <= 1 && context + travels >= 3) keys.push('mixed');
          else if (context > travels) keys.push('context');
          else if (travels > context) keys.push('travels');
        }
        if (!keys.length && load > 0) keys.push('load');

        const notes = keys.map((k) => BURNOUT_REFLECTIONS[k]).filter(Boolean);

        return (
          <>
            <p className="eyebrow">What you said</p>
            <h2>{notes.length ? 'Which way it leans' : 'Nothing clearly one or the other'}</h2>
            {notes.length ? (
              notes.map((n) => <p key={n}>{n}</p>)
            ) : (
              <p>
                Your answers do not lean strongly either way, which is worth knowing rather than
                a failure of the questions. If you came looking anyway, that is usually the more
                useful signal, people do not check this at random.
              </p>
            )}
            <p>
              <strong>This is not a diagnosis and cannot be one.</strong> Seven questions cannot
              do what a conversation does, and the two conditions overlap enough that plenty of
              people have both. What it can do is give you a clearer description than
              &ldquo;I am exhausted&rdquo; to start from.
            </p>
            <p>
              The longer read is{' '}
              <Link href="/guides/burnout-vs-depression">burnout vs depression</Link>, and if
              work is the source,{' '}
              <Link href="/guides/stress-leave-bc">how stress leave works in BC</Link> covers the
              practical side.
            </p>
            <ResultCta tool="burnout-or-depression" label="Talk it through, free 15 minutes" />
            <div className="crisis" style={{ marginTop: 22 }}>
              <p style={{ margin: 0 }}>
                <strong>If things are worse than this page can hold:</strong> call or text{' '}
                <a href="tel:988"><strong>9-8-8</strong></a> (Canada, any hour), or{' '}
                <a href="tel:3106789"><strong>310-6789</strong></a> for BC Mental Health Support.
                In immediate danger, <a href="tel:911"><strong>9-1-1</strong></a>.{' '}
                <Link href="/resources/bc-crisis-and-support-directory">Full BC directory</Link>
              </p>
            </div>
          </>
        );
      }}
    />
  );
}
