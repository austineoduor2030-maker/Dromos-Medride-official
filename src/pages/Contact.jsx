import { useState } from 'react';
import { Phone, MessageCircle, Mail, MessageSquare, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHero from '../components/site/PageHero';
import { SITE } from '../lib/siteConfig';
import { supabase } from '../lib/supabaseClient';

const EMPTY = { name: '', email: '', phone: '', message: '' };

export default function Contact() {
  const rows = [
    { Icon: Phone, t: 'Call us', d: SITE.phone, href: SITE.phoneHref },
    { Icon: MessageCircle, t: 'WhatsApp', d: 'Message us any time', href: SITE.whatsappHref },
    { Icon: MessageSquare, t: 'Text us', d: SITE.phone, href: SITE.smsHref },
    { Icon: Mail, t: 'Email', d: SITE.email, href: `mailto:${SITE.email}` },
  ];

  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState('idle');
  const [errors, setErrors] = useState({});

  function update(field, value) {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: null }));
  }

  function validate() {
    const n = {};
    if (!form.name.trim()) n.name = 'Enter your name.';
    if (!form.email.trim() && !form.phone.trim()) n.contact = 'Add an email or phone number so we can reply.';
    if (!form.message.trim()) n.message = 'Write your message.';
    setErrors(n);
    return Object.keys(n).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setStatus('saving');
    const { error } = await supabase.from('messages').insert({ ...form });
    if (!error) {
      supabase.functions.invoke('send-booking-email', {
        body: {
          to: SITE.email,
          subject: `New message — ${form.name}`,
          html: `
            <p><b>New contact message</b></p>
            <p>From: <b>${form.name}</b><br/>
            ${form.email ? `Email: ${form.email}<br/>` : ''}
            ${form.phone ? `Phone: ${form.phone}<br/>` : ''}</p>
            <p>${form.message}</p>
            <p>Reply from the admin dashboard, or directly to their email/phone above.</p>
          `,
        },
      }).catch(() => {});
    }
    setStatus(error ? 'error' : 'sent');
  }

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
      </section>

      <section className="section wrap narrow reveal">
        <div className="section-head">
          <div className="eyebrow">Send a message</div>
          <h2>Message us directly — no email app needed</h2>
        </div>

        {status === 'sent' ? (
          <div className="pay-card">
            <CheckCircle2 size={44} color="var(--teal)" />
            <h3 style={{ margin: '12px 0 6px' }}>Message sent</h3>
            <p style={{ color: 'var(--text-muted)' }}>We’ll get back to you shortly — by email, phone or WhatsApp, whichever you gave us.</p>
          </div>
        ) : (
          <form className="book" onSubmit={handleSubmit}>
            <div className="book-grid">
              <div className="field">
                <label>Your name</label>
                <input className={errors.name ? 'error' : ''} value={form.name} onChange={(e) => update('name', e.target.value)} />
                {errors.name && <div className="error-text">{errors.name}</div>}
              </div>
              <div className="field">
                <label>Phone (optional)</label>
                <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
              </div>
              <div className="field full">
                <label>Email (optional)</label>
                <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
                {errors.contact && <div className="error-text">{errors.contact}</div>}
              </div>
              <div className="field full">
                <label>Message</label>
                <textarea rows={4} className={errors.message ? 'error' : ''} value={form.message} onChange={(e) => update('message', e.target.value)} />
                {errors.message && <div className="error-text">{errors.message}</div>}
              </div>
            </div>
            <button className="btn-cta block" type="submit" disabled={status === 'saving'}>
              {status === 'saving' ? 'Sending…' : 'Send message'}
            </button>
            {status === 'error' && <div className="alert">Couldn’t send — check your connection and try again, or call {SITE.phone}.</div>}
          </form>
        )}
      </section>

      <div className="center" style={{ paddingBottom: 48 }}><Link to="/#book" className="btn-cta">Or book online</Link></div>
    </>
  );
}