/* eslint-disable @next/next/no-img-element */
'use client'

import React, { forwardRef } from 'react'
import { IStudent } from '@/app/enduser/(StudentManagement)/Student/types/IStudents'
import { IExam } from '../types/IExams'
import { IParent } from '@/app/enduser/(StudentManagement)/_Parent/types/IParents'
import { ISchool } from '@/app/admin/Setup/School/types/ISchool' // adjust path as needed

type ClassDetail = {
  name: string
}

type AdmitCardProps = {
  student: IStudent
  exam: IExam
  schoolDetail?: ISchool | null  
  classDetail?: ClassDetail
  parent?: IParent | null
}

const getGenderLabel = (gender: number): string => {
  if (gender === 1) return 'Male'
  if (gender === 2) return 'Female'
  if (gender === 3) return 'Others'
  return '-'
}

const formatDate = (date: Date | string | undefined): string => {
  if (!date) return '-'
  return new Date(date).toISOString().split('T')[0]
}

const AdmitCard = forwardRef<HTMLDivElement, AdmitCardProps>(
  ({ student, exam, schoolDetail, classDetail, parent }, ref) => {
    return (
      <div
        ref={ref}
        className="w-[780px] bg-white border border-gray-400 shadow-md rounded-md font-sans"
      >
        {/* Header */}
        <div className="relative h-[80px] bg-blue-900 text-white rounded-t-md">
          <div className="text-center pt-4">
            <h1 className="text-xl font-extrabold text-yellow-400">
              {schoolDetail?.name ?? '-'}
            </h1>
            <p className="text-xs">{schoolDetail?.address ?? '-'}</p>
            <p className="text-xs">{schoolDetail?.contactNumber ?? '-'}</p>
          </div>
        </div>

        {/* Body */}
        <div className="flex">
          {/* Side label */}
          <div className="w-10 bg-blue-900 text-yellow-400 flex items-center justify-center">
            <span className="[writing-mode:vertical-lr] [text-orientation:mixed] text-xs font-bold tracking-wider">
              EXAM ADMIT CARD
            </span>
          </div>

          {/* Main content */}
          <div className="flex-1 p-6 text-sm relative">
            <div className="grid grid-cols-2 gap-x-10 gap-y-2">

              {/* Row 1 */}
              <div>
                <b>Student Name:</b> {student.firstName}{' '}
                {student.middleName ? student.middleName + ' ' : ''}
                {student.lastName}
              </div>
              <div>
                <b>Admission No:</b> {student.admissionNumber || '-'}
              </div>

              {/* Row 2 */}
              <div>
                <b>Class:</b> {classDetail?.name ?? '-'}
              </div>
              <div>
                <b>Section:</b> {student.classSectionId || '-'}
              </div>

              {/* Row 3 */}
              <div>
                <b>Symbol No:</b> {student.registrationNumber ?? '-'}
              </div>
              <div>
                <b>Gender:</b> {getGenderLabel(student.genderStatus)}
              </div>

              {/* Row 4 */}
              <div>
                <b>Date of Birth:</b> {formatDate(student.dateOfBirth)}
              </div>
              <div>
                <b>Enrollment Date:</b> {formatDate(student.enrollmentDate)}
              </div>

              {/* Row 5 */}
              <div>
                <b>Parent Name:</b> {parent?.fullName ?? '-'}
              </div>
              <div>
                <b>Exam Date:</b> {formatDate(exam?.examDate)}
              </div>

              {/* Row 6 */}
              <div>
                <b>Exam Name:</b> {exam?.name ?? '-'}
              </div>

            </div>

            <div className="mt-4 text-xs font-semibold text-right">
              Principal Signature
            </div>
          </div>

          {/* Photo */}
          <div className="w-[160px] p-5 flex items-center justify-center">
       <img
  src={
    student.imageUrl || student.studentImg?.toString()
      ? (student.imageUrl || student.studentImg?.toString())
      : student.genderStatus === 2
      ? '/assets/female.png'
      : '/assets/male.png'
  }
  className="w-[90px] h-[110px] border object-cover"
  alt="Student"
/>
          </div>
        </div>
      </div>
    )
  }
)

AdmitCard.displayName = 'AdmitCard'

export default AdmitCard