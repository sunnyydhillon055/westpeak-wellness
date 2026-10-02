import { site, REGISTERED_LOCALITY } from '@/lib/site';
import { serviceAreaLine } from '@/lib/practitioners';

/* A downloadable contact card. One tap on a phone saves the practice into
 * contacts, which is where people actually look when they finally decide to
 * reach out — often weeks after the visit where they meant to.
 *
 * The card is for the PRACTICE, not the practitioner. The counsellor's name
 * lives on /about only (see lib/site.ts) and a vCard in a stranger's contacts
 * is exactly the kind of surface that rule exists for. No phone line is
 * published — the practice deliberately has no public number (see the
 * callback-request field on the enquiry form), and a vCard with an invented
 * placeholder would be worse than one without.
 *
 * CRLF line endings are required by RFC 6350 and some parsers really do care. */
export const dynamic = 'force-static';

export function GET() {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${site.name}`,
    `ORG:${site.legalName}`,
    /* Email before phone (item 299). The registered locality with no street:
       there is no office to visit. */
    `EMAIL;TYPE=INTERNET,PREF:${site.email}`,
    ...(site.phone ? [`TEL;TYPE=WORK,VOICE:${site.phoneTel}`] : []),
    `ADR;TYPE=WORK:;;;${REGISTERED_LOCALITY.locality};${REGISTERED_LOCALITY.region};;${REGISTERED_LOCALITY.countryName}`,
    `URL:${site.domain}`,
    `NOTE:${serviceAreaLine()}, ${site.languages}. Free 30-minute consultation: ${site.domain}${site.bookingPath}`,
    'END:VCARD',
  ];
  return new Response(lines.join('\r\n') + '\r\n', {
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': 'attachment; filename="westpeak.vcf"',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
