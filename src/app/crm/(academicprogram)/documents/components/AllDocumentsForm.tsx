'use client'

import { useMemo, useRef, useState } from 'react'
import {
    AlertTriangle,
    BookOpen,
    CheckCircle2,
    Clock3,
    Edit,
    Eye,
    FileText,
    Filter,
    MoreVertical,
    ReceiptIndianRupeeIcon,
    Trash,
    XCircle,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Toaster } from 'react-hot-toast'
import Pagination from '@/components/Pagination'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import DateRangeFilter, {
    DateRangeFilterRef,
} from '@/components/DateFilter/FilterComponent'
import { useDeleteDocuments, useGetAllDocuments } from '../hooks'
import { DocumentsResponse } from '../types/IDocuments'
import DeleteOverlapComponents from '@/components/DeleteComponent/DeleteOverlapComponents'
import EditDocuments from '../pages/Edit'

interface FilterFormData {
    startDate: string
    endDate: string
}

interface DocumentsModalProps {
    isOpen: boolean
    onClose: () => void
    ApplicantId: string | null
}

/* =========================================================
   FILE URL HELPER
   ========================================================= */

const getFileUrl = (filePath?: string | null): string | null => {
    if (!filePath) {
        return null
    }

    const apiBaseUrl = (
        process.env.NEXT_PUBLIC_API_URL ?? ''
    )
        // Remove accidental Swagger path
        .replace(/\/swagger\/index\.html\/?$/i, '')
        // Remove trailing slash
        .replace(/\/+$/, '')

    if (!apiBaseUrl) {
        return null
    }

    const cleanFilePath = filePath.replace(/^\/+/, '')

    return `${apiBaseUrl}/${cleanFilePath}`
}

/* =========================================================
   FILE TYPE HELPERS
   ========================================================= */

const isImageFile = (filePath?: string | null): boolean => {
    if (!filePath) return false

    return /\.(jpg|jpeg|png|gif|webp)$/i.test(filePath)
}

const isPdfFile = (filePath?: string | null): boolean => {
    if (!filePath) return false

    return /\.pdf$/i.test(filePath)
}

const isOfficeFile = (filePath?: string | null): boolean => {
    if (!filePath) return false

    return /\.(doc|docx|xls|xlsx|ppt|pptx)$/i.test(filePath)
}

/* =========================================================
   FILE LABEL
   ========================================================= */

const getFileLabel = (filePath?: string | null): string => {
    if (!filePath) {
        return 'Open File'
    }

    if (isPdfFile(filePath)) {
        return 'View PDF'
    }

    if (/\.(doc|docx)$/i.test(filePath)) {
        return 'View Word'
    }

    if (/\.(xls|xlsx)$/i.test(filePath)) {
        return 'View Excel'
    }

    if (/\.(ppt|pptx)$/i.test(filePath)) {
        return 'View PowerPoint'
    }

    return 'Open File'
}

/* =========================================================
   FILE ICON
   ========================================================= */

const getFileIcon = (filePath?: string | null): string => {
    if (!filePath) {
        return '📁'
    }

    if (isPdfFile(filePath)) {
        return '📄'
    }

    if (/\.(doc|docx)$/i.test(filePath)) {
        return '📝'
    }

    if (/\.(xls|xlsx)$/i.test(filePath)) {
        return '📊'
    }

    if (/\.(ppt|pptx)$/i.test(filePath)) {
        return '📑'
    }

    return '📁'
}

/* =========================================================
   OPEN DOCUMENT
   ========================================================= */

const openDocument = (filePath?: string | null) => {
    const fileUrl = getFileUrl(filePath)

    if (!fileUrl) {
        return
    }

    /*
     * PDF
     * Open directly
     */
    if (isPdfFile(filePath)) {
        window.open(
            fileUrl,
            '_blank',
            'noopener,noreferrer'
        )

        return
    }

    /*
     * Word / Excel / PowerPoint
     *
     * Use Google Docs Viewer
     */
    if (isOfficeFile(filePath)) {
        const googleViewerUrl =
            `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`

        window.open(
            googleViewerUrl,
            '_blank',
            'noopener,noreferrer'
        )

        return
    }

    /*
     * Other files
     */
    window.open(
        fileUrl,
        '_blank',
        'noopener,noreferrer'
    )
}

