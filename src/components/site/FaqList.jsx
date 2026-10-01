import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FaqList({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="faq">
      {items.map((f, i) => (
        <div key={f.q} className={`faq-item ${open === i ? 'open' : ''}`}>
          <button onClick={() => setOpen(open === i ? -1 : i)}>
            <span>{f.q}</span><ChevronDown size={20} />
          </button>
          <div className="faq-a"><p>{f.a}</p></div>
        </div>
      ))}
    </div>
  );
}
