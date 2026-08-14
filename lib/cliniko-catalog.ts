import { put, get } from '@vercel/blob';
import { api, headers } from '@/lib/cliniko';

/* The service catalogue — names, durations and prices — with Cliniko as the
 * source of truth.
 *
 * WHY THIS EXISTS
 *
 * Fees were written in three places: the /pricing table, the FEE_FOR map on
 * service pages, and a comment in lib/site.ts. An audit on 2026-08-14 found all
 * three agreeing with Cliniko exactly — $140 / $170 / $0 / $340 / $190 — which
 * is the good outcome, but it is agreement by coincidence rather than by
 * construction. Nothing stopped them drifting, and the failure mode is the
 * worst kind: the site quotes a price the practice does not charge, nobody
 * notices because nothing errors, and a client arrives at checkout expecting a
 * different number.
 *
 * Prices in Cliniko are not on the appointment type. They live on a billable
 * item, reached through appointment_type_billable_items. Three requests deep,
 * which is why this is cached rather than read per render.
 *
 * FALLBACK IS NOT OPTIONAL. If Cliniko is unreachable, the site must still show
 * correct prices — a pricing page that renders blank or throws is worse than a
 * slightly stale one. site.ts keeps the known-good values and they are used
 * whenever the cache is empty or the fetch fails. The cached copy carries the
 * time it was taken so staleness is visible rather than assumed.
 */

const KEY = 'portal/catalog.json';

export type CatalogItem = {
  id: string;
  name: string;
  minutes: number;
  /** Integer cents. Money is never a float — see lib/cliniko-revenue.ts. */
  cents: number;
  onlineBookable: boolean;
};

export type Catalog = {
  items: CatalogItem[];
  fetchedAt: string;
  /** True when these came from Cliniko; false when they are the fallback. */
  live: boolean;
};

/* The values verified against Cliniko on 2026-08-14. Used when the cache is
 * cold or Cliniko cannot be reached. Keep in step with lib/site.ts. */
const FALLBACK: Catalog = {
  items: [
    { id: '2013349744314681520', name: 'Initial Consultation', minutes: 15, cents: 0, onlineBookable: true },
    { id: '1466854657459489533', name: 'Individual Counselling', minutes: 50, cents: 14000, onlineBookable: true },
    { id: '1909558292636502700', name: 'Couples Counselling', minutes: 50, cents: 17000, onlineBookable: true },
    { id: '2013350310713493681', name: 'Couples Extended', minutes: 110, cents: 34000, onlineBookable: true },
    { id: '2013356655093221554', name: 'EMDR Intensive', minutes: 90, cents: 19000, onlineBookable: true },
  ],
  fetchedAt: '',
  live: false,
};

export const money = (cents: number) =>
  cents === 0 ? 'Free' : `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;

let cache: { at: number; value: Catalog } | null = null;
const CACHE_MS = 60_000;

export async function readCatalog(): Promise<Catalog> {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.value;
  if (!process.env.BLOB_READ_WRITE_TOKEN) return FALLBACK;
  try {
    const hit = await get(KEY, { access: 'private' });
    if (!hit || hit.statusCode !== 200 || !hit.stream) return FALLBACK;
    const value = (await new Response(hit.stream).json()) as Catalog;
    if (!Array.isArray(value.items) || value.items.length === 0) return FALLBACK;
    cache = { at: Date.now(), value };
    return value;
  } catch {
    return FALLBACK;
  }
}

async function json(url: string, key: string) {
  const res = await fetch(url, { headers: headers(key), cache: 'no-store' });
  if (!res.ok) throw new Error(`Cliniko HTTP ${res.status}`);
  return res.json();
}

/** Cliniko -> Blob. Called by the nightly cron; safe to call by hand. */
export async function refreshCatalog(): Promise<
  { ok: true; catalog: Catalog; changed: boolean } | { ok: false; reason: string }
> {
  const conn = api();
  if (!conn) return { ok: false, reason: 'CLINIKO_API_KEY is not set on this deployment' };

  let items: CatalogItem[];
  try {
    const at = await json(
      `https://api.${conn.shard}.cliniko.com/v1/appointment_types?per_page=100`,
      conn.key
    );

    items = [];
    for (const t of at.appointment_types ?? []) {
      if (t.archived_at) continue;

      /* Walk to the billable item for the price. Any step may be absent — an
       * appointment type with no billable item is legitimate — so a missing
       * price becomes 0 rather than throwing and losing the whole catalogue. */
      let cents = 0;
      try {
        const relUrl = t.appointment_type_billable_items?.links?.self;
        if (relUrl) {
          const rel = await json(relUrl, conn.key);
          const first = (rel.appointment_type_billable_items ?? [])[0];
          const itemUrl = first?.billable_item?.links?.self;
          if (itemUrl) {
            const item = await json(itemUrl, conn.key);
            cents = Math.round(Number(item.price ?? 0) * 100);
          }
        }
      } catch {
        // Leave at 0 and let the drift check surface it.
      }

      items.push({
        id: String(t.id),
        name: String(t.name ?? '').trim(),
        minutes: Number(t.duration_in_minutes ?? 0),
        cents,
        onlineBookable: t.show_in_online_bookings !== false,
      });
    }
  } catch (e) {
    return { ok: false, reason: e instanceof Error ? e.message : 'request failed' };
  }

  if (items.length === 0) {
    /* Never overwrite a good catalogue with an empty one. An API change that
     * returned nothing would otherwise wipe every price on the site. */
    return { ok: false, reason: 'Cliniko returned no appointment types — refusing to overwrite' };
  }

  const previous = await readCatalog();
  const key = (c: Catalog) =>
    c.items.map((i) => `${i.id}:${i.name}:${i.minutes}:${i.cents}`).sort().join('|');
  const changed = key(previous) !== key({ items, fetchedAt: '', live: true });

  const catalog: Catalog = { items, fetchedAt: new Date().toISOString(), live: true };
  await put(KEY, JSON.stringify(catalog, null, 2), {
    access: 'private',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  });
  cache = { at: Date.now(), value: catalog };
  return { ok: true, catalog, changed };
}

/** Look up by Cliniko appointment-type id. */
export const catalogItem = (c: Catalog, id: string) => c.items.find((i) => i.id === id);
