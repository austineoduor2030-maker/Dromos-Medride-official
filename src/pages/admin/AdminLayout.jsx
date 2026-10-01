import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Car, Users2, UserCircle, Truck, CreditCard, BarChart3, LogOut } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import Logo from '../../components/Logo';

const LINKS = [
  { to: '/admin/trips', label: 'Trips', icon: Car },
  { to: '/admin/drivers', label: 'Drivers', icon: Users2 },
  { to: '/admin/users', label: 'Users', icon: UserCircle },
  { to: '/admin/vehicles', label: 'Vehicles', icon: Truck },
  { to: '/admin/payments', label: 'Payments', icon: CreditCard },
  { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/admin/login');
  }

  return (
    <div className="admin-shell">
      <div className="admin-sidebar" style={{ display: 'flex', flexDirection: 'column' }}>
        <Logo dark size={24} />
        <nav style={{ flex: 1 }}>
          {LINKS.map((l) => {
            const Icon = l.icon;
            return (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                <Icon size={16} strokeWidth={2} />
                {l.label}
              </NavLink>
            );
          })}
        </nav>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.25)',
            color: 'rgba(255,255,255,0.8)',
            borderRadius: 9,
            padding: '9px 12px',
            fontSize: 12.5,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          <LogOut size={15} />
          Log out
        </button>
      </div>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}
