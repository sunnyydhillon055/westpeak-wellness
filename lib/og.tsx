/* Shared Open Graph / social card renderer.
 *
 * Every route gets a generated 1200x630 PNG built at compile time, so any link
 * shared to iMessage, WhatsApp, LinkedIn, Facebook, Slack or a Google Discover
 * card renders with branded art instead of a blank rectangle.
 *
 * HARD RULE: the counsellor's personal name never appears in these images.
 * They carry the practice name and the credential only.
 */
import { ImageResponse } from 'next/og';

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';
export const OG_ALT = 'Westpeak Wellness, online counselling across British Columbia';

/* Repainted 30 August 2026 to the oatmeal-cream palette. These are duplicated
   from app/globals.css rather than imported, because this file runs on the
   edge runtime and never sees the stylesheet — so if the palette moves again,
   it moves here too. Kept in the same order as the tokens they mirror. */
const INK = '#2b3138';        /* --ink */
const INK_SOFT = '#545e69';   /* --ink-soft */
const BLUE = '#7ba7cb';       /* --blue */
const BLUE_DEEP = '#3d6c92';  /* --blue-deep */
const BG = '#faf7f1';         /* --bg, oatmeal cream */
const LINE = '#e6ddce';       /* --line */

/** Title sizing steps down as the headline gets longer so it never overflows. */
function titleSize(title: string) {
  if (title.length <= 28) return 82;
  if (title.length <= 44) return 70;
  if (title.length <= 62) return 60;
  if (title.length <= 84) return 52;
  return 44;
}

/* THE PHOTOGRAPH — 6 Sep 2026.
   Every card was typographic: cream ground, two soft circles, the title. It
   read as a document rather than a place. The right-hand 46% now carries the
   same still-water photograph the homepage opens on, faded into the cream so
   the title stays on a plain ground and the contrast the a11y audit measures
   is untouched. Fetched once per isolate and cached as a data URL; the file
   is bundled with the route, so no network call leaves the edge at render. */
let photoCache: Promise<string> | undefined;
function photo(): Promise<string> {
  if (!photoCache) {
    photoCache = fetch(new URL('../public/img/photo/still-water-bc.jpg', import.meta.url))
      .then((r) => r.arrayBuffer())
      .then((buf) => {
        const bytes = new Uint8Array(buf);
        let bin = '';
        for (let i = 0; i < bytes.length; i += 0x8000) {
          bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
        }
        return `data:image/jpeg;base64,${btoa(bin)}`;
      });
  }
  return photoCache;
}

export async function ogImage({
  eyebrow,
  title,
  note = 'Registered Clinical Counsellors · English, Punjabi & Tagalog',
}: {
  eyebrow: string;
  title: string;
  note?: string;
}) {
  const src = await photo();
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: BG,
          padding: '68px 76px',
          position: 'relative',
        }}
      >
        {/* The photograph, right-hand side, faded into the cream on its left
            edge so the title sits on a plain ground. */}
        <img
          src={src}
          alt=""
          width={560}
          height={630}
          style={{ position: 'absolute', right: 0, top: 0, width: 560, height: 630, objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: 560,
            height: 630,
            display: 'flex',
            background: `linear-gradient(90deg, ${BG} 0%, rgba(250,247,241,0.96) 18%, rgba(250,247,241,0.55) 48%, rgba(250,247,241,0.12) 100%)`,
          }}
        />
        {/* Soft blue wash bottom-right */}
        <div
          style={{
            position: 'absolute',
            right: -180,
            bottom: -240,
            width: 720,
            height: 720,
            borderRadius: 720,
            background: '#e2edf4',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 40,
            top: -160,
            width: 380,
            height: 380,
            borderRadius: 380,
            background: '#f7f2e8',
            display: 'flex',
          }}
        />

        {/* Header row: peak mark + practice name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <rect x="0.5" y="0.5" width="43" height="43" rx="11" fill="#e2edf4" stroke={LINE} />
            <path d="M9 31.5 L18.5 15 L24 24 L27.5 18.5 L35 31.5 Z" fill={BLUE_DEEP} />
            <circle cx="30.5" cy="12.5" r="3.4" fill={BLUE} />
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 27, fontWeight: 700, color: INK, letterSpacing: -0.4 }}>
              Westpeak Wellness
            </div>
            <div style={{ fontSize: 16, color: INK_SOFT, letterSpacing: 0.2 }}>
              westpeakwellness.com
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 760 }}>
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: 3.4,
              textTransform: 'uppercase',
              color: BLUE_DEEP,
              marginBottom: 22,
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              fontSize: titleSize(title),
              fontWeight: 600,
              color: INK,
              lineHeight: 1.14,
              letterSpacing: -1.2,
            }}
          >
            {title}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', width: 132, height: 5, background: BLUE, borderRadius: 4, marginBottom: 20 }} />
          <div style={{ fontSize: 24, color: INK_SOFT, letterSpacing: -0.2 }}>{note}</div>
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}
