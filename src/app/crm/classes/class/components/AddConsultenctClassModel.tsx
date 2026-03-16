'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { X } from 'lucide-react'
import { AddConsultancyClassPayload } from '../types/IClass'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSubmit: (payload: AddConsultancyClassPayload) => Promise<void>
}

const ENGLISH_PROFICIENCY_OPTIONS = [
  { value: 1, label: 'IELTS' },
  { value: 2, label: 'TOEFL' },
  { value: 3, label: 'PTE' },
  { value: 4, label: 'Other' },
]

export const AddConsultancyClassModal = ({ isOpen, onClose, onSubmit }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddConsultancyClassPayload>({
    defaultValues: { englishProficiency: 1 },
  })

  const handleClose = () => {
    reset()
    onClose()
  }

  const onFormSubmit = async (data: AddConsultancyClassPayload) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
      reset()
      onClose()
    } finally {
      setIsSubmitting(false)
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
        className="relative bg-white dark:bg-[#353535] rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Add Class</h2>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={18} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-4 flex-1">
          <form id="add-class-form" onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-4">

            {/* Name */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Class Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register('name', { required: 'Class name is required' })}
                placeholder="e.g. IELTS Morning Shift"
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#2a2a2a] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
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

            {/* Batch */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Batch <span className="text-red-500">*</span>
              </label>
              <input
                {...register('batch', { required: 'Batch is required' })}
                placeholder="e.g. 2081"
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#2a2a2a] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {errors.batch && <p className="text-xs text-red-500">{errors.batch.message}</p>}
            </div>

            {/* English Proficiency */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                English Proficiency <span className="text-red-500">*</span>
              </label>
              <select
                {...register('englishProficiency', { required: true, valueAsNumber: true })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#2a2a2a] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {ENGLISH_PROFICIENCY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
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
            form="add-class-form"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            {isSubmitting ? 'Saving...' : 'Save Class'}
          </button>
        </div>
      </div>
    </div>
  )
}