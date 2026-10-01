import { Phone, MessageCircle, Mail, MessageSquare, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHero from '../components/site/PageHero';
import { SITE } from '../lib/siteConfig';

export default function Contact() {
  const rows = [
    { Icon: Phone, t: 'Call us', d: SITE.phone, href: SITE.phoneHref },
    { Icon: MessageCircle, t: 'WhatsApp', d: 'Message us any time', href: SITE.whatsappHref },
    { Icon: MessageSquare, t: 'Text us', d: SITE.phone, href: SITE.smsHref },
    { Icon: Mail, t: 'Email', d: SITE.email, href: `mailto:${SITE.email}` },
  ];
  return (
    <>
      <PageHero eyebrow="Contact" title="We’re here 24/7" text="Prefer not to use the website? Reach us the way that suits you." />
      <section className="section wrap">
        <div className="grid4">
          {rows.map(({ Icon, t, d, href }) => (
            <a key={t} href={href} className="svc reveal" target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
              <span className="svc-ic"><Icon size={26} /></span><h3>{t}</h3><p>{d}</p>
            </a>
          ))}
        </div>
        <div className="info-row reveal">
          <span><Clock size={18} /> {SITE.hours}</span>
          <span><MapPin size={18} /> {SITE.areasLive.join(' & ')} — {SITE.areasSoon.join(' & ')} coming soon</span>
        </div>
        <div className="center"><Link to="/book" className="btn-cta">Or book online</Link></div>
      </section>
    </>
  );
}
