'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { X } from 'lucide-react';
import { AddAppointmentPayload } from '../types/IAppointment';
import { useGetAllLeads, useGetAllCounselorDetails } from '../hooks';
import { AppCombobox } from '@/components/Input/ComboBox';

enum AppointmentStatus {
  Scheduled = 1,
  Completed = 2,
  Cancelled = 3,
  Pending = 4,
}

const APPOINTMENT_STATUSES = [
  { value: AppointmentStatus.Scheduled, label: 'Scheduled' },
  { value: AppointmentStatus.Completed, label: 'Completed' },
  { value: AppointmentStatus.Cancelled, label: 'Cancelled' },
  { value: AppointmentStatus.Pending, label: 'Pending' },
];

interface FormValues {
  leadId: string;
  counselorId: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  notes: string;
  appointmentStatus: number;
}

interface AddAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: AddAppointmentPayload) => Promise<void>;
}

export const AddAppointmentModal = ({ isOpen, onClose, onSubmit }: AddAppointmentModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [selectedCounselor, setSelectedCounselor] = useState<any>(null);

  const { data: leads = [], isLoading: leadsLoading } = useGetAllLeads();
  const { data: counselors = [], isLoading: counselorsLoading } = useGetAllCounselorDetails();

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      appointmentStatus: AppointmentStatus.Scheduled,
    },
  });

  const handleClose = () => {
    reset();
    setSelectedLead(null);
    setSelectedCounselor(null);
    onClose();
  };

  const onFormSubmit = async (data: FormValues) => {
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
      setSelectedLead(null);
      setSelectedCounselor(null);
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
              {leadsLoading ? (
                <div className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-[#2a2a2a] text-gray-400">
                  Loading leads...
                </div>
              ) : (
                <Controller
                  name="leadId"
                  control={control}
                  rules={{ required: 'Lead is required' }}
                  render={() => (
                    <AppCombobox
                      value={selectedLead?.fullName || ''}
                      dropDownWidth="w-full"
                      dropdownPositionClass="absolute"
                      label=""
                      name="leadId"
                      form={null}
                      options={leads}
                      selected={selectedLead}
                      onSelect={(lead) => {
                        setSelectedLead(lead);
                        setValue('leadId', lead?.id ?? '', { shouldValidate: true });
                      }}
                      onFocus={() => {}}
                      getLabel={(lead) => lead?.fullName ?? ''}
                      getValue={(lead) => lead?.id ?? ''}
                      renderOptionExtra={(lead) => (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {lead.id}
                        </div>
                      )}
                    />
                  )}
                />
              )}
              {errors.leadId && (
                <p className="text-xs text-red-500">{errors.leadId.message}</p>
              )}
            </div>

            {/* Counselor */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Counselor <span className="text-red-500">*</span>
              </label>
              {counselorsLoading ? (
                <div className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-[#2a2a2a] text-gray-400">
                  Loading counselors...
                </div>
              ) : (
                <Controller
                  name="counselorId"
                  control={control}
                  rules={{ required: 'Counselor is required' }}
                  render={() => (
                    <AppCombobox
                      value={selectedCounselor?.fullName || ''}
                      dropDownWidth="w-full"
                      dropdownPositionClass="absolute"
                      label=""
                      name="counselorId"
                      form={null}
                      options={counselors}
                      selected={selectedCounselor}
                      onSelect={(counselor) => {
                        setSelectedCounselor(counselor);
                        setValue('counselorId', counselor?.id ?? '', { shouldValidate: true });
                      }}
                      onFocus={() => {}}
                      getLabel={(counselor) => counselor?.fullName ?? ''}
                      getValue={(counselor) => counselor?.id ?? ''}
                      renderOptionExtra={(counselor) => (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {counselor.email}
                        </div>
                      )}
                    />
                  )}
                />
              )}
              {errors.counselorId && (
                <p className="text-xs text-red-500">{errors.counselorId.message}</p>
              )}
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
              {errors.appointmentDate && (
                <p className="text-xs text-red-500">{errors.appointmentDate.message}</p>
              )}
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
                {errors.startTime && (
                  <p className="text-xs text-red-500">{errors.startTime.message}</p>
                )}
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
                {errors.endTime && (
                  <p className="text-xs text-red-500">{errors.endTime.message}</p>
                )}
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
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              {errors.appointmentStatus && (
                <p className="text-xs text-red-500">{errors.appointmentStatus.message}</p>
              )}
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