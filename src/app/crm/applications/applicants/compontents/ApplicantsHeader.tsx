"use client";

import { ButtonElement } from '@/components/Buttons/ButtonElement';
import { Filter, Plus } from 'lucide-react';
import { Toast } from '@/components/Toast/toast';

interface ApplicantsHeaderProps {
  onToggleFilter: () => void;
  canAdd?: boolean;
}

export const ApplicantsHeader = ({ onToggleFilter, canAdd = true }: ApplicantsHeaderProps) => {
  return (
    <div className="flex w-full justify-between p-3 px-4 pt-4 items-center">
      <h1 className="text-xl font-semibold text-gray-800 dark:text-white">All Applicants</h1>
      <div className="flex items-center space-x-3">
        <ButtonElement
          type="button"
          text="Filter"
          icon={<Filter size={14} />}
          onClick={onToggleFilter}
          className="!bg-emerald-600 hover:!bg-emerald-700 !text-white !font-bold"
        />

        {canAdd && (
          <ButtonElement
            icon={<Plus size={24} />}
            type="button"
            text="Add New Applicant"
            onClick={() => Toast.info('Add new applicant feature coming soon!')}
            className="!text-md !font-bold !text-white"
          />
        )}
      </div>
    </div>
  );
};