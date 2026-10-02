/* The pure parts of scripts/a11y-audit.mjs, split out 1 Oct 2026 so that
 * test/a11y-rules.test.mts can pin them without a build or a server. The
 * audit itself imports these; nothing here reads a file or opens a port. */

/* A page rendered on request arrives STREAMED: each Suspense boundary is
   sent first as its fallback, `<!--$?--><template id="B:n"></template>
   ...<!--/$-->`, and its content later as `<div hidden id="S:m">...</div>`
   followed by a script calling $RC("B:n","S:m") to swap them. The browser
   runs that script; the audit does not, so it does the swap itself before
   judging, or /book would be judged on its loading skeleton (no h1). */
export function resolveStreamed(doc) {
  let html = doc;
  for (let pass = 0; pass < 50; pass++) {
    const call = html.match(/\$RC\("(B:\d+)","(S:\d+)"\)/);
    if (!call) break;
    const [whole, b, sId] = call;
    const at = html.indexOf(whole);
    const open = `<div hidden id="${sId}">`;
    const start = html.lastIndexOf(open, at);
    const end = html.lastIndexOf('</div><script>', at);
    const found = start >= 0 && end > start;
    const content = found ? html.slice(start + open.length, end) : '';
    /* Drop this call, and the segment it carried, from the tail. */
    html = html.slice(0, at) + html.slice(at + whole.length);
    if (found) html = html.slice(0, start) + html.slice(end + '</div>'.length);
    const tpl = `<template id="${b}"></template>`;
    const t = html.indexOf(tpl);
    if (t < 0) continue;
    const from = html.lastIndexOf('<!--$?-->', t);
    const close = html.indexOf('<!--/$-->', t);
    if (from < 0 || close < 0) continue;
    html = html.slice(0, from) + content + html.slice(close + '<!--/$-->'.length);
  }
  return html;
}

/** Frames with no title, or an empty one. A screen reader announces a frame
 *  by its title; without one it says "frame" and nothing else. */
export function untitledFrames(html) {
  return (html.match(/<iframe\b[^>]*>/gi) || []).filter((fr) => {
    const t = (fr.match(/\btitle\s*=\s*["']([^"']*)["']/i) || [])[1];
    return !t || !t.trim();
  });
}

/** The names of target=_blank links whose name does not say "new tab". The
 *  name is aria-label if present, else the text, with an image's alt text
 *  counted as text. */
export function silentNewTabs(html) {
  const out = [];
  for (const m of html.matchAll(/<a\b([^>]*\btarget\s*=\s*["']_blank["'][^>]*)>([\s\S]*?)<\/a>/gi)) {
    const label = (m[1].match(/\baria-label\s*=\s*["']([^"']*)["']/i) || [])[1] || '';
    const text = m[2].replace(/<img\b[^>]*\balt\s*=\s*["']([^"']*)["'][^>]*>/gi, ' $1 ')
      .replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (!/new tab/i.test(label + ' ' + text)) out.push(label || text);
  }
  return out;
}
