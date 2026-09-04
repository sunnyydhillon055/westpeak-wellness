/* ============================================================================
   GABAY — THE TAGALOG GUIDES
   ----------------------------------------------------------------------------
   All 42 guides on this site are in English. A Tagalog speaker searching "ano
   ang panic attack" or "depresyon ba ito" found nothing here: the eighteen
   Tagalog pages that existed were all counsellor or city pages, so there was
   somebody to book and nothing to read.

   WRITTEN, NOT TRANSLATED. These are not the English guides rendered in
   Tagalog. A 2,500-word clinical guide translated by a non-native speaker is a
   larger surface for the register to go wrong on than a shorter piece written
   for this reader from the start — and the questions are different anyway. The
   English guide on talking to your family about therapy assumes a family that
   might be persuaded; this one assumes a family where the conversation may not
   be had at all, which is a different piece.

   ENGLISH TERMS STAY IN ENGLISH where those are the words people use and
   search: panic attack, burnout, therapy, RCC, CCC. Translating them would
   make the page less useful rather than more authentic.

   REVIEW STATUS: unreviewed, like all the Tagalog here. Gated on
   TAGALOG_READY; see lib/practitioner-tl.ts for the whole note.

   BCACC: descriptive, never predictive. No page here says counselling will
   work, how well, or how fast.
   ========================================================================= */

export type TagalogGuideSection = { h2: string; body: string[] };

export type TagalogGuide = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  lede: string;
  /** The direct answer, above the fold. */
  shortAnswer: string;
  readMinutes: number;
  sections: TagalogGuideSection[];
  faqs: { q: string; a: string }[];
  /* Four Tagalog diagrams exist now, not one. Each is the English original
     with every text node translated and no coordinate moved, so a change to
     the shape of an idea cannot drift between the two languages.

     The rule this field used to enforce by being narrow still stands and is
     now enforced by the name: an English diagram on these pages would defeat
     the point of the page, so only -tl figures belong here. */
  figure?:
    | 'language-in-therapy-tl'
    | 'panic-vs-anxiety-tl'
    | 'burnout-vs-depression-tl'
    | 'first-session-flow-tl';
  /* WHICH TWO GUIDES TO READ NEXT, chosen by hand rather than generated.
   *
   * These six pages had exactly one in-body inbound link each — from the
   * Tagalog index and nowhere else. That is a reader with nowhere to go at the
   * end of a page and a crawler with one route in, and it is why every one of
   * them sat below the thin-content threshold on inbound links.
   *
   * A generated "every other guide" list would have fixed the count and not
   * the reading: panic and inherited trauma are not a next step from each
   * other. Each pair here is the question the previous page tends to leave
   * behind. */
  related?: [string, string];
  /** The English page on the same subject, for a bilingual reader. */
  englishHref?: string;
  englishLabel?: string;
};

