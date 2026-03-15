/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { useEffect, useState } from 'react'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import { useGetAllClass } from '@/app/enduser/(Academics)/Class/hooks'
import {
  useAssignClass,
  useUnassignClass,
  useGetAssignClassDetails,
} from '../hooks'
import { IClass } from '@/app/enduser/(Academics)/Class/types/IClass'
import { IAssignClass } from '../types/IAcademicTeam'

interface Props {
  teacherId: string
  visible: boolean
  onClose: () => void
}

const AssignClass = ({ teacherId, visible, onClose }: Props) => {
  const { data: allClass, isLoading: classLoading } = useGetAllClass()

  const { data: assignedData } = useGetAssignClassDetails(
    `?AcademicTeamId=${teacherId}&IsPagination=false`
  )

  const assignClass = useAssignClass()
  const unassignClass = useUnassignClass()

  const [selectedClasses, setSelectedClasses] = useState<string[]>([])

  /* Load assigned classes from AssignClassDetails API */
  useEffect(() => {
    if (assignedData?.items) {
      const assignedIds = assignedData.items.map(
        (item: IAssignClass) => item.classIds
      )

      setSelectedClasses(assignedIds)
    }
  }, [assignedData])

  const handleAssign = async (classId: string) => {
    try {
      await assignClass.mutateAsync({
        academicTeamId: teacherId,
        classIds: [classId],
        subjectIds: [],
      })

      setSelectedClasses((prev) => [...prev, classId])
    } catch (error) {
      console.error('Assign failed', error)
    }
  }

  const handleUnassign = async (classId: string) => {
    try {
      await unassignClass.mutateAsync({
        academicTeamId: teacherId,
        classIds: [classId],
        subjectIds: [],
      })

      setSelectedClasses((prev) => prev.filter((id) => id !== classId))
    } catch (error) {
      console.error('Unassign failed', error)
    }
  }

  const toggleClass = (classId: string) => {
    if (selectedClasses.includes(classId)) {
      handleUnassign(classId)
    } else {
      handleAssign(classId)
    }
  }

  if (!visible) return null

  return (
    <div className="absolute bg-white dark:bg-[#3a3a3a] p-4 rounded-xl shadow-md border border-gray-200 w-[20rem] md:w-[12rem] sm:w-[16rem] max-h-[30vh] overflow-y-auto z-40 ml-[-20%]">
      <h1 className="text-md font-semibold mb-3">Assign Class Details</h1>

      {classLoading && <p>Loading classes...</p>}

      <div className="space-y-2">
        {allClass?.Items?.map((cls: IClass) => (
          <label
            key={cls.id}
            className="flex items-center gap-2 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedClasses.includes(cls.id as string)}
              onChange={() => toggleClass(cls.id as string)}
            />

            <span className="font-medium">{cls.name}</span>
          </label>
        ))}
      </div>

      <div className="flex justify-center pt-3">
        <ButtonElement
          type="button"
          text="Close"
          handleClick={onClose}
          className="!bg-gray-500 hover:!bg-gray-600"
        />
      </div>
    </div>
  )
}

export default AssignClass
