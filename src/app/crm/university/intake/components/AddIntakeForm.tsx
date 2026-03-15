'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X, Save } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { api } from '@/utils/instance';
import toast from 'react-hot-toast';
import { AppCombobox } from '@/components/Input/ComboBox';
import useErrorHandler from '@/components/helpers/ErrorHandling';
import { ICourse, IIntakeFormData, IMonthOption, MONTH_OPTIONS } from '../types/IIntakes';

interface AddIntakeFormProps {
  form: UseFormReturn<IIntakeFormData>;
  onClose: () => void;
  onSuccess?: () => void;
}

const inputClass = `w-full px-4 py-2.5 border rounded-lg border-gray-300 dark:border-gray-600 
  bg-white dark:bg-[#1f1f22] text-gray-800 dark:text-gray-100
  focus:ring-2 focus:ring-green-500 focus:border-transparent
  placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm`;

const labelClass = `block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300`;

export const AddIntakeForm: React.FC<AddIntakeFormProps> = ({
  form,
  onClose,
  onSuccess,
}) => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<IMonthOption | null>(MONTH_OPTIONS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { handleError, clearError } = useErrorHandler();

  const fetchCourses = useCallback(async () => {
    try {
      const res = await api.get('/api/AcademicPrograms/GetAllCourse');
      setCourses(res.data?.Items ?? []);
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Initialize selectedMonth from form default values
  useEffect(() => {
    const currentMonth = form.getValues('month');
    const monthOption = MONTH_OPTIONS.find(m => m.id === currentMonth);
    if (monthOption) {
      setSelectedMonth(monthOption);
    }
  }, [form]);

  const handleSubmit = async (data: IIntakeFormData) => {
    clearError();

    if (!data.courseId) {
      setError('Please select a course.');
      return;
    }

    if (!data.month) {
      setError('Please select an intake month.');
      return;
    }

    if (!data.deadline) {
      setError('Please select a deadline date.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        ...data,
        deadline: new Date(data.deadline).toISOString(),
      };

      await api.post('/api/AcademicPrograms/AddIntake', payload);
      
      toast.success('Intake added successfully!');
      form.reset({
        month: 1,
        deadline: '',
        isOpen: true,
        courseId: '',
      });
      setSelectedCourse(null);
      setSelectedMonth(MONTH_OPTIONS[0]);
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

  // Watch isOpen value for the toggle
  const isOpen = form.watch('isOpen');

  return (
    <fieldset disabled={isSubmitting} className="min-w-0">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
          Add New Intake
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
          Intake Information
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start mb-6">
          {/* Course */}
          <div className="flex flex-col gap-1 lg:col-span-2">
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

          {/* Month — combobox with enum 1–12 */}
          <div className="flex flex-col gap-1">
            <label className={labelClass}>
              Intake Month <span className="text-red-500">*</span>
            </label>
            <AppCombobox
              label="Select Month"
              name="month"
              form={form}
              options={MONTH_OPTIONS}
              selected={selectedMonth}
              dropDownWidth="w-full"
              dropdownPositionClass="absolute"
              onSelect={(month) => {
                setSelectedMonth(month);
                form.setValue('month', month?.id ?? 1, { shouldValidate: true });
                setError(null);
              }}
              getLabel={(month) => month?.name ?? ''}
              getValue={(month) => month?.id ?? 1}
              placeholder="Search month..."
        
            />
            {form.formState.errors.month && (
              <p className="text-red-500 text-xs mt-1">{form.formState.errors.month.message}</p>
            )}
          </div>

          {/* Deadline */}
          <div className="flex flex-col gap-1">
            <label className={labelClass}>
              Deadline <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              {...form.register('deadline', { required: 'Deadline is required' })}
              className={inputClass}
            />
            {form.formState.errors.deadline && (
              <p className="text-red-500 text-xs mt-1">{form.formState.errors.deadline.message}</p>
            )}
          </div>

          {/* Status - Modern Toggle Switch */}
          <div className="flex flex-col gap-1">
            <label className={labelClass}>
              Status <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center h-[42px]">
              <button
                type="button"
                onClick={() => form.setValue('isOpen', !isOpen, { shouldValidate: true })}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                  ${isOpen 
                    ? 'bg-green-600 dark:bg-green-500' 
                    : 'bg-gray-300 dark:bg-gray-600'}
                `}
                role="switch"
                aria-checked={isOpen}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-6' : 'translate-x-1'}
                  `}
                />
              </button>
              <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                {isOpen ? 'Open' : 'Closed'}
              </span>
            </div>
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
            {isSubmitting ? 'Saving...' : 'Save Intake'}
          </button>
        </div>
      </form>
    </fieldset>
  );
};