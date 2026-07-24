'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { BookOpen, Edit, Filter, MoreVertical, Plus, Trash } from 'lucide-react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast, { Toaster } from 'react-hot-toast'
import Pagination from '@/components/Pagination'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import DateRangeFilter, {
  DateRangeFilterRef,
} from '@/components/DateFilter/FilterComponent'
import { usePermissions } from '@/context/auth/PermissionContext'
import useMenuPermissionData from '@/app/SuperAdmin/navigation/hooks/useMenuPermissionData'
import { useDeleteVisaApplication, useGetAllVisaApplication } from '../hooks'
import { UpdateVisaApplicationResponse } from '../types/IVisaApplication'
import AddVisaApplication from '../pages/Add'
import useErrorHandler from '@/components/helpers/ErrorHandling'
import { Toast } from '@/components/Toast/toast'

interface FilterFormData {
  startDate: string
  endDate: string
}

interface ActionMenuProps {
  Invoice: UpdateVisaApplicationResponse
  onEdit: (visaApplication: UpdateVisaApplicationResponse) => void
  onDelete: (id: string) => void
  canEdit?: boolean
  canDelete?: boolean
}

const ActionMenu = ({
  Invoice,
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = true,
}: ActionMenuProps) => {
  const [open, setOpen] = useState(false)
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({})
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const calculatePosition = useCallback(() => {
    if (!buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    const menuHeight = 160
    const menuWidth = 180
    const spaceBelow = window.innerHeight - rect.bottom
    const openUpward = spaceBelow < menuHeight + 8
    setMenuStyle({
      position: 'fixed',
      right: window.innerWidth - rect.right,
      top: openUpward ? rect.top - menuHeight - 4 : rect.bottom + 4,
      width: menuWidth,
      zIndex: 9999,
    })
  }, [])

  const toggle = () => {
    if (!open) calculatePosition()
    setOpen((prev) => !prev)
  }

  useEffect(() => {
    if (!open) return
    const handle = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      )
        setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  useEffect(() => {
    if (!open) return
    const update = () => calculatePosition()
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
    }
  }, [open, calculatePosition])

  return (
    <div className="flex justify-center">
      <button
        ref={buttonRef}
        onClick={toggle}
        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        title="Actions"
      >
        <MoreVertical size={18} className="text-gray-600 dark:text-gray-300" />
      </button>

      {open && (
        <div
          ref={menuRef}
          style={menuStyle}
          className="bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1"
        >
          <button
            onClick={() => {
              onEdit(Invoice)
              setOpen(false)
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <Edit size={14} /> Edit
          </button>
          <button
            onClick={() => {
              onDelete(Invoice.id)
              setOpen(false)
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <Trash size={14} /> Delete
          </button>

          {/* {canEdit && (
                        <button
                            onClick={() => { onEdit(InstallmentInvoice); setOpen(false) }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                        >
                            <Edit size={14} /> Edit
                        </button>
                    )} */}
          {/*
                    <button
                        onClick={() => { onConvert(InstallmentInvoice); setOpen(false) }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                        <User size={14} /> Convert to Applicant
                    </button> */}

          {/* {canDelete && (
                        <button
                            onClick={() => { onDelete(Invoice.id); setOpen(false) }}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                        >
                            <Trash size={14} /> Delete
                        </button>
                    )} */}
        </div>
      )}
    </div>
  )
}
//#endregion

const AllVisaApplicationForm = () => {
  const { menuStatus } = usePermissions()
  const { handleError, clearError } = useErrorHandler()
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
  const handlePageChange = (params: SearchParam) => {
    params.pageSize = paginationParams.pageSize
    setPaginationParams(params)
  }

  const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`
  const [params, setParams] = useState('')
  const fullQuery = query + (params || '')
  const { data, isLoading, error } = useGetAllVisaApplication(fullQuery)

  const { canAdd, canEdit, canDelete } = useMenuPermissionData(menuStatus)

  const [openFilter, setOpenFilter] = useState(false)
  const [addModal, setAddModal] = useState(false)
  const [visaApplicationForm, setVisaApplicationForm] = useState(false)
  const [selectedId, setSelectedId] = useState<string>('')

  const formRef = useRef<DateRangeFilterRef>(null)

  const form = useForm<FilterFormData>({
    defaultValues: { startDate: '', endDate: '' },
  })

  const deleteVisaApplication = useDeleteVisaApplication()

  const visaApplicationDetails = data?.Items ?? []

  const onFilterSubmit: SubmitHandler<FilterFormData> = async (formData) => {
    clearError()
    try {
      const queryParams = [
        // formData.name
        //   ? `name=${encodeURIComponent(formData.name)}`
        //   : null,
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

  const monthType = [
    { id: 1, name: 'January' },
    { id: 2, name: 'February' },
    { id: 3, name: 'March' },
    { id: 4, name: 'April' },
    { id: 5, name: 'May' },
    { id: 6, name: 'June' },
    { id: 7, name: 'July' },
    { id: 8, name: 'August' },
    { id: 9, name: 'September' },
    { id: 10, name: 'October' },
    { id: 11, name: 'November' },
    { id: 12, name: 'MDecembery' },
  ]
  const handleDelete = async (id: string) => {
    try {
      console.error('Id', id)
      await deleteVisaApplication.mutateAsync(id)
    } catch (error) {
      console.error(error)
    }
  }

  const handleAddSubmit = () => {
    setAddModal(false)
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
            <p className="text-gray-500 dark:text-gray-400">
              Please try again later.
            </p>
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
          <div className="flex w-full justify-between p-3 px-4 pt-4 items-center">
            <h1 className="text-xl font-semibold dark:text-white">
              All VisaApplication
            </h1>
            <div className="flex items-center space-x-3">
              <ButtonElement
                type="button"
                text="Filter"
                icon={<Filter size={14} />}
                onClick={() => setOpenFilter(!openFilter)}
                className="!bg-emerald-600 hover:!bg-emerald-700"
              />
              <ButtonElement
                icon={<Plus size={18} />}
                type="button"
                text="Add VisaApplication"
                onClick={() => setAddModal(true)}
                className="!font-semibold"
              />

              {/* {canAdd && (
                                <ButtonElement
                                    icon={<Plus size={18} />}
                                    type="button"
                                    text="Add New Installments"
                                    onClick={() => setAddModal(true)}
                                    className="!font-semibold"
                                />
                            )} */}
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
                {/*<div className="flex-1 min-w-[240px]">
                  <AppCombobox
                    value={selectedStudentName}
                    dropDownWidth="w-full"
                    dropdownPositionClass="absolute"
                    label="Parent Name"
                    name="firstName"
                    form={form}
                    options={allStudent?.Items}
                    selected={
                      allStudent?.Items?.find(
                        (g) => g.firstName === selectedStudentName
                      ) || null
                    }
                    onSelect={(group) => {
                      setSelectedStudentName(group ? group.firstName : null)
                    }}
                    getLabel={(g) => g?.firstName ?? ''}
                    getValue={(g) => g?.firstName ?? ''}
                  />
                </div>
                <div className="flex gap-2 mt-2 sm:mt-0 lg:ml-auto">
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
                </div>*/}
              </form>
            </div>
          )}

          <div className="px-4 pb-4">
            <div className="w-full overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-[#80878c] uppercase font-semibold border-b">
                    <th className="px-4 py-3 text-left">S.N</th>
                    <th className="px-4 py-3 text-left">Applicant</th>
                    <th className="px-4 py-3 text-left hidden md:table-cell">
                      Country
                    </th>
                    <th className="px-4 py-3 text-left hidden md:table-cell">
                      University
                    </th>
                    <th className="px-4 py-3 text-left hidden lg:table-cell">
                      Course
                    </th>
                    <th className="px-4 py-3 text-left hidden lg:table-cell">
                      Intake
                    </th>
                    <th className="px-4 py-3 text-left hidden lg:table-cell">
                      Applied Date
                    </th>
                    <th className="px-4 py-3 text-center">Visa Status</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visaApplicationDetails.length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="p-4 text-center italic text-gray-500 dark:text-gray-400"
                      >
                        No visa applications found.
                      </td>
                    </tr>
                  ) : (
                    visaApplicationDetails.map((visaApplication, index) => (
                      <tr
                        key={visaApplication.id}
                        className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2a2b2e] transition-colors"
                      >
                        <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                        <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">
                          {visaApplication.applicantName}
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300 hidden md:table-cell">
                          {visaApplication.countryName}
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300 hidden md:table-cell">
                          {visaApplication.universityName}
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300 hidden lg:table-cell">
                          {visaApplication.courseTitle}
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300 hidden lg:table-cell">
                          {
                            monthType.find(
                              (i) => i.id === visaApplication.intakeMonth
                            )?.name
                          }
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300 hidden lg:table-cell">
                          {visaApplication.appliedDate}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {visaApplication.visaStatusName}
                        </td>
                        <td className="py-1 px-4">
                          {/* <VisaApplicationActionMenu
                                                        visaApplication={app}  // ✅ Fixed: was `application`, now `app`
                                                        onView={handleView}
                                                        onEdit={handleEdit}
                                                        onDelete={handleDelete}
                                                        canEdit={canEdit}
                                                        canDelete={canDelete}
                                                    /> */}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {data && data?.Items?.length > 0 && (
          <div className="mt-4">
            <Pagination
              form={form}
              pagination={{
                currentPage: data?.PageIndex ?? 1,
                firstPage: data?.FirstPage ?? 1,
                lastPage: data?.LastPage ?? 1,
                nextPage: data?.NextPage ?? 1,
                previousPage: data?.PreviousPage ?? 1,
              }}
              handleSearch={handlePageChange}
            />
          </div>
        )}
      </div>

      <AddVisaApplication visible={addModal} onClose={handleAddSubmit} />
    </>
  )
}

export default AllVisaApplicationForm