/* =========================================================
   ACTION MENU
   ========================================================= */

interface ActionMenuProps {
    Documents: DocumentsResponse
    onEdit: (Documents: DocumentsResponse) => void
    onDelete: (id: string) => void
    canEdit?: boolean
    canDelete?: boolean
}

const ActionMenu = ({
    Documents,
    onEdit,
    onDelete,
    canEdit = true,
    canDelete = true,
}: ActionMenuProps) => {
    const [open, setOpen] = useState(false)

    const fileUrl = getFileUrl(Documents?.docLink)

    /* =====================================================
       DOWNLOAD
       ===================================================== */

    const handleDownload = async () => {
        if (!fileUrl) {
            return
        }

        try {
            const response = await fetch(fileUrl, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })

            if (!response.ok) {
                throw new Error(
                    `Download failed with status ${response.status}`
                )
            }

            const blob = await response.blob()

            const downloadUrl =
                window.URL.createObjectURL(blob)

            const anchor =
                document.createElement('a')

            anchor.href = downloadUrl

            /*
             * Get filename from docLink
             */
            const fileName =
                Documents.docLink
                    ?.split('/')
                    .pop()
                    ?.split('?')[0] ||
                'document'

            anchor.download = fileName

            document.body.appendChild(anchor)

            anchor.click()

            anchor.remove()

            window.URL.revokeObjectURL(downloadUrl)
        } catch (error) {
            console.error(
                'Download failed:',
                error
            )
        }
    }

    /* =====================================================
       VIEW
       ===================================================== */

    const handleView = () => {
        openDocument(Documents.docLink)
    }

    return (
        <div className="relative inline-block">

            {/* BUTTON */}

            <button
                type="button"
                onClick={() =>
                    setOpen((previous) => !previous)
                }
                className="
                    p-1
                    rounded-full
                    hover:bg-gray-100
                    dark:hover:bg-gray-700
                "
            >
                <MoreVertical size={18} />
            </button>

            {/* DROPDOWN */}

            {open && (
                <>
                    {/* OUTSIDE CLICK */}

                    <div
                        className="fixed inset-0 z-40"
                        onClick={() =>
                            setOpen(false)
                        }
                    />

                    <div
                        className="
                            absolute
                            right-0
                            mt-2
                            w-44
                            bg-white
                            dark:bg-gray-800
                            border
                            border-gray-200
                            dark:border-gray-700
                            rounded-md
                            shadow-lg
                            z-50
                        "
                    >

                        {/* VIEW */}

                        <button
                            type="button"
                            onClick={() => {
                                handleView()
                                setOpen(false)
                            }}
                            className="
                                w-full
                                px-3
                                py-2
                                text-left
                                flex
                                items-center
                                gap-2
                                hover:bg-gray-100
                                dark:hover:bg-gray-700
                            "
                        >
                            <Eye
                                size={14}
                                className="shrink-0"
                            />

                            <span className="text-sm">
                                View
                            </span>
                        </button>

                        {/* DOWNLOAD */}

                        <button
                            type="button"
                            onClick={() => {
                                handleDownload()
                                setOpen(false)
                            }}
                            className="
                                w-full
                                px-3
                                py-2
                                text-left
                                flex
                                items-center
                                gap-2
                                hover:bg-gray-100
                                dark:hover:bg-gray-700
                            "
                        >
                            <ReceiptIndianRupeeIcon
                                size={14}
                                className="shrink-0"
                            />

                            <span className="text-sm">
                                Download
                            </span>
                        </button>

                        {/* EDIT */}

                        {canEdit && (
                            <button
                                type="button"
                                onClick={() => {
                                    onEdit(Documents)
                                    setOpen(false)
                                }}
                                className="
                                    w-full
                                    px-3
                                    py-2
                                    text-left
                                    flex
                                    items-center
                                    gap-2
                                    hover:bg-gray-100
                                    dark:hover:bg-gray-700
                                "
                            >
                                <Edit
                                    size={14}
                                    className="shrink-0"
                                />

                                <span className="text-sm">
                                    Edit
                                </span>
                            </button>
                        )}

                        {/* DELETE */}

                        {canDelete && (
                            <button
                                type="button"
                                onClick={() => {
                                    onDelete(
                                        Documents.id
                                    )

                                    setOpen(false)
                                }}
                                className="
                                    w-full
                                    px-3
                                    py-2
                                    text-left
                                    flex
                                    items-center
                                    gap-2
                                    text-red-600
                                    hover:bg-gray-100
                                    dark:hover:bg-gray-700
                                "
                            >
                                <Trash
                                    size={14}
                                    className="shrink-0"
                                />

                                <span className="text-sm">
                                    Delete
                                </span>
                            </button>
                        )}

                    </div>
                </>
            )}

        </div>
    )
}

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export const AllDocumentsForm = ({
    isOpen,
    onClose,
    ApplicantId,
}: DocumentsModalProps) => {

    /* =====================================================
       STATE
       ===================================================== */

    const [openFilter, setOpenFilter] =
        useState(false)

    const [previewImage, setPreviewImage] =
        useState<string | null>(null)

    const [showEditModal, setShowEditModal] =
        useState(false)

    const [editDocumentsId, setEditDocumentsId] =
        useState<string | null>(null)

    const [showDeleteModal, setShowDeleteModal] =
        useState(false)

    const [deleteDocumentsId, setDeleteDocumentsId] =
        useState<string | null>(null)

    const [params, setParams] =
        useState<string>('')

    const [currentPage, setCurrentPage] =
        useState(1)

    const pageSize = 10

    /* =====================================================
       FILTER
       ===================================================== */

    const formRef =
        useRef<DateRangeFilterRef>(null)

    const filterForm =
        useForm<FilterFormData>({
            defaultValues: {
                startDate: '',
                endDate: '',
            },
        })

    /* =====================================================
       PAGINATION FORM
       ===================================================== */

    const paginationForm =
        useForm({
            defaultValues: {
                pageSize,
                pageIndex: currentPage,
                isPagination: true,
            },
        })

    /* =====================================================
       QUERY PARAMS
       ===================================================== */

    const queryParams = useMemo(() => {
        const base =
            new URLSearchParams(params)

        if (ApplicantId) {
            base.set(
                'ApplicantId',
                ApplicantId
            )
        }

        base.set(
            'pageIndex',
            String(currentPage)
        )

        base.set(
            'pageSize',
            String(pageSize)
        )

        base.set(
            'isPagination',
            'true'
        )

        return base.toString()
    }, [
        params,
        ApplicantId,
        currentPage,
    ])

    /* =====================================================
       GET DOCUMENTS
       ===================================================== */

    const {
        data,
        isLoading,
        error,
    } = useGetAllDocuments(
        queryParams,
        isOpen && !!ApplicantId
    )

    const DocumentsDetails =
        data?.items ?? []

    const totalPages =
        data?.pagination?.totalPages ?? 1

    /* =====================================================
       DELETE
       ===================================================== */

    const deleteDocuments =
        useDeleteDocuments()

    /* =====================================================
       FILTER SUBMIT
       ===================================================== */

    const onFilterSubmit = (
        formData: FilterFormData
    ) => {

        setCurrentPage(1)

        const newParams =
            new URLSearchParams()

        if (formData.startDate) {
            newParams.set(
                'startDate',
                formData.startDate
            )
        }

        if (formData.endDate) {
            newParams.set(
                'endDate',
                formData.endDate
            )
        }

        setParams(
            newParams.toString()
        )
    }

    /* =====================================================
       CLEAR FILTERS
       ===================================================== */

    const clearFilters = () => {
        filterForm.reset()

        setParams('')

        setCurrentPage(1)
    }

    /* =====================================================
       STATUS
       ===================================================== */

    const documentsStatusTypes = [
        {
            id: 1,
            name: 'Pending',
        },
        {
            id: 2,
            name: 'Approved',
        },
        {
            id: 3,
            name: 'Rejected',
        },
        {
            id: 4,
            name: 'ActionRequired',
        },
    ]

    const statusIcons = {
        1: Clock3,
        2: CheckCircle2,
        3: XCircle,
        4: AlertTriangle,
    }

    /* =====================================================
       EDIT
       ===================================================== */

    const handleEditDocuments = (
        Documents: DocumentsResponse
    ) => {

        setEditDocumentsId(
            Documents.id
        )

        setShowEditModal(true)
    }

    /* =====================================================
       DELETE MODAL
       ===================================================== */

    const handleDeleteDocuments = (
        id: string
    ) => {

        setDeleteDocumentsId(id)

        setShowDeleteModal(true)
    }

    /* =====================================================
       DELETE CONFIRM
       ===================================================== */

    const onDelete = async (
        id: string
    ) => {

        try {
            await deleteDocuments.mutateAsync(
                id
            )

            setShowDeleteModal(false)

            setDeleteDocumentsId(null)
        } catch (error) {
            console.error(
                'Delete document failed:',
                error
            )
        }
    }

    /* =====================================================
       ERROR
       ===================================================== */

    if (error) {
        return (
            <div className="p-4 sm:p-6">

                <Toaster
                    position="top-right"
                />

                <div
                    className="
                        bg-white
                        dark:bg-[#353535]
                        border
                        border-gray-200
                        dark:border-gray-700
                        rounded-xl
                        shadow-sm
                        p-8
                    "
                >
                    <div className="text-center py-16">

                        <BookOpen
                            size={64}
                            className="
                                mx-auto
                                text-red-400
                                mb-4
                            "
                        />

                        <h3
                            className="
                                text-xl
                                font-medium
                                text-gray-900
                                dark:text-white
                                mb-2
                            "
                        >
                            Error loading Documents
                        </h3>

                        <p
                            className="
                                text-gray-500
                                dark:text-gray-400
                            "
                        >
                            Please try again later.
                        </p>

                    </div>
                </div>
            </div>
        )
    }

    /* =====================================================
       LOADING
       ===================================================== */

    if (isLoading) {
        return (
            <div className="p-4 sm:p-6">

                <div
                    className="
                        bg-white
                        dark:bg-[#353535]
                        border
                        border-gray-200
                        dark:border-gray-700
                        rounded-xl
                        shadow-sm
                        p-8
                    "
                >

                    <div
                        className="
                            flex
                            justify-center
                            items-center
                            h-64
                        "
                    >
                        <div
                            className="
                                animate-spin
                                rounded-full
                                h-12
                                w-12
                                border-b-2
                                border-emerald-600
                            "
                        />
                    </div>

                </div>
            </div>
        )
    }

    /* =====================================================
       MAIN
       ===================================================== */

    return (
        <>
            <div
                className="
                    fixed
                    inset-0
                    z-50
                    flex
                    items-start
                    md:items-center
                    justify-center
                    bg-black/40
                    backdrop-blur-sm
                    ml-12
                    md:ml-64
                    sm:ml-16
                    xs:ml-0
                "
                onClick={onClose}
            >

                <div
                    className="
                        w-full
                        max-w-7xl
                        max-h-[92vh]
                        overflow-hidden
                        rounded-3xl
                        bg-white
                        dark:bg-[#252525]
                        shadow-2xl
                        border
                        border-gray-200
                        dark:border-gray-700
                    "
                    onClick={(event) =>
                        event.stopPropagation()
                    }
                >

                    <Toaster
                        position="top-right"
                    />

                    <div
                        className="
                            flex
                            flex-col
                            h-[92vh]
                        "
                    >

                        <div
                            className="
                                bg-white
                                dark:bg-[#353535]
                                border
                                border-gray-200
                                dark:border-gray-700
                                rounded-xl
                                shadow-sm
                                overflow-y-auto
                            "
                        >

                            {/* =================================================
                                HEADER
                            ================================================== */}

                            <div
                                className="
                                    flex
                                    w-full
                                    justify-between
                                    p-3
                                    px-4
                                    pt-4
                                    items-center
                                "
                            >

                                <h1
                                    className="
                                        text-xl
                                        font-semibold
                                        dark:text-white
                                    "
                                >
                                    All Documents
                                </h1>

                                <div
                                    className="
                                        flex
                                        items-center
                                        space-x-3
                                    "
                                >

                                    <ButtonElement
                                        type="button"
                                        text="Filter"
                                        icon={
                                            <Filter
                                                size={14}
                                            />
                                        }
                                        onClick={() =>
                                            setOpenFilter(
                                                (previous) =>
                                                    !previous
                                            )
                                        }
                                        className="
                                            !bg-emerald-600
                                            hover:!bg-emerald-700
                                        "
                                    />

                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="
                                            w-8
                                            h-8
                                            flex
                                            items-center
                                            justify-center
                                            rounded-full
                                            bg-red-500
                                            text-white
                                            hover:bg-red-600
                                            shadow
                                            ml-1
                                        "
                                        title="Close"
                                    >
                                        ✕
                                    </button>

                                </div>
                            </div>

                            {/* =================================================
                                FILTER
                            ================================================== */}

                            {openFilter && (
                                <div
                                    className="
                                        mb-6
                                        mx-4
                                        bg-white
                                        dark:bg-[#353535]
                                        p-5
                                        rounded-2xl
                                        shadow-sm
                                        border
                                        border-gray-200
                                        dark:border-gray-700
                                    "
                                >

                                    <DateRangeFilter
                                        ref={formRef}
                                        form={filterForm}
                                        onSubmit={
                                            onFilterSubmit
                                        }
                                        setParams={
                                            setParams
                                        }
                                        startDateKey="startDate"
                                        endDateKey="endDate"
                                    />

                                    {/* Optional clear button */}

                                    {(params ||
                                        filterForm.watch(
                                            'startDate'
                                        ) ||
                                        filterForm.watch(
                                            'endDate'
                                        )) && (
                                            <div className="mt-3">

                                                <button
                                                    type="button"
                                                    onClick={
                                                        clearFilters
                                                    }
                                                    className="
                                                    text-sm
                                                    text-red-600
                                                    hover:text-red-700
                                                    font-medium
                                                "
                                                >
                                                    Clear Filters
                                                </button>

                                            </div>
                                        )}

                                </div>
                            )}

                            {/* =================================================
                                DOCUMENT GRID
                            ================================================== */}

                            <div
                                className="
                                    grid
                                    grid-cols-1
                                    sm:grid-cols-2
                                    lg:grid-cols-3
                                    gap-4
                                "
                            >

                                {DocumentsDetails.length ===
                                    0 ? (
                                    <div
                                        className="
                                            col-span-full
                                            text-center
                                            py-10
                                            text-gray-500
                                            dark:text-gray-400
                                        "
                                    >
                                        No Documents found.
                                    </div>
                                ) : (
                                    DocumentsDetails.map(
                                        (
                                            doc,
                                            index
                                        ) => {

                                            const fileUrl =
                                                getFileUrl(
                                                    doc.docLink
                                                )

                                            const isImage =
                                                isImageFile(
                                                    doc.docLink
                                                )

                                            const status =
                                                documentsStatusTypes.find(
                                                    (item) =>
                                                        item.id ===
                                                        doc.documentStatus
                                                )

                                            const StatusIcon =
                                                statusIcons[
                                                doc.documentStatus as keyof typeof statusIcons
                                                ]

                                            return (
                                                <div
                                                    key={
                                                        doc.id
                                                    }
                                                    className="
                                                        m-5
                                                        group
                                                        bg-white
                                                        dark:bg-[#2a2b2e]
                                                        border
                                                        border-gray-200
                                                        dark:border-gray-700
                                                        rounded-xl
                                                        p-4
                                                        shadow-sm
                                                        hover:shadow-md
                                                        transition-all
                                                        duration-200
                                                        hover:-translate-y-1
                                                    "
                                                >

                                                    {/* =================================================
                                                        CARD HEADER
                                                    ================================================== */}

                                                    <div
                                                        className="
                                                            flex
                                                            justify-between
                                                            items-start
                                                            mb-3
                                                        "
                                                    >

                                                        {/* S.N */}

                                                        <span
                                                            className="
                                                                text-xs
                                                                px-2
                                                                py-1
                                                                rounded-md
                                                                bg-gray-100
                                                                dark:bg-gray-700
                                                                text-gray-600
                                                                dark:text-gray-300
                                                            "
                                                        >
                                                            #
                                                            {(
                                                                currentPage -
                                                                1
                                                            ) *
                                                                pageSize +
                                                                index +
                                                                1}
                                                        </span>

                                                        {/* ACTION MENU */}

                                                        <ActionMenu
                                                            Documents={
                                                                doc
                                                            }
                                                            onEdit={
                                                                handleEditDocuments
                                                            }
                                                            onDelete={
                                                                handleDeleteDocuments
                                                            }
                                                            canEdit={
                                                                true
                                                            }
                                                            canDelete={
                                                                true
                                                            }
                                                        />

                                                    </div>

                                                    {/* =================================================
                                                        DOCUMENT PREVIEW
                                                    ================================================== */}

                                                    <div className="mb-3">

                                                        {doc.docLink ? (

                                                            <div
                                                                className="
                                                                    w-full
                                                                    h-40
                                                                    rounded-lg
                                                                    overflow-hidden
                                                                    border
                                                                    border-gray-200
                                                                    dark:border-gray-700
                                                                "
                                                            >

                                                                {isImage &&
                                                                    fileUrl ? (

                                                                    /*
                                                                     * IMAGE
                                                                     *
                                                                     * Example:
                                                                     *
                                                                     * https://elitespacenepal.premiumasp.net/Images/...
                                                                     *
                                                                     * NOT:
                                                                     *
                                                                     * https://elitespacenepal.premiumasp.net/swagger/index.html/Images/...
                                                                     */

                                                                    <img
                                                                        src={
                                                                            fileUrl
                                                                        }
                                                                        alt={
                                                                            doc.docmentTypeName ||
                                                                            'Document'
                                                                        }
                                                                        onClick={() =>
                                                                            setPreviewImage(
                                                                                fileUrl
                                                                            )
                                                                        }
                                                                        onError={(
                                                                            event
                                                                        ) => {
                                                                            console.error(
                                                                                'Failed to load document image:',
                                                                                fileUrl
                                                                            )

                                                                            event.currentTarget.style.display =
                                                                                'none'
                                                                        }}
                                                                        className="
                                                                            w-full
                                                                            h-full
                                                                            object-cover
                                                                            cursor-pointer
                                                                            hover:scale-105
                                                                            transition-transform
                                                                            duration-300
                                                                        "
                                                                    />

                                                                ) : (

                                                                    /*
                                                                     * NON IMAGE FILE
                                                                     */

                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            openDocument(
                                                                                doc.docLink
                                                                            )
                                                                        }
                                                                        className="
                                                                            w-full
                                                                            h-full
                                                                            flex
                                                                            flex-col
                                                                            items-center
                                                                            justify-center
                                                                            bg-gray-50
                                                                            dark:bg-gray-800
                                                                            cursor-pointer
                                                                            hover:bg-gray-100
                                                                            dark:hover:bg-gray-700
                                                                            transition-colors
                                                                        "
                                                                    >

                                                                        <span className="text-5xl">
                                                                            {getFileIcon(
                                                                                doc.docLink
                                                                            )}
                                                                        </span>

                                                                        <span
                                                                            className="
                                                                                mt-2
                                                                                text-sm
                                                                                font-medium
                                                                                text-gray-700
                                                                                dark:text-gray-200
                                                                            "
                                                                        >
                                                                            {getFileLabel(
                                                                                doc.docLink
                                                                            )}
                                                                        </span>

                                                                    </button>
                                                                )}

                                                            </div>

                                                        ) : (

                                                            /*
                                                             * NO FILE
                                                             */

                                                            <div
                                                                className="
                                                                    w-full
                                                                    h-40
                                                                    rounded-lg
                                                                    border
                                                                    border-gray-200
                                                                    dark:border-gray-700
                                                                    bg-gray-50
                                                                    dark:bg-gray-800
                                                                    flex
                                                                    items-center
                                                                    justify-center
                                                                    text-gray-500
                                                                    font-semibold
                                                                "
                                                            >
                                                                {
                                                                    doc.docmentTypeName?.charAt(
                                                                        0
                                                                    ) ?? 'D'
                                                                }
                                                            </div>
                                                        )}

                                                    </div>

                                                    {/* =================================================
                                                        DOCUMENT INFORMATION
                                                    ================================================== */}

                                                    <div className="space-y-2">

                                                        {/* DOCUMENT TYPE */}

                                                        <div
                                                            className="
                                                                flex
                                                                items-center
                                                                gap-2
                                                            "
                                                        >

                                                            <FileText
                                                                size={
                                                                    18
                                                                }
                                                                className="
                                                                    text-blue-500
                                                                    shrink-0
                                                                "
                                                            />

                                                            <h3
                                                                className="
                                                                    text-base
                                                                    font-semibold
                                                                    text-gray-800
                                                                    dark:text-white
                                                                    truncate
                                                                "
                                                                title={
                                                                    doc.docmentTypeName
                                                                }
                                                            >
                                                                {
                                                                    doc.docmentTypeName
                                                                }
                                                            </h3>

                                                        </div>

                                                        {/* STATUS */}

                                                        <span
                                                            className={`
                                                                inline-flex
                                                                items-center
                                                                gap-1.5
                                                                text-sm
                                                                px-3
                                                                py-1.5
                                                                rounded-full
                                                                font-medium

                                                                ${doc.documentStatus ===
                                                                    1
                                                                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                                    : doc.documentStatus ===
                                                                        2
                                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                                        : doc.documentStatus ===
                                                                            3
                                                                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                                            : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                                                }
                                                            `}
                                                        >

                                                            {StatusIcon && (
                                                                <StatusIcon
                                                                    size={
                                                                        16
                                                                    }
                                                                />
                                                            )}

                                                            {
                                                                status?.name
                                                            }

                                                        </span>

                                                    </div>

                                                </div>
                                            )
                                        }
                                    )
                                )}

                            </div>

                        </div>

                        {/* =================================================
                            PAGINATION
                        ================================================== */}

                        {DocumentsDetails.length >
                            0 &&
                            totalPages > 1 && (
                                <div className="mt-4">

                                    <Pagination
                                        form={
                                            paginationForm
                                        }
                                        pagination={{
                                            currentPage,
                                            firstPage: 1,
                                            lastPage:
                                                totalPages,
                                            nextPage:
                                                currentPage <
                                                    totalPages
                                                    ? currentPage +
                                                    1
                                                    : currentPage,
                                            previousPage:
                                                currentPage >
                                                    1
                                                    ? currentPage -
                                                    1
                                                    : 1,
                                        }}
                                        handleSearch={(
                                            pagination
                                        ) =>
                                            setCurrentPage(
                                                pagination.pageIndex
                                            )
                                        }
                                    />

                                </div>
                            )}

                    </div>

                    {/* =================================================
                        DELETE MODAL
                    ================================================== */}

                    {showDeleteModal &&
                        deleteDocumentsId && (
                            <DeleteOverlapComponents
                                visible={
                                    showDeleteModal
                                }
                                onClose={() => {
                                    setShowDeleteModal(
                                        false
                                    )

                                    setDeleteDocumentsId(
                                        null
                                    )
                                }}
                                onConfirm={
                                    onDelete
                                }
                                id={
                                    deleteDocumentsId
                                }
                                title="Delete Documents"
                                description="
                                    Are you sure you want to
                                    delete this Documents?
                                "
                            />
                        )}

                    {/* =================================================
                        EDIT MODAL
                    ================================================== */}

                    {showEditModal &&
                        editDocumentsId && (
                            <EditDocuments
                                DocumentsId={
                                    editDocumentsId
                                }
                                visible={
                                    showEditModal
                                }
                                onClose={() => {
                                    setShowEditModal(
                                        false
                                    )

                                    setEditDocumentsId(
                                        null
                                    )
                                }}
                            />
                        )}

                    {/* =================================================
                        IMAGE PREVIEW
                    ================================================== */}

                    {previewImage && (
                        <div
                            className="
                                fixed
                                inset-0
                                z-[60]
                                flex
                                items-center
                                justify-center
                                bg-black/80
                                p-4
                            "
                            onClick={() =>
                                setPreviewImage(null)
                            }
                        >

                            <div
                                className="
                                    relative
                                    max-w-6xl
                                    max-h-[95vh]
                                "
                                onClick={(event) =>
                                    event.stopPropagation()
                                }
                            >

                                {/* CLOSE */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        setPreviewImage(
                                            null
                                        )
                                    }
                                    className="
                                        absolute
                                        -top-3
                                        -right-3
                                        z-10
                                        bg-red-600
                                        hover:bg-red-700
                                        text-white
                                        w-8
                                        h-8
                                        rounded-full
                                        flex
                                        items-center
                                        justify-center
                                        shadow-lg
                                    "
                                >
                                    ✕
                                </button>

                                {/* IMAGE */}

                                <img
                                    src={
                                        previewImage
                                    }
                                    alt="Document preview"
                                    className="
                                        max-w-full
                                        max-h-[90vh]
                                        rounded-lg
                                        shadow-lg
                                        object-contain
                                    "
                                />

                            </div>

                        </div>
                    )}

                </div>

            </div>
        </>
    )
}