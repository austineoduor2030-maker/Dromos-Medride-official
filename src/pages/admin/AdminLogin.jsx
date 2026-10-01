import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import Logo from '../../components/Logo';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (authError) {
      setError('Incorrect email or password.');
      return;
    }
    navigate('/admin/trips');
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--navy)' }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: '28px 26px', width: 320 }}>
        <div style={{ marginBottom: 20 }}>
          <Logo />
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 18 }}>Dispatcher sign in</div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {error && <div className="error-text" style={{ marginBottom: 10 }}>{error}</div>}

          <button className="btn-secondary" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
