'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { X } from 'lucide-react'
import { AddActivityPayload } from '../types/IActivities'

const ACTIVITY_CATEGORY_OPTIONS = [
  { value: 0, label: 'Sports' },
  { value: 1, label: 'Arts' },
  { value: 2, label: 'Music' },
  { value: 3, label: 'Other' },
]

interface Props {
  visible: boolean
  onClose: () => void
  onSuccess: () => void
}

const AddActivityModal = ({ visible, onClose, onSuccess }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { useAddActivity } = require('../hooks')
  const { mutateAsync: addActivity } = useAddActivity()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddActivityPayload>({
    defaultValues: { activityCategory: 0 },
  })

  const handleClose = () => {
    reset()
    onClose()
  }

  const onFormSubmit = async (data: AddActivityPayload) => {
    setIsSubmitting(true)
    try {
      await addActivity(data)
      reset()
      onSuccess()
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!visible) return null

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
            Add Activity
          </h2>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={18} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-4">
          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Activity Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register('name', { required: 'Activity name is required' })}
              placeholder="e.g. Football Tournament"
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#2a2a2a] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          {/* Activity Category */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              {...register('activityCategory', { valueAsNumber: true })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#2a2a2a] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {ACTIVITY_CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Event ID */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Event ID <span className="text-red-500">*</span>
            </label>
            <input
              {...register('eventId', { required: 'Event ID is required' })}
              placeholder="Enter event ID"
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#2a2a2a] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {errors.eventId && <p className="text-xs text-red-500">{errors.eventId.message}</p>}
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
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              {isSubmitting ? 'Saving...' : 'Save Activity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddActivityModal