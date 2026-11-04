/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { useEffect, useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import { useGetAllClass } from '@/app/enduser/(Academics)/Class/hooks'
import { useGetSubjectByClassId } from '@/app/enduser/(Academics)/Subject/hooks'
import { IClass } from '@/app/enduser/(Academics)/Class/types/IClass'
import { ISubjectByClass } from '@/app/enduser/(Academics)/Subject/types/ISubjects'
import {
  IAssignClass,
  IAssignedClassDetails,
  IClassSubjectAssignment,
} from '../types/IAcademicTeam'
import {
  useAssignClass,
  useUnassignClass,
  useGetClassWithSubjectByAcademicTeam,
} from '../hooks'
import toast from 'react-hot-toast'

interface Props {
  teacherId: string
  visible: boolean
  onClose: () => void
}

type SubjectSelection = Record<string, string[]>

const getAssignedSubjects = (items: IAssignedClassDetails[]) => {
  const assignments: SubjectSelection = {}

  const addAssignment = (classId?: string, subjectIds: string[] = []) => {
    if (!classId) return
    assignments[classId] = Array.from(
      new Set([...(assignments[classId] ?? []), ...subjectIds])
    )
  }

  items.forEach((item) => {
    const classes = item.Classes ?? item.classes ?? []
    classes.forEach((assignment) =>
      addAssignment(
        assignment.ClassId ?? assignment.classId,
        assignment.SubjectIds ?? assignment.subjectIds ?? []
      )
    )

    const classIds = item.ClassIds ?? item.classIds ?? []
    classIds.forEach((classId) =>
      addAssignment(classId, item.SubjectIds ?? item.subjectIds ?? [])
    )
    addAssignment(
      item.ClassId ?? item.classId,
      item.SubjectIds ?? item.subjectIds ?? []
    )
  })

  return assignments
}

interface ClassSubjectsProps {
  classId: string
  className: string
  expanded: boolean
  checked: boolean
  selectedSubjectIds: string[]
  onClassChange: (checked: boolean) => void
  onSubjectChange: (subjectId: string, checked: boolean) => void
  onToggleExpand: () => void
}

const ClassSubjects = ({
  classId,
  className,
  expanded,
  checked,
  selectedSubjectIds,
  onClassChange,
  onSubjectChange,
  onToggleExpand,
}: ClassSubjectsProps) => {
  const {
    data: subjects,
    isLoading,
    isError,
  } = useGetSubjectByClassId(expanded ? classId : undefined)

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-600 dark:bg-[#353535]">
      <div className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700">
        <input
          type="checkbox"
          checked={checked}
          aria-label={`Assign ${className}`}
          onChange={(event) => onClassChange(event.target.checked)}
          className="h-4 w-4 accent-teal-600"
        />
        <span className="flex-1 font-medium text-gray-800 dark:text-gray-100">
          {className}
        </span>
        <button
          type="button"
          onClick={onToggleExpand}
          aria-label={`${expanded ? 'Hide' : 'Show'} subjects for ${className}`}
          aria-expanded={expanded}
          className="rounded-md p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-800 dark:hover:bg-gray-600 dark:hover:text-white"
        >
          {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {expanded && (
        <div className="space-y-1 border-t border-gray-200 bg-gray-50 px-4 py-2 dark:border-gray-600 dark:bg-[#2f2f2f]">
          {isLoading && (
            <p className="text-sm text-gray-500">Loading subjects...</p>
          )}
          {isError && (
            <p className="text-sm text-red-600">
              Could not load subjects for this class.
            </p>
          )}
          {!isLoading && !isError && subjects?.length === 0 && (
            <p className="text-sm text-gray-500">
              No subjects found for this class.
            </p>
          )}
          {subjects?.map((subject: ISubjectByClass) => (
            <label
              key={subject.id}
              className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm text-gray-700 hover:bg-white dark:text-gray-200 dark:hover:bg-[#454545]"
            >
              <input
                type="checkbox"
                checked={selectedSubjectIds.includes(subject.id)}
                onChange={(event) =>
                  onSubjectChange(subject.id, event.target.checked)
                }
                className="h-4 w-4 accent-teal-600"
              />
              <span className="flex-1">{subject.subjectName}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

const AssignClass = ({ teacherId, visible, onClose }: Props) => {
  const { data: allClass, isLoading: classLoading } = useGetAllClass()
  const {
    data: assignedClasses,
    isLoading: assignedLoading,
    isError: assignedError,
  } = useGetClassWithSubjectByAcademicTeam(teacherId)

  const assignClass = useAssignClass()
  const unassignClass = useUnassignClass()
  const [initialAssignments, setInitialAssignments] =
    useState<SubjectSelection>({})
  const [selectedClasses, setSelectedClasses] = useState<string[]>([])
  const [selectedSubjects, setSelectedSubjects] = useState<SubjectSelection>(
    {}
  )
  const [expandedClassId, setExpandedClassId] = useState<string | null>(null)
  const [hasLoadedAssignments, setHasLoadedAssignments] = useState(false)
  const isSaving = assignClass.isPending || unassignClass.isPending

  useEffect(() => {
    if (assignedLoading || !assignedClasses) return

    const assignments = getAssignedSubjects(assignedClasses)
    setInitialAssignments(assignments)
    setSelectedSubjects(assignments)
    setSelectedClasses(Object.keys(assignments))
    setHasLoadedAssignments(true)
  }, [assignedClasses, assignedLoading])

  const toggleClass = (classId: string, checked: boolean) => {
    setSelectedClasses((current) =>
      checked
        ? Array.from(new Set([...current, classId]))
        : current.filter((id) => id !== classId)
    )
    if (checked) setExpandedClassId(classId)
  }

  const toggleSubject = (
    classId: string,
    subjectId: string,
    checked: boolean
  ) => {
    setSelectedSubjects((current) => {
      const currentIds = current[classId] ?? []
      const subjectIds = checked
        ? Array.from(new Set([...currentIds, subjectId]))
        : currentIds.filter((id) => id !== subjectId)

      return { ...current, [classId]: subjectIds }
    })

    if (checked) {
      setSelectedClasses((current) =>
        current.includes(classId) ? current : [...current, classId]
      )
    }
  }

  const handleSave = async () => {
    const assignmentsToAdd: IClassSubjectAssignment[] = []
    const assignmentsToRemove: IClassSubjectAssignment[] = []

    selectedClasses.forEach((classId) => {
      const originalIds = initialAssignments[classId] ?? []
      const selectedIds = selectedSubjects[classId] ?? []
      const subjectIds = initialAssignments[classId]
        ? selectedIds.filter((id) => !originalIds.includes(id))
        : selectedIds

      if (!initialAssignments[classId] || subjectIds.length > 0) {
        assignmentsToAdd.push({ ClassId: classId, SubjectIds: subjectIds })
      }
    })

    Object.entries(initialAssignments).forEach(([classId, originalIds]) => {
      if (!selectedClasses.includes(classId)) {
        assignmentsToRemove.push({
          ClassId: classId,
          SubjectIds: originalIds,
        })
        return
      }

      const selectedIds = selectedSubjects[classId] ?? []
      const subjectIds = originalIds.filter((id) => !selectedIds.includes(id))
      if (subjectIds.length > 0) {
        assignmentsToRemove.push({ ClassId: classId, SubjectIds: subjectIds })
      }
    })

    if (!assignmentsToAdd.length && !assignmentsToRemove.length) {
      onClose()
      return
    }

    try {
      if (assignmentsToAdd.length > 0) {
        await assignClass.mutateAsync({
          AcademicTeamId: teacherId,
          Classes: assignmentsToAdd,
        } satisfies IAssignClass)
      }

      if (assignmentsToRemove.length > 0) {
        await unassignClass.mutateAsync({
          AcademicTeamId: teacherId,
          Classes: assignmentsToRemove,
        })
      }

      toast.success('Class and subject assignments updated successfully.')
      onClose()
    } catch (error) {
      console.error('Failed to update class and subject assignments:', error)
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to update class and subject assignments.'
      )
    }
  }

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center 
             bg-black/40 backdrop-blur-sm ml-12 md:ml-64 sm:ml-16 xs:ml-0"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="assign-class-subject-title"
        className="flex max-h-[88vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-[#2f2f2f]"
      >
        <header className="shrink-0 border-b border-gray-200 px-5 py-4 dark:border-gray-700">
          <h2
            id="assign-class-subject-title"
            className="text-lg font-semibold text-gray-900 dark:text-white"
          >
            Assign Classes &amp; Subjects
          </h2>
          {/* <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
            Select a class to view and assign its subjects.
          </p> */}
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {(classLoading || assignedLoading) && (
            <p className="py-3 text-sm text-gray-500">
              Loading classes and current assignments...
            </p>
          )}
          {assignedError && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
              Could not load existing assignments. Try again before saving
              changes.
            </p>
          )}

          {!classLoading && (
            <div className="space-y-3">
              {allClass?.Items?.map((classItem: IClass) => {
                if (!classItem.id) return null
                const classId = classItem.id
                const expanded = expandedClassId === classId
                const checked = selectedClasses.includes(classId)

                return (
                  <ClassSubjects
                    key={classId}
                    classId={classId}
                    className={classItem.name}
                    expanded={expanded}
                    checked={checked}
                    selectedSubjectIds={selectedSubjects[classId] ?? []}
                    onClassChange={(nextChecked) =>
                      toggleClass(classId, nextChecked)
                    }
                    onSubjectChange={(subjectId, nextChecked) =>
                      toggleSubject(classId, subjectId, nextChecked)
                    }
                    onToggleExpand={() =>
                      setExpandedClassId((current) =>
                        current === classId ? null : classId
                      )
                    }
                  />
                )
              })}
              {!allClass?.Items?.length && (
                <p className="py-6 text-center text-sm text-gray-500">
                  No classes found.
                </p>
              )}
            </div>
          )}
        </div>

        <footer className="flex shrink-0 justify-end gap-3 border-t border-gray-200 bg-white px-5 py-4 dark:border-gray-700 dark:bg-[#2f2f2f]">
          <ButtonElement
            type="button"
            text="Cancel"
            disabled={isSaving}
            onClick={onClose}
            className="!bg-gray-500 hover:!bg-gray-600"
          />
          <ButtonElement
            type="button"
            text={isSaving ? 'Saving...' : 'OK'}
            disabled={
              isSaving ||
              classLoading ||
              assignedLoading ||
              assignedError ||
              !hasLoadedAssignments
            }
            onClick={handleSave}
            className="!bg-teal-600 hover:!bg-teal-700"
          />
        </footer>
      </section>
    </div>
  )
}

export default AssignClass
