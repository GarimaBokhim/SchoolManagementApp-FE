'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { X } from 'lucide-react'

import { AppCombobox } from '@/components/Input/ComboBox'
import toast from 'react-hot-toast'
import { Toast } from '@/components/Toast/toast'
import { useAddParticipation, useGetAllActivitiesDropdown } from '../../_Activities/hooks'
import { AddParticipationPayload } from '../../_Activities/types/IActivities'
import { useGetAllStudents } from '../../Student/hooks'

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
  onClose: () => void
  onSuccess: () => void
}

const AddParticipationModal = ({ visible, onClose, onSuccess }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<any>(null)
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [selectedAwardPosition, setSelectedAwardPosition] = useState<any>(null)

  const { mutateAsync: addParticipation } = useAddParticipation()
  const { data: activitiesData = [], isLoading: activitiesLoading } = useGetAllActivitiesDropdown()

  // useGetAllStudents returns IPaginationResponse<IStudent>, so we pull .Items (or .data depending on your shape)
  const { data: studentsData, isLoading: studentsLoading } = useGetAllStudents()

  // Normalise to a flat array — adjust the key if your response uses `.data` instead of `.Items`
  const students = (studentsData as any)?.Items ?? (studentsData as any)?.data ?? []

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
    setSelectedStudent(null)
    setSelectedAwardPosition(null)
    onClose()
  }

  const onFormSubmit = async (data: AddParticipationPayload) => {
    setIsSubmitting(true)
    try {
      await addParticipation(data)
      toast.success('Participation added successfully!')
      reset()
      setSelectedActivity(null)
      setSelectedStudent(null)
      setSelectedAwardPosition(null)
      onSuccess()
    } catch {
      Toast.error('Error adding participation.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Helper to build a student's full display name
  const getStudentLabel = (s: any) =>
    [s?.firstName, s?.middleName, s?.lastName].filter(Boolean).join(' ')

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

          {/* Student — Combobox */}
          <div className="flex flex-col gap-1">
            <label className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Student <span className="text-red-500">*</span>
            </label>
            {studentsLoading ? (
              <div className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-[#2a2a2a] text-gray-400">
                Loading students...
              </div>
            ) : (
              <Controller
                name="studentId"
                control={control}
                rules={{ required: 'Student is required' }}
                render={() => (
                  <AppCombobox
                    value={selectedStudent ? getStudentLabel(selectedStudent) : ''}
                    dropDownWidth="w-full"
                    dropdownPositionClass="absolute"
                    label=""
                    name="studentId"
                    form={null}
                    options={students}
                    selected={selectedStudent}
                    onSelect={(student) => {
                      setSelectedStudent(student)
                      setValue('studentId', student?.id ?? '', { shouldValidate: true })
                    }}
                    onFocus={() => { }}
                    getLabel={getStudentLabel}
                    getValue={(s) => s?.id ?? ''}
                    renderOptionExtra={() => <></>} // Return empty fragment instead of null
                  />
                )}
              />
            )}
            {errors.studentId && (
              <p className="text-xs text-red-500">{errors.studentId.message}</p>
            )}
          </div>

          {/* Activity — Combobox */}
          <div className="flex flex-col gap-1">
            <label className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
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
                    options={activitiesData}
                    selected={selectedActivity}
                    onSelect={(activity) => {
                      setSelectedActivity(activity)
                      setValue('activityId', activity?.id ?? '', { shouldValidate: true })
                    }}
                    onFocus={() => { }}
                    getLabel={(a) => a?.name ?? ''}
                    getValue={(a) => a?.id ?? ''}
                    renderOptionExtra={() => <></>} // Return empty fragment instead of null
                  />
                )}
              />
            )}
            {errors.activityId && (
              <p className="text-xs text-red-500">{errors.activityId.message}</p>
            )}
          </div>

          {/* Award Position — Combobox with enum names */}
          <div className="flex flex-col gap-1">
            <label className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Award Position <span className="text-red-500">*</span>
            </label>
            <Controller
              name="awardPosition"
              control={control}
              rules={{ required: 'Award position is required' }}
              render={() => (
                <AppCombobox
                  value={selectedAwardPosition?.label || ''}
                  dropDownWidth="w-full"
                  dropdownPositionClass="absolute"
                  label=""
                  name="awardPosition"
                  form={null}
                  options={AWARD_POSITION_OPTIONS}
                  selected={selectedAwardPosition}
                  onSelect={(position) => {
                    setSelectedAwardPosition(position)
                    setValue('awardPosition', position?.value ?? 1, { shouldValidate: true })
                  }}
                  onFocus={() => { }}
                  getLabel={(p) => p?.label ?? ''}
                  getValue={(p) => p?.value ?? ''}
                  renderOptionExtra={() => <></>} // Return empty fragment instead of null
                />
              )}
            />
            {errors.awardPosition && (
              <p className="text-xs text-red-500">{errors.awardPosition.message}</p>
            )}
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