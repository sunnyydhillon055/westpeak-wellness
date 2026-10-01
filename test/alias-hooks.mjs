/* The resolve hook itself. See test/resolve-alias.mjs for why this exists. */
import { pathToFileURL } from 'node:url';

const ROOT = pathToFileURL(process.cwd() + '/').href;

/* Add .ts when there is no extension. Node's type stripping resolves real
   files; it does not guess extensions the way a bundler does. */
const withExt = (p) => (/\.[a-z]+$/i.test(p) ? p : `${p}.ts`);

export async function resolve(specifier, context, next) {
  if (specifier.startsWith('@/')) {
    return next(ROOT + withExt(specifier.slice(2)), context);
  }
  /* The same for a relative import, 1 Oct 2026. lib/audiences.ts gathers its
     nine files as './audiences-more' and so on, which Next resolves and Node
     does not, so no test could load the audience data until now. Only the
     specifier changes; Node still resolves it against the importing file. */
  if (specifier.startsWith('./') || specifier.startsWith('../')) {
    return next(withExt(specifier), context);
  }
  return next(specifier, context);
}
