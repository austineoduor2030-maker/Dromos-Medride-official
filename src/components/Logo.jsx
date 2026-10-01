export default function Logo({ size = 26, dark = false }) {
  const textColor = dark ? '#fff' : 'var(--navy)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <path d="M50 8 L58 46 L50 42 L42 46 Z" fill="var(--navy)" />
        <path d="M50 92 L58 54 L50 58 L42 54 Z" fill="var(--navy)" />
        <path d="M8 50 L46 42 L42 50 L46 58 Z" fill="var(--orange)" />
        <path d="M92 50 L54 42 L58 50 L54 58 Z" fill="var(--orange)" />
        <circle cx="50" cy="50" r="46" fill="none" stroke="var(--navy)" strokeWidth="4" />
        <circle cx="50" cy="50" r="20" fill="#fff" stroke="var(--navy)" strokeWidth="2.5" />
        <rect x="46" y="41" width="8" height="18" fill="var(--orange)" />
        <rect x="41" y="46" width="18" height="8" fill="var(--orange)" />
      </svg>
      <div style={{ fontSize: Math.max(14, size * 0.55), fontWeight: 700, color: textColor }}>
        Dromos <span style={{ color: 'var(--orange)' }}>MedRide</span>
      </div>
    </div>
  );
}
