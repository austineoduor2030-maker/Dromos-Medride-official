import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Header from '../components/Header';

const STEPS = ['pending', 'assigned', 'completed'];

export default function MyRides() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyBookings();
  }, []);

  async function fetchMyBookings() {
    setLoading(true);
    // Guest bookings are matched by the phone number saved locally at
    // booking time (see BookingForm.jsx). A signed-in user would instead
    // be matched by their auth user id once that's wired up server-side.
    const savedPhone = localStorage.getItem('dromos_last_phone');
    let query = supabase.from('bookings').select('*').order('created_at', { ascending: false });
    if (savedPhone) query = query.eq('phone', savedPhone);
    const { data } = await query;
    setBookings(data || []);
    setLoading(false);
  }

  async function cancelBooking(id) {
    await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', id);
    fetchMyBookings();
  }

  const upcoming = bookings.filter((b) => b.status === 'pending' || b.status === 'assigned');
  const past = bookings.filter((b) => b.status === 'completed' || b.status === 'cancelled');

  return (
    <div>
      <Header />
      <div className="page">
        <h2 style={{ fontSize: 17, fontWeight: 500, marginBottom: 16 }}>My rides</h2>

        {loading ? (
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Loading...</p>
        ) : (
          <>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-faint)', marginBottom: 8 }}>
              UPCOMING
            </div>
            {upcoming.length === 0 && (
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>No upcoming rides.</p>
            )}
            {upcoming.map((b) => {
              const stepIndex = STEPS.indexOf(b.status);
              return (
                <div key={b.id} className="card" style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{b.destination}</div>
                    <span className={`badge ${b.status}`}>{b.status}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                    {STEPS.map((s, i) => (
                      <div key={s} style={{ display: 'contents' }}>
                        <div style={{ flex: 1, textAlign: 'center' }}>
                          <div
                            style={{
                              width: 20, height: 20, borderRadius: '50%', margin: '0 auto 4px',
                              background: i <= stepIndex ? 'var(--teal)' : '#fff',
                              border: i <= stepIndex ? 'none' : '2px solid var(--border)',
                            }}
                          />
                          <div style={{ fontSize: 9.5, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{s}</div>
                        </div>
                        {i < STEPS.length - 1 && (
                          <div style={{ flex: 1, height: 2, background: i < stepIndex ? 'var(--teal)' : 'var(--border)' }} />
                        )}
                      </div>
                    ))}
                  </div>

                  {b.status === 'assigned' && (
                    <div style={{ background: 'var(--cream)', borderRadius: 8, padding: '10px 12px', fontSize: 12, marginBottom: 12 }}>
                      Driver assigned · check your notification for their details.
                    </div>
                  )}

                  <button
                    onClick={() => cancelBooking(b.id)}
                    style={{ width: '100%', background: '#fff', color: 'var(--danger-text)', border: '1px solid var(--danger-text)', borderRadius: 8, padding: 9, fontSize: 12.5, fontWeight: 500, cursor: 'pointer' }}
                  >
                    Cancel ride
                  </button>
                </div>
              );
            })}

            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-faint)', marginBottom: 8 }}>
              PAST RIDES
            </div>
            {past.length === 0 && <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No past rides yet.</p>}
            {past.map((b) => (
              <div key={b.id} className="card" style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 12.5 }}>{b.destination}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>
                    {b.requested_time && new Date(b.requested_time).toLocaleDateString()} {b.fee ? `· KSh ${b.fee}` : ''}
                  </div>
                </div>
                <span className={`badge ${b.status}`}>{b.status}</span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
