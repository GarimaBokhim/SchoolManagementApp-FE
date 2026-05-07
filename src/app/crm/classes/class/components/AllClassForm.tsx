'use client'

import { useRef, useState } from 'react'
import { BookOpen, Filter, Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'
import Pagination from '@/components/Pagination'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import DateRangeFilter, { DateRangeFilterRef } from '@/components/DateFilter/FilterComponent'
import { usePermissions } from '@/context/auth/PermissionContext'
import useMenuPermissionData from '@/app/SuperAdmin/navigation/hooks/useMenuPermissionData'
import { ConsultancyClass, AddConsultancyClassPayload } from '../types/IClass'
import { useClassMutations, useGetAllConsultancyClasses } from '../hooks'
import { AddConsultancyClassModal } from './AddConsultenctClassModel'

const ENGLISH_PROFICIENCY_LABELS: Record<number, string> = {
  1: 'IELTS', 2: 'TOEFL', 3: 'PTE', 4: 'Other',
}

interface FilterFormData {
  startDate: string
  endDate: string
}

const AllClassesForm = () => {
  const { menuStatus } = usePermissions()
  const { canAdd, canEdit, canDelete } = useMenuPermissionData(menuStatus)

  const [openFilter, setOpenFilter] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [params, setParams] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const formRef = useRef<DateRangeFilterRef>(null)
  const pageSize = 10

  const form = useForm<FilterFormData>({
    defaultValues: { startDate: '', endDate: '' },
  })

  const paginationForm = useForm({
    defaultValues: { pageSize, pageIndex: currentPage, isPagination: true },
  })

  const { data, isLoading, error, refetch } = useGetAllConsultancyClasses(params)
  const { handleAdd, handleDelete, handleEdit } = useClassMutations(refetch)

  const classes: ConsultancyClass[] = data?.Items ?? []
  const totalPages = data?.TotalPages ?? 1

  const onFilterSubmit = async (formData: FilterFormData) => {
    const queryParams = [
      formData.startDate ? `startDate=${encodeURIComponent(formData.startDate)}` : null,
      formData.endDate ? `endDate=${encodeURIComponent(formData.endDate)}` : null,
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
  }

  const handleClearFilters = () => {
    form.reset({ startDate: '', endDate: '' })
    setParams('')
    formRef.current?.handleClear()
    refetch()
  }

  const handleAddSubmit = async (payload: AddConsultancyClassPayload) => {
    await handleAdd(payload)
    setIsAddModalOpen(false)
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <Toaster position="top-right" />
        <div className="bg-white dark:bg-[#353535] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-8">
          <div className="text-center py-16">
            <BookOpen size={64} className="mx-auto text-red-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              Error loading classes
            </h3>
            <p className="text-gray-500 dark:text-gray-400">Please try again later.</p>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="bg-white dark:bg-[#353535] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="p-4 sm:p-6">
        <div className="bg-white dark:bg-[#353535] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">

          {/* Header */}
          <div className="flex w-full justify-between p-3 px-4 pt-4 items-center">
            <h1 className="text-xl font-semibold dark:text-white">All Classes</h1>
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
                  icon={<Plus size={18} />}
                  type="button"
                  text="Add New"
                  onClick={() => setIsAddModalOpen(true)}
                  className="!font-semibold"
                />
              )}
            </div>
          </div>

          {/* Filter Panel */}
          {openFilter && (
            <div className="mb-6 mx-4 bg-white dark:bg-[#353535] p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
              <form
                onSubmit={form.handleSubmit(onFilterSubmit)}
                className="flex flex-wrap items-end gap-4 md:gap-6"
              >
                <DateRangeFilter
                  ref={formRef}
                  form={form}
                  onSubmit={onFilterSubmit}
                  setParams={setParams}
                  startDateKey="startDate"
                  endDateKey="endDate"
                />
              </form>
            </div>
          )}

          {/* Table */}
          <div className="px-4 pb-4">
            <div className="w-full overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-[#80878c] uppercase font-semibold border-b">
                    <th className="px-4 py-3 text-left">S.N</th>
                    <th className="px-4 py-3 text-left">Class Name</th>
                    <th className="px-4 py-3 text-left hidden md:table-cell">Start Time</th>
                    <th className="px-4 py-3 text-left hidden md:table-cell">End Time</th>
                    <th className="px-4 py-3 text-left hidden lg:table-cell">Batch</th>
                    <th className="px-4 py-3 text-left hidden lg:table-cell">Proficiency</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {classes.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="p-4 text-center italic text-gray-500 dark:text-gray-400"
                      >
                        No classes found.
                      </td>
                    </tr>
                  ) : (
                    classes.map((cls, index) => (
                      <tr
                        key={cls.id}
                        className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2a2b2e] transition-colors"
                      >
                        <td className="px-4 py-3 text-gray-500">
                          {(currentPage - 1) * pageSize + index + 1}
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">
                          {cls.name}
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300 hidden md:table-cell">
                          {cls.startTime}
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300 hidden md:table-cell">
                          {cls.endTime}
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300 hidden lg:table-cell">
                          {cls.batch}
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300 hidden lg:table-cell">
                          {ENGLISH_PROFICIENCY_LABELS[cls.englishProficiency] ?? cls.englishProficiency}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${cls.isActive
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                            {cls.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center gap-3">
                            {canEdit && (
                              <button
                                onClick={() => handleEdit()}
                                className="text-xs text-yellow-600 hover:text-yellow-700 font-medium"
                              >
                                Edit
                              </button>
                            )}
                            {canDelete && (
                              <button
                                onClick={() => handleDelete(cls.id)}
                                className="text-xs text-red-500 hover:text-red-600 font-medium"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pagination */}
        {classes.length > 0 && totalPages > 1 && (
          <div className="mt-4">
            <Pagination
              form={paginationForm}
              pagination={{
                currentPage,
                firstPage: 1,
                lastPage: totalPages,
                nextPage: currentPage < totalPages ? currentPage + 1 : currentPage,
                previousPage: currentPage > 1 ? currentPage - 1 : 1,
              }}
              handleSearch={(p) => setCurrentPage(p.pageIndex)}
            />
          </div>
        )}
      </div>

      <AddConsultancyClassModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
      />
    </>
  )
}

export default AllClassesForm