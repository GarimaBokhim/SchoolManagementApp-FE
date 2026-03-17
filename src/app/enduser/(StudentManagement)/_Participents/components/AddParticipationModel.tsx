'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { X } from 'lucide-react'

import { AppCombobox } from '@/components/Input/ComboBox'
import toast from 'react-hot-toast'
import { Toast } from '@/components/Toast/toast'
import { useAddParticipation, useGetAllActivitiesDropdown } from '../../_Activities/hooks'
import { AddParticipationPayload } from '../../_Activities/types/IActivities'

interface Props {
  visible: boolean
  onClose: () => void
  onSuccess: () => void
}

const AddParticipationModal = ({ visible, onClose, onSuccess }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<any>(null)

  const { mutateAsync: addParticipation } = useAddParticipation() 
  const { data: activities = [], isLoading: activitiesLoading } = useGetAllActivitiesDropdown()

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<AddParticipationPayload>({
    defaultValues: { awardPosition: 1 },
  })

  const handleClose = () => {
    reset()
    setSelectedActivity(null)
    onClose()
  }

  const onFormSubmit = async (data: AddParticipationPayload) => {
    setIsSubmitting(true)
    try {
      await addParticipation(data)
      toast.success('Participation added successfully!')
      reset()
      setSelectedActivity(null)
      onSuccess()
    } catch {
      Toast.error('Error adding participation.')
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
            Add Participation
          </h2>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={18} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-4">

          {/* Student ID */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Student ID <span className="text-red-500">*</span>
            </label>
            <input
              {...register('studentId', { required: 'Student ID is required' })}
              placeholder="Enter student ID"
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#2a2a2a] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {errors.studentId && <p className="text-xs text-red-500">{errors.studentId.message}</p>}
          </div>

          {/* Activity */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Activity <span className="text-red-500">*</span>
            </label>
            {activitiesLoading ? (
              <div className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-[#2a2a2a] text-gray-400">
                Loading activities...
              </div>
            ) : (
              <Controller
                name="activityId"
                control={control}
                rules={{ required: 'Activity is required' }}
                render={() => (
                  <AppCombobox
                    value={selectedActivity?.name || ''}
                    dropDownWidth="w-full"
                    dropdownPositionClass="absolute"
                    label=""
                    name="activityId"
                    form={null}
                    options={activities}
                    selected={selectedActivity}
                    onSelect={(activity) => {
                      setSelectedActivity(activity)
                      setValue('activityId', activity?.id ?? '', { shouldValidate: true })
                    }}
                    onFocus={() => {}}
                    getLabel={(a) => a?.name ?? ''}
                    getValue={(a) => a?.id ?? ''}
                    renderOptionExtra={(a) => (
                      <div className="text-xs text-gray-500 dark:text-gray-400">{a.id}</div>
                    )}
                  />
                )}
              />
            )}
            {errors.activityId && <p className="text-xs text-red-500">{errors.activityId.message}</p>}
          </div>

          {/* Award Position */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Award Position <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              {...register('awardPosition', {
                required: 'Award position is required',
                valueAsNumber: true,
                min: { value: 1, message: 'Position must be at least 1' },
              })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#2a2a2a] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {errors.awardPosition && <p className="text-xs text-red-500">{errors.awardPosition.message}</p>}
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
              {isSubmitting ? 'Saving...' : 'Save Participation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddParticipationModal