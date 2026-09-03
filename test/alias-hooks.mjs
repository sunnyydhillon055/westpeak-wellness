/* The resolve hook itself. See test/resolve-alias.mjs for why this exists. */
import { pathToFileURL } from 'node:url';

const ROOT = pathToFileURL(process.cwd() + '/').href;

export async function resolve(specifier, context, next) {
  if (specifier.startsWith('@/')) {
    const rest = specifier.slice(2);
    /* Add .ts when there is no extension. Node's type stripping resolves real
       files; it does not guess extensions the way a bundler does. */
    const withExt = /\.[a-z]+$/i.test(rest) ? rest : `${rest}.ts`;
    return next(ROOT + withExt, context);
  }
  return next(specifier, context);
}
