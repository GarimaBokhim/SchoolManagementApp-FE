/* eslint-disable @next/next/no-img-element */
'use client'

import React, { forwardRef, useEffect, useState } from 'react'
import { IStudent } from '@/app/enduser/(StudentManagement)/Student/types/IStudents'
import { IExam } from '../types/IExams'
import { useGetAllClass } from '../../Class/hooks'
import { useGetAllSchool } from '@/app/admin/Setup/School/hooks'

type AdmitCardProps = {
  student: IStudent
  exam: IExam
}

const AdmitCard = forwardRef<HTMLDivElement, AdmitCardProps>(
  ({ student, exam }, ref) => {
    const [institutionId, setInstitutionId] = useState<string | null>(null)

    const { data: allClass } = useGetAllClass()
    const { data: schoolDetail } = useGetAllSchool()
    useEffect(() => {
      if (typeof window !== 'undefined') {
        const id = localStorage.getItem('institutionId')
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setInstitutionId(id)
      }
    }, [])
    const school = schoolDetail?.Items?.find(
      (i) => i.institutionId === institutionId
    )

    const studentClass = allClass?.Items?.find(
      (item) => item.id === student.classId
    )

    return (
      <div
        ref={ref}
        className="w-[780px] h-[280px] bg-white border border-gray-400 shadow-md rounded-md font-sans"
      >
        {/* HEADER */}
        <div className="relative h-[80px] bg-blue-900 text-white rounded-t-md">
          <div className="text-center pt-4">
            <h1 className="text-xl font-extrabold text-yellow-400">
              {school?.name ?? 'School Name'}
            </h1>

            <p className="text-xs">{school?.address ?? 'Address'}</p>

            <p className="text-xs">Phone No. {school?.contactNumber ?? '-'}</p>
          </div>
        </div>

        {/* BODY */}
        <div className="flex h-[170px]">
          {/* LEFT STRIP */}
          <div className="w-10 bg-blue-900 text-yellow-400 flex items-center justify-center">
            <span className="[writing-mode:vertical-lr] [text-orientation:mixed] text-xs font-bold tracking-wider">
              EXAM ADMIT CARD
            </span>
          </div>

          {/* STUDENT INFO */}
          <div className="flex-1 p-6 text-sm space-y-3 relative">
            <div>
              <b>Student Name:</b> {student.firstName} {student.lastName}
            </div>

            <div className="flex gap-10">
              <div>
                <b>Class:</b> {studentClass?.name ?? '-'}
              </div>

              <div>
                <b>Roll No:</b> -
              </div>
            </div>

            <div className="flex gap-10">
              <div>
                <b>Sec:</b> {student.classSectionId ?? '-'}
              </div>

              <div>
                <b>Symbol No:</b> {student.registrationNumber ?? '-'}
              </div>
            </div>

            <div>
              <b>Exam Date:</b>{' '}
              {exam?.examDate ? new Date(exam.examDate).toDateString() : '-'}
            </div>

            <div className="absolute right-6 bottom-6 text-xs font-semibold">
              Principal Signature
            </div>
          </div>

          {/* STUDENT PHOTO */}
          <div className="w-[160px] p-5 flex items-center justify-center">
            <img
              src={student.studentImg || '/default.png'}
              className="w-[90px] h-[110px] border object-cover"
              alt="Student"
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="h-[30px] bg-blue-900 text-yellow-400 text-center text-xs flex items-center justify-center">
          www.saraswati.edu.np
        </div>
      </div>
    )
  }
)

AdmitCard.displayName = 'AdmitCard'

export default AdmitCard
