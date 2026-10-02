import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import PageHero from '../components/site/PageHero';
import LocationPicker from '../components/site/LocationPicker';
import { DISTANCE_BANDS, estimateFee } from '../lib/pricing';
import { SITE } from '../lib/siteConfig';

const RIDE_TYPES = [
  { value: 'standard', label: 'Standard car' },
  { value: 'van', label: 'Van' },
  { value: 'wheelchair', label: 'Wheelchair-accessible' },
];

const EMPTY_FORM = {
  patient_name: '', phone: '', email: '',
  pickup_label: '', pickup_lat: null, pickup_lng: null,
  destination: '', requested_time: '',
  ride_type: 'standard', trip_nature: 'one_off',
  band: '', wait_and_return: false,
};

const kes = (n) => `KES ${n.toLocaleString()}`;

export default function BookingForm({ embedded = false }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [locMsg, setLocMsg] = useState('');

  const fee = useMemo(() => estimateFee(form), [form]);

  function updateField(field, value) {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: null }));
  }

  function pinLocation() {
    if (!navigator.geolocation) { setLocMsg('Location isn’t available on this device — type the address instead.'); return; }
    setLocMsg('Getting your location…');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((p) => ({
          ...p, pickup_lat: pos.coords.latitude, pickup_lng: pos.coords.longitude,
          pickup_label: p.pickup_label || 'Pinned location',
        }));
        setLocMsg('Location pinned ✓ — add a landmark or address below if you like.');
      },
      () => setLocMsg('Couldn’t get your location — please type the pickup address.'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  function validate() {
    const n = {};
    if (!form.patient_name.trim()) n.patient_name = 'Enter the patient’s name.';
    if (!form.phone.trim()) n.phone = 'Enter a phone number so the driver can reach you.';
    if (!form.pickup_label.trim() && form.pickup_lat == null) n.pickup_label = 'Enter or pin the pickup location.';
    if (!form.destination.trim()) n.destination = 'Enter the hospital or clinic name.';
    if (!form.requested_time) n.requested_time = 'Choose a pickup date and time.';
    if (!form.band) n.band = 'Choose the approximate trip distance to see your cost.';
    setErrors(n);
    return Object.keys(n).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setStatus('saving');
    const { band, ...rest } = form;
    const { error } = await supabase.from('bookings').insert({
      ...rest,
      requested_time: new Date(form.requested_time).toISOString(),
      fee,
      status: 'pending',
      payment_status: 'unpaid',
    });
        if (!error) {
      localStorage.setItem('dromos_last_phone', form.phone);
      const when = new Date(form.requested_time).toLocaleString();
      const costLine = fee != null ? kes(fee) : 'to be confirmed';

      // Confirmation to the patient (only if they gave an email) — non-blocking.
      if (form.email) {
        supabase.functions.invoke('send-booking-email', {
          body: {
            to: form.email,
            subject: 'Dromos MedRide — booking received',
            html: `
              <p>Hi ${form.patient_name},</p>
              <p>We've received your ride booking to <b>${form.destination}</b> on <b>${when}</b>.</p>
              <p>Trip cost: <b>${costLine}</b> — pay via M-Pesa till <b>${SITE.mpesaTill}</b>.</p>
              <p>We'll confirm your driver's name, plate number and phone shortly. Questions? Call or WhatsApp us at ${SITE.phone}.</p>
              <p>— Dromos MedRide</p>
            `,
          },
        }).catch(() => {});
      }

      // Alert to the business inbox, every time — this is what shows you who's booked.
      supabase.functions.invoke('send-booking-email', {
        body: {
          to: SITE.email,
          subject: `New booking — ${form.patient_name}`,
          html: `
            <p><b>New booking received</b></p>
            <p>Patient: <b>${form.patient_name}</b><br/>
            Phone: <b>${form.phone}</b><br/>
            ${form.email ? `Email: ${form.email}<br/>` : ''}
            Pickup: ${form.pickup_label || '—'}<br/>
            Destination: <b>${form.destination}</b><br/>
            Date/time: <b>${when}</b><br/>
            Vehicle: ${form.ride_type} · ${form.trip_nature === 'package' ? 'Package' : 'One-off'}${form.wait_and_return ? ' · Wait-and-return' : ''}<br/>
            Fee: <b>${costLine}</b></p>
            <p>View and assign this trip in the admin dashboard.</p>
          `,
        },
      }).catch(() => {});
    }
    setStatus(error ? 'error' : 'success');
  }

  if (status === 'success') {
    const confirmation = (
      <div className="pay-card">
        <CheckCircle2 size={44} color="var(--teal)" />
        <h3 style={{ margin: '12px 0 6px' }}>We’ll confirm shortly</h3>
        <p style={{ color: 'var(--text-muted)' }}>
          You’ll get an email or WhatsApp once your ride is confirmed, with your driver’s plate number, phone number and exact pickup time.
        </p>
        <p><b>Trip cost: {fee != null && kes(fee)}</b> — pay via M-Pesa till <b>{SITE.mpesaTill}</b>.</p>
        <div className="btn-row" style={{ justifyContent: 'center' }}>
          <Link to="/my-rides" className="btn-cta">View my rides</Link>
          {!embedded && <Link to="/" className="btn-outline">Back home</Link>}
        </div>
      </div>
    );
    if (embedded) return confirmation;
    return (
      <>
        <PageHero eyebrow="Booking" title="Booking received" />
        <section className="section wrap narrow">{confirmation}</section>
      </>
    );
  }

  const form_ = (
        <form className="book" onSubmit={handleSubmit}>
          <div className="book-grid">
            <div className="field">
              <label>Patient name</label>
              <input className={errors.patient_name ? 'error' : ''} value={form.patient_name} onChange={(e) => updateField('patient_name', e.target.value)} />
              {errors.patient_name && <div className="error-text">{errors.patient_name}</div>}
            </div>
            <div className="field">
              <label>Phone number</label>
              <input type="tel" className={errors.phone ? 'error' : ''} value={form.phone} onChange={(e) => updateField('phone', e.target.value)} />
              {errors.phone && <div className="error-text">{errors.phone}</div>}
            </div>
            <div className="field full">
              <label>Email (optional)</label>
              <input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} />
            </div>
            <div className="field full">
              <label>Pickup location</label>
              <div className="inline">
                <input className={errors.pickup_label ? 'error' : ''} placeholder="Address or landmark" value={form.pickup_label} onChange={(e) => updateField('pickup_label', e.target.value)} />
                <button type="button" className="btn-outline sm" onClick={pinLocation}><MapPin size={16} /> Use my location</button>
              </div>
              {locMsg && <div className="hint">{locMsg}</div>}
              <LocationPicker
                onPick={({ lat, lng, label }) => {
                  setForm((p) => ({ ...p, pickup_lat: lat, pickup_lng: lng, pickup_label: label || p.pickup_label }));
                }}
              />
              {errors.pickup_label && <div className="error-text">{errors.pickup_label}</div>}
            </div>
            <div className="field full">
              <label>Destination (hospital or clinic)</label>
              <input className={errors.destination ? 'error' : ''} value={form.destination} onChange={(e) => updateField('destination', e.target.value)} />
              {errors.destination && <div className="error-text">{errors.destination}</div>}
            </div>
            <div className="field">
              <label>Pickup date and time</label>
              <input type="datetime-local" className={errors.requested_time ? 'error' : ''} value={form.requested_time} onChange={(e) => updateField('requested_time', e.target.value)} />
              {errors.requested_time && <div className="error-text">{errors.requested_time}</div>}
            </div>
            <div className="field">
              <label>Approximate trip distance</label>
              <select className={errors.band ? 'error' : ''} value={form.band} onChange={(e) => updateField('band', e.target.value)}>
                <option value="">Select…</option>
                {DISTANCE_BANDS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
              </select>
              {errors.band && <div className="error-text">{errors.band}</div>}
            </div>
            <div className="field">
              <label>Vehicle</label>
              <select value={form.ride_type} onChange={(e) => updateField('ride_type', e.target.value)}>
                {RIDE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Ride type</label>
              <select value={form.trip_nature} onChange={(e) => updateField('trip_nature', e.target.value)}>
                <option value="one_off">One-off trip</option>
                <option value="package">Package / recurring need</option>
              </select>
            </div>
            <label className="check full">
              <input type="checkbox" checked={form.wait_and_return} onChange={(e) => updateField('wait_and_return', e.target.checked)} />
              Wait-and-return (we wait and bring the patient back)
            </label>
          </div>

          <div className="price-box">
            <span>Trip cost</span>
            <b>{fee != null ? kes(fee) : '— choose distance'}</b>
            <small>Paid via M-Pesa after your ride is confirmed. Package patients still book each trip individually.</small>
          </div>

          <button className="btn-cta block" type="submit" disabled={status === 'saving'}>
            {status === 'saving' ? 'Booking…' : 'Confirm booking'}
          </button>
          {status === 'error' && <div className="alert">Couldn’t reach the server. Check your connection and try again — or call {SITE.phone}.</div>}
          <p className="hint center">Prefer not to use the form? <a href={SITE.phoneHref}>Call</a>, <a href={SITE.smsHref}>text</a> or <a href={SITE.whatsappHref}>WhatsApp</a> us. We only keep contact details, used solely to schedule your ride.</p>
        </form>
  );

  if (embedded) return form_;

  return (
    <>
      <PageHero eyebrow="Book a ride" title="Book your hospital ride" text="No account needed. You’ll see the cost before you confirm." />
      <section className="section wrap narrow">{form_}</section>
    </>
  );
}