'use client'
import React, { useState } from 'react'
import { Filter, RotateCcw, X } from 'lucide-react'
import { AppCombobox } from '@/components/Input/ComboBox'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import { SubmitHandler, useForm } from 'react-hook-form'
import { adToBs } from '@sbmdkl/nepali-date-converter'
import { IFilterAttendance } from '../types/IStudentAttendance'
import { useGetAttendanceReport } from '../hooks'
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

const getCurrentBsDate = () => {
  const today = new Date()
  const adDate = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  const [year, monthNumber] = adToBs(adDate).split('-')
  const monthName = MonthList[Number(monthNumber) - 1]?.name

  if (!year || !monthName) {
    throw new Error('Could not determine the current Bikram Sambat date')
  }

  return { year, month: monthName }
}

const buildAttendanceReportParams = (
  classId: string | null,
  yearName: string,
  nameOfMonths: string
) => {
  if (!classId || !yearName || !nameOfMonths) return ''

  const queryParams = new URLSearchParams({
    classId,
    yearName,
    nameOfMonths,
  })

  return `?${queryParams.toString()}`
}

const MonthlyAttendanceSheet = ({ visible, onClose, classId }: Props) => {
  const [currentBsDate] = useState(getCurrentBsDate)
  const [selectedMonth, setSelectedMonth] = useState(currentBsDate.month)
  const form = useForm<IFilterAttendance>({
    defaultValues: {
      classId: classId ?? '',
      yearName: currentBsDate.year,
      nameOfMonths: currentBsDate.month,
    },
  })
  const days = Array.from({ length: 31 }, (_, i) => i + 1)
  const [params, setParams] = useState(() =>
    buildAttendanceReportParams(
      classId,
      currentBsDate.year,
      currentBsDate.month
    )
  )
  const { data: attendanceReport } = useGetAttendanceReport(params)

  const { data: allStudents } = useGetAllStudents()

  const onClearClick = () => {
    setSelectedMonth(currentBsDate.month)
    form.reset({
      classId: classId ?? '',
      yearName: currentBsDate.year,
      nameOfMonths: currentBsDate.month,
    })
    setParams(
      buildAttendanceReportParams(
        classId,
        currentBsDate.year,
        currentBsDate.month
      )
    )
  }
  if (!visible) return null
  const onSubmit: SubmitHandler<IFilterAttendance> = (formData) => {
    const monthName = formData.nameOfMonths || selectedMonth
    setParams(
      buildAttendanceReportParams(classId, currentBsDate.year, monthName)
    )
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
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                Current Year (BS)
              </label>
              <div className="mt-1 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 dark:border-gray-600 dark:bg-[#353535]">
                {currentBsDate.year}
              </div>
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
                  MonthList.find((month) => month.name === selectedMonth) ||
                  undefined
                }
                onSelect={(month) => {
                  const monthName = month?.name ?? ''
                  setSelectedMonth(monthName)
                  form.setValue('nameOfMonths', monthName, {
                    shouldDirty: true,
                  })
                }}
                getLabel={(month) => month.name}
                getValue={(month) => month.name}
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
                      const dayStr = String(day).padStart(2, '0')
                      let status: string | null | undefined = null

                      if (student.Attendance) {
                        for (const key in student.Attendance) {
                          // The key is in format YYYY-MM-DD. We match the DD part.
                          if (key.endsWith(`-${dayStr}`)) {
                            status = student.Attendance[key].Status
                            break
                          }
                        }
                      }

                      // Determine cell styling based on status
                      let statusClass = 'text-gray-400 hover:bg-gray-50 dark:hover:bg-[#3f3f3f]'
                      if (status === 'P') statusClass = 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 font-bold'
                      else if (status === 'A') statusClass = 'text-red-600 bg-red-50 dark:bg-red-900/20 font-bold'
                      else if (status === 'T') statusClass = 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 font-bold'
                      else if (status === 'E') statusClass = 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 font-bold'
                      else if (status === 'U') statusClass = 'text-gray-600 bg-gray-100 dark:bg-gray-800 font-bold'

                      return (
                        <td
                          key={day}
                          className={`border px-2 py-2 text-center transition-colors ${statusClass}`}
                        >
                          {status ?? '-'}
                        </td>
                      )
                    })}
                  </tr>
                ))
                : (
                  <tr>
                    <td colSpan={days.length + 2} className="px-4 py-8 text-center text-gray-500">
                      No attendance report of this month
                    </td>
                  </tr>
                )}
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
