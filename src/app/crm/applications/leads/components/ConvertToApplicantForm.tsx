'use client';

import { UserPlus, X } from 'lucide-react';
import { ConvertToApplicantFormProps } from '../types/ILeads';



const ConvertToApplicantForm = ({
  selectedLead,
  conversionData,
  convertingId,
  onInputChange,
  onSubmit,
  onClose,
}: ConvertToApplicantFormProps) => {
  const inputClass = `w-full px-4 py-2.5 border rounded-lg border-gray-300 dark:border-gray-600 
    bg-white dark:bg-[#1f1f22] text-gray-800 dark:text-gray-100
    focus:ring-2 focus:ring-purple-500 focus:border-transparent
    placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm`;

  return (
    <fieldset>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50 flex items-center gap-2">
          <UserPlus size={20} />
          Convert to Applicant
        </h1>
        <button
          type="button"
          onClick={onClose}
          className="text-red-400 text-2xl hover:text-red-500"
        >
          <X strokeWidth={3} />
        </button>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Converting{' '}
        <span className="font-semibold text-gray-700 dark:text-gray-200">
          {selectedLead.name}
        </span>{' '}
        to an applicant. Please provide the additional information below.
      </p>

      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
          {/* Passport Number */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Passport Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="passportNo"
              value={conversionData?.passportNo ?? ""}
              onChange={onInputChange}
              required
              placeholder="e.g., AB1234567"
              className={inputClass}
            />
          </div>

          {/* Target Country */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Target Country <span className="text-red-500">*</span>
            </label>
            <select
              name="targetCountry"
              value={conversionData?.targetCountry ?? ""}
              onChange={onInputChange}
              required
              className={inputClass}
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
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            disabled={convertingId === selectedLead.id}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg 
                       disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 
                       font-medium shadow-md transition-colors"
          >
            {convertingId === selectedLead.id ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Converting...
              </>
            ) : (
              <>
                <UserPlus size={18} />
                Convert to Applicant
              </>
            )}
          </button>
        </div>
      </form>
    </fieldset>
  );
};

export default ConvertToApplicantForm;