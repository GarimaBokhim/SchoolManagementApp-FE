/* eslint-disable react-hooks/set-state-in-effect */
'use client'
import React, { forwardRef, useEffect, useState, useMemo } from 'react'
import { useGetStudentById } from '@/app/enduser/(StudentManagement)/Student/hooks'
import { IStudent } from '@/app/enduser/(StudentManagement)/Student/types/IStudents'
import { useGetAllClass } from '@/app/enduser/(Academics)/Class/hooks'
import { useGetSchoolById } from '@/app/admin/Setup/School/hooks'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

const resolveStudentImageUrl = (student: IStudent): string => {
  const rawPath = (
    student.imageUrl ||
    (typeof student.studentImg === 'string' ? student.studentImg : '') ||
    ''
  ).trim()
  if (!rawPath) return ''
  if (/^https?:\/\//i.test(rawPath) || rawPath.startsWith('blob:'))
    return rawPath
  const base = BASE_URL.replace(/\/+$/, '')
  const path = rawPath.replace(/^\/+/, '')
  return base ? `${base}/${path}` : `/${path}`
}

type Props = {
  StudentId: string | number
}

const StudentIDCard = forwardRef<HTMLDivElement, Props>(
  ({ StudentId }, ref) => {
    const { data } = useGetStudentById(StudentId as string)
    const [student, setStudent] = useState<IStudent | null>(null)
    const { data: allClass } = useGetAllClass()

    const schoolId = useMemo(() => {
      try {
        const storedUser = localStorage.getItem('userDetails')
        if (!storedUser) return null
        return JSON.parse(storedUser).schoolId ?? null
      } catch {
        return null
      }
    }, [])

    const { data: schoolDetail } = useGetSchoolById(schoolId)

    const currentYear = new Date().getFullYear()
    const academicYear = `Valid Academic Year ${currentYear}-${currentYear + 1}`

    useEffect(() => {
      if (data) setStudent(data)
    }, [data])

    if (!student) return <div className="p-4">Loading...</div>

    const className =
      allClass?.Items?.find((c) => c.id === student.classId)?.name || 'N/A'
    const sectionName = student.classSectionId || 'N/A'
    const imageUrl = resolveStudentImageUrl(student)

    return (
      <div
        ref={ref}
        className="w-[520px] h-[300px] rounded-2xl overflow-hidden shadow-2xl border bg-white font-sans"
      >
        <div className="h-[60px] bg-gradient-to-r from-indigo-800 via-blue-700 to-cyan-600 text-white flex items-center justify-between px-6">
          <div>
            <h1 className="text-lg font-bold tracking-wide">
              {schoolDetail?.name || 'Saraswati Higher Secondary School'}
            </h1>
            <p className="text-xs opacity-90">
              {schoolDetail?.address || 'Birtamode-4, Jhapa'}
            </p>
          </div>
          <div className="text-xs font-semibold bg-white text-indigo-800 px-3 py-1 rounded-full">
            STUDENT ID
          </div>
        </div>

        <div className="flex h-[200px] px-6 py-4">
          <div className="w-[160px] flex flex-col items-center justify-center border-r pr-4">
            <div className="w-[110px] h-[110px] rounded-full border-4 border-indigo-600 overflow-hidden shadow-md flex items-center justify-center bg-gray-100">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Student Photo"
                  className="object-cover w-full h-full"
                />
              ) : student.genderStatus === 1 ? (
                <img src="/assets/male.jpg" alt="Male" className="w-12 h-12" />
              ) : student.genderStatus === 2 ? (
                <img
                  src="/assets/female.jpg"
                  alt="Female"
                  className="w-12 h-12"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-500">?</span>
                </div>
              )}
            </div>
            <p className="mt-3 text-xs font-semibold text-gray-500">
              Reg No: {student.registrationNumber}
            </p>
          </div>

          <div className="flex-1 pl-6 text-sm space-y-3">
            <div>
              <p className="text-gray-500 text-xs">Full Name</p>
              <p className="font-semibold text-base text-gray-800">
                {student.firstName} {student.middleName} {student.lastName}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-xs">Class</p>
                <p className="font-medium">{className}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Section</p>
                <p className="font-medium">{sectionName}</p>
              </div>
            </div>

            {student.admissionNumber && (
              <div>
                <p className="text-gray-500 text-xs">Roll No</p>
                <p className="font-medium">{student.admissionNumber}</p>
              </div>
            )}

            <div className="pt-6">
              <div className="border-t border-gray-400 w-[140px]"></div>
              <p className="text-xs text-gray-600 mt-1">Principal Signature</p>
            </div>
          </div>
        </div>

        <div className="h-[40px] bg-indigo-800 text-white flex items-center justify-between px-6 text-xs">
          <span>{academicYear}</span>
        </div>
      </div>
    )
  }
)

StudentIDCard.displayName = 'StudentIDCard'
export default StudentIDCard
