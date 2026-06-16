'use client'
import { useEffect, useRef, useState } from 'react'
import { IExamResult, IFilterExamResultByDate } from '../types/IExamResults'
import { SubmitHandler, useForm } from 'react-hook-form'
import Pagination from '@/components/Pagination'
import React from 'react'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import toast, { Toaster } from 'react-hot-toast'
import useErrorHandler from '@/components/helpers/ErrorHandling'
import { Toast } from '@/components/Toast/toast'
import { EditButton } from '@/components/Buttons/EditButton'
import { Edit, Filter, Plus, Printer, RotateCcw, Trash } from 'lucide-react'
import EditExamResult from '../pages/Edit'
import DateRangeFilter, {
  DateRangeFilterRef,
} from '@/components/DateFilter/FilterComponent'
import { useFilterExamResultByDate, useRemoveExamResult } from '../hooks'
import { AppCombobox } from '@/components/Input/ComboBox'
import { usePermissions } from '@/context/auth/PermissionContext'
import useMenuPermissionData from '@/app/SuperAdmin/navigation/hooks/useMenuPermissionData'
import AddExamResult from '../pages/Add'
import DeleteButton from '@/components/Buttons/DeleteButton'

import { useGetAllExams } from '../../Exam/hooks'
import SchoolMarkSheet from './SchoolMarkSheet'
import SchoolMarkSheetSecond from './SchoolMarkSheetSecond'
import { IStudent } from '@/app/enduser/(StudentManagement)/Student/types/IStudents'
import { useGetStudentById } from '@/app/enduser/(StudentManagement)/Student/hooks' // Changed import

const formatStudentDisplayName = (s: IStudent | undefined) => {
  if (!s) return ''
  return [s.firstName, s.middleName, s.lastName]
    .filter(Boolean)
    .join(' ')
    .trim()
}

function paginationItems<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[]
  if (data == null || typeof data !== 'object') return []
  const o = data as { Items?: T[]; items?: T[] }
  if (Array.isArray(o.Items)) return o.Items
  if (Array.isArray(o.items)) return o.items
  return []
}

/** Filter/list APIs may serialize exam rows in PascalCase. */
type ApiExamResultRow = IExamResult & {
  StudentId?: string
  ExamId?: string
  Id?: string
}

const examResultStudentId = (row: ApiExamResultRow): string | undefined => {
  const v = row.studentId ?? row.StudentId
  if (v == null || String(v).trim() === '') return undefined
  return String(v)
}

const examResultExamId = (row: ApiExamResultRow): string | undefined => {
  const v = row.examId ?? row.ExamId
  if (v == null || String(v).trim() === '') return undefined
  return String(v)
}

const examResultRowId = (row: ApiExamResultRow): string | undefined =>
  row.id ?? row.Id

// Custom component to fetch and display student name by ID
const StudentNameCell = ({ studentId }: { studentId: string | undefined }) => {
  const { data: studentData, isLoading } = useGetStudentById(studentId || '')

  if (!studentId) return <span>—</span>
  if (isLoading) return <span className="text-gray-400">Loading...</span>
  if (!studentData) return <span>—</span>

  return <span>{formatStudentDisplayName(studentData)}</span>
}

