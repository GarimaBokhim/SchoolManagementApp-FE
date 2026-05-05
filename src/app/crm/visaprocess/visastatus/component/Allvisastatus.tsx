/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useRef, useState } from 'react'
import { FileText, Filter, RotateCcw, Plus } from 'lucide-react'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import { useForm } from 'react-hook-form'
import Pagination from '@/components/Pagination'
import { useGetAllVisaStatuses } from '../hooks'
import { IAddVisaStatus, IVisaStatus } from '../types/IVisaStatus'
import { usePermissions } from '@/context/auth/PermissionContext'
import useMenuPermissionData from '@/app/SuperAdmin/navigation/hooks/useMenuPermissionData'
import DateRangeFilter, { DateRangeFilterRef } from '@/components/DateFilter/FilterComponent'
import toast, { Toaster } from 'react-hot-toast'
import AddVisaStatusForm from './AddVisaStatusForm'
import { VisaStatusActionMenu } from './ActionMenu'
import { Toast } from '@/components/Toast/toast'

interface FilterFormData {
    startDate: string
    endDate: string
}

const VISA_STATUS_TYPE_MAP: Record<number, { label: string; color: string }> = {
    1: { label: 'Pending', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
    2: { label: 'Approved', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    3: { label: 'Rejected', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
    4: { label: 'Under Review', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
}

const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr.startsWith('0001')) return 'N/A'
    return new Date(dateStr).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    })
}

const AllVisaStatusForm = () => {
    const { menuStatus } = usePermissions()
    const { canAdd, canEdit, canDelete } = useMenuPermissionData(menuStatus)

    const [openFilter, setOpenFilter] = useState(false)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [params, setParams] = useState('')
    const formRef = useRef<DateRangeFilterRef>(null)
    const pageSize = 10

    const form = useForm<FilterFormData>({
        defaultValues: { startDate: '', endDate: '' },
    })

    const paginationForm = useForm({
        defaultValues: { pageSize, pageIndex: currentPage, isPagination: true },
    })

    const addForm = useForm<IAddVisaStatus>({
        defaultValues: { name: '', visaStatusType: 1 },
    })

    const { data, refetch } = useGetAllVisaStatuses(params)

    const statuses: IVisaStatus[] = data?.Items ?? []
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
                setCurrentPage(1)
                await refetch()
            })(),
            { loading: 'Fetching data...', success: 'Data fetched successfully!' }
        )
    }

    const handleClearFilters = () => {
        form.reset({ startDate: '', endDate: '' })
        setParams('')
        setCurrentPage(1)
        formRef.current?.handleClear()
        refetch()
    }

    const handleView = (_visaStatus: IVisaStatus) => {
        Toast.info('View coming soon!')
    }

    const handleEdit = (_visaStatus: IVisaStatus) => {
        Toast.info('Edit coming soon!')
    }

    const handleDelete = async (_id: string) => {
        Toast.info('Delete coming soon!')
    }

    const getStatusBadge = (type: number) => {
        const info = VISA_STATUS_TYPE_MAP[type] ?? { label: 'Unknown', color: 'bg-gray-100 text-gray-700' }
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${info.color}`}>
                {info.label}
            </span>
        )
    }

    return (
        <>
            <Toaster position="top-right" />
            <div className="p-4 sm:p-6">
                <div className="bg-white dark:bg-[#353535] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">

                    {/* Header */}
                    <div className="flex w-full justify-between p-3 px-4 pt-4 items-center">
                        <h1 className="text-xl font-semibold dark:text-white">All Visa Statuses</h1>
                        <div className="flex items-center space-x-3">
                            <ButtonElement
                                type="button"
                                text="Filter"
                                icon={<Filter size={14} />}
                                onClick={() => setOpenFilter(!openFilter)}
                                className="!bg-emerald-600 hover:!bg-emerald-700"
                            />
                            {/* {canAdd && ( */}
                            <ButtonElement
                                icon={<Plus size={18} />}
                                type="button"
                                text="Add New"
                                onClick={() => setIsAddModalOpen(true)}
                                className="!font-semibold"
                            />
                            {/* )} */}
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
                                <div className="flex gap-2 ml-auto">
                                    <ButtonElement
                                        type="submit"
                                        text="Apply"
                                        icon={<Filter size={14} />}
                                        className="!bg-emerald-600 hover:!bg-emerald-700 !text-white"
                                    />
                                    <ButtonElement
                                        type="button"
                                        text="Clear"
                                        icon={<RotateCcw size={14} />}
                                        onClick={handleClearFilters}
                                        className="!bg-gray-500 hover:!bg-gray-600 !text-white"
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
                                        <th className="px-4 py-3 text-left">Status Name</th>
                                        <th className="px-4 py-3 text-left hidden md:table-cell">Type</th>
                                        <th className="px-4 py-3 text-center hidden md:table-cell">Active</th>
                                        <th className="px-4 py-3 text-left hidden lg:table-cell">Created At</th>
                                        <th className="px-4 py-3 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {statuses.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="p-8 text-center">
                                                <div className="flex flex-col items-center gap-3 text-gray-400 dark:text-gray-500">
                                                    <FileText size={40} className="opacity-40" />
                                                    <p className="italic text-sm">No visa statuses found.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        statuses.map((status, index) => (
                                            <tr
                                                key={status.id}
                                                className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2a2b2e] transition-colors"
                                            >
                                                <td className="px-4 py-3 text-gray-500">
                                                    {(currentPage - 1) * pageSize + index + 1}
                                                </td>
                                                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">
                                                    {status.name}
                                                </td>
                                                <td className="px-4 py-3 hidden md:table-cell">
                                                    {getStatusBadge(status.visaStatusType)}
                                                </td>
                                                <td className="px-4 py-3 text-center hidden md:table-cell">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.isActive
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                        }`}>
                                                        {status.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-gray-600 dark:text-gray-300 hidden lg:table-cell">
                                                    {formatDate(status.createdAt ?? '')}
                                                </td>
                                                <td className="py-1 px-4">
                                                    <VisaStatusActionMenu
                                                        visaStatus={status}
                                                        onView={handleView}
                                                        onEdit={handleEdit}
                                                        onDelete={handleDelete}
                                                        canEdit={canEdit}
                                                        canDelete={canDelete}
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

                {/* Pagination */}
                {statuses.length > 0 && totalPages > 1 && (
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

            {/* Add Modal */}
            {isAddModalOpen && (
                <AddVisaStatusForm
                    form={addForm}
                    onClose={() => {
                        setIsAddModalOpen(false)
                        addForm.reset()
                    }}
                />
            )}
        </>
    )
}

export default AllVisaStatusForm
