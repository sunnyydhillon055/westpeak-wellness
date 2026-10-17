'use client';

import { useEffect } from 'react';
import { gaLead, type LeadForm } from '@/lib/ga-lead';

/* Sends GA4's generate_lead once when the page it sits on mounts: the
 * static /message-sent page, which a stored enquiry from a city hub is
 * redirected to (16 Oct 2026, item 588). GA only; see lib/ga-lead.ts.
 * Renders nothing. */
export default function GaLeadOnMount({ form }: { form: LeadForm }) {
  useEffect(() => {
    gaLead(form);
  }, [form]);
  return null;
}
