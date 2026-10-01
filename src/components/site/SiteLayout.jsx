import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Phone, Mail, Clock, Menu, X, MessageCircle, ChevronDown } from 'lucide-react';
import { FaInstagram, FaFacebook, FaLinkedin, FaXTwitter, FaWhatsapp } from 'react-icons/fa6';
import Logo from '../Logo';
import { SITE } from '../../lib/siteConfig';
import useReveal from './useReveal';

const NAV = [
  { to: '/services', label: 'Services' },
  { to: '/safety', label: 'Trust & Safety' },
  { to: '/about', label: 'About Us' },
  { to: '/faq', label: 'FAQs' },
  { to: '/contact', label: 'Contact' },
];

// Equity-style audience tabs under the main header
const TABS = [
  { to: '/', label: 'Home', end: true },
  { to: '/#book', label: 'Book a Ride' },
  { to: '/pay', label: 'Pay via M-Pesa' },
  { to: '/my-rides', label: 'My Rides' },
  { to: '/drivers/apply', label: 'Drive with Us' },
];

export default function SiteLayout() {
  const [open, setOpen] = useState(false);
  const { pathname, hash } = useLocation();
  useReveal();

  useEffect(() => {
    setOpen(false);
    if (hash) {
      const el = document.querySelector(hash);
      if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <div className="site">
      <div className="topbar">
        <div className="wrap topbar-in">
          <span><Clock size={13} /> {SITE.hours} · Nairobi &amp; Kiambu</span>
          <span className="topbar-links">
            <a href={SITE.phoneHref}><Phone size={13} /> {SITE.phone}</a>
            <a href={`mailto:${SITE.email}`} className="hide-sm"><Mail size={13} /> {SITE.email}</a>
            <Link to="/admin/login" className="hide-sm">Dispatcher login</Link>
          </span>
        </div>
      </div>

      <header className="header">
        <div className="wrap header-in">
          <Link to="/" className="brand"><Logo size={36} /></Link>
          <nav className={`nav ${open ? 'open' : ''}`}>
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} className={({ isActive }) => (isActive ? 'active' : '')}>{n.label}</NavLink>
            ))}
            <Link to="/#book" className="btn-cta nav-cta">Book a ride</Link>
          </nav>
          <button className="burger" aria-label="Menu" onClick={() => setOpen(!open)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        <div className="tabs">
          <div className="wrap tabs-in">
            {TABS.map((t) => (
              <NavLink key={t.to} to={t.to} end={t.end} className={({ isActive }) => `tab ${isActive ? 'active' : ''}`}>{t.label}</NavLink>
            ))}
          </div>
        </div>
      </header>

      <main><Outlet /></main>

      <a className="wa-float" href={SITE.whatsappHref} target="_blank" rel="noreferrer" aria-label="WhatsApp us">
        <MessageCircle size={26} />
      </a>

      <footer className="footer">
        <div className="wrap footer-grid">
          <div>
            <Logo size={34} dark />
            <p className="footer-blurb">Safe, caring rides and care coordination for patients travelling to non-emergency hospital appointments.</p>
            <p className="footer-muted">Serving Nairobi &amp; Kiambu · Nakuru &amp; Mombasa coming soon</p>
          </div>
          <div>
            <h4>Company</h4>
            <Link to="/about">About us</Link>
            <Link to="/services">Services</Link>
            <Link to="/safety">Trust &amp; safety</Link>
            <Link to="/faq">FAQs</Link>
          </div>
          <div>
            <h4>Riders</h4>
            <Link to="/#book">Book a ride</Link>
            <Link to="/pay">How to pay</Link>
            <Link to="/my-rides">My rides</Link>
            <Link to="/login">Log in</Link>
          </div>
          <div>
            <h4>Reach us · 24/7</h4>
            <a href={SITE.phoneHref}>{SITE.phone}</a>
            <a href={SITE.whatsappHref} target="_blank" rel="noreferrer">WhatsApp</a>
            <a href={SITE.smsHref}>Text us</a>
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            <Link to="/drivers/apply">Become a driver-partner</Link>
            <div className="social-row">
              <a href={SITE.whatsappHref} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="social-ic wa"><FaWhatsapp /></a>
              {SITE.social.instagram && <a href={SITE.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="social-ic ig"><FaInstagram /></a>}
              {SITE.social.twitter && <a href={SITE.social.twitter} target="_blank" rel="noreferrer" aria-label="X (Twitter)" className="social-ic tw"><FaXTwitter /></a>}
              {SITE.social.facebook && <a href={SITE.social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="social-ic fb"><FaFacebook /></a>}
              <a href={SITE.social.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="social-ic li"><FaLinkedin /></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="wrap">© {new Date().getFullYear()} {SITE.name}. We only collect contact details, used solely for ride scheduling.</div>
        </div>
      </footer>
    </div>
  );
}