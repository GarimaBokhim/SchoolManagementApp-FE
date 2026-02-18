'use client';

import { Filter, RotateCcw } from 'lucide-react';
import { ButtonElement } from '@/components/Buttons/ButtonElement';
import { FILTER_OPTIONS } from '../constants/lead_constant';
import { UserProfileSearch } from '../components/UserProfileSearch';

interface FilterSectionProps {
  openFilter: boolean;
  activeFilter: string;
  onFilterClick: (filter: string) => void;
  onClearClick: () => void;
  onProfileSearch: (query: string) => void;
  onSelectProfile: (profile: any) => void;
}

const FilterButton = ({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3 py-1.5 text-xs sm:text-sm font-bold text-white rounded-lg transition-all duration-150 whitespace-nowrap ${
      isActive
        ? 'bg-[#00786f] shadow-lg transform scale-105'
        : 'bg-[#00786f] hover:bg-[#00635a] opacity-80 hover:opacity-100 hover:shadow-md hover:scale-105'
    }`}
  >
    {label}
  </button>
);

export const FilterSection = ({
  openFilter,
  activeFilter,
  onFilterClick,
  onClearClick,
  onProfileSearch,
  onSelectProfile
}: FilterSectionProps) => {
  if (!openFilter) return null;

  return (
    <div className="mb-6 mx-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-200 dark:bg-[#353535] dark:border-gray-700">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {FILTER_OPTIONS.map((option) => (
            <FilterButton
              key={option.value}
              label={option.label}
              isActive={activeFilter === option.value}
              onClick={() => onFilterClick(option.value)}
            />
          ))}
        </div>

        <div className="flex items-center gap-2 lg:ml-auto">
          <UserProfileSearch 
            onSearch={onProfileSearch} 
            onSelectProfile={onSelectProfile}
          />

          <ButtonElement
            type="button"
            text="Filter"
            icon={<Filter size={14} />}
            className="!bg-[#00786f] hover:!bg-[#00635a] !text-white !font-bold transition-all duration-150 hover:shadow-md hover:scale-105 whitespace-nowrap"
          />
          
          <ButtonElement
            type="button"
            text="Clear"
            icon={<RotateCcw size={14} />}
            onClick={onClearClick}
            className="!bg-[#00786f] hover:!bg-[#00635a] !text-white !font-bold transition-all duration-150 hover:shadow-md hover:scale-105 whitespace-nowrap"
          />
        </div>
      </div>
    </div>
  );
};