import Link from 'next/link';
import { site } from '@/lib/site';
export default function CtaBand({ heading = 'Therapy starts with one conversation.', text = 'Book a free 15-minute consultation by phone or video. No pressure — just a chance to see if we\u2019re a good fit.' }: { heading?: string; text?: string }) {
  return (
    <section className="section">
      <div className="container">
        <div className="cta-band">
          <h2>{heading}</h2>
          <p>{text}</p>
          <Link className="btn btn--primary" href={site.bookingPath}>Book Free Consultation</Link>
        </div>
      </div>
    </section>
  );
}
