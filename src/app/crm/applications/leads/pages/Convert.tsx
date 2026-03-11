'use client';

import ConvertToApplicantForm from '../components/ConvertToApplicantForm';
import { ConvertToApplicantModalProps } from '../types/ILeads';

const ConvertToApplicantModal = ({
  isOpen,
  onClose,
  selectedLead,
  conversionData,
  convertingId,
  onInputChange,
  onSubmit,
}: ConvertToApplicantModalProps) => {
  if (!isOpen || !selectedLead) return null;

  const handleOnClose = () => {
    onClose?.();
  };

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
        <ConvertToApplicantForm
          selectedLead={selectedLead}
          conversionData={conversionData}
          convertingId={convertingId}
          onInputChange={onInputChange}
          onSubmit={onSubmit}
          onClose={handleOnClose}
        />
      </div>
    </div>
  );
};

export default ConvertToApplicantModal;