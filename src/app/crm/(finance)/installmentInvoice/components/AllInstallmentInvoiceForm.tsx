'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { BadgeDollarSign, BadgeDollarSignIcon, BanknoteArrowDownIcon, BookOpen, CalendarClockIcon, CreditCardIcon, Edit, Eye, Filter, HandCoinsIcon, LucideHandCoins, MoreVertical, Plus, ReceiptEuro, ReceiptIndianRupeeIcon, Trash, User, WalletCards } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'
import Pagination from '@/components/Pagination'
import DateRangeFilter, { DateRangeFilterRef } from '@/components/DateFilter/FilterComponent'
import { useGetAllInstallmentInvoice, useDeleteInvoice } from '../hooks'
import AddInstallmentInvoice from '../pages/Add'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import { InstallmentInvoiceResponse } from '../types/IInstallmentInvoice'
import { usePermissions } from '@/context/auth/PermissionContext'
import useMenuPermissionData from '@/app/SuperAdmin/navigation/hooks/useMenuPermissionData'
import { EditButton } from '@/components/Buttons/EditButton'
import AddPayments from '../../installmentPayments/pages/Add'
import AddInstallmentPlan from '../../installments/pages/Add'
import EditInstallmentInvoice from '../pages/Edit'
import DeleteComponents from '@/components/DeleteComponent/DeleteComponents'
import { InstallmentInvoiceDetailModal } from './InstallmentInvoiceDetailsModal'
import { GenerateInstallmentInvoiceModal } from './GenerateInstallmentInvoiceModal'
import { Tooltip } from '@/components/ToolTip/Tooltip'

interface FilterFormData {
    startDate: string
    endDate: string
}


//#region ActionMenu
interface ActionMenuProps {
    InstallmentInvoice: InstallmentInvoiceResponse;
    onEdit: (InstallmentInvoice: InstallmentInvoiceResponse) => void;
    onDelete: (id: string) => void;
    onView: (InstallmentInvoice: InstallmentInvoiceResponse) => void;
    canEdit?: boolean;
    canDelete?: boolean;
}

const ActionMenu = ({ InstallmentInvoice, onEdit, onDelete, onView, canEdit = true, canDelete = true }: ActionMenuProps) => {
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
                        onClick={() => { onView(InstallmentInvoice); setOpen(false) }}
                        className="w-full text-left px-4 py-2 text-sm dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                        <Eye size={14} /> PaymentDetails
                    </button>
                    {canEdit && <button
                        onClick={() => { onEdit(InstallmentInvoice); setOpen(false) }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                        <Edit size={14} /> Edit
                    </button>}

                    {canDelete && <button
                        onClick={() => { onDelete(InstallmentInvoice.id); setOpen(false) }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                        <Trash size={14} /> Delete
                    </button>}

                </div>
            )}
        </div>
    )
}


