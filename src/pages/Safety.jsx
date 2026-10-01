import { Accessibility, HeartHandshake, Users, Siren, ShieldCheck } from 'lucide-react';
import PageHero from '../components/site/PageHero';

const ITEMS = [
  { Icon: Accessibility, t: 'Wheelchair-accessible vehicles', d: 'Available now — mention it when you book.' },
  { Icon: Users, t: 'Companion riders', d: 'A family member or companion is allowed to ride along with the patient.' },
  { Icon: HeartHandshake, t: 'Trained caregivers', d: 'Assigned to any ride that needs hands-on assistance.' },
  { Icon: Siren, t: 'Emergency handling', d: 'Ambulance contacts are kept on hand in case a patient’s condition changes mid-trip.' },
  { Icon: ShieldCheck, t: 'Data privacy', d: 'We don’t capture medical records. We only collect contact information, used solely for scheduling your ride.' },
];

export default function Safety() {
  return (
    <>
      <PageHero eyebrow="Trust & safety" title="Care and privacy come first" text="What we do to keep every patient safe and every family informed." />
      <section className="section wrap">
        <div className="grid3">
          {ITEMS.map(({ Icon, t, d }) => (
            <div key={t} className="svc static reveal"><span className="svc-ic"><Icon size={26} /></span><h3>{t}</h3><p>{d}</p></div>
          ))}
        </div>
      </section>
    </>
  );
}
