import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function AdminReports() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('bookings').select('*');
      setBookings(data || []);
      setLoading(false);
    })();
  }, []);

  const total = bookings.length;
  const completed = bookings.filter((b) => b.status === 'completed').length;
  const pending = bookings.filter((b) => b.status === 'pending').length;
  const cancelled = bookings.filter((b) => b.status === 'cancelled').length;
  const revenue = bookings.filter((b) => b.payment_status === 'paid').reduce((s, b) => s + (b.fee || 0), 0);

  if (loading) return <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Loading...</p>;

  return (
    <div>
      <div className="admin-topbar">
        <h2 style={{ fontSize: 18, fontWeight: 500, margin: 0 }}>Reports</h2>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="label">Total trips</div>
          <div className="value">{total}</div>
        </div>
        <div className="stat-card">
          <div className="label">Completed</div>
          <div className="value">{completed}</div>
        </div>
        <div className="stat-card">
          <div className="label">Pending</div>
          <div className="value">{pending}</div>
        </div>
        <div className="stat-card">
          <div className="label">Cancelled</div>
          <div className="value">{cancelled}</div>
        </div>
        <div className="stat-card">
          <div className="label">Revenue collected</div>
          <div className="value">KSh {revenue.toLocaleString()}</div>
        </div>
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-faint)' }}>
        This is a live snapshot from your bookings table. A later version could add date-range
        filters or export-to-CSV once you have enough volume for that to matter.
      </p>
    </div>
  );
}
