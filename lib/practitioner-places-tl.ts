/* ============================================================================
   TAGALOG CITY COPY — WRITTEN, NOT YET PUBLISHED
   ----------------------------------------------------------------------------
   The Tagalog twin of every city page Camille has. Gated on the same
   TAGALOG_READY flag as lib/practitioner-tl.ts and for the same reason, which
   is worth repeating rather than assuming the next reader follows the import:

   This is clinical copy about trauma, anxiety and grief, written by someone who
   is not a native Tagalog speaker. Counselling language is exactly where a
   translation that is technically correct can still be wrong — the register can
   land as clinical when it should be warm, and a word that is ordinary in
   Manila can read as stiff or bookish to a second-generation reader in Surrey.

   The owner chose "write it, Camille reviews before publish" on 1 Sep 2026.
   These pages do not build while the flag is false.

   NO ENGLISH ON THESE PAGES, at the owner's instruction of 1 Sep 2026 — the
   English words that remain are the ones that would be wrong to translate:
   place names, the RCC and CCC designations, and the names of the registering
   bodies, which are what somebody checks the register with.

   WHY EACH CITY IS WRITTEN RATHER THAN TEMPLATED. The English set peaks at
   38.5% similarity because each city argues its own case. A Tagalog set built
   by swapping a city name into one paragraph would be a doorway set in a second
   language, and would rank accordingly. The local paragraphs below are the
   Tagalog case for that city, not a rendering of the English one.
   ========================================================================= */

export type TagalogPlaceCopy = {
  /** Hero one-liner, Tagalog. */
  blurb: string;
  /** Why reaching care from here is its own problem, for a Tagalog speaker. */
  local: string[];
  /* City-specific questions. Two or three each, and they carry most of what
     makes one of these pages different from the next: with only a shared set,
     6-gram similarity across the seventeen peaked at 66.9% against 38.5% for
     the English pages, which is a doorway set in another language. */
  faqs: { q: string; a: string }[];
};

/* The parts that are the same wherever the reader is. Kept in one place so a
   correction from Camille lands on all seventeen pages at once rather than
   seventeen times. */
export const TL_PLACE_SHARED = {
  eyebrow: 'Sa Tagalog',
  crumb: 'Tagalog',
  backToEnglish: 'Basahin ang pahinang ito sa Ingles',

  /** Opening paragraph, city name interpolated. */
  opening: (city: string) =>
    `Nagtatrabaho si Camille kasama ang mga kliyente sa ${city} nang buo sa pamamagitan ng ligtas na video. Hindi nagbabago ang bayad, ang oras, o ang trabaho batay sa kung saan ka nakatira. Ang nagbabago ay ang gastos ng pagpunta roon nang personal — at iyon ang inaalis nito.`,

  accessHeading: (city: string) => `Bakit umaangkop ang video sa ${city}`,
  access: [
    {
      label: 'Walang biyahe',
      detail: 'Isang sesyon mula sa kung nasaan ka, sa halip na oras sa daan bago at pagkatapos.',
    },
    {
      label: 'Umaangkop sa shift',
      detail: 'Marami sa aming mga kliyente ay nasa healthcare, care work, paliparan at hospitality. Normal ang pag-book nang paunti-unti sa paligid ng isang rotating schedule, at walang gastos ang paghinto sa pagitan.',
    },
    {
      label: 'Gabi kung kailangan',
      detail: 'May mga oras sa gabi ng karaniwang araw kapag hiniling.',
    },
    {
      label: 'Tagalog o Ingles',
      detail: 'Kasama ang paglipat sa pagitan ng dalawa sa loob ng isang sesyon, na siyang talagang ginagawa ng karamihan sa mga bilingguwal.',
    },
  ],

  langHeading: 'Mga sesyon sa Tagalog o Ingles',
  langBody:
    'Hindi mo kailangang magpasya nang maaga kung aling wika. Karaniwang lumilipat ang mga tao nang hindi sinasadya, lalo na kapag mahirap sabihin ang isang bagay, at walang bahagi ng sesyon na nangangailangan na pumili ka ng isa at manatili roon. Hindi rin kailangang ipaliwanag mula sa simula ang utang na loob, ang hiya, o ang bigat ng sasabihin ng mga kamag-anak.',

  focusHeading: 'Ang mga pinagtatrabahuhan ni Camille',

  /* Her focus areas, in Tagalog. lib/practitioners.ts holds these in English
     and the page rendered them straight through, so three English paragraphs
     sat in the middle of every Tagalog page. */
  focus: [
    {
      label: 'Trauma',
      detail: 'Mabibigat o nakakalulang karanasan, dinadaanan sa bilis na ikaw ang nagtatakda — inuuna ang kaligtasan at ang pakiramdam ng kontrol, bago ang mismong kuwento.',
    },
    {
      label: 'Pagkabalisa at matagalang stress',
      detail: 'Ang mga pattern sa ilalim ng pagkabalisang hindi halata, ng pagiging perpeksiyonista, at ng pagkaubos. Ang uring halos walang nakakakita sa paligid mo, dahil naipapasa mo pa rin ang lahat.',
    },
    {
      label: 'Pagluluksa at pagbabago ng buhay',
      detail: 'Puwang para sa mga pagbabagong pinili mo at sa mga hindi — mga pagtatapos, pagbabago ng pagkakakilanlan, at ang kawalan ng katiyakang kasama nito.',
    },
    {
      label: 'Relasyon at mag-asawa',
      detail: 'Ang pattern sa pagitan ninyo, hindi ang taong inaakala ninyong problema.',
    },
  ],

  /* The diagram's own caption and alt live in English in lib/figures.ts. */
  figureCaption: 'Ang gitnang hanay ang punto — hindi kailangang pumili nang maaga.',
  figureAlt:
    'Tatlong hanay: ang Tagalog na may hawak ng alaala, pamilya at damdamin; ang Ingles na nag-aalok ng distansya at ng bokabularyo ng trabaho; at sa pagitan nila, isang sesyon na malayang lumipat sa dalawa kahit kalagitnaan ng pangungusap.',
  figureHint: 'I-scroll pahalang ang dayagram para makita ang buo.',
  faqHeading: (city: string) => `Mga tanong mula sa ${city}`,

  /* The one answer that must be identical everywhere. Everything else people
     ask is answered per city, because the answers genuinely differ and because
     a shared block repeated seventeen times is what makes a doorway set. */
  sharedFaqs: [
    {
      q: 'Paano kung kailangan ko ng tulong ngayon din?',
      a: 'Hindi ito serbisyong pang-krisis. Tumawag o mag-text sa 9-8-8 anumang oras. Kung ikaw ay nasa agarang panganib, tumawag sa 911.',
    },
  ],

  ctaHeading: (city: string) => `Mag-usap muna tayo, ${city}`,
  ctaText:
    'Isang libreng labinlimang minutong konsultasyon sa video. Walang card, at walang obligasyon pagkatapos.',
  cta: 'Humiling ng libreng konsultasyon',
  nearbyHeading: 'Pinagsisilbihan din ni Camille',
  nearbyNote:
    'Parehong praktis, parehong bayad, parehong oras — ang biyaheng hindi mo na gagawin lamang ang nagbabago.',
  notCrisis: 'Hindi ito serbisyong pang-krisis.',
  urgent: 'Kung kailangan mo ng agarang tulong ngayon:',
  immediateDanger: 'Kung ikaw ay nasa agarang panganib, tumawag sa 911.',
};

