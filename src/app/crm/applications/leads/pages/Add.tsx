/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { api } from '@/utils/instance';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { AppCombobox } from '@/components/Input/ComboBox';

interface EnumOption {
  id: number;
  name: string;
}

const GENDER_OPTIONS: EnumOption[] = [
  { id: 1, name: 'Male' },
  { id: 2, name: 'Female' },
  { id: 3, name: 'Others' },
];

const EDUCATION_LEVEL_OPTIONS: EnumOption[] = [
  { id: 1, name: 'Plus Two / Intermediate' },
  { id: 2, name: "Bachelor's Degree" },
  { id: 3, name: "Master's Degree" },
  { id: 4, name: 'PhD / Doctorate' },
];

interface InquiryFormData {
  fullName: string;
  email: string;
  dateOfBirth: string;
  gender: number;
  contactNumber: string;
  permanentAddress: string;
  educationLevel: number;
  completionYear: string;
  currentGpa: string;
  previousAcademicQualification: string;
  source: string;
  feedBackOrSuggestion: string;
}

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const inputClass = `w-full px-4 py-2.5 border rounded-lg border-gray-300 dark:border-gray-600 
  bg-white dark:bg-[#1f1f22] text-gray-800 dark:text-gray-100
  focus:ring-2 focus:ring-green-500 focus:border-transparent
  placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm`;

const labelClass = `block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300`;

const defaultFormData: InquiryFormData = {
  fullName: '',
  email: '',
  dateOfBirth: '',
  gender: 1,
  contactNumber: '',
  permanentAddress: '',
  educationLevel: 1,
  completionYear: '',
  currentGpa: '',
  previousAcademicQualification: '',
  source: '',
  feedBackOrSuggestion: '',
};

