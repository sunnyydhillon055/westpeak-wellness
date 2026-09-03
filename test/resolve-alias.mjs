/* Teach Node the "@/" alias so tests can import the real modules.
 *
 * WHY A HOOK RATHER THAN REWRITING THE IMPORTS
 *
 * lib/ contains 78 imports written as "@/lib/x". That alias is a tsconfig path
 * mapping — Next and tsc resolve it, plain Node does not. Converting all 78 to
 * relative paths would be a large diff across files that are otherwise correct,
 * made purely for the convenience of the test runner, and it would have to be
 * defended every time somebody added an import in the house style.
 *
 * A few lines here instead, and the source stays as it is.
 *
 * Registered with:  node --import ./test/resolve-alias.mjs --test ...
 */
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

register('./alias-hooks.mjs', pathToFileURL(import.meta.filename));
