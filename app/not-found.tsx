import Link from 'next/link';
export default function NotFound() {
  return (
    <section className="section" style={{ paddingTop: 100, textAlign: 'center' }}>
      <div className="container">
        <p className="eyebrow">Page not found</p>
        <h1>This page moved or never existed.</h1>
        <p className="lede" style={{ margin: '0 auto 24px' }}>Let&rsquo;s get you back on track.</p>
        <Link className="btn btn--primary" href="/">Return home</Link>
      </div>
    </section>
  );
}
