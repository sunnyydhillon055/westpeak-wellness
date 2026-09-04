/* ============================================================================
   WHAT A SLOW PAGE SHOWS WHILE IT IS STILL BEING BUILT
   ----------------------------------------------------------------------------
   Ten routes on this site render on demand, and five of them do real work
   first: /admin reads six separate blob stores, /client-portal and /book ask
   Cliniko, /pricing checks live fees, /search walks the content index. Until
   now every one of them showed the previous page — unchanged, with nothing
   moving — for as long as that took. The visitor's own reading of that is not
   "this is loading", it is "the link did not work", and the next thing they do
   is press it again.

   WHY A MESSAGE AND NOT A SKELETON. Skeleton placeholders imply a shape, and
   half of these pages have a shape that depends on the answer — how many
   appointments, how many results, whether there are any. A grey rectangle
   where an empty state is about to appear is a small lie told to fill time.
   One honest line costs nothing and cannot be wrong.

   THE ACCESSIBILITY PART IS NOT DECORATION. role="status" with aria-live
   polite is what makes this reach somebody using a screen reader: without it
   the page silently changes and nothing is announced, which is the same
   nothing-happened experience, only worse. The spinner honours
   prefers-reduced-motion via the stylesheet, and the text stands alone if it
   does not animate at all.
   ========================================================================= */

export default function PageLoading({ what = 'this page' }: { what?: string }) {
  return (
    <section className="section" style={{ paddingTop: 80, minHeight: '40vh' }}>
      <div className="container prose" style={{ maxWidth: '44rem' }}>
        <p role="status" aria-live="polite" className="page-loading">
          <span className="page-loading__dot" aria-hidden="true" />
          Loading {what}…
        </p>
      </div>
    </section>
  );
}
