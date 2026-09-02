/* ============================================================================
   TAGALOG COPY — PUBLISHED 1 SEP 2026, REVIEW STILL OUTSTANDING
   ----------------------------------------------------------------------------
   TAGALOG_READY WAS FALSE UNTIL 1 SEP 2026, when the owner published these
   pages having been told plainly that the Tagalog is unreviewed and written by
   someone who does not speak it natively. That was their call to make and it
   reverses the "Camille reviews before publish" decision taken earlier the
   same day. The rest of this note is kept rather than deleted, because the
   reason for the gate did not stop being true when the gate came off:

   Camille should still read every string here and in
   lib/practitioner-places-tl.ts. What changed is that she is now reading live
   pages instead of a draft, so a correction is a fix rather than a release
   step. Send her CAMILLE_ONBOARDING.md, and when she marks something off,
   change it to what she wrote — do not machine-translate a correction back.

   WHY IT IS GATED

   This is clinical copy about trauma, anxiety and grief, written by someone
   who is not a native Tagalog speaker. Counselling language is exactly where
   a translation that is technically correct can still be wrong: the register
   can land as clinical when it should be warm, a word for "trauma" can carry
   weight in one community and none in another, and "kalusugang pangkaisipan"
   reads very differently to a Manila-raised reader than to a second-generation
   one in Surrey.

   The person who can judge that is the counsellor whose name is on the page.
   Publishing first and correcting later means the first native speaker to
   assess it is a prospective client deciding whether this practice takes them
   seriously.

   The owner chose "write it, Camille reviews before publish" on 1 Sep 2026.
   This file is that decision expressed as code: the route calls notFound()
   and generateStaticParams() skips the page while the flag is false, so there
   is no way to ship it by forgetting.

   WHAT TO DO WITH IT

   1. Send Camille CAMILLE_ONBOARDING.md, which prints these strings.
   2. She edits directly, or marks what is off.
   3. Set TAGALOG_READY = true in the same commit as her corrections.

   Do not machine-translate the corrections back. If a string needs to change,
   it changes to what she wrote.
   ========================================================================= */

export const TAGALOG_READY = true;

export const TAGALOG = {
  eyebrow: 'Sa Tagalog',
  crumb: 'Tagalog',

  /* 44 characters. The previous line ran to 73 once the site suffix was
     appended, which the SEO gate rejects. */
  metaTitle: 'Counselling sa Tagalog — Camille Granda',
  metaDescription:
    'Counselling sa Tagalog o Ingles kasama si Camille Granda, RCC, CCC. Online sa buong British Columbia. Libreng 15 minutong konsultasyon.',

  h1: 'Hindi mo kailangang isalin ang sarili mo.',
  lede:
    'May mga bagay na mas madaling sabihin sa wikang kinalakhan mo. Si Camille ay nagsasagawa ng sesyon sa Tagalog, sa Ingles, o paghalo ng dalawa sa loob ng isang sesyon.',

  cta: 'Mag-book ng libreng konsultasyon',

  intro: [
    'Si Camille Granda ay isang Registered Clinical Counsellor (RCC) at Canadian Certified Counsellor (CCC). Nagtatrabaho siya online sa buong British Columbia, kasama ang mga matatanda at kabataang matatanda na matagal nang kinakaya ang lahat nang mag-isa.',
    'Ang mga sesyon ay magkatuwang at praktikal. Titingnan natin kung ano talaga ang nagpapatuloy sa suliranin — ang iniisip, ang nararamdaman, at ang mga kilos sa ilalim nito — at bubuo tayo ng mga kasanayang magagamit mo, hindi lamang pang-unawa na maiiwan sa loob ng silid.',
    'Walang kailangang ipaliwanag mula sa simula tungkol sa pamilya, kultura, o inaasahan ng iba. Iyon ang bahagi ng konteksto na dala na niya.',
  ],

  focusHeading: 'Mga larangan ng espesyalisasyon',
  focus: [
    'Trauma — pagproseso ng mahihirap o labis na karanasan habang bumubuo ng kaligtasan, regulasyon, at higit na kontrol.',
    'Pagkabalisa at talamak na stress — ang mga huwarang nasa ilalim ng high-functioning anxiety, perfectionism, at pagkaubos ng damdamin.',
    'Pagluluksa, pagkawala, at malalaking pagbabago sa buhay — kabilang ang mga pagbabagong hindi inaasahan.',
  ],

  suitsHeading: 'Maaaring ikaw ay',
  suits: [
    'Nakakaranas ng pagkabalisa, pagkalula, burnout, o pagkaubos ng damdamin',
    'Dumaraan sa malaking pagbabago sa buhay, pagbabago sa relasyon, o pagkawala',
    'May mga karanasan mula sa nakaraan na patuloy na nakaaapekto sa iyong nararamdaman at pakikitungo sa iba',
    'Nakikipagbuno sa perfectionism, halaga ng sarili, people-pleasing, o pakiramdam na hindi ka sapat',
    'Sinusubukang maunawaan ang sarili sa konteksto ng kultura, inaasahan ng pamilya, pagkakakilanlan, o mga huwaran sa pagitan ng henerasyon',
    'Nais bumuo ng mas malusog na relasyon at mas malinaw na hangganan',
  ],

  closing:
    'Hindi mo kailangang maintindihan ang lahat bago magsimula. Minsan, ang malaman lamang na may hindi na gumagana ay sapat na dahilan para magsimula.',

  englishLink: 'Basahin ang pahinang ito sa Ingles',

  ctaHeading: 'Mag-usap muna tayo',
  ctaText:
    'Libreng 15 minutong konsultasyon sa pamamagitan ng video. Walang bayad, walang card, at walang obligasyon.',
} as const;
