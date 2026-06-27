'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  BookOpen,
  Edit,
  Eye,
  Filter,
  MoreVertical,
  Plus,
  ReceiptIndianRupeeIcon,
  RotateCcw,
  Trash,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'
import Pagination from '@/components/Pagination'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import DateRangeFilter, {
  DateRangeFilterRef,
} from '@/components/DateFilter/FilterComponent'
import { usePermissions } from '@/context/auth/PermissionContext'
import useMenuPermissionData from '@/app/SuperAdmin/navigation/hooks/useMenuPermissionData'
import { useDeleteApplicants, useDocumentStatus, useGetAllApplicants } from '../hooks'
import { ApplicantResponse } from '../types/IApplicants'
import { Tooltip } from '@/components/ToolTip/Tooltip'
import DeleteComponents from '@/components/DeleteComponent/DeleteComponents'
import EditApplicants from '../pages/Edit'
import UserProfilePopupForm from './UserprofilePopUpForm'
import useErrorHandler from '@/components/helpers/ErrorHandling'
import { Toast } from '@/components/Toast/toast'
import { AppCombobox } from '@/components/Input/ComboBox'
import { useGetAllUserProfile } from '../../followup/hooks'

interface FilterFormData {
  startDate: string
  endDate: string
  userId: string
}

//#region ActionMenu
interface ActionMenuProps {
  Applicants: ApplicantResponse
  onEdit: (Applicants: ApplicantResponse) => void
  onDelete: (id: string) => void
  // onView: (Invoice: InvoiceResponse) => void;
  canEdit?: boolean
  canDelete?: boolean
}

