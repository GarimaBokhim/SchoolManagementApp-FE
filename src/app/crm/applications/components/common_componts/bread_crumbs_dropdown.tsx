'use client';

import { useEffect, useRef } from 'react';
import { MoreVertical } from 'lucide-react';

interface ActionDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  children: React.ReactNode;
}

const ActionDropdown = ({
  isOpen,
  onToggle,
  onClose,
  children,
}: ActionDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <div className="relative flex justify-center" ref={dropdownRef}>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
      >
        <MoreVertical size={18} className="text-gray-600 dark:text-gray-300" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 w-48">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionDropdown;
