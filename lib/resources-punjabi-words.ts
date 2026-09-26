import type { Resource } from './resources';

/* WHAT "COUNSELLING" MEANS IN PUNJABI — added 17 Sep 2026 from Search Console.
 *
 * The export showed a cluster nobody had written for and the site was already
 * near the top of anyway:
 *
 *   counselling meaning in punjabi      39 impressions   position 11
 *   counselling in punjabi              14               position 12.6
 *   burnout meaning in punjabi          11               position 7.7
 *   counselling meaning punjabi          1               position 11
 *   counseling meaning in punjabi        1               position 16
 *   punjabi counselling                  4               position 14.5
 *   punjabi therapist near me            2               position 7
 *
 * Roughly seventy impressions a quarter, ranking on page one or two, and zero
 * clicks — because the page Google was showing is /punjabi, whose title is in
 * Gurmukhi. Somebody typing "counselling meaning in punjabi" in English wants a
 * meaning, in English, and cannot tell from that result that they will get one.
 *
 * This is not a keyword page. The question behind it is real and this practice
 * is unusually placed to answer it: two counsellors work in Punjabi, and the
 * single most common obstacle they describe is that the English clinical words
 * have no clean Punjabi equivalent, so a family ends up arguing about "ਪਾਗਲ"
 * when nobody meant anything of the sort. Explaining that is useful whether or
 * not the reader ever books.
 *
 * Every Gurmukhi term here is one already used in the site's existing Punjabi
 * pages (lib/punjabi-guides.ts, lib/practitioner-pa.ts) — the spellings are not
 * invented for this page.
 */

