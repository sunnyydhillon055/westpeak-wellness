import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { isAdmin } from '@/lib/portal-store';
import { readInbound, markAnswered } from '@/lib/inbound';
import { answeredValid } from '@/lib/answered-link';

/* "MARK ANSWERED", ARRIVED AT FROM THE ENQUIRY ALERT — 1 Oct 2026.
 *
 * The alert links /admin?answered=<id>&t=<signature>. Arriving here writes
 * nothing: a mail scanner, a link preview or a prefetch can follow that URL
 * as often as it likes. The single button below is the only thing that sets
 * handled and handledAt, it re-checks the administrator and the signature
 * inside the action (a server action is a POST endpoint of its own), and it
 * never moves a timestamp already recorded (lib/inbound.ts markAnswered).
 *
 * Shows the time and page only. The person's words are in the alert the
 * reader just came from and in the table below. */
export default async function ConfirmAnswered({ id, token }: { id?: string; token?: string }) {
  if (!id) return null;
  if (!token || !answeredValid(id, token)) {
    return (
      <div id="answered" className="admin-panel" style={{ marginBottom: 18 }}>
        <p style={{ margin: 0 }}>
          That &ldquo;mark answered&rdquo; link is not valid for this message. Nothing was changed.
        </p>
      </div>
    );
  }

  const msgId: string = id;
  const sig: string = token;
  const item = (await readInbound({ fresh: true })).items.find((i) => i.id === msgId);
  if (!item) {
    return (
      <div id="answered" className="admin-panel" style={{ marginBottom: 18 }}>
        <p style={{ margin: 0 }}>That message is no longer in the inbox. Nothing was changed.</p>
      </div>
    );
  }

  const received = new Date(item.createdAt).toLocaleString('en-CA', {
    timeZone: 'America/Vancouver', dateStyle: 'medium', timeStyle: 'short',
  });

  if (item.handled) {
    return (
      <div id="answered" className="admin-panel" style={{ marginBottom: 18 }}>
        <p style={{ margin: 0 }}>
          The message received {received} from {item.source} is already marked answered
          {item.handledAt ? ` (${new Date(item.handledAt).toLocaleString('en-CA', { timeZone: 'America/Vancouver', dateStyle: 'medium', timeStyle: 'short' })})` : ''}.
          Its time stays as recorded.
        </p>
      </div>
    );
  }

  return (
    <div id="answered" className="admin-panel" style={{ marginBottom: 18 }}>
      <p style={{ marginTop: 0 }}>
        Mark the message received <strong>{received}</strong> from <strong>{item.source}</strong> as
        answered? The time you press this is recorded as the reply time, and it is what the median
        on /contact is measured from.
      </p>
      <form
        action={async () => {
          'use server';
          const s = await auth();
          const who = s?.user?.email ?? '';
          if (!who || !isAdmin(who)) return;
          if (!answeredValid(msgId, sig)) return;
          await markAnswered(msgId);
          revalidatePath('/admin');
          redirect('/admin#inbox');
        }}
      >
        <button type="submit" className="btn btn--primary btn--sm">Mark answered</button>
      </form>
    </div>
  );
}
