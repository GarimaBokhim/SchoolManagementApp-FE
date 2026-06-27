'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { BookOpen, Edit, Eye, Filter, MoreVertical, Plus, ReceiptIndianRupeeIcon, RotateCcw, Trash } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'
import Pagination from '@/components/Pagination'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import DateRangeFilter, { DateRangeFilterRef } from '@/components/DateFilter/FilterComponent'
import { usePermissions } from '@/context/auth/PermissionContext'
import useMenuPermissionData from '@/app/SuperAdmin/navigation/hooks/useMenuPermissionData'
import { useGetAllInquiry, useDeleteInquiry, useGetAllUserProfile } from '../hooks'
import { InquiryResponse } from '../types/IVisitors'
import DeleteComponents from '@/components/DeleteComponent/DeleteComponents'
import { Tooltip } from '@/components/ToolTip/Tooltip'
import AddInquiry from '../pages/Add'
import useErrorHandler from '@/components/helpers/ErrorHandling'
import { Toast } from '@/components/Toast/toast'
import { AppCombobox } from '@/components/Input/ComboBox'

interface FilterFormData {
    startDate: string
    endDate: string
    userId: string
}

//#region ActionMenu
interface ActionMenuProps {
    Inquiry: InquiryResponse;
    onEdit: (Inquiry: InquiryResponse) => void;
    onDelete: (id: string) => void;
    // onView: (Invoice: InvoiceResponse) => void;
    canEdit?: boolean;
    canDelete?: boolean;
}

const ActionMenu = ({ Inquiry, onEdit, onDelete, canEdit = true, canDelete = true }: ActionMenuProps) => {
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
                menuRef.current && !menuRef.current.contains(e.target as Node) &&
                buttonRef.current && !buttonRef.current.contains(e.target as Node)
            ) setOpen(false)
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

                    {/* <button
                        onClick={() => { onView(Invoice); setOpen(false) }}
                        className="w-full text-left px-4 py-2 text-sm dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                        <Eye size={14} /> View
                    </button> */}
                    {canEdit && <button
                        onClick={() => { onEdit(Inquiry); setOpen(false) }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                        <Edit size={14} /> Edit
                    </button>}
                    {canDelete && <button
                        onClick={() => { onDelete(Inquiry.id); setOpen(false) }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                        <Trash size={14} /> Delete
                    </button>}




                </div>
            )}
        </div>
    )
}

//#endregion

