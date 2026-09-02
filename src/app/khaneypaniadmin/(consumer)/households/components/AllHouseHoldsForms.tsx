'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { BookOpen, Edit, Filter, MoreVertical, Plus, ReceiptIndianRupeeIcon, RotateCcw, Trash } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'
import Pagination from '@/components/Pagination'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import DateRangeFilter, { DateRangeFilterRef } from '@/components/DateFilter/FilterComponent'
import { usePermissions } from '@/context/auth/PermissionContext'
import useMenuPermissionData from '@/app/SuperAdmin/navigation/hooks/useMenuPermissionData'
import { useDeleteHouseHolds, useGetAllHouseHolds } from '../hooks'
import { HouseHoldsResponse } from '../types/IHouseHolds'
import AddHouseHolds from '../pages/Add'
import EditHouseHolds from '../pages/Edit'
import useErrorHandler from '@/components/helpers/ErrorHandling'
import { Toast } from '@/components/Toast/toast'
import { AppCombobox } from '@/components/Input/ComboBox'
import DeleteComponents from '@/components/DeleteComponent/DeleteComponents'

interface FilterFormData {
    name: string
    startDate: string
    endDate: string
}

//#region ActionMenu
interface ActionMenuProps {
    HouseHolds: HouseHoldsResponse;
    // onView: (Invoice: InvoiceResponse) => void;
    onEdit: (HouseHolds: HouseHoldsResponse) => void;
    onDelete: (id: string) => void;
}

