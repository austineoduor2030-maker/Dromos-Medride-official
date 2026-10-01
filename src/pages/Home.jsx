import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarCheck, Phone, Wallet, Car, Accessibility, HeartHandshake, Users, Siren, ShieldCheck,
  MapPin, Clock, ArrowRight, Quote, MessageCircle, Stethoscope, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { SITE, FAQS } from '../lib/siteConfig';
import FaqList from '../components/site/FaqList';
import BookingForm from './BookingForm';

const SLIDES = [
  { tag: 'Your way to care', title: 'Safe, caring rides to every hospital appointment', text: 'Built for elderly, dialysis, chemotherapy and post-surgery patients across Nairobi and Kiambu — not a general taxi service.', cta: ['Book a ride', '#book'], alt: ['Our services', '/services'], Icon: Car },
  { tag: 'Wheelchair-accessible', title: 'Accessible vehicles, available today', text: 'Wheelchair-accessible vehicles and trained caregivers for any ride that needs hands-on help — and a family member can always ride along.', cta: ['See how it works', '/services'], alt: ['Trust & safety', '/safety'], Icon: Accessibility },
  { tag: 'Open 24/7', title: 'From home to appointment, we plan the journey', text: 'Book online, or call, text or WhatsApp us. You see the cost upfront, and we confirm your driver’s plate, phone and pickup time.', cta: ['Book now', '#book'], alt: ['Contact us', '/contact'], Icon: Clock },
];

const QUICK = [
  { to: '#book', label: 'Book a ride', sub: 'Online in minutes', Icon: CalendarCheck },
  { href: SITE.phoneHref, label: 'Call / text us', sub: SITE.phone, Icon: Phone },
  { href: SITE.whatsappHref, label: 'WhatsApp', sub: 'Message us any time', Icon: MessageCircle },
  { to: '/pay', label: 'Pay via M-Pesa', sub: 'Till number', Icon: Wallet },
];

const SERVICES = [
  { title: 'Accessible vehicles', text: 'Wheelchair-accessible vehicles are available now for patients who can’t transfer to a standard car.', Icon: Accessibility },
  { title: 'Trained caregivers', text: 'A caregiver is assigned to any ride that needs hands-on help getting in, out and settled.', Icon: HeartHandshake },
  { title: 'Companion riders', text: 'A family member or companion is welcome to ride along with the patient.', Icon: Users },
  { title: 'Emergency readiness', text: 'Ambulance contacts are kept on hand in case a patient’s condition changes mid-trip.', Icon: Siren },
  { title: 'Care coordination', text: 'We plan the trip from home to appointment so families don’t have to take time off work.', Icon: Stethoscope },
  { title: 'Packages for regular care', text: 'Dialysis, chemo or physio? Book at a package rate — each trip is booked individually.', Icon: CalendarCheck },
];

const STEPS = [
  ['Book', 'Use the form, or call, text or WhatsApp us.'],
  ['See your cost', 'The trip cost is shown upfront, before you confirm.'],
  ['We confirm', 'You get an email or WhatsApp once it’s confirmed.'],
  ['Ride', 'Driver’s plate, phone and exact pickup time are sent to you.'],
];

