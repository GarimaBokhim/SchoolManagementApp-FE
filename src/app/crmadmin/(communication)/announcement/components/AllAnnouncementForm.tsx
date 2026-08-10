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
import { useDeleteAnnouncement, useGetAllAnnouncement, usePinAnnouncement, usePublishAnnouncement, useUnPinAnnouncement, useUnPublishAnnouncement } from '../hooks'
import { AnnouncementResponse } from '../types/IAnnouncement'
import { Tooltip } from '@/components/ToolTip/Tooltip'
import AddAppointment from '../pages/Add'
import DeleteComponents from '@/components/DeleteComponent/DeleteComponents'
import EditAppointment from '../pages/Edit'
import EditAnnouncement from '../pages/Edit'
import AddAnnouncement from '../pages/Add'
import { handleError } from '@/utils/handleError'
import { AppCombobox } from '@/components/Input/ComboBox'

interface FilterFormData {
    startDate: string
    endDate: string
    title: string
}

//#region ActionMenu
interface ActionMenuProps {
    Announcement: AnnouncementResponse;
    onEdit: (Announcement: AnnouncementResponse) => void;
    onDelete: (id: string) => void;
    // onView: (Invoice: InvoiceResponse) => void;
    canEdit?: boolean;
    canDelete?: boolean;
}

