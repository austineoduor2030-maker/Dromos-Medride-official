import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Header from '../components/Header';

const EMPTY_FORM = {
  full_name: '',
  phone: '',
  national_id: '',
  license_number: '',
  psv_badge_number: '',
  vehicle_type: 'standard',
  plate_number: '',
};

export default function DriverApplication() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  }

  function validate() {
    const next = {};
    if (!form.full_name.trim()) next.full_name = 'Enter your full name.';
    if (!form.phone.trim()) next.phone = 'Enter a phone number.';
    if (!form.license_number.trim()) next.license_number = 'Enter your driving licence number.';
    if (!form.plate_number.trim()) next.plate_number = 'Enter your vehicle plate number.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setStatus('saving');
    const { error } = await supabase
      .from('driver_applications')
      .insert({ ...form, review_status: 'pending' });

    setStatus(error ? 'error' : 'success');
  }

  if (status === 'success') {
    return (
      <div>
        <Header />
        <div className="page" style={{ textAlign: 'center', paddingTop: 60 }}>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>Application submitted</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            We'll review your details and contact you by phone or WhatsApp.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <form className="page" onSubmit={handleSubmit}>
        <h2 style={{ fontSize: 17, fontWeight: 500, marginBottom: 2 }}>Become a driver-partner</h2>
        <p style={{ fontSize: 12.5, color: 'var(--text-muted)', marginBottom: 16 }}>
          We'll review your application and contact you by phone or WhatsApp.
        </p>

        <div className="field">
          <label>Full name</label>
          <input
            className={errors.full_name ? 'error' : ''}
            value={form.full_name}
            onChange={(e) => updateField('full_name', e.target.value)}
          />
          {errors.full_name && <div className="error-text">{errors.full_name}</div>}
        </div>

        <div className="field">
          <label>Phone number</label>
          <input
            className={errors.phone ? 'error' : ''}
            value={form.phone}
            onChange={(e) => updateField('phone', e.target.value)}
          />
          {errors.phone && <div className="error-text">{errors.phone}</div>}
        </div>

        <div className="field">
          <label>National ID number</label>
          <input
            value={form.national_id}
            onChange={(e) => updateField('national_id', e.target.value)}
          />
        </div>

        <div className="field">
          <label>Driving licence number</label>
          <input
            className={errors.license_number ? 'error' : ''}
            value={form.license_number}
            onChange={(e) => updateField('license_number', e.target.value)}
          />
          {errors.license_number && <div className="error-text">{errors.license_number}</div>}
        </div>

        <div className="field">
          <label>PSV badge number</label>
          <input
            value={form.psv_badge_number}
            onChange={(e) => updateField('psv_badge_number', e.target.value)}
          />
        </div>

        <div className="field">
          <label>Vehicle type</label>
          <select
            value={form.vehicle_type}
            onChange={(e) => updateField('vehicle_type', e.target.value)}
          >
            <option value="standard">Standard car</option>
            <option value="van">Van</option>
            <option value="wheelchair">Wheelchair-accessible</option>
          </select>
        </div>

        <div className="field">
          <label>Plate number</label>
          <input
            className={errors.plate_number ? 'error' : ''}
            value={form.plate_number}
            onChange={(e) => updateField('plate_number', e.target.value)}
          />
          {errors.plate_number && <div className="error-text">{errors.plate_number}</div>}
        </div>

        <button className="btn-secondary" type="submit" disabled={status === 'saving'}>
          {status === 'saving' ? 'Submitting...' : 'Submit application'}
        </button>

        {status === 'error' && (
          <div
            style={{
              background: 'var(--danger-bg)',
              color: 'var(--danger-text)',
              borderRadius: 8,
              padding: '10px 12px',
              marginTop: 10,
              fontSize: 12.5,
            }}
          >
            Something went wrong submitting your application. Please try again.
          </div>
        )}
      </form>
    </div>
  );
}
