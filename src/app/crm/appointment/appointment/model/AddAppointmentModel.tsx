'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { X, Save, Calendar, Clock, User, FileText, AlertCircle, Briefcase } from 'lucide-react';
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
  { id: AppointmentStatus.Scheduled, name: 'Scheduled' },
  { id: AppointmentStatus.Completed, name: 'Completed' },
  { id: AppointmentStatus.Cancelled, name: 'Cancelled' },
  { id: AppointmentStatus.Pending, name: 'Pending' },
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

// Styles matching AddLeadModal
const inputClass = `w-full px-4 py-2.5 border rounded-lg border-gray-300 dark:border-gray-600 
  bg-white dark:bg-[#1f1f22] text-gray-800 dark:text-gray-100
  focus:ring-2 focus:ring-green-500 focus:border-transparent
  placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm`

const labelClass = `block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300`

const sectionHeaderClass = `text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3`

export const AddAppointmentModal = ({ isOpen, onClose, onSubmit }: AddAppointmentModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      leadId: '',
      counselorId: '',
      appointmentDate: '',
      startTime: '',
      endTime: '',
      notes: '',
    },
  });

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      setSelectedLead(null);
      setSelectedCounselor(null);
      setError(null);
      onClose();
    }
  };

  const onFormSubmit = async (data: FormValues) => {
    setError(null);
    
    // Validate end time is after start time
    if (data.startTime && data.endTime && data.startTime >= data.endTime) {
      setError('End time must be after start time');
      return;
    }
    
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
      setError(null);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save appointment');
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
                Add New Appointment
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Schedule a consultation or meeting with a lead
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

          <form id="add-appointment-form" onSubmit={handleSubmit(onFormSubmit)}>

            {/* Attendees Section */}
            <p className={sectionHeaderClass}>
              Attendees
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start mb-6">
              {/* Lead Selection */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>
                  Lead <span className="text-red-500">*</span>
                </label>
                {leadsLoading ? (
                  <div className={`${inputClass} bg-gray-50 dark:bg-gray-800/50 text-gray-400`}>
                    Loading leads...
                  </div>
                ) : (
                  <Controller
                    name="leadId"
                    control={control}
                    rules={{ required: 'Lead is required' }}
                    render={({ field }) => (
                      <AppCombobox
                        label=""
                        name="leadId"
                        form={null}
                        options={leads}
                        selected={selectedLead}
                        dropDownWidth="w-full"
                        dropdownPositionClass="absolute"
                        onSelect={(lead) => {
                          setSelectedLead(lead);
                          field.onChange(lead?.id ?? '');
                        }}
                        onFocus={() => {}}
                        getLabel={(lead) => lead?.fullName ?? ''}
                        getValue={(lead) => lead?.id ?? ''}
                        renderOptionExtra={(lead) => (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {lead?.email}
                          </div>
                        )}
                      />
                    )}
                  />
                )}
                {errors.leadId && (
                  <p className="text-xs text-red-500 mt-1">{errors.leadId.message}</p>
                )}
              </div>

              {/* Counselor Selection */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>
                  Counselor <span className="text-red-500">*</span>
                </label>
                {counselorsLoading ? (
                  <div className={`${inputClass} bg-gray-50 dark:bg-gray-800/50 text-gray-400`}>
                    Loading counselors...
                  </div>
                ) : (
                  <Controller
                    name="counselorId"
                    control={control}
                    rules={{ required: 'Counselor is required' }}
                    render={({ field }) => (
                      <AppCombobox
                        label=""
                        name="counselorId"
                        form={null}
                        options={counselors}
                        selected={selectedCounselor}
                        dropDownWidth="w-full"
                        dropdownPositionClass="absolute"
                        onSelect={(counselor) => {
                          setSelectedCounselor(counselor);
                          field.onChange(counselor?.id ?? '');
                        }}
                        onFocus={() => {}}
                        getLabel={(counselor) => counselor?.fullName ?? ''}
                        getValue={(counselor) => counselor?.id ?? ''}
                        renderOptionExtra={(counselor) => (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {counselor?.email}
                          </div>
                        )}
                      />
                    )}
                  />
                )}
                {errors.counselorId && (
                  <p className="text-xs text-red-500 mt-1">{errors.counselorId.message}</p>
                )}
              </div>
            </div>

            {/* Schedule Details Section */}
            <p className={sectionHeaderClass}>
              Schedule Details
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start mb-6">
              {/* Appointment Date */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>
                  Appointment Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <input
                    type="date"
                    {...register('appointmentDate', { required: 'Date is required' })}
                    className={`${inputClass} pl-10`}
                  />
                </div>
                {errors.appointmentDate && (
                  <p className="text-xs text-red-500 mt-1">{errors.appointmentDate.message}</p>
                )}
              </div>

              {/* Start Time */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>
                  Start Time <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Clock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <input
                    type="time"
                    {...register('startTime', { required: 'Start time is required' })}
                    className={`${inputClass} pl-10`}
                  />
                </div>
                {errors.startTime && (
                  <p className="text-xs text-red-500 mt-1">{errors.startTime.message}</p>
                )}
              </div>

              {/* End Time */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>
                  End Time <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Clock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <input
                    type="time"
                    {...register('endTime', { required: 'End time is required' })}
                    className={`${inputClass} pl-10`}
                  />
                </div>
                {errors.endTime && (
                  <p className="text-xs text-red-500 mt-1">{errors.endTime.message}</p>
                )}
              </div>
            </div>

            {/* Status Section */}
            <p className={sectionHeaderClass}>
              Appointment Status
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start mb-6">
              <div className="flex flex-col gap-1">
                <label className={labelClass}>
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('appointmentStatus', { required: 'Status is required', valueAsNumber: true })}
                  className={inputClass}
                >
                  {APPOINTMENT_STATUSES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                {errors.appointmentStatus && (
                  <p className="text-xs text-red-500 mt-1">{errors.appointmentStatus.message}</p>
                )}
              </div>
            </div>

            {/* Additional Information Section */}
            <p className={sectionHeaderClass}>
              Additional Information
            </p>
            <div className="grid grid-cols-1 gap-4 items-start mb-6">
              <div className="flex flex-col gap-1">
                <label className={labelClass}>
                  Notes
                </label>
                <div className="relative">
                  <FileText size={18} className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
                  <textarea
                    {...register('notes')}
                    placeholder="Enter any additional notes, agenda items, or discussion points..."
                    rows={4}
                    className={`${inputClass} pl-10 resize-none`}
                  />
                </div>
              </div>
            </div>

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
                {isSubmitting ? 'Saving...' : 'Save Appointment'}
              </button>
            </div>

          </form>
        </fieldset>
      </div>
    </div>
  );
};