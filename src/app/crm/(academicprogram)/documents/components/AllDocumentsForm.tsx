'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AlertTriangle, BookOpen, CheckCircle2, Clock3, Edit, Eye, FileText, Filter, MoreVertical, Plus, ReceiptIndianRupeeIcon, Trash, XCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'
import Pagination from '@/components/Pagination'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import DateRangeFilter, { DateRangeFilterRef } from '@/components/DateFilter/FilterComponent'
import { usePermissions } from '@/context/auth/PermissionContext'
import useMenuPermissionData from '@/app/SuperAdmin/navigation/hooks/useMenuPermissionData'
import { useDeleteDocuments, useGetAllDocuments } from '../hooks'
import { DocumentsResponse } from '../types/IDocuments'
import { Tooltip } from '@/components/ToolTip/Tooltip'
import AddAppointment from '../pages/Add'
import DeleteComponents from '@/components/DeleteComponent/DeleteComponents'
import EditAppointment from '../pages/Edit'
import EditDocuments from '../pages/Edit'
import AddDocuments from '../pages/Add'
import { api } from '@/utils/instance'
import DeleteOverlapComponents from '@/components/DeleteComponent/DeleteOverlapComponents'

interface FilterFormData {
    startDate: string
    endDate: string
}

interface DocumentsModalProps {
    isOpen: boolean;
    onClose: () => void;
    ApplicantId: string | null;
}

//#region ActionMenu
interface ActionMenuProps {
    Documents: DocumentsResponse;
    onEdit: (Documents: DocumentsResponse) => void;
    onDelete: (id: string) => void;
    // onView: (Invoice: InvoiceResponse) => void;
    canEdit?: boolean;
    canDelete?: boolean;
}

