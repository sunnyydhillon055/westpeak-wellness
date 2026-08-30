import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
import Breadcrumbs from '@/components/Breadcrumbs';
import CtaBand from '@/components/CtaBand';
import Figure from '@/components/Figure';
import { readCatalog, money, type CatalogItem } from '@/lib/cliniko-catalog';
import { ogBase } from '@/lib/og-meta';

export const revalidate = 3600;

const TITLE = 'Bring this to your doctor';
const DESC =
  'A one-page summary to print or take to your GP in BC — designation, scope limits, fees, and why no referral is needed to see a counsellor.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: `${site.domain}/refer/doctor` },
  openGraph: { ...ogBase(`/refer/doctor`), title: `${TITLE} | ${site.name}`, description: DESC, url: `${site.domain}/refer/doctor` },
};

/* WHY THIS PAGE EXISTS
 *
 * Two jobs, and it is worth being explicit that they are different people.
 *
 *   1. The searcher. "Do I need a referral to see a counsellor in BC" is a
 *      real, repeated question with a short and slightly surprising answer:
 *      no, because MSP does not fund Registered Clinical Counsellors in the
 *      first place, and a gate nobody is standing at needs no key. That
 *      answer is currently spread across /resources/msp-vs-extended-health and
 *      the RCC resource; nothing on the site says it in the words people use.
 *
 *   2. The GP appointment. A client who wants their doctor in the loop —
 *      about medication, a leave, an assessment referral — has nothing to
 *      hand over. Family practice appointments in BC are short, and a person
 *      trying to explain a counselling practice from memory in the last two
 *      minutes of one does it badly. A single printed sheet does it better.
 *
 * WHAT THE ONE-PAGER MUST NOT BE
 *
 * Not a pitch. The card below is deliberately weighted toward scope limits
 * and verification, because that is what a physician needs in order to decide
 * whether to send someone here — and because BCACC advertising standards make
 * the persuasive register unavailable anyway. No outcome claims, nothing about
 * results, no testimonials. Verifiable facts and the register they can be
 * checked in, which is a stronger thing to put in front of a clinician.
 *
 * The counsellor's personal name is not on it, per the sitewide rule in
 * lib/site.ts — designation, registration number and register are what a
 * physician would actually check, and the register lookup resolves the name.
 *
 * PRINT. app/premium.css already strips chrome, forms and CTAs at print and
 * gives .callout a hard border, so the card survives a Ctrl-P as a bordered
 * sheet without a print stylesheet of its own. The .no-print helper hides the
 * screen-only instructions; everything else on the page is worth carrying.
 */
