'use client'

import { useState } from 'react'
import { AppCombobox } from '@/components/Input/ComboBox'
import { useGetAllClass } from '@/app/enduser/(Academics)/Class/hooks'
import { IClass } from '@/app/enduser/(Academics)/Class/types/IClass'
import { useAssignClassTeacher, useGetClassTeacher } from '../hooks'
import toast from 'react-hot-toast'

interface ClassTeacherCellProps {
  academicTeamId: string
}

export const ClassTeacherCell = ({
  academicTeamId,
}: ClassTeacherCellProps) => {
  const { data, isLoading, isError } = useGetClassTeacher(academicTeamId)

  if (isLoading) {
    return <span className="text-sm text-gray-400">Loading...</span>
  }

  if (isError) {
    return (
      <span
        className="text-sm text-red-600 dark:text-red-300"
        title="Could not load the class-teacher assignment"
      >
        Unavailable
      </span>
    )
  }

  return (
    <span className="inline-flex rounded-full bg-teal-50 px-3 py-1 text-sm font-medium text-teal-800 dark:bg-teal-900/30 dark:text-teal-200">
      {data?.ClassName || 'Not assigned'}
    </span>
  )
}

interface AssignClassTeacherModalProps {
  academicTeamId: string
  academicTeamName: string
  onClose: () => void
}

export const AssignClassTeacherModal = ({
  academicTeamId,
  academicTeamName,
  onClose,
}: AssignClassTeacherModalProps) => {
  const { data: classes, isLoading, isError } = useGetAllClass()
  const assignClassTeacher = useAssignClassTeacher()
  const [selectedClassId, setSelectedClassId] = useState('')

  const availableClasses = classes?.Items?.filter(
    (classItem): classItem is IClass & { id: string } => Boolean(classItem.id)
  )
  const selectedClass = availableClasses?.find(
    (classItem) => classItem.id === selectedClassId
  )

  const handleAssign = async () => {
    if (!selectedClassId) {
      toast.error('Select a class before assigning.')
      return
    }

    try {
      const response = await assignClassTeacher.mutateAsync({
        AcademicTeamId: academicTeamId,
        ClassId: selectedClassId,
      })
      toast.success(response.Message || 'Class teacher assigned successfully.')
      onClose()
    } catch (error) {
      console.error('Failed to assign class teacher:', error)
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to assign the class teacher.'
      )
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="assign-class-teacher-title"
        className="w-full max-w-lg overflow-visible rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-[#2f2f2f]"
      >
        <header className="rounded-t-2xl border-b border-gray-200 bg-gradient-to-r from-teal-50 to-white px-6 py-5 dark:border-gray-700 dark:from-teal-950/40 dark:to-[#2f2f2f]">
          <p className="text-sm font-medium text-teal-700 dark:text-teal-300">
            Academic team
          </p>
          <h2
            id="assign-class-teacher-title"
            className="mt-1 text-xl font-semibold text-gray-900 dark:text-white"
          >
            Assign a class teacher
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Choose a class for {academicTeamName}.
          </p>
        </header>

        <div className="space-y-4 px-6 py-6">
          {isLoading && (
            <p className="text-sm text-gray-500">Loading available classes...</p>
          )}
          {isError && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300"
            >
              Could not load classes. Close this dialog and try again.
            </p>
          )}
          {!isLoading && !isError && availableClasses?.length ? (
            <AppCombobox<IClass>
              label="Class"
              name="classId"
              required
              value={selectedClassId}
              options={availableClasses}
              selected={selectedClass}
              onSelect={(classItem) =>
                setSelectedClassId(classItem?.id ?? '')
              }
              getLabel={(classItem) => classItem.name}
              getValue={(classItem) => classItem.id ?? ''}
              placeholder="Search classes..."
              dropDownWidth="w-full"
            />
          ) : !isLoading && !isError ? (
            <p className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              No classes are available to assign.
            </p>
          ) : null}
        </div>

        <footer className="flex justify-end gap-3 rounded-b-2xl border-t border-gray-200 px-6 py-4 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            disabled={assignClassTeacher.isPending}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAssign}
            disabled={
              !selectedClassId ||
              !availableClasses?.length ||
              isLoading ||
              isError ||
              assignClassTeacher.isPending
            }
            className="rounded-lg bg-teal-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {assignClassTeacher.isPending ? 'Assigning...' : 'Assign class'}
          </button>
        </footer>
      </section>
    </div>
  )
}
