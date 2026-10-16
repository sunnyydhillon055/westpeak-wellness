'use client';

import { Suspense, useEffect, useState, type ComponentProps } from 'react';
import { useSearchParams } from 'next/navigation';
import InboundForm from '@/components/InboundForm';

/* THE ENQUIRY FORM ON A STATIC PAGE THAT STILL SAYS "IT ARRIVED" — 15 Oct 2026 (item 514).
 *
 * /contact read ?sent= on the server to swap the form for its
 * acknowledgement, which made the page render per request (production:
 * `private, no-cache, no-store`, three render-blocking stylesheet links,
 * no inlined CSS). The address is read here instead, in a child under its
 * own Suspense that renders nothing, so the prerendered page is the form
 * and hydrates as it is; once ?sent=ok is seen the form gives way to the
 * acknowledgement, exactly as the server version did. ?sent=err InboundForm
 * already reads for itself (the reason and the restored draft). */
function SentProbe({ onSent }: { onSent: (s: 'ok' | 'err' | undefined) => void }) {
  const sent = useSearchParams()?.get('sent');
  useEffect(() => { onSent(sent === 'ok' ? 'ok' : sent === 'err' ? 'err' : undefined); }, [sent, onSent]);
  return null;
}

export default function SentInboundForm(props: Omit<ComponentProps<typeof InboundForm>, 'done'>) {
  const [done, setDone] = useState<'ok' | 'err' | undefined>(undefined);
  return (
    <>
      <Suspense fallback={null}>
        <SentProbe onSent={setDone} />
      </Suspense>
      <InboundForm {...props} done={done} />
    </>
  );
}
