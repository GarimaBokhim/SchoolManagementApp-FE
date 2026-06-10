'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { BookOpen, Edit, Eye, Filter, MoreVertical, Plus, ReceiptIndianRupeeIcon, Trash } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'
import Pagination from '@/components/Pagination'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import DateRangeFilter, { DateRangeFilterRef } from '@/components/DateFilter/FilterComponent'
import { usePermissions } from '@/context/auth/PermissionContext'
import useMenuPermissionData from '@/app/SuperAdmin/navigation/hooks/useMenuPermissionData'
import { useDeleteAppointment, useGetAllAppointment } from '../hooks'
import AddInvoice from '../pages/Add'
import { AppointmentResponse } from '../types/IAppointment'
import { Tooltip } from '@/components/ToolTip/Tooltip'
import AddAppointment from '../pages/Add'
import DeleteComponents from '@/components/DeleteComponent/DeleteComponents'
import EditAppointment from '../pages/Edit'
import { AppointmentDetailModal } from './AppointmentDetailModal'

interface FilterFormData {
    startDate: string
    endDate: string
}

//#region ActionMenu
interface ActionMenuProps {
    Appointment: AppointmentResponse;
    onEdit: (Appointment: AppointmentResponse) => void;
    onDelete: (id: string) => void;
    // onView: (Invoice: InvoiceResponse) => void;
    canEdit?: boolean;
    canDelete?: boolean;
}

const ActionMenu = ({ Appointment, onEdit, onDelete, canEdit = true, canDelete = true }: ActionMenuProps) => {
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
                        onClick={() => { onEdit(Appointment); setOpen(false) }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                        <Edit size={14} /> Edit
                    </button>}
                    {canDelete && <button
                        onClick={() => { onDelete(Appointment.id); setOpen(false) }}
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

const AllAppointmentForm = () => {
    const { menuStatus } = usePermissions()
    const { canAdd, canEdit, canDelete } = useMenuPermissionData(menuStatus)

    const [openFilter, setOpenFilter] = useState(false)
    const [addModal, setAddModal] = useState(false);
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [selectedId, setSelectedId] = useState<string>('')


    const [showGenerateInvoiceModal, setShowGenerateInvoiceModal] = useState(false)


    // const [showAppointmentDetailModal, setShowAppointmentDetailModal] = useState(false)
    // const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null)
    // const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)

    const [appointmentModal, setAppointmentModal] = useState<{
        isOpen: boolean;
        appointmentId: string;
        leadId: string | null;
        userId: string
    }>({
        isOpen: false,
        appointmentId: "",
        leadId: null,
        userId: ""
    });


    const [showEditModal, setShowEditModal] = useState(false)
    const [editAppointmentId, setEditAppointmentId] = useState<string | null>(null)

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deleteAppointmentId, setDeleteAppointmentId] = useState<string | null>(null)

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

    const { data, isLoading, error } = useGetAllAppointment(params)
    const deleteAppointment = useDeleteAppointment()
    const appointmentDetails = data?.items ?? [];
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


    const handleEditAppointment = (Appointment: AppointmentResponse) => {
        setEditAppointmentId(Appointment.id)
        setShowEditModal(true)
    }

    const handleDeleteAppointment = (id: string) => {
        setDeleteAppointmentId(id)
        setShowDeleteModal(true)
    }

    const handlepayment = () => {
        setShowPaymentForm(false);
        setSelectedId("");
    };

    const onDelete = async (id: string) => {
        try {
            await deleteAppointment.mutateAsync(id)
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
                        <h1 className="text-xl font-semibold dark:text-white">All Appointments</h1>
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
                                text="Add Appointments"
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
                    <div className="px-4 pb-4">
                        <div className="w-full overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-[#80878c] uppercase font-semibold border-b">
                                        <th className="px-4 py-3 text-left">S.N</th>
                                        <th className="px-4 py-3 text-left">Lead</th>
                                        <th className="px-4 py-3 text-left">Councellor</th>

                                        <th className="px-4 py-3 text-left hidden md:table-cell">AppointmentDate</th>
                                        <th className="px-4 py-3 text-left hidden md:table-cell">Notes</th>
                                        <th className="px-4 py-3 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointmentDetails.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={8}
                                                className="p-4 text-center italic text-gray-500 dark:text-gray-400"
                                            >
                                                No Appointments found.
                                            </td>
                                        </tr>
                                    ) : (
                                        appointmentDetails.map((appointment, index) => (
                                            <tr
                                                key={appointment.id}
                                                className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2a2b2e] transition-colors"
                                            >
                                                <td className="px-4 py-3 text-gray-500">
                                                    {(currentPage - 1) * pageSize + index + 1}
                                                </td>

                                                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">
                                                    {appointment.leadName}
                                                </td>

                                                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">

                                                    {appointment.counselorName}
                                                </td>

                                                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">

                                                    {appointment.appointmentDate}
                                                </td>

                                                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">

                                                    {appointment.notes}
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

                                                        <Tooltip text="Appointment Details">
                                                            <ButtonElement
                                                                type="button"
                                                                text=""
                                                                icon={<Eye size={15} />}
                                                                // onClick={() => {
                                                                //     setShowAppointmentDetailModal(true)
                                                                //     setSelectedAppointmentId(appointment.id ?? '')
                                                                //     setSelectedLeadId(appointment.leadId ?? '')
                                                                // }}

                                                                onClick={() => {
                                                                    setAppointmentModal({
                                                                        isOpen: true,
                                                                        appointmentId: appointment.id ?? null,
                                                                        leadId: appointment.leadId ?? null,
                                                                        userId: appointment.userId ?? null
                                                                    });
                                                                }}
                                                                className="!text-xs"
                                                            />
                                                        </Tooltip>

                                                        <ActionMenu
                                                            Appointment={appointment}
                                                            onEdit={handleEditAppointment}
                                                            onDelete={handleDeleteAppointment}
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
                {appointmentDetails.length > 0 && totalPages > 1 && (
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

            {/* <AppointmentDetailModal
                isOpen={showAppointmentDetailModal}
                onClose={() => { setShowAppointmentDetailModal(false); setSelectedAppointmentId(null) }}
                AppointmentId={selectedAppointmentId}
                LeadId={selectedLeadId}
            /> */}

            <AppointmentDetailModal
                isOpen={appointmentModal.isOpen}
                AppointmentId={appointmentModal.appointmentId}
                LeadId={appointmentModal.leadId}
                UserId={appointmentModal.userId}

                onClose={() =>
                    setAppointmentModal({
                        isOpen: false,
                        appointmentId: "",
                        leadId: null,
                        userId: ""
                    })
                }
            />




            {showDeleteModal && deleteAppointmentId && (

                <DeleteComponents
                    visible={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={onDelete}
                    id={deleteAppointmentId}
                    title="Delete Appointment"
                    description="Are you sure you want to delete this Appointment?"
                />

            )}



            {showEditModal && editAppointmentId && (

                <EditAppointment

                    AppointmentId={editAppointmentId}
                    visible={showEditModal}
                    onClose={() => setShowEditModal(false)}

                />
            )}

            <AddAppointment
                visible={addModal}
                onClose={handleAddSubmit}
            />
        </>
    )
}

export default AllAppointmentForm