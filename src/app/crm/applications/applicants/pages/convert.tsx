'use client';

import { X } from 'lucide-react';
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
  onSuccess,
}: ConvertToStudentModalProps) => {
  if (!isOpen || !selectedApplicant) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center 
                 bg-black/40 backdrop-blur-sm ml-12 md:ml-64 sm:ml-16 xs:ml-0"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-[#353535] rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Convert to Student</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={18} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-4 flex-1">
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