import { ButtonElement } from '@/components/Buttons/ButtonElement';
import { Filter, Plus } from 'lucide-react';

interface LeadsHeaderProps {
  onToggleFilter: () => void;
  onAddNew: () => void;
}

export const LeadsHeader = ({ onToggleFilter, onAddNew }: LeadsHeaderProps) => {
  return (
    <div className="flex w-full justify-between p-3 px-4 pt-4 items-center">
      <h1 className="text-xl font-semibold text-gray-800 dark:text-white">All Leads</h1>
      <div className="flex items-center space-x-3">
        <ButtonElement
          type="button"
          text="Filter"
          icon={<Filter size={14} />}
          onClick={onToggleFilter}
          className="!bg-emerald-600 hover:!bg-emerald-700 !text-white !font-bold"
        />
        <ButtonElement
          icon={<Plus size={20} />}
          type="button"
          text="Add"
          onClick={onAddNew}
          className="!text-md !font-bold !bg-blue-600 hover:!bg-blue-700 !text-white"
        />
      </div>
    </div>
  );
};