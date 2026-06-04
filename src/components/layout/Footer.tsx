import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#C1121F] rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="text-xl font-bold font-[family-name:var(--font-heading)]">Upversion</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Discover jobs, internships, and freelance work in one place.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4 font-[family-name:var(--font-heading)]">For Candidates</h4>
            <ul className="space-y-2.5">
              <li><Link to="/jobs" className="text-sm text-gray-400 hover:text-white transition-colors">Browse Jobs</Link></li>
              <li><Link to="/internships" className="text-sm text-gray-400 hover:text-white transition-colors">Internships</Link></li>
              <li><Link to="/freelance" className="text-sm text-gray-400 hover:text-white transition-colors">Freelance Projects</Link></li>
              <li><Link to="/companies" className="text-sm text-gray-400 hover:text-white transition-colors">Companies</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4 font-[family-name:var(--font-heading)]">For Recruiters</h4>
            <ul className="space-y-2.5">
              <li><Link to="/pricing" className="text-sm text-gray-400 hover:text-white transition-colors">Post a Job</Link></li>
              <li><Link to="/pricing" className="text-sm text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="/about" className="text-sm text-gray-400 hover:text-white transition-colors">About</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4 font-[family-name:var(--font-heading)]">Legal</h4>
            <ul className="space-y-2.5">
              <li><Link to="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Upversion. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">Twitter</a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">LinkedIn</a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