const AllInstallmentInvoiceForm = () => {
    const [openFilter, setOpenFilter] = useState(false)
    const [addModal, setAddModal] = useState(false);
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [showInstallmentPlan, setshowInstallmentPlan] = useState(false);
    const [selectedId, setSelectedId] = useState<string>('')
    const [selectedApplicantId, setSelectedApplicantId] = useState<string>('')

    const [showGenerateInstallmentInvoiceModal, setShowGenerateInstallmentInvoiceModal] = useState(false)
    const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null)

    const [showInstallmentInvoiceDetailModal, setShowInstallmentInvoiceDetailModal] = useState(false)
    const [selectedInstallmentInvoiceId, setSelectedInstallmentInvoiceId] = useState<string | null>(null)

    const [showInstallmentInvoiceDeleteModal, setShowInstallmentInvoiceDeleteModal] = useState(false)
    const [deleteInstallmentInvoiceId, setDeleteInstallmentInvoiceId] = useState<string | null>(null)

    const [showInstallmentInvoiceEditModal, setShowInstallmentInvoiceEditModal] = useState(false)
    const [editInstallmentInvoiceId, setEditInstallmentInvoiceId] = useState<string | null>(null)




    const [params, setParams] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const { menuStatus } = usePermissions()
    const { canEdit, canDelete } = useMenuPermissionData(menuStatus)


    const formRef = useRef<DateRangeFilterRef>(null)
    const pageSize = 10

    const form = useForm<FilterFormData>({
        defaultValues: { startDate: '', endDate: '' },
    })

    const paginationForm = useForm({
        defaultValues: { pageSize, pageIndex: currentPage, isPagination: true },
    })

    const { data, isLoading, error } = useGetAllInstallmentInvoice(params)
    const deleteInvoice = useDeleteInvoice()
    const InstallmentinvoiceDetails = data?.items ?? [];
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

    const invoiceStatusType = [
        { id: 1, name: 'Draft' },
        { id: 2, name: 'Issued' },
        { id: 3, name: 'PartiallyPaid' },
        { id: 4, name: 'Paid' },
        { id: 5, name: 'Cancelled' }
    ];

    const handleEditInstallmentInvoice = (Invoice: InstallmentInvoiceResponse) => {
        setEditInstallmentInvoiceId(Invoice.id)
        setShowInstallmentInvoiceEditModal(true)
    }

    const handleView = async (Invoice: InstallmentInvoiceResponse) => {
        setSelectedInstallmentInvoiceId(Invoice.id)
        setShowInstallmentInvoiceDetailModal(true)
    }


    const handleInstallmentInvoiceDelete = (id: string) => {
        setDeleteInstallmentInvoiceId(id)
        setShowInstallmentInvoiceDeleteModal(true)
    }

    const handlepayment = () => {
        setShowPaymentForm(false);
        setSelectedId("");
    };

    const handlInstallmentPlan = () => {
        setshowInstallmentPlan(false);
        setSelectedId("");
    };



    const onDelete = async (id: string) => {
        try {
            await deleteInvoice.mutateAsync(id)
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
                        <h1 className="text-xl font-semibold dark:text-white">All InstallmentInvoice</h1>
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
                                text="Add Invoice"
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

                    {/* Table */}
                    <div className="px-4 pb-4">
                        <div className="w-full overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-[#80878c] uppercase font-semibold border-b">
                                        <th className="px-4 py-3 text-left">S.N</th>
                                        <th className="px-4 py-3 text-left">Applicant</th>
                                        <th className="px-4 py-3 text-left">InvoiceNo</th>

                                        <th className="px-4 py-3 text-left hidden md:table-cell">Status</th>
                                        <th className="px-4 py-3 text-left hidden md:table-cell">Total Amount</th>
                                        <th className="px-4 py-3 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {InstallmentinvoiceDetails.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={8}
                                                className="p-4 text-center italic text-gray-500 dark:text-gray-400"
                                            >
                                                No InstalmentPlan found.
                                            </td>
                                        </tr>
                                    ) : (
                                        InstallmentinvoiceDetails.map((invoice, index) => (
                                            <tr
                                                key={invoice.id}
                                                className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2a2b2e] transition-colors"
                                            >
                                                <td className="px-4 py-3 text-gray-500">
                                                    {(currentPage - 1) * pageSize + index + 1}
                                                </td>

                                                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">
                                                    {invoice.applicantName}
                                                </td>

                                                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">
                                                    {invoice.invoiceNumber}
                                                </td>

                                                <td className="px-4 py-3 text-gray-600 dark:text-gray-300 hidden md:table-cell">
                                                    {
                                                        invoiceStatusType.find(
                                                            (i) => i.id === invoice.invoiceStatus)
                                                            ?.name
                                                    }
                                                </td>
                                                <td className="px-4 py-3 text-gray-600 dark:text-gray-300 hidden md:table-cell">
                                                    {invoice.totalAmount}
                                                </td>

                                                <td className="px-4 py-3 ">
                                                    <span className='flex justify-center gap-3'>

                                                        <Tooltip text="View Invoice Details">
                                                            <ButtonElement
                                                                icon={<Eye size={15} />}
                                                                type="button"
                                                                text=""
                                                                onClick={() => {
                                                                    setShowGenerateInstallmentInvoiceModal(true)
                                                                    setSelectedInstallmentInvoiceId(invoice.id ?? '')
                                                                    setSelectedSchoolId(invoice.schoolId ?? '')
                                                                }}
                                                                className="!text-xs"
                                                            />
                                                        </Tooltip>


                                                        <Tooltip text="Complete Payment">

                                                            <ButtonElement
                                                                type="button"
                                                                text="Pay Now"
                                                                onClick={() => {
                                                                    setShowPaymentForm(true)
                                                                    setSelectedId(invoice.id ?? '')
                                                                }}
                                                                className="!text-xs"
                                                            />
                                                        </Tooltip>
                                                        <Tooltip text="Schedule Installments">
                                                            <ButtonElement
                                                                icon={<CalendarClockIcon size={14} className="text-white" />}
                                                                type="button"
                                                                text=""
                                                                onClick={() => {
                                                                    setshowInstallmentPlan(true);
                                                                    setSelectedId(invoice.id ?? "");
                                                                    setSelectedApplicantId(invoice.applicantId ?? "")
                                                                }}
                                                                className="!text-xs bg-indigo-600 hover:bg-indigo-700"

                                                            />
                                                        </Tooltip>


                                                        <ActionMenu
                                                            InstallmentInvoice={invoice}
                                                            onEdit={handleEditInstallmentInvoice}
                                                            onDelete={handleInstallmentInvoiceDelete}
                                                            onView={handleView}
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
                {InstallmentinvoiceDetails.length > 0 && totalPages > 1 && (
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

            {showPaymentForm && selectedId && (
                <AddPayments
                    invoiceId={selectedId}
                    visible={showPaymentForm}
                    onClose={() => setShowPaymentForm(false)}
                    onSuccess={handlepayment}
                />
            )}


            <InstallmentInvoiceDetailModal
                isOpen={showInstallmentInvoiceDetailModal}
                onClose={() => { setShowInstallmentInvoiceDetailModal(false); setSelectedInstallmentInvoiceId(null) }}
                InvoiceId={selectedInstallmentInvoiceId}
            />


            {showInstallmentPlan && selectedId && (
                <AddInstallmentPlan
                    invoiceId={selectedId}
                    applicantId={selectedApplicantId}
                    visible={showInstallmentPlan}
                    onClose={() => setshowInstallmentPlan(false)}
                    onSuccess={handlInstallmentPlan}
                />
            )}


            {showInstallmentInvoiceDeleteModal && deleteInstallmentInvoiceId && (
                <DeleteComponents
                    visible={showInstallmentInvoiceDeleteModal}
                    onClose={() => setShowInstallmentInvoiceDeleteModal(false)}
                    onConfirm={onDelete}
                    id={deleteInstallmentInvoiceId}
                    title="Delete Installment Invoice"
                    description="Are you sure you want to delete this Installment invoice?"
                />
            )}

            {showInstallmentInvoiceEditModal && editInstallmentInvoiceId && (

                <EditInstallmentInvoice
                    InvoiceId={editInstallmentInvoiceId}
                    visible={showInstallmentInvoiceEditModal}
                    onClose={() => setShowInstallmentInvoiceEditModal(false)}

                />
            )}

            <GenerateInstallmentInvoiceModal
                isOpen={showGenerateInstallmentInvoiceModal}
                onClose={() => { setShowGenerateInstallmentInvoiceModal(false); setSelectedInstallmentInvoiceId(null) }}
                InvoiceId={selectedInstallmentInvoiceId}
                SchoolId={selectedSchoolId}
            />


            <AddInstallmentInvoice
                visible={addModal}
                onClose={handleAddSubmit}
            />

        </>
    )
}

export default AllInstallmentInvoiceForm