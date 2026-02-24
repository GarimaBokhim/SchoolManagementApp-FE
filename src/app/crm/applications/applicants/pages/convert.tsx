'use client';

import { X, UserCheck } from 'lucide-react';
import { ConvertToStudentModalProps } from '../types/IApplicants';
import ConvertToStudentForm from '../compontents/ConvertToStudentForm';

const ConvertToStudentModal = ({
  isOpen,
  onClose,
  selectedApplicant,
  conversionData,
  convertingId,
  onInputChange,
  onSubmit,
}: ConvertToStudentModalProps) => {
  if (!isOpen || !selectedApplicant) return null;

  const handleBackdropClick = () => {
    // ✅ FIX: Prevent closing modal while conversion is in progress
    if (convertingId) return;
    if (onClose) onClose();
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      {/* Modal container — stop clicks from bubbling to backdrop */}
      <div
        className="bg-white dark:bg-[#2a2b2e] rounded-2xl shadow-2xl w-full max-w-2xl
                   border border-gray-200 dark:border-gray-700 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
            <UserCheck size={20} />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Convert to Student
            </h2>
          </div>

          {/* ✅ FIX: Disable close button while converting */}
          <button
            onClick={handleBackdropClick}
            disabled={!!convertingId}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100
                       dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700
                       transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <ConvertToStudentForm
            selectedApplicant={selectedApplicant}
            conversionData={conversionData}
            convertingId={convertingId}
            onInputChange={onInputChange}
            onSubmit={onSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default ConvertToStudentModal;