import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function RequireAuth({ children }) {
  const [session, setSession] = useState(undefined); // undefined = still checking

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => listener.subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return <p style={{ padding: 24, fontSize: 13, color: 'var(--text-muted)' }}>Checking session...</p>;
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
