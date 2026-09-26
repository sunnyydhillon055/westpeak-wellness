import type { Resource } from './resources';

/* WHAT "COUNSELLING" MEANS IN TAGALOG — added 26 Sep 2026, on the owner's
 * instruction that Tagalog be carried as far as Punjabi is.
 *
 * The Punjabi twin of this page (lib/resources-punjabi-words.ts) draws about
 * 400 impressions a month for "counselling meaning in punjabi" and its
 * variants. Search Console already shows "burn out meaning tagalog" and
 * "counselling in tagalog" arriving with no page to land on.
 *
 * ENGLISH PAGE, TAGALOG WORDS. This is not Tagalog prose. It is an English
 * page explaining what the Tagalog words carry, the same shape as its Punjabi
 * twin and the same rule as /tagalog-counselling: nothing here is a
 * paragraph in Tagalog that needs a native reader before it is safe to
 * publish. Every Tagalog term is one the site's existing Tagalog guides
 * already use (lib/tagalog-guides.ts) or an ordinary dictionary word. Camille
 * should still read it; that is on the owner's list.
 */
export const tagalogWordsResource: Resource[] = [
  {
    slug: 'counselling-in-tagalog-what-the-words-mean',
    figure: 'first-session-flow-tl',
    title: 'What counselling means in Tagalog, word by word',
    metaTitle: 'Counselling Meaning in Tagalog: Pagpapayo, Therapy, Burnout',
    metaDescription:
      'Pagpapayo, konsultasyon, kalusugang pangkaisipan: the Tagalog words for counselling, what each one carries, and the ones that do not translate.',
    eyebrow: 'Tagalog · Words',
    lede:
      'Filipinos switch between Tagalog and English in the same sentence without noticing. Counselling is one of the places where the switch carries information.',
    shortAnswer:
      'Counselling is most often said in Tagalog simply as counseling, the English word as it is, or more formally as pagpapayo, which means giving advice or guidance and is the word schools use for a guidance counsellor. Neither is exact: the first is borrowed and the second suggests being told what to do, which is not what a counsellor does. Related words are kalusugang pangkaisipan (mental health), pagkabalisa (anxiety), depresyon (depression, borrowed), kalungkutan (sadness), stress (borrowed and universal) and pagod, the exhaustion that is how burnout is usually described. The word families fear is baliw, crazy, and it has nothing to do with any of this.',
    updated: '2026-09-26',
    readMinutes: 5,
    sections: [
      {
        h2: 'The words people reach for, and why none is quite right',
        table: {
          columns: ['Tagalog', 'What it actually carries'],
          rows: [
            ['counseling', 'The English word, used as it is, and the one most Filipinos in Canada actually say. Exact in meaning and slightly institutional in feel, because it is also what a school or an HR department offers.'],
            ['pagpapayo', 'Giving advice or guidance, from payo, advice. The formal word, and the one on a guidance counsellor’s door. It implies being told what to do, which is the opposite of how counselling works.'],
            ['tagapayo', 'Adviser, counsellor. Used for a guidance counsellor, a spiritual adviser and a financial one, so it does not say what kind of help is meant.'],
            ['konsultasyon', 'Consultation. Medical in feel, and accurate for the free 30-minute consultation this practice starts with, which is a conversation rather than an assessment.'],
            ['kalusugang pangkaisipan', 'Mental health, literally. Formal and neutral; the phrase public health material uses. Useful precisely because it sounds like a medical topic rather than a family one.'],
            ['sikolohista', 'Psychologist. Often used loosely for any mental-health professional, which causes confusion about who can diagnose. A counsellor is not one.'],
            ['therapy, therapist', 'Borrowed as they are, sometimes spelled terapiya. Understood by everyone under sixty and by most people over it.'],
          ],
        },
        body: [
          'In practice most Filipinos in Canada say counseling or therapy to someone their own age and reach for pagpapayo or kalusugang pangkaisipan when explaining it to a parent. Both are correct. If you are trying to describe it to family, mag-usap tungkol sa kalusugang pangkaisipan, talking about mental health, lands more easily than any single word, because it describes what happens rather than naming a service nobody at home has used.',
        ],
      },
      {
        h2: 'The feeling words, and what gets lost',
        table: {
          columns: ['Tagalog', 'English', 'Where it does not map'],
          rows: [
            ['pagkabalisa, kaba', 'Anxiety, nervousness', 'Kaba is the ordinary flutter before an exam; pagkabalisa is closer to the clinical sense. Most people say either for both, and a counsellor who works in Tagalog hears which is meant.'],
            ['depresyon, kalungkutan', 'Depression, sadness', 'Depresyon is borrowed and carries the clinical weight; kalungkutan is sadness and sounds like a mood that will pass. A depressive episode described as kalungkutan is heard as ordinary sadness for a long time before anybody treats it as more.'],
            ['stress', 'Stress', 'Borrowed whole and used exactly as in English. The one word that needs no translation at all.'],
            ['pagod, pagod na pagod', 'Tired, exhausted', 'How burnout is described. There is no clinical word for it; the guides on this site describe it as a pagod that rest does not fix. It puts the problem in the body, which is often how it is first felt and which makes it easier to say out loud.'],
            ['trauma', 'Trauma', 'Borrowed, and used more narrowly than in English: an accident, a disaster, a death. The clinical sense, something that keeps affecting you years later, is not carried by the everyday word.'],
          ],
        },
        body: [
          'This is the practical reason a session in Tagalog is different from a session in English with a Filipino name on the door. Somebody describing pagod na pagod is not making a smaller claim than somebody describing burnout; they are using the word their language gives them. A counsellor who works in both hears which one it is.',
        ],
      },
      {
        h2: 'Hiya, utang na loob, and the word nobody wants said about them',
        body: [
          'Three ideas come up in almost every first conversation, and none of them has an English word that does the job. Hiya is usually translated as shame and is closer to propriety: the sense of what is fitting, and the reluctance to impose, to make a scene, or to bring private trouble to a stranger. Utang na loob is a debt of gratitude, owed to parents, to the relative who sponsored you, to the family that sacrificed, and it is a reason a great many people feel they have no right to be struggling. Pakikisama is getting along, keeping relations smooth, and it is why the person who most needs to say something is often the one keeping quiet. None of these is a problem to be argued away. They are real features of a real culture and they get treated as such.',
          'And then baliw, crazy, and the slang that goes with it. It is the word people are afraid will be attached to them, and it is the reason a great many Tagalog-speaking people arrive at counselling years later than they needed to, or send a parent to a doctor for the body when the trouble was never there. Counselling is not for baliw people. It is a conversation with somebody trained to have it, about sleep, work, marriage, grief, parents, money and the things that are keeping you up, the same list as everybody else’s.',
          'Confidentiality matters more here than most pages admit, and it is worth being exact: nothing said in a session goes to your family, your community, your employer or your church, with the narrow legal limits every counsellor has, set out on the [standards page](/standards).',
        ],
      },
      {
        h2: 'If you want the rest of this in Tagalog',
        body: [
          'The practice keeps pages written in Tagalog rather than translated word for word: [counselling sa Tagalog](/tagalog) is the main one, with guides on [what happens in a first session](/tagalog/gabay/ano-ang-mangyayari-sa-unang-sesyon) and on [talking to your family about therapy](/tagalog/gabay/pag-uusap-sa-pamilya-tungkol-sa-therapy).',
          'In English, [Tagalog-speaking counselling](/services/tagalog-counselling) explains how sessions work and who provides them, and [therapy in Tagalog versus English](/compare/therapy-in-tagalog-vs-english) is about which language to actually choose, which is a harder question than it looks when you think in both.',
        ],
      },
    ],
    midCta: {
      text: 'A free 30-minute consultation, in Tagalog, English, or both in the same conversation. No card, and no obligation.',
      label: 'Book a free consultation',
    },
    faqs: [
      { q: 'What is counselling in Tagalog?', a: 'Most often counseling, the English word used as it is, or pagpapayo, the formal word meaning guidance or advice-giving, which is what a school guidance counsellor does. When explaining it to an older relative, mag-usap tungkol sa kalusugang pangkaisipan, talking about mental health, is usually understood more easily than either, because it says what happens instead of naming a service.' },
      { q: 'What is burnout in Tagalog?', a: 'There is no clinical term. It is described as pagod, or pagod na pagod, exhaustion that rest does not fix, and sometimes simply as stress. Both place it in the body rather than the mind, which is often how it is first noticed and which makes it easier to say at home.' },
      { q: 'What is therapy or therapist in Tagalog?', a: 'Usually therapy and therapist, borrowed as they are, sometimes spelled terapiya. Sikolohista means psychologist, which a counsellor is not, and tagapayo means adviser, which is also used for a financial or spiritual adviser and so does not say what kind of help is meant.' },
      { q: 'Is there a Tagalog word for anxiety?', a: 'Pagkabalisa is the closest to the clinical sense, and kaba, nervousness, is the everyday word. Most people use either for both. A counsellor who works in Tagalog hears which one is meant.' },
      { q: 'Is there a Tagalog word for depression?', a: 'Depresyon, borrowed from English, carries the clinical meaning. Kalungkutan means sadness and is the word most families use, and it sounds like something that will lift on its own, which is one reason a depressive episode in a Filipino family is often heard as ordinary sadness for a long time.' },
      { q: 'Do I have to speak Tagalog in the session?', a: 'No. Most people move between Tagalog and English in the same sentence, Taglish, and that is normal here rather than something to apologise for. You can also book in English entirely and switch when a word only exists in one of them.' },
      { q: 'Who provides counselling in Tagalog at Westpeak?', a: 'Camille Granda, a Registered Clinical Counsellor and Canadian Certified Counsellor who works in Tagalog and English, in British Columbia and Alberta. Sessions are online and the first 30-minute consultation is free.' },
      { q: 'Will my family find out?', a: 'No. What is said in a session is confidential, with the narrow legal exceptions every counsellor has: a serious risk of harm, abuse of a minor, a court order. Sessions are by video, so there is no clinic anybody could be seen entering.' },
    ],
    sources: [
      { label: 'HereToHelp BC, mental health information', url: 'https://www.heretohelp.bc.ca/' },
      { label: 'HealthLink BC, mental health and substance use', url: 'https://www.healthlinkbc.ca/mental-health-substance-use' },
      { label: 'BC Association of Clinical Counsellors', url: 'https://bcacc.ca/' },
    ],
    related: [
      { href: '/tagalog', label: 'Counselling sa Tagalog' },
      { href: '/services/tagalog-counselling', label: 'Tagalog-speaking counselling' },
      { href: '/compare/therapy-in-tagalog-vs-english', label: 'Therapy in Tagalog or English' },
      { href: '/for/filipino-healthcare-workers-and-caregivers', label: 'For Filipino healthcare workers and caregivers' },
      { href: '/practitioners/camille-granda', label: 'Camille Granda, RCC, CCC' },
    ],
  },
];
