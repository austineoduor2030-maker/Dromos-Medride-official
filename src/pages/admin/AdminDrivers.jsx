import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function AdminDrivers() {
  const [drivers, setDrivers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    const [{ data: d }, { data: a }] = await Promise.all([
      supabase.from('drivers').select('*').order('created_at', { ascending: false }),
      supabase.from('driver_applications').select('*').eq('review_status', 'pending').order('created_at', { ascending: false }),
    ]);
    setDrivers(d || []);
    setApplications(a || []);
    setLoading(false);
  }

  async function approveApplication(app) {
    await supabase.from('drivers').insert({
      name: app.full_name,
      phone: app.phone,
      plate_number: app.plate_number,
      vehicle_type: app.vehicle_type,
      is_available: true,
    });
    await supabase.from('driver_applications').update({ review_status: 'approved' }).eq('id', app.id);
    fetchAll();
  }

  async function toggleAvailability(driver) {
    await supabase.from('drivers').update({ is_available: !driver.is_available }).eq('id', driver.id);
    fetchAll();
  }

  if (loading) return <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Loading...</p>;

  return (
    <div>
      <div className="admin-topbar">
        <h2 style={{ fontSize: 18, fontWeight: 500, margin: 0 }}>Drivers</h2>
      </div>

      {applications.length > 0 && (
        <>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-faint)', marginBottom: 8 }}>
            PENDING APPLICATIONS ({applications.length})
          </div>
          <table className="admin-table" style={{ marginBottom: 24 }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Licence</th>
                <th>Vehicle</th>
                <th>Plate</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {applications.map((a) => (
                <tr key={a.id}>
                  <td>{a.full_name}</td>
                  <td>{a.phone}</td>
                  <td>{a.license_number}</td>
                  <td>{a.vehicle_type}</td>
                  <td>{a.plate_number}</td>
                  <td>
                    <button className="btn-small" onClick={() => approveApplication(a)}>Approve</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-faint)', marginBottom: 8 }}>
        ACTIVE DRIVERS
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Vehicle</th>
            <th>Plate</th>
            <th>Availability</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((d) => (
            <tr key={d.id}>
              <td>{d.name}</td>
              <td>{d.phone}</td>
              <td>{d.vehicle_type}</td>
              <td>{d.plate_number}</td>
              <td>
                <span className={`badge ${d.is_available ? 'completed' : 'unpaid'}`}>
                  {d.is_available ? 'Available' : 'Unavailable'}
                </span>
              </td>
              <td>
                <button className="btn-small outline" onClick={() => toggleAvailability(d)}>
                  Toggle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
