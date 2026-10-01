'use client';

import { useState } from 'react';
import Link from 'next/link';
import { track } from '@/lib/analytics';
import { toolDetail } from '@/lib/conversion-detail-client';
import type { Question } from '@/lib/tools';

/* One question at a time, keyboard operable, nothing stored anywhere.
 *
 * Answers live in component state and are gone on reload — no localStorage, no
 * submission, no identifier. A tool that asks how someone's sleep has been
 * should not also be quietly building a record of it.
 *
 * What IS counted, since 1 Oct 2026: that the tool was finished, and for the
 * tools that reach a conclusion, which one — "which-service:couples",
 * "what-can-i-access:eap". A count per outcome, from the tool's own fixed
 * list (lib/conversion-detail.ts), never the answers that led there. It says
 * which service the warm readers are being pointed at, which is what decides
 * where the next page is worth writing. The reflection tools pass no
 * `outcomeOf` and are counted by name only, because they produce no verdict
 * and the counter should not invent one. */
export default function Quiz({
  slug,
  questions,
  onResult,
  outcomeOf,
  children,
}: {
  slug: string;
  questions: Question[];
  onResult: (tags: string[]) => React.ReactNode;
  /** The outcome key the result will lead with, for the same tags. */
  outcomeOf?: (tags: string[]) => string | undefined;
  children?: React.ReactNode;
}) {
  const [step, setStep] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const done = step >= questions.length;

  function choose(tag: string) {
    if (step === 0) track('tool_start', { tool: slug });
    const next = [...tags, tag];
    setTags(next);
    if (step + 1 >= questions.length) {
      const outcome = outcomeOf?.(next);
      track('tool_complete', { tool: slug, outcome, detail: toolDetail(slug, outcome) });
    }
    setStep(step + 1);
  }

  function restart() {
    setStep(0);
    setTags([]);
  }

  if (done) {
    return (
      <div className="quiz quiz--result">
        {onResult(tags)}
        {children}
        <button type="button" className="btn btn--ghost" onClick={restart} style={{ marginTop: 20 }}>
          Start again
        </button>
      </div>
    );
  }

  const q = questions[step];
  return (
    <div className="quiz">
      <p className="quiz-progress" aria-live="polite">
        Question {step + 1} of {questions.length}
      </p>
      <div className="quiz-bar" aria-hidden="true">
        <span style={{ width: `${(step / questions.length) * 100}%` }} />
      </div>

      <fieldset className="quiz-set">
        <legend className="quiz-q">{q.q}</legend>
        {q.help && <p className="quiz-help">{q.help}</p>}
        <div className="quiz-choices">
          {q.choices.map((c) => (
            <button key={c.label} type="button" className="quiz-choice" onClick={() => choose(c.tag)}>
              {c.label}
            </button>
          ))}
        </div>
      </fieldset>

      {step > 0 && (
        <button
          type="button"
          className="quiz-back"
          onClick={() => {
            setTags(tags.slice(0, -1));
            setStep(step - 1);
          }}
        >
          ← Previous question
        </button>
      )}
      <p className="quiz-privacy">
        Nothing here is stored or sent anywhere. Closing the page erases it.{' '}
        <Link href="/privacy">Privacy</Link>
      </p>
    </div>
  );
}
