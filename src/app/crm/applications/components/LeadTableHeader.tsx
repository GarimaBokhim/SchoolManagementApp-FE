'use client';

import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Filter, Plus } from "lucide-react";

interface LeadTableHeaderProps {
  onAddLead: () => void;
  onToggleFilter: () => void;
}

export const LeadTableHeader = ({ onAddLead, onToggleFilter }: LeadTableHeaderProps) => {
  return (
    <div className="flex w-full justify-between p-3 px-4 pt-4 items-center">
      <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
        All Leads
      </h1>
      <div className="flex items-center space-x-3">
        <ButtonElement
          type="button"
          text="Filter"
          icon={<Filter size={14} />}
          onClick={onToggleFilter}
          className="!bg-[#00786f] hover:!bg-[#00635a] !text-white !font-bold transition-all duration-150 hover:shadow-md hover:scale-105"
        />

        <ButtonElement
          icon={<Plus size={24} />}
          type="button"
          text="Add New Lead"
          onClick={onAddLead}
          className="!text-md !font-bold !bg-[#00786f] hover:!bg-[#00635a] !text-white transition-all duration-150 hover:shadow-md hover:scale-105"
        />
      </div>
    </div>
  );
};