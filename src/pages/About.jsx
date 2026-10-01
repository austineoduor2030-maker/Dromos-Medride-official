import { Link } from 'react-router-dom';
import { GraduationCap, Award, Brain, Laptop, Pill } from 'lucide-react';
import PageHero from '../components/site/PageHero';
import { SITE } from '../lib/siteConfig';

export default function About() {
  return (
    <>
      <PageHero eyebrow="About us" title="Built from what we saw in healthcare" text="The model came from direct observation of the needs arising in healthcare and among patients’ families." />
      <section className="section wrap narrow reveal">
        <p className="lead big">{SITE.anchor}</p>
      </section>
      <section className="section tint">
        <div className="wrap">
          <div className="section-head reveal"><div className="eyebrow">Founder</div><h2>Led by a clinician</h2></div>
          <div className="grid3">
            <div className="svc static reveal"><span className="svc-ic"><GraduationCap size={26} /></span><h3>Physiotherapy</h3><p>Degree in Physiotherapy with over 5 years of clinical experience.</p></div>
            <div className="svc static reveal"><span className="svc-ic"><Award size={26} /></span><h3>Certified</h3><p>Basic Life Support and Neuroscience certifications.</p></div>
            <div className="svc static reveal"><span className="svc-ic"><Brain size={26} /></span><h3>Health systems</h3><p>A focus on health systems management.</p></div>
          </div>
        </div>
      </section>
      <section className="section wrap">
        <div className="section-head reveal"><div className="eyebrow">The team</div><h2>Built and vetted with specialists</h2></div>
        <div className="grid2">
          <div className="svc static reveal"><span className="svc-ic"><Laptop size={26} /></span><h3>Computer scientist</h3><p>Helping build and vet the booking system and the technology behind it.</p></div>
          <div className="svc static reveal"><span className="svc-ic"><Pill size={26} /></span><h3>Pharmacist</h3><p>Helping build and vet how we care for patients on the way to treatment.</p></div>
        </div>
        <div className="center"><Link to="/contact" className="btn-cta">Get in touch</Link></div>
      </section>
    </>
  );
}
