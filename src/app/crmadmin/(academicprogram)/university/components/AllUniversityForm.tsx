'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { BookOpen, Building2, Edit, Eye, Filter, MoreVertical, Plus, ReceiptIndianRupeeIcon, Trash } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'
import Pagination from '@/components/Pagination'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import DateRangeFilter, { DateRangeFilterRef } from '@/components/DateFilter/FilterComponent'
import { usePermissions } from '@/context/auth/PermissionContext'
import useMenuPermissionData from '@/app/SuperAdmin/navigation/hooks/useMenuPermissionData'
import { useDeleteUniversity, useGetAllUniversity } from '../hooks'
import { UniversityResponse } from '../types/IUniversity'
import { Tooltip } from '@/components/ToolTip/Tooltip'
import DeleteComponents from '@/components/DeleteComponent/DeleteComponents'
import EditUniversity from '../pages/Edit'
import AddUniversity from '../pages/Add'
import AddCourse from '../../course/pages/Add'

interface FilterFormData {
    startDate: string
    endDate: string
}

//#region ActionMenu
interface ActionMenuProps {
    University: UniversityResponse;
    onEdit: (University: UniversityResponse) => void;
    onDelete: (id: string) => void;
    // onView: (Invoice: InvoiceResponse) => void;
    canEdit?: boolean;
    canDelete?: boolean;
}

