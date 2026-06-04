export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold text-[#111111] font-[family-name:var(--font-heading)] mb-8">Privacy Policy</h1>
      <div className="prose prose-sm text-[#5F6368] space-y-6">
        <p className="leading-relaxed">Last updated: January 2025</p>
        <section>
          <h2 className="text-lg font-semibold text-[#111111] font-[family-name:var(--font-heading)] mb-2">1. Information We Collect</h2>
          <p className="leading-relaxed">We collect information you provide directly, such as name, email, resume, and profile data. We also collect usage data through cookies and analytics.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-[#111111] font-[family-name:var(--font-heading)] mb-2">2. How We Use Your Information</h2>
          <p className="leading-relaxed">Your information is used to provide and improve our services, match candidates with opportunities, and communicate with you about your account.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-[#111111] font-[family-name:var(--font-heading)] mb-2">3. Data Sharing</h2>
          <p className="leading-relaxed">We share your profile and application data with recruiters when you apply to listings. We do not sell your personal data to third parties.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-[#111111] font-[family-name:var(--font-heading)] mb-2">4. Data Security</h2>
          <p className="leading-relaxed">We implement appropriate security measures to protect your data. However, no method of transmission over the internet is 100% secure.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-[#111111] font-[family-name:var(--font-heading)] mb-2">5. Your Rights</h2>
          <p className="leading-relaxed">You have the right to access, modify, or delete your personal data. Contact us at privacy@Upversion.com for any requests.</p>
        </section>
      </div>
    </div>
  );
}