export const tagalogGuides: TagalogGuide[] = [
  {
    slug: 'ano-ang-panic-attack',
    title: 'Ano ang panic attack, at bakit parang atake sa puso',
    metaTitle: 'Ano ang panic attack? | Westpeak Wellness',
    metaDescription:
      'Bakit parang atake sa puso ang panic attack, ano ang nangyayari sa katawan, at kailan ito nagiging bahagi ng mas malaking pattern.',
    lede:
      'Karamihan sa unang panic attack ay napupunta sa emergency room. Hindi iyon kahihiyan, magkatulad talaga ang pakiramdam nila, at ang katawan ay walang paraan para sabihin sa iyo kung alin ito.',
    shortAnswer:
      'Ang panic attack ay biglaang pagsabog ng tugon ng katawan sa panganib kahit walang aktuwal na panganib. Umaabot ito sa rurok sa loob ng ilang minuto at humuhupa nang mag-isa. Hindi ito mapanganib sa sarili nito, kahit na hindi iyon ang pakiramdam habang nangyayari.',
    readMinutes: 5,
    sections: [
      {
        h2: 'Ano ang nangyayari sa katawan',
        body: [
          'May sistema ang katawan para sa panganib: bumibilis ang puso para magdala ng dugo sa mga kalamnan, bumibilis ang paghinga, umiigting ang mga kalamnan, at humihigpit ang atensyon. Ginagawa ang lahat ng ito nang wala kang desisyon, at mabuti iyon kapag may tunay na panganib.',
          'Sa isang panic attack, umaandar ang buong sistemang ito nang walang panganib na kailangan nito. Ang resulta ay isang katawan na handang tumakbo mula sa isang bagay na wala roon, at dahil walang mapagtakbuhan, ang mga sintomas ang nagiging paksa ng atensyon mo.',
          'Iyon ang dahilan kung bakit mahirap paniwalaan ang paliwanag habang nangyayari ito. Hindi ito nararamdaman bilang pagkabalisa. Nararamdaman ito bilang isang bagay na seryosong nangyayari sa katawan mo.',
        ],
      },
      {
        h2: 'Bakit nagsisimula ang pangalawa',
        body: [
          'Pagkatapos ng una, karaniwang nagsisimula ang isang bagong takot: ang takot na mangyari itong muli. At dahil ang panic ay tugon sa panganib, ang pag-aalala tungkol sa panic ay sapat na para simulan ito.',
          'Doon nagiging pattern ang isang pangyayari. Sinisimulan ng mga tao na iwasan ang mga lugar kung saan ito nangyari, tinitingnan ang pulso, umuupo malapit sa pinto. Ang bawat isa sa mga iyon ay makatuwiran nang isa-isa, at magkasama silang nagpapaliit ng buhay.',
        ],
      },
      {
        h2: 'Ang bahaging tumutugon sa trabaho',
        body: [
          'Ang pag-iwas at ang pagsusuri sa katawan ang dalawang bagay na nagpapanatili sa pattern, at pareho silang mababago. Iyon ang dahilan kung bakit ang trabaho sa panic ay kadalasang mas maikli kaysa inaasahan ng mga tao: mayroon itong tiyak na hugis at hindi ito nangangailangan ng taon ng pag-uusap.',
          'Ang nauuna ay hindi ang pagtatalo sa isip. Ang nauuna ay ang pag-unawa kung ano talaga ang nangyayari sa katawan, dahil mahirap huminto sa pagtakas sa isang bagay na pinaniniwalaan mong papatay sa iyo.',
        ],
      },
      {
        h2: 'Kailan ito dapat tingnan ng doktor',
        body: [
          'Palaging ipatingin ang unang pagkakataon. May ibang kondisyon na kamukha nito, at hindi trabaho ng counsellor na ibukod ang mga iyon, trabaho iyon ng manggagamot. Ang isang counsellor sa BC o Alberta ay hindi nagbibigay ng diagnosis.',
          'Kapag nasuri ka na at nasabihang panic ito, doon nagiging kapaki-pakinabang ang trabaho sa counselling.',
        ],
      },
    ],
    figure: 'panic-vs-anxiety-tl',
    related: ['depresyon-o-pagod-lang', 'ano-ang-mangyayari-sa-unang-sesyon'],
    faqs: [
      {
        q: 'Delikado ba ang panic attack?',
        a: 'Ang panic attack mismo ay hindi mapanganib sa katawan, kahit na hindi iyon ang pakiramdam. Ang dapat ipatingin sa doktor ay ang unang pagkakataon, para maalis ang ibang posibleng dahilan.',
      },
      {
        q: 'Gaano katagal ito?',
        a: 'Umaabot sa rurok sa loob ng ilang minuto at humuhupa nang mag-isa. Ang pakiramdam ng pagkaubos pagkatapos ay maaaring tumagal nang mas matagal, at normal iyon.',
      },
      {
        q: 'Kailangan ko ba ng gamot?',
        a: 'Tanong iyon para sa doktor at hindi para sa counsellor. Maraming tao ang gumagamit ng isa, ng isa pa, o ng pareho, at hindi kailangang mapagdesisyunan iyon bago magsimula sa counselling.',
      },
    ],
    englishHref: '/guides/anxiety-attack-vs-panic-attack',
    englishLabel: 'Anxiety attack vs panic attack',
  },
  {
    slug: 'depresyon-o-pagod-lang',
    title: 'Depresyon ba ito, o pagod lang talaga ako?',
    metaTitle: 'Depresyon o pagod lang? | Westpeak Wellness',
    metaDescription:
      'Ang pagkakaiba ng pagod at ng depresyon, bakit hindi ito natutulungan ng pahinga, at bakit tinatawag itong katamaran ng mismong nakakaranas.',
    lede:
      'Ang pinakakaraniwang salitang ginagamit ng mga tao para sa sarili nila bago pa may ibang magsalita ay hindi malungkot. Tamad.',
    shortAnswer:
      'Ang pagod ay gumagaan kapag nakapagpahinga ka. Ang depresyon ay hindi. Kung nakatulog ka nang maayos sa isang buong linggo at ganoon pa rin ang pakiramdam, hindi na iyon usapin ng pahinga.',
    readMinutes: 5,
    sections: [
      {
        h2: 'Ang pinakamalinaw na pagkakaiba',
        body: [
          'Tumutugon ang pagod sa pahinga. Isang mahabang tulog, isang bakasyon, isang linggong walang dagdag na trabaho: kung gumagaan ang lahat pagkatapos noon, pagod iyon, at ang sagot ay nasa iskedyul mo.',
          'Ang depresyon ay hindi umuubra nang ganoon. Kayang matulog ng tao ng sampung oras at gumising na parang hindi natulog. Kayang matapos ang bakasyon at bumalik na pareho pa rin. Hindi iyon dahil kulang ang pahinga. Ibang bagay iyon.',
        ],
      },
      {
        h2: 'Kadalasan ay kawalan, hindi kalungkutan',
        body: [
          'Inaasahan ng maraming tao na ang depresyon ay pag-iyak. Madalas ay hindi. Mas madalas itong kawalan: kawalan ng gana, ng interes, ng pakiramdam na may kahulugan ang anuman. Nagagawa mo pa rin ang mga bagay. Wala lang silang laman.',
          'Iyon ang dahilan kung bakit napakatagal bago ito napapansin. Walang sandali na malinaw na nagsimula ito, at dahil tumatakbo pa rin ang lahat sa labas, walang ibang nakakapansin.',
        ],
      },
      {
        h2: 'Bakit ito tinatawag na katamaran',
        body: [
          'Sa mga pamilyang itinayo sa sipag, ang mga magulang na nagtiis para may mas magandang buhay ang susunod na henerasyon, walang komportableng salita para sa isang taong hindi makabangon. Ang mga salitang available ay tungkol sa ugali, hindi tungkol sa kalusugan.',
          'Kaya inilalapat ng tao ang mga salitang iyon sa sarili niya bago pa may ibang magsabi. Walang utang na loob. Tamad. Sayang ang pinaghirapan nila.',
          'Ang balakid na iyon, hindi ang depresyon, ang madalas na unang hinaharap. Ang paghihiwalay ng sintomas sa hatol tungkol sa pagkatao ay kadalasang ang unang bagay na nakakatulong.',
        ],
      },
      {
        h2: 'Ang nagpapatuloy nito',
        body: [
          'Inaalis ng depresyon ang mismong lakas na kailangan para sa mga bagay na nakakapagpagaan nito. Kaya walang saysay ang payo. Ang sabihing lumabas ka at makipagkita sa tao ay tama at hindi magagawa, at ang hindi paggawa nito ay nagiging isa pang patunay laban sa sarili.',
          'Dahil doon, maliit at kongkreto ang unang hakbang sa trabaho. Hindi malalaking plano. Ang layunin ay ibalik ang paggalaw bago hanapin ang pag-unawa.',
        ],
      },
    ],
    figure: 'burnout-vs-depression-tl',
    related: ['pagod-sa-pag-aalaga', 'ano-ang-panic-attack'],
    faqs: [
      {
        q: 'Paano ko malalaman kung alin ito?',
        a: 'Ang pinakamalinaw na pagsubok ay ang pahinga. Kung ang isang linggo ng tunay na pahinga ay walang binago, hindi na iyon usapin ng pagod. Kung gumaan nang malaki, iyon ay impormasyon din.',
      },
      {
        q: 'Kailangan ko bang magpatingin sa doktor?',
        a: 'Sulit iyon. May mga pisikal na kondisyon na kamukha ng depresyon, at ang counsellor ay hindi nagbibigay ng diagnosis. Ang doktor ang makakapagbukod niyan.',
      },
      {
        q: 'Kahihiyan ba ang pagpunta sa counselling?',
        a: 'Sa maraming pamilya, ganoon ang pakiramdam, at totoo ang bigat na iyon. Ang counselling ay pribado, walang ibang naaabisuhan, at walang gusaling papasukan na makikita ng iba.',
      },
    ],
    englishHref: '/guides/burnout-vs-depression',
    englishLabel: 'Burnout vs depression',
  },
  {
    slug: 'pag-uusap-sa-pamilya-tungkol-sa-therapy',
    title: 'Paano sabihin sa pamilya na pupunta ka sa counselling',
    metaTitle: 'Pagsasabi sa pamilya tungkol sa therapy | Westpeak Wellness',
    metaDescription:
      'Ano ang sasabihin, kung kailangan mo bang magsabi, at paano kung ang reaksyon ay hindi maganda. Walang kailangang aminin bago ka magsimula.',
    lede:
      'Ang unang tanong ay hindi kung paano sasabihin. Ang unang tanong ay kung kailangan mo bang sabihin, at ang sagot ay madalas na hindi.',
    shortAnswer:
      'Hindi mo kailangang sabihin sa kahit sino. Ang counselling ay pribado at hindi ito naaabisuhan sa pamilya. Kung nais mong magsabi, ang pinakamadaling paraan ay ang maliit at praktikal na bersyon, hindi ang buong paliwanag.',
    readMinutes: 5,
    sections: [
      {
        h2: 'Wala kang utang na paliwanag',
        body: [
          'Isa itong desisyong pangkalusugan at sa iyo lamang. Walang naipapadalang abiso, walang tinatawagan, at walang nakakaalam maliban kung ikaw mismo ang magsabi. Kung mas madali ang hindi pagsasabi ngayon, wala kang nilalabag.',
          'Marami ang nagsisimula nang tahimik at nagsasabi lamang pagkatapos ng ilang buwan, kapag mas madali nang ipaliwanag ang isang bagay na alam mo nang nakakatulong sa iyo.',
        ],
      },
      {
        h2: 'Kung magsasabi ka, gawing maliit',
        body: [
          'Ang mahabang paliwanag ay nag-aanyaya ng mahabang debate. Ang maikling bersyon ay mas madalas na tinatanggap: may kausap ako tungkol sa stress. Kumukuha ako ng tulong sa pagtulog. May pinag-uusapan kaming ilang bagay.',
          'Walang kasinungalingan doon. Ang piniling detalye ay iyo, at ang buong kuwento ay hindi kailangan ng ibang tao para igalang ang desisyon.',
        ],
      },
      {
        h2: 'Kapag masama ang reaksyon',
        body: [
          'Minsan hindi maganda ang tugon. Sabi nila ay hindi ito para sa mga tulad natin, o na dapat sa pamilya mo lang sasabihin ang mga ganito, o na sinasayang mo ang pera. Kadalasan hindi iyon tungkol sa iyo, tungkol iyon sa kung ano ang naitanim sa kanila tungkol sa pag-amin ng hirap.',
          'Hindi mo kailangang manalo sa usapang iyon para magpatuloy. Ang pinakakaraniwang pagkakamali ay ang paghihintay ng pahintulot na hindi naman kailangan.',
        ],
      },
      {
        h2: 'Kung ang pamilya mismo ang paksa',
        body: [
          'Kung ang mga inaasahan ng pamilya ang bahagi ng bigat, hindi iyon kailangang ipaliwanag mula sa simula sa isang sesyon na sa Tagalog. Ang utang na loob, ang hiya, ang tungkulin ng panganay, konteksto ang mga ito at hindi aralin.',
          'Iyon ang pagkakaiba na madalas na dahilan kung bakit sa wakas ay nag-book ang tao: hindi ang wika mismo, kundi ang hindi na paggugol ng unang tatlong sesyon sa paglalarawan ng isang bagay na dapat ay pamilyar na.',
        ],
      },
    ],
    related: ['ano-ang-mangyayari-sa-unang-sesyon', 'trauma-na-naipapasa-sa-pamilya'],
    faqs: [
      {
        q: 'Malalaman ba ng asawa o magulang ko?',
        a: 'Hindi. Walang naaabisuhan at walang record na ibinabahagi. Ang mga limitasyon ng kompidensiyalidad ay makitid, tiyak, at nakasulat sa pahina ng mga pamantayan.',
      },
      {
        q: 'Paano kung ayaw nilang pumunta ako?',
        a: 'Desisyon mo pa rin ito. Hindi mo kailangan ng pahintulot ng kahit sino para kumuha ng tulong sa kalusugan, at ang paghihintay nito ang pinakakaraniwang paraan ng pagkaantala ng ilang taon.',
      },
      {
        q: 'Puwede bang sumama sila?',
        a: 'May family counselling kung iyon ang gusto ninyo, at may indibidwal na trabaho kung hindi. Isa iyon sa mga bagay na napag-uusapan sa libreng konsultasyon.',
      },
    ],
    figure: 'language-in-therapy-tl',
    englishHref: '/guides/talking-to-your-family-about-therapy',
    englishLabel: 'Talking to your family about therapy',
  },
  {
    slug: 'ano-ang-mangyayari-sa-unang-sesyon',
    title: 'Ano ang mangyayari sa unang sesyon',
    metaTitle: 'Ang unang sesyon: ano ang aasahan | Westpeak Wellness',
    metaDescription:
      'Ano talaga ang nangyayari sa libreng labinlimang minuto at sa unang buong sesyon. Walang form, walang diagnosis, at walang kailangang ihanda.',
    lede:
      'Ang pinakakaraniwang dahilan ng pag-aalinlangan ay hindi ang bayad. Ang hindi alam kung ano ang mangyayari sa loob ng silid iyon.',
    shortAnswer:
      'Labinlimang minuto muna, libre, sa video. Ilalarawan mo ang nangyayari sa sarili mong salita at titingnan ninyo kung magkasundo kayo. Walang form na sasagutan at walang desisyong kailangan sa mismong tawag.',
    readMinutes: 4,
    sections: [
      {
        h2: 'Ang libreng labinlimang minuto',
        body: [
          'Isang maikling pag-uusap sa secure na video. Sasabihin mo kung ano ang nangyayari: kahit hindi maayos ang pagkakasabi, at kadalasan nga ay hindi. Magtatanong siya ng ilang bagay, at makakapagtanong ka rin ng kahit ano.',
          'Walang binabayaran, walang card na hinihingi, at walang obligasyon pagkatapos. Ang magpasyang hindi ipagpatuloy ay isang normal na resulta at hindi isang problema.',
        ],
      },
      {
        h2: 'Ang unang buong sesyon',
        body: [
          'Limampung minuto. Mas marami itong pakikinig kaysa pagtatanong. Ang layunin ay maunawaan ang hugis ng nangyayari at kung ano ang gusto mong maging kaibahan, hindi ang makakuha ng kumpletong kasaysayan sa unang araw.',
          'Hindi mo kailangang magsimula sa pinakamabigat. Kung may bagay na ayaw mo pang pag-usapan, sabihin lang, at hindi iyon pipilitin.',
        ],
      },
      {
        h2: 'Ang hindi mangyayari',
        body: [
          'Walang diagnosis. Ang isang Registered Clinical Counsellor ay hindi nagbibigay ng diagnosis, doktor, psychiatrist o registered psychologist ang gumagawa niyan.',
          'Walang form bago ang konsultasyon, walang kailangang ihanda, at walang tamang paraan ng pagsasalita tungkol dito. Kung hindi mo alam kung saan magsisimula, sabihin mo iyon at doon na magsisimula.',
        ],
      },
      {
        h2: 'Ang wika',
        body: [
          'Maaaring sa Tagalog, sa Ingles, o paglipat sa pagitan ng dalawa sa loob ng isang pangungusap. Hindi kailangang magpasya nang maaga, at karamihan ay lumilipat nang hindi sinasadya lalo na kapag mahirap sabihin ang isang bagay.',
        ],
      },
    ],
    figure: 'first-session-flow-tl',
    related: ['pag-uusap-sa-pamilya-tungkol-sa-therapy', 'ano-ang-panic-attack'],
    faqs: [
      {
        q: 'Ano ang isusuot ko o ihahanda?',
        a: 'Wala. Kailangan lang ay isang lugar na sapat ang pagkapribado para sa iyo at isang device na may camera.',
      },
      {
        q: 'Paano kung maiyak ako?',
        a: 'Karaniwan iyon at may puwang para doon. Walang inaasahang komposura sa isang sesyon, at ang hindi pag-iyak ay hindi rin problema.',
      },
      {
        q: 'Paano kung hindi kami magkasundo?',
        a: 'Sasabihin niya iyon nang diretso at ituturo ka sa mas angkop na lugar. Para mismo doon ang libreng labinlimang minuto, para malaman iyon bago ka magbayad ng kahit ano.',
      },
    ],
    englishHref: '/guides/what-to-expect-first-therapy-session',
    englishLabel: 'What to expect in a first session',
  },
  {
    slug: 'trauma-na-naipapasa-sa-pamilya',
    title: 'Ang trauma na hindi sa iyo nangyari',
    metaTitle: 'Trauma na naipapasa sa pamilya | Westpeak Wellness',
    metaDescription:
      'Bakit may dalang bigat ang ikalawang henerasyon mula sa mga pangyayaring hindi nila naranasan, at ano ang aktuwal na naipapasa.',
    lede:
      'Ang ilan sa mga bagay na dala ng tao ay dumating kasama nila, o kasama ng kanilang mga magulang, at hindi kailanman napag-usapan sa bahay.',
    shortAnswer:
      'Hindi ang alaala ang naipapasa. Ang naipapasa ay ang tugon dito: ang pagiging alerto, ang katahimikan sa ilang paksa, ang paraan ng pagharap sa panganib. Iyon ang bahaging kayang pagtrabahuhan.',
    readMinutes: 5,
    sections: [
      {
        h2: 'Ano ang aktuwal na naipapasa',
        body: [
          'Hindi mo namamana ang pangyayari. Ang namamana ay ang naiwan nito: ang antas ng pagiging alerto sa bahay, kung anong mga paksa ang hindi binabanggit, kung paano tinatrato ang galit o takot, at kung ano ang itinuturing na ligtas na sabihin.',
          'Natututo ang bata ng mga patakarang iyon nang walang sinasabihan, at dala nila ito papasok sa isang buhay kung saan wala nang panganib na sinusundan nila. Doon nagiging nakakalito: makatuwiran ang tugon sa isang sitwasyong wala na.',
        ],
      },
      {
        h2: 'Ang karanasan ng paglipat',
        body: [
          'Ang paglipat mismo ay maaaring maging mabigat: kung ano ang iniwan, kung ano ang tiniis para makarating dito, at kung ano ang hindi napag-usapan pagkatapos dahil may trabahong kailangang gawin.',
          'Bihirang ilarawan ito ng henerasyong dumaan doon sa mga salitang klinikal. Ang trabaho ay ginawa, ang mga bata ay napag-aral, at ang paksa ay isinara. Ang mabigat na bahagi ay hindi nawala, hindi lang ito napangalanan.',
        ],
      },
      {
        h2: 'Bakit walang salita para dito',
        body: [
          'Sa maraming pamilya, walang salita para sa ganito na hindi insulto. Kaya inilalarawan ito bilang pagiging sensitibo, o mahina, o walang utang na loob.',
          'Ang tumpak na pagpapangalan dito ay kadalasang ang unang bagay na nakakatulong, at kaya itong gawin sa Tagalog o Ingles, o sa paglipat sa pagitan ng dalawa, na siyang natural para sa marami.',
        ],
      },
      {
        h2: 'Hindi kailangang ikuwento ang lahat',
        body: [
          'Karaniwang tanong: paano kung hindi ko alam ang buong nangyari? Karaniwan iyon at hindi ito balakid. Ang EMDR sa partikular ay hindi nangangailangan ng buong salaysay, kaya angkop ito sa mga taong walang kumpletong kuwento o ayaw pang sabihin ito nang detalyado.',
          'Hindi rin ito tungkol sa pagsisi sa mga magulang. Ang pagkilala na may naipasa ay hindi paratang, kadalasan ang mismong tugon na iyon ang nagligtas sa kanila.',
        ],
      },
    ],
    related: ['pag-uusap-sa-pamilya-tungkol-sa-therapy', 'depresyon-o-pagod-lang'],
    faqs: [
      {
        q: 'Puwede bang trauma ito kung sa magulang ko nangyari?',
        a: 'Kinikilalang pattern iyon at napagtatrabahuhan. Ang naipapasa ay ang tugon at hindi ang alaala, at ang tugon ang binabago ng trabaho.',
      },
      {
        q: 'Kailangan ko bang sisihin ang pamilya ko?',
        a: 'Hindi. Ang pagkilala sa naipasa ay hindi paratang laban sa kanino man, at maraming tao ang lumalabas dito na mas naiintindihan ang mga magulang nila kaysa dati.',
      },
      {
        q: 'Paano kung hindi ko maalala ang lahat?',
        a: 'Bahagi ng paraan ng pag-iimbak ng traumatikong alaala ang mga puwang. Walang hinihinging kumpletong salaysay dito.',
      },
    ],
    figure: 'language-in-therapy-tl',
    englishHref: '/guides/intergenerational-trauma-explained',
    englishLabel: 'Intergenerational trauma explained',
  },
  {
    slug: 'pagod-sa-pag-aalaga',
    title: 'Kapag ang trabaho ay pag-aalaga sa iba',
    metaTitle: 'Burnout sa caregiving at healthcare | Westpeak Wellness',
    metaDescription:
      'Bakit ibang klase ang pagkaubos sa care work at healthcare, bakit hindi ito napapansin, at ano ang pagkakaiba nito sa ordinaryong stress sa trabaho.',
    lede:
      'Malaking bahagi ng care work at healthcare sa BC ay ginagawa ng mga Pilipino, at may sariling hugis ang pagod na kaakibat nito.',
    shortAnswer:
      'Naiiba ang pagkaubos sa pag-aalaga dahil naiipon ito sa halip na dumating. Walang iisang pangyayaring maituturo, kaya madalas itong hindi napapansin nang matagal, kahit ng mismong nakakaranas.',
    readMinutes: 5,
    sections: [
      {
        h2: 'Bakit ito naiipon',
        body: [
          'Sa karamihan ng trabaho, may nangyayari at pagkatapos ay tapos na. Sa pag-aalaga, ang mabigat na bahagi ay paulit-ulit at malapitan: sakit, pagkawala, pamilyang nasa pinakamahirap nilang araw, at inaasahan ang komposura habang ginagawa ito.',
          'Dahil walang iisang pangyayaring maituturo, walang malinaw na sandali kung kailan naging masyadong marami. Kadalasan ay napapansin lamang ito ng ibang tao bago mismo ng nakakaranas.',
        ],
      },
      {
        h2: 'Ang mga palatandaan na madalas ay hindi napapansin',
        body: [
          'Hindi ito karaniwang nagsisimula sa kalungkutan. Nagsisimula ito sa pagkamanhid: mas kaunting pasensya, mas maikling pisi, at ang pakiramdam na lumalayo ka sa mga taong dati mong pinapahalagahan.',
          'Marami ang nag-uugnay nito sa pagiging mahina sa trabaho, kaya hindi sinasabi. Ang katahimikang iyon ang bahaging nagpapatuloy nito.',
        ],
      },
      {
        h2: 'Ang bigat na hindi puwedeng banggitin',
        body: [
          'Mahirap sabihin kung gaano kabigat ang trabaho kapag ang tinutukoy ay mga taong mahal mo o iginagalang. Parang reklamo laban sa kanila, kahit hindi naman.',
          'Doon kadalasang pinakamahalaga ang wika. Ang pagsasabi nito sa wikang iniisip mo, sa taong hindi mo kailangang ipaliwanag ang konteksto ng trabaho o ng pamilya, ang madalas na buong dahilan kung bakit sa wakas ay nasabi ito.',
        ],
      },
      {
        h2: 'Bakit mahalaga ang tamang pangalan',
        body: [
          'Kung ang mga kondisyon ng trabaho ang gumagawa nito, ang pagtrato dito bilang personal na kahinaan ay nagpapalala. Kung may depresyon naman na tumatakbo kasabay nito, ang paghihintay ng pagbabago sa iskedyul ay nag-aantala ng tulong.',
          'Hindi ito napagdedesisyunan sa isang pahina. Ang mahalaga ay malaman na magkaiba sila at may kaibahan ang kailangan ng bawat isa.',
        ],
      },
    ],
    figure: 'burnout-vs-depression-tl',
    related: ['depresyon-o-pagod-lang', 'trauma-na-naipapasa-sa-pamilya'],
    faqs: [
      {
        q: 'Malalaman ba ng employer ko?',
        a: 'Hindi. Pribadong praktis ito na walang koneksyon sa kahit anong employer, at walang iniuulat kahit kanino.',
      },
      {
        q: 'Kakasya ba ito sa umiikot na shift?',
        a: 'Oo, at mas mabuting sabihin iyon sa unang usapan. Karaniwan dito ang pag-book nang paunti-unti sa paligid ng roster at walang gastos ang paghinto sa pagitan.',
      },
      {
        q: 'Burnout ba ito o depresyon?',
        a: 'Magkatulad sila mula sa loob at magkaiba ang tugon nila. Ang pinakamalinaw na pagkakaiba ay kung gumagaan ito kapag talagang malayo ka sa trabaho, at kung hindi mo matandaan ang huling tunay na pahinga, iyon ay sagot din.',
      },
    ],
    englishHref: '/guides/burnout-vs-depression',
    englishLabel: 'Burnout vs depression',
  },
];

export const getTagalogGuide = (slug: string) =>
  tagalogGuides.find((g) => g.slug === slug);