const ActionMenu = ({ University, onEdit, onDelete, canEdit = true, canDelete = true }: ActionMenuProps) => {
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
                        onClick={() => { onEdit(University); setOpen(false) }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                        <Edit size={14} /> Edit
                    </button>}
                    {canDelete && <button
                        onClick={() => { onDelete(University.id); setOpen(false) }}
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

const AllUniversityForm = () => {
    const { menuStatus } = usePermissions()
    const { canAdd, canEdit, canDelete } = useMenuPermissionData(menuStatus)

    const [openFilter, setOpenFilter] = useState(false)
    const [addModal, setAddModal] = useState(false);
    const [addCourseModal, setAddCourseModal] = useState(false);

    const [selectedUniversityId, setSelectedUniersityId] = useState<string | null>(null)


    const [showEditModal, setShowEditModal] = useState(false)
    const [editUniversityId, setEditUniversityId] = useState<string | null>(null)

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deleteUniversityId, setDeleteUniversityId] = useState<string | null>(null)

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

    const { data, isLoading, error } = useGetAllUniversity(params)
    const deleteUniversity = useDeleteUniversity()
    const universityDetails = data?.items ?? [];
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


    const handleEditUniversity = (FollowUp: UniversityResponse) => {
        setEditUniversityId(FollowUp.id)
        setShowEditModal(true)
    }

    const handleDeleteUniversity = (id: string) => {
        setDeleteUniversityId(id)
        setShowDeleteModal(true)
    }


    const onDelete = async (id: string) => {
        try {
            await deleteUniversity.mutateAsync(id)
        } catch (error) {
            console.error(error)
        }
    }

    // const handleView = async (Invoice: AppointmentResponse) => {
    //     setSelectedInvoiceId(Invoice.id)
    //     setShowInvoiceDetailModal(true)
    // }


    const handleAddSubmit = () => {
        setAddModal(false);
        setAddCourseModal(false)
    };

    if (error) {
        return (
            <div className="p-4 sm:p-6">
                <Toaster position="top-right" />
                <div className="bg-white dark:bg-[#353535] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-8">
                    <div className="text-center py-16">
                        <BookOpen size={64} className="mx-auto text-red-400 mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                            Error loading University
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
                        <h1 className="text-xl font-semibold dark:text-white">All University</h1>
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
                                text="Add University"
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
                    <div className="px-5 pb-5">
                        {universityDetails.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                                {universityDetails.map((university, index) => {
                                    const serial = (currentPage - 1) * pageSize + index + 1;

                                    return (
                                        <div
                                            key={university.id}
                                            className="relative bg-white dark:bg-[#1f1f1f] border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                                        >

                                            {/* LEFT COLOR ACCENT BAR */}
                                            <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-blue-500 via-violet-500 to-pink-500" />

                                            {/* HEADER */}
                                            <div className="pl-5 pr-4 pt-4 pb-3 border-b border-gray-100 dark:border-gray-700 flex items-start justify-between gap-3">

                                                <div className="min-w-0">

                                                    <h2 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                                                        {university.name}
                                                    </h2>

                                                    <p className="text-sm text-gray-400 mt-0.5">
                                                        #{serial}
                                                    </p>

                                                </div>

                                                {/* COUNTRY BADGE */}
                                                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-full">

                                                    <span className="text-base">🌍</span>

                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                                        {university.countryName}
                                                    </span>

                                                </div>

                                            </div>

                                            {/* BODY */}
                                            <div className="pl-5 pr-4 py-3 space-y-3 text-sm text-gray-600 dark:text-gray-400">

                                                {/* ADDRESS */}
                                                <div className="flex items-start gap-2">
                                                    <span className="mt-0.5 text-gray-400">📍</span>
                                                    <span className="leading-relaxed">
                                                        {university.universityAddress || "No address provided"}
                                                    </span>
                                                </div>

                                                {/* WEBSITE */}
                                                <div className="flex items-center gap-2">
                                                    <span>🌐</span>

                                                    {university.website ? (
                                                        <a
                                                            href={university.website}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="text-blue-500 hover:underline truncate"
                                                        >
                                                            {university.website.replace(/^https?:\/\//, "")}
                                                        </a>
                                                    ) : (
                                                        <span>No website</span>
                                                    )}

                                                </div>

                                                {/* RANKING */}
                                                <div className="flex items-center gap-2">
                                                    <span>🏆</span>
                                                    <span>
                                                        Global ranking:{" "}
                                                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                                                            {university.globalRanking ?? "N/A"}
                                                        </span>
                                                    </span>
                                                </div>

                                                <div className="flex items-start justify-between gap-2">

                                                    {/* COURSES (LEFT SIDE - unchanged) */}
                                                    {university.courseNames?.length > 0 && (
                                                        <div className="flex items-start gap-2">
                                                            <span className="mt-0.5 text-gray-400">📚</span>

                                                            <div className="flex flex-wrap gap-2">
                                                                {university.courseNames.map((course, i) => (
                                                                    <span
                                                                        key={i}
                                                                        className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                                                                    >
                                                                        {course}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* ADD BUTTON (RIGHT SIDE) */}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setAddCourseModal(true);
                                                            setSelectedUniersityId(university.id);
                                                        }}
                                                        className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md hover:bg-blue-700 flex-shrink-0"
                                                    >
                                                        <Plus size={16} />
                                                    </button>

                                                </div>

                                                {/* DESCRIPTION */}
                                                {university.descriptions && (
                                                    <p className="pt-2 border-t border-gray-100 dark:border-gray-700 line-clamp-2 leading-relaxed text-sm text-gray-600 dark:text-gray-400">
                                                        {university.descriptions}
                                                    </p>
                                                )}

                                            </div>

                                            {/* ACTIONS */}
                                            <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-2">

                                                <button
                                                    onClick={() => handleEditUniversity(university)}
                                                    className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() => handleDeleteUniversity(university.id)}
                                                    className="text-sm px-3 py-1.5 rounded-lg border border-red-100 dark:border-red-900/40 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </div>
                                    );
                                })}

                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center">

                                <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-4">
                                    <span className="text-2xl">🏛️</span>
                                </div>

                                <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-1">
                                    No universities found
                                </h3>

                                <p className="text-sm text-gray-400 max-w-xs">
                                    Try adjusting your filters or add a new university to get started.
                                </p>

                            </div>
                        )}
                    </div>
                </div>

                {/* Pagination */}
                {universityDetails.length > 0 && totalPages > 1 && (
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


            {showDeleteModal && deleteUniversityId && (

                <DeleteComponents
                    visible={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={onDelete}
                    id={deleteUniversityId}
                    title="Delete University"
                    description="Are you sure you want to delete this University?"
                />

            )}



            {showEditModal && editUniversityId && (

                <EditUniversity

                    UniversityId={editUniversityId}
                    visible={showEditModal}
                    onClose={() => setShowEditModal(false)}

                />
            )}

            <AddCourse
                visible={addCourseModal}
                onClose={handleAddSubmit}
                UniversityId={selectedUniversityId}
            />

            <AddUniversity
                visible={addModal}
                onClose={handleAddSubmit}
                CountryId={""}
            />
        </>
    )
}

export default AllUniversityForm