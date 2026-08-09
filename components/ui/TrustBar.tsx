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
      <span className="trust-item">
        <Association aria-hidden="true" strokeWidth={1.7} />
        <span>Registered with the <strong>BCACC</strong></span>
      </span>
      <span className="trust-item">
        <Langs aria-hidden="true" strokeWidth={1.7} />
        <span>Free <strong>15-minute</strong> consultation</span>
      </span>
      <span className="trust-item">
        <Coverage aria-hidden="true" strokeWidth={1.7} />
        <Link href="/resources/bc-extended-health-coverage-for-counselling">
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
