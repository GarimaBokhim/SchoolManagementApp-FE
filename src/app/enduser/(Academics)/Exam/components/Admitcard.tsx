/* eslint-disable @next/next/no-img-element */
'use client'

import React, { forwardRef, useEffect, useState } from 'react'
import { IStudent } from '@/app/enduser/(StudentManagement)/Student/types/IStudents'
import { IExam } from '../types/IExams'
import { useGetAllClass, useGetClassById } from '../../Class/hooks'
import { useGetAllSchool } from '@/app/admin/Setup/School/hooks'
import { useGetAllExams, useGetExamById } from '../hooks'
import { useGetAllStudents } from '@/app/enduser/(StudentManagement)/Student/hooks'

type AdmitCardProps = {
  student: IStudent
  exam: IExam
}

const AdmitCard = forwardRef<HTMLDivElement, AdmitCardProps>(
  ({ student, exam }, ref) => {
    const [institutionId, setInstitutionId] = useState<string | null>(null)
    const { data: studentsDetail } = useGetAllStudents()
    const { data: allClass } = useGetClassById(student.classId)
    const { data: schoolDetail } = useGetAllSchool()
    const { data: examdetails } = useGetAllExams()
    useEffect(() => {
      if (typeof window !== 'undefined') {
        const id = localStorage.getItem('institutionId')
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setInstitutionId(id)
      }
    }, [])

    return (
      <div
        ref={ref}
        className="w-[780px] h-[280px] bg-white border border-gray-400 shadow-md rounded-md font-sans"
      >
        <div className="relative h-[80px] bg-blue-900 text-white rounded-t-md">
          <div className="text-center pt-4">
            <h1 className="text-xl font-extrabold text-yellow-400">
              {schoolDetail?.Items[0]?.name}
            </h1>

            <p className="text-xs">{schoolDetail?.Items[0]?.address}</p>

            <p className="text-xs">{schoolDetail?.Items[0]?.contactNumber}</p>
          </div>
        </div>

        <div className="flex h-[170px]">
          <div className="w-10 bg-blue-900 text-yellow-400 flex items-center justify-center">
            <span className="[writing-mode:vertical-lr] [text-orientation:mixed] text-xs font-bold tracking-wider">
              EXAM ADMIT CARD
            </span>
          </div>

          <div className="flex-1 p-6 text-sm space-y-3 relative">
            <div>
              <b>Student Name:</b> {student.firstName} {student.lastName}
            </div>

            <div className="flex gap-10">
              <div>
                <b>Class:</b> {allClass?.name ?? '-'}
              </div>

              <div>
                <b>Roll No:</b> -
              </div>
            </div>

            <div className="flex gap-10">
              <div>
                <b>Sec:</b>
                {studentsDetail?.Items[0]?.classSectionId ?? '-'}
              </div>

              <div>
                <b>Symbol No:</b> {student.registrationNumber ?? '-'}
              </div>
            </div>

            <div>
              <b>Exam Date:</b>
              {examdetails?.Items[0]?.examDate
                ? new Date(examdetails?.Items[0]?.examDate)
                    .toISOString()
                    .split('T')[0]
                : '-'}
            </div>

            <div className="absolute right-6 bottom-6 text-xs font-semibold">
              Principal Signature
            </div>
          </div>

          <div className="w-[160px] p-5 flex items-center justify-center">
            <img
              src={student.studentImg || '/default.png'}
              className="w-[90px] h-[110px] border object-cover"
              alt="Student"
            />
          </div>
        </div>

        <div className="h-[30px] bg-blue-900 text-yellow-400 text-center text-xs flex items-center justify-center">
          www.saraswati.edu.np
        </div>
      </div>
    )
  }
)

AdmitCard.displayName = 'AdmitCard'

export default AdmitCard
