/* Additional page sections, kept out of the main content files.
 *
 * Every content page carries one or more further sections appended after its
 * main body. They live here rather than inside lib/guides.ts and friends purely
 * so those files stay readable — the sections are page-specific prose, not a
 * template, which is what keeps the duplication measurement honest.
 *
 * Keys are `"<area>/<slug>"`, e.g. "guides/high-functioning-anxiety".
 */

export type DepthSection = {
  h2: string;
  body?: string[];
  list?: { label: string; detail: string }[];
};

import { depthGuides } from './depth-guides';
import { depthGuides2 } from './depth-guides2';
import { depthServices } from './depth-services';
import { depthOther } from './depth-other';

export const extraSections: Record<string, DepthSection[]> = {
  ...depthGuides,
  ...depthGuides2,
  ...depthServices,
  ...depthOther,
};

export const getExtra = (area: string, slug: string): DepthSection[] =>
  extraSections[`${area}/${slug}`] ?? [];
