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
  /* The collection files import their halves relatively and without an
     extension ("./guides-more"), the same house style, so a test that reads
     lib/guides.ts needs the same guess made for those. Only inside this
     repository's own files: node_modules keeps Node's rules (1 Oct 2026). */
  if (/^\.\.?\//.test(specifier) && !/\.[a-z]+$/i.test(specifier) && context.parentURL?.startsWith(ROOT) && !context.parentURL.includes('/node_modules/')) {
    return next(`${specifier}.ts`, context);
  }
  return next(specifier, context);
}
