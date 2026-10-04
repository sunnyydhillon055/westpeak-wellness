'use client';

import Link from 'next/link';
import Quiz from '@/components/tools/Quiz';
import ResultCta from '@/components/tools/ResultCta';
import { STRESS_CHECK } from '@/lib/tools';

/* Produces no score and no category, deliberately.
 *
 * A number would be read as a diagnosis however it were captioned, and this is
 * not a validated screening instrument — BCACC advertising standards do not
 * permit implying otherwise. Reflecting the pattern back in the reader's own
 * words is both honest and more useful for deciding whether to talk to someone. */
const REFLECTIONS: Record<string, string> = {
  arousal:
    'Several answers point at a nervous system that has not been getting the chance to settle: sleep that will not come, a body that stays tense, a mind that replays things. That is a recognisable pattern, and it responds well to being worked on directly.',
  low:
    'Several answers describe flatness rather than distress: less enjoyment, more weight, less motivation. That is worth taking as seriously as anxiety, and it tends to be quieter about announcing itself.',
  load:
    'What stands out is load rather than any single symptom. The sense that the current arrangement is not sustainable for another six months. That is useful information on its own.',
  self:
    'One answer stands out: when things go wrong, the explanation you reach for is that it is your fault. That habit is one of the more changeable things in this list.',
  seen:
    'Someone around you has already asked if you are okay. People usually ask because they have noticed something real.',
  alone:
    'You mentioned there is not really anyone to notice. That is its own thing to name, separate from everything else here.',
};

export default function StressCheckTool() {
  return (
    <Quiz
      slug="stress-check"
      questions={STRESS_CHECK}
      onResult={(tags) => {
        const seen = Array.from(new Set(tags.filter(Boolean)));
        const notes = seen.map((t) => REFLECTIONS[t]).filter(Boolean);
        return (
          <>
            <p className="eyebrow">What you said</p>
            <h2>{notes.length ? 'Reading it back' : 'Not much stood out'}</h2>
            {notes.length ? (
              notes.map((n) => <p key={n}>{n}</p>)
            ) : (
              <p>
                Nothing in your answers points to a particular pattern, which is worth knowing
                too. If you came here anyway, that impulse is worth paying attention to, people
                rarely look up counselling tools at random.
              </p>
            )}
            <p>
              <strong>None of that is a diagnosis, and it is not meant to be.</strong> Six
              questions cannot do what a conversation does. If any of it landed, that is a
              reasonable thing to bring to a free 15-minute consultation, and there is no
              obligation attached to one.
            </p>
            <ResultCta tool="stress-check" label="Talk it through, free 15 minutes" />
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
