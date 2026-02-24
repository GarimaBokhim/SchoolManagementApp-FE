'use client';

import { UserCheck, X } from 'lucide-react';
import {
  ConvertToStudentData,
  ConvertToStudentModalProps,
} from '../types/IApplicants';
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

  const handleOnClose = () => {
    if (onClose) onClose();
  };

  if (!isOpen || !selectedApplicant) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center 
                 bg-black/40 backdrop-blur-sm ml-12 md:ml-64 sm:ml-16 xs:ml-0"
      onClick={handleOnClose}
    >
      <div
        className="bg-[#FBFBFB] dark:bg-[#27272a] 
                   w-full max-w-[95vw] md:max-w-[85vw] lg:max-w-[75vw] xl:max-w-[70vw]
                   max-h-[95vh] md:max-h-[92vh] h-auto 
                   rounded-lg overflow-auto p-6 md:p-8 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50 flex items-center gap-2">
            <UserCheck size={20} className="text-purple-600" />
            Convert to Student
          </h1>

          <button
            type="button"
            onClick={handleOnClose}
            className="text-red-400 text-2xl hover:text-red-500"
          >
            <X strokeWidth={3} />
          </button>
        </div>

        <ConvertToStudentForm
          selectedApplicant={selectedApplicant}
          conversionData={conversionData}
          convertingId={convertingId}
          onInputChange={onInputChange}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
};

export default ConvertToStudentModal;