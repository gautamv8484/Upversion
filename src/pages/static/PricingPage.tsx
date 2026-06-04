import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    desc: 'For small teams getting started',
    features: ['Post up to 3 listings', 'Basic company profile', 'View applicants', 'Email support'],
    cta: 'Get Started',
    featured: false,
  },
  {
    name: 'Professional',
    price: '$49',
    period: '/month',
    desc: 'For growing companies',
    features: ['Unlimited listings', 'Featured listings (2/mo)', 'Verified badge', 'Applicant management', 'Priority support', 'Analytics dashboard'],
    cta: 'Start Free Trial',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    desc: 'For large organizations',
    features: ['Everything in Professional', 'Unlimited featured listings', 'Custom branding', 'API access', 'Dedicated account manager', 'SLA guarantee'],
    cta: 'Contact Sales',
    featured: false,
  },
];

export default function PricingPage() {
  return (
    <div>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#111111] font-[family-name:var(--font-heading)]">Plans for every stage</h1>
        <p className="text-lg text-[#5F6368] mt-3 max-w-lg mx-auto">Start posting for free. Upgrade when you need more reach, features, and support.</p>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {plans.map(plan => (
            <div key={plan.name} className={`rounded-xl p-6 border ${plan.featured ? 'border-[#C1121F] bg-white ring-1 ring-[#C1121F]' : 'border-[#E5E7EB] bg-white'}`}>
              {plan.featured && (
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C1121F] bg-[#FDECEE] px-2 py-0.5 rounded mb-4 inline-block">Most Popular</span>
              )}
              <h3 className="text-lg font-bold text-[#111111] font-[family-name:var(--font-heading)]">{plan.name}</h3>
              <div className="mt-2 mb-1">
                <span className="text-3xl font-bold text-[#111111] font-[family-name:var(--font-heading)]">{plan.price}</span>
                {plan.period && <span className="text-sm text-[#5F6368]">{plan.period}</span>}
              </div>
              <p className="text-sm text-[#5F6368] mb-6">{plan.desc}</p>
              <ul className="space-y-2.5 mb-6">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[#5F6368]">
                    <Check size={16} className="text-[#C1121F] mt-0.5 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/register" className={`block text-center py-2.5 rounded-lg text-sm font-medium transition-colors ${plan.featured ? 'bg-[#C1121F] hover:bg-[#9B0D18] text-white' : 'bg-[#1A1A1A] hover:bg-[#111111] text-white'}`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h2 className="text-2xl font-bold text-white font-[family-name:var(--font-heading)]">Ready to find great talent?</h2>
          <p className="text-sm text-gray-400 mt-2 mb-6">Join hundreds of companies hiring on Upversion.</p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-[#C1121F] hover:bg-[#9B0D18] text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors">
            Start Hiring <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
