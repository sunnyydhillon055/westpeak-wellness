import Link from 'next/link';
import BookLink from '@/components/BookLink';
import AskInstead from '@/components/AskInstead';

/* The closing call to action, on 27 route files and therefore on nearly every
 * page of the site.
 *
 * IT USED TO OFFER ONE THING, AND IT WAS THE BIGGEST THING.
 *
 * A crawl on 17 Aug 2026 found that booking a video call was the only route to
 * contact on 94 of 116 pages, and this component is most of why: a heading, a
 * sentence, and a Book button. Anyone not ready for a scheduled video call with
 * a stranger — which, on a counselling site, is most people on most visits —
 * had nowhere to go from here.
 *
 * So the band now carries two rungs. The booking link is unchanged and still
 * first, because for someone who has decided, it is the right action. Under it
 * sits a form that takes one sentence and an email address. Offering the small
 * step alongside the large one is not a softer sell; it is the difference
 * between a page that converts the ready and a page that also hears from
 * everybody else.
 *
 * `tone="gentle"` changes the register for pages where a cheerful booking
 * prompt reads badly — intrusive thoughts, crisis-adjacent guides, being at the
 * end of your rope. Same machinery, different words.
 *
 * `forSomeoneElse` adds the path for a partner, parent or adult child searching
 * on behalf of somebody who is not in the room. Every call to action on this
 * site was addressed to the person who needs therapy, and a real share of the
 * traffic is not that person.
 *
 * `ask` turns the form off on the handful of pages that already carry a fuller
 * one — /contact, /book, /pricing — where two forms would compete.
 */
export default function CtaBand({
  heading = 'Therapy starts with one conversation.',
  text = 'Book a free 15-minute consultation over secure video. No pressure — just a chance to see if we’re a good fit.',
  tone = 'default',
  forSomeoneElse = true,
  ask = true,
  headingLang,
  headingClassName,
}: {
  heading?: string;
  text?: string;
  tone?: 'default' | 'gentle';
  forSomeoneElse?: boolean;
  ask?: boolean;
  /** For a heading in another script (the Punjabi surfaces pass Gurmukhi):
   *  the lang attribute and the font class that actually renders it. */
  headingLang?: string;
  headingClassName?: string;
}) {
  const gentle = tone === 'gentle';

  return (
    <section className="section">
      <div className="container">
        <div className="cta-band">
          <h2 lang={gentle ? undefined : headingLang} className={gentle ? undefined : headingClassName}>
            {gentle ? 'There is no wrong way to start.' : heading}
          </h2>
          <p>
            {gentle
              ? 'A free 15-minute consultation over secure video, whenever you are ready for one. Nothing is committed by having it, and no card is needed to book it.'
              : text}
          </p>
          <BookLink location="cta-band">Book Free Consultation</BookLink>

          {ask && (
            <div className="cta-band-ask">
              <AskInstead tone={tone} />
            </div>
          )}

          {forSomeoneElse && (
            <p className="cta-band-alt">
              Looking on behalf of someone else?{' '}
              <Link href="/refer">What to send them, and what not to</Link> — including the
              funded routes most people do not know they qualify for.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
