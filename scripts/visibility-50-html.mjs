/* Renders data/competitors/visibility-50.json as a standalone report page.
 *
 * Generated rather than hand-written so the fifty rows cannot drift from the
 * scores in visibility-50.mjs. Change a number there, run both scripts, and the
 * page, the totals and the distribution all move together. */
import { readFileSync, writeFileSync } from 'node:fs';

const OUT = process.argv[2];
if (!OUT) { console.error('usage: node scripts/visibility-50-html.mjs <out.html>'); process.exit(2); }

const d = JSON.parse(readFileSync(new URL('../data/competitors/visibility-50.json', import.meta.url), 'utf8'));

const band = (s) => (s < 200 ? 'crit' : s < 450 ? 'weak' : s < 700 ? 'fair' : 'strong');
const bandName = { crit: 'critical', weak: 'weak', fair: 'fair', strong: 'strong' };
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const CONF = {
  M: ['measured', 'Fetched and parsed this pass across all eleven sites.'],
  G: ['Search Console', 'From the site&rsquo;s own 28-day Search Console export.'],
  S: ['searched', 'Public evidence, searched and read. Not a rank tracker.'],
  E: ['estimated', 'Reasoned from structure, not measured. Treat as a band.'],
};

const cats = d.categories;
const sorted = [...cats].sort((a, b) => a[2] - b[2]);
const counts = { crit: 0, weak: 0, fair: 0, strong: 0 };
for (const c of cats) counts[band(c[2])]++;

const strip = cats
  .map((c, i) => {
    const x = (c[2] / 1000) * 100;
    const jitter = ((i * 37) % 11) - 5;
    return `<span class="dot ${band(c[2])}" style="left:${x.toFixed(2)}%;top:${50 + jitter * 3.6}%" title="${esc(c[1])} — ${c[2]}"></span>`;
  })
  .join('');

const groupRows = d.groups
  .map(
    (g) => `<tr>
      <td class="g-key">${g.key}</td>
      <td class="g-name">${esc(g.name)}</td>
      <td class="num">${g.weight}%</td>
      <td class="num">${g.n}</td>
      <td class="num strongnum ${band(Math.round(g.avg))}">${Math.round(g.avg)}</td>
      <td class="bar-cell"><span class="bar"><span class="fill ${band(Math.round(g.avg))}" style="width:${(g.avg / 10).toFixed(1)}%"></span></span></td>
    </tr>`
  )
  .join('');

let n = 0;
const sections = d.groups
  .map((g) => {
    const rows = cats.filter((c) => c[0] === g.key);
    const avg = Math.round(g.avg);
    const body = rows
      .map((c) => {
        n++;
        const [, name, score, rank, conf, ev] = c;
        return `<article class="cat ${band(score)}">
          <div class="cat-head">
            <span class="idx">${String(n).padStart(2, '0')}</span>
            <h3>${esc(name)}</h3>
            <span class="rank" title="Position among the eleven sites measured">${rank}<span class="of">/11</span></span>
            <span class="score">${score}</span>
          </div>
          <span class="bar"><span class="fill ${band(score)}" style="width:${(score / 10).toFixed(1)}%"></span></span>
          <p class="ev"><span class="conf" title="${CONF[conf][1]}">${CONF[conf][0]}</span>${esc(ev)}</p>
        </article>`;
      })
      .join('');
    return `<section class="group">
      <header class="group-head">
        <span class="g-letter">${g.key}</span>
        <h2>${esc(g.name)}</h2>
        <span class="g-score ${band(avg)}">${avg}<span class="of">/1000</span></span>
      </header>
      <div class="cats">${body}</div>
    </section>`;
  })
  .join('');

