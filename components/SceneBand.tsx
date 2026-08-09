const SCENES = ['mist', 'dawn', 'deep', 'sand', 'still', 'dusk'] as const;

/* A slim atmospheric band, used to break long reading columns.
 *
 * Rendered as a CSS background rather than an <img>, because it is purely
 * decorative: it carries no information that is not already in the text, so it
 * should not be in the accessibility tree or the document outline at all. An
 * <img alt=""> would be the next best thing, but a background removes the
 * question entirely — and it stops 75 empty-alt images showing up in an audit
 * and masking a real one.
 *
 * The scene is chosen from the page's own slug rather than at random, so a page
 * always looks the same — a header that changed on every reload reads as a bug —
 * while neighbouring pages differ.
 *
 * Original artwork rather than stock photography, deliberately. Licence
 * provenance for stock cannot be verified from inside a build; therapy stock is
 * a recognisable genre that reads as decoration; and a 300 KB photograph on
 * every one of a hundred pages costs exactly the performance a visual review
 * also asks to protect. These are ~1.4 KB and resolution-independent.
 */
export default function SceneBand({ seed, className }: { seed: string; className?: string }) {
  let n = 0;
  for (let i = 0; i < seed.length; i++) n = (n * 31 + seed.charCodeAt(i)) >>> 0;
  const scene = SCENES[n % SCENES.length];

  return (
    <div
      className={`scene-band${className ? ` ${className}` : ''}`}
      role="presentation"
      style={{ backgroundImage: `url(/img/scene/${scene}.svg)` }}
    />
  );
}
