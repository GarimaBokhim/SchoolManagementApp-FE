'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { X, Save, Calendar, Clock, User, FileText, AlertCircle } from 'lucide-react'
import { AddFollowUpPayload } from '../types/IFollowUps'
import { useFollowUpMutations } from '../hooks/UseFollowMutation'
import { AppCombobox } from '@/components/Input/ComboBox'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/utils/instance'

interface LeadOption {
  userId: string
  fullName: string
}

interface LeadApiResponse {
  Items: LeadOption[]
}

// Fetch all leads for the combobox
const useLeadOptions = () => {
  return useQuery({
    queryKey: ['LeadOptionsForFollowUp'],
    queryFn: async (): Promise<LeadOption[]> => {
      const response = await api.get<LeadApiResponse>(
        '/api/Enrolments/AllInquiry'
      )
      return response.data?.Items ?? []
    },
    staleTime: 2 * 60 * 1000,
  })
}

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  fetchFollowUps: () => void
}

const FOLLOW_UP_STATUS_OPTIONS = [
  { id: 1, name: 'Scheduled' },
  { id: 2, name: 'Completed' },
  { id: 3, name: 'Cancelled' },
  { id: 4, name: 'Rescheduled' },
]

// Styles matching AddLeadModal
const inputClass = `w-full px-4 py-2.5 border rounded-lg border-gray-300 dark:border-gray-600 
  bg-white dark:bg-[#1f1f22] text-gray-800 dark:text-gray-100
  focus:ring-2 focus:ring-green-500 focus:border-transparent
  placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm`

const labelClass = `block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300`

const sectionHeaderClass = `text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3`

const AddFollowUpModal = ({ isOpen, onClose, onSuccess, fetchFollowUps }: Props) => {
  const { isAdding, handleAdd } = useFollowUpMutations(fetchFollowUps)
  const { data: leadOptions = [], isLoading: leadsLoading } = useLeadOptions()
  const [error, setError] = useState<string | null>(null)

  const [selectedLead, setSelectedLead] = useState<LeadOption | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<AddFollowUpPayload>({
    defaultValues: {
      userId: '',
      startTime: '',
      endTime: '',
      followUpDate: '',
      notes: '',
      followUpStatus: 1,
    },
  })

  const handleClose = () => {
    if (!isAdding) {
      reset()
      setSelectedLead(null)
      setError(null)
      onClose()
    }
  }

  const onFormSubmit = async (data: AddFollowUpPayload) => {
    setError(null)
    
    // Validate end time is after start time
    if (data.startTime && data.endTime && data.startTime >= data.endTime) {
      setError('End time must be after start time')
      return
    }

    // Format the date properly - send as YYYY-MM-DD format
    // The date input gives "YYYY-MM-DD", keep it as is for the API
    const formattedPayload = {
      ...data,
      followUpDate: data.followUpDate, // Send as YYYY-MM-DD (no time conversion)
    }

    const success = await handleAdd(formattedPayload)
    if (success) {
      reset()
      setSelectedLead(null)
      setError(null)
      onSuccess()
      onClose() // Close modal after successful addition
    }
  }

  if (!isOpen) return null

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
        <fieldset disabled={isAdding} className="min-w-0">

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
                Add New Follow Up
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Schedule a follow-up activity for an existing lead
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

          <form onSubmit={handleSubmit(onFormSubmit)}>

            {/* Lead Information Section */}
            <p className={sectionHeaderClass}>
              Lead Information
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start mb-6">
              <div className="flex flex-col gap-1">
                <label className={labelClass}>
                  Select Lead <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="userId"
                  control={control}
                  rules={{ required: 'Lead is required' }}
                  render={({ field }) => (
                    <AppCombobox<LeadOption>
                      name="userId"
                      label=""
                      required
                      options={leadsLoading ? [] : leadOptions}
                      selected={selectedLead ?? undefined}
                      getLabel={(opt) => opt.fullName}
                      getValue={(opt) => opt.userId}
                      placeholder={leadsLoading ? 'Loading leads...' : 'Search lead by name...'}
                      onSelect={(opt) => {
                        setSelectedLead(opt)
                        field.onChange(opt ? opt.userId : '')
                      }}
                    />
                  )}
                />
                {errors.userId && (
                  <p className="text-xs text-red-500 mt-1">{errors.userId.message}</p>
                )}
              </div>
            </div>

            {/* Schedule Details Section */}
            <p className={sectionHeaderClass}>
              Schedule Details
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start mb-6">
              <div className="flex flex-col gap-1">
                <label className={labelClass}>
                  Follow Up Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <input
                    type="date"
                    {...register('followUpDate', { required: 'Follow up date is required' })}
                    className={`${inputClass} pl-10`}
                  />
                </div>
                {errors.followUpDate && (
                  <p className="text-xs text-red-500 mt-1">{errors.followUpDate.message}</p>
                )}
              </div>

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
              Follow Up Status
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start mb-6">
              <div className="flex flex-col gap-1">
                <label className={labelClass}>
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('followUpStatus', { valueAsNumber: true })}
                  className={inputClass}
                >
                  {FOLLOW_UP_STATUS_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Notes Section */}
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
                    placeholder="Enter any additional notes, discussion points, or reminders..."
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
                disabled={isAdding}
                className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700
                           text-white rounded-lg font-medium shadow-md transition-colors
                           disabled:bg-green-300 disabled:cursor-not-allowed"
              >
                <Save size={18} />
                {isAdding ? 'Saving...' : 'Save Follow Up'}
              </button>
            </div>

          </form>
        </fieldset>
      </div>
    </div>
  )
} 

export default AddFollowUpModal