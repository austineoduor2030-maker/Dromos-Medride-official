import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

const FILTERS = ['all', 'pending', 'assigned', 'completed', 'cancelled'];

export default function AdminTrips() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    setLoading(true);
    const { data } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });
    setBookings(data || []);
    setLoading(false);
  }

  const visible = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <div>
      <div className="admin-topbar">
        <h2 style={{ fontSize: 18, fontWeight: 500, margin: 0 }}>Trips</h2>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`btn-small ${filter === f ? '' : 'outline'}`}
            style={{ textTransform: 'capitalize' }}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Loading...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Pickup</th>
              <th>Destination</th>
              <th>Date / time</th>
              <th>Type</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Fee</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((b) => (
              <tr key={b.id}>
                <td>
                  <div style={{ fontWeight: 500 }}>{b.patient_name}</div>
                  <div style={{ color: 'var(--text-faint)', fontSize: 11 }}>{b.phone}</div>
                </td>
                <td>
                  <div>{b.pickup_label || '—'}</div>
                  {b.pickup_lat != null && b.pickup_lng != null && (
                    <a
                      href={`https://www.google.com/maps?q=${b.pickup_lat},${b.pickup_lng}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: 11, color: 'var(--orange)' }}
                    >
                      View on map ↗
                    </a>
                  )}
                </td>
                <td>{b.destination}</td>
                <td>{b.requested_time && new Date(b.requested_time).toLocaleString()}</td>
                <td>{b.ride_type}</td>
                <td><span className={`badge ${b.status}`}>{b.status}</span></td>
                <td><span className={`badge ${b.payment_status}`}>{b.payment_status}</span></td>
                <td>{b.fee ? `KSh ${b.fee}` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}