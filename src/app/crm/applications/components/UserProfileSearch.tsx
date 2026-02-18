'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { UserProfile } from '../types/leads';

interface UserProfileSearchProps {
  onSearch: (query: string) => void;
  onSelectProfile: (profile: UserProfile) => void;
}

export const UserProfileSearch = ({ onSearch, onSelectProfile }: UserProfileSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        await onSearch(searchQuery);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, onSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowResults(true);
  };

  const handleSelectProfile = (profile: UserProfile) => {
    onSelectProfile(profile);
    setSearchQuery('');
    setShowResults(false);
    setSearchResults([]);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => searchQuery.trim() && setShowResults(true)}
          placeholder="Search profile"
          className="w-full sm:w-80 pl-10 pr-10 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#00786f]"></div>
          </div>
        )}
      </div>

      {showResults && searchResults.length > 0 && (
        <div className="absolute top-full left-0 mt-2 w-full sm:w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
          {searchResults.map((profile) => (
            <div
              key={profile.id}
              className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b last:border-b-0"
              onClick={() => handleSelectProfile(profile)}
            >
              <div className="font-medium text-gray-800 dark:text-white">
                {profile.fullName}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {profile.email} • {profile.contactNumber}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};