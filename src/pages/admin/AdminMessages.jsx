import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

const FILTERS = ['all', 'new', 'read', 'replied'];

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchMessages(); }, []);

  async function fetchMessages() {
    setLoading(true);
    const { data } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });
    setMessages(data || []);
    setLoading(false);
  }

  async function updateStatus(id, status) {
    await supabase.from('messages').update({ status }).eq('id', id);
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
  }

  const visible = filter === 'all' ? messages : messages.filter((m) => m.status === filter);

  return (
    <div>
      <div className="admin-topbar">
        <h2 style={{ fontSize: 18, fontWeight: 500, margin: 0 }}>Messages</h2>
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
      ) : visible.length === 0 ? (
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No messages yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {visible.map((m) => (
            <div
              key={m.id}
              style={{
                background: '#fff',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: 16,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 500 }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>
                    {[m.email, m.phone].filter(Boolean).join(' · ')}
                  </div>
                </div>
                <span className={`badge ${m.status}`}>{m.status}</span>
              </div>
              <p style={{ margin: '10px 0', fontSize: 13.5 }}>{m.message}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>
                  {m.created_at && new Date(m.created_at).toLocaleString()}
                </span>
                <div style={{ display: 'flex', gap: 6 }}>
                  {m.status !== 'read' && (
                    <button className="btn-small outline" onClick={() => updateStatus(m.id, 'read')}>Mark read</button>
                  )}
                  {m.status !== 'replied' && (
                    <button className="btn-small outline" onClick={() => updateStatus(m.id, 'replied')}>Mark replied</button>
                  )}
                  {m.email && (
                    <a className="btn-small" href={`mailto:${m.email}`}>Reply by email</a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}