const AllExamResultForm = () => {
  const [paginationParams, setPaginationParams] = useState({
    pageSize: 10,
    pageIndex: 1,
    isPagination: true,
  })
  type SearchParam = {
    pageSize: number
    pageIndex: number
    isPagination: boolean
  }
  const handleSearch = (params: SearchParam) => {
    params.pageSize = paginationParams.pageSize
    setPaginationParams(params)
  }
  const [showExamResults, setShowExamResults] = useState(false)
  const [addModal, setAddModal] = useState(false)
  const { menuStatus } = usePermissions()
  const { canEdit, canDelete, canAdd } = useMenuPermissionData(menuStatus)
  const [selectedId, setSelectedId] = useState<string>('')

  // State for storing student data for filter dropdown
  const [studentOptions, setStudentOptions] = useState<IStudent[]>([])
  const [isLoadingStudents, setIsLoadingStudents] = useState(false)

  // Edit button element
  const editButtonElement = (id: string) => {
    return (
      <ButtonElement
        icon={<Edit size={14} />}
        type="button"
        text=""
        onClick={() => {
          setShowExamResults(true)
          setSelectedId(id)
        }}
        className="!text-xs font-bold !bg-teal-500"
      />
    )
  }

  const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`
  const [params, setParams] = useState('')
  const { data: allExam } = useGetAllExams()

  const [showStudentPrint, setShowStudentPrint] = useState(false)
  const [showStudentPrintSecond, setShowStudentPrintSecond] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<string | null>('')
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null)

  const handleSubmit = useForm<SearchParam>({
    defaultValues: {},
  })
  const form = useForm<IFilterExamResultByDate>({
    defaultValues: {
      studentId: '',
      subjectId: '',
      startDate: '',
      endDate: '',
    },
  })

  const fullQuery = query + (params || '')

  const {
    data: filteredExamResult,
    refetch,
    isLoading,
  } = useFilterExamResultByDate(fullQuery)
  const examResultRows = paginationItems<ApiExamResultRow>(filteredExamResult)
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  )

  useEffect(() => {
    refetch()
  }, [paginationParams, refetch])

  const { handleError, clearError } = useErrorHandler()
  const [openFilter, setOpenFilter] = useState(false)

  const onSubmit: SubmitHandler<IFilterExamResultByDate> = async (formData) => {
    clearError()
    try {
      const queryParams = [
        formData.studentId
          ? `studentId=${encodeURIComponent(formData.studentId)}`
          : null,
        formData.subjectId
          ? `subjectId=${encodeURIComponent(formData.subjectId)}`
          : null,
        formData.startDate
          ? `startDate=${encodeURIComponent(formData.startDate)}`
          : null,
        formData.endDate
          ? `endDate=${encodeURIComponent(formData.endDate)}`
          : null,
      ]
        .filter(Boolean)
        .join('&')
      const fullQuery = queryParams ? `&${queryParams}` : ''
      await toast.promise(
        (async () => {
          setParams(fullQuery)
          await refetch()
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

  const refForInput = useRef<HTMLInputElement>(null)
  useEffect(() => {
    refForInput.current?.focus()
  }, [])

  const formRef = useRef<DateRangeFilterRef>(null)
  const deleteExamResult = useRemoveExamResult()

  const handleDelete = async (id: string) => {
    try {
      await deleteExamResult.mutateAsync(id)
      toast.success('User deleted successfully!')
      refetch()
    } catch {
      toast.error('Error deleting user.')
    }
  }

  const onClearClick = () => {
    refetch()
    setParams('')
    formRef.current?.handleClear()
    setSelectedStudentId('')
    form.reset()
  }

  // Function to load student options for filter dropdown
  // You'll need to get unique student IDs from examResultRows
  useEffect(() => {
    const loadStudentOptions = async () => {
      const uniqueStudentIds = [
        ...new Set(
          examResultRows.map((row) => examResultStudentId(row)).filter(Boolean)
        ),
      ]

      setIsLoadingStudents(true)
      // This is a limitation - you might want to create a separate API endpoint
      // to get students by multiple IDs, or keep using getAllStudentsV2 for the filter
      // For now, we'll keep the filter simple or you can implement batch fetching
      setIsLoadingStudents(false)
    }

    loadStudentOptions()
  }, [examResultRows])

  return (
    <>
      <div className="md:px-4 px-4 ">
        <div className="overflow-x-auto bg-white dark:bg-[#353535] border border-gray-200 rounded-xl">
          <div className="flex w-full justify-between p-3 px-4 pt-4 items-center ">
            <h1 className="text-xl font-semibold ">All ExamResults</h1>
            <div className="flex items-center space-x-3">
              <ButtonElement
                type="button"
                text="Filter"
                icon={<Filter size={14} />}
                onClick={() => setOpenFilter(!openFilter)}
                className="!bg-emerald-600 hover:!bg-emerald-700"
              />
              {canAdd && (
                <ButtonElement
                  icon={<Plus size={24} />}
                  type="button"
                  text="Add New ExamResult"
                  onClick={() => setAddModal(true)}
                  className="!text-md !font-bold"
                />
              )}
            </div>
          </div>
          {openFilter && (
            <div className="mb-6 bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-wrap items-end gap-4 md:gap-6"
              >
                {/* Date range picker */}
                <DateRangeFilter
                  ref={formRef}
                  form={form}
                  onSubmit={onSubmit}
                  setParams={setParams}
                />

                {/* Student name filter - Simplified for now */}
                <div className="flex-1 min-w-[240px]">
                  <input
                    type="text"
                    placeholder="Enter Student ID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={selectedStudentId || ''}
                    onChange={(e) => {
                      const id = e.target.value
                      setSelectedStudentId(id)
                      form.setValue('studentId', id)
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter Student ID to filter
                  </p>
                </div>

                {/* Action buttons */}
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
          )}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-50 dark:text-white text-gray-700 dark:bg-[#80878c] uppercase text-sm font-semibold border-b border-gray-200">
                  <th className="px-4 py-3 text-left w-[60px]">S.N</th>
                  <th className="px-4 py-3">Exam Name</th>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Remarks</th>
                  <th className="px-4 py-3 text-center w-[280px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-500">
                      Loading ExamResults...
                    </td>
                  </tr>
                ) : examResultRows.length > 0 ? (
                  examResultRows.map(
                    (ExamResult: ApiExamResultRow, index: number) => {
                      const sid = examResultStudentId(ExamResult)
                      const eid = examResultExamId(ExamResult)
                      return (
                        <tr
                          key={examResultRowId(ExamResult) ?? index}
                          className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border-b border-gray-100 dark:text-gray-100 text-gray-700"
                        >
                          <td className="py-3 px-4">{index + 1}</td>
                          <td className="py-3 px-4">
                            {
                              paginationItems<{ id?: string; name?: string }>(
                                allExam
                              ).find((i) => String(i.id) === String(eid))?.name
                            }
                          </td>
                          <td className="py-3 px-4">
                            {/* Using the new StudentNameCell component with useGetStudentById */}
                            <StudentNameCell studentId={sid} />
                          </td>
                          <td className="px-2 md:px-4">{ExamResult.remarks}</td>
                          <td className="py-3 px-4">
                            <div className="flex justify-center gap-2">
                              {/* First Print Button - Opens SchoolMarkSheet */}
                              <ButtonElement
                                icon={<Printer size={14} />}
                                text=""
                                type="button"
                                onClick={() => {
                                  setShowStudentPrint(true)
                                  setSelectedExamId(eid ?? null)
                                  setSelectedStudent(sid ?? '')
                                }}
                                className="!text-xs !bg-blue-500 hover:!bg-blue-600"
                              />

                              <ButtonElement
                                icon={<Printer size={14} />}
                                text=""
                                type="button"
                                onClick={() => {
                                  setShowStudentPrintSecond(true)
                                  setSelectedExamId(eid ?? null)
                                  setSelectedStudent(sid ?? '')
                                }}
                                className="!text-xs !bg-blue-500 hover:!bg-blue-600"
                              />

                              {/* Edit Button - Conditional */}
                              {canEdit && (
                                <EditButton
                                  button={editButtonElement(
                                    examResultRowId(ExamResult) ?? ''
                                  )}
                                />
                              )}

                              {/* Delete Button - Conditional */}
                              {canDelete && (
                                <DeleteButton
                                  onConfirm={() =>
                                    handleDelete(
                                      examResultRowId(ExamResult) ?? ''
                                    )
                                  }
                                  headerText={<Trash />}
                                  content="Are you sure you want to delete this ExamResult?"
                                />
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    }
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-4 text-center text-gray-500 italic"
                    >
                      No ExamResults found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* First Print Modal - SchoolMarkSheet */}
          {showStudentPrint && selectedStudent && selectedExamId && (
            <SchoolMarkSheet
              studentId={selectedStudent}
              examId={selectedExamId}
              onClose={() => setShowStudentPrint(false)}
            />
          )}
          {/* Second Print Modal - SchoolMarkSheetSecond */}
          {showStudentPrintSecond && selectedStudent && selectedExamId && (
            <SchoolMarkSheetSecond
              studentId={selectedStudent}
              examId={selectedExamId}
              onClose={() => setShowStudentPrintSecond(false)}
            />
          )}
          {showExamResults && selectedId && (
            <EditExamResult
              ExamResultId={selectedId}
              visible={showExamResults}
              onClose={() => setShowExamResults(false)}
            />
          )}
          <AddExamResult
            visible={addModal}
            onClose={() => setAddModal(false)}
          />
        </div>
        {examResultRows.length > 0 && (
          <div className="mt-4">
            <Pagination
              form={handleSubmit}
              pagination={{
                currentPage: Array.isArray(filteredExamResult)
                  ? 1
                  : (filteredExamResult?.PageIndex ?? 1),
                firstPage: Array.isArray(filteredExamResult)
                  ? 1
                  : (filteredExamResult?.FirstPage ?? 1),
                lastPage: Array.isArray(filteredExamResult)
                  ? 1
                  : (filteredExamResult?.LastPage ?? 1),
                nextPage: Array.isArray(filteredExamResult)
                  ? 1
                  : (filteredExamResult?.NextPage ?? 1),
                previousPage: Array.isArray(filteredExamResult)
                  ? 1
                  : (filteredExamResult?.PreviousPage ?? 1),
              }}
              handleSearch={handleSearch}
            />
          </div>
        )}
      </div>
    </>
  )
}

export default AllExamResultForm
