'use client'
import { useEffect, useRef, useState } from 'react'
import {
  IAcademicTeam,
  IFilterAcademicTeamByDate,
} from '../types/IAcademicTeam'
import { SubmitHandler, useForm } from 'react-hook-form'
import Pagination from '@/components/Pagination'
import React from 'react'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import toast, { Toaster } from 'react-hot-toast'
import useErrorHandler from '@/components/helpers/ErrorHandling'
import { Toast } from '@/components/Toast/toast'
import {
  Box,
  Eye,
  Filter,
  Plus,
  RotateCcw,
  UserRoundPlus,
  X,
} from 'lucide-react'
import DateRangeFilter, {
  DateRangeFilterRef,
} from '@/components/DateFilter/FilterComponent'
import {
  useFilterAcademicTeamByDate,
  useGetClassWithSubjectByAcademicTeam,
} from '../hooks'
import { IClassWithSubjectDetailsResponse } from '../types/IAcademicTeam'
import AddAcademicTeam from '../pages/Add'
import useMenuPermissionData from '@/app/SuperAdmin/navigation/hooks/useMenuPermissionData'
import { usePermissions } from '@/context/auth/PermissionContext'
import AssignClass from './AssignClass'
import {
  AssignClassTeacherModal,
  ClassTeacherCell,
} from './ClassTeacherAssignment'

interface AssignmentDetailsProps {
  academicTeamId: string
  onClose: () => void
}

