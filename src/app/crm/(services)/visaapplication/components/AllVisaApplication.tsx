'use client'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  BookOpen,
  Edit,
  Filter,
  MoreVertical,
  Plus,
  RotateCcw,
  Trash,
} from 'lucide-react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast, { Toaster } from 'react-hot-toast'
import Pagination from '@/components/Pagination'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import DateRangeFilter, {
  DateRangeFilterRef,
} from '@/components/DateFilter/FilterComponent'
import { usePermissions } from '@/context/auth/PermissionContext'
import useMenuPermissionData from '@/app/SuperAdmin/navigation/hooks/useMenuPermissionData'
import {
  useDeleteVisaApplication,
  useGetAllVisaApplication,
  useGetAllVisaStatus,
} from '../hooks'
import { VisaApplicationResponse } from '../types/IVisaApplication'
import AddVisaApplication from '../pages/Add'
import EditVisaApplication from '../pages/Edit'
import useErrorHandler from '@/components/helpers/ErrorHandling'
import { Toast } from '@/components/Toast/toast'
import { AppCombobox } from '@/components/Input/ComboBox'
import DeleteComponents from '@/components/DeleteComponent/DeleteComponents'

interface FilterFormData {
  name: string
  startDate: string
  endDate: string
}

interface ActionMenuProps {
  visaApplication: VisaApplicationResponse
  onEdit: (visaApplication: VisaApplicationResponse) => void
  onDelete: (id: string) => void
  canEdit?: boolean
  canDelete?: boolean
}

const ActionMenu = ({
  visaApplication,
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = true,
}: ActionMenuProps) => {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({})
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const calculatePosition = () => {
    const button = buttonRef.current
    if (!button) return

    const rect = button.getBoundingClientRect()
    const menuWidth = 180
    const menuHeight = (canEdit ? 40 : 0) + (canDelete ? 40 : 0) || 40
    const spaceBelow = window.innerHeight - rect.bottom
    const openUpward = spaceBelow < menuHeight + 8

    const left = Math.min(
      Math.max(8, rect.right - menuWidth),
      window.innerWidth - menuWidth - 8
    )

    setMenuStyle({
      position: 'fixed',
      left,
      top: openUpward
        ? Math.max(8, rect.top - menuHeight - 4)
        : rect.bottom + 4,
      width: menuWidth,
      zIndex: 99999,
    })
  }

  const toggle = () => {
    if (!open) calculatePosition()
    setOpen((previous) => !previous)
  }

  useEffect(() => {
    if (!open) return

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        !menuRef.current?.contains(target) &&
        !buttonRef.current?.contains(target)
      ) {
        setOpen(false)
      }
    }

    const updatePosition = () => calculatePosition()

    document.addEventListener('mousedown', handleOutsideClick)
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [open, canEdit, canDelete])

  return (
    <div className="flex justify-center">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        aria-label="Open actions"
        aria-haspopup="menu"
        aria-expanded={open}
        className="rounded-full p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Actions"
      >
        <MoreVertical size={18} className="text-gray-600 dark:text-gray-300" />
      </button>

      {open && mounted &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            style={menuStyle}
            className="rounded-md border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
          >
            {canEdit && (
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false)
                  onEdit(visaApplication)
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <Edit size={14} />
                Edit
              </button>
            )}

            {canDelete && (
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false)
                  onDelete(visaApplication.id)
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
              >
                <Trash size={14} />
                Delete
              </button>
            )}

            {!canEdit && !canDelete && (
              <div className="px-4 py-2 text-sm text-gray-500">
                No actions available
              </div>
            )}
          </div>,
          document.body
        )}
    </div>
  )
}
//#endregion

const AllVisaApplicationForm = () => {
  const { menuStatus } = usePermissions()
  const { handleError, clearError } = useErrorHandler()
  //const { canAdd, canEdit, canDelete } = useMenuPermissionData(menuStatus)
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
  const { data: visaStatusOptions = [] } = useGetAllVisaStatus()

  //const { canAdd, canEdit, canDelete } = useMenuPermissionData(menuStatus)

  const [openFilter, setOpenFilter] = useState(false)
  const [addModal, setAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteVisaApplicationId, setDeleteVisaApplicationId] = useState<
    string | null
  >(null)
  const [editVisaApplication, setEditVisaApplication] =
    useState<VisaApplicationResponse | null>(null)
  const [selectedVisaStatusName, setSelectedVisaStatusName] = useState<
    string | null
  >('')

  const formRef = useRef<DateRangeFilterRef>(null)

  const form = useForm<FilterFormData>({
    defaultValues: { name: '', startDate: '', endDate: '' },
  })

  const deleteVisaApplication = useDeleteVisaApplication()

  const visaApplicationDetails = data?.Items ?? []

  const onFilterSubmit: SubmitHandler<FilterFormData> = async (formData) => {
    clearError()
    try {
      const queryParams = [
        formData.name ? `name=${encodeURIComponent(formData.name)}` : null,
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

  const onClearClick = () => {
    setParams('')
    setSelectedVisaStatusName(null)
    formRef.current?.handleClear()
    form.reset({ name: '', startDate: '', endDate: '' })
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
  const handleDelete = (id: string) => {
    setDeleteVisaApplicationId(id)
    setShowDeleteModal(true)
  }

  const onDelete = async (id: string) => {
    try {
      await deleteVisaApplication.mutateAsync(id)
    } catch (error) {
      console.error(error)
    }
  }

  const handleAddSubmit = () => {
    setAddModal(false)
  }

  const handleEdit = (visaApplication: VisaApplicationResponse) => {
    setEditVisaApplication(visaApplication)
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

                <div className="flex-1 min-w-[240px]">
                  <AppCombobox
                    value={selectedVisaStatusName}
                    dropDownWidth="w-full"
                    dropdownPositionClass="absolute"
                    label="Visa Status"
                    name="name"
                    form={form}
                    options={visaStatusOptions}
                    selected={
                      visaStatusOptions.find(
                        (g) => g.name === selectedVisaStatusName
                      ) ?? null
                    }
                    onSelect={(group) => {
                      setSelectedVisaStatusName(group ? group.name : null)
                    }}
                    getLabel={(g) => g?.name ?? ''}
                    getValue={(g) => g?.name ?? ''}
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
                </div>
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

                        <td className="px-4 py-3 text-center">
                          <ActionMenu
                            visaApplication={visaApplication}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            canEdit={true}
                            canDelete={true}
                          />
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
      {showDeleteModal && deleteVisaApplicationId && (
        <DeleteComponents
          visible={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false)
            setDeleteVisaApplicationId(null)
          }}
          onConfirm={onDelete}
          id={deleteVisaApplicationId}
          title="Delete Visa Application"
          description="Are you sure you want to delete this Visa Application?"
        />
      )}
      {editVisaApplication && (
        <EditVisaApplication
          visible={Boolean(editVisaApplication)}
          visaApplication={editVisaApplication}
          onClose={() => setEditVisaApplication(null)}
        />
      )}
    </>
  )
}

export default AllVisaApplicationForm