const AddLeadModal: React.FC<AddLeadModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<InquiryFormData>(defaultFormData);
  const [selectedGender, setSelectedGender] = useState<EnumOption | null>(GENDER_OPTIONS[0]);
  const [selectedEducationLevel, setSelectedEducationLevel] = useState<EnumOption | null>(EDUCATION_LEVEL_OPTIONS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const comboForm = useForm({
    defaultValues: { gender: 1, educationLevel: 1 },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.gender) {
      setError('Please select a gender.');
      return;
    }
    if (!formData.educationLevel) {
      setError('Please select an education level.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const apiData = {
        ...formData,
        dateOfBirth: formData.dateOfBirth
          ? new Date(formData.dateOfBirth).toISOString()
          : new Date().toISOString(),
      };

      const response = await api.post('/api/Enrolments/AddInquiry', apiData);
      console.log('API Response:', response.data);
      toast.success('Inquiry saved successfully!');

      setFormData(defaultFormData);
      setSelectedGender(GENDER_OPTIONS[0]);
      setSelectedEducationLevel(EDUCATION_LEVEL_OPTIONS[0]);
      comboForm.reset({ gender: 1, educationLevel: 1 });

      if (onSuccess) onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Submission error:', error);
      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.title ||
          JSON.stringify(error.response.data) ||
          'Server error occurred';
        setError(`Error ${error.response.status}: ${errorMessage}`);
        toast.error(`Failed to save inquiry: ${errorMessage}`);
      } else if (error.request) {
        setError('No response from server. Please check your connection.');
        toast.error('Failed to save inquiry. No response from server.');
      } else {
        setError(error.message || 'An unexpected error occurred');
        toast.error('Failed to save inquiry. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData(defaultFormData);
      setSelectedGender(GENDER_OPTIONS[0]);
      setSelectedEducationLevel(EDUCATION_LEVEL_OPTIONS[0]);
      comboForm.reset({ gender: 1, educationLevel: 1 });
      setError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center
                 bg-black/40 backdrop-blur-sm ml-12 md:ml-64 sm:ml-16 xs:ml-0"
      onClick={handleClose}
    >
      <div
        className="bg-[#FBFBFB] dark:bg-[#27272a]
                   w-full max-w-[95vw] md:max-w-[85vw] lg:max-w-[75vw] xl:max-w-[70vw]
                   max-h-[95vh] md:max-h-[92vh]
                   rounded-lg overflow-auto p-6 md:p-8 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <fieldset disabled={isSubmitting} className="min-w-0">

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
              Add New Inquiry
            </h1>
            <button
              type="button"
              onClick={handleClose}
              className="text-red-400 text-2xl hover:text-red-500"
            >
              <X strokeWidth={3} />
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              <strong className="font-bold">Error: </strong>
              <span>{error}</span>
            </div>
          )}

          <form id="addLeadModalForm" onSubmit={handleSubmit}>

            {/* Personal Information */}
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              Personal Information
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start mb-6">

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Full Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Enter full name"
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter email address"
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Date of Birth <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>

              {/* Gender - Keep manual label, hide AppCombobox's internal label */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Gender <span className="text-red-500">*</span></label>
                <AppCombobox
                  label=""  // Empty label to hide the internal label
                  name="gender"
                  form={comboForm}
                  options={GENDER_OPTIONS}
                  selected={selectedGender}
                  dropDownWidth="w-full"
                  dropdownPositionClass="absolute"
                  onSelect={(option) => {
                    setSelectedGender(option);
                    setFormData((prev) => ({ ...prev, gender: option?.id ?? 1 }));
                    setError(null);
                  }}
                  getLabel={(option) => option?.name ?? ''}
                  getValue={(option) => option?.id ?? 1}
                  placeholder="Select gender..."
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Contact Number <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  required
                  placeholder="Enter phone number"
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Permanent Address</label>
                <input
                  type="text"
                  name="permanentAddress"
                  value={formData.permanentAddress}
                  onChange={handleChange}
                  placeholder="Enter permanent address"
                  className={inputClass}
                />
              </div>

            </div>

            {/* Academic Information */}
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              Academic Information
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start mb-6">

              {/* Education Level - Keep manual label, hide AppCombobox's internal label */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Education Level <span className="text-red-500">*</span></label>
                <AppCombobox
                  label=""  // Empty label to hide the internal label
                  name="educationLevel"
                  form={comboForm}
                  options={EDUCATION_LEVEL_OPTIONS}
                  selected={selectedEducationLevel}
                  dropDownWidth="w-full"
                  dropdownPositionClass="absolute"
                  onSelect={(option) => {
                    setSelectedEducationLevel(option);
                    setFormData((prev) => ({ ...prev, educationLevel: option?.id ?? 1 }));
                    setError(null);
                  }}
                  getLabel={(option) => option?.name ?? ''}
                  getValue={(option) => option?.id ?? 1}
                  placeholder="Select education level..."
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Completion Year</label>
                <input
                  type="text"
                  name="completionYear"
                  value={formData.completionYear}
                  onChange={handleChange}
                  placeholder="e.g., 2024"
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Current GPA</label>
                <input
                  type="text"
                  name="currentGpa"
                  value={formData.currentGpa}
                  onChange={handleChange}
                  placeholder="e.g., 3.5"
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Previous Academic Qualification</label>
                <input
                  type="text"
                  name="previousAcademicQualification"
                  value={formData.previousAcademicQualification}
                  onChange={handleChange}
                  placeholder="e.g., Bachelor of Science"
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Source <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Website, Referral, Social Media..."
                  className={inputClass}
                />
              </div>

            </div>

            {/* Feedback */}
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              Feedback or Suggestions
            </p>
            <textarea
              name="feedBackOrSuggestion"
              value={formData.feedBackOrSuggestion}
              onChange={handleChange}
              rows={3}
              placeholder="Enter any feedback or suggestions..."
              className={`${inputClass} resize-none`}
            />

            {/* Submit */}
            <div className="flex justify-center mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 
                           text-white rounded-lg font-medium shadow-md transition-colors
                           disabled:bg-green-300 disabled:cursor-not-allowed"
              >
                <Save size={18} />
                {isSubmitting ? 'Saving...' : 'Save Inquiry'}
              </button>
            </div>

          </form>
        </fieldset>
      </div>
    </div>
  );
};

export default AddLeadModal;