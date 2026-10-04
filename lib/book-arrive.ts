/* The two pure halves of components/BookArrive.tsx, apart so the server can
 * compute the detail and a test can run both under plain node. No roster
 * import: /book passes the slug it has already resolved (3 Oct 2026). */

/** What /book passes: the roster slug its ?with= named, or `none`. */
export function arriveDetailFor(slug: string | undefined | null): string {
  return slug ? slug : 'none';
}

/** The detail sent: `ask` for a bare /book opened at the ask-for-a-time
 *  form, otherwise what the server passed. */
export function arriveDetail(serverDetail: string, hash: string): string {
  return serverDetail === 'none' && hash === '#ask-for-a-time' ? 'ask' : serverDetail;
}

/** The sessionStorage key that marks this arrival as counted. */
export const arriveSeenKey = (detail: string) => `wp-arrive:${detail}`;
