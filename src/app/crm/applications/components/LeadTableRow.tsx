'use client';

import DeleteButton from '@/components/Buttons/DeleteButton';
import { EditButton } from '@/components/Buttons/EditButton';
import DropdownMenuButton from './common_componts/drop_down';
import { Edit, Trash } from 'lucide-react';
import { ButtonElement } from '@/components/Buttons/ButtonElement';
import { Lead } from '../types/leads';
import { STATUS_COLORS } from '../constants/lead_constant';

interface LeadTableRowProps {
  lead: Lead;
  index: number;
  isDropdownOpen: boolean;
  onToggleDropdown: (e: React.MouseEvent) => void;
  onDelete: (id: string) => void;
  onEdit: (lead: Lead) => void;
  onConvert: (lead: Lead) => void;
  onCloseDropdown: () => void;
}

export const LeadTableRow = ({
  lead,
  index,
  isDropdownOpen,
  onToggleDropdown,
  onDelete,
  onEdit,
  onConvert,
  onCloseDropdown
}: LeadTableRowProps) => {
  const getStatusColor = (status: string) => {
    return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || STATUS_COLORS.default;
  };

  const buttonElement = () => (
    <ButtonElement
      icon={<Edit size={14} />}
      type="button"
      text=""
      onClick={() => onEdit(lead)}
      className="!text-xs font-bold !bg-[#00786f] hover:!bg-[#00635a] text-white transition-all duration-150 hover:shadow-md hover:scale-105"
    />
  );

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border-b border-gray-100 dark:text-gray-100 text-gray-700">
      <td className="py-1 px-4">{(index + 1).toString().padStart(2, '0')}</td>
      <td className="py-1 px-4 font-medium">{lead.name}</td>
      <td className="py-1 px-4">{lead.email}</td>
      <td className="py-1 px-4">{lead.phone}</td>
      <td className="py-1 px-4 capitalize">{lead.source}</td>
      <td className="py-1 px-4">{lead.countryInterest}</td>
      <td className="py-1 px-4">
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
          {lead.status}
        </span>
      </td>
      <td className="py-1 px-4">
        <div className="flex justify-center gap-2">
          <DeleteButton
            onConfirm={() => onDelete(lead.id)}
            headerText={<Trash size={14} />}
            content="Are you sure you want to delete this lead?"
          />
          <EditButton button={buttonElement()} />
          
          <div className="relative">
            <DropdownMenuButton
              onClick={onToggleDropdown}
              isOpen={isDropdownOpen}
            />
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <button
                  onClick={() => {
                    onConvert(lead);
                    onCloseDropdown();
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Convert to Applicant
                </button>
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
};