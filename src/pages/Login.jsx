import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Header from '../components/Header';

export default function Login() {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Supabase Auth is email-based by default; this maps the phone number
  // to a placeholder email internally so patients can still log in with
  // just a phone number, which is what they'll actually have on hand.
  const emailFor = (p) => `${p.replace(/\D/g, '')}@dromosmedride.local`;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!phone.trim() || !password.trim()) {
      setError('Enter both your phone number and password.');
      return;
    }
    setLoading(true);

    const email = emailFor(phone);

    if (mode === 'login') {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (authError) { setError(authError.message); return; }
    } else {
      const { data, error: authError } = await supabase.auth.signUp({ email, password });
      if (!authError && data.user) {
        await supabase.from('profiles').insert({ id: data.user.id, phone });
      }
      setLoading(false);
      if (authError) { setError(authError.message); return; }
    }

    localStorage.setItem('dromos_last_phone', phone);
    navigate('/my-rides');
  }

  return (
    <div>
      <Header />
      <div className="page" style={{ maxWidth: 380 }}>
        <div style={{ display: 'flex', gap: 4, background: '#EAE6D8', borderRadius: 8, padding: 3, marginBottom: 20 }}>
          {['login', 'signup'].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                flex: 1,
                textAlign: 'center',
                padding: 8,
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                background: mode === m ? '#fff' : 'transparent',
                color: mode === m ? 'var(--navy)' : 'var(--text-faint)',
              }}
            >
              {m === 'login' ? 'Log in' : 'Sign up'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Phone number</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="07XX XXX XXX" />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {error && <div className="error-text" style={{ marginBottom: 10 }}>{error}</div>}

          <button className="btn-primary" type="submit" disabled={loading} style={{ marginBottom: 10 }}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Log in' : 'Sign up'}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-faint)', margin: '10px 0', position: 'relative' }}>
          <span style={{ background: 'var(--cream)', padding: '0 8px', position: 'relative', zIndex: 1 }}>or</span>
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'var(--border)', zIndex: 0 }} />
        </div>

        <button className="btn-secondary" onClick={() => navigate('/book')} style={{ background: '#fff', color: 'var(--navy)', border: '1px solid var(--navy)' }}>
          Continue as guest
        </button>
        <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-faint)', marginTop: 8 }}>
          No account needed to book a ride.
        </div>
      </div>
    </div>
  );
}