const ActionMenu = ({
    Documents,
    onEdit,
    onDelete,
    canEdit = true,
    canDelete = true,
}: ActionMenuProps) => {
    const [open, setOpen] = useState(false)

    const fileUrl = Documents?.docLink
        ? `${process.env.NEXT_PUBLIC_API_URL}/${Documents.docLink}`
        : null

    const handleDownload = async () => {
        if (!fileUrl) return

        try {
            const response = await fetch(fileUrl, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })

            if (!response.ok) throw new Error("Network error")

            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)

            const a = document.createElement("a")
            a.href = url
            a.download = fileUrl.split("/").pop() || "document"

            document.body.appendChild(a)
            a.click()
            a.remove()

            window.URL.revokeObjectURL(url)
        } catch (err) {
            console.error("Download failed:", err)
        }
    }



    const handleView = () => {
        if (!fileUrl) return
        window.open(fileUrl, "_blank")
    }

    return (
        <div className="relative inline-block">

            {/* BUTTON */}
            <button
                onClick={() => setOpen(prev => !prev)}
                type="button"
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
                <MoreVertical size={18} />
            </button>

            {/* DROPDOWN */}
            {open && (
                <>
                    {/* OUTSIDE CLICK */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setOpen(false)}
                    />

                    <div className="
                        absolute right-0 mt-2 w-44
                        bg-white dark:bg-gray-800
                        border border-gray-200 dark:border-gray-700
                        rounded-md shadow-lg
                        z-50
                    ">

                        {/* VIEW */}
                        <button
                            onClick={() => {
                                handleView()
                                setOpen(false)
                            }}
                            className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <Eye size={14} className="shrink-0" />
                            <span className="text-sm">View</span>
                        </button>

                        {/* DOWNLOAD */}
                        <button
                            onClick={() => {
                                handleDownload()
                                setOpen(false)
                            }}
                            className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <ReceiptIndianRupeeIcon size={14} className="shrink-0" />
                            <span className="text-sm">Download</span>
                        </button>

                        {/* EDIT */}
                        {canEdit && (
                            <button
                                onClick={() => {
                                    onEdit(Documents)
                                    setOpen(false)
                                }}
                                className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <Edit size={14} className="shrink-0" />
                                <span className="text-sm">Edit</span>
                            </button>
                        )}

                        {/* DELETE */}
                        {canDelete && (
                            <button
                                onClick={() => {
                                    onDelete(Documents.id)
                                    setOpen(false)
                                }}
                                className="w-full px-3 py-2 text-left flex items-center gap-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <Trash size={14} className="shrink-0" />
                                <span className="text-sm">Delete</span>
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

//#endregion

export const AllDocumentsForm = ({ isOpen, onClose, ApplicantId }: DocumentsModalProps) => {
    const { menuStatus } = usePermissions()
    const { canAdd, canEdit, canDelete } = useMenuPermissionData(menuStatus)
    const [openFilter, setOpenFilter] = useState(false)
    const [selectedCouncelorId, setSelectedDocumentsId] = useState<string | null>(null)

    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const [showEditModal, setShowEditModal] = useState(false)
    const [editDocumentsId, setEditDocumentsId] = useState<string | null>(null)

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deleteDocumentsId, setDeleteDocumentsId] = useState<string | null>(null)
    const [params, setParams] = useState<string>("")

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    // Filters
    const [filters, setFilters] = useState<FilterFormData>({
        startDate: "",
        endDate: "",
    });
    const formRef = useRef<DateRangeFilterRef>(null)


    const filterForm = useForm<FilterFormData>({
        defaultValues: {
            startDate: "",
            endDate: "",
        },
    });


    const paginationForm = useForm({
        defaultValues:
        {
            pageSize,
            pageIndex: currentPage,
            isPagination: true
        },
    })

    const queryParams = useMemo(() => {
        const base = new URLSearchParams(params)

        if (ApplicantId) {
            base.set("ApplicantId", ApplicantId)
        }

        base.set("pageIndex", String(currentPage))
        base.set("pageSize", String(pageSize))
        base.set("isPagination", "true")

        return base.toString()
    }, [params, ApplicantId, currentPage])


    const { data, isLoading, error } = useGetAllDocuments(queryParams, isOpen && !!ApplicantId)
    const DocumentsDetails = data?.items ?? [];


    const deleteDocuments = useDeleteDocuments()

    const totalPages = data?.pagination?.totalPages ?? 1;


    const onFilterSubmit = (formData: FilterFormData) => {
        setCurrentPage(1)

        setFilters({
            startDate: formData.startDate,
            endDate: formData.endDate,
        })

        const newParams = new URLSearchParams()

        if (formData.startDate) {
            newParams.set("startDate", formData.startDate)
        }

        if (formData.endDate) {
            newParams.set("endDate", formData.endDate)
        }

        setParams(newParams.toString())
    }

    const clearFilters = () => {
        filterForm.reset();

        setFilters({
            startDate: "",
            endDate: "",
        });

        setCurrentPage(1);
    };

    const documentsStatusTypes = [
        { id: 1, name: 'Pending' },
        { id: 2, name: 'Approved' },
        { id: 3, name: 'Rejected' },
        { id: 4, name: 'ActionRequired' }
    ];

    const statusIcons = {
        1: Clock3,         // Pending
        2: CheckCircle2,   // Approved
        3: XCircle,        // Rejected
        4: AlertTriangle,  // Action Required
    };


    const handleEditDocuments = (Documents: DocumentsResponse) => {
        setEditDocumentsId(Documents.id)
        setShowEditModal(true)
    }

    const handleDeleteDocuments = (id: string) => {
        setDeleteDocumentsId(id)
        setShowDeleteModal(true)
    }


    const onDelete = async (id: string) => {
        try {
            await deleteDocuments.mutateAsync(id)
        } catch (error) {
            console.error(error)
        }
    }

    // const handleView = async (Invoice: AppointmentResponse) => {
    //     setSelectedInvoiceId(Invoice.id)
    //     setShowInvoiceDetailModal(true)
    // }


    const handleAddSubmit = () => {
    };

    if (error) {
        return (
            <div className="p-4 sm:p-6">
                <Toaster position="top-right" />
                <div className="bg-white dark:bg-[#353535] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-8">
                    <div className="text-center py-16">
                        <BookOpen size={64} className="mx-auto text-red-400 mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                            Error loading Documents
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

            <div
                className="fixed inset-0 z-50 flex items-start md:items-center justify-center 
            bg-black/40 backdrop-blur-sm ml-12 md:ml-64 sm:ml-16 xs:ml-0"
                onClick={onClose}
            >

                <div
                    className="print-area font-mono w-full max-h-[95vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300"
                    onClick={(e) => e.stopPropagation()}
                >



                    <Toaster position="top-right" />
                    <div className="p-4 sm:p-6">
                        <div className="bg-white dark:bg-[#353535] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">

                            {/* Header */}
                            <div className="flex w-full justify-between p-3 px-4 pt-4 items-center">
                                <h1 className="text-xl font-semibold dark:text-white">All Documents</h1>
                                <div className="flex items-center space-x-3">
                                    <ButtonElement
                                        type="button"
                                        text="Filter"
                                        icon={<Filter size={14} />}
                                        onClick={() => setOpenFilter(!openFilter)}
                                        className="!bg-emerald-600 hover:!bg-emerald-700"
                                    />
                                    <button
                                        onClick={onClose}
                                        className="w-8 h-8 flex items-center justify-center rounded-full
                       bg-red-500 text-white hover:bg-red-600 shadow
                       ml-1"
                                        title="Close"
                                    >
                                        ✕
                                    </button>

                                </div>
                            </div>



                            {/* Filter Panel */}
                            {openFilter && (
                                <div className="mb-6 mx-4 bg-white dark:bg-[#353535] p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">

                                    <DateRangeFilter
                                        ref={formRef}
                                        form={filterForm}   // ✅ FIXED (was: form)
                                        onSubmit={onFilterSubmit}
                                        setParams={setParams}
                                        startDateKey="startDate"
                                        endDateKey="endDate"
                                    />

                                </div>
                            )}

                            {/* Table */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                                {DocumentsDetails.length === 0 ? (
                                    <div className="col-span-full text-center py-10 text-gray-500 dark:text-gray-400">
                                        No Documents found.
                                    </div>
                                ) : (
                                    DocumentsDetails.map((doc, index) => (
                                        <div
                                            key={doc.id}
                                            className="
                                                group bg-white dark:bg-[#2a2b2e]
                                                border border-gray-200 dark:border-gray-700
                                                rounded-xl p-4
                                                shadow-sm hover:shadow-md
                                                transition-all duration-200
                                                hover:-translate-y-1
                                            "
                                        >

                                            {/* Header */}
                                            <div className="flex justify-between items-start mb-3">

                                                {/* S.N */}
                                                <span className="text-xs px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                                    #{(currentPage - 1) * pageSize + index + 1}
                                                </span>

                                                {/* Actions */}
                                                <ActionMenu
                                                    Documents={doc}
                                                    onEdit={handleEditDocuments}
                                                    onDelete={handleDeleteDocuments}
                                                    canEdit={true}
                                                    canDelete={true}
                                                />
                                            </div>

                                            {/* Image */}
                                            <div className="mb-3">
                                                {doc.docLink ? (
                                                    <div className="w-full h-40 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                                                        <img
                                                            src={`${process.env.NEXT_PUBLIC_API_URL}/${doc.docLink}`}
                                                            alt="document"
                                                            onClick={() =>
                                                                setPreviewImage(
                                                                    `${process.env.NEXT_PUBLIC_API_URL}/${doc.docLink}`
                                                                )
                                                            }
                                                            className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-full h-40 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-500 font-semibold">
                                                        {doc.docmentTypeName?.charAt(0) ?? "D"}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="space-y-2">
                                                {/* Document Type */}
                                                <div className="flex items-center gap-2">
                                                    <FileText size={18} className="text-blue-500 shrink-0" />
                                                    <h3 className="text-base font-semibold text-gray-800 dark:text-white truncate">
                                                        {doc.docmentTypeName}
                                                    </h3>
                                                </div>

                                                {/* Status */}
                                                <span
                                                    className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full font-medium ${doc.documentStatus === 1
                                                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                                        : doc.documentStatus === 2
                                                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                            : doc.documentStatus === 3
                                                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                                : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                                                        }`}
                                                >
                                                    {(() => {
                                                        const status = documentsStatusTypes.find(
                                                            (i) => i.id === doc.documentStatus
                                                        );

                                                        const Icon =
                                                            statusIcons[doc.documentStatus as keyof typeof statusIcons];

                                                        return (
                                                            <>
                                                                {Icon && <Icon size={16} />}
                                                                {status?.name}
                                                            </>
                                                        );
                                                    })()}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}

                            </div>
                        </div>




                        {/* Pagination */}
                        {DocumentsDetails.length > 0 && totalPages > 1 && (
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



                    {showDeleteModal && deleteDocumentsId && (

                        <DeleteOverlapComponents
                            visible={showDeleteModal}
                            onClose={() => setShowDeleteModal(false)}
                            onConfirm={onDelete}
                            id={deleteDocumentsId}
                            title="Delete Documents"
                            description="Are you sure you want to delete this Documents?"
                        />

                    )}

                    {showEditModal && editDocumentsId && (

                        <EditDocuments
                            DocumentsId={editDocumentsId}
                            visible={showEditModal}
                            onClose={() => setShowEditModal(false)}

                        />
                    )}

                    {previewImage && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 cursor-default"
                            onClick={() => setPreviewImage(null)}
                        >
                            <div className="relative cursor-default">

                                {/* Close Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setPreviewImage(null);
                                    }}
                                    className="absolute -top-3 -right-3 bg-red-600 hover:bg-red-700 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
                                >
                                    ✕
                                </button>

                                {/* Image */}
                                <img
                                    src={previewImage}
                                    alt="preview"
                                    className="max-w-4xl max-h-[90vh] rounded-lg shadow-lg cursor-default"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        </div>
                    )}


                </div>




            </div>

        </>
    )
}