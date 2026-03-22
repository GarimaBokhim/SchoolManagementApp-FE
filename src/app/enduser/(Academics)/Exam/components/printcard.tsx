'use client'

import React, { useRef, useState, useMemo } from 'react'
import { useReactToPrint } from 'react-to-print'
import { useGetStudentByClass } from '@/app/enduser/(StudentManagement)/Student/hooks'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import { Printer } from 'lucide-react'
import { useGetExamById } from '../hooks'
import { useGetSchoolById } from '@/app/admin/Setup/School/hooks'
import { useGetClassById } from '../../Class/hooks'
import AdmitCard from './Admitcard'
import { useGetAllParents } from '@/app/enduser/(StudentManagement)/_Parent/hooks'
import { IParent } from '@/app/enduser/(StudentManagement)/_Parent/types/IParents'

type Props = {
  ExamId: string
}

const PrintAdmitCardsPage = ({ ExamId }: Props) => {
  const printRef = useRef<HTMLDivElement>(null)
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const { data: exam } = useGetExamById(ExamId)
  const { data: students } = useGetStudentByClass(exam?.classId as string)
  const { data: classDetail } = useGetClassById(exam?.classId as string)
  const { data: allParents } = useGetAllParents()

  const schoolId = useMemo(() => {
    try {
      const storedUser = localStorage.getItem('userDetails')
      if (!storedUser) return null
      return JSON.parse(storedUser).schoolId ?? null
    } catch {
      return null
    }
  }, [])

  const { data: matchedSchool } = useGetSchoolById(schoolId)

  const allStudentIds = students?.Items?.map((s) => s.id as string) ?? []
  const isAllSelected =
    selectedStudents.length === allStudentIds.length && allStudentIds.length > 0

  const toggleStudent = (id: string) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    setSelectedStudents(isAllSelected ? [] : allStudentIds)
  }

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${exam?.name ?? 'Exam'}-Admit-Cards`,
    onAfterPrint: () => {
      setIsOpen(false)
      setSelectedStudents([])
    },
  })

  const handleOpen = () => {
    if (!exam || !students?.Items?.length) {
      alert('Student or exam data not available yet. Please try again.')
      return
    }
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
    setSelectedStudents([])
  }

  const getParentForStudent = (parentId: string): IParent | null => {
    return allParents?.Items?.find((p) => p.id === parentId) ?? null
  }

  return (
    <div>
      <ButtonElement
        type="button"
        text=""
        icon={<Printer size={16} />}
        onClick={handleOpen}
      />

      {isOpen && exam && students?.Items && (
        <div className="fixed inset-0 ml-12 md:ml-64 sm:ml-16 xs:ml-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white max-w-[95vw] md:max-w-[85vw] lg:max-w-[75vw] xl:max-w-[70vw] max-h-full overflow-auto rounded-lg shadow-lg p-6 relative">

            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">{exam.name} - Admit Cards</h2>
              <div className="flex gap-3">
                <ButtonElement
                  type="button"
                  text="Print Selected"
                  icon={<Printer size={14} />}
                  onClick={() => {
                    if (selectedStudents.length === 0) {
                      alert('Please select at least one student')
                      return
                    }
                    handlePrint()
                  }}
                />
                <button
                  onClick={handleClose}
                  className="px-3 py-1 bg-gray-200 rounded"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Select All */}
            <div className="flex items-center gap-2 mb-4 border-b pb-2">
              <input
                type="checkbox"
                className="w-5 h-5"
                checked={isAllSelected}
                onChange={toggleSelectAll}
              />
              <label className="font-medium cursor-pointer">Select All</label>
            </div>

            {/* Student List Preview */}
            <div className="space-y-3">
              {students.Items.map((student) => (
                <div
                  key={student.id}
                  className="flex items-start gap-4 border p-4 rounded-md bg-gray-50"
                >
                  <input
                    type="checkbox"
                    className="mt-3 w-5 h-5"
                    checked={selectedStudents.includes(student.id as string)}
                    onChange={() => toggleStudent(student.id as string)}
                  />
                  <AdmitCard
                    student={student}
                    exam={exam}
                    schoolDetail={matchedSchool}
                    classDetail={classDetail}
                    parent={getParentForStudent(student.parentId)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hidden print area */}
      <div className="hidden">
        <div ref={printRef}>
          {students?.Items?.filter((s) =>
            selectedStudents.includes(s.id as string)
          ).map((student) => (
            <div key={student.id} className="p-4">
              <AdmitCard
                student={student}
                exam={exam!}
                schoolDetail={matchedSchool}
                classDetail={classDetail}
                parent={getParentForStudent(student.parentId)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PrintAdmitCardsPage