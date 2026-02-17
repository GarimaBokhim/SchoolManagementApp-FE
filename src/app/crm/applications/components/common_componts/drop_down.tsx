'use client';

import { MoreVertical } from 'lucide-react';

interface DropdownMenuButtonProps {
  onClick: (e: React.MouseEvent) => void;
  isOpen?: boolean;
}

const DropdownMenuButton = ({ onClick, isOpen }: DropdownMenuButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 ${
        isOpen ? 'bg-gray-100 dark:bg-gray-700' : ''
      }`}
      title="More actions"
    >
      <MoreVertical size={18} className="text-gray-600 dark:text-gray-400" />
    </button>
  );
};

export default DropdownMenuButton;