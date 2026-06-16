'use client'

import React, { useRef, useState, useMemo } from 'react'
import { useGetStudentByClass } from '@/app/enduser/(StudentManagement)/Student/hooks'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import { Printer, X } from 'lucide-react'
import { useGetExamById } from '../hooks'
import { useGetSchoolById } from '@/app/admin/Setup/School/hooks'
import { useGetClassById } from '../../Class/hooks'
import AdmitCard from './Admitcard'
import { useGetAllParents } from '@/app/enduser/(StudentManagement)/_Parent/hooks'
import { IParent } from '@/app/enduser/(StudentManagement)/_Parent/types/IParents'
import toast, { Toaster } from 'react-hot-toast'

type Props = {
  ExamId: string
}

const PrintAdmitCardsPage = ({ ExamId }: Props) => {
  const printRef = useRef<HTMLDivElement>(null)
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [showPrintPreview, setShowPrintPreview] = useState(false)

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

  const handlePrintPreview = () => {
    if (selectedStudents.length === 0) {
      toast.error('Please select at least one student')
      return
    }
    setShowPrintPreview(true)
  }

  const handlePrint = () => {
    if (!printRef.current) {
      toast.error('Content not found')
      return
    }

    const content = printRef.current.innerHTML

    const printWindow = window.open('', '_blank', 'width=1200,height=900')

    if (!printWindow) {
      toast.error('Popup blocked. Please allow popups for this site.')
      return
    }

    try {
      printWindow.document.write(`
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>${exam?.name ?? 'Exam'} - Admit Cards</title>
    <script src="https://cdn.tailwindcss.com"><\/script>
    <style>
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        margin: 0;
        padding: 0;
      }
      body {
        margin: 0;
        padding: 16px;
        background: white;
      }
      @media print {
        body {
          margin: 0;
          padding: 0;
        }
      }
    </style>
  </head>
  <body>
    ${content}
    <script>
      window.onload = function() {
        setTimeout(function() {
          window.print();
        }, 500);
      };
    <\/script>
  </body>
</html>
      `)

      printWindow.document.close()

      setTimeout(() => {
        if (printWindow) {
          printWindow.focus()
        }
      }, 100)

      toast.success('Print dialog opened')
      setShowPrintPreview(false)
    } catch (error) {
      console.error('Print error:', error)
      toast.error('Error: ' + String(error))
    }
  }

  const handleOpen = () => {
    if (!exam || !students?.Items?.length) {
      toast.error('Student or exam data not available yet. Please try again.')
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

  const filteredStudents =
    students?.Items?.filter((s) => selectedStudents.includes(s.id as string)) ??
    []

  return (
    <>
      <Toaster position="top-right" />

      <ButtonElement
        type="button"
        text=""
        icon={<Printer size={16} />}
        onClick={handleOpen}
      />

      {isOpen && exam && students?.Items && (
        <div className="fixed inset-0 ml-12 md:ml-64 sm:ml-16 xs:ml-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white max-w-[95vw] md:max-w-[85vw] lg:max-w-[75vw] xl:max-w-[70vw] max-h-full overflow-auto rounded-lg shadow-lg p-6 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">{exam.name} - Admit Cards</h2>
              <div className="flex gap-3">
                <ButtonElement
                  type="button"
                  text="Print Selected"
                  icon={<Printer size={14} />}
                  onClick={handlePrintPreview}
                />
                <button
                  onClick={handleClose}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
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
                  className="flex items-start gap-4 border p-4 rounded-md bg-gray-50 hover:bg-gray-100 transition"
                >
                  <input
                    type="checkbox"
                    className="mt-3 w-5 h-5 cursor-pointer"
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

      {showPrintPreview && filteredStudents.length > 0 && (
        <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                Print Preview - {filteredStudents.length} Admit Card(s)
              </h2>
              <button
                onClick={() => setShowPrintPreview(false)}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 bg-gray-50 space-y-6">
              <div ref={printRef} className="space-y-6">
                {filteredStudents.map((student) => (
                  <div key={student.id} className="flex justify-center">
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

            <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end gap-2">
              <button
                onClick={() => setShowPrintPreview(false)}
                className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition"
              >
                Close
              </button>
              <button
                onClick={handlePrint}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition"
              >
                <Printer size={16} />
                Print Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PrintAdmitCardsPage
