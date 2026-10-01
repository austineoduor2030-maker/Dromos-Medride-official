import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function AdminUsers() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      setProfiles(data || []);
      setLoading(false);
    })();
  }, []);

  return (
    <div>
      <div className="admin-topbar">
        <h2 style={{ fontSize: 18, fontWeight: 500, margin: 0 }}>Users</h2>
      </div>
      <p style={{ fontSize: 12.5, color: 'var(--text-muted)', marginBottom: 16 }}>
        Only passengers who created an account appear here — most bookings come from guests
        (no account), which is expected and tracked under Trips instead.
      </p>

      {loading ? (
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Loading...</p>
      ) : profiles.length === 0 ? (
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No registered accounts yet.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Phone</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((p) => (
              <tr key={p.id}>
                <td>{p.phone}</td>
                <td>{new Date(p.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
