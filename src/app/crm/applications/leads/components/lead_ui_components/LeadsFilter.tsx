"use client";

import { UseFormReturn } from 'react-hook-form';
import DateRangeFilter, { DateRangeFilterRef } from '@/components/DateFilter/FilterComponent';
import { AppCombobox } from '@/components/Input/ComboBox';
import { ButtonElement } from '@/components/Buttons/ButtonElement';
import { Filter, RotateCcw } from 'lucide-react';
import { FilterFormData, UserProfile } from '../../types/ILeads';

interface LeadsFilterProps {
  openFilter: boolean;
  filterForm: UseFormReturn<FilterFormData>;
  dateFilterRef: React.RefObject<DateRangeFilterRef | null>;
  selectedProfile?: UserProfile;
  searchResults: UserProfile[];
  isSearching: boolean;
  onFilterSubmit: (data: FilterFormData) => void;
  onProfileSelected: (profile: UserProfile | null) => void;
  onFetchUsers: (search: string) => void;
  onClear: () => void;
  setParams: (params: string) => void;
}

export const LeadsFilter = ({ 
  openFilter,
  filterForm,
  dateFilterRef,
  selectedProfile,
  searchResults,
  isSearching,
  onFilterSubmit,
  onProfileSelected,
  onFetchUsers,
  onClear,
  setParams
}: LeadsFilterProps) => {
  if (!openFilter) return null;

  return (
    <div className="mb-6 mx-4 bg-white dark:bg-[#353535] p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
      <form
        onSubmit={filterForm.handleSubmit(onFilterSubmit)}
        className="flex flex-wrap items-end gap-4 md:gap-6"
      >
        <DateRangeFilter
          ref={dateFilterRef}
          form={filterForm}
          onSubmit={onFilterSubmit}
          setParams={setParams}
        />

        <div className="flex-1 min-w-[240px]">
          <AppCombobox
            value={selectedProfile?.fullName || ""}
            dropDownWidth="w-full"
            dropdownPositionClass="absolute"
            label="Search Users"
            name="firstName"
            form={filterForm}
            options={searchResults}
            selected={selectedProfile}
            onSelect={onProfileSelected}
            onFocus={() => onFetchUsers("")}
            getLabel={(profile) => profile?.fullName ?? ""}
            getValue={(profile) => profile?.id ?? ""}
          />
        </div>

        <div className="flex gap-2 ml-auto">
          <ButtonElement
            type="submit"
            text="Filter"
            icon={<Filter size={14} />}
            className="!bg-emerald-600 hover:!bg-emerald-700 transition-all duration-150 !text-white"
          />
          <ButtonElement
            type="button"
            text="Clear"
            icon={<RotateCcw size={14} />}
            onClick={onClear}
            className="!bg-gray-500 hover:!bg-gray-600 transition-all duration-150 !text-white"
          />
        </div>
      </form>
    </div>
  );
};