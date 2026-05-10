'use client'

import { useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import toast from 'react-hot-toast'
import { X } from 'lucide-react'
import { Activity, AddActivityPayload } from '../types/IActivities'
import { useUpdateActivity, useGetAllEvents, useGetAllClasses } from '../hooks'

interface Props {
  visible: boolean
  activity: Activity | null
  onClose: () => void
  onSuccess: () => void
}

const ACTIVITY_CATEGORY_OPTIONS = [
  { value: 0, label: 'Sports' },
  { value: 1, label: 'Academics' },
  { value: 2, label: 'Creative Arts' },
  { value: 3, label: 'Environmental' },
  { value: 4, label: 'Performing Arts' },
  { value: 5, label: 'Technical' },
  { value: 6, label: 'Social Services' },
  { value: 7, label: 'Vocational' },
]

type FormValues = AddActivityPayload

const EditActivityModal = ({ visible, activity, onClose, onSuccess }: Props) => {
  const { mutateAsync: updateActivity, isPending } = useUpdateActivity()
  const { data: events = [] } = useGetAllEvents()
  const { data: classes = [] } = useGetAllClasses()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>()

  // Pre-fill form whenever the selected activity changes
  useEffect(() => {
    if (activity) {
      reset({
        name: activity.name,
        descriptions: activity.descriptions,
        activityCategory: activity.activityCategory,
        eventId: activity.eventId,
        classIds: activity.classIds ?? [],
        // startTime, endTime, activityDate are not in Activity type
        // so we leave them empty for user to fill
        startTime: '',
        endTime: '',
        activityDate: '',
      })
    }
  }, [activity, reset])

  if (!visible || !activity) return null

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    await toast.promise(
      updateActivity({ ...data, id: activity.id }),
      {
        loading: 'Updating activity...',
        success: 'Activity updated successfully!',
        error: 'Failed to update activity.',
      }
    )
    onSuccess()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center 
             bg-black/40 backdrop-blur-sm ml-12 md:ml-64 sm:ml-16 xs:ml-0"
    >
      <div
        className="bg-[#FBFBFB] dark:bg-[#27272a] 
               w-full max-w-[95vw] md:max-w-[85vw] lg:max-w-[75vw] xl:max-w-[70vw]
               max-h-[95vh] md:max-h-[92vh] h-full 
               rounded-lg overflow-auto p-6 md:p-8 shadow-lg"
      >
        <fieldset>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
              Edit Activity
            </h1>
            <button
              type="button"
              onClick={onClose}
              className="text-red-400 text-2xl hover:text-red-500"
            >
              <X strokeWidth={3} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">

              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1 text-left text-gray-700 dark:text-gray-300">
                  Activity Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-1 text-left text-gray-700 dark:text-gray-300">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('activityCategory', { valueAsNumber: true })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#353535] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {ACTIVITY_CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Event */}
              <div>
                <label className="block text-sm font-medium mb-1 text-left text-gray-700 dark:text-gray-300">
                  Event <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('eventId', { required: 'Event is required' })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#353535] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select event</option>
                  {events.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.title}
                    </option>
                  ))}
                </select>
                {errors.eventId && (
                  <p className="text-red-500 text-xs mt-1">{errors.eventId.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1 text-left text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  {...register('descriptions')}
                  rows={3}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Activity Date */}
              <div>
                <label className="block text-sm font-medium mb-1 text-left text-gray-700 dark:text-gray-300">
                  Activity Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register('activityDate', { required: 'Date is required' })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {errors.activityDate && (
                  <p className="text-red-500 text-xs mt-1">{errors.activityDate.message}</p>
                )}
              </div>

              {/* Start Time */}
              <div>
                <label className="block text-sm font-medium mb-1 text-left text-gray-700 dark:text-gray-300">
                  Start Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  {...register('startTime', { required: 'Start time is required' })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {errors.startTime && (
                  <p className="text-red-500 text-xs mt-1">{errors.startTime.message}</p>
                )}
              </div>

              {/* End Time */}
              <div>
                <label className="block text-sm font-medium mb-1 text-left text-gray-700 dark:text-gray-300">
                  End Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  {...register('endTime', { required: 'End time is required' })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {errors.endTime && (
                  <p className="text-red-500 text-xs mt-1">{errors.endTime.message}</p>
                )}
              </div>

              {/* Classes (multi-select) */}
              {classes.length > 0 && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1 text-left text-gray-700 dark:text-gray-300">
                    Classes
                  </label>
                  <select
                    multiple
                    {...register('classIds')}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#353535] focus:outline-none focus:ring-2 focus:ring-emerald-500 h-28"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                </div>
              )}

            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6 mt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-4 py-2 text-sm rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors disabled:opacity-60"
              >
                {isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </fieldset>
      </div>
    </div>
  )
}

export default EditActivityModal