const ActionMenu = ({
  Applicants,
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
          {canEdit && (
            <button
              onClick={() => {
                onEdit(Applicants)
                setOpen(false)
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <Edit size={14} /> Edit
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => {
                onDelete(Applicants.id)
                setOpen(false)
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <Trash size={14} /> Delete
            </button>
          )}
        </div>
      )}
    </div>
  )
}

//#endregion

//#region ApplicantCard (mobile)
interface ApplicantCardProps {
  Applicants: ApplicantResponse
  index: number
  rowNumber: number
  enrolmentName?: string
  onNameClick: (Applicants: ApplicantResponse) => void
  onEdit: (Applicants: ApplicantResponse) => void
  onDelete: (id: string) => void
  canEdit?: boolean
  canDelete?: boolean
}

const ApplicantCard = ({
  Applicants,
  rowNumber,
  enrolmentName,
  onNameClick,
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = true,
}: ApplicantCardProps) => {
  return (
    <div className="bg-white dark:bg-[#2a2b2e] border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="text-xs text-gray-400 dark:text-gray-500">
            #{rowNumber}
          </span>
          <button
            onClick={() => onNameClick(Applicants)}
            className="block text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline underline-offset-2 hover:underline-offset-4 transition-all font-semibold text-left truncate"
          >
            {Applicants.fullName ?? '-'}
          </button>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {Applicants.email}
          </p>
        </div>
        <ActionMenu
          Applicants={Applicants}
          onEdit={onEdit}
          onDelete={onDelete}
          canEdit={canEdit}
          canDelete={canDelete}
        />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-y-2 gap-x-3 text-sm">
        <div>
          <p className="text-xs uppercase text-gray-400 dark:text-gray-500">
            Applicant ID
          </p>
          <p className="text-gray-800 dark:text-gray-100 font-medium truncate">
            {Applicants.applicantId}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase text-gray-400 dark:text-gray-500">
            Enrolment
          </p>
          <p className="text-gray-800 dark:text-gray-100 font-medium truncate">
            {enrolmentName ?? '-'}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase text-gray-400 dark:text-gray-500">
            Country
          </p>
          <p className="text-gray-800 dark:text-gray-100 font-medium truncate">
            {Applicants.countryName ?? '-'}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase text-gray-400 dark:text-gray-500">
            University
          </p>
          <p className="text-gray-800 dark:text-gray-100 font-medium truncate">
            {Applicants.universityName ?? '-'}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase text-gray-400 dark:text-gray-500">
            Course
          </p>
          <p className="text-gray-800 dark:text-gray-100 font-medium truncate">
            {Applicants.courseName ?? '-'}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase text-gray-400 dark:text-gray-500">
            Admission Date
          </p>
          <p className="text-gray-800 dark:text-gray-100 font-medium truncate">
            {Applicants.admissionDate ?? '-'}
          </p>
        </div>
      </div>
    </div>
  )
}
//#endregion

const AllApplicantsForm = () => {
  const { menuStatus } = usePermissions()
  const { handleError, clearError } = useErrorHandler()
  const { canAdd, canEdit, canDelete } = useMenuPermissionData(menuStatus)

  const [openFilter, setOpenFilter] = useState(false)
  const [addModal, setAddModal] = useState(false)

  const [showEditModal, setShowEditModal] = useState(false)
  const [editApplicantsId, setEditApplicantsId] = useState<string | null>(null)

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteApplicantsId, setDeleteApplicantsId] = useState<string | null>(
    null
  )

  const [showProfilePopup, setShowProfilePopup] = useState(false)
  const [selectedProfileApplicant, setSelectedProfileApplicant] =
    useState<ApplicantResponse | null>(null)

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

  const formRef = useRef<DateRangeFilterRef>(null)


  const form = useForm<FilterFormData>({
    defaultValues: { startDate: '', endDate: '' },
  })

  const [selectedUserName, setSelectedUserName] = useState<string | null>(
    ""
  );

  const onClearClick = () => {
    setParams("");
    formRef.current?.handleClear();
    form.reset();
  };


  const { data, isLoading, error } = useGetAllApplicants(params)

  const { data: getAllUserProfile } = useGetAllUserProfile();

  const ApplicantsDetails = data?.Items ?? []
  const deleteApplicants = useDeleteApplicants()

  const onFilterSubmit = async (formData: FilterFormData) => {
    clearError()
    try {
      const queryParams = [
        formData.userId
          ? `userId=${encodeURIComponent(formData.userId)}`
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

  const EnrollmentTypes = [
    { id: 1, name: 'Lead' },
    { id: 2, name: 'Applicant' },
    { id: 3, name: 'Student' },
    { id: 4, name: 'Counseling' },
    { id: 5, name: 'Qualified' },
    { id: 6, name: 'Rejected' },
    { id: 7, name: 'New' },
  ]

  const handleEditApplicants = (Applicants: ApplicantResponse) => {
    setEditApplicantsId(Applicants.id)
    setShowEditModal(true)
  }

  const handleDeleteApplicants = (id: string) => {
    setDeleteApplicantsId(id)
    setShowDeleteModal(true)
  }

  const handleNameClick = (applicant: ApplicantResponse) => {
    setSelectedProfileApplicant(applicant)
    setShowProfilePopup(true)
  }

  const onDelete = async (id: string) => {
    try {
      await deleteApplicants.mutateAsync(id)
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
        <div className="bg-white dark:bg-[#353535] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6 sm:p-8">
          <div className="text-center py-12 sm:py-16">
            <BookOpen size={64} className="mx-auto text-red-400 mb-4" />
            <h3 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white mb-2">
              Error loading Applicants
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
        <div className="bg-white dark:bg-[#353535] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6 sm:p-8">
          <div className="flex justify-center items-center h-48 sm:h-64">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-emerald-600" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="p-3 sm:p-4 lg:p-6">
        <div className="bg-white dark:bg-[#353535] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 pt-4">
            <h1 className="text-lg sm:text-xl font-semibold dark:text-white">
              All Applicants
            </h1>
            <div className="flex items-center gap-2 sm:gap-3">
              <ButtonElement
                type="button"
                text="Filter"
                icon={<Filter size={14} />}
                onClick={() => setOpenFilter(!openFilter)}
                className="!bg-emerald-600 hover:!bg-emerald-700 flex-1 sm:flex-none justify-center"
              />
              <ButtonElement
                icon={<Plus size={18} />}
                type="button"
                text="Add Applicants"
                onClick={() => setAddModal(true)}
                className="!font-semibold flex-1 sm:flex-none justify-center"
              />
            </div>
          </div>

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
                    value={selectedUserName}
                    dropDownWidth="w-full"
                    dropdownPositionClass="absolute"
                    label="User"
                    name="userId"
                    form={form}
                    options={getAllUserProfile}
                    selected={
                      getAllUserProfile?.find(
                        (g) => g.fullName === selectedUserName
                      ) || null
                    }
                    onSelect={(group) => {
                      if (group) {
                        setSelectedUserName(group.fullName || null);
                      } else {
                        setSelectedUserName(null);
                      }
                    }}
                    getLabel={(g) => g?.fullName ?? ""}
                    getValue={(g) => g?.id ?? ""}
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

          {/* Empty state (shared) */}
          {ApplicantsDetails.length === 0 ? (
            <div className="px-4 pb-6">
              <p className="p-6 text-center italic text-gray-500 dark:text-gray-400 border border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                No Applicants found.
              </p>
            </div>
          ) : (
            <>


              {/* Desktop / tablet: table (md and up) */}
              <div className="hidden md:block px-4 pb-4">
                <div className="w-full overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-[#80878c] uppercase font-semibold border-b">
                        <th className="px-4 py-3 text-left">S.N</th>
                        <th className="px-4 py-3 text-left">FullName</th>
                        <th className="px-4 py-3 text-left">ApplicantId</th>
                        <th className="px-4 py-3 text-left">Email</th>
                        <th className="px-4 py-3 text-left">EnrolmentType</th>
                        <th className="px-4 py-3 text-left hidden lg:table-cell">
                          CountryName
                        </th>
                        <th className="px-4 py-3 text-left hidden lg:table-cell">
                          UniversityName
                        </th>
                        <th className="px-4 py-3 text-left hidden lg:table-cell">
                          CourseName
                        </th>
                        <th className="px-4 py-3 text-left hidden lg:table-cell">
                          AdmissionDate
                        </th>
                        <th className="px-4 py-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ApplicantsDetails.map((Applicants, index) => (
                        <tr
                          key={Applicants.id}
                          className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2a2b2e] transition-colors"
                        >
                          <td className="px-4 py-3 text-gray-500">{index + 1}</td>

                          <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">
                            <button
                              onClick={() => handleNameClick(Applicants)}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline underline-offset-2 hover:underline-offset-4 transition-all font-medium text-left"
                            >
                              {Applicants.fullName ?? '-'}
                            </button>
                          </td>

                          <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">
                            {Applicants.applicantId}
                          </td>

                          <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100 max-w-[180px] truncate">
                            {Applicants.email}
                          </td>

                          <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">
                            {
                              EnrollmentTypes.find(
                                (s) => s.id === Number(Applicants.enrolmentType)
                              )?.name
                            }
                          </td>

                          <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100 hidden lg:table-cell">
                            {Applicants.countryName}
                          </td>

                          <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100 hidden lg:table-cell">
                            {Applicants.universityName}
                          </td>

                          <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100 hidden lg:table-cell">
                            {Applicants.courseName}
                          </td>

                          <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100 hidden lg:table-cell">
                            {Applicants.admissionDate}
                          </td>

                          <td className="px-4 py-3">
                            <span className="flex justify-center gap-3">
                              <ActionMenu
                                Applicants={Applicants}
                                onEdit={handleEditApplicants}
                                onDelete={handleDeleteApplicants}
                                canEdit={true}
                                canDelete={true}
                              />
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
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

      {showDeleteModal && deleteApplicantsId && (
        <DeleteComponents
          visible={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={onDelete}
          id={deleteApplicantsId}
          title="Delete Applicants"
          description="Are you sure you want to delete this Applicants?"
        />
      )}

      <UserProfilePopupForm
        isOpen={showProfilePopup}
        onClose={() => {
          setShowProfilePopup(false)
          setSelectedProfileApplicant(null)
        }}
        applicant={selectedProfileApplicant}
      />

      {showEditModal && editApplicantsId && (
        <EditApplicants
          ApplicantsId={editApplicantsId}
          visible={showEditModal}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {/* <AddApplicants
                visible={addModal}
                onClose={handleAddSubmit}
            /> */}
    </>
  )
}

export default AllApplicantsForm
