'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { X } from 'lucide-react'
import { AddActivityPayload, IClass } from '../types/IActivities'
import { useGetAllEvents, useAddActivity, useGetAllClasses } from '../hooks'
import { AppCombobox } from '@/components/Input/ComboBox'
import ClassMultiSelect from './ClassMiultiSelect'

const ACTIVITY_CATEGORY_OPTIONS = [
  { value: 1, label: 'Sports' },
  { value: 2, label: 'Academic' },
  { value: 3, label: 'Creative Art' },
  { value: 4, label: 'Environmental' },
  { value: 5, label: 'Performing Arts' },
  { value: 6, label: 'Technical' },
  { value: 7, label: 'Social Service' },
  { value: 8, label: 'Vocational' },
]

interface EventOption {
  id: string
  title: string
}

interface Props {
  visible: boolean
  onClose: () => void
  onSuccess: () => void
}

const AddActivityModal = ({ visible, onClose, onSuccess }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<EventOption | null>(null)
  const [selectedClasses, setSelectedClasses] = useState<IClass[]>([])

  const { mutateAsync: addActivity } = useAddActivity()
  const { data: events, isLoading: eventsLoading } = useGetAllEvents()
  const { data: classes, isLoading: classesLoading } = useGetAllClasses()

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<AddActivityPayload>({
    defaultValues: {
      activityCategory: 1,
      name: '',
      descriptions: '',
      eventId: '',
      startTime: '',
      endTime: '',
      activityDate: '',
      classIds: [],
    },
  })

  const handleClose = () => {
    reset()
    setSelectedEvent(null)
    setSelectedClasses([])
    onClose()
  }

  const onFormSubmit = async (data: AddActivityPayload) => {
    setIsSubmitting(true)
    try {
      await addActivity({
        ...data,
        classIds: selectedClasses.map((c) => c.id),
      })
      reset()
      setSelectedEvent(null)
      setSelectedClasses([])
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
        className="bg-[#FBFBFB] dark:bg-[#27272a] 
                   w-full max-w-[95vw] md:max-w-[85vw] lg:max-w-[75vw] xl:max-w-[70vw]
                   max-h-[95vh] md:max-h-[92vh] h-full 
                   rounded-lg overflow-auto p-6 md:p-8 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <fieldset>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
              Add Activity
            </h1>
            <button
              type="button"
              onClick={handleClose}
              className="text-red-400 text-2xl hover:text-red-500"
            >
              <X strokeWidth={3} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onFormSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">

              {/* Activity Name */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Activity Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('name', { required: 'Activity name is required' })}
                  placeholder="e.g. Football Tournament"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Activity Category */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
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
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Event <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="eventId"
                  control={control}
                  rules={{ required: 'Event is required' }}
                  render={({ field }) => (
                    <AppCombobox<EventOption>
                      name="eventId"
                      label="Select Event"
                      required
                      options={eventsLoading ? [] : (events as EventOption[] ?? [])}
                      selected={selectedEvent ?? undefined}
                      getLabel={(opt) => opt.title}
                      getValue={(opt) => opt.id}
                      placeholder={eventsLoading ? 'Loading events...' : 'Search event...'}
                      onSelect={(opt) => {
                        setSelectedEvent(opt)
                        field.onChange(opt ? opt.id : '')
                      }}
                    />
                  )}
                />
                {errors.eventId && (
                  <p className="text-red-500 text-xs mt-1">{errors.eventId.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  {...register('descriptions')}
                  placeholder="Brief description of the activity..."
                  rows={3}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              {/* Activity Date */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Activity Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register('activityDate', { required: 'Activity date is required' })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {errors.activityDate && (
                  <p className="text-red-500 text-xs mt-1">{errors.activityDate.message}</p>
                )}
              </div>

              {/* Start Time */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
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
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
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

              {/* Classes Multi-Select */}
              {classes && classes.length > 0 && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Classes
                  </label>
                  <ClassMultiSelect
                    classes={classes ?? []}
                    selected={selectedClasses}
                    onChange={setSelectedClasses}
                    isLoading={classesLoading}
                  />
                  {selectedClasses.length > 0 && (
                    <p className="text-xs text-gray-400 mt-1">
                      {selectedClasses.length} class{selectedClasses.length > 1 ? 'es' : ''} selected
                    </p>
                  )}
                </div>
              )}

            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6 mt-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors disabled:opacity-60"
              >
                {isSubmitting ? 'Saving...' : 'Save Activity'}
              </button>
            </div>
          </form>
        </fieldset>
      </div>
    </div>
  )
}

export default AddActivityModal