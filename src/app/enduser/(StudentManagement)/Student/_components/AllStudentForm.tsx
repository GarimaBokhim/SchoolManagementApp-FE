/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useEffect, useRef, useState } from 'react'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

const getInitials = (
  firstName?: string,
  lastName?: string,
  middleName?: string | null
) => {
  const first = firstName?.charAt(0) || ''
  const last = lastName?.charAt(0) || ''
  const middle = middleName?.charAt(0) || ''
  return (first + middle + last).toUpperCase().substring(0, 2) || 'S'
}



const getApiBaseUrl = () => {
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!configuredUrl) return "";

  try {
    const url = new URL(configuredUrl);
    url.pathname = "";
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return configuredUrl
      .replace(/\/swagger\/index\.html\/?$/i, "")
      .replace(/\/+$/, "");
  }
};

const resolveImageUrl = (imageUrl?: string | File | null): string | null => {
  if (
    typeof imageUrl !== "string" ||
    imageUrl === "-" ||
    imageUrl === "string"
  ) {
    return null;
  }

  const value = imageUrl.trim();
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;

  const path = value.replace(/^\/+/, "");
  const baseUrl = getApiBaseUrl();
  return baseUrl ? `${baseUrl}/${path}` : `/${path}`;
};

const StudentAvatar = ({ student }: { student: any }) => {
  const [imgError, setImgError] = useState(false)

  const imageUrl =
    resolveImageUrl(student?.imageUrl);


  return (
    <div className="flex flex-col items-center gap-1 sm:gap-2">
      <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full flex-shrink-0 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-md">
        {imageUrl && !imgError ? (
          <img
            src={imageUrl}
            alt={`${student.firstName} ${student.lastName}`}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-xs sm:text-lg font-bold text-white">
            {getInitials(
              student.firstName,
              student.lastName,
              student.middleName
            )}
          </span>
        )}
      </div>
      <button
        onClick={() => {
          const event = new CustomEvent('studentNameClick', { detail: student })
          window.dispatchEvent(event)
        }}
        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline font-medium cursor-pointer transition-colors text-center text-[11px] sm:text-sm leading-tight break-words max-w-[80px] sm:max-w-none"
      >
        {student.firstName} {student.middleName} {student.lastName}
      </button>
    </div>
  )
}

import { IFilterStudentByDate, IStudent } from '../types/IStudents'
import { SubmitHandler, useForm } from 'react-hook-form'
import Pagination from '@/components/Pagination'
import React from 'react'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import toast, { Toaster } from 'react-hot-toast'
import useErrorHandler from '@/components/helpers/ErrorHandling'
import { Toast } from '@/components/Toast/toast'
import { EditButton } from '@/components/Buttons/EditButton'
import {
  Edit,
  Filter,
  GraduationCap,
  Plus,
  RotateCcw,
  Trash,
  Users,
  UserCheck,
  UserX,
  BookOpen,
} from 'lucide-react'
import EditStudent from '../pages/Edit'
import DateRangeFilter, {
  DateRangeFilterRef,
} from '@/components/DateFilter/FilterComponent'
import {
  useFilterStudentByDate,
  useGetAllStudents,
  useRemoveStudent,
} from '../hooks'
import { useExcelPreview } from '../hooks/excelPreview'
import { AppCombobox } from '@/components/Input/ComboBox'
import { usePermissions } from '@/context/auth/PermissionContext'
import useMenuPermissionData from '@/app/SuperAdmin/navigation/hooks/useMenuPermissionData'
import AddStudent from '../pages/Add'
import DeleteButton from '@/components/Buttons/DeleteButton'
import {
  useGetAllClass,
  useGetClassById,
} from '@/app/enduser/(Academics)/Class/hooks'
import ImportButtonForm from '@/components/Buttons/importbutton'
import ExportButtonForm from '@/components/Buttons/exportbuttonform'
import AllPrintFormForParents from '../../_Parent/components/PrintAllParentsform'
import ExcelParentTable from '../../_Parent/components/Excelprint'
import { PrintIDCardButton } from './idcardprint'
import AddRegistration from '../../_Registration/pages/Add'
import StudentProfilePopup from './StudentProfilePopUp'
import ExcelPreviewModal from './ExcelPreviewModel'
import DateConverter from '@/components/DatePicker/DateConverter'
import { InputElement } from '@/components/Input/InputElement'
import AllPrintFormForStudents from './PrintFormForStudentFee'
import ExcelStudentTable from './Excelprint'

