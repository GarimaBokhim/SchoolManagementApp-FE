'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { AddAppointmentPayload } from '../types/IAppointment';


// Static mock options 
const MOCK_LEADS = [
  { id: 'lead-1', name: 'Alice Turner' },
  { id: 'lead-2', name: 'Bob Martinez' },
  { id: 'lead-3', name: 'Clara Singh' },
];

const MOCK_COUNSELORS = [
  { id: 'c-1', name: 'Dr. Sarah Johnson' },
  { id: 'c-2', name: 'Prof. Michael Chen' },
  { id: 'c-3', name: 'Ms. Emily Rodriguez' },
];

const APPOINTMENT_STATUSES = [
  { value: 1, label: 'Scheduled' },
  { value: 2, label: 'Completed' },
  { value: 3, label: 'Cancelled' },
  { value: 4, label: 'Pending' },
];

interface AddAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: AddAppointmentPayload) => Promise<void>;
}

export const AddAppointmentModal = ({ isOpen, onClose, onSubmit }: AddAppointmentModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{
    leadId: string;
    counselorId: string;
    appointmentDate: string;
    startTime: string;
    endTime: string;
    notes: string;
    appointmentStatus: number;
  }>({
    defaultValues: {
      appointmentStatus: 1,
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const appointmentDate = new Date(data.appointmentDate).toISOString();
      await onSubmit({
        leadId: data.leadId,
        counselorId: data.counselorId,
        appointmentDate,
        startTime: data.startTime,
        endTime: data.endTime,
        notes: data.notes,
        appointmentStatus: Number(data.appointmentStatus),
      });
      reset();
      onClose();
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
        className="relative bg-white dark:bg-[#353535] rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Add Appointment</h2>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={18} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-4 flex-1">
          <form id="add-appointment-form" onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-4">

            {/* Lead */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Lead <span className="text-red-500">*</span>
              </label>
              <select
                {...register('leadId', { required: 'Lead is required' })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#2a2a2a] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Select Lead</option>
                {MOCK_LEADS.map((l) => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
              {errors.leadId && <p className="text-xs text-red-500">{errors.leadId.message}</p>}
            </div>

            {/* Counselor */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Counselor <span className="text-red-500">*</span>
              </label>
              <select
                {...register('counselorId', { required: 'Counselor is required' })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#2a2a2a] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Select Counselor</option>
                {MOCK_COUNSELORS.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {errors.counselorId && <p className="text-xs text-red-500">{errors.counselorId.message}</p>}
            </div>

            {/* Appointment Date */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Appointment Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register('appointmentDate', { required: 'Date is required' })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#2a2a2a] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {errors.appointmentDate && <p className="text-xs text-red-500">{errors.appointmentDate.message}</p>}
            </div>

            {/* Start Time & End Time */}
            <div className="flex gap-4">
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Start Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  {...register('startTime', { required: 'Start time is required' })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#2a2a2a] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {errors.startTime && <p className="text-xs text-red-500">{errors.startTime.message}</p>}
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  End Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  {...register('endTime', { required: 'End time is required' })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#2a2a2a] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {errors.endTime && <p className="text-xs text-red-500">{errors.endTime.message}</p>}
              </div>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                {...register('appointmentStatus', { required: 'Status is required' })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#2a2a2a] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {APPOINTMENT_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Notes
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                placeholder="Add any notes..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#2a2a2a] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-500 hover:bg-gray-600 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-appointment-form"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            {isSubmitting ? 'Saving...' : 'Save Appointment'}
          </button>
        </div>
      </div>
    </div>
  );
};