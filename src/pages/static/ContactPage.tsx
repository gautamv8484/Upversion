import { Mail, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-[#111111] font-[family-name:var(--font-heading)] mb-2">Contact Us</h1>
        <p className="text-sm text-[#5F6368] mb-8">Have a question or feedback? We'd love to hear from you.</p>

        <div className="flex flex-wrap gap-6 mb-8">
          <div className="flex items-center gap-2 text-sm text-[#5F6368]">
            <Mail size={16} className="text-[#C1121F]" /> support@Upversion.com
          </div>
          <div className="flex items-center gap-2 text-sm text-[#5F6368]">
            <MapPin size={16} className="text-[#C1121F]" /> San Francisco, CA
          </div>
        </div>

        <form className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[#5F6368] mb-1.5 block">Name</label>
              <input type="text" placeholder="Your name" className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#111111]" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#5F6368] mb-1.5 block">Email</label>
              <input type="email" placeholder="you@example.com" className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#111111]" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-[#5F6368] mb-1.5 block">Subject</label>
            <input type="text" placeholder="How can we help?" className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#111111]" />
          </div>
          <div>
            <label className="text-xs font-medium text-[#5F6368] mb-1.5 block">Message</label>
            <textarea rows={6} placeholder="Your message…" className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#111111] resize-none" />
          </div>
          <button type="submit" className="bg-[#C1121F] hover:bg-[#9B0D18] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
