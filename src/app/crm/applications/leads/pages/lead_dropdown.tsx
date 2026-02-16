'use client';

import { useEffect, useRef } from 'react';
import { Eye, Edit, UserPlus } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  countryInterest?: string;
  status: 'new' | 'contacted' | 'qualified' | 'lost';
}

interface LeadActionsDropdownProps {
  lead: Lead;
  isOpen: boolean;
  onClose: () => void;
  onViewDetails: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onConvert: (lead: Lead) => void;
}

const LeadActionsDropdown = ({ 
  lead, 
  isOpen, 
  onClose, 
  onViewDetails, 
  onEdit, 
  onConvert 
}: LeadActionsDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 mt-10 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors"
        onClick={() => {
          onViewDetails(lead);
          onClose();
        }}
      >
        <Eye size={16} className="text-blue-600" />
        <span>View Details</span>
      </button>
      
      <button
        className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors"
        onClick={() => {
          onEdit(lead);
          onClose();
        }}
      >
        <Edit size={16} className="text-green-600" />
        <span>Edit</span>
      </button>
      
      <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
      
      <button
        className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors"
        onClick={() => {
          onConvert(lead);
          onClose();
        }}
      >
        <UserPlus size={16} className="text-purple-600" />
        <span>Convert to Applicant</span>
      </button>
    </div>
  );
};

export default LeadActionsDropdown;