export default async function BringToYourDoctor() {
  const catalog = await readCatalog();
  const find = (n: string): CatalogItem | undefined =>
    catalog.items.find((i) => i.name.toLowerCase() === n.toLowerCase());

  const consult = find('Initial Consultation');
  const individual = find('Individual Counselling');
  const couples = find('Couples Counselling');
  const intensive = find('EMDR Intensive');

  const fees: { label: string; item?: CatalogItem }[] = [
    { label: 'Initial consultation', item: consult },
    { label: 'Individual counselling', item: individual },
    { label: 'Couples counselling', item: couples },
    { label: 'EMDR intensive', item: intensive },
  ];

  return (
    <>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container container--narrow">
          <p className="eyebrow">For the appointment</p>
          <h1>Bring this to your doctor.</h1>
          <p className="lede">
            You do not need a referral to see a counsellor in British Columbia. You may still
            want your doctor in the loop — and family-practice appointments are short. This is
            the page to print and hand over.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 30 }}>
        <div className="container container--narrow">
          <Breadcrumbs
            trail={[
              { name: 'Passing it on', path: '/refer' },
              { name: 'For your doctor', path: '/refer/doctor' },
            ]}
          />

          <div className="prose">
            <h2>Do you need a referral to see a counsellor in BC?</h2>
            <p>
              <strong>No.</strong> You can book a Registered Clinical Counsellor directly, today,
              without your doctor knowing about it. There is no waiting list to be placed on and
              no form for anyone to sign.
            </p>
            <p>
              The reason is worth understanding, because it explains a lot of the confusion.
              Referrals exist where a public payer or a specialist&rsquo;s office requires one —
              psychiatry, for instance, which is a medical specialty billed to MSP. Counselling
              by an RCC is not billed to MSP at all; it is paid privately or through extended
              health. There is no gate, because nobody is standing at one.{' '}
              <Link href="/resources/msp-vs-extended-health">
                What MSP covers and what it does not
              </Link>{' '}
              sets out the division in full.
            </p>
            <p>
              One consequence people find genuinely useful: a doctor&rsquo;s note is not needed to
              start counselling, and it is not needed to use the twelve ICBC-funded sessions
              available after a crash either. The note is only ever needed for the thing it is
              actually about &mdash;{' '}
              <Link href="/guides/doctors-note-for-a-mental-health-leave">
                time off work
              </Link>
              .
            </p>

            {/* designations-bc, added 2026-08-30. This was the only page on the
                site carrying no in-body image, and it is the page most likely
                to be read by somebody who is not a prospective client: a GP,
                a nurse practitioner, an EFAP coordinator. The single thing
                that audience most often has wrong is which BC designation
                does what, and the diagram answering that already existed. */}
            <Figure name="designations-bc" />

            <h2>What is worth asking your GP for</h2>
            <p>
              A referral is not on this list, because it does not exist. These are the things a
              family doctor can do that a counsellor cannot, and the ones worth spending a short
              appointment on:
            </p>
            <ul className="checklist">
              <li>
                <strong>A medical review before you conclude it is psychological.</strong> Thyroid
                function, iron, B12, sleep apnoea and medication side effects all produce
                symptoms that read as low mood or anxiety. Counselling does not rule any of them
                out.
              </li>
              <li>
                <strong>A medication conversation.</strong> Counsellors do not prescribe. Where
                medication is part of the picture, the work runs alongside a prescriber rather
                than instead of one.
              </li>
              <li>
                <strong>A note for a leave, and the paperwork that follows.</strong> Only a
                physician or nurse practitioner can certify one. The{' '}
                <Link href="/resources/workplace-mental-health-bc">work-and-leave cluster</Link>{' '}
                covers what to ask for and in what order.
              </li>
              <li>
                <strong>A referral to psychiatry or for formal assessment.</strong> A diagnosis,
                an ADHD or autism assessment, or cognitive testing needs a psychiatrist or a
                registered psychologist &mdash;{' '}
                <Link href="/resources/psychiatry-and-assessment-in-bc">
                  how those routes actually work in BC
                </Link>{' '}
                is honest about the waits.
              </li>
              <li>
                <strong>Coordination, if you want it.</strong> Nothing is shared with a doctor
                without your written consent. If you do want your counsellor and your GP talking
                to one another, say so and it can be arranged &mdash; and if you do not, that is
                the default.
              </li>
            </ul>

            <p className="no-print" style={{ marginTop: 36 }}>
              <strong>The sheet below is the part to print.</strong> Press Ctrl&nbsp;+&nbsp;P
              (&#8984;&nbsp;+&nbsp;P on a Mac) and choose your printer or &ldquo;Save as
              PDF&rdquo;. The site navigation, buttons and forms drop away automatically.
            </p>
          </div>

          {/* The one-pager. .callout is the class app/premium.css promotes at
              print time — bordered, white, break-inside: avoid. */}
          <div className="callout" id="one-pager" style={{ marginTop: 24 }}>
            <p className="eyebrow" style={{ marginTop: 0 }}>For the treating physician</p>
            <h2 style={{ marginTop: 4 }}>{site.name} &mdash; practice summary</h2>
            <p>
              Virtual counselling practice serving adults across British Columbia. Sessions are
              provided by a <strong>{site.counsellor.title}</strong> ({site.counsellor.credentials}
              ), verifiable in the{' '}
              <a href={site.counsellor.registerUrl} rel="noreferrer">
                {site.counsellor.registerName} register
              </a>
              . No physician referral is required for a patient to book.
            </p>

            <h3>Delivery and access</h3>
            <ul>
              <li><strong>Format:</strong> video sessions only; no in-person office.</li>
              <li><strong>Area served:</strong> {site.serviceArea}.</li>
              <li><strong>Languages:</strong> {site.languages}.</li>
              <li><strong>Population:</strong> adults and couples.</li>
              <li>
                <strong>Access:</strong> a free 15-minute consultation is booked directly by the
                patient at <strong>{site.domain.replace(/^https?:\/\//, '')}/book</strong>. No
                intake paperwork is required before it.
              </li>
            </ul>

            <h3>Common presentations seen</h3>
            <p>
              Anxiety, depression and low mood, trauma and PTSD (including EMDR), burnout and
              work-related stress, grief, relationship and couples work, and cultural and
              intergenerational strain in South Asian families. Approaches used are listed at{' '}
              <strong>{site.domain.replace(/^https?:\/\//, '')}/approaches</strong>.
            </p>

            <h3>Scope limits &mdash; what this practice does not do</h3>
            <ul>
              <li>
                <strong>No diagnosis.</strong> An RCC does not diagnose mental disorders. Where a
                formal diagnosis is needed for a claim, an accommodation or a medication
                decision, that remains with medicine or psychology.
              </li>
              <li><strong>No prescribing</strong> or medication adjustment.</li>
              <li>
                <strong>No formal psychological assessment</strong> &mdash; psychoeducational,
                ADHD, autism and cognitive testing all require a registered psychologist.
              </li>
              <li>
                <strong>No court-ordered or forensic work</strong>, including custody and
                parenting evaluations or any assessment intended as evidence.
              </li>
              <li>
                <strong>Not a crisis service.</strong> Sessions are scheduled and there is no
                on-call line. Urgent presentations should go to 9-1-1, 9-8-8, or BC Mental Health
                Support at 310-6789.
              </li>
              <li>
                <strong>Not a fit for every presentation.</strong> Active psychosis, an eating
                disorder requiring medical monitoring, or substance dependence requiring
                withdrawal management are referred on rather than taken on.
              </li>
            </ul>

            <h3>Fees and funding</h3>
            <table>
              <thead>
                <tr>
                  <th>Session</th>
                  <th>Length</th>
                  <th>Fee</th>
                </tr>
              </thead>
              <tbody>
                {fees.map(({ label, item }) =>
                  item ? (
                    <tr key={label}>
                      <td>{label}</td>
                      <td>{item.minutes} min</td>
                      <td>{money(item.cents)}</td>
                    </tr>
                  ) : null
                )}
              </tbody>
            </table>
            <p>
              Not billed to MSP. Many BC extended-health plans reimburse a Registered Clinical
              Counsellor &mdash; patients should check that their plan names the RCC designation
              specifically. Patients injured in a motor vehicle crash are pre-approved by ICBC
              for twelve counselling sessions in the first twelve weeks, with no physician note
              required to begin.
            </p>

            <h3>Contact and information sharing</h3>
            <p>
              Practice enquiries: <strong>{site.email}</strong>
              {site.phone ? (
                <>
                  {' '}&middot; <strong>{site.phone}</strong>
                </>
              ) : null}
              . Clinical information is released only with the patient&rsquo;s written consent;
              a request for a consent form can be made through the same address. Standards,
              ethics and the complaints route are published in full at{' '}
              <strong>{site.domain.replace(/^https?:\/\//, '')}/standards</strong>.
            </p>
          </div>

          <div className="prose" style={{ marginTop: 40 }}>
            <h2>If your doctor wants to refer someone here</h2>
            <p>
              There is no referral form and none is needed &mdash; the patient books the free
              consultation themselves, which is also how they find out whether this is the right
              place before anyone commits. Clinics that would rather send information first can
              write to <a href={`mailto:${site.email}`}>{site.email}</a>, and{' '}
              <Link href="/contact">the enquiry form</Link> reaches the same inbox.
            </p>
            <p>
              Where this practice is not the right fit, saying so is the normal outcome of a
              consultation rather than a failure of one, and{' '}
              <Link href="/resources/low-cost-counselling-bc">
                free and low-cost counselling in BC
              </Link>{' '}
              is the list worth having in the room for the patients for whom cost is the actual
              barrier.
            </p>
          </div>
        </div>
      </section>

      <CtaBand ask />
    </>
  );
}
