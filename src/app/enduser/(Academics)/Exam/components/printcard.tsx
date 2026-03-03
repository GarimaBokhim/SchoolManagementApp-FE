/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import React, { useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import { useParams } from 'next/navigation'
import { useGetStudentByClass } from '@/app/enduser/(StudentManagement)/Student/hooks'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import { Printer } from 'lucide-react'
import { useGetExamById } from '../hooks'
import AdmitCard from './Admitcard'

const PrintAdmitCardsPage = () => {
  const { ExamId } = useParams()
  const printRef = useRef<HTMLDivElement>(null)

  const { data: exam } = useGetExamById(ExamId as string)
  const { data: students } = useGetStudentByClass(exam?.classId as string)

  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)

  if (!exam || !students?.Items) return null

  const toggleStudent = (id: string) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }
  const allStudentIds = students.Items.map((student) => student.id as string)

  const isAllSelected =
    selectedStudents.length === allStudentIds.length && allStudentIds.length > 0

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedStudents([])
    } else {
      setSelectedStudents(allStudentIds)
    }
  }

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${exam.name}-Admit-Cards`,
    onAfterPrint: () => {
      setIsOpen(false)
      setSelectedStudents([])
    },
  })

  return (
    <div>
      <ButtonElement
        type="button"
        text=""
        icon={<Printer size={16} />}
        onClick={() => setIsOpen(true)}
      />

      {isOpen && (
        <div className="fixed inset-0 ml-12 md:ml-64 sm:ml-16 xs:ml-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white max-w-[95vw] md:max-w-[85vw] lg:max-w-[75vw] xl:max-w-[70vw]   max-h-full overflow-auto rounded-lg shadow-lg p-6 relative">
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
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1 bg-gray-200 rounded"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-4 border-b pb-2">
              <input
                type="checkbox"
                className="w-5 h-5"
                checked={isAllSelected}
                onChange={toggleSelectAll}
              />
              <label className="font-medium cursor-pointer">Select All</label>
            </div>

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

                  <AdmitCard student={student} exam={exam} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="hidden">
        <div ref={printRef}>
          {students.Items.filter((student) =>
            selectedStudents.includes(student.id as string)
          ).map((student) => (
            <div
              key={student.id}
              className="flex items-start gap-4 border p-4 rounded-md bg-gray-50"
            >
              <AdmitCard student={student} exam={exam} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PrintAdmitCardsPage
