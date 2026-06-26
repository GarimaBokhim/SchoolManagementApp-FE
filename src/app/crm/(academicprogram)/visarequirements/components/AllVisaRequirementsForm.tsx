'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { BookOpen, Edit, Eye, Filter, MoreVertical, Plus, ReceiptIndianRupeeIcon, Trash } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Toaster } from 'react-hot-toast'
import Pagination from '@/components/Pagination'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import DateRangeFilter, { DateRangeFilterRef } from '@/components/DateFilter/FilterComponent'
import { usePermissions } from '@/context/auth/PermissionContext'
import useMenuPermissionData from '@/app/SuperAdmin/navigation/hooks/useMenuPermissionData'
import { useDeleteVisaRequirement, useGetAllVisaRequirement } from '../hooks'
import { AddVisaRequirementResponse, UpdateVisaRequirementResponse } from '../types/IVisaRequirements'
import DeleteComponents from '@/components/DeleteComponent/DeleteComponents'
import AddVisaRequirements from '../pages/Add'

interface FilterFormData {
    startDate: string
    endDate: string
}

//#region ActionMenu
interface ActionMenuProps {
    VisaRequirements: AddVisaRequirementResponse;
    onEdit: (VisaRequirements: UpdateVisaRequirementResponse) => void;
    onDelete: (id: string) => void;
    // onView: (Invoice: InvoiceResponse) => void;
    canEdit?: boolean;
    canDelete?: boolean;
}

