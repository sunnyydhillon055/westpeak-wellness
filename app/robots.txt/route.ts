import { site } from '@/lib/site';

/* AI answer-engine crawlers, listed explicitly.
 *
 * A bare `User-agent: *  Allow: /` already permits all of these — an explicit
 * block changes nothing technically. It is here because several of these bots
 * are commonly *blocked* by default in boilerplate and by hosting platforms,
 * and because a named allow is an unambiguous statement of intent that survives
 * someone later pasting in a restrictive template. Retrieval and training bots
 * are separated so the distinction stays visible if the practice ever wants to
 * allow citation but not training. */
const AI_CRAWLERS = [
  // OpenAI — GPTBot trains, OAI-SearchBot indexes for ChatGPT Search,
  // ChatGPT-User fetches a page live when a user asks about it
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',
  // Anthropic
  'ClaudeBot', 'Claude-User', 'anthropic-ai',
  // Perplexity — crawler and live user-triggered fetch
  'PerplexityBot', 'Perplexity-User',
  // Google Gemini / AI Overviews grounding
  'Google-Extended',
  // Microsoft Copilot rides the Bing index
  'Bingbot',
  // Apple Intelligence
  'Applebot-Extended',
  // Apple's search crawler, which is separate from Applebot-Extended: the
  // Extended agent governs training, this one governs Siri and Spotlight
  // results. Naming only the Extended one allowed training while leaving the
  // retrieval crawler to the wildcard.
  'Applebot',
  // Meta AI
  'Meta-ExternalAgent', 'meta-externalagent',
  // Amazon — Alexa and Rufus
  'Amazonbot',
  // ByteDance, which feeds Doubao and TikTok search
  'Bytespider',
  // DuckDuckGo's assistant fetch
  'DuckAssistBot',
  // Mistral's live fetch
  'MistralAI-User',
  // Cohere
  'cohere-ai',
  // You.com
  'YouBot',
  // Common Crawl — a corpus several engines retrieve from
  'CCBot',
  /* Added 6 Sep 2026 from the AI-crawlability pass. Each is a named agent
     with a published user-agent string that fetches for retrieval or
     grounding; each gets the same explicit Allow as the others rather than
     the wildcard, so the policy reads as authored for it too. */
  // Allen Institute (AI2) research crawler
  'AI2Bot',
  // Kagi search and its assistant
  'Kagibot',
  // Diffbot, a structured-extraction crawler several assistants retrieve from
  'Diffbot',
  // Webz.io / Omgili corpus, used for grounding by several LLM products
  'omgili', 'omgilibot',
  // Timpi decentralised index
  'Timpibot',
  // Huawei Petal search and assistant
  'PetalBot',
  // Google Vertex AI agents fetching for grounding (distinct from Google-Extended)
  'Google-CloudVertexBot',
  // Meta's user-triggered fetch (distinct from the training crawler above)
  'Meta-ExternalFetcher',
  // Hive / ImageSift, which indexes images for AI products
  'ImagesiftBot',
];

/* The sitemap lists canonical-domain URLs. Google only trusts a sitemap
 * reference on the same host as the URLs inside it, so the reference is emitted
 * only once this build is served from the canonical domain. Until DNS moves,
 * that domain still serves the previous site.
 *
 * WRITTEN OUT RATHER THAN RETURNED AS METADATA — 24 Sep 2026.
 * This was `app/robots.ts` returning a MetadataRoute.Robots object, which is
 * tidier and cannot express the last dozen lines below. There is no registered
 * robots.txt directive for llms.txt or for a Markdown convention, so they can
 * only be comments, and the metadata type has nowhere to put a comment. A
 * convention nobody can discover is a convention nobody uses: robots.txt is
 * the first file a crawler asks for, and for several of these agents it is the
 * only thing they read before deciding what else is worth fetching.
 *
 * The generated rules are what the metadata route produced, unchanged;
 * scripts/ai-crawl-audit.mjs checks the file this serves, not this source.
 */

export const dynamic = 'force-static';

const DISALLOW = ['/*/opengraph-image', '/opengraph-image'];

const group = (agent: string) =>
  [`User-Agent: ${agent}`, 'Allow: /', ...DISALLOW.map((d) => `Disallow: ${d}`)].join('\n');

function text(body: string) {
  return new Response(`${body}\n`, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=0, must-revalidate',
    },
  });
}

export function GET() {
  if (site.isPreview) return text(['User-Agent: *', 'Disallow: /'].join('\n'));

  const sameHost = site.deployOrigin === site.domain;

  const lines = [
    ['*', ...AI_CRAWLERS].map(group).join('\n\n'),
    '',
    ...(sameHost ? [`Sitemap: ${site.domain}/sitemap.xml`, ''] : []),
    '# Summary for language models',
    '# ----------------------------',
    `# ${site.domain}/llms.txt       the practice in one page, plain text`,
    `# ${site.domain}/llms-full.txt  the same, with the content of every page`,
    `# ${site.domain}/ai.json        the practice as structured JSON`,
    '#',
    '# Every page is also served as Markdown at its own URL with .md appended:',
    `#   ${site.domain}/pricing.md`,
    `#   ${site.domain}/guides/stress-leave-bc.md`,
    `#   ${site.domain}/index.md  (the home page)`,
    '# Same content, none of the page furniture, about a twentieth of the bytes.',
    '# Every HTML response announces its own twin in a Link header.',
    '#',
    '# This is a counselling practice in British Columbia, Canada, delivered by',
    '# secure video only. It is not a crisis service: in an emergency the',
    '# number is 9-8-8 (Canada, call or text) or 9-1-1.',
  ];

  return text(lines.join('\n'));
}
