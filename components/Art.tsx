/* DECORATIVE ARTWORK FROM THE OCTOBER PACKAGE — 15 Oct 2026.
 *
 * Eight abstract SVGs and four AI-generated, people-free photographs came in
 * the Westpeak SEO package. Only the shapes were kept: every SVG in
 * public/img/art/ was redrawn in this site's own token values (the package's
 * evergreen, sage and terracotta are not used anywhere), so palette-guard
 * holds them to the palette like every other file.
 *
 * Everything here is decoration. The <img> carries alt="" and nothing on the
 * page depends on it: where a picture echoes information (the booking steps),
 * the information is in HTML beside it. No photograph here is captioned or
 * described as a place, an office or a session; provenance is recorded in
 * docs/IMAGE_PROVENANCE.md.
 *
 * Plain <img>, not next/image: these are server-rendered, need no client
 * code, and always carry their intrinsic width and height so the box is
 * reserved before the file arrives. All lazy: none of them is a page's LCP. */

const SVG = {
  'band-rings': [960, 240],
  'band-leaf': [960, 240],
  'band-topo': [960, 240],
  'band-circles': [960, 240],
  'band-language': [960, 240],
  steps: [960, 150],
  mountains: [960, 500],
  'language-ink': [660, 200],
  wave: [960, 150],
} as const;

export type ArtName = keyof typeof SVG;

/** One small consistent accent per service, shared by the home cards, the
 *  services hub and the service page's own aside, so a service looks the
 *  same wherever it appears. */
const SERVICE_ART: Record<string, ArtName> = {
  'individual-therapy': 'band-leaf',
  'couples-therapy': 'band-rings',
  'emdr-therapy': 'band-topo',
  'family-counselling': 'band-circles',
  'punjabi-counselling': 'band-language',
  'tagalog-counselling': 'band-language',
};
export const serviceArt = (slug: string): ArtName => SERVICE_ART[slug] ?? 'band-leaf';

export default function Art({ name, className }: { name: ArtName; className?: string }) {
  const [width, height] = SVG[name];
  return (
    <img
      className={className}
      src={`/img/art/${name}.svg`}
      alt=""
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
    />
  );
}

/** Numbered steps drawn as a line of three circles, with the steps themselves
 *  in an ordered list underneath: the picture is decoration, the list is what
 *  a screen reader and a search engine read. Exactly three steps, because the
 *  drawing has three circles. */
export function StepsArt({ steps }: { steps: readonly [string, string, string] }) {
  return (
    <div className="steps-art">
      <Art name="steps" />
      <ol>
        {steps.map((s) => <li key={s}>{s}</li>)}
      </ol>
    </div>
  );
}

/* The source files are about 765px wide, so the largest variant is the
   original and nothing is upscaled. */
const PHOTOS = {
  'coast-morning': { widths: [480, 763], height: 509 },
  'still-water-stones': { widths: [480, 765], height: 509 },
  'quiet-nook': { widths: [240, 406], height: 508 },
} as const;

export type ArtPhotoName = keyof typeof PHOTOS;

/** A decorative photograph in the site's photo treatment (.photo: the warm
 *  veil and grain). The aspect ratio comes from the class passed in. */
export function ArtPhoto({ name, sizes, className }: { name: ArtPhotoName; sizes: string; className?: string }) {
  const p = PHOTOS[name];
  const largest = p.widths[p.widths.length - 1];
  const src = (w: number) => `/img/photo/ai/${name}-${w}.webp`;
  return (
    <div className={`photo${className ? ` ${className}` : ''}`}>
      <img
        src={src(largest)}
        srcSet={p.widths.map((w) => `${src(w)} ${w}w`).join(', ')}
        sizes={sizes}
        alt=""
        width={largest}
        height={p.height}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
