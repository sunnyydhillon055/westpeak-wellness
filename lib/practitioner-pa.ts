/* ============================================================================
   PUNJABI COPY FOR A COUNSELLOR'S OWN PAGE — /practitioners/<slug>/pa
   ----------------------------------------------------------------------------
   Added 7 Sep 2026 with Savneet Singh, the first counsellor on the roster who
   works in Punjabi AND has per-city pages. The founder also works in Punjabi
   but has one page by instruction (see lib/practitioners.ts), so this file is
   rendered only for practitioners with `placePages: true` and 'pa' among
   their languages — never for her.

   Written in the register of /punjabi: as a Punjabi speaker would say it,
   English clinical terms left in English (CBT, ACT, DBT, therapy) because
   those are the words people use and search for. Drawn from her own "About
   Savneet" document and her onboarding answers; the family-question answer
   below is hers verbatim, in Punjabi, as she wrote it.

   REVIEW: Savneet is a Punjabi speaker. Send her SAVNEET_ONBOARDING.md, which
   prints these strings, and change anything she marks to what she wrote.
   Until she has, this copy is on the same footing as the Tagalog: written by
   someone who is not a native speaker, published at the owner's instruction.

   Keyed by practitioner slug so a second Punjabi-speaking counsellor with
   city pages gets their own entry rather than Savneet's words.
   ========================================================================= */

export type PunjabiProfileCopy = {
  eyebrow: string;
  crumb: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  lede: string;
  cta: string;
  intro: string[];
  focusHeading: string;
  focus: string[];
  suitsHeading: string;
  suits: string[];
  /** Her own answer to "my family thinks therapy is not for people like us". */
  familyHeading: string;
  family: string[];
  closing: string;
  englishLink: string;
  ctaHeading: string;
  ctaText: string;
};

