import { Link } from 'react-router-dom';
import { Target, Users, Shield, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <div>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#111111] font-[family-name:var(--font-heading)] leading-tight">About Upverison</h1>
          <p className="text-lg text-[#5F6368] mt-4 leading-relaxed">
            Upversion is a modern hiring marketplace built for students, professionals, freelancers, and growing teams. We believe finding work should be simple, transparent, and accessible to everyone.
          </p>
        </div>
      </section>

      <section className="bg-[#F7F7F8] border-y border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Target, title: 'Mission', desc: 'Connect talent with opportunity. Make hiring efficient, fair, and human.' },
              { icon: Users, title: 'Community', desc: 'Built for candidates, recruiters, and teams of all sizes across every industry.' },
              { icon: Shield, title: 'Trust', desc: 'Verified companies, real listings, and transparent processes.' },
              { icon: Zap, title: 'Simplicity', desc: 'Clean, fast, and focused. No bloat, no distractions, just results.' },
            ].map(v => (
              <div key={v.title}>
                <v.icon size={24} className="text-[#C1121F] mb-3" />
                <h3 className="text-base font-semibold text-[#111111] font-[family-name:var(--font-heading)] mb-2">{v.title}</h3>
                <p className="text-sm text-[#5F6368] leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-[#111111] font-[family-name:var(--font-heading)] mb-4">Join the Upversion Community</h2>
        <p className="text-sm text-[#5F6368] mb-6 max-w-md mx-auto">Whether you're looking for your next role or your next hire, Upversion is the platform for you.</p>
        <div className="flex justify-center gap-3">
          <Link to="/register" className="bg-[#C1121F] hover:bg-[#9B0D18] text-white px-6 py-2.5 rounded-lg text-sm font-medium">Get Started</Link>
          <Link to="/contact" className="border border-[#E5E7EB] hover:border-[#111111] text-[#111111] px-6 py-2.5 rounded-lg text-sm font-medium">Contact Us</Link>
        </div>
      </section>
    </div>
  );
}
