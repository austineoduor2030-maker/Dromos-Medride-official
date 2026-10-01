import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function AdminPayments() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    setLoading(true);
    const { data } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
    setBookings(data || []);
    setLoading(false);
  }

  async function markPaid(id) {
    await supabase.from('bookings').update({ payment_status: 'paid' }).eq('id', id);
    fetchBookings();
  }

  const totalCollected = bookings.filter((b) => b.payment_status === 'paid').reduce((sum, b) => sum + (b.fee || 0), 0);
  const totalOutstanding = bookings.filter((b) => b.payment_status === 'unpaid').reduce((sum, b) => sum + (b.fee || 0), 0);

  return (
    <div>
      <div className="admin-topbar">
        <h2 style={{ fontSize: 18, fontWeight: 500, margin: 0 }}>Payments</h2>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="label">Collected</div>
          <div className="value">KSh {totalCollected.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="label">Outstanding</div>
          <div className="value" style={{ color: 'var(--danger-text)' }}>KSh {totalOutstanding.toLocaleString()}</div>
        </div>
      </div>

      {loading ? (
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Loading...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Trip date</th>
              <th>Fee</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.patient_name}</td>
                <td>{b.requested_time && new Date(b.requested_time).toLocaleDateString()}</td>
                <td>{b.fee ? `KSh ${b.fee}` : '—'}</td>
                <td><span className={`badge ${b.payment_status}`}>{b.payment_status}</span></td>
                <td>
                  {b.payment_status === 'unpaid' && (
                    <button className="btn-small" onClick={() => markPaid(b.id)}>Mark paid</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
