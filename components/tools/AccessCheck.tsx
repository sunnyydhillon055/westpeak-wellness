'use client';

import Link from 'next/link';
import Quiz from '@/components/tools/Quiz';
import ResultCta from '@/components/tools/ResultCta';
import { ACCESS_CHECK, ACCESS_ROUTES } from '@/lib/tools';

/* Eligibility routing, not a wait-time estimate.
 *
 * No reliable public dataset covers counselling waits across BC and Alberta,
 * and this repository does not publish invented figures — so the tool sorts
 * routes by how quickly they tend to move relative to each other rather than
 * quoting a duration that would be wrong by winter.
 *
 * The order below is deliberate and it is not preference order. Crisis first
 * where the answers call for it, then the entitlements somebody already has,
 * then the public system, then paying. A private counsellor appears last on
 * purpose: an unused employee assistance programme is the single most common
 * thing people pay to replace, and a tool that never said so would be an
 * advertisement rather than a tool. */
export default function AccessCheck() {
  return (
    <Quiz
      slug="what-can-i-access"
      questions={ACCESS_CHECK}
      onResult={(tags) => {
        const has = (t: string) => tags.includes(t);
        const ab = has('ab');
        const elsewhere = has('other');

        const keys: string[] = [];
        if (has('urgent')) keys.push('urgent');

        if (elsewhere) {
          keys.push('other');
        } else {
          if (has('eap')) keys.push('eap');
          if (has('student')) keys.push('student');
          if (has('checkbenefits')) keys.push('checkbenefits');
          if (has('lowcost')) keys.push('lowcost');
          if (has('extended')) keys.push('extended');
          keys.push(ab ? 'publicab' : 'publicbc');
          if (has('canpay')) keys.push(ab ? 'privateab' : 'private');
        }

        const routes = keys.map((k) => ACCESS_ROUTES[k]).filter(Boolean);

        return (
          <>
            <p className="eyebrow">Open to you</p>
            <h2>{elsewhere ? 'Not this practice, but here is the shape of it' : 'Roughly in the order they move'}</h2>
            <ul className="checklist">
              {routes.map((r) => (
                <li key={r.label}>
                  <strong>{r.href ? <Link href={r.href}>{r.label}</Link> : r.label}</strong> — {r.detail}
                </li>
              ))}
            </ul>
            <p>
              <strong>No wait times are quoted above, deliberately.</strong> They vary by region,
              service and month, and a figure published today would be wrong by winter. The order
              is how these routes tend to move relative to each other, which is the comparison
              that is actually useful.
            </p>
            {!elsewhere && (
              <p>
                Starting somewhere free does not mean giving up a place in a public queue. Staying
                in both is normal and costs nothing —{' '}
                <Link href="/guides/waiting-for-therapy-in-bc">what to do while waiting</Link>{' '}
                covers that in more detail.
              </p>
            )}
            {!elsewhere && (
              <ResultCta tool="what-can-i-access" label="Ask about the private route — free 15 minutes" />
            )}
            <div className="crisis" style={{ marginTop: 22 }}>
              <p style={{ margin: 0 }}>
                <strong>If things are worse than this page can hold:</strong> call or text{' '}
                <a href="tel:988"><strong>9-8-8</strong></a> (Canada, any hour). In immediate
                danger, <a href="tel:911"><strong>9-1-1</strong></a>.{' '}
                <Link href="/resources/bc-crisis-and-support-directory">Full BC directory</Link>
              </p>
            </div>
          </>
        );
      }}
    />
  );
}
