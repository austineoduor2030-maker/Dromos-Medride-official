export default function PageHero({ eyebrow, title, text, children }) {
  return (
    <section className="page-hero">
      <div className="wrap">
        {eyebrow && <div className="eyebrow light">{eyebrow}</div>}
        <h1>{title}</h1>
        {text && <p>{text}</p>}
        {children}
      </div>
    </section>
  );
}
