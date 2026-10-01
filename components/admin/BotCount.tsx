import { readInbound } from '@/lib/inbound';
import { isRealSubmission } from '@/lib/inbound-quality';

/* HOW MANY SUBMISSIONS WERE NOT COUNTED, ON ITS OWN LINE — 1 Oct 2026.
 *
 * The opt-in figure above and the funnel report count real submissions only
 * (lib/inbound-quality.ts isRealSubmission). Dropping the rest silently would
 * make the numbers look smaller for no stated reason, so they are counted
 * here: honeypot-tripped scripts, this project's probes and throwaway
 * addresses. A tripped honeypot has been stored since 1 Oct as a count and a
 * hash only, with no name or address (lib/inbound.ts addInbound). */
export default async function BotCount() {
  let items: Awaited<ReturnType<typeof readInbound>>['items'] = [];
  try {
    items = (await readInbound()).items;
  } catch {
    return null;
  }
  const excluded = items.filter((i) => !isRealSubmission(i));
  if (excluded.length === 0) return null;
  const honeypot = excluded.filter((i) => i.triage?.band === 'quarantine').length;
  const hashedOnly = excluded.filter((i) => i.emailHash && !i.email).length;
  return (
    <p style={{ color: 'var(--ink-soft)', maxWidth: '40.38em' }}>
      <strong>{excluded.length}</strong> stored {excluded.length === 1 ? 'submission is' : 'submissions are'} not
      counted as leads, opt-ins or messages in these figures or the funnel report:{' '}
      {honeypot} filled the hidden field no person can see, the rest are test or throwaway
      addresses.{hashedOnly > 0 ? ` ${hashedOnly} of them are held as a count and a hash only, with no name or address.` : ''}
    </p>
  );
}
