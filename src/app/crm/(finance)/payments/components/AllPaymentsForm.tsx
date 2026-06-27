'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { BookOpen, Edit, Eye, EyeOff, Filter, MoreVertical, Plus, RotateCcw, Trash } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'
import Pagination from '@/components/Pagination'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import DateRangeFilter, { DateRangeFilterRef } from '@/components/DateFilter/FilterComponent'
import { usePermissions } from '@/context/auth/PermissionContext'
import useMenuPermissionData from '@/app/SuperAdmin/navigation/hooks/useMenuPermissionData'

import { AddPaymentsPayload, PaymentsResponse } from '../types/IPayments'

import { useDeletePayments, useGetAllInvoice, useGetAllPayments } from '../hooks'
import EditPayments from '../pages/Edit'
import DeleteComponents from '@/components/DeleteComponent/DeleteComponents'
import { PaymentsReceiptDetailsModal } from './PaymentsReceiptModals'
import { Tooltip } from '@/components/ToolTip/Tooltip'
import { AppCombobox } from '@/components/Input/ComboBox'
import useErrorHandler from '@/components/helpers/ErrorHandling'
import { Toast } from '@/components/Toast/toast'

interface FilterFormData {
    startDate: string
    endDate: string
    invoiceId: string
}



//#region ActionMenu
interface ActionMenuProps {
    Payment: PaymentsResponse;
    onEdit: (Payment: PaymentsResponse) => void;
    onDelete: (id: string) => void;
    canEdit?: boolean;
    canDelete?: boolean;
}

