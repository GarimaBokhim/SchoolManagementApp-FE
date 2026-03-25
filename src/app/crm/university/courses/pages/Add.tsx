'use client';

import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { api } from '@/utils/instance';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { AppCombobox } from '@/components/Input/ComboBox';
import { IUniversity } from '../../_university/types/IUniversity';
import {  useGetUniversities } from '../../_university/hooks';


interface CourseFormData {
  title: string;
  studyLevel: number;
  tuationFee: number;
  currency: string;
  universityId: string;
}

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface StudyLevelOption {
  id: number;
  name: string;
}

const STUDY_LEVELS: StudyLevelOption[] = [
  { id: 1, name: 'Bachelor' },
  { id: 2, name: "Undergraduate" },
  { id: 3, name: "Masters" },
   { id: 4, name: "Phd" },

];

const CURRENCIES = ['USD', 'EUR', 'GBP', 'SGD', 'AUD', 'CAD', 'NPR', 'INR'];

const inputClass = `w-full px-4 py-2.5 border rounded-lg border-gray-300 dark:border-gray-600 
  bg-white dark:bg-[#1f1f22] text-gray-800 dark:text-gray-100
  focus:ring-2 focus:ring-green-500 focus:border-transparent
  placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm`;

const labelClass = `block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300`;

const defaultFormData: CourseFormData = {
  title: '',
  studyLevel: 0,
  tuationFee: 0,
  currency: 'USD',
  universityId: '',
};

const AddCourseModal: React.FC<AddCourseModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<CourseFormData>(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUniversity, setSelectedUniversity] = useState<IUniversity | null>(null);
  const [selectedStudyLevel, setSelectedStudyLevel] = useState<StudyLevelOption | null>(null);


const { data: universities, isLoading: loadingUniversities } = useGetUniversities();

  const comboForm = useForm({
    defaultValues: { studyLevel: 0, universityId: '' },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'tuationFee' ? Number(value) : value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.studyLevel) {
      setError('Please select a study level.');
      return;
    }
    if (!formData.universityId) {
      setError('Please select a university.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await api.post('/api/AcademicPrograms/AddCourse', formData);
      toast.success('Course added successfully!');
      setFormData(defaultFormData);
      setSelectedStudyLevel(null);
      setSelectedUniversity(null);
      comboForm.reset({ studyLevel: 0, universityId: '' });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { status?: number; data?: { message?: string; title?: string } };
        request?: unknown;
        message?: string;
      };
      if (axiosErr.response) {
        const msg = axiosErr.response.data?.message || axiosErr.response.data?.title || 'Server error occurred';
        setError(`Error ${axiosErr.response.status}: ${msg}`);
        toast.error(`Failed to add course: ${msg}`);
      } else if (axiosErr.request) {
        setError('No response from server. Please check your connection.');
        toast.error('No response from server.');
      } else {
        setError(axiosErr.message ?? 'An unexpected error occurred');
        toast.error('Failed to add course. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData(defaultFormData);
      setSelectedStudyLevel(null);
      setSelectedUniversity(null);
      comboForm.reset({ studyLevel: 0, universityId: '' });
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

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
              Add New Course
            </h1>
            <button type="button" onClick={handleClose} className="text-red-400 text-2xl hover:text-red-500">
              <X strokeWidth={3} />
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              <strong className="font-bold">Error: </strong><span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              Course Information
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start mb-6">

              {/* Course Title */}
              <div className="flex flex-col gap-1 lg:col-span-2">
                <label className={labelClass}>Course Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Bachelor of Computer Science"
                  className={inputClass}
                />
              </div>

              {/* Study Level */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Study Level <span className="text-red-500">*</span></label>
                <AppCombobox
                  label="Select Study Level"
                  name="studyLevel"
                  form={comboForm}
                  options={STUDY_LEVELS}
                  selected={selectedStudyLevel}
                  dropDownWidth="w-full"
                  dropdownPositionClass="absolute"
                  onSelect={(level) => {
                    setSelectedStudyLevel(level);
                    setFormData((prev) => ({ ...prev, studyLevel: level?.id ?? 0 }));
                    setError(null);
                  }}
                  getLabel={(level) => level?.name ?? ''}
                  getValue={(level) => level?.id ?? 0}
                  placeholder="Search study level..."
                />
              </div>

              {/* Tuition Fee */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Tuition Fee <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  name="tuationFee"
                  value={formData.tuationFee}
                  onChange={handleChange}
                  required
                  min={0}
                  placeholder="e.g. 15000"
                  className={inputClass}
                />
              </div>

              {/* Currency */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Currency <span className="text-red-500">*</span></label>
                <select name="currency" value={formData.currency} onChange={handleChange} required className={inputClass}>
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* University */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>University <span className="text-red-500">*</span></label>
                <AppCombobox
                  label={loadingUniversities ? 'Loading...' : 'Select University'}
                  name="universityId"
                  form={comboForm}
                options={universities ?? []}
                  selected={selectedUniversity}
                  dropDownWidth="w-full"
                  dropdownPositionClass="absolute"
                  onSelect={(university) => {
                    setSelectedUniversity(university);
                    setFormData((prev) => ({ ...prev, universityId: university?.id ?? '' }));
                    setError(null);
                  }}
                  getLabel={(university) => university?.name ?? ''}
                  getValue={(university) => university?.id ?? ''}
                  renderOptionExtra={(university) => (
                    <span className="text-xs text-gray-400">{university?.country}</span>
                  )}
                  placeholder="Search university..."
                />
              </div>

            </div>

            <div className="flex justify-center mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700
                           text-white rounded-lg font-medium shadow-md transition-colors
                           disabled:bg-green-300 disabled:cursor-not-allowed"
              >
                <Save size={18} />
                {isSubmitting ? 'Saving...' : 'Save Course'}
              </button>
            </div>
          </form>
        </fieldset>
      </div>
    </div>
  );
};

export default AddCourseModal;