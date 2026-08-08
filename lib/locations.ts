export type Location = {
  slug: string;
  city: string;
  region: string;       // for grouping / natural copy
  blurb: string;        // 1-2 sentences of locally-flavoured context
};

// Fully virtual practice serving all of BC — city pages target
// "counselling in <city> BC" / "online therapist <city>" searches.
export const locations: Location[] = [
  // Lower Mainland / Fraser Valley
  { slug: "vancouver", city: "Vancouver", region: "Lower Mainland", blurb: "Skip the traffic and parking — meet from home, your office, or anywhere private in the city." },
  { slug: "surrey", city: "Surrey", region: "Lower Mainland", blurb: "Aman was born and raised in Surrey, with deep roots in the community and its South Asian population." },
  { slug: "burnaby", city: "Burnaby", region: "Lower Mainland", blurb: "Fit therapy around a busy Metro Vancouver schedule, without the commute." },
  { slug: "richmond", city: "Richmond", region: "Lower Mainland", blurb: "Private, secure virtual sessions for anyone in Richmond and the surrounding area." },
  { slug: "coquitlam", city: "Coquitlam", region: "Lower Mainland", blurb: "Online counselling for the Tri-Cities, on your schedule." },
  { slug: "langley", city: "Langley", region: "Fraser Valley", blurb: "Fraser Valley clients get province-wide care without leaving the house." },
  { slug: "abbotsford", city: "Abbotsford", region: "Fraser Valley", blurb: "Virtual therapy for Abbotsford and the wider Fraser Valley, including Punjabi-speaking sessions." },
  { slug: "chilliwack", city: "Chilliwack", region: "Fraser Valley", blurb: "Access a Registered Clinical Counsellor from Chilliwack — no drive to the coast required." },
  { slug: "mission", city: "Mission", region: "Fraser Valley", blurb: "Online sessions for Mission and the eastern Fraser Valley." },
  { slug: "maple-ridge", city: "Maple Ridge", region: "Lower Mainland", blurb: "Secure virtual counselling for Maple Ridge and Pitt Meadows." },
  { slug: "delta", city: "Delta", region: "Lower Mainland", blurb: "Therapy from anywhere in Delta, Ladner, or Tsawwassen." },
  { slug: "white-rock", city: "White Rock", region: "Lower Mainland", blurb: "Convenient online sessions for White Rock and South Surrey." },
  { slug: "new-westminster", city: "New Westminster", region: "Lower Mainland", blurb: "Virtual therapy for New West, wherever your day takes you." },
  { slug: "north-vancouver", city: "North Vancouver", region: "Lower Mainland", blurb: "Meet from the North Shore without crossing a bridge." },
  { slug: "west-vancouver", city: "West Vancouver", region: "Lower Mainland", blurb: "Private, flexible online counselling for the North Shore." },
  { slug: "port-coquitlam", city: "Port Coquitlam", region: "Lower Mainland", blurb: "Online sessions that fit around Tri-Cities life." },
  { slug: "port-moody", city: "Port Moody", region: "Lower Mainland", blurb: "Virtual counselling for Port Moody and the Tri-Cities." },
  { slug: "pitt-meadows", city: "Pitt Meadows", region: "Lower Mainland", blurb: "Secure online therapy for Pitt Meadows and Maple Ridge." },

  // Vancouver Island
  { slug: "victoria", city: "Victoria", region: "Vancouver Island", blurb: "Island clients get the same care as the mainland — entirely online." },
  { slug: "nanaimo", city: "Nanaimo", region: "Vancouver Island", blurb: "Virtual counselling for Nanaimo and central Vancouver Island." },
  { slug: "kelowna", city: "Kelowna", region: "Okanagan", blurb: "Online therapy for Kelowna and the Central Okanagan." },
  { slug: "victoria-saanich", city: "Saanich", region: "Vancouver Island", blurb: "Secure online sessions for Saanich and Greater Victoria." },
  { slug: "courtenay", city: "Courtenay", region: "Vancouver Island", blurb: "Reach a Registered Clinical Counsellor from the Comox Valley." },
  { slug: "campbell-river", city: "Campbell River", region: "Vancouver Island", blurb: "Province-wide care for Campbell River and the north Island." },
  { slug: "duncan", city: "Duncan", region: "Vancouver Island", blurb: "Online counselling for Duncan and the Cowichan Valley." },
  { slug: "parksville", city: "Parksville", region: "Vancouver Island", blurb: "Virtual therapy for Parksville, Qualicum, and the mid-Island." },

  // Okanagan / Interior
  { slug: "vernon", city: "Vernon", region: "Okanagan", blurb: "Online sessions for Vernon and the North Okanagan." },
  { slug: "penticton", city: "Penticton", region: "Okanagan", blurb: "Virtual counselling for Penticton and the South Okanagan." },
  { slug: "kamloops", city: "Kamloops", region: "Thompson-Okanagan", blurb: "Reach a Punjabi-speaking RCC from Kamloops, entirely online." },
  { slug: "west-kelowna", city: "West Kelowna", region: "Okanagan", blurb: "Secure online therapy for West Kelowna and the Westside." },
  { slug: "salmon-arm", city: "Salmon Arm", region: "Shuswap", blurb: "Virtual counselling for Salmon Arm and the Shuswap." },

  // Northern / other BC
  { slug: "prince-george", city: "Prince George", region: "Northern BC", blurb: "Northern BC clients get full access to care with no travel." },
  { slug: "fort-st-john", city: "Fort St. John", region: "Northern BC", blurb: "Online therapy for the Peace region, wherever you are." },
  { slug: "cranbrook", city: "Cranbrook", region: "Kootenays", blurb: "Virtual counselling for Cranbrook and the East Kootenays." },
  { slug: "nelson", city: "Nelson", region: "Kootenays", blurb: "Secure online sessions for Nelson and the West Kootenays." },
  { slug: "prince-rupert", city: "Prince Rupert", region: "Northern BC", blurb: "Province-wide care reaches the North Coast, fully online." },
  { slug: "terrace", city: "Terrace", region: "Northern BC", blurb: "Online counselling for Terrace and the northwest." },
  { slug: "squamish", city: "Squamish", region: "Sea to Sky", blurb: "Virtual therapy for Squamish and the Sea to Sky corridor." },
  { slug: "whistler", city: "Whistler", region: "Sea to Sky", blurb: "Flexible online sessions for Whistler and Pemberton." },
  { slug: "powell-river", city: "Powell River", region: "Sunshine Coast", blurb: "Reach a Registered Clinical Counsellor from the Sunshine Coast." },
  { slug: "sechelt", city: "Sechelt", region: "Sunshine Coast", blurb: "Online counselling for Sechelt and Gibsons, no ferry required." },
  { slug: "fort-langley", city: "Fort Langley", region: "Fraser Valley", blurb: "Virtual sessions for Fort Langley and the Township." },
  { slug: "hope", city: "Hope", region: "Fraser Valley", blurb: "Online therapy for Hope and the upper Fraser Valley." },
];

export const getLocation = (slug: string) => locations.find((l) => l.slug === slug);
