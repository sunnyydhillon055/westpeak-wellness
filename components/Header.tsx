'use client';
import Link from 'next/link';
import { useState } from 'react';
import { site } from '@/lib/site';

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="container nav">
        <Link href="/" className="brand">Westpeak <span>Wellness</span></Link>
        <button className="nav-toggle" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          <span /><span /><span />
        </button>
        <ul className={`nav-links${open ? ' open' : ''}`} onClick={() => setOpen(false)}>
          <li><Link href="/about">About</Link></li>
          <li><Link href="/services">Services</Link></li>
          <li><Link href="/pricing">Fees</Link></li>
          <li><Link href="/faq">FAQ</Link></li>
          <li><Link href="/contact">Contact</Link></li>
          <li className="nav-cta"><a className="btn btn--primary" href={site.bookingUrl} target="_blank" rel="noopener">Book Free Consult</a></li>
        </ul>
      </div>
    </header>
  );
}
