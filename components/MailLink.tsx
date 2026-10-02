'use client';

import { site } from '@/lib/site';
import { track } from '@/lib/analytics';

/* EVERY mailto: TO THE PRACTICE GOES THROUGH HERE — 1 Oct 2026.
 *
 * Email is the contact route the practice prefers, and there were fourteen
 * mailto: links on the site of which one (the sticky bar) fired an event,
 * and the counter dropped that one because email_click was not on its list.
 * So "how many people pressed the address instead of the form" had no
 * answer. One component means one event, and `where` is a word from
 * EMAIL_LOCATIONS in lib/conversion-detail.ts, which the server checks.
 *
 * The address is always the practice's own (site.email). A mailto: to
 * anybody else — a client's address on /admin — is not this component.
 * Nothing about the message is known or sent: the click only. */
export type MailWhere = 'sticky' | 'book-fallback' | 'contact' | 'footer' | 'refer';

export default function MailLink({
  where,
  subject,
  className,
  children,
  showAddress,
  'aria-label': ariaLabel,
}: {
  where: MailWhere;
  subject?: string;
  className?: string;
  children?: React.ReactNode;
  /** Print the address after the words (2 Oct 2026, item 387). On a work
   *  laptop with no mail client a mailto: opens nothing, and these links are
   *  the last route when the calendar fails, so the address must be readable
   *  and copyable. No effect without `children` (the address is the text). */
  showAddress?: boolean;
  'aria-label'?: string;
}) {
  const href = `mailto:${site.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;
  return (
    <a
      className={className}
      href={href}
      aria-label={ariaLabel}
      onClick={() => track('email_click', { location: where, detail: where })}
    >
      {children ?? site.email}
      {children && showAddress ? ` (${site.email})` : null}
    </a>
  );
}
