import Link from 'next/link';
import { TRUST_ICONS } from '@/lib/icon-map';
import { site } from '@/lib/site';

/* Credential strip under the hero CTAs.
 *
 * NOTE ON ONE ITEM: the brief suggested "Covered by most BC plans". That is a
 * prevalence claim about insurers this practice cannot substantiate, and it
 * sits badly beside the site's own careful line elsewhere — that whether a plan
 * reimburses a Registered Clinical Counsellor is plan-specific and must be
 * confirmed with the insurer. Under the BCACC constraint (no invented
 * statistics, no implied coverage), it is rendered here as the thing that is
 * actually true and verifiable: receipts are issued with the RCC registration
 * number, which is what an insurer needs. The reassurance survives; the
 * unsupported claim does not. */
export default function TrustBar() {
  const Credential = TRUST_ICONS.credential;
  const Association = TRUST_ICONS.association;
  const Langs = TRUST_ICONS.languages;
  const Coverage = TRUST_ICONS.coverage;
  const Privacy = TRUST_ICONS.privacy;

  return (
    <div className="trust-bar">
      <span className="trust-item">
        <Credential aria-hidden="true" strokeWidth={1.7} />
        <span><strong>{site.counsellor.title}</strong> · {site.counsellor.credentials}</span>
      </span>
      {/* THE NUMBER COMES OFF EVERY PAGE BUT /about — owner's decision,
        * 30 August 2026, and it applies to every counsellor the practice adds.
        * The registration remains real and remains verifiable; it is simply
        * not published beside the credential on every page of the site.
        * What stays is the association and a link into the public register,
        * which is still something a stranger can act on — they search the
        * register rather than being handed the row. scripts/expansion-verify.mjs
        * fails the build if the number reappears outside /about. */}
      <span className="trust-item">
        <Association aria-hidden="true" strokeWidth={1.7} />
        <span>
          <strong>BCACC registered</strong> ·{' '}
          <a
            className="link-standalone"
            href={site.counsellor.registerUrl}
            target="_blank"
            rel="noopener"
          >
            verify
          </a>
        </span>
      </span>
      <span className="trust-item">
        <Langs aria-hidden="true" strokeWidth={1.7} />
        <span>Free <strong>15-minute</strong> consultation</span>
      </span>
      <span className="trust-item">
        <Coverage aria-hidden="true" strokeWidth={1.7} />
        <Link className="link-standalone" href="/resources/bc-extended-health-coverage-for-counselling">
          Receipts for extended health
        </Link>
      </span>
      <span className="trust-item">
        <Privacy aria-hidden="true" strokeWidth={1.7} />
        <span>Secure video · confidential</span>
      </span>
    </div>
  );
}
