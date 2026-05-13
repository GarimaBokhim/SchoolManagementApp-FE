'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { X } from 'lucide-react'
import { AddTrainingRegistrationPayload } from '../../class/types/IClass'
import { useGetAllClassesDropdown } from '../../class/hooks'
import { AppCombobox } from '@/components/Input/ComboBox'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSubmit: (payload: AddTrainingRegistrationPayload) => Promise<void>
}

export const AddTrainingRegistrationModal = ({ isOpen, onClose, onSubmit }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedClass, setSelectedClass] = useState<any>(null)

  const { data: classes = [], isLoading: classesLoading } = useGetAllClassesDropdown()

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<AddTrainingRegistrationPayload>()

  const handleClose = () => {
    reset()
    setSelectedClass(null)
    onClose()
  }

  const onFormSubmit = async (data: AddTrainingRegistrationPayload) => {
    setIsSubmitting(true)
    try {
      await onSubmit({
        ...data,
        registeredAt: new Date(data.registeredAt).toISOString(),
      })
      reset()
      setSelectedClass(null)
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
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Add Registration</h2>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={18} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-4 flex-1">
          <form id="add-registration-form" onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-4">

            {/* Applicant ID */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Applicant ID <span className="text-red-500">*</span>
              </label>
              <input
                {...register('applicantId', { required: 'Applicant ID is required' })}
                placeholder="Enter applicant ID"
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#2a2a2a] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {errors.applicantId && <p className="text-xs text-red-500">{errors.applicantId.message}</p>}
            </div>

            {/* Consultancy Class */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Class <span className="text-red-500">*</span>
              </label>
              {classesLoading ? (
                <div className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-[#2a2a2a] text-gray-400">
                  Loading classes...
                </div>
              ) : (
                <Controller
                  name="consultancyClassId"
                  control={control}
                  rules={{ required: 'Class is required' }}
                  render={() => (
                    <AppCombobox
                      value={selectedClass?.name || ''}
                      dropDownWidth="w-full"
                      dropdownPositionClass="absolute"
                      label=""
                      name="consultancyClassId"
                      form={null}
                      options={classes}
                      selected={selectedClass}
                      onSelect={(cls) => {
                        setSelectedClass(cls)
                        setValue('consultancyClassId', cls?.id ?? '', { shouldValidate: true })
                      }}
                      onFocus={() => { }}
                      getLabel={(cls) => cls?.name ?? ''}
                      getValue={(cls) => cls?.id ?? ''}
                      renderOptionExtra={(cls) => (
                        <div className="text-xs text-gray-500 dark:text-gray-400">{cls.id}</div>
                      )}
                    />
                  )}
                />
              )}
              {errors.consultancyClassId && (
                <p className="text-xs text-red-500">{errors.consultancyClassId.message}</p>
              )}
            </div>

            {/* Registered At */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Registration Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register('registeredAt', { required: 'Registration date is required' })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#2a2a2a] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {errors.registeredAt && <p className="text-xs text-red-500">{errors.registeredAt.message}</p>}
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
            form="add-registration-form"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            {isSubmitting ? 'Saving...' : 'Save Registration'}
          </button>
        </div>
      </div>
    </div>
  )
}