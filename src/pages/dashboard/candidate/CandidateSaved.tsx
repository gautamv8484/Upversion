import { useApp } from '@/store/AppContext';
import ListingCard from '@/components/ui/ListingCard';
import { Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CandidateSaved() {
  const { currentUser, getSavedListingsForUser } = useApp();
  if (!currentUser) return null;
  const saved = getSavedListingsForUser(currentUser.id);

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-[#111111] font-[family-name:var(--font-heading)] mb-6">Saved Listings</h1>
      {saved.length === 0 ? (
        <div className="text-center py-16 bg-[#F7F7F8] rounded-lg">
          <Bookmark size={32} className="text-[#5F6368] mx-auto mb-3" />
          <h3 className="text-base font-semibold text-[#111111]">No saved listings yet</h3>
          <p className="text-sm text-[#5F6368] mt-1 mb-4">Save listings you're interested in to find them later</p>
          <Link to="/explore" className="text-sm font-medium text-[#C1121F] hover:text-[#9B0D18]">Browse listings →</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {saved.map(l => <ListingCard key={l.id} listing={l} />)}
        </div>
      )}
    </div>
  );
}