const ActionMenu = ({
    HouseHolds,
    onEdit,
    onDelete,
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
                        onClick={() => { onEdit(HouseHolds); setOpen(false) }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                        <Edit size={14} /> Edit
                    </button>
                    <button
                        onClick={() => { onDelete(HouseHolds.id); setOpen(false) }}
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


const resolveAssetUrl = (path?: string | null): string | null => {
    if (!path || path === '-' || path === 'string' || path.trim() === '') return null

    const base = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/+$/, '')
    const raw = path.trim()

    try {
        if (/^https?:\/\//i.test(raw)) {
            const parsed = new URL(raw)
            const pathname = parsed.pathname.replace(/^\/+/, '')
            const normalizedPath = pathname.replace(/^khaneypani\/?/i, '')

            return base ? `${base}/${normalizedPath}` : `/${normalizedPath}`
        }
    } catch {
        // fall through to relative-path handling below
    }

    const cleanPath = raw.replace(/^\/+/, '').replace(/^khaneypani\/?/i, '')
    return base ? `${base}/${cleanPath}` : `/${cleanPath}`
}

const AllHouseHoldsForm = () => {
    const { menuStatus } = usePermissions()
    const { handleError, clearError } = useErrorHandler()
    const { canAdd, canEdit, canDelete } = useMenuPermissionData(menuStatus)

    const [openFilter, setOpenFilter] = useState(false)
    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [selectedHousehold, setSelectedHousehold] = useState<HouseHoldsResponse | null>(null)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [selectedQrCode, setSelectedQrCode] = useState<string | null>(null);

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

    const [selectedHouseHoldsName, setSelectedHouseHoldsName] = useState<string | null>(
        ""
    );








    const { data, isLoading, error } = useGetAllHouseHolds(fullQuery)
    const deleteHouseHolds = useDeleteHouseHolds()


    const HouseHoldsDetails = data?.Items ?? [];

    const onFilterSubmit = async (formData: FilterFormData) => {
        clearError()
        try {
            const queryParams = [
                formData.name
                    ? `name=${encodeURIComponent(formData.name)}`
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


    const HouseHoldsType = [
        { id: 1, name: 'Application' },
        { id: 2, name: 'Documents' }

    ];


    const handleEditLead = (HouseHolds: HouseHoldsResponse) => {
        setSelectedHousehold(HouseHolds)
        setEditModal(true)
    }

    const handleAddHouseHolds = () => {
        setSelectedHousehold(null)
        setAddModal(true)
    };

    const handleDelete = async (id: string) => {
        try {
            console.error("Id", id)
            await deleteHouseHolds.mutateAsync(id)
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

    const onClearClick = () => {
        setParams("");
        formRef.current?.handleClear();
        form.reset();
    };

    return (
        <>
            <Toaster position="top-right" />
            <div className="p-4 sm:p-6">
                <div className="bg-white dark:bg-[#353535] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">

                    {/* Header */}
                    <div className="flex w-full justify-between p-3 px-4 pt-4 items-center">
                        <h1 className="text-xl font-semibold dark:text-white">All HouseHolds</h1>
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
                                text="Add HouseHolds"
                                onClick={handleAddHouseHolds}
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
                                        value={selectedHouseHoldsName}
                                        dropDownWidth="w-full"
                                        dropdownPositionClass="absolute"
                                        label="Visa Status"
                                        name="name"
                                        form={form}
                                        options={data?.Items}
                                        selected={
                                            data?.Items?.find(
                                                (g) => g.consumerName === selectedHouseHoldsName
                                            ) || null
                                        }
                                        onSelect={(group) => {
                                            if (group) {
                                                setSelectedHouseHoldsName(group.consumerName || null);
                                            } else {
                                                setSelectedHouseHoldsName(null);
                                            }
                                        }}
                                        getLabel={(g) => g?.consumerName ?? ""}
                                        getValue={(g) => g?.consumerName ?? ""}
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
                                        <th className="px-4 py-3 text-left">ConsumerName</th>
                                        <th className="px-4 py-3 text-left">MeterNumber</th>
                                        <th className="px-4 py-3 text-left">FamilyMember</th>
                                        <th className="px-4 py-3 text-left">Email</th>
                                        <th className="px-4 py-3 text-left">Tole</th>
                                        <th className="px-4 py-3 text-left">QrCode</th>

                                        <th className="px-4 py-3 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {HouseHoldsDetails.length === 0 ? (
                                        <tr>
                                            <td colSpan={9} className="p-4 text-center italic text-gray-500 dark:text-gray-400">
                                                No visa HouseHolds found.
                                            </td>
                                        </tr>
                                    ) : (
                                        HouseHoldsDetails.map((HouseHolds, index) => (
                                            <tr
                                                key={HouseHolds.id}
                                                className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2a2b2e] transition-colors"
                                            >
                                                <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                                                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">
                                                    {HouseHolds.consumerName}
                                                </td>
                                                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">
                                                    {HouseHolds.meterNumber}
                                                </td>
                                                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">
                                                    {process.env.NEXT_PUBLIC_API_URL}
                                                    {/* {HouseHolds.familyMember} */}
                                                </td>
                                                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">
                                                    {HouseHolds.email}
                                                </td>

                                                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">
                                                    {HouseHolds.tole}
                                                </td>

                                                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">
                                                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-md flex-shrink-0 cursor-pointer">
                                                        {HouseHolds?.qrCode ? (() => {
                                                            const qrUrl = resolveAssetUrl(HouseHolds.qrCode)

                                                            if (!qrUrl) {
                                                                return (
                                                                    <span className="text-sm font-bold text-gray-700">
                                                                        No QR Code
                                                                    </span>
                                                                )
                                                            }

                                                            return (
                                                                <img
                                                                    src={qrUrl}
                                                                    alt="QR Code"
                                                                    className="w-full h-full object-contain hover:scale-110 transition-transform duration-200"
                                                                    onClick={() => setSelectedQrCode(qrUrl)}
                                                                    onError={(e) => {
                                                                        console.log('QR Image failed:', e.currentTarget.src)
                                                                    }}
                                                                />
                                                            )
                                                        })() : (
                                                            <span className="text-sm font-bold text-gray-700">
                                                                No QR Code
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>


                                                <td className="py-1 px-4">
                                                    <ActionMenu
                                                        HouseHolds={HouseHolds}
                                                        onEdit={handleEditLead}
                                                        onDelete={setDeleteId}
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

            {selectedQrCode && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
                    onClick={() => setSelectedQrCode(null)}
                >
                    <div
                        className="relative bg-white dark:bg-gray-900 rounded-xl p-6 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            type="button"
                            onClick={() => setSelectedQrCode(null)}
                            className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold hover:bg-red-600"
                        >
                            ✕
                        </button>

                        <img
                            src={selectedQrCode}
                            alt="QR Code Preview"
                            className="w-[450px] h-[450px] object-contain"
                        />
                    </div>
                </div>
            )}





            <AddHouseHolds
                visible={addModal}
                onClose={() => {
                    handleAddSubmit()
                }}
            />
            <EditHouseHolds
                visible={editModal}
                household={selectedHousehold}
                onClose={() => {
                    setEditModal(false)
                    setSelectedHousehold(null)
                }}
            />
            <DeleteComponents
                visible={Boolean(deleteId)}
                id={deleteId ?? ''}
                title="Delete household"
                description="Are you sure you want to delete this household? This action cannot be undone."
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
            />
        </>
    )
}

export default AllHouseHoldsForm