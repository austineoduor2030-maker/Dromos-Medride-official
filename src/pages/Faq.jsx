import PageHero from '../components/site/PageHero';
import FaqList from '../components/site/FaqList';
import { FAQS } from '../lib/siteConfig';

export default function Faq() {
  return (
    <>
      <PageHero eyebrow="FAQs" title="Frequently asked questions" text="Quick answers about booking, cost, safety and payment." />
      <section className="section wrap narrow"><FaqList items={FAQS} /></section>
    </>
  );
}
