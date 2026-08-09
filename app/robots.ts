import type { MetadataRoute } from 'next';
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
  // Common Crawl — a corpus several engines retrieve from
  'CCBot',
];

/* The sitemap lists canonical-domain URLs. Google only trusts a sitemap
 * reference on the same host as the URLs inside it, so the reference is emitted
 * only once this build is served from the canonical domain. Until DNS moves,
 * that domain still serves the previous site. */
export default function robots(): MetadataRoute.Robots {
  if (site.isPreview) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }

  const sameHost = site.deployOrigin === site.domain;

  // Generated social cards are images, not pages — keeping ~35 of them out of
  // the crawl leaves the budget for real content.
  const disallow = ['/*/opengraph-image', '/opengraph-image'];

  return {
    rules: [
      { userAgent: '*', allow: '/', disallow },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: '/', disallow })),
    ],
    ...(sameHost ? { sitemap: `${site.domain}/sitemap.xml` } : {}),
  };
}
