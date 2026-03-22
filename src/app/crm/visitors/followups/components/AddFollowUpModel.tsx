'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { X } from 'lucide-react'
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
  { value: 1, label: 'Scheduled' },
  { value: 2, label: 'Completed' },
  { value: 3, label: 'Cancelled' },
  { value: 4, label: 'Rescheduled' },
]

const AddFollowUpModal = ({ isOpen, onClose, onSuccess, fetchFollowUps }: Props) => {
  const { isAdding, handleAdd } = useFollowUpMutations(fetchFollowUps)
  const { data: leadOptions = [], isLoading: leadsLoading } = useLeadOptions()

  const [selectedLead, setSelectedLead] = useState<LeadOption | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<AddFollowUpPayload>({
    defaultValues: {
      leadId: '',
      startTime: '',
      endTime: '',
      followUpDate: '',
      notes: '',
      followUpStatus: 1,
    },
  })

  const handleClose = () => {
    reset()
    setSelectedLead(null)
    onClose()
  }

  const onFormSubmit = async (data: AddFollowUpPayload) => {
    const success = await handleAdd({
      ...data,
      followUpDate: new Date(data.followUpDate).toISOString(),
    })
    if (success) {
      reset()
      setSelectedLead(null)
      onSuccess()
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
        className="bg-[#FBFBFB] dark:bg-[#27272a] w-full max-w-[95vw] md:max-w-[500px]
                   max-h-[95vh] rounded-lg overflow-auto p-6 md:p-8 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Add Follow Up
          </h2>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={18} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-4">

          {/* Lead — Separate label with AppCombobox */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Lead <span className="text-red-500">*</span>
            </label>
            <Controller
              name="leadId"
              control={control}
              rules={{ required: 'Lead is required' }}
              render={({ field }) => (
                <AppCombobox<LeadOption>
                  name="leadId"
                  label="" // Empty label prevents floating label behavior
                  required
                  options={leadsLoading ? [] : leadOptions}
                  selected={selectedLead ?? undefined}
                  getLabel={(opt) => opt.fullName}
                  getValue={(opt) => opt.userId}
                  placeholder={leadsLoading ? 'Loading leads...' : 'Search lead...'} // Placeholder text
                  onSelect={(opt) => {
                    setSelectedLead(opt)
                    field.onChange(opt ? opt.userId : '')
                  }}
                />
              )}
            />
            {errors.leadId && (
              <p className="text-xs text-red-500">{errors.leadId.message}</p>
            )}
          </div>

          {/* Follow Up Date */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Follow Up Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              {...register('followUpDate', { required: 'Follow up date is required' })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#2a2a2a] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Select date"
            />
            {errors.followUpDate && (
              <p className="text-xs text-red-500">{errors.followUpDate.message}</p>
            )}
          </div>

          {/* Start Time & End Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Start Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                {...register('startTime', { required: 'Start time is required' })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#2a2a2a] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Select start time"
              />
              {errors.startTime && (
                <p className="text-xs text-red-500">{errors.startTime.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                End Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                {...register('endTime', { required: 'End time is required' })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#2a2a2a] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Select end time"
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
              {...register('followUpStatus', { valueAsNumber: true })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#2a2a2a] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {FOLLOW_UP_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
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
              placeholder="Add any notes..."
              rows={3}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#2a2a2a] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-500 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isAdding}
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              {isAdding ? 'Saving...' : 'Save Follow Up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddFollowUpModal