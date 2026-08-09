import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
import { orgRef, siteRef, abs } from '@/lib/schema';
import CtaBand from '@/components/CtaBand';
import Figure from '@/components/Figure';
import Toc from '@/components/Toc';
import { buildToc } from '@/lib/toc';
import { CalendarCheck, CreditCard, RefreshCw, FileText } from 'lucide-react';

const TITLE = 'Client portal — book, pay and reschedule | Westpeak Wellness';
const DESC =
  'Book sessions, pay by credit card, reschedule or cancel, and download insurance receipts. ' +
  `Free cancellation up to ${site.cancellationHours} hours before your appointment.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: `${site.domain}/client-portal` },
  openGraph: { title: TITLE, description: DESC, url: `${site.domain}/client-portal` },
};

const DOES = [
  {
    icon: CalendarCheck,
    title: 'Book and see your schedule',
    body:
      'Pick a time from live availability rather than trading emails. Upcoming and past ' +
      'appointments are listed in one place, and confirmations and reminders are sent automatically.',
  },
  {
    icon: CreditCard,
    title: 'Pay by credit card',
    body:
      'Sessions are paid by card when you book, and bills and payment methods live in the ' +
      'portal afterwards. Card details are held by the payment processor under PCI compliance — ' +
      'never by this website, which takes no payment information at all.',
  },
  {
    icon: RefreshCw,
    title: 'Reschedule from your confirmation',
    body:
      `Your confirmation email carries a link to change the time. More than ${site.cancellationHours} ` +
      'hours out that is free and needs no explanation — see the cancellation policy below.',
  },
  {
    icon: FileText,
    title: 'Bills, receipts and documents',
    body:
      'Invoices and receipts are issued through the portal, along with any documents shared ' +
      'between sessions. Receipts carry the practitioner registration number that extended ' +
      'health plans ask for.',
  },
];

const STEPS = [
  {
    n: '1',
    h: 'Start with the free consultation',
    b: 'Fifteen minutes, no charge and no card required. It exists so you can decide whether this is a fit before any money changes hands.',
  },
  {
    n: '2',
    h: 'Book your first session in the portal',
    b: 'The booking calendar takes your card as you choose the time. Entering it is what holds the slot — an unpaid booking is not a held booking.',
  },
  {
    n: '3',
    h: 'The session is paid before it starts',
    b: 'The fee is taken at booking rather than afterwards, so there is nothing administrative to settle at the end of an hour you may not feel like talking business after.',
  },
  {
    n: '4',
    h: 'Your receipt appears automatically',
    b: 'It is issued to the portal for you to submit to your extended health plan yourself. This practice does not direct-bill — see fees and coverage for what that means.',
  },
];

const FAQS = [
  {
    q: 'Why do you take payment before the session rather than after?',
    a:
      'Two reasons, and neither is about distrust. It removes the transactional few minutes at the end ' +
      'of an hour that is often emotionally heavy, and it means the appointment is genuinely held rather ' +
      'than provisional. It is standard practice in private counselling.',
  },
  {
    q: `What happens if I cancel within ${site.cancellationHours} hours?`,
    a:
      `Cancellations more than ${site.cancellationHours} hours ahead are free — use the link in your ` +
      'confirmation email, or reply to it. Inside that window the session is charged, because the time ' +
      'was reserved and cannot realistically be filled at that notice. Nothing is charged automatically: ' +
      'if something unavoidable happened — illness, an emergency, a crisis — say so. That is a ' +
      'conversation, not a fee.',
  },
  {
    q: 'Is my card stored on this website?',
    a:
      'No. This website takes no payment information at all, and has no server that could. Card details ' +
      'are entered into the practice management system and held by its payment processor under PCI ' +
      'compliance. Neither this site nor the counsellor ever sees or stores your full card number.',
  },
  {
    q: 'Can I pay another way?',
    a:
      'Credit card through the portal is the standard method because it keeps booking, payment and ' +
      'receipts in one record. If a card is not workable for you, say so before your first session and ' +
      'it can be discussed.',
  },
  {
    q: 'Do I need the portal to be a client?',
    a:
      'It is the easiest route, but it is not a barrier. If self-serve booking is difficult for any ' +
      `reason, email ${site.email} and it will be handled directly.`,
  },
  {
    q: 'Is what I enter in the portal confidential?',
    a:
      'Yes. The portal is encrypted, and access to your record is limited to your counsellor. What ' +
      'confidentiality covers — and the narrow legal limits every counsellor in BC works under — is ' +
      'set out in full on the privacy page.',
  },
];

export default function ClientPortalPage() {
  const toc = buildToc([
    'What the portal does',
    'How booking and payment work',
    'Cancellation policy',
    'Common questions',
  ]);

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': abs('/client-portal'),
      name: TITLE,
      description: DESC,
      isPartOf: siteRef,
      about: orgRef,
      publisher: orgRef,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: site.domain },
        { '@type': 'ListItem', position: 2, name: 'Client portal', item: abs('/client-portal') },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container">
          <p className="eyebrow">For clients</p>
          <h1>Client portal</h1>
          <p className="direct-answer">
            The client portal is where Westpeak Wellness clients book sessions, pay by credit card,
            reschedule or cancel, and download insurance receipts. Sessions are paid before they
            begin, and cancellation is free up to {site.cancellationHours} hours before the
            appointment. New here? Start with the free 15-minute consultation instead — it costs
            nothing and needs no card.
          </p>

          <div className="btn-row" style={{ marginTop: 24 }}>
            {site.portalReady ? (
              <a
                className="btn btn--primary"
                href={site.portalUrl}
                target="_blank"
                rel="noopener"
              >
                Open the client portal
              </a>
            ) : (
              <Link className="btn btn--primary" href={site.bookingPath}>
                Book a free consultation
              </Link>
            )}
            <Link className="btn btn--ghost" href="/pricing">Fees and coverage</Link>
          </div>

          {!site.portalReady && (
            <p className="hero-note">
              Self-serve booking is being switched on. Until it is,{' '}
              <a href={`mailto:${site.email}`}>{site.email}</a> reaches the counsellor directly.
            </p>
          )}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container reading">
          <Toc items={toc} />
          <div className="prose">
            <p className="crumb"><Link href="/">Home</Link> / Client portal</p>

            <h2 id="what-the-portal-does">What the portal does</h2>
            <p>
              Everything administrative lives in one place, so booking, paying and getting a receipt
              are not three separate conversations. It is the same system that holds the clinical
              record, which means your appointment, your payment and your receipt are one entry
              rather than three that have to be matched up later.
            </p>

            <div className="route-grid" style={{ marginBottom: 30 }}>
              {DOES.map((d) => {
                const Icon = d.icon;
                return (
                  <div className="route-cell" key={d.title}>
                    <p className="route-k">
                      <Icon aria-hidden="true" strokeWidth={1.7} size={17} />
                      {d.title}
                    </p>
                    <p>{d.body}</p>
                  </div>
                );
              })}
            </div>

            <Figure name="booking-payment-flow" />

            <h2 id="how-booking-and-payment-work">How booking and payment work</h2>
            <p>
              The sequence is deliberately front-loaded, so that nothing financial has to be
              discussed in the last five minutes of a session.
            </p>
            <ol className="portal-steps">
              {STEPS.map((s) => (
                <li key={s.n}>
                  <span className="portal-step-n" aria-hidden="true">{s.n}</span>
                  <div>
                    <h3>{s.h}</h3>
                    <p>{s.b}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="crisis" style={{ margin: '30px 0' }}>
              <p style={{ margin: 0 }}>
                <strong>The consultation is free and takes no card.</strong> Payment only enters the
                picture once you have decided to book an actual session.{' '}
                <Link href={site.bookingPath}>Book the free consultation</Link>.
              </p>
            </div>

            <h2 id="cancellation-policy">Cancellation policy</h2>
            <p>
              <strong>
                Cancel or reschedule free of charge up to {site.cancellationHours} hours before your
                appointment.
              </strong>{' '}
              Use the link in your confirmation email, or just reply to it. You do not have to give a
              reason. Within {site.cancellationHours} hours the session is charged in full, because the
              time was held for you and cannot realistically be given to someone else at that notice.
            </p>
            <p>
              That policy exists to make the schedule work, not to catch anyone out. Illness,
              emergencies and genuine crises are exactly the circumstances counselling is for — if
              one of those is why you are cancelling late, say so and it will be treated sensibly.
              A policy applied without judgement is not the same as a policy applied without
              exception.
            </p>
            <ul className="checklist">
              <li>
                <strong>More than {site.cancellationHours} hours&rsquo; notice</strong> — free, no
                reason required, changed from your confirmation email.
              </li>
              <li>
                <strong>Less than {site.cancellationHours} hours&rsquo; notice</strong> — the
                session fee applies.
              </li>
              <li>
                <strong>Missed appointment without notice</strong> — the session fee applies.
              </li>
              <li>
                <strong>Something serious happened</strong> — get in touch. This is a conversation.
              </li>
            </ul>
            <p>
              Late-cancellation and missed-session charges are not claimable through extended health
              plans, because no service was delivered. Full detail on fees and what insurers do and
              do not reimburse is on <Link href="/pricing">fees and coverage</Link>, and{' '}
              <Link href="/resources/bc-extended-health-coverage-for-counselling">extended health coverage in BC</Link>{' '}
              explains the detail most people miss — whether your plan reimburses a{' '}
              <Link href="/compare/rcc-vs-psychologist-vs-social-worker-bc">Registered Clinical Counsellor</Link>{' '}
              specifically rather than only a psychologist. If cost is the obstacle rather than a
              detail, <Link href="/resources/low-cost-counselling-bc">low-cost counselling in BC</Link>{' '}
              and <Link href="/compare/efap-vs-private-counselling">EFAP vs private counselling</Link>{' '}
              are worth reading before paying anybody.
            </p>
            <p>
              Not sure a session is the right next step at all?{' '}
              <Link href="/guides/signs-it-might-be-time-for-therapy">Signs it might be time for therapy</Link>{' '}
              and <Link href="/guides/what-to-expect-first-therapy-session">what to expect in a first session</Link>{' '}
              both cover that ground, and neither requires booking anything. The{' '}
              <Link href="/services">full list of services</Link> sets out what the sessions
              themselves involve.
            </p>

            <h2 id="common-questions">Common questions</h2>
            <div style={{ marginTop: 8 }}>
              {FAQS.map((f) => (
                <details className="faq-item" key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>

            <div className="chip-grid" style={{ marginTop: 28 }}>
              <Link className="chip" href="/pricing">Fees and coverage</Link>
              <Link className="chip" href="/privacy">Privacy and confidentiality</Link>
              <Link className="chip" href="/faq">All frequently asked questions</Link>
              <Link className="chip" href="/contact">Contact</Link>
              <Link className="chip" href={site.bookingPath}>Book a free consultation</Link>
            </div>

            <p style={{ color: 'var(--ink-faint)', fontSize: '.9rem', marginTop: 28 }}>
              Card details are handled by a PCI-compliant payment processor through the practice
              management system. This website neither collects nor stores payment information.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <CtaBand />
        </div>
      </section>
    </>
  );
}
