'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { BookOpen, Edit, Filter, MoreVertical, Plus, ReceiptIndianRupeeIcon, Trash } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'
import Pagination from '@/components/Pagination'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import DateRangeFilter, { DateRangeFilterRef } from '@/components/DateFilter/FilterComponent'
import { usePermissions } from '@/context/auth/PermissionContext'
import useMenuPermissionData from '@/app/SuperAdmin/navigation/hooks/useMenuPermissionData'
import { useDeleteVisaStatus, useGetAllVisaStatus } from '../hooks'
import { EditButton } from '@/components/Buttons/EditButton'
import { UpdateVisaStatusResponse } from '../types/IVisaStatus'
import AddVisaStatus from '../pages/Add'

interface FilterFormData {
    startDate: string
    endDate: string
}

//#region ActionMenu
interface ActionMenuProps {
    visaStatus: UpdateVisaStatusResponse;
    // onView: (Invoice: InvoiceResponse) => void;
    onEdit: (visaStatus: UpdateVisaStatusResponse) => void;
    onDelete: (id: string) => void;
    canEdit?: boolean;
    canDelete?: boolean;
}

const ActionMenu = ({
    visaStatus,
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
                    <button
                        onClick={() => { onEdit(visaStatus); setOpen(false) }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                        <Edit size={14} /> Edit
                    </button>
                    <button
                        onClick={() => { onDelete(visaStatus.id); setOpen(false) }}
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

// ─── Enrolment Type Badge ────────────────────────────────────────────────────
const getEnrolmentTypeBadge = (type: number) => {
    switch (type) {
        case 1: return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Lead</span>
        case 2: return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">Applicant</span>
        case 3: return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Student</span>
        default: return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">Unknown</span>
    }
}
//#endregion

const AllVisaStatusForm = () => {
    const { menuStatus } = usePermissions()
    const { canAdd, canEdit, canDelete } = useMenuPermissionData(menuStatus)

    const [openFilter, setOpenFilter] = useState(false)
    const [addModal, setAddModal] = useState(false);
    const [visaStatusForm, setVisaStatusForm] = useState(false);
    const [selectedId, setSelectedId] = useState<string>('')


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

    const { data, isLoading, error } = useGetAllVisaStatus(params)
    const deleteVisaStatus = useDeleteVisaStatus()


    const visaStatusDetails = data?.items ?? [];
    const totalPages = data?.pagination?.totalPages ?? 1;

    const onFilterSubmit = async (formData: FilterFormData) => {
        const queryParams = [
            // formData.name ? `name=${encodeURIComponent(formData.name)}` : null,
            formData.startDate ? `startDate=${encodeURIComponent(formData.startDate)}` : null,
            formData.endDate ? `endDate=${encodeURIComponent(formData.endDate)}` : null,
        ]
            .filter(Boolean)
            .join('&')

        const fullQuery = queryParams ? `&${queryParams}` : ''

        setParams(fullQuery) // 👈 THIS triggers auto refetch

        toast.success(data?.message || 'Data loaded successfully')
    }


    const visaStatusType = [
        { id: 1, name: 'Application' },
        { id: 2, name: 'Documents' }

    ];



    const handleClearFilters = () => {
        form.reset({ startDate: '', endDate: '' })
        setParams('')
        formRef.current?.handleClear()
    }

    const handleEditLead = (VisaStatus: UpdateVisaStatusResponse) => {
        console.log('Edit VisaStatus:', VisaStatus)
    }

    const handleAddVisaStatus = () => {
        setVisaStatusForm(false);
        setSelectedId("");
    };

    const handleDelete = async (id: string) => {
        try {
            console.error("Id", id)
            await deleteVisaStatus.mutateAsync(id)
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
                            Error loading Visa Status
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
                        <h1 className="text-xl font-semibold dark:text-white">All VisaStatus</h1>
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
                                text="Add VisaStatus"
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
                            </form>
                        </div>
                    )}

                    <div className="px-4 pb-4">
                        <div className="w-full overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-[#80878c] uppercase font-semibold border-b">
                                        <th className="px-4 py-3 text-left">S.N</th>
                                        <th className="px-4 py-3 text-left">Status Name</th>
                                        <th className="px-4 py-3 text-left hidden md:table-cell">Type</th>
                                        <th className="px-4 py-3 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {visaStatusDetails.length === 0 ? (
                                        <tr>
                                            <td colSpan={9} className="p-4 text-center italic text-gray-500 dark:text-gray-400">
                                                No visa applications found.
                                            </td>
                                        </tr>
                                    ) : (
                                        visaStatusDetails.map((visaStatus, index) => (
                                            <tr
                                                key={visaStatus.id}
                                                className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2a2b2e] transition-colors"
                                            >
                                                <td className="px-4 py-3 text-gray-500">
                                                    {(currentPage - 1) * pageSize + index + 1}
                                                </td>
                                                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">
                                                    {visaStatus.name}
                                                </td>
                                                <td className="px-4 py-3 text-gray-600 dark:text-gray-300 hidden md:table-cell">
                                                    {
                                                        visaStatusType.find(
                                                            (i) => i.id === visaStatus.visaStatusType)
                                                            ?.name
                                                    }
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

                {/* Pagination */}
                {visaStatusDetails.length > 0 && totalPages > 1 && (
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


            <AddVisaStatus
                visible={addModal}
                onClose={handleAddSubmit}
            />
        </>
    )
}

export default AllVisaStatusForm