const ActionMenu = ({ Payment, onEdit, onDelete, canEdit = true, canDelete = true }: ActionMenuProps) => {
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
                    {canEdit && <button
                        onClick={() => { onEdit(Payment); setOpen(false) }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                        <Edit size={14} /> Edit
                    </button>}
                    {canDelete && <button
                        onClick={() => { onDelete(Payment.id); setOpen(false) }}
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

const AllPaymentsForm = () => {
    const { menuStatus } = usePermissions()
    const { handleError, clearError } = useErrorHandler()
    const { canAdd, canEdit, canDelete } = useMenuPermissionData(menuStatus)


    const [showPaymentReceiptModal, setShowPaymentsReceiptModal] = useState(false)
    const [selectedPaymentsId, setSelectedPaymentsId] = useState<string | null>(null)
    const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null)


    const [showEditModal, setShowEditModal] = useState(false)
    const [editPaymentsId, setEditPaymentsId] = useState<string | null>(null)

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deletePaymentsId, setDeletePaymentsId] = useState<string | null>(null)




    const [openFilter, setOpenFilter] = useState(false)
    const [addModal, setAddModal] = useState(false);
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

    const [selectedInvoiceNumber, setSelectedInvoiceNumber] = useState<string | null>(
        ""
    );

    const onClearClick = () => {
        setParams("");
        formRef.current?.handleClear();
        form.reset();
    };

    const { data, isLoading, error } = useGetAllPayments(params)

    const { data: getAllInvoice } = useGetAllInvoice()


    const deletePayments = useDeletePayments()

    const payments = data?.Items ?? [];

    const paymentsMethodsType = [
        { id: 0, name: 'Cash' },
        { id: 1, name: 'CreditCard' },
        { id: 2, name: 'DebitCard' },
        { id: 3, name: 'BankTransfer' },
        { id: 4, name: 'MobilePayment' },
        { id: 5, name: 'Check' }
    ];

    const paymentStatus = [
        { id: 1, name: 'Pending' },
        { id: 2, name: 'Completed' },
        { id: 3, name: 'Failed' }
    ];

    const handleEditPayments = (Payments: PaymentsResponse) => {
        setEditPaymentsId(Payments.id)
        setShowEditModal(true)
    }

    const handleDeletePayments = (id: string) => {
        setDeletePaymentsId(id)
        setShowDeleteModal(true)
    }

    const handlePaymentReceipt = async (Payments: PaymentsResponse) => {
        setSelectedPaymentsId(Payments.id)
        setShowPaymentsReceiptModal(true)
    }


    const onDelete = async (id: string) => {
        try {
            await deletePayments.mutateAsync(id)
        } catch (error) {
            console.error(error)
        }
    }

    const onFilterSubmit = async (formData: FilterFormData) => {
        clearError()
        try {
            const queryParams = [
                formData.invoiceId
                    ? `invoiceId=${encodeURIComponent(formData.invoiceId)}`
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
                        <h1 className="text-xl font-semibold dark:text-white">All Payments</h1>
                        <div className="flex items-center space-x-3">
                            <ButtonElement
                                type="button"
                                text="Filter"
                                icon={<Filter size={14} />}
                                onClick={() => setOpenFilter(!openFilter)}
                                className="!bg-emerald-600 hover:!bg-emerald-700"
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
                                        value={selectedInvoiceNumber}
                                        dropDownWidth="w-full"
                                        dropdownPositionClass="absolute"
                                        label="Invoice"
                                        name="invoiceId"
                                        form={form}
                                        options={getAllInvoice}
                                        selected={
                                            getAllInvoice?.find(
                                                (g) => g.invoiceNumber === selectedInvoiceNumber
                                            ) || null
                                        }
                                        onSelect={(group) => {
                                            if (group) {
                                                setSelectedInvoiceNumber(group.invoiceNumber || null);
                                            } else {
                                                setSelectedInvoiceNumber(null);
                                            }
                                        }}
                                        getLabel={(g) => g?.invoiceNumber ?? ""}
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
                                        <th className="px-4 py-3 text-left">Applicant</th>
                                        <th className="px-4 py-3 text-left">Invoice</th>

                                        <th className="px-4 py-3 text-left hidden md:table-cell">Amount</th>
                                        <th className="px-4 py-3 text-left hidden md:table-cell">PaymentMethod</th>
                                        <th className="px-4 py-3 text-left hidden md:table-cell">PaymentStatus</th>
                                        <th className="px-4 py-3 text-left hidden md:table-cell">PaymentDate</th>
                                        <th className="px-4 py-3 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={8}
                                                className="p-4 text-center italic text-gray-500 dark:text-gray-400"
                                            >
                                                No Payments found.
                                            </td>
                                        </tr>
                                    ) : (
                                        payments.map((payment, index) => (
                                            <tr
                                                key={payment.id}
                                                className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2a2b2e] transition-colors"
                                            >
                                                <td className="px-4 py-3 text-gray-500">{index + 1}</td>

                                                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">
                                                    {payment.applicantName}
                                                </td>

                                                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">
                                                    {payment.invoiceNumber}
                                                </td>

                                                <td className="px-4 py-3 text-gray-600 dark:text-gray-300 hidden md:table-cell">
                                                    {payment.amount}
                                                </td>
                                                <td className="px-4 py-3 text-gray-600 dark:text-gray-300 hidden md:table-cell">

                                                    {
                                                        paymentsMethodsType.find(
                                                            (i) => i.id === payment.paymentMethod
                                                        )?.name
                                                    }
                                                </td>

                                                <td className="px-4 py-3 text-gray-600 dark:text-gray-300 hidden md:table-cell">
                                                    {
                                                        paymentStatus.find(
                                                            (i) => i.id === payment.paymentStatus
                                                        )?.name
                                                    }
                                                </td>

                                                <td className="px-4 py-3 text-gray-600 dark:text-gray-300 hidden md:table-cell">
                                                    {payment?.paymentDate ? payment.paymentDate.split("T")[0] : ""}
                                                </td>

                                                <td className="px-4 py-3">
                                                    <div className="flex justify-center gap-3">

                                                        <Tooltip text="Payment Details">
                                                            <ButtonElement
                                                                icon={<Eye size={14} />}
                                                                type="button"
                                                                text=""
                                                                onClick={() => {
                                                                    setShowPaymentsReceiptModal(true)
                                                                    setSelectedPaymentsId(payment.id ?? '')
                                                                    setSelectedSchoolId(payment.schoolId ?? '')
                                                                }}
                                                                className="!text-xs"
                                                            />

                                                        </Tooltip>


                                                        <ActionMenu
                                                            Payment={payment}
                                                            onEdit={handleEditPayments}
                                                            onDelete={handleDeletePayments}
                                                            canEdit={true}
                                                            canDelete={true}
                                                        />
                                                    </div>
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

            <PaymentsReceiptDetailsModal
                isOpen={showPaymentReceiptModal}
                onClose={() => { setShowPaymentsReceiptModal(false); setSelectedPaymentsId(null) }}
                PaymentsId={selectedPaymentsId}
                SchoolId={selectedSchoolId}
            />

            {showDeleteModal && deletePaymentsId && (

                <DeleteComponents
                    visible={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={onDelete}
                    id={deletePaymentsId}
                    title="Delete Payments"
                    description="Are you sure you want to delete this Payments?"
                />

            )}

            {showEditModal && editPaymentsId && (
                <EditPayments
                    PaymentsId={editPaymentsId}
                    visible={showEditModal}
                    onClose={() => setShowEditModal(false)}
                />
            )}
        </>
    )
}

export default AllPaymentsForm