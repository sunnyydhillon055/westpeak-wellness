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
  'aria-label': ariaLabel,
}: {
  where: MailWhere;
  subject?: string;
  className?: string;
  children?: React.ReactNode;
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
    </a>
  );
}