export const punjabiWordsResource: Resource[] = [
  {
    slug: 'counselling-in-punjabi-what-the-words-mean',
    figure: 'first-session-flow',
    title: 'What counselling means in Punjabi, word by word',
    metaTitle: 'Counselling Meaning in Punjabi (ਕਾਊਂਸਲਿੰਗ), Therapy, Consult',
    metaDescription:
      'ਕਾਊਂਸਲਿੰਗ, ਸਲਾਹ-ਮਸ਼ਵਰਾ, ਮਾਨਸਿਕ ਸਿਹਤ: the Punjabi words for counselling and what each one carries, including the ones that do not translate cleanly.',
    eyebrow: 'Punjabi · Words',
    lede:
      'There is no single Punjabi word that means what English means by counselling, and that gap is doing more damage in more families than any of the words themselves.',
    shortAnswer:
      'Counselling is most often said in Punjabi as ਕਾਊਂਸਲਿੰਗ (kaunsling), the English word written in Gurmukhi, or as ਸਲਾਹ-ਮਸ਼ਵਰਾ (salah-mashwara), which means consultation or taking advice. Neither is exact: the first is borrowed and the second suggests someone telling you what to do, which is not what a counsellor does. Related words are ਮਾਨਸਿਕ ਸਿਹਤ (mansik sehat, mental health), ਚਿੰਤਾ (chinta, worry or anxiety), ਉਦਾਸੀ (udaasi, low mood), ਤਣਾਅ (tanaa, stress) and ਥਕਾਵਟ (thakavat, exhaustion, which is how burnout is usually described). The word most families fear is ਪਾਗਲ (paagal, mad) and it has nothing to do with any of this.',
    updated: '2026-09-26',
    readMinutes: 5,
    sections: [
      {
        h2: 'The two words people reach for, and why neither is quite right',
        table: {
          columns: ['Punjabi', 'Said as', 'What it actually carries'],
          rows: [
            ['ਕਾਊਂਸਲਿੰਗ', 'kaunsling', 'The English word, written in Gurmukhi. Exact in meaning and slightly foreign in feel, which is why an older relative may not recognise it.'],
            ['ਸਲਾਹ-ਮਸ਼ਵਰਾ', 'salah-mashwara', 'Consultation, taking advice. Familiar and respectable, but it implies being told what to do — the opposite of how counselling works.'],
            ['ਮਾਨਸਿਕ ਸਿਹਤ', 'mansik sehat', 'Mental health, literally. Neutral and accurate. Useful precisely because it sounds medical rather than shameful.'],
            ['ਮਨੋਵਿਗਿਆਨੀ', 'manovigiaani', 'Psychologist. Often used loosely for any mental-health professional, which causes confusion about who can diagnose.'],
            /* The next four rows answer the queries Search Console shows this
               page for and it did not name: "counsellor / therapist / therapy
               / consult meaning in punjabi", about 90 impressions a month
               between them at positions 9-12. Added 26 Sep 2026. */
            ['ਕਾਊਂਸਲਰ', 'kaunslar', 'Counsellor, the English word in Gurmukhi. The older word ਸਲਾਹਕਾਰ (salahkaar) means adviser and is used for lawyers and financial advisers too, which is not the same job.'],
            ['ਥੈਰੇਪੀ', 'therapy', 'Therapy, borrowed as it is. ਇਲਾਜ (ilaaj) means treatment and sounds medical, which is sometimes useful and sometimes exactly the wrong note.'],
            ['ਥੈਰੇਪਿਸਟ', 'therapist', 'Therapist. No native equivalent; ਮਨੋਵਿਗਿਆਨੀ above is the word people reach for, and it means psychologist, which a counsellor is not.'],
            ['ਸਲਾਹ ਲੈਣਾ', 'salah laina', 'To consult, literally to take advice. The free 30-minute consultation at this practice is a ਮੁਫ਼ਤ ਸਲਾਹ-ਮਸ਼ਵਰਾ, and it is a conversation, not advice.'],
          ],
        },
        body: [
          'In practice most Punjabi speakers in Canada use ਕਾਊਂਸਲਿੰਗ when speaking to someone their own age and ਸਲਾਹ-ਮਸ਼ਵਰਾ or ਮਾਨਸਿਕ ਸਿਹਤ when explaining it to a parent or grandparent. Both are correct. If you are trying to describe it to family, ਮਾਨਸਿਕ ਸਿਹਤ ਬਾਰੇ ਗੱਲ ਕਰਨਾ — talking about mental health — lands more easily than either, because it describes what happens rather than naming a service nobody has used.',
        ],
      },
      {
        h2: 'The feeling words, and what gets lost',
        table: {
          columns: ['Punjabi', 'Said as', 'English', 'Where it does not map'],
          rows: [
            ['ਚਿੰਤਾ', 'chinta', 'Worry, anxiety', 'Covers ordinary worry and a clinical anxiety disorder with one word, so "I have ਚਿੰਤਾ" can mean either. English separates them; Punjabi leaves it to context.'],
            ['ਉਦਾਸੀ', 'udaasi', 'Sadness, low mood', 'Depression as a condition has no everyday word. ਉਦਾਸੀ sounds like a mood that will pass, which is why a depressive episode is so often heard as ordinary sadness.'],
            ['ਤਣਾਅ', 'tanaa', 'Stress, tension', 'Closest to the English "stress" and widely understood.'],
            ['ਥਕਾਵਟ', 'thakavat', 'Exhaustion, tiredness', 'How burnout is usually described. It puts the problem in the body, which is often how it is first felt and which makes it easier to say out loud.'],
            ['ਸਦਮਾ', 'sadma', 'Shock, trauma', 'Means a sudden blow. The English clinical sense — something that keeps affecting you years later — is not carried by the word.'],
          ],
        },
        body: [
          'This is the practical reason a session in Punjabi is different from a session in English with a Punjabi name on the door. Somebody describing ਥਕਾਵਟ is not making a smaller claim than somebody describing burnout; they are using the word their language gives them. A counsellor who works in both hears which one it is.',
        ],
      },
      {
        h2: 'ਇੱਜ਼ਤ, ਸ਼ਰਮ, and the word nobody wants said about them',
        body: [
          'Two words come up in almost every first conversation. ਇੱਜ਼ਤ (izzat) is honour or standing — not vanity, but the family\'s position in the eyes of people whose opinion has consequences. ਸ਼ਰਮ (sharam) is shame, and it is the thing that keeps a person from saying any of this at home. Neither word is a problem to be argued away. They are real features of a real community and they get treated as such.',
          'And then ਪਾਗਲ (paagal), mad. It is the word people are afraid will be attached to them, and it is the reason a great many Punjabi-speaking people arrive at counselling years later than they needed to. Counselling is not for ਪਾਗਲ people. It is a conversation with somebody trained to have it, about sleep, work, marriage, grief, parents, money and the things that are keeping you up — the same list as everybody else\'s.',
          'Confidentiality matters more here than most pages admit, and it is worth being exact: nothing said in a session goes to your family, your community, your employer or your temple, with the narrow legal limits every counsellor has, set out on the [standards page](/standards).',
        ],
      },
      {
        h2: 'If you want the rest of this in Punjabi',
        body: [
          'The practice keeps a full set of pages written in Punjabi rather than translated word for word: [ਪੰਜਾਬੀ ਵਿੱਚ ਕਾਊਂਸਲਿੰਗ](/punjabi) is the main one, with guides on [what happens in a first session](/punjabi/guides/pehle-session-vich-ki-hunda-hai) and [low mood and exhaustion](/punjabi/guides/udaasi-jaan-thakevan).',
          'In English, [Punjabi-speaking counselling](/services/punjabi-counselling) explains how sessions work and who provides them, and [therapy in Punjabi versus English](/compare/therapy-in-punjabi-vs-english) is about which language to actually choose, which is a harder question than it looks when you think in both.',
        ],
      },
    ],
    midCta: {
      text: 'A free 30-minute consultation, in Punjabi, English, or both in the same conversation. No card, and no obligation.',
      label: 'Book a free consultation',
    },
    faqs: [
      { q: 'What is counselling in Punjabi?', a: 'Most often ਕਾਊਂਸਲਿੰਗ (kaunsling), the English word written in Gurmukhi, or ਸਲਾਹ-ਮਸ਼ਵਰਾ (salah-mashwara), meaning consultation. When explaining it to an older relative, ਮਾਨਸਿਕ ਸਿਹਤ ਬਾਰੇ ਗੱਲ ਕਰਨਾ — talking about mental health — is usually understood more easily than either, because it says what happens instead of naming a service.' },
      { q: 'What does salah mashwara mean in English?', a: 'ਸਲਾਹ-ਮਸ਼ਵਰਾ (salah-mashwara) means consultation, or taking advice: ਸਲਾਹ is advice and ਮਸ਼ਵਰਾ is a consultation or discussion. It is the respectable, familiar word for what a counsellor does, and slightly wrong, because it suggests being told what to do. Counselling is closer to ਮਾਨਸਿਕ ਸਿਹਤ ਬਾਰੇ ਗੱਲ ਕਰਨਾ, talking about mental health.' },
      { q: 'What is therapy in Punjabi?', a: 'Usually ਥੈਰੇਪੀ, the English word in Gurmukhi. ਇਲਾਜ (ilaaj) means treatment and is what a doctor gives; some families prefer it because it sounds medical rather than personal, and some avoid it for the same reason. In a session either word is understood.' },
      { q: 'What is counsellor or therapist in Punjabi?', a: 'ਕਾਊਂਸਲਰ (kaunslar) and ਥੈਰੇਪਿਸਟ (therapist), both borrowed. ਸਲਾਹਕਾਰ (salahkaar) means adviser and is also used for lawyers and financial advisers, so it does not say what kind of help is meant. ਮਨੋਵਿਗਿਆਨੀ (manovigiaani) means psychologist, which a counsellor is not.' },
      { q: 'What is consult or consultation in Punjabi?', a: 'ਸਲਾਹ ਲੈਣਾ (salah laina), to take advice, or ਸਲਾਹ-ਮਸ਼ਵਰਾ (salah-mashwara), a consultation. The first 30 minutes at this practice are a free consultation, a ਮੁਫ਼ਤ ਸਲਾਹ-ਮਸ਼ਵਰਾ, in Punjabi or English, and nothing is decided in it.' },
      { q: 'What is burnout in Punjabi?', a: 'There is no clinical term. It is described as ਥਕਾਵਟ (thakavat), exhaustion, and sometimes as ਤਣਾਅ (tanaa), stress. Both place it in the body rather than the mind, which is often how it is first noticed and which makes it easier to say out loud at home.' },
      { q: 'Is there a Punjabi word for depression?', a: 'Not an everyday one. ਉਦਾਸੀ (udaasi) means sadness or low mood, and it is the word most people use, but it sounds like something that will lift on its own. That mismatch is one reason a depressive episode in a Punjabi-speaking family is often heard as ordinary sadness for a long time before anybody treats it as more.' },
      { q: 'Do I have to speak Punjabi in the session?', a: 'No. Most people move between Punjabi and English in the same sentence, and that is normal here rather than something to apologise for. You can also book in English entirely and switch when a word only exists in one of them.' },
      { q: 'Who provides counselling in Punjabi at Westpeak?', a: 'Savneet Singh, a Registered Clinical Counsellor who works in Punjabi and English. Sessions are online, anywhere in British Columbia, and the first 30-minute consultation is free.' },
      { q: 'Will my family find out?', a: 'No. What is said in a session is confidential, with the narrow legal exceptions every counsellor has — a serious risk of harm, abuse of a minor, or a court order. Those are explained plainly at the first meeting. Nothing goes to family, community or an employer.' },
    ],
    sources: [
      { label: 'BC Association of Clinical Counsellors', url: 'https://bcacc.ca/' },
      { label: 'HealthLink BC — mental health', url: 'https://www.healthlinkbc.ca/mental-health-substance-use' },
    ],
    related: [
      { href: '/punjabi', label: 'ਪੰਜਾਬੀ ਵਿੱਚ ਕਾਊਂਸਲਿੰਗ' },
      { href: '/services/punjabi-counselling', label: 'Punjabi-speaking counselling' },
      { href: '/compare/therapy-in-punjabi-vs-english', label: 'Therapy in Punjabi or English' },
      { href: '/for/first-gen-south-asian-adults', label: 'For first- and second-generation South Asian adults' },
      { href: '/practitioners/savneet-singh', label: 'Savneet Singh, RCC' },
    ],
  },
];
