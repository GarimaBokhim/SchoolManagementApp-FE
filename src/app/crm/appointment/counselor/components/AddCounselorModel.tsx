'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Save, User, Mail, Phone, AlertCircle } from 'lucide-react';
import { AddCounselorPayload } from '../types/ICounselor';

interface AddCounselorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: AddCounselorPayload) => Promise<void>;
}

// Styles matching AddLeadModal
const inputClass = `w-full px-4 py-2.5 border rounded-lg border-gray-300 dark:border-gray-600 
  bg-white dark:bg-[#1f1f22] text-gray-800 dark:text-gray-100
  focus:ring-2 focus:ring-green-500 focus:border-transparent
  placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm`

const labelClass = `block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300`

const sectionHeaderClass = `text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3`

export const AddCounselorModal = ({ isOpen, onClose, onSubmit }: AddCounselorModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddCounselorPayload>({
    defaultValues: {
      fullName: '',
      email: '',
      contactNumber: '',
    },
  });

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      setError(null);
      onClose();
    }
  };

  const onFormSubmit = async (data: AddCounselorPayload) => {
    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      reset();
      setError(null);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save counselor');
    } finally {
      setIsSubmitting(false);
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
            <div>
              <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
                Add New Counselor
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Add a new counselor to manage student inquiries and appointments
              </p>
            </div>
            <button 
              type="button" 
              onClick={handleClose} 
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <X size={24} strokeWidth={2} />
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              <div className="flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            </div>
          )}

          <form id="add-counselor-form" onSubmit={handleSubmit(onFormSubmit)}>

            {/* Personal Information Section */}
            <p className={sectionHeaderClass}>
              Personal Information
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 items-start mb-6">
              {/* Full Name */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    placeholder="Enter full name"
                    {...register('fullName', { required: 'Full name is required' })}
                    className={`${inputClass} pl-10`}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <input
                    type="email"
                    placeholder="Enter email address"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Enter a valid email address',
                      },
                    })}
                    className={`${inputClass} pl-10`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Contact Number */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <input
                    type="tel"
                    placeholder="Enter contact number"
                    {...register('contactNumber', {
                      required: 'Contact number is required',
                    })}
                    className={`${inputClass} pl-10`}
                  />
                </div>
                {errors.contactNumber && (
                  <p className="text-xs text-red-500 mt-1">{errors.contactNumber.message}</p>
                )}
              </div>
            </div>

            {/* Note: You can add more sections here if needed */}
            {/* For example: Department, Specialization, etc. */}

            {/* Submit Buttons */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 
                           bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 
                           rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700
                           text-white rounded-lg font-medium shadow-md transition-colors
                           disabled:bg-green-300 disabled:cursor-not-allowed"
              >
                <Save size={18} />
                {isSubmitting ? 'Saving...' : 'Save Counselor'}
              </button>
            </div>

          </form>
        </fieldset>
      </div>
    </div>
  );
};