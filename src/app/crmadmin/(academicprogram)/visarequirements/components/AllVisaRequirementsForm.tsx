'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { BookOpen, Edit, Eye, Filter, MoreVertical, Plus, ReceiptIndianRupeeIcon, RotateCcw, Trash } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast, { Toaster } from 'react-hot-toast'
import Pagination from '@/components/Pagination'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import DateRangeFilter, { DateRangeFilterRef } from '@/components/DateFilter/FilterComponent'
import { usePermissions } from '@/context/auth/PermissionContext'
import useMenuPermissionData from '@/app/SuperAdmin/navigation/hooks/useMenuPermissionData'
import { useDeleteVisaRequirement, useGetAllCountry, useGetAllVisaRequirement } from '../hooks'
import { AddVisaRequirementResponse, UpdateVisaRequirementResponse } from '../types/IVisaRequirements'
import DeleteComponents from '@/components/DeleteComponent/DeleteComponents'
import AddVisaRequirements from '../pages/Add'
import useErrorHandler from '@/components/helpers/ErrorHandling'
import { Toast } from '@/components/Toast/toast'
import { AppCombobox } from '@/components/Input/ComboBox'

interface FilterFormData {
    startDate: string
    endDate: string
    countryId: string
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
    const { handleError, clearError } = useErrorHandler()
    const { canAdd, canEdit, canDelete } = useMenuPermissionData(menuStatus)

    const [openFilter, setOpenFilter] = useState(false)
    const [addModal, setAddModal] = useState(false);


    const [showEditModal, setShowEditModal] = useState(false)
    const [editVisaRequirementsId, setEditVisaRequirementsId] = useState<string | null>(null)

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deleteVisaRequirementsId, setDeleteVisaRequirementsId] = useState<string | null>(null)

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
    const [selectedCountryName, setSelectedCountryName] = useState<string | null>(
        ""
    );

    const onClearClick = () => {
        setParams("");
        formRef.current?.handleClear();
        form.reset();
    };

    const { data, isLoading, error } = useGetAllVisaRequirement(params)

    const { data: getAllCountry } = useGetAllCountry()


    const deleteVisaRequirements = useDeleteVisaRequirement()


    const VisaRequirementsDetails = data?.Items ?? [];

    const onFilterSubmit = async (formData: FilterFormData) => {
        clearError()
        try {
            const queryParams = [
                formData.countryId
                    ? `countryId=${encodeURIComponent(formData.countryId)}`
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

    // const sortedVisaRequirements = [
    //     ...(data?.Items ?? []).flatMap(
    //         (x) => x.visaRequirementsDTOs ?? []
    //     ),
    // ].sort((a, b) => a.step - b.step);



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

                                <div className="flex-1 min-w-[240px]">
                                    <AppCombobox
                                        value={selectedCountryName}
                                        dropDownWidth="w-full"
                                        dropdownPositionClass="absolute"
                                        label="Country"
                                        name="countryId"
                                        form={form}
                                        options={getAllCountry}
                                        selected={
                                            getAllCountry?.find(
                                                (g) => g.name === selectedCountryName
                                            ) || null
                                        }
                                        onSelect={(group) => {
                                            if (group) {
                                                setSelectedCountryName(group.name || null);
                                            } else {
                                                setSelectedCountryName(null);
                                            }
                                        }}
                                        getLabel={(g) => g?.name ?? ""}
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

                                {VisaRequirementsDetails.map((VisaRequirements) => {

                                    // ✅ FIX: steps are per item (NO flatMap)
                                    const sortedSteps = [...(VisaRequirements.visaRequirementsDTOs ?? [])]
                                        .sort((a, b) => a.step - b.step)

                                    return (
                                        <div
                                            key={VisaRequirements.id}
                                            className="
                            group relative overflow-hidden
                            rounded-3xl
                            border border-white/60 dark:border-gray-900
                            bg-white dark:bg-[#1e1f24]
                            shadow-md shadow-3xl
                        "
                                        >
                                            {/* Top Gradient */}
                                            <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

                                            <div className="p-5">

                                                {/* Header */}
                                                <div className="flex items-start justify-between mb-5">
                                                    <span className="inline-flex items-center bg-blue-50 dark:bg-blue-900/30 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-600 dark:text-blue-300">
                                                        🌍 {VisaRequirements.countryName}
                                                    </span>

                                                    <ActionMenu
                                                        VisaRequirements={VisaRequirements}
                                                        onEdit={handleEditVisaRequirements}
                                                        onDelete={handleDeleteVisaRequirements}
                                                        canEdit={true}
                                                        canDelete={true}
                                                    />
                                                </div>

                                                {/* University */}
                                                <div className="rounded-2xl bg-gradient-to-r from-violet-50 to-white dark:from-violet-900/20 dark:to-gray-800 p-5 border border-gray-100 dark:border-gray-700">
                                                    <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">
                                                        University
                                                    </p>

                                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                                        {VisaRequirements.universityName}
                                                    </h3>

                                                    <span className="block mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                                                        {VisaRequirements.universityAddress}
                                                    </span>

                                                    <div className="mt-3 inline-block px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-100 dark:border-blue-800/30">
                                                        {VisaRequirements.courseTitle}
                                                    </div>
                                                </div>

                                                {/* ✅ STEPS (FIXED PER ITEM) */}
                                                <div className="mt-4 space-y-3">
                                                    {sortedSteps.map((item) => (
                                                        <div
                                                            key={item.visaStatusId}
                                                            className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
                                                        >
                                                            {/* Step */}
                                                            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-medium">
                                                                {String(item.step).padStart(2, "0")}
                                                            </div>

                                                            {/* Info */}
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-[11px] text-gray-400">
                                                                    Step {item.step}
                                                                </p>
                                                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                                                                    {item.visaStatusName}
                                                                </p>
                                                            </div>

                                                            {/* Status */}
                                                            {item.visaRequirementStatus === 1 && (
                                                                <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-600">
                                                                    Done
                                                                </span>
                                                            )}

                                                            {item.visaRequirementStatus === 2 && (
                                                                <span className="text-xs px-2 py-1 rounded-full bg-yellow-50 text-yellow-600">
                                                                    Current
                                                                </span>
                                                            )}

                                                            {item.visaRequirementStatus === 0 && (
                                                                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-500">
                                                                    Pending
                                                                </span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>

                                            </div>
                                        </div>
                                    )
                                })}

                            </div>
                        )}
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