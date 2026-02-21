"use client";

import { useState, useEffect } from 'react';
import { UserCheck, X } from 'lucide-react';
import { api } from '@/utils/instance';
import { Applicant, ConvertToStudentPayload } from '../types';
import { Toast } from '@/components/Toast/toast';

interface ConvertToStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedApplicant: Applicant | null;
  onSuccess: () => void;
}

const inputClass = `w-full px-4 py-2.5 border rounded-lg border-gray-300 dark:border-gray-600 
  bg-white dark:bg-[#1f1f22] text-gray-800 dark:text-gray-100
  focus:ring-2 focus:ring-purple-500 focus:border-transparent
  placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm`;

export const ConvertToStudentModal = ({
  isOpen,
  onClose,
  selectedApplicant,
  onSuccess,
}: ConvertToStudentModalProps) => {
  const [formData, setFormData] = useState<ConvertToStudentPayload>({
    userId: '',
    universityName: '',
    visaId: '',
  });
  const [converting, setConverting] = useState(false);

  useEffect(() => {
    if (selectedApplicant) {
      setFormData({
        userId: selectedApplicant.userId || selectedApplicant.id,
        universityName: '',
        visaId: '',
      });
    }
  }, [selectedApplicant]);

  if (!isOpen || !selectedApplicant) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setConverting(true);
      await api.post('/api/Enrolments/ConvertToStudents', formData);
      Toast.success('Successfully converted to student!');
      onSuccess();
      onClose();
    } catch (error: any) {
      Toast.error(
        `Error: ${error.response?.data?.message || error.message || 'Failed to convert to student'}`
      );
    } finally {
      setConverting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center
                 bg-black/40 backdrop-blur-sm ml-12 md:ml-64 sm:ml-16 xs:ml-0"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className="bg-[#FBFBFB] dark:bg-[#27272a]
                   w-full max-w-[95vw] md:max-w-[85vw] lg:max-w-[75vw] xl:max-w-[70vw]
                   max-h-[95vh] md:max-h-[92vh] h-auto
                   rounded-lg overflow-auto p-6 md:p-8 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <fieldset disabled={converting}>
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50 flex items-center gap-2">
              <UserCheck size={20} />
              Convert to Student
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
            Converting applicant{' '}
           
          </p>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">

              {/* University Name */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  University Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="universityName"
                  value={formData.universityName}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Harvard University"
                  className={inputClass}
                />
              </div>

              {/* Visa ID */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Visa ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="visaId"
                  value={formData.visaId}
                  onChange={handleChange}
                  required
                  placeholder="e.g., V-123456"
                  className={inputClass}
                />
              </div>

            </div>

            {/* Submit Button */}
            <div className="flex justify-center mt-6">
              <button
                type="submit"
                disabled={converting}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg
                           disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2
                           font-medium shadow-md transition-colors"
              >
                {converting ? (
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
      </div>
    </div>
  );
};