/* Per city. The local paragraphs carry the argument; the FAQ is the question
   people in that particular place actually ask. */
export const TL_PLACES: Record<string, TagalogPlaceCopy> = {
  surrey: {
    blurb: 'Malaking komunidad, at kakaunting terapiyang ibinibigay sa wikang sinasalita sa bahay.',
    local: [
      'Isa ang Surrey sa may pinakamalaking komunidad ng Pilipino sa British Columbia, at napakakaunti ng counselling na ibinibigay sa Tagalog. Ang nangyayari sa halip ay nagiging tagasalin ang kapamilyang pinakamagaling mag-Ingles — para sa isang magulang, sa isang asawa, minsan para sa buong sambahayan. Umuubra iyon sa doktor. Hindi iyon umuubra sa terapiya.',
      'Inaalis iyon ng isang sesyon sa Tagalog. Inaalis din nito ang bahaging bihirang pag-usapan: ang pagod ng pagsasalin ng isang damdamin sa pangalawang wika habang hirap ka pa ngang pangalanan ito sa una.',
      'May pangalawang balakid dito na hindi tungkol sa wika. Sa komunidad na magkakakilala, ang tanong ay madalas hindi kung gumagana ba ang terapiya kundi kung sino ang makakakita sa iyong pumapasok sa isang klinika. Walang gusali na mapapasukan sa isang praktis na buong online, at iyon lang minsan ang dahilan kung bakit natutuloy ang unang hakbang.',
    ],
    faqs: [
      { q: 'Marami namang counsellor sa Surrey. Bakit sa labas pa?', a: 'Para sa marami, wala namang dahilan — at sasabihin sa iyo iyon sa konsultasyon. Ang dahilan ng mga sumusulat mula sa Surrey ay mas makitid: sa komunidad na magkakakilala, ang counsellor na irerekomenda sa iyo ay madalas konektado sa mismong mga taong ayaw mong makaalam.' },
      { q: 'Malalaman ba ng pamilya ko na pumupunta ako?', a: 'Hindi, maliban kung ikaw mismo ang magsabi. Tungkulin sa batas ang kompidensiyalidad, at nakalista sa pahina ng mga pamantayan ang eksaktong mga hangganan nito. Walang tinatawagan, walang sinusulatan, at walang gusaling mapapansinan ka.' },
      { q: 'Puwede bang gabi lang ako, dahil sa shift ko?', a: 'Oo. Marami sa mga kliyente dito ay nasa healthcare at care work, at ang pag-book sa paligid ng roster — hindi ang pagpilit ng roster sa paligid ng sesyon — ang gumagana.' },
    ],
  },
  vancouver: {
    blurb: 'Matagal nang komunidad, at pangangalagang mas madaling abutin sa video kaysa sa kabilang dulo ng lungsod.',
    local: [
      'Matagal nang naitatag ang komunidad ng Pilipino sa Vancouver at kumakalat ito sa buong lungsod sa halip na magtipon sa isang lugar. Ibig sabihin, madalas na magkasalungat ang “counsellor na malapit sa akin na marunong mag-Tagalog”. Ang pinakamalapit na tumatanggap ng kliyente ay maaaring isang paglipat ng bus at isang oras bawat direksyon.',
      'Marami rin sa trabaho ng mga Pilipino sa Vancouver ay nakabatay sa shift — healthcare, care work, hospitality — at hindi nakakaligtas ang nakatakdang oras sa isang umiikot na roster. Ang sesyon sa gabi, na walang biyahe sa magkabilang dulo, ang pagkakaiba ng pagdalo at ng pagbalak lamang.',
      'Ang laki ng lungsod ay hindi rin palaging katumbas ng dami ng pagpipilian. Marami sa serbisyong pangkaisipan dito ay nakatuon sa ibang wika, at ang listahan ng nagsasalita ng Tagalog na tumatanggap pa ng bagong kliyente ay mas maikli kaysa sa inaasahan ng karamihan.',
    ],
    faqs: [
      { q: 'Nagtatrabaho ako ng shift sa ospital. Kakasya ba ito?', a: 'Oo, at mas mabuting planuhin ito sa simula kaysa matuklasan sa ikalawang buwan. Ang pag-book nang paunti-unti sa paligid ng roster, na may puwang sa pagitan, ay karaniwang paraan at hindi kompromiso.' },
      { q: 'Nasa East Vancouver ako. May pagkakaiba ba sa bayad o oras?', a: 'Wala. Pareho ang bayad at ang mga oras saanman sa lungsod, dahil walang bahagi ng serbisyo ang nakadepende sa distansya.' },
      { q: 'Kailangan ko bang pumili ng isang wika bago magsimula?', a: 'Hindi. Karamihan ay lumilipat nang hindi sinasadya, lalo na kapag mabigat ang pinag-uusapan, at hindi iyon problemang kailangang ayusin.' },
    ],
  },
  richmond: {
    blurb: 'Nakatuon ang lokal na serbisyo sa Cantonese at Mandarin; ibang lugar ang hinahanap ng mga nagsasalita ng Tagalog.',
    local: [
      'May tunay na kapasidad ang Richmond sa counselling, at nakabuo ito — nang tama — sa paligid ng mga komunidad ng lungsod na nagsasalita ng Chinese. Para sa isang nagsasalita ng Tagalog, mas manipis ang larangan kaysa sa ipinapahiwatig ng laki ng lungsod, at karaniwang napupunta ang mga tao sa paghahanap sa Vancouver o Surrey.',
      'Malalaking employer din dito ang paliparan at ang daungan, na may nagbabagong roster. Ang sesyon na kaya mong dalhan mula sa bahay sa pagitan ng shift ay mas may halaga kaysa sa isang teoretikal na kayang puntahan.',
      'Ang pagtawid ng tulay para sa isang oras na sesyon ay dalawang oras na hindi mo binalak ibigay. Iyon ang unang bagay na nawawala kapag naging abala ang buwan, at iyon ang dahilan kung bakit maraming serye ng terapiya ang natitigil bago pa man ito magsimulang gumana.',
    ],
    faqs: [
      { q: 'May mga counsellor ba sa Richmond na marunong mag-Tagalog?', a: 'Mayroon, at mas kakaunti kaysa sa ipinapahiwatig ng laki ng komunidad — karamihan sa serbisyong maraming wika sa Richmond ay nakatuon sa Cantonese at Mandarin. Tunay na lakas iyon ng lugar, at hindi iyon ang wikang kailangan ng lahat.' },
      { q: 'Nagtatrabaho ako sa paliparan at nagbabago ang shift ko. Puwede ba?', a: 'Oo. Normal dito ang pag-book nang paunti-unti sa paligid ng roster, at walang gastos ang paghinto sa pagitan ng mga bloke.' },
      { q: 'Ano ang nangyayari sa unang sesyon?', a: 'Labinlimang minuto muna, walang bayad, para lang malaman kung magkasundo kayo. Kung tuloy, ang unang buong sesyon ay tungkol sa kuwento mo at sa gusto mong maging kaibahan — hindi isang form na sasagutan.' },
    ],
  },
  burnaby: {
    blurb: 'Nasa gitna ng lahat, at hindi pa rin nangangahulugang may makikita kang counsellor na kayang makausap ka sa Tagalog.',
    local: [
      'Nasa gitna ng Metro Vancouver ang Burnaby, at ang ibig sabihin madalas ay malapit ka sa lahat maliban sa isang takdang oras na kasya sa araw mo. Mahaba ang listahan ng paghihintay, at ang oras na inaalok ay karaniwang hapon ng karaniwang araw.',
      'Kapag idinagdag mo ang kondisyon na dapat maintindihan ng counsellor ang Tagalog, lalong lumiliit ang bilang. Inaalis ng video ang parehong problema nang sabay: hindi mo kailangang pumili sa pagitan ng malapit at ng nakakaunawa.',
      'Marami rin ang nakatira dito at nagtatrabaho sa ibang lungsod, kaya ang araw ay may dalawang biyahe na bago pa magdagdag ng pangatlo. Ang sesyon mula sa bahay ay hindi lamang kaginhawahan — ito ang pagkakaiba ng isang serye na natatapos at isang natigil sa gitna.',
    ],
    faqs: [
      { q: 'Nasa Burnaby ako pero nagtatrabaho sa ibang lungsod. May pagkakaiba ba?', a: 'Wala. Ang mahalaga ay kung saan ka nakaupo sa oras ng sesyon, at maaari iyong maging bahay, kotse, o isang tahimik na silid sa trabaho — hangga\'t ligtas at pribado ito para sa iyo.' },
      { q: 'Ano ang kailangan kong kagamitan?', a: 'Kahit anong device na may camera at koneksyon. Walang ini-install, at padadalhan ka ng link bago ang oras ninyo.' },
      { q: 'Sakop ba nito ang New Westminster?', a: 'Oo, sa parehong mga tuntunin. Walang binabago ang hangganan ng munisipyo sa bayad, oras, o pagkuha ng serbisyo.' },
    ],
  },
  coquitlam: {
    blurb: 'Isang lungsod na binibiyahe, at isang takdang oras na hindi na dapat maging isa pang biyahe.',
    local: [
      'Marami sa Coquitlam ang nagbibiyahe palabas ng lungsod para magtrabaho, at ang takdang oras na nangangailangan ng ikatlong biyahe sa isang araw ay ang unang nawawala kapag naging abala ang linggo.',
      'Ang sesyon sa gabi na hindi na nangangailangan ng pag-alis sa bahay ay hindi lamang mas maginhawa — ito ang pagkakaiba ng isang serye ng terapiyang natatapos at isang natigil pagkatapos ng ikatlong sesyon.',
      'Lumaki ang Tri-Cities nang mabilis at hindi sumabay ang bilang ng counsellor na tumatanggap ng bagong kliyente. Kapag mas tiyak ang hinahanap mo — isang partikular na paraan ng pagtatrabaho, o isang sesyon sa Tagalog — mas maikli pa ang lokal na listahan kaysa sa inaasahan.',
    ],
    faqs: [
      { q: 'Sakop ba nito ang Port Coquitlam at Port Moody?', a: 'Oo, at sa parehong mga tuntunin. Walang binabago ang hangganan ng munisipyo sa oras, bayad, o pagkuha ng serbisyo.' },
      { q: 'Umuuwi ako ng gabi. May oras ba pagkatapos ng trabaho?', a: 'Mayroon, may mga oras sa gabi ng karaniwang araw kapag hiniling, at iyon ang pinakamadalas hilingin dito.' },
      { q: 'Ano ang bayad?', a: 'Nakalista ang buong bayad sa pahina ng mga bayarin, at walang nagbabago batay sa lungsod. Libre at walang obligasyon ang unang labinlimang minuto.' },
    ],
  },
  delta: {
    blurb: 'Tatlong komunidad, isang tunnel, at isang takdang oras na hindi na kailangang dumaan doon.',
    local: [
      'Ang North Delta, Ladner at Tsawwassen ay tatlong magkakaibang lugar na pinagsasama ng isang pangalan at hinahati ng trapiko. Ang takdang oras sa kabilang dulo ng tunnel ay isang oras na hindi mo binalak ibigay.',
      'Sa video, nawawala ang tunnel sa usapan. Ang natitira ay ang oras na napagkasunduan ninyo, na siyang dapat lamang na pag-usapan mula sa simula.',
      'Maliit din ang lokal na listahan ng mga counsellor kumpara sa mga kalapit na lungsod, at mas maikli pa ito kapag may kondisyon ka sa wika. Ang isang praktis na buong online ay hindi nakasalalay sa laki ng bayan mo.',
    ],
    faqs: [
      { q: 'Nasa Ladner ako, hindi North Delta. Mahalaga ba iyon?', a: 'Hindi. Pareho ang serbisyo sa buong Delta, at walang binabago ang lokasyon sa oras o bayad.' },
      { q: 'Puwede ba akong magsimula habang naghihintay sa pampublikong serbisyo?', a: 'Oo, at karaniwan iyong magandang ideya. Katabing ruta ito, hindi kapalit — walang gastos ang manatili sa pila habang nagsisimula ka.' },
      { q: 'Makakakuha ba ako ng resibo para sa insurance?', a: 'Oo. May resibong may numero ng rehistro pagkatapos ng bawat sesyon, na siyang hinihingi ng karamihan sa mga extended health plan.' },
    ],
  },
  langley: {
    blurb: 'Lumalagong lugar na hindi kasing bilis lumago ang bilang ng counsellor.',
    local: [
      'Mabilis lumago ang Langley, at hindi sumabay ang bilang ng counsellor na tumatanggap ng bagong kliyente. Ang resulta ay isang listahan ng paghihintay na mas mahaba kaysa sa inaasahan ng laki ng lugar.',
      'Kapag ang hinahanap mo ay tiyak — isang partikular na paraan ng pagtatrabaho, o isang sesyon sa Tagalog — mas maikli pa ang lokal na listahan. Pinapalawak ng video ang larangan sa buong lalawigan nang hindi nagdaragdag ng biyahe.',
      'Malawak din ang Langley: magkaibang distansya ang Township at ang City sa halos lahat, at ang isang harapang sesyon ay madalas nangangahulugan ng biyahe pakanluran sa oras na hindi gumagalaw ang trapiko. Ang oras na iyon ang unang nagiging dahilan para hindi na ituloy.',
    ],
    faqs: [
      { q: 'Nasa Aldergrove ako. Sakop ba iyon?', a: 'Oo, at sa parehong mga tuntunin. Walang bahagi ng serbisyo ang nakadepende sa distansya sa loob ng lalawigan.' },
      { q: 'Gaano katagal bago makapagsimula?', a: 'Karaniwang mas maikli kaysa sa isang pampublikong listahan. Ang unang hakbang ay isang libreng labinlimang minutong konsultasyon, at doon napag-uusapan ang tunay na simula.' },
      { q: 'Para saan ang mga sesyon?', a: 'Trauma, pagkabalisa at matagalang stress, pagluluksa at mga pagbabago sa buhay, at trabahong pang-mag-asawa. Kung iba ang kailangan mo, sasabihin sa iyo iyon sa konsultasyon.' },
    ],
  },
  'white-rock': {
    blurb: 'Isang maliit na lugar na may maliit na listahan, at isang praktis na hindi nakasalalay sa laki nito.',
    local: [
      'Maliit ang White Rock at South Surrey, at maliit din ang listahan ng mga counsellor na tumatanggap ng bagong kliyente. Kapag isinama mo ang wika, madalas walang natitira.',
      'Ang isang praktis na buong online ay hindi nakasalalay sa laki ng bayan. Ang tanong ay hindi kung sino ang malapit, kundi kung sino ang tama — at iyon ang tanong na dapat sagutin ng isang libreng konsultasyon.',
      'May kasama ring bagay ang maliit na bayan na bihirang banggitin: magkakakilala ang mga tao. Ang pagpasok sa isang lokal na klinika ay may bigat na makatuwirang iwasan, at walang gusaling mapapasukan sa isang praktis na nasa video lamang.',
    ],
    faqs: [
      { q: 'Sakop ba nito ang South Surrey?', a: 'Oo, sa parehong mga tuntunin. Iisang lugar ito sa praktika, at walang binabago ang hangganan sa bayad o oras.' },
      { q: 'Makikita ba ako ng iba na pumapasok sa isang klinika?', a: 'Wala kang papasukang klinika. Nasa video ang lahat ng sesyon, at wala kang kailangang puntahan.' },
      { q: 'Puwede ba ang sesyon sa Tagalog dito?', a: 'Oo. Hindi nakadepende sa lokasyon ang wika — pareho ang magagamit saanman sa lalawigan.' },
    ],
  },
  abbotsford: {
    blurb: 'Sapat ang layo para maging tunay na biyahe ang pagpapatingin, at sapat ang lapit para sabihing gawin mo pa rin.',
    local: [
      'Sapat ang layo ng Abbotsford mula sa Lower Mainland para mangahulugan ng tunay na pagmamaneho ang isang harapang pagpapatingin, at sapat ang lapit para sabihin sa iyong gawin pa rin. Ang isang oras sa bawat direksyon sa paligid ng trabaho ang dahilan kung bakit maraming counselling dito ang natatapos pagkatapos ng ikatlong sesyon.',
      'Sumusunod din ang malaking bahagi ng trabaho sa lambak sa panahon at shift kaysa sa oras ng opisina. Ang pag-book nang paunti-unti na may puwang sa pagitan ay karaniwang paraan at hindi kompromiso.',
      'Mahalaga rin dito ang pagkapribado sa paraang bihirang pag-usapan. Sa lugar na magkakakilala ang mga pamilya, ang makitang pumapasok sa isang opisina ng counselling ay may bigat na makatuwirang iwasan — at nawawala nang buo ang tanong kapag walang gusaling mapapasukan.',
    ],
    faqs: [
      { q: 'Sakop ba nito ang Mission at ang silangang lambak?', a: 'Oo, sa parehong mga tuntunin, at walang parusa sa distansya para sa mga nasa mas malayo.' },
      { q: 'Nagtatrabaho ako ayon sa panahon. Puwede bang huminto at magbalik?', a: 'Oo. Karaniwan dito ang pag-book nang paunti-unti at ang paghinto sa pagitan, at walang gastos ang paghinto.' },
      { q: 'Kailangan ko ba ng referral mula sa doktor?', a: 'Hindi. Direkta ang pagpunta sa isang counsellor, at walang kailangang referral o diagnosis para magsimula.' },
    ],
  },
  chilliwack: {
    blurb: 'Isang highway na hindi laging maaasahan, at isang sesyon na hindi nakadepende rito.',
    local: [
      'Ang biyahe pakanluran mula sa Chilliwack ay isang plano hanggang sa hindi na ito plano — ang panahon, ang pagsasara, ang isang aksidente sa maling bahagi ng highway. Ang takdang oras na nakasalalay sa isang kalsada ay takdang oras na kanselado nang paulit-ulit.',
      'Walang binabago ang panahon sa isang sesyon sa video. Iyon ang buong pagkakaiba para sa isang taong nakatira sa silangang bahagi ng lambak.',
      'Maikli rin ang lokal na listahan. Ang mga espesyalistang serbisyo ay nakatuon pakanluran, at ang karaniwang sagot para sa Chilliwack ay isang biyaheng hindi kayang ulitin linggu-linggo. Inaalis ng video ang biyahe sa tanong nang buo.',
    ],
    faqs: [
      { q: 'Sakop ba nito ang Agassiz at Hope?', a: 'Oo, sa parehong mga tuntunin. Walang parusa sa distansya sa loob ng lalawigan.' },
      { q: 'Paano kung mahina ang koneksyon ko?', a: 'May paraan pa rin. Kung hindi kayang buhatin ng linya ang video, maaaring tuloy sa boses, at hindi iyon nagpapababa sa halaga ng sesyon.' },
      { q: 'Puwede bang gabi, dahil sa trabaho ko?', a: 'Oo. May mga oras sa gabi ng karaniwang araw kapag hiniling.' },
    ],
  },
  nanaimo: {
    blurb: 'Walang ferry, walang iskedyul ng biyahe, at walang buong araw na nawawala sa isang pagpapatingin.',
    local: [
      'Ang pagpunta sa isang espesyalista sa Lower Mainland mula sa Nanaimo ay hindi isang biyahe kundi isang araw: ang ferry, ang paghihintay, ang pagbalik. Kakaunti ang serye ng terapiyang nakakaligtas sa ganoong gastos.',
      'Ang isang praktis na buong online ay nag-aalis ng ferry sa pagpaplano. Ang natitira ay ang sesyon mismo, na siyang bahaging dapat mahalaga.',
      'Totoo rin ang problema ng bilang dito. Kakaunti ang mga counsellor sa isla na tumatanggap ng bagong kliyente, at mas kakaunti pa kapag may kondisyon ka sa wika o sa paraan ng pagtatrabaho. Hindi ito nalulutas ng paghihintay.',
    ],
    faqs: [
      { q: 'Sakop ba nito ang Ladysmith, Lantzville at Gabriola?', a: 'Oo, sa parehong mga tuntunin. Walang bahagi ng serbisyo ang nakadepende sa distansya sa loob ng lalawigan.' },
      { q: 'Kailangan ko pa bang tumawid para sa unang sesyon?', a: 'Hindi kailanman. Nasa video ang lahat, kasama ang unang libreng konsultasyon.' },
      { q: 'Ano ang haba ng isang sesyon?', a: 'Limampung minuto, pagkatapos ng libreng labinlimang minutong konsultasyon sa simula.' },
    ],
  },
  victoria: {
    blurb: 'Isang lungsod na may sariling serbisyo, at isang wikang mahirap pa ring hanapin dito.',
    local: [
      'May sariling mga counsellor ang Victoria, at para sa marami sapat na iyon. Kapag mas tiyak ang hinahanap mo — isang partikular na paraan ng pagtatrabaho, o isang sesyon sa Tagalog — mas maikli ang listahan kaysa sa inaasahan ng laki ng lungsod.',
      'Ang video ang tanging makatotohanang ruta para sa maraming naninirahan sa isla, at hindi ito kaginhawahan lamang kundi ang pagkakaiba ng pagkakaroon ng pagpipilian at ng wala.',
      'Malaki rin ang bahagi ng trabaho dito na nasa pampublikong serbisyo at sa pangangalaga, na may sariling iskedyul. Ang sesyon na kasya sa gabi, nang walang biyahe sa magkabilang dulo, ang kadalasang natutuloy.',
    ],
    faqs: [
      { q: 'Sakop ba nito ang Saanich at Sooke?', a: 'Oo, sa parehong mga tuntunin, at walang parusa sa distansya para sa mga nasa labas ng sentro.' },
      { q: 'May mga nagsasalita ba ng Tagalog na counsellor sa isla?', a: 'Kakaunti, at karamihan ay nasa Lower Mainland. Para sa marami rito, ang video ang tanging makatotohanang paraan para makakuha ng sesyon sa sariling wika.' },
      { q: 'Puwede ba akong magpalit ng counsellor kung hindi kami magkasundo?', a: 'Oo, at hindi iyon dapat ikahiya. Para mismo doon ang libreng konsultasyon — para malaman ito bago ka magpasya sa kahit ano.' },
    ],
  },
  kelowna: {
    blurb: 'Lumalaking lungsod, at isang larangan ng counselling na hindi sumabay sa laki nito.',
    local: [
      'Mabilis lumago ang Kelowna at ang Central Okanagan, at hindi sumabay ang bilang ng counsellor. Kapag idinagdag mo ang wika sa hinahanap, kakaunti ang natitira sa loob ng makatuwirang biyahe.',
      'Hindi ito problemang malulutas ng paghihintay. Ang video ang naglilipat ng tanong mula sa kung sino ang nandito patungo sa kung sino ang tama para sa iyo.',
      'Marami rin sa trabaho dito ay sumusunod sa panahon — mas mabigat ang tag-init kaysa sa taglamig, at iba ang hitsura ng linggo depende sa buwan. Ang pag-book nang paunti-unti, na may puwang kapag mataas ang trabaho, ay karaniwang paraan dito at hindi kompromiso.',
    ],
    faqs: [
      { q: 'Sakop ba nito ang West Kelowna at Vernon?', a: 'Oo, sa parehong mga tuntunin. Walang parusa sa distansya sa loob ng lalawigan.' },
      { q: 'Mas mabigat ang trabaho ko sa tag-init. Puwede bang huminto?', a: 'Oo, at mas mabuting planuhin iyon sa simula. Normal ang paghinto sa pagitan ng mga bloke at walang gastos ito.' },
      { q: 'Sagot ba ito ng extended health plan ko?', a: 'Madalas, at nakadepende sa kung aling designation ang tinatanggap ng plano mo. Isang tawag lang iyon sa insurer bago magsimula, at iyon ang sagot na nagtatakda ng tunay na gastos.' },
    ],
  },
  kamloops: {
    blurb: 'Apat na oras patungo sa baybayin, o isang sesyon mula sa kung nasaan ka.',
    local: [
      'Ang mga espesyalistang serbisyo ay nakatuon sa Lower Mainland, at ang tradisyonal na sagot para sa Kamloops ay isang mahabang biyahe. Kakaunti ang taong kayang gawin iyon linggu-linggo, at kakaunti ang serye ng terapiyang nakakaligtas dito.',
      'Sumusunod din ang malaking bahagi ng trabaho dito sa shift at panahon. Ang pag-book sa paligid ng iskedyul, kaysa sa pagpilit ng iskedyul sa paligid ng takdang oras, ang gumagana.',
      'Ang bilang ng counsellor dito ay maliit at mabilis mapuno, at mas maliit pa kapag may kondisyon ka sa wika. Hindi ito reklamo tungkol sa lugar — ito ang aritmetika nito, at hindi ito nagbabago sa paghihintay.',
    ],
    faqs: [
      { q: 'Sakop ba nito ang Merritt at Salmon Arm?', a: 'Oo, sa parehong mga tuntunin, at walang parusa sa distansya para sa mga nasa mas malayo.' },
      { q: 'Nagtatrabaho ako sa rotation. Kakasya ba ito?', a: 'Oo, at mas mabuting sabihin iyon sa unang usapan. Ang pag-book nang paunti-unti sa paligid ng rotation ay karaniwang paraan dito.' },
      { q: 'Ano ang kaibahan ng video sa harapang sesyon?', a: 'Sa trabaho mismo, kakaunti. Ang nawawala ay ang biyahe, at iyon ang bahaging pinakamadalas maging dahilan ng paghinto.' },
    ],
  },
  'prince-george': {
    blurb: 'Ang pinakamalapit na espesyalista ay maaaring nasa walong oras ang layo. Ang video ang tunay na ruta.',
    local: [
      'Kakaunti ang counsellor sa Prince George, mabilis mapuno ang mga tumatanggap, at ang paghihintay para sa espesyalista ay mas mahaba kaysa halos saanman sa lalawigan. Hindi ito reklamo tungkol sa lugar — ito ang aritmetika nito.',
      'Kapag idinagdag mo ang kondisyon ng wika, hindi lamang lumiliit ang lokal na bilang, nawawala ito. Para sa halos buong Hilagang BC, ang video ay hindi kaginhawahan kundi ang tanging makatotohanang ruta.',
      'Mahaba rin ang taglamig dito at totoo ang epekto nito sa kalooban ng marami. Ang serye ng sesyon na hindi nakadepende sa kalsada o sa panahon ay ang uri lamang na natatapos sa mga buwang iyon.',
    ],
    faqs: [
      { q: 'Sakop ba nito ang Quesnel, Vanderhoof at Mackenzie?', a: 'Oo, sa parehong mga tuntunin. Walang parusa sa distansya sa loob ng lalawigan.' },
      { q: 'Dapat ba akong manatili sa pampublikong listahan?', a: 'Karaniwan, oo. Katabing ruta ito at hindi kapalit — walang gastos ang manatili sa pila habang nagsisimula ka sa ibang lugar.' },
      { q: 'Puwede bang sa Tagalog ang buong sesyon dito?', a: 'Oo. Walang kinalaman ang lokasyon mo sa kung anong wika ang magagamit sa sesyon.' },
    ],
  },
  calgary: {
    blurb: 'Isang lungsod na mahaba ang oras ng trabaho at mabilis gumalaw, na may listahan ng paghihintay na hindi.',
    local: [
      'May mga counsellor ang Calgary. Ang mas kakaunti ay ang mga oras na talagang pinapasok ng lungsod — marami sa Calgary ang nasa rotation, on-call, o sumusunod sa iskedyul na itinakda sa ibang lugar. Ang takdang oras na nag-aakalang libre ka ng hapon ng karaniwang araw ay takdang oras na dalawang beses mong makakaligtaan bago ka tumigil sa pag-book.',
      'May pangalawang pattern ang Calgary: ang pag-ikot ng industriya. Ang pagkabalisa na kasama ng isang mahinang taon ay hindi katulad ng anxiety disorder — makatuwirang tugon ito sa isang hindi tiyak na taon, at ibang trabaho ang kailangan nito.',
      'Malaki rin ang komunidad ng Pilipino dito, karamihan sa pangangalaga at sa serbisyo, at kakaunti ang counselling na naibibigay sa Tagalog. Ang resulta ay pamilyar: ang kaanak na pinakamagaling mag-Ingles ang nagiging tagasalin, na hindi umuubra sa terapiya.',
    ],
    faqs: [
      { q: 'Anong time zone ang mga oras ng sesyon?', a: 'Ang mga oras na ipinapakita sa iyo ay Mountain Time. Ang sesyon ay pinapatakbo mula sa British Columbia, isang oras ang pagkakaiba, at inaayos iyon sa dulo ng booking kaya walang kailangang i-convert.' },
      { q: 'Rehistrado ba ang counsellor sa Alberta?', a: 'Hindi regulated na propesyon ang counselling therapy sa Alberta, kaya walang panlalawigang kolehiyo na maaaring salihan. Ang masusuri ay ang sertipikasyon: Canadian Certified Counsellor sa CCPA, at Registered Clinical Counsellor sa BCACC — pareho silang pampublikong rehistro at nakalista ang mga numero sa pahinang ito.' },
      { q: 'Sagot ba ito ng Alberta Health Care?', a: 'Hindi. Walang saklaw ang AHCIP sa pribadong counselling. Marami sa mga extended health plan dito ang nagbabalik-bayad sa isang Canadian Certified Counsellor, kaya sulit itanong sa insurer bago magsimula.' },
    ],
  },
  edmonton: {
    blurb: 'Isang matagal nang komunidad, at isang listahan ng paghihintay na hindi sumasabay.',
    local: [
      'May malaki at matagal nang komunidad ng Pilipino ang Edmonton, karamihan sa healthcare at care work — mga trabahong sumusunod sa shift at hindi sa oras ng opisina. Ang nakatakdang oras sa hapon ay ang unang bagay na nawawala sa isang umiikot na roster.',
      'Tunay ang mga pampublikong serbisyo dito at may sariling listahan ng paghihintay. Ang pribadong counselling na kasabay ng pampublikong paghihintay ay isang katabing ruta, hindi kapalit nito — at walang gastos ang manatili sa pila habang nagsisimula ka sa ibang lugar.',
      'Mahaba at mabigat ang taglamig dito, at totoo ang epekto nito. Ang isang serye ng sesyon na hindi nangangailangan ng pag-alis sa bahay sa gabi ng Enero ay ang uri lamang na natutuloy hanggang sa dulo.',
    ],
    faqs: [
      { q: 'Dapat ko bang iwan ang pampublikong listahan ng paghihintay?', a: 'Karaniwan, hindi. Tunay na serbisyo ang pinapatakbo ng Alberta Health Services at walang gastos ang manatili sa pila habang nagsisimula ka sa ibang lugar.' },
      { q: 'Anong time zone ang sinusunod?', a: 'Mountain Time ang mga oras na ipinapakita sa iyo, kaya ang oras na nakikita mo ang oras na dadaluhan mo.' },
      { q: 'Puwede bang gabi lang, dahil sa shift ko?', a: 'Oo. May mga oras sa gabi ng karaniwang araw kapag hiniling, at karaniwan iyon dito.' },
    ],
  },
};

export const getTagalogPlace = (slug: string): TagalogPlaceCopy | undefined =>
  TL_PLACES[slug];
