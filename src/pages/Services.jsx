import { Link } from 'react-router-dom';
import { Accessibility, HeartHandshake, Users, Siren, CalendarCheck, Car } from 'lucide-react';
import PageHero from '../components/site/PageHero';

const ITEMS = [
  { Icon: Car, t: 'Non-emergency hospital rides', d: 'Dependable rides to clinics, dialysis, chemotherapy, physiotherapy and follow-up appointments — home to appointment.' },
  { Icon: Accessibility, t: 'Wheelchair-accessible vehicles', d: 'Available now, for patients who can’t transfer to a standard car.' },
  { Icon: HeartHandshake, t: 'Trained caregivers', d: 'Assigned to any ride that needs hands-on assistance (not every ride), helping with getting in, out and settled.' },
  { Icon: Users, t: 'Companion riders', d: 'A family member or companion can ride along with the patient.' },
  { Icon: Siren, t: 'Emergency handling', d: 'Ambulance contacts are on hand, and we escalate immediately if a patient’s condition changes mid-trip.' },
  { Icon: CalendarCheck, t: 'One-off and package rides', d: 'A flat fee for one-off trips within a set radius, or a package rate for regular rides. Each trip is booked individually.' },
];

export default function Services() {
  return (
    <>
      <PageHero eyebrow="Services" title="Rides designed around patients" text="Not a generic taxi service — a care-coordination service that happens to include the ride." />
      <section className="section wrap">
        <div className="grid3">
          {ITEMS.map(({ Icon, t, d }) => (
            <div key={t} className="svc static reveal"><span className="svc-ic"><Icon size={26} /></span><h3>{t}</h3><p>{d}</p></div>
          ))}
        </div>
        <div className="center"><Link to="/book" className="btn-cta">Book a ride</Link></div>
      </section>
    </>
  );
}
