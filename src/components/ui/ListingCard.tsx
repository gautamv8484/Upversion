import { Link } from 'react-router-dom';
import { MapPin, Clock, Bookmark, BookmarkCheck, Users, Eye, Zap } from 'lucide-react';
import { Listing } from '@/types';
import { useApp } from '@/store/AppContext';
import Badge, { getTypeBadge, getWorkModeBadge } from './Badge';
import { formatSalary, timeAgo } from '@/utils/cn';

interface ListingCardProps {
  listing: Listing;
  compact?: boolean;
  showSave?: boolean;
}

export default function ListingCard({ listing, compact = false, showSave = true }: ListingCardProps) {
  const { toggleSaveListing, isListingSaved, getCompanyById, currentUser } = useApp();
  const company = getCompanyById(listing.companyId);
  const saved = isListingSaved(listing.id);
  const typeBadge = getTypeBadge(listing.type);
  const modeBadge = getWorkModeBadge(listing.workMode);

  const salary = listing.type === 'job'
    ? formatSalary(listing.salaryMin, listing.salaryMax, 'salary')
    : listing.type === 'internship'
    ? formatSalary(listing.stipendMin, listing.stipendMax, 'stipend')
    : formatSalary(listing.budgetMin, listing.budgetMax, 'budget');

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaveListing(listing.id);
  };

  return (
    <div className="card-hover group relative bg-white border border-[#E5E7EB] rounded-xl p-5 hover:border-gray-300 hover:shadow-lg">
      {listing.featured && (
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            <Zap size={10} className="fill-amber-600 text-amber-600" /> Featured
          </span>
        </div>
      )}

      <Link to={`/listing/${listing.slug}`} className="block">
        {/* Company Info */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-11 h-11 bg-gray-100 rounded-lg border border-[#E5E7EB] flex items-center justify-center shrink-0 overflow-hidden">
            {company?.logoFile || company?.logoUrl ? (
              <img
                src={company.logoFile || company.logoUrl}
                alt={company.companyName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-base font-bold text-gray-700">
                {company?.companyName?.charAt(0) || '?'}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[#5F6368] truncate">{company?.companyName}</p>
            <h3 className="font-semibold text-[#111111] leading-tight mt-0.5 group-hover:text-[#C1121F] transition-colors line-clamp-2 pr-8">
              {listing.title}
            </h3>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <Badge variant={typeBadge.variant}>{typeBadge.label}</Badge>
          <Badge variant={modeBadge.variant}>{modeBadge.label}</Badge>
          {listing.experienceLevel !== 'any' && (
            <Badge variant="outline" className="capitalize">{listing.experienceLevel}</Badge>
          )}
        </div>

        {/* Skills */}
        {!compact && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {listing.skillsRequired.slice(0, 3).map(skill => (
              <span key={skill} className="text-xs px-2 py-0.5 bg-gray-50 text-gray-600 rounded border border-gray-200">
                {skill}
              </span>
            ))}
            {listing.skillsRequired.length > 3 && (
              <span className="text-xs px-2 py-0.5 bg-gray-50 text-gray-500 rounded border border-gray-200">
                +{listing.skillsRequired.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[#F3F4F6]">
          <div className="flex items-center gap-3 text-xs text-[#5F6368]">
            <span className="flex items-center gap-1">
              <MapPin size={11} /> {listing.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={11} /> {timeAgo(listing.createdAt)}
            </span>
          </div>
          <div className="text-xs font-semibold text-[#111111]">
            {salary !== 'Not specified' ? salary : ''}
          </div>
        </div>

        {/* Meta stats */}
        {(listing.viewCount || listing.applicationCount) ? (
          <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400">
            {listing.viewCount ? (
              <span className="flex items-center gap-1"><Eye size={10} /> {listing.viewCount} views</span>
            ) : null}
            {listing.applicationCount ? (
              <span className="flex items-center gap-1"><Users size={10} /> {listing.applicationCount} applicants</span>
            ) : null}
          </div>
        ) : null}
      </Link>

      {/* Save Button */}
      {showSave && currentUser?.role === 'candidate' && (
        <button
          onClick={handleSave}
          className="absolute bottom-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-[#C1121F] hover:bg-red-50 transition-all"
          title={saved ? 'Remove from saved' : 'Save listing'}
        >
          {saved ? (
            <BookmarkCheck size={16} className="text-[#C1121F]" />
          ) : (
            <Bookmark size={16} />
          )}
        </button>
      )}
    </div>
  );
}