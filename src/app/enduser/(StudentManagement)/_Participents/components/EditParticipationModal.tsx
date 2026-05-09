'use client'

import { useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import toast from 'react-hot-toast'
import { X } from 'lucide-react'
import { Participation } from '../../_Activities/types/IActivities'
import { useUpdateParticipation, UpdateParticipationPayload } from '../hooks'

const AWARD_POSITION_OPTIONS = [
  { value: 1, label: 'First Place' },
  { value: 2, label: 'Second Place' },
  { value: 3, label: 'Third Place' },
  { value: 4, label: 'Runner Up' },
  { value: 5, label: 'Honorable Mention' },
  { value: 6, label: 'Gold Standard' },
  { value: 7, label: 'Creative Excellence' },
  { value: 8, label: 'Best Team Leader' },
  { value: 9, label: 'Active Participant' },
  { value: 10, label: 'Outstanding Efforts' },
]

interface Props {
  visible: boolean
  participation: Participation | null
  students: { id: string; label: string }[]
  activities: { id: string; label: string }[]
  onClose: () => void
  onSuccess: () => void
}

type FormValues = Omit<UpdateParticipationPayload, 'id'>

const EditParticipationModal = ({
  visible,
  participation,
  students,
  activities,
  onClose,
  onSuccess,
}: Props) => {
  const { mutateAsync: updateParticipation, isPending } = useUpdateParticipation()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>()

  // Pre-fill form when participation changes
  useEffect(() => {
    if (participation) {
      reset({
        studentId: participation.studentId,
        activityId: participation.activityId,
        awardPosition: participation.awardPosition,
        certificateTitle: '',
        certificateContent: '',
      })
    }
  }, [participation, reset])

  if (!visible || !participation) return null

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    await toast.promise(
      updateParticipation({ ...data, id: participation.id }),
      {
        loading: 'Updating participation...',
        success: 'Participation updated successfully!',
        error: 'Failed to update participation.',
      }
    )
    onSuccess()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center
                    bg-black/40 backdrop-blur-sm ml-12 md:ml-64 sm:ml-16 xs:ml-0">
      <div className="bg-[#FBFBFB] dark:bg-[#27272a]
                      w-full max-w-[95vw] md:max-w-[75vw] lg:max-w-[60vw] xl:max-w-[50vw]
                      max-h-[95vh] md:max-h-[92vh] h-auto
                      rounded-lg overflow-auto p-6 md:p-8 shadow-lg">
        <fieldset>
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
              Edit Participation
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

              {/* Student */}
              <div>
                <label className="block text-sm font-medium mb-1 text-left text-gray-700 dark:text-gray-300">
                  Student <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('studentId', { required: 'Student is required' })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#353535] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select student</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
                {errors.studentId && (
                  <p className="text-red-500 text-xs mt-1">{errors.studentId.message}</p>
                )}
              </div>

              {/* Activity */}
              <div>
                <label className="block text-sm font-medium mb-1 text-left text-gray-700 dark:text-gray-300">
                  Activity <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('activityId', { required: 'Activity is required' })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#353535] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select activity</option>
                  {activities.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.label}
                    </option>
                  ))}
                </select>
                {errors.activityId && (
                  <p className="text-red-500 text-xs mt-1">{errors.activityId.message}</p>
                )}
              </div>

              {/* Award Position */}
              <div>
                <label className="block text-sm font-medium mb-1 text-left text-gray-700 dark:text-gray-300">
                  Award Position <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('awardPosition', {
                    required: 'Award position is required',
                    valueAsNumber: true,
                  })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#353535] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select position</option>
                  {AWARD_POSITION_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {errors.awardPosition && (
                  <p className="text-red-500 text-xs mt-1">{errors.awardPosition.message}</p>
                )}
              </div>

              {/* Certificate Title */}
              <div>
                <label className="block text-sm font-medium mb-1 text-left text-gray-700 dark:text-gray-300">
                  Certificate Title
                </label>
                <input
                  {...register('certificateTitle')}
                  placeholder="e.g. Certificate of Achievement"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Certificate Content */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1 text-left text-gray-700 dark:text-gray-300">
                  Certificate Content
                </label>
                <textarea
                  {...register('certificateContent')}
                  rows={3}
                  placeholder="e.g. This is to certify that..."
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

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

export default EditParticipationModal