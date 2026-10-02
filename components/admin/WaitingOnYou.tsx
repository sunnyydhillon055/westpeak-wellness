import { site } from '@/lib/site';
import { recordedPractitioners, vancouverToday } from '@/lib/practitioners';
import { placesFor, ALBERTA_PLACES } from '@/lib/practitioner-places';
import { draftGuides } from '@/lib/guides-drafts';
import { consultationAvailability } from '@/lib/cliniko-availability';
import { waitingRows, CLIENT_AGREEMENT_LIVE, PUNJABI_FORM_DECIDED } from '@/lib/waiting-on-you';

/* /admin, "WAITING ON YOU" — 1 Oct 2026. The rows are built in
 * lib/waiting-on-you.ts from the roster, the flags and Cliniko; this renders
 * them. Server component: the roster stays on the server. It sends nothing.
 *
 * The recorded roster, not the gated one: a lapsed policy has already taken
 * Alberta out of `provinces` on the gated copy, and this table must still say
 * what was lost. */

const fmt = (iso?: string) => {
  if (!iso) return '';
  try {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'UTC', year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(`${iso}T00:00:00Z`));
  } catch {
    return iso;
  }
};

export default async function WaitingOnYou() {
  const albertan = new Set(ALBERTA_PLACES.map((l) => l.slug));
  const albertaPages = Object.fromEntries(
    recordedPractitioners.map((p) => [p.slug, p.placePages ? placesFor(p.provinces).filter((l) => albertan.has(l.slug)).length : 0]),
  );
  const availability = await consultationAvailability().catch(() => ({}));
  const rows = waitingRows({
    roster: recordedPractitioners,
    today: vancouverToday(),
    albertaPages,
    draftGuides: draftGuides.filter((g) => g.draft).length,
    icbcVendor: site.icbcVendor,
    directFirstSession: site.directFirstSession,
    clientAgreementLive: CLIENT_AGREEMENT_LIVE,
    punjabiFormDecided: PUNJABI_FORM_DECIDED,
    availability,
  });

  return (
    <>
      <h2 id="waiting-on-you" style={{ marginTop: 28 }}>Waiting on you</h2>
      <p style={{ color: 'var(--ink-soft)', maxWidth: '40.38em' }}>
        Every switch only you can throw, read from the code that holds it: the deadline, and
        what acting keeps or unlocks. Nothing here sends anything.
      </p>
      {rows.length === 0 ? (
        <div className="admin-panel"><p style={{ margin: 0 }}>Nothing is waiting on you.</p></div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>What</th><th>Where it stands</th><th>By</th><th>What it keeps or unlocks</th></tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.item}>
                  <td>{r.urgent ? <strong>{r.item}</strong> : r.item}</td>
                  <td>{r.state}</td>
                  <td>{fmt(r.due)}</td>
                  <td>{r.unlocks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