const StatCard = ({ label, value, icon, iconBg, iconColor }: any) => (
  <div className="flex items-center gap-2 sm:gap-3 bg-white dark:bg-[#2c2c2c] rounded-lg px-3 py-2 sm:px-4 sm:py-3 shadow-sm border border-gray-200 dark:border-gray-700 flex-1 min-w-[130px] sm:min-w-[150px]">
    <div className={`p-1.5 sm:p-2 rounded-full ${iconBg} ${iconColor}`}>
      {icon}
    </div>
    <div>
      <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
  </div>
)

const AllStudentForm = () => {
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

  const {
    previewData,
    showPreviewModal,
    setShowPreviewModal,
    uploadLoading,
    handleExcelPreview,
    handleSaveExcel,
  } = useExcelPreview()

  const [showStudents, setShowStudents] = useState(false)
  const [showRegistration, setShowRegistration] = useState(false)
  const [showProfilePopup, setShowProfilePopup] = useState(false)
  const [selectedIdForRegistration, setSelectedIdForRegistration] =
    useState<string>('')
  const [addModal, setAddModal] = useState(false)
  const { menuStatus } = usePermissions()
  const { canEdit, canDelete, canAdd } = useMenuPermissionData(menuStatus)
  const [selectedId, setSelectedId] = useState<string>('')
  const [selectedStudentForProfile, setSelectedStudentForProfile] =
    useState<IStudent | null>(null)
  const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`
  const [params, setParams] = useState('')
  const { data: allStudent } = useGetAllStudents()
  const [selectedStudentName, setSelectedStudentName] = useState<string | null>(
    ''
  )


  const { data: allClass } = useGetAllClass()
  const [selectedClass, setSelectedClass] = useState<string | null>(
    ''
  )


  const fullQuery = query + (params || '')

  const {
    data: filteredStudent,
    refetch,
    isLoading,
  } = useFilterStudentByDate(fullQuery)

  const handleCloseEditModal = async () => {
    setShowStudents(false)
    setSelectedId('')
    await refetch()
  }

  useEffect(() => {
    refetch()
  }, [paginationParams, refetch])

  const form = useForm<IFilterStudentByDate>({
    defaultValues: {
      name: '',
      classId: '',
      address: '',
      sectionId: '',
      startDate: '',
      endDate: '',
    },
  })
  const { handleError, clearError } = useErrorHandler()
  const [openFilter, setOpenFilter] = useState(false)
  const { data: allClasses } = useGetAllClass()
  const onSubmit: SubmitHandler<IFilterStudentByDate> = async (formData) => {
    clearError()
    try {
      const queryParams = [
        formData.name
          ? `name=${encodeURIComponent(formData.name)}`
          : null,
        formData.classId
          ? `classId=${encodeURIComponent(formData.classId)}`
          : null,
        formData.address
          ? `address=${encodeURIComponent(formData.address)}`
          : null,
        formData.sectionId
          ? `sectionId=${encodeURIComponent(formData.sectionId)}`
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
  const deleteStudent = useRemoveStudent()

  const handleDelete = async (id: string) => {
    try {
      await deleteStudent.mutateAsync(id)
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
    form.reset()
  }

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'N/A'
    try {
      const dateObj = date instanceof Date ? date : new Date(date)
      if (isNaN(dateObj.getTime())) return 'N/A'
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return 'N/A'
    }
  }

  const handleNameClick = (student: IStudent) => {
    setSelectedStudentForProfile(student)
    setShowProfilePopup(true)
  }

  const getClassName = (classId: string) => {
    if (!classId) return 'N/A'
    const found = allClasses?.Items?.find((c) => c.id === classId)
    return found?.name || 'N/A'
  }

  useEffect(() => {
    const handleStudentClick = (event: Event) => {
      const customEvent = event as CustomEvent
      handleNameClick(customEvent.detail)
    }

    window.addEventListener('studentNameClick', handleStudentClick)

    return () => {
      window.removeEventListener('studentNameClick', handleStudentClick)
    }
  }, [])

  const items = filteredStudent?.Items ?? []
  const totalStudents = filteredStudent?.TotalItems ?? items.length
  const maleCount = items.filter((s) => s.genderStatus === 1).length
  const femaleCount = items.filter((s) => s.genderStatus === 2).length
  const uniqueClasses = new Set(items.map((s) => s.classId).filter(Boolean))
    .size

  return (
    <>
      <Toaster position="top-right" />
      <div className="p-4 sm:p-6 w-full ">
        <div className="bg-white dark:bg-[#353535] border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="flex w-full justify-between p-3 px-4 pt-4 items-center">
            <h1 className="text-lg sm:text-xl font-semibold">All Students</h1>
            <div className="flex flex-wrap gap-2 justify-end">
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
                  onClick={() => setAddModal(true)}
                  className="!font-semibold"
                />
              )}

              {/* <ImportButtonForm
                handleExcelImport={async (file) => {
                  await toast.promise(uploadstudent(file), {
                    loading: "Uploading...",
                    success: "Students uploaded successfully!",
                    error: "Upload failed! Please Check the format",
                  });
                }}
              /> */}

              <ExportButtonForm
                file="/template/StudentsTemplate.xlsx"
                data={
                  <AllPrintFormForStudents
                    startDate={form.watch('startDate')}
                    endDate={form.watch('endDate')}
                  />
                }
                excelData={
                  <ExcelStudentTable
                    startDate={form.watch('startDate')}
                    endDate={form.watch('endDate')}
                  />
                }
              />
              <ImportButtonForm handleExcelImport={handleExcelPreview} />

              {showPreviewModal && (
                <ExcelPreviewModal
                  previewData={previewData}
                  show={showPreviewModal}
                  onClose={() => setShowPreviewModal(false)}
                  onSave={handleSaveExcel}
                  loading={uploadLoading}
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 px-3 sm:px-4 pb-4 pt-1 not-only:">
            <StatCard
              label="Total Students"
              value={isLoading ? '—' : totalStudents}
              icon={<Users size={18} />}
              iconBg="bg-blue-50 dark:bg-blue-900/30"
              iconColor="text-blue-600 dark:text-blue-400"
            />
            <StatCard
              label="Male"
              value={isLoading ? '—' : maleCount}
              icon={<UserCheck size={18} />}
              iconBg="bg-emerald-50 dark:bg-emerald-900/30"
              iconColor="text-emerald-600 dark:text-emerald-400"
            />
            <StatCard
              label="Female"
              value={isLoading ? '—' : femaleCount}
              icon={<UserX size={18} />}
              iconBg="bg-pink-50 dark:bg-pink-900/30"
              iconColor="text-pink-500 dark:text-pink-400"
            />
            <StatCard
              label="Classes"
              value={isLoading ? '—' : uniqueClasses}
              icon={<BookOpen size={18} />}
              iconBg="bg-amber-50 dark:bg-amber-900/30"
              iconColor="text-amber-600 dark:text-amber-400"
            />
          </div>

          {openFilter && (
            <div className="bg-white dark:bg-[#2c2c2c] p-3 sm:p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6 mx-3 sm:mx-4">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col lg:flex-row lg:flex-wrap gap-4"
              >
                <DateRangeFilter
                  ref={formRef}
                  form={form}
                  onSubmit={onSubmit}
                  setParams={setParams}
                />
                <div className="flex-1 min-w-0 lg:min-w-[200px]">
                  <AppCombobox
                    value={selectedStudentName}
                    dropDownWidth="w-full"
                    dropdownPositionClass="absolute"
                    label="Name"
                    name="name"
                    form={form}
                    options={allStudent?.Items ?? []}
                    selected={
                      allStudent?.Items?.find(
                        (g) => `${g.firstName} ${g.lastName}` === selectedStudentName
                      ) || null
                    }
                    onSelect={(group) => {
                      setSelectedStudentName(
                        group ? `${group.firstName} ${group.lastName}`.trim() : ""
                      );
                    }}
                    getLabel={(g) =>
                      `${g?.firstName ?? ""} ${g?.lastName ?? ""}`.trim()
                    }
                    getValue={(g) =>
                      `${g?.firstName ?? ""} ${g?.lastName ?? ""}`.trim()
                    }
                  />
                </div>

                <div className="flex-1 min-w-0 lg:min-w-[200px]">
                  <AppCombobox
                    value={selectedClass}
                    dropDownWidth="w-full"
                    dropdownPositionClass="absolute"
                    label="Class"
                    name="classId"
                    form={form}
                    options={allClass?.Items}
                    selected={
                      allClass?.Items?.find(
                        (g) => g.name === selectedClass
                      ) || null
                    }
                    onSelect={(group) => {
                      setSelectedStudentName(group ? group.name : null)
                    }}
                    getLabel={(g) => g?.name ?? ''}
                    getValue={(g) => g?.id ?? ''}
                  />
                </div>

                {/* <div className="flex-1 min-w-0 lg:min-w-[150px]">
                  <InputElement
                    label="Address"
                    form={form}
                    name="address"
                  />
                </div> */}

                {/* <div className="flex-1 min-w-0 lg:min-w-[150px]">
                  <AppCombobox
                    value={selectedClass}
                    dropDownWidth="w-full"
                    dropdownPositionClass="absolute"
                    label="Section"
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
                </div> */}


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

          <div className="hidden md:block bg-white dark:bg-[#353535] border border-gray-200 dark:border-gray-700 rounded-xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#80878c] uppercase text-center">
                  <th className="px-2 py-3">S.N</th>
                  <th className="px-2 py-3">Student</th>
                  <th className="px-2 py-3">Reg. No</th>
                  <th className="px-2 py-3">Gender</th>
                  <th className="px-2 py-3">Email</th>
                  <th className="px-2 py-3">Class</th>
                  <th className="px-2 py-3">Address</th>
                  <th className="px-2 py-3">Phone</th>
                  <th className="px-2 py-3">DOB</th>
                  <th className="px-2 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={11}
                      className="p-4 text-center text-gray-500 dark:text-gray-300"
                    >
                      Loading students...
                    </td>
                  </tr>
                ) : filteredStudent?.Items?.length ? (
                  filteredStudent.Items.map(
                    (student: IStudent, index: number) => (
                      <tr
                        key={student.id || index}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-600 text-gray-700 dark:text-gray-100"
                      >
                        <td className="px-1 py-2 sm:px-4 sm:py-3 align-top">
                          {(paginationParams.pageIndex - 1) *
                            paginationParams.pageSize +
                            index +
                            1}
                        </td>
                        <td className="px-1 py-2 sm:px-4 sm:py-3">
                          <StudentAvatar student={student} />
                        </td>
                        <td className="px-1 py-2 sm:px-4 sm:py-3 align-middle hidden xs:table-cell sm:table-cell truncate">
                          {student.registrationNumber || 'N/A'}
                        </td>
                        <td className="px-1 py-2 sm:px-4 sm:py-3 align-middle hidden md:table-cell">
                          {student.genderStatus === 1
                            ? 'Male'
                            : student.genderStatus === 2
                              ? 'Female'
                              : 'Other'}
                        </td>
                        <td
                          className="px-1 py-2 sm:px-4 sm:py-3 truncate hidden lg:table-cell align-middle"
                          title={student.email}
                        >
                          {student.email || 'N/A'}
                        </td>
                        <td className="px-1 py-2 sm:px-4 sm:py-3 truncate hidden lg:table-cell align-middle">
                          {getClassName(student.classId)}
                        </td>
                        <td
                          className="px-1 py-2 sm:px-4 sm:py-3 truncate hidden xl:table-cell align-middle"
                          title={student.address}
                        >
                          {student.address || 'N/A'}
                        </td>
                        <td className="px-1 py-2 sm:px-4 sm:py-3 truncate hidden md:table-cell align-middle">
                          {student.phoneNumber || 'N/A'}
                        </td>
                        <td className="px-1 py-2 sm:px-4 sm:py-3 truncate hidden md:table-cell align-middle">
                          {student.dateOfBirth ? (
                            <DateConverter date={student.dateOfBirth} />
                          ) : (
                            "N/A"
                          )}
                        </td>
                        <td className="px-1 py-2 sm:px-4 sm:py-3 text-center align-middle">
                          <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
                            {canDelete && (
                              <DeleteButton
                                onConfirm={() =>
                                  handleDelete(student.id ? student.id : '')
                                }
                                headerText={<Trash size={14} />}
                                content="Are you sure you want to delete this student?"
                              />
                            )}
                            {canEdit && (
                              <EditButton
                                button={
                                  <ButtonElement
                                    icon={<Edit size={18} />}
                                    type="button"
                                    text=""
                                    onClick={() => {
                                      setShowStudents(true)
                                      setSelectedId(student.id ?? '')
                                    }}
                                    className="!text-xs !bg-teal-500 "
                                  />
                                }
                              />
                            )}
                            <PrintIDCardButton StudentId={student.id ?? ''} />
                            <EditButton
                              button={
                                <ButtonElement
                                  icon={<GraduationCap size={18} />}
                                  type="button"
                                  text=""
                                  onClick={() => {
                                    setShowRegistration(true)
                                    setSelectedIdForRegistration(
                                      student.id ?? ''
                                    )
                                  }}
                                  className="!text-xs !bg-blue-500 "
                                />
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={11}
                      className="p-8 text-center text-gray-500 italic"
                    >
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {filteredStudent && filteredStudent?.Items?.length > 0 && (
          <div className="mt-4">
            <Pagination
              form={form}
              pagination={{
                currentPage: filteredStudent?.PageIndex ?? 1,
                firstPage: filteredStudent?.FirstPage ?? 1,
                lastPage: filteredStudent?.LastPage ?? 1,
                nextPage: filteredStudent?.NextPage ?? 1,
                previousPage: filteredStudent?.PreviousPage ?? 1,
              }}
              handleSearch={handleSearch}
            />
          </div>
        )}

        {showStudents && selectedId && (
          <EditStudent
            StudentId={selectedId}
            visible={showStudents}
            onClose={handleCloseEditModal}
          />
        )}

        {showRegistration && selectedIdForRegistration && (
          <AddRegistration
            studentId={selectedIdForRegistration}
            visible={showRegistration}
            onClose={() => setShowRegistration(false)}
          />
        )}

        <AddStudent visible={addModal} onClose={() => setAddModal(false)} />

        {showProfilePopup && selectedStudentForProfile && (
          <StudentProfilePopup
            student={selectedStudentForProfile}
            onClose={() => {
              setShowProfilePopup(false)
              setSelectedStudentForProfile(null)
            }}
          />
        )}
      </div>
    </>
  )
}

export default AllStudentForm
