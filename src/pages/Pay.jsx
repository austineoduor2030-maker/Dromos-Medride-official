import { Link } from 'react-router-dom';
import { Wallet } from 'lucide-react';
import PageHero from '../components/site/PageHero';
import { SITE } from '../lib/siteConfig';

export default function Pay() {
  return (
    <>
      <PageHero eyebrow="Payments" title="Pay via M-Pesa" text="Simple and manual for now — an in-site M-Pesa (STK push) payment is planned." />
      <section className="section wrap narrow">
        <div className="pay-card reveal">
          <Wallet size={40} />
          <div className="pay-label">M-Pesa till / account number</div>
          <div className="pay-num">{SITE.mpesaTill}</div>
          <ol>
            <li>Open M-Pesa and choose <b>Lipa na M-Pesa → Buy Goods</b>.</li>
            <li>Enter the till / account number above and the trip amount shown when you booked.</li>
            <li>Keep the M-Pesa confirmation message.</li>
          </ol>
        </div>
        <div className="center"><Link to="/book" className="btn-cta">Book a ride</Link></div>
      </section>
    </>
  );
}
