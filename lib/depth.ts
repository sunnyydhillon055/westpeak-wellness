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
import { depth2Guides } from './depth2-guides';
import { depth2Guides2 } from './depth2-guides2';
import { depth2Other } from './depth2-other';
import { depth3 } from './depth3';

const PASSES: Record<string, DepthSection[]>[] = [
  depthGuides, depthGuides2, depthServices, depthOther,
  depth2Guides, depth2Guides2, depth2Other,
  depth3,
];

/* Later passes append to earlier ones rather than replacing them. */
export const extraSections: Record<string, DepthSection[]> = PASSES.reduce(
  (acc, pass) => {
    for (const [key, sections] of Object.entries(pass)) {
      acc[key] = [...(acc[key] ?? []), ...sections];
    }
    return acc;
  },
  {} as Record<string, DepthSection[]>
);

export const getExtra = (area: string, slug: string): DepthSection[] =>
  extraSections[`${area}/${slug}`] ?? [];
