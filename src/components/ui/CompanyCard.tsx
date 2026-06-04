import { Link } from 'react-router-dom';
import { MapPin, CheckCircle, Briefcase, Globe } from 'lucide-react';
import { Company } from '@/types';
import { useApp } from '@/store/AppContext';

interface CompanyCardProps {
  company: Company;
}

export default function CompanyCard({ company }: CompanyCardProps) {
  const { getListingsForCompany } = useApp();
  const activeListings = getListingsForCompany(company.id).filter(l => l.status === 'active');

  return (
    <Link to={`/company/${company.slug}`} className="card-hover block bg-white border border-[#E5E7EB] rounded-xl overflow-hidden hover:border-gray-300">
      {/* Cover */}
      <div className="h-20 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
        {company.coverImageFile || company.coverImageUrl ? (
          <img
            src={company.coverImageFile || company.coverImageUrl}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] to-[#333]" />
        )}
      </div>

      <div className="p-4 pt-0">
        {/* Logo */}
        <div className="-mt-6 mb-3">
          <div className="w-12 h-12 border-2 border-white rounded-lg bg-white shadow-sm overflow-hidden flex items-center justify-center">
            {company.logoFile || company.logoUrl ? (
              <img
                src={company.logoFile || company.logoUrl}
                alt={company.companyName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-lg font-bold text-gray-800">{company.companyName.charAt(0)}</span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-[#111111] flex items-center gap-1.5">
              {company.companyName}
              {company.verified && (
                <CheckCircle size={14} className="text-[#C1121F] shrink-0" />
              )}
            </h3>
            <p className="text-xs text-[#5F6368] mt-0.5">{company.industry}</p>
          </div>
        </div>

        <p className="text-xs text-[#5F6368] mt-2 line-clamp-2 leading-relaxed">
          {company.description}
        </p>

        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#F3F4F6] text-xs text-[#5F6368]">
          <span className="flex items-center gap-1">
            <MapPin size={11} /> {company.location}
          </span>
          <span className="flex items-center gap-1">
            <Briefcase size={11} /> {activeListings.length} open
          </span>
          {company.website && (
            <span className="flex items-center gap-1">
              <Globe size={11} /> Website
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}