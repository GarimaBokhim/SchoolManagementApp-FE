'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X, Save } from 'lucide-react';
import { api } from '@/utils/instance';
import toast from 'react-hot-toast';

const MONTH_OPTIONS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

interface Course {
  id: string;
  title: string;
}

interface CourseApiResponse {
  Items: Course[];
}

interface IntakeFormData {
  month: number;
  deadline: string;
  isOpen: boolean;
  courseId: string;
}

interface AddIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const inputClass = `w-full px-4 py-2.5 border rounded-lg border-gray-300 dark:border-gray-600 
  bg-white dark:bg-[#1f1f22] text-gray-800 dark:text-gray-100
  focus:ring-2 focus:ring-green-500 focus:border-transparent
  placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm`;

const labelClass = `block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300`;

const defaultFormData: IntakeFormData = {
  month: 1,
  deadline: '',
  isOpen: true,
  courseId: '',
};

const AddIntakeModal: React.FC<AddIntakeModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<IntakeFormData>(defaultFormData);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    try {
      const res = await api.get<CourseApiResponse>('api/AcademicPrograms/FilterCourse');
      setCourses(res.data?.Items ?? []);
    } catch {
      // silently fail — dropdown will be empty
    }
  }, []);

  useEffect(() => {
    if (isOpen) fetchCourses();
  }, [isOpen, fetchCourses]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'month' ? Number(value)
        : type === 'checkbox' ? (e.target as HTMLInputElement).checked
        : value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        deadline: formData.deadline
          ? new Date(formData.deadline).toISOString()
          : new Date().toISOString(),
      };
      await api.post('/api/AcademicPrograms/AddIntake', payload);
      toast.success('Intake added successfully!');
      setFormData(defaultFormData);
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
        toast.error(`Failed to add intake: ${msg}`);
      } else if (axiosErr.request) {
        setError('No response from server. Please check your connection.');
        toast.error('No response from server.');
      } else {
        setError(axiosErr.message ?? 'An unexpected error occurred');
        toast.error('Failed to add intake. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData(defaultFormData);
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
              Add New Intake
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
              Intake Information
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start mb-6">

              {/* Course */}
              <div className="flex flex-col gap-1 lg:col-span-2">
                <label className={labelClass}>Course <span className="text-red-500">*</span></label>
                <select
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleChange}
                  required
                  className={inputClass}
                >
                  <option value="">Select a course</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              {/* Month */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Intake Month <span className="text-red-500">*</span></label>
                <select
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                  required
                  className={inputClass}
                >
                  {MONTH_OPTIONS.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>

              {/* Deadline */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Deadline <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>

              {/* Is Open */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Status <span className="text-red-500">*</span></label>
                <select
                  name="isOpen"
                  value={formData.isOpen ? 'true' : 'false'}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, isOpen: e.target.value === 'true' }))
                  }
                  className={inputClass}
                >
                  <option value="true">Open</option>
                  <option value="false">Closed</option>
                </select>
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
      </div>
    </div>
  );
};

export default AddIntakeModal;