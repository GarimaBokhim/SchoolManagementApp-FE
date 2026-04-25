'use client'

import { useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import toast from 'react-hot-toast'
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
        classIds: activity.classIds,
        // startTime / endTime / activityDate are not on Activity type
        // but your API expects them — seed as empty so user can update
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#353535] rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6">
        <h2 className="text-lg font-semibold mb-4">Edit Activity</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Activity Name</label>
            <input
              {...register('name', { required: 'Name is required' })}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              {...register('descriptions')}
              rows={3}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
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
            <label className="block text-sm font-medium mb-1">Event</label>
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

          {/* Activity Date */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                {...register('activityDate', { required: 'Date is required' })}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {errors.activityDate && (
                <p className="text-red-500 text-xs mt-1">{errors.activityDate.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Start Time</label>
              <input
                type="time"
                {...register('startTime', { required: 'Start time required' })}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Time</label>
              <input
                type="time"
                {...register('endTime', { required: 'End time required' })}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Classes (multi-select) */}
          {classes.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-1">Classes</label>
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
              <p className="text-xs text-gray-400 mt-1">Hold Ctrl / Cmd to select multiple</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
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
      </div>
    </div>
  )
}

export default EditActivityModal