export default function Home() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % SLIDES.length), 7000);
    return () => clearInterval(t);
  }, []);
  const go = (d) => setI((n) => (n + d + SLIDES.length) % SLIDES.length);

  return (
    <>
      {/* HERO CAROUSEL */}
      <section className="hero">
        {SLIDES.map((s, idx) => (
          <div key={s.tag} className={`hero-slide ${idx === i ? 'on' : ''}`} aria-hidden={idx !== i}>
            <div className="wrap hero-grid">
              <div>
                <div className="eyebrow light">{s.tag}</div>
                <h1>{s.title}</h1>
                <p>{s.text}</p>
                <div className="btn-row">
                  <Link to={s.cta[1]} className="btn-cta">{s.cta[0]} <ArrowRight size={18} /></Link>
                  <Link to={s.alt[1]} className="btn-ghost">{s.alt[0]}</Link>
                </div>
              </div>
              <div className="hero-art"><div className="hero-orb"><s.Icon size={120} strokeWidth={1.2} /></div></div>
            </div>
          </div>
        ))}
        <div className="hero-ctl">
          <button onClick={() => go(-1)} aria-label="Previous"><ChevronLeft size={20} /></button>
          {SLIDES.map((s, idx) => <span key={s.tag} className={idx === i ? 'dot on' : 'dot'} onClick={() => setI(idx)} />)}
          <button onClick={() => go(1)} aria-label="Next"><ChevronRight size={20} /></button>
        </div>
      </section>

      {/* BOOKING — embedded directly on the home page */}
      <section id="book" className="section wrap narrow reveal">
        <div className="section-head">
          <div className="eyebrow">Book a ride</div>
          <h2>Book your hospital ride, right here</h2>
        </div>
        <BookingForm embedded />
      </section>

      {/* QUICK ACTIONS */}
      <section className="wrap quick reveal">
        {QUICK.map(({ to, href, label, sub, Icon }) => {
          const inner = (<><span className="quick-ic"><Icon size={22} /></span><span><b>{label}</b><small>{sub}</small></span></>);
          return to
            ? <Link key={label} to={to} className="quick-item">{inner}</Link>
            : <a key={label} href={href} className="quick-item" target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{inner}</a>;
        })}
      </section>

      {/* ABOUT SNAPSHOT */}
      <section className="section wrap split reveal">
        <div>
          <div className="eyebrow">What we do</div>
          <h2>Care coordination, not just a ride</h2>
          <p className="lead">DromosMedRide is a ride and care-coordination service for patients travelling to non-emergency hospital appointments. From the first call to the drop-off, we look after the journey so families don’t have to.</p>
          <Link to="/about" className="link-arrow">Meet the team <ArrowRight size={16} /></Link>
        </div>
        <div className="stat-row">
          <div><b>24/7</b><span>Always open</span></div>
          <div><b>2</b><span>Counties at launch</span></div>
          <div><b>5+ yrs</b><span>Founder’s clinical experience</span></div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section tint">
        <div className="wrap">
          <div className="section-head reveal">
            <div className="eyebrow">Services</div>
            <h2>Everything a patient needs to get there safely</h2>
          </div>
          <div className="grid3">
            {SERVICES.map(({ title, text, Icon }) => (
              <Link to="/services" key={title} className="svc reveal">
                <span className="svc-ic"><Icon size={26} /></span>
                <h3>{title}</h3><p>{text}</p>
                <span className="link-arrow">Learn more <ArrowRight size={15} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section wrap">
        <div className="section-head reveal">
          <div className="eyebrow">How it works</div>
          <h2>Four simple steps</h2>
        </div>
        <div className="steps">
          {STEPS.map(([t, d], n) => (
            <div key={t} className="step reveal"><span className="step-n">{n + 1}</span><h3>{t}</h3><p>{d}</p></div>
          ))}
        </div>
        <div className="center"><Link to="#book" className="btn-cta">Book a ride <ArrowRight size={18} /></Link></div>
      </section>

      {/* ANCHOR STATEMENT */}
      <section className="anchor">
        <div className="wrap reveal">
          <Quote size={44} className="anchor-q" />
          <p>{SITE.anchor}</p>
        </div>
      </section>

      {/* TRUST */}
      <section className="section wrap split reveal">
        <div>
          <div className="eyebrow">Trust &amp; safety</div>
          <h2>Built around the patient’s safety and privacy</h2>
          <ul className="ticks">
            <li>Wheelchair-accessible vehicles available now</li>
            <li>Trained caregivers for rides needing hands-on help</li>
            <li>Companions can ride along</li>
            <li>Ambulance contacts on hand if a condition changes</li>
            <li>No medical records kept — contact details only, used just for scheduling</li>
          </ul>
          <Link to="/safety" className="link-arrow">Read more <ArrowRight size={16} /></Link>
        </div>
        <div className="shield"><ShieldCheck size={110} strokeWidth={1.2} /></div>
      </section>

      {/* AREAS */}
      <section className="section tint">
        <div className="wrap">
          <div className="section-head reveal">
            <div className="eyebrow">Where we operate</div>
            <h2>Serving you across Kenya — growing</h2>
          </div>
          <div className="areas reveal">
            {SITE.areasLive.map((a) => <div key={a} className="area live"><MapPin size={20} /> {a}<em>Live</em></div>)}
            {SITE.areasSoon.map((a) => <div key={a} className="area"><MapPin size={20} /> {a}<em>Coming soon</em></div>)}
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section className="section wrap split reveal">
        <div className="founder-card">
          <div className="avatar">D</div>
          <b>The founder</b>
          <span>Physiotherapist · BLS certified</span>
        </div>
        <div>
          <div className="eyebrow">Our story</div>
          <h2>Built by a clinician, from what we saw on the ward</h2>
          <p className="lead">The model came from direct observation of the needs arising in healthcare and among patients’ families. It’s led by a physiotherapist with over 5 years of clinical experience, and built and vetted with a computer scientist and a pharmacist.</p>
          <Link to="/about" className="link-arrow">About us <ArrowRight size={16} /></Link>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section tint">
        <div className="wrap">
          <div className="section-head reveal">
            <div className="eyebrow">Testimonials</div>
            <h2>What riders and families say</h2>
          </div>
          <div className="empty reveal">
            <Quote size={30} />
            <p>We’re welcoming our first riders. Their stories will appear here.</p>
            <Link to="#book" className="btn-cta">Be one of our first riders</Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section wrap narrow reveal">
        <div className="section-head">
          <div className="eyebrow">FAQs</div>
          <h2>Common questions</h2>
        </div>
        <FaqList items={FAQS.slice(0, 5)} />
        <div className="center"><Link to="/faq" className="link-arrow">See all questions <ArrowRight size={16} /></Link></div>
      </section>

      {/* CTA */}
      <section className="cta-band">
        <div className="wrap cta-in">
          <div><h2>Need a ride to the hospital?</h2><p>Book online, or call, text or WhatsApp us — 24/7.</p></div>
          <div className="btn-row">
            <Link to="#book" className="btn-cta">Book a ride</Link>
            <a href={SITE.phoneHref} className="btn-ghost">{SITE.phone}</a>
          </div>
        </div>
      </section>
    </>
  );
}
