'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X, Save } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { api } from '@/utils/instance';
import toast from 'react-hot-toast';
import { AppCombobox } from '@/components/Input/ComboBox';
import { IRequirementFormData, ICourse } from '../types/IRequirement';
import useErrorHandler from '@/components/helpers/ErrorHandling';

interface AddRequirementFormProps {
  form: UseFormReturn<IRequirementFormData>;
  onClose: () => void;
  onSuccess?: () => void;
}

const inputClass = `w-full px-4 py-2.5 border rounded-lg border-gray-300 dark:border-gray-600 
  bg-white dark:bg-[#1f1f22] text-gray-800 dark:text-gray-100
  focus:ring-2 focus:ring-green-500 focus:border-transparent
  placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm`;

const labelClass = `block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300`;

export const AddRequirementForm: React.FC<AddRequirementFormProps> = ({
  form,
  onClose,
  onSuccess,
}) => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { handleError, clearError } = useErrorHandler();

  const fetchCourses = useCallback(async () => {
    try {
      const res = await api.get('/api/AcademicPrograms/GetAllCourse');
      setCourses(res.data?.Items ?? []);
    } catch {
      // silently fail — dropdown will be empty
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleSubmit = async (data: IRequirementFormData) => {
    clearError();

    if (!data.courseId) {
      setError('Please select a course.');
      return;
    }

    if (!data.descriptions.trim()) {
      setError('Please enter a description.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await api.post('/api/AcademicPrograms/AddRequirements', data);
      
      toast.success('Requirement added successfully!');
      form.reset();
      setSelectedCourse(null);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      const errorMsg = handleError(err);
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <fieldset disabled={isSubmitting} className="min-w-0">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
          Add New Requirement
        </h1>
        <button
          type="button"
          onClick={onClose}
          className="text-red-400 text-2xl hover:text-red-500"
        >
          <X strokeWidth={3} />
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
          <strong className="font-bold">Error: </strong>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          Requirement Information
        </p>

        <div className="grid grid-cols-1 gap-4 items-start mb-6">
          {/* Course — combobox from GetAllCourse */}
          <div className="flex flex-col gap-1">
            <label className={labelClass}>
              Course <span className="text-red-500">*</span>
            </label>
            <AppCombobox
              label="Select Course"
              name="courseId"
              form={form}
              options={courses}
              selected={selectedCourse}
              dropDownWidth="w-full"
              dropdownPositionClass="absolute"
              onSelect={(course) => {
                setSelectedCourse(course);
                form.setValue('courseId', course?.id ?? '', { shouldValidate: true });
                setError(null);
              }}
              getLabel={(course) => course?.title ?? ''}
              getValue={(course) => course?.id ?? ''}
              placeholder="Search course..."
             
            />
            {form.formState.errors.courseId && (
              <p className="text-red-500 text-xs mt-1">{form.formState.errors.courseId.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className={labelClass}>
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              {...form.register('descriptions', { 
                required: 'Description is required',
                minLength: { value: 10, message: 'Description must be at least 10 characters' }
              })}
              rows={4}
              placeholder="Enter requirement description..."
              className={`${inputClass} resize-none`}
            />
            {form.formState.errors.descriptions && (
              <p className="text-red-500 text-xs mt-1">{form.formState.errors.descriptions.message}</p>
            )}
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
            {isSubmitting ? 'Saving...' : 'Save Requirement'}
          </button>
        </div>
      </form>
    </fieldset>
  );
};