import Link from 'next/link';
import type { Metadata } from 'next';
import Image from 'next/image';
import { site } from '@/lib/site';
import CtaBand from '@/components/CtaBand';
import Motif from '@/components/brand/Motif';
import { GraduationCap, Scale, BadgeCheck, Waves, HeartHandshake, Landmark } from 'lucide-react';

// The counsellor's personal name is intentionally scoped to this file only.
// Every other page refers to "Westpeak Wellness" or "your counsellor".
const counsellorName = 'Aman Bains Dhillon';

export const metadata: Metadata = {
  title: 'Meet Aman Bains Dhillon, MA, RCC',
  description:
    'Aman Bains Dhillon, MA, RCC \u2014 EMDR- and Gottman-trained, offering online therapy across BC in English and Punjabi. Master\u2019s in intergenerational trauma.',
  alternates: { canonical: `${site.domain}/about` },
};

export default function About() {
  return (
    <>
      <section className="hero" style={{ paddingBottom: 48 }}>
        <div className="container hero-split">
          <div>
            <p className="eyebrow">Meet your counsellor</p>
            <h1>{counsellorName}, {site.counsellor.credentials}</h1>
            <p className="lede">
              Registered Clinical Counsellor. EMDR-trained. Gottman-trained. Born and raised in Surrey.
              Fluent in English and Punjabi.
            </p>
            <div className="btn-row" style={{ marginTop: 24 }}>
              <Link className="btn btn--primary" href={site.bookingPath}>Book a Free Consultation</Link>
              <Link className="btn btn--ghost" href="/pricing">Fees and coverage</Link>
            </div>
            <p className="badge-rcc"><BadgeCheck aria-hidden="true" strokeWidth={1.7} />Registered Clinical Counsellor · BCACC · verify at bcacc.ca</p>
          </div>
          <div className="portrait">
            <span className="portrait-bloom" aria-hidden="true"><Motif variant="bloom" /></span>
            <Image
              src="/img/photo/counsellor-portrait.jpg"
              alt={`${counsellorName}, ${site.counsellor.credentials}, ${site.counsellor.title} at ${site.name}`}
              width={800}
              height={1000}
              sizes="(max-width: 860px) 340px, 420px"
              quality={90}
              priority
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container prose">
          <p className="crumb"><a href="/">Home</a> / About</p>
          <h2>Why I do this work.</h2>
          <p>
            I was born and raised in Surrey, BC, in a culturally diverse household where mental health
            was rarely talked about openly — but the weight of it was always there.
          </p>
          <p>
            My approach is warm, direct, culturally grounded. I won&rsquo;t ask you to translate your
            context. We&rsquo;ll figure out what works — at your pace.
          </p>
          <blockquote className="quote" style={{ margin: '32px 0' }}>
            A safe, culturally competent, non-judgmental space for healing.
          </blockquote>
          <p>
            The best way to find out whether that translates into a good working fit for you is a{' '}
            <Link href={site.bookingPath}>free 15-minute consultation</Link> — no pressure, and no
            obligation to book a session afterward. If you would rather read first, there is a
            walkthrough of{' '}
            <Link href="/guides/what-to-expect-first-therapy-session">what actually happens in a first session</Link>.
          </p>

          <h2>What sessions are actually like</h2>
          <p>
            Fifty minutes, by secure video, from wherever you are in British Columbia. Early sessions
            are mostly you talking and me asking questions, because I would rather understand the
            shape of something properly than start working on the wrong part of it quickly.
          </p>
          <p>
            I am fairly direct. If I think a pattern is doing something you have not named yet, I will
            say so rather than wait for you to arrive at it — and you are entirely free to tell me I
            have it wrong. That exchange is the work, not an interruption of it. I will also tell you
            what I am doing and why: if I suggest a particular approach, you should understand what it
            involves and what it may stir up before we start it, not afterwards.
          </p>
          <p>
            Sessions end deliberately. I would rather close something down properly and leave the rest
            for next week than run hard to the final minute and send you back into your day raw. For
            trauma work in particular, that pacing is a clinical decision rather than a courtesy —{' '}
            <Link href="/services/trauma-therapy">how that sequencing works</Link> is worth reading if
            it is what brought you here.
          </p>

          <h2>How I decide what to use</h2>
          <p>
            Being trained in several approaches is only useful if the choice between them is
            explainable. Broadly: where something specific and current is maintaining a difficulty —
            avoidance, a thinking pattern, a habit that has stopped serving you — structured{' '}
            <Link href="/services/anxiety-counselling">cognitive behavioural work</Link> tends to move
            fastest. Where a memory is still firing in the present regardless of what you know
            intellectually, <Link href="/services/emdr-therapy">EMDR</Link> is usually the more direct
            route. Where the difficulty lives between two people rather than inside one,{' '}
            <Link href="/services/couples-therapy">Gottman-based couples work</Link> starts with
            assessment before anything gets prescribed.
          </p>
          <p>
            We agree a plan and we review it. If nothing has moved after a couple of months, that is
            information about the plan rather than a verdict on you, and changing approach — or
            referring you to someone better suited — is a legitimate answer. I would rather say that
            out loud than keep an appointment. There is a whole page on{' '}
            <Link href="/guides/when-therapy-isnt-working">what to do when therapy is not working</Link>,
            and it applies here as much as anywhere.
          </p>

          <h2>On working in Punjabi</h2>
          <p>
            Working in the language you think in is not a convenience. A great deal of what people
            bring to counselling — the exact phrasing a parent used, the specific weight of an
            obligation, the joke that was not really a joke — does not survive translation, and
            translating it in real time while also feeling it is genuinely hard work.
          </p>
          <p>
            It also means not having to explain the context first. Knowing why a decision that looks
            straightforward from outside is not straightforward inside a family is a starting point
            rather than something we spend three sessions establishing. That said, shared background
            is not the same as knowing your family, and I try to check assumptions out loud rather than
            act on them. More on that in{' '}
            <Link href="/services/punjabi-counselling">counselling in Punjabi</Link> and{' '}
            <Link href="/for/first-gen-south-asian-adults">working with first-generation South Asian adults</Link>.
          </p>

          <h2>What I do not do</h2>
          <p>
            A Registered Clinical Counsellor does not diagnose, does not prescribe or advise on
            medication, and does not conduct formal psychological assessment — so if you need an ADHD
            or autism assessment, a diagnosis for a disability claim, or a medication review, that is a
            registered psychologist, a physician or a psychiatrist, and I will say so rather than take
            the booking. I also do not do court-ordered or forensic work, and this is not a crisis
            service: sessions are scheduled and there is no 24-hour line.
          </p>
          <p>
            Some presentations are better served by a specialised team than by general counselling,
            and naming that in a consultation is a normal outcome rather than a rejection. The full
            list of limits, along with the code of ethics I work under and the route to complain about
            me, is set out on <Link href="/standards">standards and accountability</Link>. If you want
            to check my registration independently before booking anything — which you should, with
            anyone — <Link href="/resources/verify-a-counsellor-in-bc">here is how to do that in about four minutes</Link>.
          </p>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <p className="eyebrow">Credentials & training</p>
          <h2>Background</h2>
          <div className="grid grid-2" style={{ marginTop: 26 }}>
            {[
              ['Master of Counselling', 'City University of Seattle (Vancouver, BC), 2022. Thesis on intergenerational trauma in the South Asian community.'],
              ['Bachelor of Criminology', 'University of the Fraser Valley, 2018.'],
              ['Registered Clinical Counsellor', 'BCACC member. Binding code of ethics. Master\u2019s-level supervised training.'],
              ['EMDR-trained', 'Evidence-based modality for trauma, PTSD, anxiety, and grief.'],
              ['Gottman Method-trained', 'Research-based approach to couples therapy.'],
              ['Fraser Health BC', 'Years of experience in the Mental Health and Substance Use subsector.'],
            ].map(([t, d], i) => {
              const ICONS = [GraduationCap, Scale, BadgeCheck, Waves, HeartHandshake, Landmark];
              const Icon = ICONS[i % ICONS.length];
              return (
                <div className="card cred-card" key={t}>
                  <span className="icon-chip" aria-hidden="true"><Icon strokeWidth={1.6} /></span>
                  <div>
                    <h3>{t}</h3>
                    <p style={{ marginBottom: 0 }}>{d}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <p className="eyebrow">How I work</p>
            <ul className="checklist">
              <li>EMDR for trauma, PTSD, and grief</li>
              <li>Gottman Method for couples</li>
              <li>CBT for anxiety and depression</li>
              <li>Culturally adapted frames when family or generational context matters</li>
              <li>Trauma-informed care as the baseline</li>
            </ul>
          </div>
          <div>
            <p className="eyebrow">Who I work with</p>
            <ul className="checklist">
              <li>Adults with anxiety, depression, and burnout</li>
              <li>Trauma, PTSD, and grief</li>
              <li>South Asian clients navigating family expectations and intergenerational patterns</li>
              <li>Couples rebuilding or working through rupture</li>
              <li>First-gen and second-gen folks holding two cultural worlds</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section section--ghost">
        <div className="container prose">
          <h2>Why the practice is fully virtual</h2>
          <p>
            There is no office, and that is a deliberate choice rather than a cost-saving one. It means
            no catchment: a client in Prince George, a farmhouse outside Chilliwack or a work camp in
            the northeast gets the same access as someone in Surrey. It removes the commute, the
            parking and the waiting room, which between them account for a large share of the sessions
            people quietly stop attending. And for anyone who would rather not be seen walking into a
            counselling clinic in a small community, it removes that too.
          </p>
          <p>
            It also has real costs, and they are worth naming. Someone without private space, a
            reliable device or a stable connection is genuinely worse served by a virtual practice than
            by a local one, and in that case a local in-person service is the better referral. The
            research on whether video therapy works is more encouraging than most people expect —{' '}
            <Link href="/guides/is-online-therapy-as-effective-as-in-person">the evidence, including where it is weaker</Link>{' '}
            is set out honestly rather than selectively. Where the practice reaches is on{' '}
            <Link href="/online-counselling">areas served across BC</Link>.
          </p>

          <h2>Accountability</h2>
          <p>
            The RCC designation is held through the BC Association of Clinical Counsellors, which
            requires a master&rsquo;s-level qualification, supervised clinical hours, ongoing continuing
            education and professional liability insurance, and which administers a complaints process
            entirely independent of me. In British Columbia today the words &ldquo;counsellor&rdquo;
            and &ldquo;therapist&rdquo; are not protected titles, so the designation — not the job
            title — is what actually carries a standard behind it.
          </p>
          <p>
            Everything published on this site is written and reviewed by me, carries a reviewed date,
            and links its sources so you can read them and disagree. It carries no client testimonials,
            because soliciting them from people in a therapeutic relationship is prohibited under BCACC
            advertising standards and would be wrong regardless. The full policy is on{' '}
            <Link href="/editorial-policy">how these pages are written</Link>, and what happens to your
            information is on <Link href="/privacy">privacy and confidentiality</Link>.
          </p>
        </div>
      </section>

      <CtaBand heading="Curious if we&rsquo;d be a good fit?" text="Book a free 15-minute consultation. No pressure, no commitment." />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'Person',
              '@id': `${site.domain}/about#person`,
              name: counsellorName,
              honorificSuffix: site.counsellor.credentials,
              jobTitle: site.counsellor.title,
              url: `${site.domain}/about`,
              image: `${site.domain}/img/photo/counsellor-portrait.jpg`,
              worksFor: { '@id': `${site.domain}/#organization` },
              knowsLanguage: ['en-CA', 'pa'],
              knowsAbout: [
                'Eye Movement Desensitization and Reprocessing',
                'Gottman Method Couples Therapy',
                'Cognitive Behavioural Therapy',
                'Trauma-informed care',
                'Intergenerational trauma',
                'South Asian mental health',
              ],
              hasCredential: [
                {
                  '@type': 'EducationalOccupationalCredential',
                  credentialCategory: 'Professional designation',
                  name: 'Registered Clinical Counsellor (RCC)',
                  recognizedBy: { '@type': 'Organization', name: 'BC Association of Clinical Counsellors', url: 'https://bcacc.ca/' },
                },
                {
                  '@type': 'EducationalOccupationalCredential',
                  credentialCategory: 'degree',
                  educationalLevel: 'Master of Counselling',
                  recognizedBy: { '@type': 'CollegeOrUniversity', name: 'City University of Seattle' },
                },
              ],
              alumniOf: [
                { '@type': 'CollegeOrUniversity', name: 'City University of Seattle' },
                { '@type': 'CollegeOrUniversity', name: 'University of the Fraser Valley' },
              ],
              memberOf: { '@type': 'Organization', name: 'BC Association of Clinical Counsellors', url: 'https://bcacc.ca/' },
            },
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: site.domain },
                { '@type': 'ListItem', position: 2, name: 'About', item: `${site.domain}/about` },
              ],
            },
          ]),
        }}
      />
    </>
  );
}