const ActionMenu = ({ Announcement, onEdit, onDelete, canEdit = true, canDelete = true }: ActionMenuProps) => {
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
                        onClick={() => { onEdit(Announcement); setOpen(false) }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                        <Edit size={14} /> Edit
                    </button>}
                    {canDelete && <button
                        onClick={() => { onDelete(Announcement.id); setOpen(false) }}
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

const AllAnnouncementForm = () => {
    const { menuStatus } = usePermissions()
    const { canAdd, canEdit, canDelete } = useMenuPermissionData(menuStatus)

    const [openFilter, setOpenFilter] = useState(false)
    const [addModal, setAddModal] = useState(false);



    const [selectedCouncelorId, setSelectedAnnouncementId] = useState<string | null>(null)

    const [selectedAnnouncementTitle, setSelectedAnnouncementTitle] = useState<string | null>(
        ""
    );

    const publishAnnouncement = usePublishAnnouncement();
    const unPublishAnnouncement = useUnPublishAnnouncement();
    const pinAnnouncement = usePinAnnouncement();
    const unPinAnnouncement = useUnPinAnnouncement();


    const [showEditModal, setShowEditModal] = useState(false)
    const [editAnnouncementId, setEditAnnouncementId] = useState<string | null>(null)

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deleteAnnouncementId, setDeleteAnnouncementId] = useState<string | null>(null)

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

    const { data, isLoading, error, refetch } = useGetAllAnnouncement(params)
    const deleteAnnouncement = useDeleteAnnouncement()
    const AnnouncementDetails = data?.items ?? [];
    const totalPages = data?.pagination?.totalPages ?? 1;


    const onFilterSubmit = async (formData: FilterFormData) => {
        const queryParams = [
            formData.title ? `name=${encodeURIComponent(formData.title)}` : null,
            formData.startDate ? `startDate=${encodeURIComponent(formData.startDate)}` : null,
            formData.endDate ? `endDate=${encodeURIComponent(formData.endDate)}` : null,
        ]
            .filter(Boolean)
            .join('&')

        const fullQuery = queryParams ? `&${queryParams}` : ''
        setParams(fullQuery)
    }


    const handleEditAnnouncement = (Announcement: AnnouncementResponse) => {
        setEditAnnouncementId(Announcement.id)
        setShowEditModal(true)
    }

    const handleDeleteAnnouncement = (id: string) => {
        setDeleteAnnouncementId(id)
        setShowDeleteModal(true)
    }


    const onDelete = async (id: string) => {
        try {
            await deleteAnnouncement.mutateAsync(id)
        } catch (error) {
            console.error(error)
        }
    }

    const handleTogglePublish = async (announcement: AnnouncementResponse) => {
        try {
            await toast.promise(
                (async () => {
                    if (announcement.publishStatus === 1) {
                        publishAnnouncement.mutateAsync({ announcementId: announcement.id as string });
                    } else {
                        unPublishAnnouncement.mutateAsync({ announcementId: announcement.id as string });
                    }
                    await refetch();
                })(),
                {
                    loading:
                        announcement.publishStatus === 0 ? "Unpublishing..." : "Publishing...",
                    success:
                        announcement.publishStatus === 0
                            ? "Announcement unpublished"
                            : "Announcement published",
                    error: "Failed to update publish status",
                }
            );
        } catch (error) {
            const errorMsg = handleError(error);
        }
    };



    const handleTogglePin = async (announcement: AnnouncementResponse) => {
        try {
            await toast.promise(
                (async () => {
                    if (announcement.isPinned === 1) {
                        await unPinAnnouncement.mutateAsync({
                            announcementId: announcement.id,
                        });
                    } else {
                        await pinAnnouncement.mutateAsync({
                            announcementId: announcement.id,
                        });
                    }
                })(),
                {
                    loading: announcement.isPinned === 1
                        ? "Unpinning..."
                        : "Pinning...",
                    success: announcement.isPinned === 1
                        ? "Announcement unpinned"
                        : "Announcement pinned",
                    error: "Failed to update pin status",
                }
            );
        } catch (error) {
            // Toast.error(handleError(error));
        }
    };

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
                            Error loading Announcement
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
                        <h1 className="text-xl font-semibold dark:text-white">All Announcement</h1>
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
                                text="Add Announcement"
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
                                        value={selectedAnnouncementTitle}
                                        dropDownWidth="w-full"
                                        dropdownPositionClass="absolute"
                                        label="Title"
                                        name="title"
                                        form={form}
                                        options={AnnouncementDetails}
                                        selected={
                                            AnnouncementDetails?.find(
                                                (g: AnnouncementResponse) => g.title === selectedAnnouncementTitle
                                            ) || null
                                        }
                                        onSelect={(group) => {
                                            if (group) {
                                                setSelectedAnnouncementTitle(group.title || null);
                                            } else {
                                                setSelectedAnnouncementTitle(null);
                                            }
                                        }}
                                        getLabel={(g) => g?.title ?? ""}
                                        getValue={(g) => g?.id ?? ""}
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
                                        <th className="px-4 py-3 text-left">Title</th>
                                        <th className="px-4 py-3 text-left">Descriptions</th>
                                        <th className="px-4 py-3 text-left">AnnouncementPriority</th>

                                        <th className="px-4 py-3 text-left hidden md:table-cell">Publish Status</th>

                                        <th className="px-4 py-3 text-left hidden md:table-cell">Pin Status</th>

                                        <th className="px-4 py-3 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {AnnouncementDetails.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={8}
                                                className="p-4 text-center italic text-gray-500 dark:text-gray-400"
                                            >
                                                No Appointments found.
                                            </td>
                                        </tr>
                                    ) : (
                                        AnnouncementDetails.map((Announcement: AnnouncementResponse, index: number) => (
                                            <tr
                                                key={Announcement.id}
                                                className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2a2b2e] transition-colors"
                                            >
                                                <td className="px-4 py-3 text-gray-500">
                                                    {(currentPage - 1) * pageSize + index + 1}
                                                </td>

                                                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">
                                                    {Announcement.title}
                                                </td>

                                                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">

                                                    {Announcement.description}
                                                </td>

                                                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">

                                                    {Announcement.announcementPriority}
                                                </td>

                                                <td className="px-6 py-2">
                                                    <div className="flex items-center gap-3">
                                                        <span
                                                            className={`text-xs font-medium ${Announcement.publishStatus === 1
                                                                ? "text-gray-500"
                                                                : "text-emerald-600"
                                                                }`}
                                                        >
                                                            Unpublished
                                                        </span>
                                                        <button
                                                            onClick={() => handleTogglePublish(Announcement)}
                                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${Announcement.publishStatus === 0
                                                                ? "bg-emerald-600"
                                                                : "bg-gray-300 dark:bg-gray-600"
                                                                }`}
                                                        >
                                                            <span
                                                                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${Announcement.publishStatus === 0
                                                                    ? "translate-x-5"
                                                                    : "translate-x-1"
                                                                    }`}
                                                            />
                                                        </button>
                                                        <span
                                                            className={`text-xs font-medium ${Announcement.publishStatus === 0
                                                                ? "text-emerald-600"
                                                                : "text-gray-500"
                                                                }`}
                                                        >
                                                            Published
                                                        </span>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-2">
                                                    <div className="flex items-center gap-3">
                                                        {/* UnPinned */}
                                                        <span
                                                            className={`text-xs font-medium ${Announcement.isPinned === 0
                                                                ? "text-emerald-600"
                                                                : "text-gray-500"
                                                                }`}
                                                        >
                                                            UnPinned
                                                        </span>

                                                        {/* Toggle */}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleTogglePin(Announcement)}
                                                            className={`relative h-6 w-11 rounded-full transition-colors duration-300 ${Announcement.isPinned === 1
                                                                ? "bg-emerald-600"
                                                                : "bg-gray-300 dark:bg-gray-600"
                                                                }`}
                                                        >
                                                            <span
                                                                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-300 ${Announcement.isPinned === 1
                                                                    ? "left-[22px]"
                                                                    : "left-[2px]"
                                                                    }`}
                                                            />
                                                        </button>

                                                        {/* Pinned */}
                                                        <span
                                                            className={`text-xs font-medium ${Announcement.isPinned === 1
                                                                ? "text-emerald-600"
                                                                : "text-gray-500"
                                                                }`}
                                                        >
                                                            Pinned
                                                        </span>
                                                    </div>
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
                                                        </Tooltip> */}

                                                        <ActionMenu
                                                            Announcement={Announcement}
                                                            onEdit={handleEditAnnouncement}
                                                            onDelete={handleDeleteAnnouncement}
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
                {AnnouncementDetails.length > 0 && totalPages > 1 && (
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



            {showDeleteModal && deleteAnnouncementId && (

                <DeleteComponents
                    visible={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={onDelete}
                    id={deleteAnnouncementId}
                    title="Delete Announcement"
                    description="Are you sure you want to delete this Announcement?"
                />

            )}

            {showEditModal && editAnnouncementId && (

                <EditAnnouncement
                    AnnouncementId={editAnnouncementId}
                    visible={showEditModal}
                    onClose={() => setShowEditModal(false)}

                />
            )}

            <AddAnnouncement
                visible={addModal}
                onClose={handleAddSubmit}
            />
        </>
    )
}

export default AllAnnouncementForm