export const PUNJABI_PROFILES: Record<string, PunjabiProfileCopy> = {
  'savneet-singh': {
    eyebrow: 'ਪੰਜਾਬੀ ਵਿੱਚ',
    crumb: 'ਪੰਜਾਬੀ',

    /* 47 characters before the site suffix; the gate allows 60. */
    metaTitle: 'ਪੰਜਾਬੀ ਵਿੱਚ ਕਾਊਂਸਲਿੰਗ, ਸਵਨੀਤ ਸਿੰਘ',
    metaDescription:
      'ਸਵਨੀਤ ਸਿੰਘ ਨਾਲ ਪੰਜਾਬੀ ਜਾਂ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਕਾਊਂਸਲਿੰਗ। ਪੂਰੇ ਬ੍ਰਿਟਿਸ਼ ਕੋਲੰਬੀਆ ਵਿੱਚ ਆਨਲਾਈਨ। ਪਹਿਲੀ 30 ਮਿੰਟ ਦੀ ਗੱਲਬਾਤ ਮੁਫ਼ਤ।',

    h1: 'ਤੁਹਾਨੂੰ ਆਪਣੇ ਆਪ ਦਾ ਅਨੁਵਾਦ ਕਰਨ ਦੀ ਲੋੜ ਨਹੀਂ।',
    lede:
      'ਕੁਝ ਗੱਲਾਂ ਉਸ ਭਾਸ਼ਾ ਵਿੱਚ ਹੀ ਸੌਖੀਆਂ ਕਹੀਆਂ ਜਾਂਦੀਆਂ ਹਨ ਜਿਸ ਵਿੱਚ ਤੁਸੀਂ ਵੱਡੇ ਹੋਏ। ਸਵਨੀਤ ਸੈਸ਼ਨ ਪੰਜਾਬੀ ਵਿੱਚ, ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ, ਜਾਂ ਇੱਕੋ ਸੈਸ਼ਨ ਵਿੱਚ ਦੋਹਾਂ ਨੂੰ ਮਿਲਾ ਕੇ ਕਰਦੀ ਹੈ।',

    cta: 'ਮੁਫ਼ਤ ਸਲਾਹ-ਮਸ਼ਵਰਾ ਬੁੱਕ ਕਰੋ',

    intro: [
      'ਸਵਨੀਤ ਸਿੰਘ ਵੱਡੀ ਉਮਰ ਦੇ ਲੋਕਾਂ ਨਾਲ ਇੱਕ-ਇੱਕ ਕਰਕੇ ਕੰਮ ਕਰਦੀ ਹੈ, ਪੂਰੇ ਬ੍ਰਿਟਿਸ਼ ਕੋਲੰਬੀਆ ਵਿੱਚ ਸੁਰੱਖਿਅਤ ਵੀਡੀਓ ਰਾਹੀਂ। ਜ਼ਿਆਦਾਤਰ ਲੋਕ ਜੋ ਉਸ ਕੋਲ ਆਉਂਦੇ ਹਨ, ਉਹ ਕਿਸੇ ਨੂੰ ਆਪਣੇ ਆਪ ਨੂੰ "ਠੀਕ ਕਰਨ" ਲਈ ਨਹੀਂ ਲੱਭ ਰਹੇ ਹੁੰਦੇ। ਉਹ ਇਹ ਸਮਝਣਾ ਚਾਹੁੰਦੇ ਹਨ ਕਿ ਸਤ੍ਹਾ ਦੇ ਹੇਠਾਂ ਅਸਲ ਵਿੱਚ ਕੀ ਚੱਲ ਰਿਹਾ ਹੈ, ਅਤੇ ਉਸ ਬਾਰੇ ਕੀ ਕਰਨਾ ਹੈ।',
      'ਸੈਸ਼ਨ ਮਿਲ ਕੇ ਚੱਲਦੇ ਹਨ ਅਤੇ ਵਿਹਾਰਕ ਹੁੰਦੇ ਹਨ। ਅਸੀਂ ਇਕੱਠੇ ਦੇਖਦੇ ਹਾਂ ਕਿ ਕਿਹੜੀ ਚੀਜ਼ ਕਿਸੇ ਪੈਟਰਨ ਨੂੰ ਥਾਂ ਸਿਰ ਰੱਖ ਰਹੀ ਹੈ, ਸਿਰਫ਼ ਇਹ ਨਹੀਂ ਕਿ ਉਹ ਕਿੱਥੋਂ ਆਇਆ। ਸਵਨੀਤ ਦਾ ਢੰਗ ਪੱਕਾ ਪਰ ਨਰਮ ਹੈ: ਉਹ ਉਹ ਸਵਾਲ ਪੁੱਛਦੀ ਹੈ ਜੋ ਸਤ੍ਹਾ ਤੋਂ ਪਾਰ ਜਾਂਦੇ ਹਨ, ਅਤੇ ਨਾਲ ਹੀ ਇਹ ਯਕੀਨੀ ਬਣਾਉਂਦੀ ਹੈ ਕਿ ਤੁਸੀਂ ਜਵਾਬਾਂ ਨਾਲ ਬੈਠ ਸਕਣ ਜਿੰਨਾ ਸਹਾਰਾ ਮਹਿਸੂਸ ਕਰੋ।',
      'ਤੁਸੀਂ ਸੈਸ਼ਨ ਤੋਂ ਕੁਝ ਵਿਹਾਰਕ ਲੈ ਕੇ ਜਾਂਦੇ ਹੋ, ਸਿਰਫ਼ ਉਹ ਨਹੀਂ ਜੋ ਕਮਰੇ ਵਿੱਚ ਸਮਝ ਆਇਆ। ਮਕਸਦ ਇਹ ਹੈ ਕਿ ਤੁਸੀਂ ਆਪਣੀ ਜ਼ਿੰਦਗੀ ਆਪ ਚਲਾਉਣ ਦੇ ਹੁਨਰ ਅਤੇ ਭਰੋਸਾ ਬਣਾਓ, ਤਾਂ ਜੋ ਇਹ ਕੰਮ ਸੈਸ਼ਨ ਮੁੱਕਣ ਤੋਂ ਬਹੁਤ ਬਾਅਦ ਵੀ ਤੁਹਾਡੇ ਨਾਲ ਰਹੇ।',
      'ਪਰਿਵਾਰ ਕੀ ਉਮੀਦ ਰੱਖਦਾ ਹੈ, ਇੱਜ਼ਤ ਕਿਹੋ ਜਿਹੀ ਲੱਗਦੀ ਹੈ, ਚੁੱਪ ਦਾ ਕੀ ਮਤਲਬ ਹੈ, ਕਿਸ ਦਾ ਕੀ ਬਣਦਾ ਹੈ: ਇਹ ਗੱਲਾਂ ਤੁਹਾਨੂੰ ਪਹਿਲਾਂ ਸਮਝਾਉਣ ਦੀ ਲੋੜ ਨਹੀਂ। ਇੱਥੋਂ ਹੀ ਸ਼ੁਰੂਆਤ ਹੁੰਦੀ ਹੈ।',
    ],

    focusHeading: 'ਸਵਨੀਤ ਕਿਹੜੀਆਂ ਗੱਲਾਂ ਨਾਲ ਕੰਮ ਕਰਦੀ ਹੈ',
    focus: [
      'ਚਿੰਤਾ (anxiety): ਫ਼ਿਕਰ ਅਤੇ ਹੱਦੋਂ ਵੱਧ ਸੋਚਣ ਦੇ ਚੱਕਰ, ਅਤੇ ਨਰਵਸ ਸਿਸਟਮ ਨੂੰ ਇਹ ਸਿੱਖਣ ਵਿੱਚ ਮਦਦ ਕਿ ਹੌਲੀ ਹੋਣਾ ਸੁਰੱਖਿਅਤ ਹੈ।',
      'ਉਦਾਸੀ (depression): ਛੋਟੇ ਕਦਮਾਂ ਅਤੇ ਛੋਟੇ ਪਲਾਂ ਨੂੰ ਮੁੜ ਸੰਭਵ ਮਹਿਸੂਸ ਕਰਵਾਉਣਾ, "ਬੱਸ ਠੀਕ ਹੋ ਜਾ" ਦੇ ਦਬਾਅ ਤੋਂ ਬਿਨਾਂ।',
      'ਟਰੌਮਾ ਅਤੇ ਰਿਸ਼ਤਿਆਂ ਦੇ ਪੈਟਰਨ (attachment): ਟਰੌਮਾ ਉਸ ਰਫ਼ਤਾਰ ਨਾਲ ਜੋ ਤੁਹਾਨੂੰ ਠੀਕ ਲੱਗੇ, ਕਦੇ-ਕਦੇ ਉਸ ਵੱਲ ਦੇਖਣ ਲਈ ਤਿਆਰ ਹੋਣ ਤੋਂ ਵੀ ਪਹਿਲਾਂ; ਅਤੇ ਜੁੜਨ ਦੇ ਉਹ ਤਰੀਕੇ ਜੋ ਆਦਤ ਦੀ ਥਾਂ ਚੋਣ ਬਣ ਸਕਣ।',
      'ਸ਼ਖ਼ਸੀਅਤ ਦੇ ਵਿਗਾੜ (personality disorders): ਆਪਣੇ ਆਪ ਦੀ ਵਧੇਰੇ ਟਿਕਵੀਂ ਸਮਝ ਬਣਾਉਣਾ, ਉਹ ਸਭ ਗੁਆਏ ਬਿਨਾਂ ਜੋ ਤੁਹਾਨੂੰ ਤੁਸੀਂ ਬਣਾਉਂਦਾ ਹੈ।',
    ],

    suitsHeading: 'ਸ਼ਾਇਦ ਤੁਸੀਂ',
    suits: [
      'ਬਾਹਰੋਂ ਸਭ ਕੁਝ ਸੰਭਾਲ ਰਹੇ ਹੋ, ਅਤੇ ਅੰਦਰੋਂ ਚੁੱਪ-ਚਾਪ ਜੂਝ ਰਹੇ ਹੋ',
      'ਟਰੌਮਾ ਜਾਂ ਰਿਸ਼ਤਿਆਂ ਦੇ ਜ਼ਖ਼ਮ ਚੁੱਕੀ ਫਿਰਦੇ ਹੋ ਜੋ ਵਾਰ-ਵਾਰ ਤੁਹਾਡੇ ਰਿਸ਼ਤਿਆਂ ਵਿੱਚ ਦਿਸਦੇ ਹਨ',
      'ਉਨ੍ਹਾਂ ਪੈਟਰਨਾਂ ਵਿੱਚ ਫਸੇ ਹੋ ਜਿਨ੍ਹਾਂ ਨੂੰ ਤੁਸੀਂ ਪਛਾਣਦੇ ਹੋ ਪਰ ਇਕੱਲੇ ਬਦਲ ਨਹੀਂ ਪਾ ਰਹੇ',
      'ਪੱਕਾ ਨਹੀਂ ਕਿ ਜੋ ਤੁਸੀਂ ਮਹਿਸੂਸ ਕਰ ਰਹੇ ਹੋ ਉਸ ਦਾ ਅਜੇ ਕੋਈ ਨਾਂ ਹੈ ਵੀ, ਅਤੇ ਇਹ ਠੀਕ ਹੈ',
      'ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ, ਪੰਜਾਬੀ ਵਿੱਚ, ਜਾਂ ਦੋਹਾਂ ਵਿਚਕਾਰ ਆਉਂਦੇ-ਜਾਂਦੇ ਕੰਮ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ',
    ],

    familyHeading: '"ਸਾਡੇ ਵਰਗਿਆਂ ਲਈ ਥੈਰਪੀ ਨਹੀਂ ਹੁੰਦੀ" — ਸਵਨੀਤ ਦਾ ਜਵਾਬ',
    family: [
      'ਮੈਂ ਇਹੀ ਕਹਾਂਗੀ ਕਿ ਮੈਂ ਸਮਝਦੀ ਹਾਂ ਇਹ ਸੋਚ ਕਿੱਥੋਂ ਆਉਂਦੀ ਹੈ। ਸਾਡੇ ਪੰਜਾਬੀ ਪਰਿਵਾਰਾਂ ਵਿੱਚ ਅਕਸਰ ਸਾਨੂੰ ਮਜ਼ਬੂਤ ਰਹਿਣਾ, ਗੱਲਾਂ ਘਰ ਦੇ ਅੰਦਰ ਹੀ ਰੱਖਣੀਆਂ, ਤੇ ਹਰ ਹਾਲਤ ਵਿੱਚ ਅੱਗੇ ਵਧਦੇ ਰਹਿਣਾ ਸਿਖਾਇਆ ਜਾਂਦਾ ਹੈ।',
      'ਥੈਰਪੀ ਦਾ ਮਤਲਬ ਆਪਣੇ ਪਰਿਵਾਰ ਜਾਂ ਆਪਣੇ ਸੱਭਿਆਚਾਰ ਤੋਂ ਦੂਰ ਹੋਣਾ ਨਹੀਂ ਹੈ। ਇਹ ਇੱਕ ਅਜਿਹੀ ਸੁਰੱਖਿਅਤ ਅਤੇ ਨਿੱਜੀ ਜਗ੍ਹਾ ਹੈ ਜਿੱਥੇ ਤੁਸੀਂ ਬਿਨਾਂ ਕਿਸੇ ਡਰ ਜਾਂ ਜੱਜਮੈਂਟ ਦੇ ਆਪਣੀਆਂ ਭਾਵਨਾਵਾਂ ਨੂੰ ਸਮਝ ਸਕਦੇ ਹੋ, ਜੋ ਕੁਝ ਤੁਸੀਂ ਆਪਣੇ ਅੰਦਰ ਚੁੱਕ ਕੇ ਫਿਰ ਰਹੇ ਹੋ ਉਸਨੂੰ ਹੌਲਾ ਕਰ ਸਕਦੇ ਹੋ, ਅਤੇ ਆਪਣੇ ਲਈ ਸਿਹਤਮੰਦ ਤਰੀਕੇ ਲੱਭ ਸਕਦੇ ਹੋ।',
      'ਤੁਹਾਨੂੰ ਆਪਣੇ ਸੱਭਿਆਚਾਰ ਅਤੇ ਆਪਣੀ ਮਾਨਸਿਕ ਸਿਹਤ ਵਿੱਚੋਂ ਕਿਸੇ ਇੱਕ ਨੂੰ ਚੁਣਨ ਦੀ ਲੋੜ ਨਹੀਂ। ਦੋਵੇਂ ਇਕੱਠੇ ਚੱਲ ਸਕਦੇ ਹਨ।',
    ],

    closing:
      'ਸੰਪਰਕ ਕਰਨ ਨਾਲ ਤੁਸੀਂ ਕਿਸੇ ਗੱਲ ਲਈ ਵਚਨਬੱਧ ਨਹੀਂ ਹੋ ਜਾਂਦੇ। ਅਸੀਂ ਇੱਕ ਗੱਲਬਾਤ ਨਾਲ ਸ਼ੁਰੂ ਕਰ ਸਕਦੇ ਹਾਂ ਅਤੇ ਦੇਖ ਸਕਦੇ ਹਾਂ ਕਿ ਇਹ ਠੀਕ ਲੱਗਦਾ ਹੈ ਜਾਂ ਨਹੀਂ।',

    englishLink: 'ਇਹ ਪੰਨਾ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਪੜ੍ਹੋ',

    ctaHeading: 'ਪਹਿਲਾਂ ਗੱਲ ਕਰ ਲਈਏ',
    ctaText:
      'ਵੀਡੀਓ ਰਾਹੀਂ 30 ਮਿੰਟ ਦੀ ਮੁਫ਼ਤ ਗੱਲਬਾਤ। ਕੋਈ ਫ਼ੀਸ ਨਹੀਂ, ਕੋਈ ਕਾਰਡ ਨਹੀਂ, ਅਤੇ ਬਾਅਦ ਵਿੱਚ ਕੁਝ ਵੀ ਬੁੱਕ ਕਰਨ ਦੀ ਕੋਈ ਮਜਬੂਰੀ ਨਹੀਂ।',
  },
};

export const getPunjabiProfile = (slug: string): PunjabiProfileCopy | undefined =>
  PUNJABI_PROFILES[slug];
