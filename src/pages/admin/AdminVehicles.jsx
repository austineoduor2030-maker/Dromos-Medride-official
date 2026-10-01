import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function AdminVehicles() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('drivers').select('*').order('created_at', { ascending: false });
      setDrivers(data || []);
      setLoading(false);
    })();
  }, []);

  return (
    <div>
      <div className="admin-topbar">
        <h2 style={{ fontSize: 18, fontWeight: 500, margin: 0 }}>Vehicles</h2>
      </div>
      <p style={{ fontSize: 12.5, color: 'var(--text-muted)', marginBottom: 16 }}>
        V1 uses driver-owned vehicles, so this is the driver-partner fleet rather than a
        company-owned one — each row is one driver's registered vehicle.
      </p>

      {loading ? (
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Loading...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Plate</th>
              <th>Type</th>
              <th>Driver</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((d) => (
              <tr key={d.id}>
                <td>{d.plate_number || '—'}</td>
                <td style={{ textTransform: 'capitalize' }}>{d.vehicle_type}</td>
                <td>{d.name}</td>
                <td>
                  <span className={`badge ${d.is_available ? 'completed' : 'unpaid'}`}>
                    {d.is_available ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
