import { readInbound } from '@/lib/inbound';
import { measuredReply, measuredReplySentence } from '@/lib/reply-line';

/* The measured reply time as one sentence, or nothing — 1 Oct 2026.
 *
 * A server component, so the inbound store is read on the server and never
 * reaches a browser bundle. Renders nothing until five real enquiries carry a
 * measured reply (lib/reply-line.ts), and nothing if the store cannot be
 * read: the unmeasured promise beside it stands on its own. */
export default async function MeasuredReply() {
  let sentence: string | null = null;
  try {
    sentence = measuredReplySentence(measuredReply((await readInbound()).items));
  } catch {
    /* store unreachable */
  }
  return sentence ? <> {sentence}</> : null;
}
