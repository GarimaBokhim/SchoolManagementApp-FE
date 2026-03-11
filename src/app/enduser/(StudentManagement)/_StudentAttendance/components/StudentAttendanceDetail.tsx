'use client'
import React, { useState } from 'react'
import { Filter, RotateCcw, X } from 'lucide-react'
import { AppCombobox } from '@/components/Input/ComboBox'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import { useGetAllAcademicTeams } from '@/app/enduser/(Staff)/AcademicStaff/hooks'
import { SubmitHandler, useForm } from 'react-hook-form'
import { IFilterAttendance } from '../types/IStudentAttendance'
import toast from 'react-hot-toast'
import { useGetAttendanceReport } from '../hooks'
import { Toast } from '@/components/Toast/toast'
import useErrorHandler from '@/components/helpers/ErrorHandling'
import { useGetAllStudents } from '../../Student/hooks'

interface Props {
  visible: boolean
  onClose: () => void
  classId: string | null
}
const MonthList = [
  { name: 'Baisakh', value: 1 },
  { name: 'Jestha', value: 2 },
  { name: 'Ashadh', value: 3 },
  { name: 'Shrawan', value: 4 },
  { name: 'Bhadra', value: 5 },
  { name: 'Ashwin', value: 6 },
  { name: 'Kartik', value: 7 },
  { name: 'Mangsir', value: 8 },
  { name: 'Poush', value: 9 },
  { name: 'Magh', value: 10 },
  { name: 'Falgun', value: 11 },
  { name: 'Chaitra', value: 12 },
]
const MonthlyAttendanceSheet = ({ visible, onClose, classId }: Props) => {
  const form = useForm<IFilterAttendance>({
    defaultValues: {
      academicTeamId: '',
      yearName: '',
      nameOfMonths: '',
    },
  })
  const { data: allAcademicTeam } = useGetAllAcademicTeams()
  const [selectedAcademicTeamId, setSelectedAcademicTeamId] = useState<
    string | null
  >(null)
  const [selectedMonth, setSelectedMonth] = useState<number | null>(0)
  const [selectedYear, setSelectedYear] = useState('2082')
  const days = Array.from({ length: 31 }, (_, i) => i + 1)
  const year = String(selectedYear)
  const month = String(selectedMonth).padStart(2, '0')
  const getDateKey = (day: number) =>
    `${year}-${month}-${String(day).padStart(2, '0')}`
  const [params, setParams] = useState('')
  const { data: attendanceReport } = useGetAttendanceReport(params)
  const { data: allStudents } = useGetAllStudents()
  const { handleError, clearError } = useErrorHandler()
  const onClearClick = () => {
    setSelectedAcademicTeamId('')
    setSelectedMonth(0)
    setSelectedYear('')
  }
  if (!visible) return null
  const onSubmit: SubmitHandler<IFilterAttendance> = async (formData) => {
    clearError()
    try {
      const queryParams = [
        classId ? `classId=${encodeURIComponent(classId)}` : null,
        formData.academicTeamId
          ? `academicTeamId=${encodeURIComponent(formData.academicTeamId)}`
          : null,
        selectedYear ? `yearName=${encodeURIComponent(selectedYear)}` : null,
        formData.nameOfMonths
          ? `nameOfMonths=${encodeURIComponent(formData.nameOfMonths)}`
          : null,
      ]
        .filter(Boolean)
        .join('&')
      const fullQuery = queryParams ? `?${queryParams}` : ''
      await toast.promise(
        (async () => {
          setParams(fullQuery)
        })(),
        {
          loading: 'Fetching data...',
          success: 'Data fetched successfully!',
        }
      )
    } catch (error) {
      const errorMsg = handleError(error)
      Toast.error(errorMsg)
      console.error('Error during form submission:', error)
    }
  }
  return (
    <div className="fixed ml-12 md:ml-64 sm:ml-16 xs:ml-0  inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white dark:bg-[#2f2f2f] w-[96%] max-w-7xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b dark:border-gray-600">
          <h2 className="text-lg font-semibold">Monthly Attendance Sheet</h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600"
          >
            <X size={22} />
          </button>
        </div>
        <div className="mb-6 bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-wrap items-end gap-4 md:gap-6"
          >
            <div className="flex-1 min-w-[240px]">
              <AppCombobox
                value={selectedAcademicTeamId}
                dropDownWidth="w-full"
                dropdownPositionClass="absolute"
                label="Academic Team"
                name="academicTeamId"
                form={form}
                options={allAcademicTeam?.Items}
                selected={
                  allAcademicTeam?.Items?.find(
                    (g) => g.id === selectedAcademicTeamId
                  ) || null
                }
                onSelect={(group) => {
                  if (group) {
                    setSelectedAcademicTeamId(group.id || null)
                  } else {
                    setSelectedAcademicTeamId(null)
                  }
                }}
                getLabel={(g) => g?.fullName ?? ''}
                getValue={(g) => g?.id ?? ''}
              />
            </div>
            <div className="flex-1 min-w-[240px]">
              <AppCombobox
                value={selectedMonth}
                dropDownWidth="w-full"
                dropdownPositionClass="absolute"
                label="Month"
                name="nameOfMonths"
                form={form}
                options={MonthList}
                selected={
                  MonthList?.find((g) => g.value === selectedMonth) || null
                }
                onSelect={(group) => {
                  if (group) {
                    setSelectedMonth(group.value || null)
                  } else {
                    setSelectedMonth(null)
                  }
                }}
                getLabel={(g) => g?.name ?? ''}
                getValue={(g) => g?.value ?? ''}
              />
            </div>

            <div className="flex gap-2 ml-auto">
              <ButtonElement
                type="submit"
                text="Filter"
                icon={<Filter size={14} />}
                className="!bg-emerald-600 hover:!bg-emerald-700 transition-all duration-150"
              />
              <ButtonElement
                type="button"
                text="Clear"
                icon={<RotateCcw size={14} />}
                onClick={onClearClick}
                className="!bg-gray-500 hover:!bg-gray-600 transition-all duration-150"
              />
            </div>
          </form>
        </div>
        <div className="overflow-auto px-4 pb-4">
          <table className="w-full border-collapse text-xs">
            <thead className="sticky top-0 z-10 bg-gray-100 dark:bg-[#80878c]">
              <tr>
                <th className="border px-2 py-2 text-center">S.N</th>
                <th className="border px-2 py-2 min-w-[180px] text-left">
                  Student Name
                </th>
                {days.map((d) => (
                  <th key={d} className="border px-2 py-2 text-center">
                    {d}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {attendanceReport?.Students &&
              attendanceReport?.Students.length > 0
                ? attendanceReport?.Students.map((student, index) => (
                    <tr
                      key={student.StudentId}
                      className="odd:bg-gray-50 dark:odd:bg-[#3a3a3a]"
                    >
                      <td className="border px-2 py-2 text-center font-medium">
                        {index + 1}
                      </td>
                      <td className="border px-2 py-2">
                        {(() => {
                          const s = allStudents?.Items.find(
                            (i) => i.id === student.StudentId
                          )
                          return s
                            ? [s.firstName, s.middleName, s.lastName]
                                .filter(Boolean)
                                .join(' ')
                            : '—'
                        })()}
                      </td>
                      {days.map((day) => {
                        const dateKey = getDateKey(day)
                        const status = student.Attendance?.[dateKey]?.Status

                        return (
                          <td
                            key={day}
                            className="border px-2 py-2 text-center hover:bg-emerald-100 dark:hover:bg-emerald-800"
                          >
                            {status ?? '-'}
                          </td>
                        )
                      })}
                    </tr>
                  ))
                : 'No attendance report of this month'}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t dark:border-gray-600 flex flex-wrap gap-3 text-xs">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">
            P = Present
          </span>
          <span className="px-3 py-1 rounded-full bg-red-100 text-red-700">
            A = Absent
          </span>
          <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">
            T = Tardy
          </span>
          <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-700">
            U = Unexcused
          </span>
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700">
            E = Excused
          </span>
        </div>
      </div>
    </div>
  )
}

export default MonthlyAttendanceSheet