const ActionMenu = ({ VisaRequirements, onEdit, onDelete, canEdit = true, canDelete = true }: ActionMenuProps) => {
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
    }, []);


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
                        onClick={() => { onEdit(VisaRequirements); setOpen(false) }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                        <Edit size={14} /> Edit
                    </button>}
                    {canDelete && <button
                        onClick={() => { onDelete(VisaRequirements.id); setOpen(false) }}
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

const AllVisaRequirementsForm = () => {
    const { menuStatus } = usePermissions()
    const { canAdd, canEdit, canDelete } = useMenuPermissionData(menuStatus)

    const [openFilter, setOpenFilter] = useState(false)
    const [addModal, setAddModal] = useState(false);


    const [showEditModal, setShowEditModal] = useState(false)
    const [editVisaRequirementsId, setEditVisaRequirementsId] = useState<string | null>(null)

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deleteVisaRequirementsId, setDeleteVisaRequirementsId] = useState<string | null>(null)

    const [params, setParams] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const formRef = useRef<DateRangeFilterRef>(null)
    const pageSize = 10

    const form = useForm<FilterFormData>({
        defaultValues: { startDate: '', endDate: '' },
    })

    const paginationForm = useForm({
        defaultValues:
        {
            pageSize,
            pageIndex: currentPage,
            isPagination: true
        },
    })

    const { data, isLoading, error } = useGetAllVisaRequirement(params)
    const deleteVisaRequirements = useDeleteVisaRequirement()


    const VisaRequirementsDetails = data?.items ?? [];
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
        setParams(fullQuery)
    }

    const sortedVisaRequirements = [
        ...(data?.items ?? []).flatMap(
            (x) => x.visaRequirementsDTOs ?? []
        ),
    ].sort((a, b) => a.step - b.step);



    const handleEditVisaRequirements = (VisaRequirements: UpdateVisaRequirementResponse) => {
        setEditVisaRequirementsId(VisaRequirements.id)
        setShowEditModal(true)
    }

    const handleDeleteVisaRequirements = (id: string) => {
        setDeleteVisaRequirementsId(id)
        setShowDeleteModal(true)
    }


    const onDelete = async (id: string) => {
        try {
            await deleteVisaRequirements.mutateAsync(id)
        } catch (error) {
            console.error(error)
        }
    }

    const visaRequirementsType = [
        { id: 1, name: 'Completed' },
        { id: 2, name: 'Pending' },
        { id: 3, name: 'Rejected' },
        { id: 4, name: 'ActionRequired' }
    ];


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
                        <h1 className="text-xl font-semibold dark:text-white">All VisaRequirements</h1>
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
                                text="Add VisaRequirements"
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
                            </form>
                        </div>
                    )}

                    {/* Table */}
                    <div className="px-4 pb-6">
                        {VisaRequirementsDetails.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-900/30">
                                <div className="text-5xl mb-3">📄</div>
                                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                                    No VisaRequirements Found
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    VisaRequirements will appear here once added.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {VisaRequirementsDetails.map((VisaRequirements, index) => (
                                    <div
                                        key={VisaRequirements.id}
                                        className="
                                            group relative overflow-hidden
                                            rounded-3xl
                                            border border-white/60 dark:border-gray-900
                                            bg-white dark:bg-[#1e1f24]
                                            shadow-md shadow-3xl

                                        ">
                                        {/* Top Gradient */}
                                        <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

                                        <div className="p-5">
                                            {/* Header */}
                                            <div className="flex items-start justify-between mb-5">
                                                <div>
                                                    <span className="inline-flex items-center bg-blue-50 dark:bg-blue-900/30 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-600 dark:text-blue-300">
                                                        🌍 {VisaRequirements.countryName}
                                                    </span>
                                                </div>

                                                <ActionMenu
                                                    VisaRequirements={VisaRequirements}
                                                    onEdit={handleEditVisaRequirements}
                                                    onDelete={handleDeleteVisaRequirements}
                                                    canEdit={true}
                                                    canDelete={true}
                                                />
                                            </div>

                                            <div className="md:col-span-3 rounded-2xl bg-gradient-to-r from-violet-50 to-white dark:from-violet-900/20 dark:to-gray-800 p-5 border border-gray-100 dark:border-gray-700">
                                                <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">
                                                    University
                                                </p>

                                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="text-sm font-semibold leading-tight text-gray-900 dark:text-white break-words">
                                                            {VisaRequirements.universityName}
                                                        </h3>

                                                        <span className="block mt-1 text-[11px] text-gray-500 dark:text-gray-400 break-words">
                                                            {VisaRequirements.universityAddress}
                                                        </span>
                                                    </div>

                                                    <div className="self-start max-w-full px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-semibold shadow-sm border border-blue-100 dark:border-blue-800/30 break-words">
                                                        {VisaRequirements.courseTitle}
                                                    </div>
                                                </div>
                                            </div>


                                            {/* Description */}
                                            {/* <div className="mb-4">
                                                <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                                                    Description
                                                </p>

                                                <p className="text-sm leading-6 text-gray-600 dark:text-gray-300 line-clamp-4">
                                                    {VisaRequirements.descriptions || "No description available."}
                                                </p>
                                            </div> */}

                                            <div className=" mb-4 mt-4">
                                                {sortedVisaRequirements.map((item, index) => (
                                                    <div
                                                        key={`${item.step}-${item.visaStatusId}`}
                                                        className="group flex items-center gap-3.5 p-3.5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-[0_0_0_3px_theme(colors.blue.50)] dark:hover:shadow-[0_0_0_3px_theme(colors.blue.950)] transition-all cursor-default"
                                                    >
                                                        {/* Step badge */}
                                                        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-medium">
                                                            {String(item.step).padStart(2, "0")}
                                                        </div>

                                                        {/* Text info */}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-0.5">Step {item.step}</p>
                                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                                                                {item.visaStatusName}
                                                            </p>
                                                        </div>

                                                        {/* Status badge */}
                                                        {/* <span className={`flex-shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-full
                                                            ${visaRequirementsType.find(i => i.id === item.visaRequirementStatus)?.name === "Required"
                                                                ? "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400"
                                                                : visaRequirementsType.find(i => i.id === item.visaRequirementStatus)?.name === "Optional"
                                                                    ? "bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400"
                                                                    : "bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400"
                                                            }`}
                                                        >
                                                            {visaRequirementsType.find(i => i.id === item.visaRequirementStatus)?.name}
                                                        </span> */}

                                                        {/* Arrow */}
                                                        <svg className="flex-shrink-0 w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Bottom Section */}
                                            <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                                                <span className="text-xs text-gray-400">
                                                    Requirement Record
                                                </span>

                                                <div className="flex items-center gap-1 text-blue-600 font-medium text-sm group-hover:gap-2 transition-all">
                                                    View Details →
                                                </div>
                                            </div>
                                        </div>

                                        {/* Hover Glow */}
                                        <div
                                            className="
                                            absolute inset-0 opacity-0 group-hover:opacity-100
                                            transition-opacity duration-500
                                            bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5
                                            pointer-events-none
                                        "
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>

                {/* Pagination */}
                {VisaRequirementsDetails.length > 0 && totalPages > 1 && (
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



            {showDeleteModal && deleteVisaRequirementsId && (

                <DeleteComponents
                    visible={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={onDelete}
                    id={deleteVisaRequirementsId}
                    title="Delete VisaRequirements"
                    description="Are you sure you want to delete this VisaRequirements?"
                />

            )}



            {/* {showEditModal && editVisaRequirementsId && (

                <EditVisaRequirements
                    VisaRequirementsId={editVisaRequirementsId}
                    visible={showEditModal}
                    onClose={() => setShowEditModal(false)}


                />
            )} */}

            <AddVisaRequirements
                visible={addModal}
                onClose={handleAddSubmit}
            />
        </>
    )
}

export default AllVisaRequirementsForm