const AllInquiryForm = () => {
    const { menuStatus } = usePermissions()
    const { handleError, clearError } = useErrorHandler()
    const { canAdd, canEdit, canDelete } = useMenuPermissionData(menuStatus)

    const [openFilter, setOpenFilter] = useState(false)
    const [addModal, setAddModal] = useState(false);

    const [selectedId, setSelectedId] = useState<string>('')





    const [showEditModal, setShowEditModal] = useState(false)
    const [editInquiryId, setEditInquiryId] = useState<string | null>(null)

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deleteInquiryId, setDeleteInquiryId] = useState<string | null>(null)

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



    const { data, isLoading, error } = useGetAllInquiry(params)

    const { data: getAllUserProfile } = useGetAllUserProfile();
    const deleteInquiry = useDeleteInquiry()


    const inquiryDetails = data?.Items ?? [];

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



    const handleEditInquiry = (Inquiry: InquiryResponse) => {
        setEditInquiryId(Inquiry.id)
        setShowEditModal(true)
    }

    const handleDeleteInquiry = (id: string) => {
        setDeleteInquiryId(id)
        setShowDeleteModal(true)
    }


    const onDelete = async (id: string) => {
        try {
            await deleteInquiry.mutateAsync(id)
        } catch (error) {
            console.error(error)
        }
    }


    const handleAddSubmit = () => {
        setAddModal(false);
    };

    if (error) {
        return (
            <div className="p-4 sm:p-6">
                <Toaster position="top-right" />
                <div className="bg-white dark:bg-[#353535] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-8">
                    <div className="text-center py-16">
                        <BookOpen size={64} className="mx-auto text-red-400 mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                            Error loading Inquiry
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
                        <h1 className="text-xl font-semibold dark:text-white">All Inquiry</h1>
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
                                text="Add Inquiry"
                                onClick={() => setAddModal(true)}
                                className="!font-semibold"
                            />

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
                                        value={selectedUserName}
                                        dropDownWidth="w-full"
                                        dropdownPositionClass="absolute"
                                        label="User"
                                        name="userId"
                                        form={form}
                                        options={data?.Items}
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

                    {/* Table */}
                    <div className="px-4 pb-4">
                        <div className="w-full overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-[#80878c] uppercase font-semibold border-b">
                                        <th className="px-4 py-3 text-left">S.N</th>
                                        <th className="px-4 py-3 text-left">Name</th>
                                        <th className="px-4 py-3 text-left">Email</th>
                                        <th className="px-4 py-3 text-left">Phone</th>

                                        <th className="px-4 py-3 text-left hidden md:table-cell">Source</th>
                                        <th className="px-4 py-3 text-left hidden md:table-cell">EducationLevel</th>
                                        <th className="px-4 py-3 text-left hidden md:table-cell">Completion Year</th>
                                        <th className="px-4 py-3 text-left hidden md:table-cell">Enrollment Type</th>
                                        <th className="px-4 py-3 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inquiryDetails.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="p-4 text-center italic text-gray-500 dark:text-gray-400">
                                                No Inquiry found.
                                            </td>
                                        </tr>
                                    ) : (
                                        inquiryDetails.map((inquiry, index) => (
                                            <tr
                                                key={inquiry.id}
                                                className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2a2b2e] transition-colors"
                                            >
                                                <td className="px-4 py-3 text-gray-500">{index + 1}</td>

                                                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">
                                                    {inquiry.fullName}
                                                </td>

                                                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">

                                                    {inquiry.email}
                                                </td>

                                                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">

                                                    {inquiry.phone}
                                                </td>

                                                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">

                                                    {inquiry.source}
                                                </td>

                                                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">

                                                    {inquiry.educationLevel}
                                                </td>

                                                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">

                                                    {inquiry.completionYear}
                                                </td>

                                                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">

                                                    {inquiry.enrolmentType}
                                                </td>

                                                <td className="px-4 py-3">
                                                    <span className='flex justify-center gap-3'>

                                                        {/* <Tooltip text="Invoice Details">
                                                            <ButtonElement
                                                                icon={<Eye size={15} />}
                                                                type="button"
                                                                text=""
                                                                onClick={() => {
                                                                    setShowGenerateInvoiceModal(true)
                                                                    setSelectedInvoiceId(invoice.id ?? '')
                                                                    setSelectedSchoolId(invoice.schoolId ?? '')
                                                                }}
                                                                className="!text-xs"
                                                            />

                                                        </Tooltip>
                                                        */}



                                                        <ActionMenu
                                                            Inquiry={inquiry}
                                                            onEdit={handleEditInquiry}
                                                            onDelete={handleDeleteInquiry}
                                                            // onView={handleView}
                                                            canEdit={true}
                                                            canDelete={true}
                                                        />

                                                    </span>
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


            {showDeleteModal && deleteInquiryId && (

                <DeleteComponents
                    visible={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={onDelete}
                    id={deleteInquiryId}
                    title="Delete Inquiry"
                    description="Are you sure you want to delete this Inquiry?"
                />

            )}



            {/* {showEditModal && editInquiryId && (

                <EditFollowUp

                    FollowUpId={editInquiryId}
                    visible={showEditModal}
                    onClose={() => setShowEditModal(false)}

                />
            )} */}

            <AddInquiry
                visible={addModal}
                onClose={handleAddSubmit}
            />
        </>
    )
}

export default AllInquiryForm