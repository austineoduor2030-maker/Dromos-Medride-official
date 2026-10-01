import Logo from './Logo';

export default function Header({ right = null }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 22px',
        borderBottom: '0.5px solid var(--border)',
      }}
    >
      <Logo />
      {right}
    </div>
  );
}
