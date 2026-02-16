'use client';

import { UserPlus, X } from 'lucide-react';

interface ConvertToApplicantModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLead: {
    id: string;
    name: string;
  } | null;
  conversionData: {
    userId: string;
    passportNo: string;
    targetCountry: string;
  };
  convertingId: string | null;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ConvertToApplicantModal = ({
  isOpen,
  onClose,
  selectedLead,
  conversionData,
  convertingId,
  onInputChange,
  onSubmit
}: ConvertToApplicantModalProps) => {
  if (!isOpen || !selectedLead) return null;

  return (
    <>
      {/* Backdrop with blur */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md transform transition-all">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <UserPlus size={20} className="mr-2" />
                  Convert to Applicant
                </h2>
                <button
                  onClick={onClose}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            {/* Body */}
            <div className="p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Converting <span className="font-semibold text-purple-600 dark:text-purple-400">
                  {selectedLead.name}
                </span> to an applicant. Please provide the additional information below.
              </p>
              
              <form onSubmit={onSubmit} className="space-y-5">
                {/* User ID */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    User ID <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="userId"
                      value={conversionData.userId}
                      readOnly
                      className="w-full px-4 py-2.5 border rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-gray-400">Auto-filled</span>
                  </div>
                </div>

                {/* Passport Number */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Passport Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="passportNo"
                    value={conversionData.passportNo}
                    onChange={onInputChange}
                    required
                    placeholder="e.g., AB1234567"
                    className="w-full px-4 py-2.5 border rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* Target Country */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Target Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="targetCountry"
                    value={conversionData.targetCountry}
                    onChange={onInputChange}
                    required
                    className="w-full px-4 py-2.5 border rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select a country</option>
                    <option value="USA">🇺🇸 United States</option>
                    <option value="UK">🇬🇧 United Kingdom</option>
                    <option value="Canada">🇨🇦 Canada</option>
                    <option value="Australia">🇦🇺 Australia</option>
                    <option value="Germany">🇩🇪 Germany</option>
                    <option value="New Zealand">🇳🇿 New Zealand</option>
                    <option value="Ireland">🇮🇪 Ireland</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={convertingId === selectedLead.id}
                    className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-medium shadow-lg"
                  >
                    {convertingId === selectedLead.id ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Converting...
                      </>
                    ) : (
                      <>
                        <UserPlus size={18} className="mr-2" />
                        Convert
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConvertToApplicantModal;