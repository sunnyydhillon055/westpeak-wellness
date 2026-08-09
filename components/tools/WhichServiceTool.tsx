'use client';

import Link from 'next/link';
import Quiz from '@/components/tools/Quiz';
import ResultCta from '@/components/tools/ResultCta';
import { WHICH_SERVICE, WHICH_SERVICE_OUTCOMES } from '@/lib/tools';

export default function WhichServiceTool() {
  return (
    <Quiz
      slug="which-service"
      questions={WHICH_SERVICE}
      onResult={(tags) => {
        // Outcomes are ordered by urgency then specificity, so the first match
        // wins and "crisis" always beats a service recommendation.
        const hit =
          WHICH_SERVICE_OUTCOMES.find((o) => tags.includes(o.tag)) ??
          WHICH_SERVICE_OUTCOMES[WHICH_SERVICE_OUTCOMES.length - 1];
        return (
          <>
            <p className="eyebrow">Suggested starting point</p>
            <h2>{hit.heading}</h2>
            <p>{hit.body}</p>
            {hit.href && (
              <p>
                <Link className="btn btn--ghost" href={hit.href}>{hit.hrefLabel} →</Link>
              </p>
            )}
            {!hit.elsewhere && <ResultCta tool="which-service" />}
            <p className="tool-disclaimer">
              This is a signpost, not an assessment. A 15-minute conversation will get you a
              better answer than five questions can, and it costs nothing.
            </p>
          </>
        );
      }}
    />
  );
}
