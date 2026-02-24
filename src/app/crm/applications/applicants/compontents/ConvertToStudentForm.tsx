'use client';

import { UserCheck } from 'lucide-react';
import { ConvertToStudentFormProps } from '../types/IApplicants';

const ConvertToStudentForm = ({
  selectedApplicant,
  conversionData,
  convertingId,
  onInputChange,
  onSubmit,
}: ConvertToStudentFormProps) => {
  const inputClass = `w-full px-4 py-2.5 border rounded-lg border-gray-300 dark:border-gray-600 
    bg-white dark:bg-[#1f1f22] text-gray-800 dark:text-gray-100
    focus:ring-2 focus:ring-purple-500 focus:border-transparent
    placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm`;

  return (
    <fieldset disabled={convertingId === selectedApplicant.id}>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Converting applicant:{' '}
        <span className="font-semibold text-gray-700 dark:text-gray-200">
          {selectedApplicant.fullName || selectedApplicant.name}
        </span>
      </p>

      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              University Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="universityName"
              value={conversionData?.universityName ?? ""}
              onChange={onInputChange}
              required
              placeholder="e.g., Harvard University"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Visa ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="visaId"
              value={conversionData?.visaId ?? ""}
              onChange={onInputChange}
              required
              placeholder="e.g., V-123456"
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            disabled={convertingId === selectedApplicant.id}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg 
                       disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 
                       font-medium shadow-md transition-colors"
          >
            {convertingId === selectedApplicant.id ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Converting...
              </>
            ) : (
              <>
                <UserCheck size={18} />
                Convert to Student
              </>
            )}
          </button>
        </div>
      </form>
    </fieldset>
  );
};

export default ConvertToStudentForm;