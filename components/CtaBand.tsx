import Link from 'next/link';
import { site } from '@/lib/site';
import BookLink from '@/components/BookLink';
export default function CtaBand({ heading = 'Therapy starts with one conversation.', text = 'Book a free 15-minute consultation over secure video. No pressure — just a chance to see if we\u2019re a good fit.' }: { heading?: string; text?: string }) {
  return (
    <section className="section">
      <div className="container">
        <div className="cta-band">
          <h2>{heading}</h2>
          <p>{text}</p>
          <BookLink location="cta-band">Book Free Consultation</BookLink>
        </div>
      </div>
    </section>
  );
}