const AssignmentDetails = ({
  academicTeamId,
  onClose,
}: AssignmentDetailsProps) => {
  const { data, isLoading, isError } =
    useGetClassWithSubjectByAcademicTeam(academicTeamId)

  return (
    <div
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center 
             bg-black/40 backdrop-blur-sm ml-12 md:ml-64 sm:ml-16 xs:ml-0"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="assignment-details-title"
        className="flex max-h-[85vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-[#2f2f2f]"
      >
        <header className="flex items-start justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-700">
          <div>
            <h2
              id="assignment-details-title"
              className="text-lg font-semibold text-gray-900 dark:text-white"
            >
              Class &amp; Subject Details
            </h2>
            {/* <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
              Current assignments for this academic team
            </p> */}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close assignment details"
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <X size={18} />
          </button>
        </header>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
          {isLoading && (
            <p className="py-6 text-center text-sm text-gray-500">
              Loading assignment details...
            </p>
          )}
          {isError && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
              Could not load assignment details. Please close and try again.
            </p>
          )}
          {!isLoading &&
            !isError &&
            data?.map(
              (item: IClassWithSubjectDetailsResponse, index: number) => {
                const classes = item.Classes ?? item.classes ?? []

                return (
                  <article
                    key={`${item.academicteamId ?? item.AcademicTeamId ?? academicTeamId}-${index}`}
                    className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-[#383838]"
                  >
                    {classes.length > 0 ? (
                      classes.map((classItem, classIndex) => {
                        const classId = classItem.ClassId ?? classItem.classId
                        const subjects =
                          classItem.Subjects ?? classItem.subjects ?? []

                        return (
                          <div
                            key={`${classId ?? classIndex}-${classIndex}`}
                            className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-600 dark:bg-[#2f2f2f]"
                          >
                            <p className="text-base font-semibold text-gray-900 dark:text-white">
                              {classItem.ClassName ??
                                classItem.className ??
                                'Unnamed class'}
                            </p>
                            {/* <p className="mt-2 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                              Subjects
                              <span className="ml-2 normal-case">
                                ({subjects.length})
                              </span>
                            </p> */}
                            {subjects.length > 0 ? (
                              <ul className="mt-2 flex flex-wrap gap-2">
                                {subjects.map((subject, subjectIndex) => (
                                  <li
                                    key={`${subject.SubjectId ?? subject.subjectId ?? subjectIndex}-${subjectIndex}`}
                                    className="rounded-full bg-teal-50 px-3 py-1 text-sm text-teal-800 dark:bg-teal-900/30 dark:text-teal-200"
                                  >
                                    {subject.SubjectName ??
                                      subject.subjectName ??
                                      'Unnamed subject'}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="mt-2 text-sm text-gray-500">
                                No subjects assigned.
                              </p>
                            )}
                          </div>
                        )
                      })
                    ) : (
                      <p className="rounded-lg bg-white p-3 text-sm text-gray-500 dark:bg-[#2f2f2f]">
                        No classes assigned.
                      </p>
                    )}
                  </article>
                )
              })}
          {!isLoading && !isError && !data?.length && (
            <p className="py-6 text-center text-sm text-gray-500">
              No assignment details available.
            </p>
          )}
        </div>

        <footer className="flex justify-end border-t border-gray-200 px-5 py-3 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
          >
            Close
          </button>
        </footer>
      </section>
    </div>
  )
}

const AllAcademicTeamForm = () => {
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

  const [addModal, setAddModal] = useState(false)
  const { menuStatus } = usePermissions()
  const { canAdd } = useMenuPermissionData(menuStatus)

  const [params, setParams] = useState('')
  const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`

  const form = useForm<IFilterAcademicTeamByDate>({
    defaultValues: {
      fullName: '',
      startDate: '',
      endDate: '',
    },
  })

  const fullQuery = query + (params || '')

  const handleSubmit = useForm<SearchParam>({
    defaultValues: {},
  })

  const {
    data: filteredAcademicTeam,
    refetch,
    isLoading,
  } = useFilterAcademicTeamByDate(fullQuery)

  useEffect(() => {
    refetch()
  }, [paginationParams, refetch])

  const { handleError, clearError } = useErrorHandler()
  const [openFilter, setOpenFilter] = useState(false)

  const onSubmit: SubmitHandler<IFilterAcademicTeamByDate> = async (
    formData
  ) => {
    clearError()
    try {
      const queryParams = [
        formData.fullName
          ? `fullName=${encodeURIComponent(formData.fullName)}`
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

  const [selectedTeacherId, setSelectedTeacherId] = useState<
    string | undefined
  >('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [detailsAcademicTeamId, setDetailsAcademicTeamId] = useState<
    string | null
  >(null)
  const [classTeacherAcademicTeamId, setClassTeacherAcademicTeamId] = useState<
    string | null
  >(null)

  const handleAssignClass = (academicTeamId?: string) => {
    setDetailsAcademicTeamId(null)
    setSelectedTeacherId(academicTeamId)
    setIsModalOpen(true)
  }

  const handleShowAssignmentDetails = (academicTeamId?: string) => {
    if (!academicTeamId) return
    setIsModalOpen(false)
    setDetailsAcademicTeamId(academicTeamId)
  }

  const onClearClick = () => {
    refetch()
    setParams('')
    formRef.current?.handleClear()
    form.reset()
  }

  return (
    <>
      <div className="p-4 sm:p-6">
        <div className="bg-white dark:bg-[#353535] border border-gray-200 rounded-xl shadow-sm overflow-hidden h-full">
          <div className="flex w-full justify-between p-3 px-4 pt-4 items-center ">
            <h1 className=" text-xl font-semibold ">All AcademicTeams</h1>

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
                  text="Add New AcademicTeam"
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
                <DateRangeFilter
                  ref={formRef}
                  form={form}
                  onSubmit={onSubmit}
                  setParams={setParams}
                />

                <div className="flex gap-2 ml-auto">
                  <ButtonElement
                    type="submit"
                    text="Filter"
                    icon={<Filter size={14} />}
                    className="!bg-emerald-600 hover:!bg-emerald-700"
                  />
                  <ButtonElement
                    type="button"
                    text="Clear"
                    icon={<RotateCcw size={14} />}
                    onClick={onClearClick}
                    className="!bg-gray-500 hover:!bg-gray-600"
                  />
                </div>
              </form>
            </div>
          )}

          <div className="flex flex-col h-[70vh] sm:h-[75vh] md:h-[80vh] overflow-hidden mt-4">
            <div className="overflow-x-auto overflow-y-auto flex-1">
              <table className="w-full border-collapse text-xs sm:text-sm">
                <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-[#80878c] dark:text-white">
                  <tr className="uppercase text-sm font-semibold border-b border-gray-200 text-gray-700 dark:text-white">
                    <th className="px-4 py-3 text-left w-[60px]">S.N</th>
                    <th className="px-4 py-3 text-left">Full Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Address</th>
                    <th className="px-4 py-3 text-left">Class Teacher</th>
                    <th className="px-4 py-3 text-center w-[180px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-gray-500">
                        Loading AcademicTeams...
                      </td>
                    </tr>
                  ) : filteredAcademicTeam?.Items?.length ? (
                    filteredAcademicTeam?.Items.map(
                      (AcademicTeam: IAcademicTeam, index: number) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border-b border-gray-100 dark:text-gray-100 text-gray-700"
                        >
                          <td className="py-3 px-4">{index + 1}</td>
                          <td className="py-3 px-4">{AcademicTeam.fullName}</td>
                          <td className="py-3 px-4">{AcademicTeam.email}</td>
                          <td className="py-3 px-4">{AcademicTeam.address}</td>
                          <td className="py-3 px-4">
                            {AcademicTeam.id ? (
                              <ClassTeacherCell
                                academicTeamId={AcademicTeam.id}
                              />
                            ) : (
                              <span className="text-sm text-gray-400">
                                Not assigned
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex justify-center gap-2">
                              <button
                                type="button"
                                title="View class and subject assignments"
                                aria-label={`View class and subject assignments for ${AcademicTeam.fullName}`}
                                onClick={() =>
                                  handleShowAssignmentDetails(AcademicTeam.id)
                                }
                                className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white transition-colors hover:bg-blue-700"
                              >
                                <Eye size={15} />
                              </button>
                              <ButtonElement
                                icon={<Box size={14} />}
                                type="button"
                                text=""
                                handleClick={() => {
                                  handleAssignClass(AcademicTeam.id)
                                }}
                                customStyle="!text-xs font-bold !bg-teal-500"
                              />
                              <button
                                type="button"
                                title="Assign class teacher"
                                aria-label={`Assign a class teacher for ${AcademicTeam.fullName}`}
                                onClick={() =>
                                  setClassTeacherAcademicTeamId(
                                    AcademicTeam.id ?? null
                                  )
                                }
                                disabled={!AcademicTeam.id}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-emerald-600 text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <UserRoundPlus size={15} />
                              </button>
                            </div>

                            {selectedTeacherId === AcademicTeam.id &&
                              isModalOpen && (
                                <div className="relative">
                                  <AssignClass
                                    key={selectedTeacherId}
                                    teacherId={selectedTeacherId || ''}
                                    visible={isModalOpen}
                                    onClose={() => setIsModalOpen(false)}
                                  />
                                </div>
                              )}
                            {detailsAcademicTeamId === AcademicTeam.id && (
                              <AssignmentDetails
                                key={detailsAcademicTeamId}
                                academicTeamId={detailsAcademicTeamId}
                                onClose={() =>
                                  setDetailsAcademicTeamId(null)
                                }
                              />
                            )}
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="p-4 text-center text-gray-500 italic"
                      >
                        No AcademicTeams found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <AddAcademicTeam
            visible={addModal}
            onClose={() => setAddModal(false)}
          />

          {classTeacherAcademicTeamId && (
            <AssignClassTeacherModal
              academicTeamId={classTeacherAcademicTeamId}
              academicTeamName={
                filteredAcademicTeam?.Items?.find(
                  (team) => team.id === classTeacherAcademicTeamId
                )?.fullName ?? 'the selected team member'
              }
              onClose={() => setClassTeacherAcademicTeamId(null)}
            />
          )}

          {filteredAcademicTeam?.Items &&
            filteredAcademicTeam?.Items.length > 0 && (
              <div className="mt-4">
                <Pagination
                  form={handleSubmit}
                  pagination={{
                    currentPage: filteredAcademicTeam?.PageIndex ?? 1,
                    firstPage: filteredAcademicTeam?.FirstPage ?? 1,
                    lastPage: filteredAcademicTeam?.LastPage ?? 1,
                    nextPage: filteredAcademicTeam?.NextPage ?? 1,
                    previousPage: filteredAcademicTeam?.PreviousPage ?? 1,
                  }}
                  handleSearch={handleSearch}
                />
              </div>
            )}
        </div>
      </div>
    </>
  )
}

export default AllAcademicTeamForm