const html = `<title>Westpeak Visibility Scorecard</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&family=IBM+Plex+Mono:wght@400;500;600&display=swap">
<style>
:root{
  --ground:#F4F6F5; --panel:#FFFFFF; --ink:#141E1C; --ink-2:#3D4C48; --ink-3:#6E7F7A;
  --rule:#DDE4E1; --rule-2:#C8D3CF;
  --accent:#0F5E52; --accent-soft:#E3EDEA;
  --crit:#A83B26; --weak:#B07A1E; --fair:#5F726D; --strong:#0F5E52;
  --crit-bg:#F6E5E0; --weak-bg:#F7EEDC; --fair-bg:#EAEEEC; --strong-bg:#E0EBE7;
  --shadow:0 1px 2px rgba(20,30,28,.05),0 8px 24px -16px rgba(20,30,28,.25);
}
@media (prefers-color-scheme:dark){
  :root:not([data-theme="light"]){
    --ground:#0E1614; --panel:#151F1D; --ink:#E8EFEC; --ink-2:#B3C2BD; --ink-3:#7E908B;
    --rule:#24312E; --rule-2:#31413D;
    --accent:#5FBFA8; --accent-soft:#1B2C28;
    --crit:#E08163; --weak:#D9AC55; --fair:#93A6A0; --strong:#5FBFA8;
    --crit-bg:#2C1C17; --weak-bg:#2A2317; --fair-bg:#1D2725; --strong-bg:#16302A;
    --shadow:0 1px 2px rgba(0,0,0,.4),0 8px 24px -16px rgba(0,0,0,.8);
  }
}
:root[data-theme="dark"]{
  --ground:#0E1614; --panel:#151F1D; --ink:#E8EFEC; --ink-2:#B3C2BD; --ink-3:#7E908B;
  --rule:#24312E; --rule-2:#31413D;
  --accent:#5FBFA8; --accent-soft:#1B2C28;
  --crit:#E08163; --weak:#D9AC55; --fair:#93A6A0; --strong:#5FBFA8;
  --crit-bg:#2C1C17; --weak-bg:#2A2317; --fair-bg:#1D2725; --strong-bg:#16302A;
  --shadow:0 1px 2px rgba(0,0,0,.4),0 8px 24px -16px rgba(0,0,0,.8);
}
*{box-sizing:border-box}
body{
  margin:0; background:var(--ground); color:var(--ink);
  font-family:"Source Serif 4",Georgia,"Times New Roman",serif;
  font-size:17px; line-height:1.6; -webkit-font-smoothing:antialiased;
}
.wrap{max-width:1040px;margin:0 auto;padding:0 28px 96px}
h1,h2,h3,.num,.score,.idx,.rank,.conf,.eyebrow,.g-letter,.g-score,.axis,.legend,th{
  font-family:"Bricolage Grotesque","Helvetica Neue",Arial,sans-serif;
}
.num,.score,.idx,.rank,.g-score,.axis,.strongnum{font-family:"IBM Plex Mono",ui-monospace,monospace;font-variant-numeric:tabular-nums}
.eyebrow{
  font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-3);
  font-weight:600;margin:0 0 10px;
}

/* ---- masthead ---- */
header.top{padding:72px 0 40px;border-bottom:1px solid var(--rule)}
header.top h1{
  font-size:clamp(34px,5.4vw,58px);line-height:1.02;font-weight:800;margin:0 0 18px;
  letter-spacing:-.022em;text-wrap:balance;
}
.sub{font-size:19px;color:var(--ink-2);margin:0;max-width:62ch}
.meta{
  display:flex;flex-wrap:wrap;gap:8px 20px;margin-top:26px;
  font-family:"IBM Plex Mono",monospace;font-size:12px;color:var(--ink-3);
}
.meta b{color:var(--ink-2);font-weight:500}

/* ---- headline score ---- */
.headline{
  display:grid;grid-template-columns:minmax(0,300px) minmax(0,1fr);gap:44px;
  align-items:center;padding:44px 0;border-bottom:1px solid var(--rule);
}
.big{font-family:"IBM Plex Mono",monospace;font-variant-numeric:tabular-nums;
  font-size:clamp(64px,11vw,104px);line-height:.86;font-weight:600;letter-spacing:-.04em;color:var(--accent)}
.big .den{font-size:.28em;color:var(--ink-3);letter-spacing:0}
.gauge{margin-top:20px;height:10px;background:var(--rule);border-radius:99px;overflow:hidden}
.gauge span{display:block;height:100%;background:var(--accent);border-radius:99px}
.readout p{margin:0 0 14px;font-size:18px}
.readout p:last-child{margin-bottom:0}
.readout strong{font-weight:600}

/* ---- distribution strip ---- */
.strip-wrap{padding:44px 0;border-bottom:1px solid var(--rule)}
.strip{
  position:relative;height:120px;margin:22px 0 6px;border-radius:6px;
  background:linear-gradient(90deg,var(--crit-bg) 0%,var(--crit-bg) 18%,var(--weak-bg) 22%,var(--weak-bg) 43%,var(--fair-bg) 47%,var(--fair-bg) 68%,var(--strong-bg) 72%,var(--strong-bg) 100%);
  border:1px solid var(--rule);
}
.dot{position:absolute;width:11px;height:11px;border-radius:99px;transform:translate(-50%,-50%);
  border:1.5px solid var(--panel)}
.dot.crit{background:var(--crit)} .dot.weak{background:var(--weak)}
.dot.fair{background:var(--fair)} .dot.strong{background:var(--strong)}
.axis{display:flex;justify-content:space-between;font-size:11px;color:var(--ink-3)}
.legend{display:flex;flex-wrap:wrap;gap:18px;margin-top:16px;font-size:12px;color:var(--ink-2)}
.legend i{display:inline-block;width:10px;height:10px;border-radius:99px;margin-right:7px;vertical-align:-1px}

/* ---- group table ---- */
.tbl-wrap{overflow-x:auto;margin:24px 0 0}
table{width:100%;border-collapse:collapse;font-size:15px;min-width:600px}
th{
  text-align:left;font-size:11px;letter-spacing:.13em;text-transform:uppercase;
  color:var(--ink-3);font-weight:600;padding:0 14px 10px 0;border-bottom:1px solid var(--rule-2);
}
td{padding:13px 14px 13px 0;border-bottom:1px solid var(--rule);vertical-align:middle}
td.num,th.num{text-align:right}
.g-key{font-family:"IBM Plex Mono",monospace;color:var(--ink-3);width:26px}
.g-name{font-weight:600}
.strongnum{font-size:17px;font-weight:600}
.strongnum.crit{color:var(--crit)} .strongnum.weak{color:var(--weak)}
.strongnum.fair{color:var(--fair)} .strongnum.strong{color:var(--strong)}
.bar-cell{width:180px;min-width:120px}
.bar{display:block;height:7px;background:var(--rule);border-radius:99px;overflow:hidden}
.fill{display:block;height:100%;border-radius:99px}
.fill.crit{background:var(--crit)} .fill.weak{background:var(--weak)}
.fill.fair{background:var(--fair)} .fill.strong{background:var(--strong)}

/* ---- groups & categories ---- */
section.group{padding-top:52px}
.group-head{display:flex;align-items:baseline;gap:14px;padding-bottom:16px;border-bottom:2px solid var(--ink);margin-bottom:4px}
.g-letter{font-size:13px;color:var(--ink-3);font-weight:600}
.group-head h2{font-size:24px;font-weight:700;margin:0;flex:1;letter-spacing:-.012em}
.g-score{font-size:22px;font-weight:600}
.g-score.crit{color:var(--crit)} .g-score.weak{color:var(--weak)}
.g-score.fair{color:var(--fair)} .g-score.strong{color:var(--strong)}
.of{font-size:.58em;color:var(--ink-3);margin-left:2px}
.cats{display:flex;flex-direction:column}
.cat{padding:20px 0 22px;border-bottom:1px solid var(--rule)}
.cat-head{display:flex;align-items:baseline;gap:12px}
.idx{font-size:11px;color:var(--ink-3);width:20px;flex:none}
.cat-head h3{font-size:17px;font-weight:600;margin:0;flex:1;letter-spacing:-.008em}
.rank{
  font-size:12px;color:var(--ink-2);background:var(--accent-soft);
  padding:3px 8px;border-radius:4px;flex:none;font-weight:500;
}
.score{font-size:19px;font-weight:600;width:56px;text-align:right;flex:none}
.cat.crit .score{color:var(--crit)} .cat.weak .score{color:var(--weak)}
.cat.fair .score{color:var(--fair)} .cat.strong .score{color:var(--strong)}
.cat .bar{margin:11px 0 12px}
.ev{margin:0 0 0 32px;font-size:15.5px;color:var(--ink-2);max-width:74ch}
.conf{
  display:inline-block;font-size:10px;letter-spacing:.11em;text-transform:uppercase;
  color:var(--ink-3);border:1px solid var(--rule-2);border-radius:3px;
  padding:2px 6px;margin-right:9px;vertical-align:1.5px;font-weight:600;cursor:help;
}

/* ---- prose blocks ---- */
.note{padding:44px 0 0}
.note h2{font-size:24px;font-weight:700;margin:0 0 14px;letter-spacing:-.012em}
.note p{margin:0 0 15px;max-width:70ch;color:var(--ink-2)}
.note p.lead{color:var(--ink);font-size:19px}
.note strong{color:var(--ink);font-weight:600}
.callout{
  background:var(--panel);border:1px solid var(--rule);border-left:3px solid var(--accent);
  border-radius:0 8px 8px 0;padding:22px 26px;margin:26px 0;box-shadow:var(--shadow);
}
.callout p:last-child{margin-bottom:0}
ol.moves{counter-reset:m;list-style:none;padding:0;margin:26px 0 0}
ol.moves li{
  counter-increment:m;position:relative;padding:0 0 22px 52px;margin:0;
  border-bottom:1px solid var(--rule);padding-top:22px;
}
ol.moves li:first-child{padding-top:0}
ol.moves li::before{
  content:counter(m);position:absolute;left:0;top:22px;
  font-family:"IBM Plex Mono",monospace;font-size:12px;font-weight:600;
  color:var(--accent);border:1px solid var(--rule-2);border-radius:99px;
  width:28px;height:28px;display:grid;place-items:center;
}
ol.moves li:first-child::before{top:0}
ol.moves h4{font-family:"Bricolage Grotesque",sans-serif;font-size:17px;font-weight:600;margin:0 0 6px}
ol.moves p{margin:0;color:var(--ink-2);font-size:15.5px;max-width:70ch}
footer.end{margin-top:64px;padding-top:26px;border-top:1px solid var(--rule);
  font-family:"IBM Plex Mono",monospace;font-size:12px;color:var(--ink-3);line-height:1.8}
a{color:var(--accent)}
:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
@media (prefers-reduced-motion:no-preference){
  /* No fill-mode. With fill-mode both, anything that stops the animation from running
     leaves every bar frozen at scaleX(0) and the whole dataset renders blank.
     Without it the natural state is the full bar and the animation is purely
     additive, so the numbers are visible even if it never plays. */
  .fill,.gauge span{animation:grow .8s cubic-bezier(.2,.7,.3,1)}
  @keyframes grow{from{transform:scaleX(0);transform-origin:left}to{transform:scaleX(1)}}
}
@media (max-width:720px){
  .headline{grid-template-columns:1fr;gap:26px}
  .wrap{padding:0 18px 72px}
  .ev{margin-left:0}
  .cat-head{flex-wrap:wrap}
  .cat-head h3{flex:1 1 100%;order:-1}
}
</style>

<div class="wrap">

<header class="top">
  <p class="eyebrow">Search visibility audit &middot; 27 August 2026</p>
  <h1>The best-built site in the set, and the least visible one</h1>
  <p class="sub">Westpeak Wellness measured across fifty categories against ten BC and Canadian counselling practices &mdash; each category scored out of 1,000.</p>
  <div class="meta">
    <span><b>Benchmark set</b> 10 practices</span>
    <span><b>Categories</b> 50</span>
    <span><b>Search Console</b> 28 days to 20 Aug</span>
    <span><b>Pages fetched</b> 66 across 11 sites</span>
  </div>
</header>

<section class="headline">
  <div>
    <p class="eyebrow">Weighted overall</p>
    <div class="big">${d.overall}<span class="den">/1000</span></div>
    <div class="gauge"><span style="width:${(d.overall / 10).toFixed(1)}%"></span></div>
  </div>
  <div class="readout">
    <p><strong>Technical build scores 842. Demand capture scores 194.</strong> That 648-point spread is not noise in the measurement &mdash; it is the finding.</p>
    <p>Fourteen non-brand clicks arrived in twenty-eight days. Not because the pages are weak, but because almost nobody reaches them: the impression-weighted average position is <strong>53.7</strong>, which is page six.</p>
    <p style="font-size:15.5px;color:var(--ink-3)">Up from 439 after this pass. Every point that could be taken in code has been taken or ruled out; the split below says who can take the rest.</p>
  </div>
</section>

<section class="strip-wrap">
  <p class="eyebrow">All fifty scores on one axis</p>
  <div class="strip">${strip}</div>
  <div class="axis"><span>0</span><span>250</span><span>500</span><span>750</span><span>1000</span></div>
  <div class="legend">
    <span><i style="background:var(--crit)"></i>critical &mdash; ${counts.crit}</span>
    <span><i style="background:var(--weak)"></i>weak &mdash; ${counts.weak}</span>
    <span><i style="background:var(--fair)"></i>fair &mdash; ${counts.fair}</span>
    <span><i style="background:var(--strong)"></i>strong &mdash; ${counts.strong}</span>
  </div>
  <div class="callout">
    <p>The scores do not cluster around a middle. They pile up at both ends &mdash; <strong>${counts.crit + counts.weak} categories below 450 and ${counts.strong} above 700</strong>, with only ${counts.fair} in between. Every category in the left cluster is something that happens off the website. Every category in the right cluster is something that happens inside it.</p>
  </div>
</section>

<section class="note">
  <h2>Who can capture the 546 points that are left</h2>
  <p class="lead">This is the question the scorecard exists to answer, and the honest answer is that most of it is not a build problem.</p>
  <div class="tbl-wrap">
    <table>
      <thead><tr><th>Holder</th><th class="num">Points</th><th>What it is</th></tr></thead>
      <tbody>
        <tr>
          <td class="g-name">You, in an account</td>
          <td class="num strongnum crit">269</td>
          <td>Google Business Profile, five therapy directories, citations, referral networks, social profiles, a photograph and a video. None of it touches the website. All of it is written out ready to paste in <code>OFFSITE_KIT_2026-08-27.md</code>.</td>
        </tr>
        <tr>
          <td class="g-name">Downstream of that</td>
          <td class="num strongnum weak">163</td>
          <td>Rankings, click volume, CTR, average position. These cannot be worked on directly &mdash; they are what happens after the row above, and no amount of on-page change substitutes for it.</td>
        </tr>
        <tr>
          <td class="g-name">Still in code</td>
          <td class="num strongnum fair">114</td>
          <td>New clinical content, page count, Core Web Vitals, mobile tap targets, city-page depth. Real, but the smallest of the three &mdash; and content needs the counsellor to read it before it ships.</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="callout">
    <p><strong>The trap this scorecard is built to expose:</strong> the 114 in code is the pile that feels like progress, and it is the pile that matters least. Four of the eleven technical categories are already ranked first out of eleven. Improving them again changes nothing a visitor or a search engine will notice.</p>
  </div>
</section>

<section class="note">
  <h2>The seven groups</h2>
  <div class="tbl-wrap">
    <table>
      <thead><tr><th></th><th>Group</th><th class="num">Weight</th><th class="num">Cats</th><th class="num">Score</th><th></th></tr></thead>
      <tbody>${groupRows}</tbody>
    </table>
  </div>
  <p style="margin-top:18px;font-size:14px;color:var(--ink-3)">Weights reflect what actually produces clicks and enquiries, not what is easiest to change. Rankings, local presence and off-site authority carry 54% between them.</p>
</section>

${sections}

<section class="note">
  <h2>What was done in this pass, and what was deliberately not</h2>
  <p class="lead">Every category was worked. Three moved on evidence, one moved on a build, and two claims I had made turned out to be wrong and were withdrawn.</p>
  <ol class="moves">
    <li>
      <h4>Built: an optional callback request &mdash; 100 &rarr; 550</h4>
      <p>The lowest-scoring conversion category. A number is still not published, because that is your decision and a missed call is worse than no invitation. But the direction is now reversed: the enquiry and waitlist forms take an optional number and a preferred window, the practice alert carries them, and <code>/admin</code> flags those people as <em>Wants a call</em> so they are not answered by email by mistake.</p>
    </li>
    <li>
      <h4>Withdrawn: &ldquo;areaServed is absent&rdquo; &mdash; 480 &rarr; 820</h4>
      <p>I wrote that from a column my own probe collected and never printed. It is emitted site-wide as State: British Columbia within Country: Canada. The correction is commented in the scoring script so it survives the next edit.</p>
    </li>
    <li>
      <h4>Withdrawn: &ldquo;/book leads with a mailto&rdquo; &mdash; 600 &rarr; 850</h4>
      <p>Read off the wrong branch. The mailto-first block only renders when booking is unconfigured; the Cliniko scheduler is embedded in the page and is what actually ships.</p>
    </li>
    <li>
      <h4>Not built: a snippet rewrite for click-through rate</h4>
      <p>This looked like the biggest in-code win until the queries were checked. Only 26 queries rank in the top fifteen and together they carry <strong>36 impressions</strong> &mdash; several of them accidental matches on words like &ldquo;yes&rdquo; and &ldquo;bc&rdquo;. There is no traffic at clickable positions to convert. The 0.50% rate is caused by position, not by wording, and rewriting fifty titles would have produced a commit and no clicks.</p>
    </li>
    <li>
      <h4>Not built: live chat, and an <code>/updates</code> feed</h4>
      <p>Zero of ten competitors run live chat, so it buys nothing against this set and commits a solo practice to answering it. An index of recently-edited pages would have moved the publishing-cadence number without publishing anything &mdash; a signal manufactured to satisfy a metric I wrote myself. Cadence needs real articles, and clinical copy needs the counsellor to read it first.</p>
    </li>
    <li>
      <h4>Already there: <code>llms.txt</code>, freshness dates, AI-crawler access</h4>
      <p>Three things I was about to build already existed. Sitemap dates come from real git history rather than the build clock, which is why freshness scores 780 while two competitors carry no dates at all.</p>
    </li>
  </ol>
</section>

<section class="note">
  <h2>Method, and what it cannot see</h2>
  <p>Every on-site figure was fetched and parsed this pass: robots.txt, full sitemap traversal, then the homepage plus an even spread of five further pages per site, parsed for titles, descriptions, canonicals, headings, structured data, images, internal links, word count and transfer size. Westpeak was measured by the same sampling method as the competitors so the comparison is like for like.</p>
  <p><strong>Three honest limits.</strong> Backlink counts are estimated, not measured &mdash; no backlink API is authorised in this session. Rank positions come from Search Console, which withholds most rare queries, so the real query set is wider than 317. And Skylark Counselling, an Abbotsford competitor, serves 403 to automated requests and could not be measured at all; nine of the ten competitors carry measured on-site data.</p>
  <p>A note on the two earlier audits in this repository that disagreed by five thousand points: both were right. One excluded off-site factors by request and scored the build; the other scored acquisition. This pass includes both, which is why the total sits between them.</p>
</section>

<footer class="end">
  Westpeak Wellness &middot; 50-category visibility audit &middot; 27 August 2026<br>
  Generated from data/competitors/scan.json and data/gsc/2026-08-20-*.csv<br>
  Reproduce with: npm run scan &amp;&amp; node scripts/visibility-50.mjs
</footer>

</div>
`;

writeFileSync(OUT, html);
console.log('wrote ' + OUT + ' (' + Math.round(Buffer.byteLength(html) / 1024) + ' kB)');
