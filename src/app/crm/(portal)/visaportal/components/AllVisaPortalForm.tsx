
"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import {
    ArrowUpRight,
    Building2,
    Check,
    Clock3,
    Edit,
    ExternalLink,
    Filter,
    Globe2,
    Link2,
    MapPin,
    MoreVertical,
    Plus,
    RotateCcw,
    Trash2,
    X,
} from "lucide-react"
import { adToBs } from "@sbmdkl/nepali-date-converter"
import { useForm, useWatch, type SubmitHandler } from "react-hook-form"
import toast, { Toaster } from "react-hot-toast"

import { ButtonElement } from "@/components/Buttons/ButtonElement"
import DeleteComponents from "@/components/DeleteComponent/DeleteComponents"
import Pagination from "@/components/Pagination"
import { AppCombobox } from "@/components/Input/ComboBox"
import { InputElement } from "@/components/Input/InputElement"

import {
    useDeleteVisaPortal,
    useGetAllVisaPortal,
    useGetVisaPortalCountries,
    useGetVisaPortalUniversities,
} from "../hooks"

import type { VisaPortalResponse } from "../types/IVisaPortal"
import AddVisaPortal from "../pages/Add"
import EditVisaPortal from "../pages/Edit"

// ============================================================
// Three-Dot Action Menu
// ============================================================

type ActionMenuProps = {
    portal: VisaPortalResponse
    onEdit: (id: string) => void
    onDelete: (id: string) => void
}

const ActionMenu = ({
    portal,
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
        const menuHeight = 80
        const menuWidth = 180
        const gap = 6
        const margin = 8

        const openUpward =
            window.innerHeight - rect.bottom < menuHeight + gap + margin

        const right = Math.max(
            margin,
            Math.min(
                window.innerWidth - rect.right,
                window.innerWidth - menuWidth - margin
            )
        )

        setMenuStyle({
            position: "fixed",
            right,
            top: openUpward
                ? Math.max(margin, rect.top - menuHeight - gap)
                : Math.min(
                    window.innerHeight - menuHeight - margin,
                    rect.bottom + gap
                ),
            width: menuWidth,
            zIndex: 9999,
        })
    }, [])

    const toggleMenu = () => {
        if (!open) {
            calculatePosition()
        }

        setOpen((previous) => !previous)
    }

    useEffect(() => {
        if (!open) return

        const animation = menuRef.current?.animate(
            [
                { opacity: 0, transform: "translateY(-4px) scale(0.98)" },
                { opacity: 1, transform: "translateY(0) scale(1)" },
            ],
            {
                duration: 140,
                easing: "ease-out",
            }
        )

        const handleOutsideClick = (event: MouseEvent) => {
            const target = event.target as Node

            if (
                !menuRef.current?.contains(target) &&
                !buttonRef.current?.contains(target)
            ) {
                setOpen(false)
            }
        }

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setOpen(false)
            }
        }

        document.addEventListener("mousedown", handleOutsideClick)
        document.addEventListener("keydown", handleEscape)

        return () => {
            animation?.cancel()
            document.removeEventListener("mousedown", handleOutsideClick)
            document.removeEventListener("keydown", handleEscape)
        }
    }, [open])

    useEffect(() => {
        if (!open) return

        const reposition = () => calculatePosition()

        window.addEventListener("scroll", reposition, true)
        window.addEventListener("resize", reposition)

        return () => {
            window.removeEventListener("scroll", reposition, true)
            window.removeEventListener("resize", reposition)
        }
    }, [open, calculatePosition])

    return (
        <>
            <button
                ref={buttonRef}
                type="button"
                onClick={toggleMenu}
                aria-label={`Actions for ${portal.name}`}
                aria-haspopup="menu"
                aria-expanded={open}
                title="Actions"
                className="rounded-full p-1 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:hover:bg-gray-700"
            >
                <MoreVertical size={18} className="text-gray-600 dark:text-gray-300" />
            </button>

            {open &&
                typeof document !== "undefined" &&
                createPortal(
                    <div
                        ref={menuRef}
                        role="menu"
                        aria-label={`Actions for ${portal.name}`}
                        style={{ ...menuStyle, zIndex: 10000 }}
                        className="rounded-md border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
                    >
                        <button
                            type="button"
                            role="menuitem"
                            onClick={() => {
                                setOpen(false)
                                onEdit(portal.id)
                            }}
                            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-200 dark:hover:bg-gray-700 dark:focus-visible:bg-gray-700"
                        >
                            <Edit size={14} />
                            Edit
                        </button>

                        <button
                            type="button"
                            role="menuitem"
                            onClick={() => {
                                setOpen(false)
                                onDelete(portal.id)
                            }}
                            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-red-400 dark:hover:bg-gray-700 dark:focus-visible:bg-gray-700"
                        >
                            <Trash2 size={14} />
                            Delete
                        </button>
                    </div>,
                    document.body
                )}
        </>
    )
}

// ============================================================
// Filter Form
// ============================================================

type FilterFormData = {
    name: string
    countryId: string
    universityId: string
    startDate: string
    endDate: string
    pageSize: number
    pageIndex: number
    isPagination: boolean
}

type DatePreset = "yesterday" | "7days" | "month" | "year"

const formatDate = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`

// ============================================================
// Reusable Portal Card
// ============================================================

type VisaPortalCardProps = {
    portal: VisaPortalResponse
    onEdit: (id: string) => void
    onDelete: (id: string) => void
}

const VisaPortalCard = ({
    portal,
    onEdit,
    onDelete,
}: VisaPortalCardProps) => {
    const [copied, setCopied] = useState(false)

    const handleCopyUrl = async () => {
        if (!portal.url || !navigator.clipboard?.writeText) return

        try {
            await navigator.clipboard.writeText(portal.url)
            setCopied(true)
            window.setTimeout(() => setCopied(false), 1800)
        } catch (error) {
            console.error("Unable to copy portal URL:", error)
        }
    }

    return (
        <article className="group relative flex h-full min-w-0 flex-col rounded-2xl border border-gray-200 bg-white p-4 pt-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-900/5 dark:border-gray-700 dark:bg-[#303030] dark:hover:border-emerald-800 dark:hover:shadow-black/20 sm:p-5">
            {/* Top Accent */}
            <div className="absolute inset-x-5 top-0 h-1 rounded-b-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 opacity-70 transition-opacity group-hover:opacity-100" />

            {/* Card Header */}
            <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-100 text-emerald-700 transition-transform duration-300 group-hover:scale-105 dark:border-emerald-900 dark:from-emerald-950 dark:to-teal-950 dark:text-emerald-300">
                    <Globe2 size={22} strokeWidth={1.8} />
                </div>

                <div className="min-w-0 flex-1 pt-0.5">
                    <h3
                        className="break-words text-sm font-bold leading-5 text-gray-900 dark:text-white sm:text-base"
                        title={portal.name || ""}
                    >
                        {portal.name || "Untitled portal"}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Visa application portal
                    </p>
                </div>

                {/* Three-dot menu */}
                <div className="relative -mr-1 -mt-1 shrink-0">
                    <ActionMenu
                        portal={portal}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                </div>
            </div>

            {/* Country and University */}
            <div className="mt-5 space-y-3 rounded-xl border border-gray-100 bg-gray-50/80 p-3 dark:border-gray-700/70 dark:bg-gray-800/50">
                <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm dark:bg-gray-700 dark:text-emerald-300">
                        <MapPin size={15} />
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                            Country
                        </p>

                        <p className="mt-1 break-words text-sm font-medium text-gray-800 dark:text-gray-200">
                            {portal.countryName || "Not specified"}
                        </p>
                    </div>
                </div>

                <div className="border-t border-gray-200/80 dark:border-gray-700" />

                <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm dark:bg-gray-700 dark:text-blue-300">
                        <Building2 size={15} />
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                            University
                        </p>

                        <p
                            className="mt-1 break-words text-sm font-medium leading-5 text-gray-800 dark:text-gray-200"
                            title={portal.universityName || ""}
                        >
                            {portal.universityName || "Not specified"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Processing Time */}
            <div className="mt-4 flex min-w-0 items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Clock3 size={15} className="shrink-0" />
                    <span>Processing time</span>
                </div>

                <span className="shrink-0 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
                    {portal.processingTimeInDays ?? "—"}
                    {portal.processingTimeInDays != null ? " days" : ""}
                </span>
            </div>

            {/* Notes: limited height keeps cards compact */}
            <div className="mt-4">
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    Additional notes
                </p>

                <p
                    className="break-words text-sm leading-5 text-gray-600 dark:text-gray-300"
                    title={portal.note || ""}
                    style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        overflowWrap: "anywhere",
                    }}
                >
                    {portal.note || "No additional notes available."}
                </p>
            </div>

            {/* URL */}
            {portal.url && (
                <div className="mt-4 flex min-w-0 items-center gap-2 border-t border-gray-100 pt-3 dark:border-gray-700">
                    <Link2 size={14} className="shrink-0 text-gray-400" />

                    <span
                        className="min-w-0 flex-1 truncate text-xs text-gray-500 dark:text-gray-400"
                        title={portal.url}
                    >
                        {portal.url}
                    </span>

                    <button
                        type="button"
                        onClick={handleCopyUrl}
                        title="Copy portal URL"
                        aria-label="Copy portal URL"
                        className="flex shrink-0 items-center justify-center rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:hover:bg-gray-700 dark:hover:text-emerald-300"
                    >
                        {copied ? (
                            <Check
                                size={15}
                                className="text-emerald-600 dark:text-emerald-400"
                            />
                        ) : (
                            <ExternalLink size={15} />
                        )}
                    </button>
                </div>
            )}

            {/* Visit Button */}
            <div className="mt-auto pt-5">
                {portal.url ? (
                    <a
                        href={portal.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Visit ${portal.name || "visa portal"} website in a new tab`}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-emerald-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 active:scale-[0.99] dark:bg-emerald-600 dark:hover:bg-emerald-500 dark:focus-visible:ring-offset-[#303030]"
                    >
                        Visit Visa Portal
                        <ArrowUpRight
                            size={17}
                            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                    </a>
                ) : (
                    <div className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-400 dark:bg-gray-800 dark:text-gray-500">
                        <ExternalLink size={15} />
                        Website unavailable
                    </div>
                )}
            </div>
        </article>
    )
}

// ============================================================
// Main Visa Portal Page
// ============================================================

const AllVisaPortalForm = () => {
    const [paginationParams, setPaginationParams] = useState({
        pageSize: 10,
        pageIndex: 1,
        isPagination: true,
    })

    const [addVisible, setAddVisible] = useState(false)
    const [editId, setEditId] = useState<string | null>(null)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [openFilter, setOpenFilter] = useState(false)
    const [filterParams, setFilterParams] = useState("")

    const form = useForm<FilterFormData>({
        defaultValues: {
            name: "",
            countryId: "",
            universityId: "",
            startDate: "",
            endDate: "",
            pageSize: 10,
            pageIndex: 1,
            isPagination: true,
        },
    })

    const countryId = useWatch({
        control: form.control,
        name: "countryId",
    })

    const universityId = useWatch({
        control: form.control,
        name: "universityId",
    })

    const { data: countries } = useGetVisaPortalCountries()

    const { data: universities } =
        useGetVisaPortalUniversities(countryId)

    const handlePageChange = (params: FilterFormData) => {
        setPaginationParams((current) => ({
            ...current,
            pageIndex: params.pageIndex,
            isPagination: true,
        }))
    }

    const query =
        `?pageSize=${paginationParams.pageSize}` +
        `&pageIndex=${paginationParams.pageIndex}` +
        `&IsPagination=${paginationParams.isPagination}`

    const fullQuery = `${query}${filterParams}`

    const { data, isLoading, error } =
        useGetAllVisaPortal(fullQuery)

    const deleteVisaPortal = useDeleteVisaPortal()

    const portals: VisaPortalResponse[] = data?.Items ?? []

    // ============================================================
    // Apply Filters
    // ============================================================

    const onFilterSubmit: SubmitHandler<FilterFormData> = async (values) => {
        const searchParams = new URLSearchParams()
        const name = values.name.trim()

        if (name) searchParams.set("name", name)
        if (values.countryId) searchParams.set("countryId", values.countryId)
        if (values.universityId) {
            searchParams.set("universityId", values.universityId)
        }
        if (values.startDate) searchParams.set("startDate", values.startDate)
        if (values.endDate) searchParams.set("endDate", values.endDate)

        const serialized = searchParams.toString()
        const nextFilterParams = serialized ? `&${serialized}` : ""

        await toast.promise(
            Promise.resolve().then(() => {
                setPaginationParams((current) => ({
                    ...current,
                    pageIndex: 1,
                }))
                form.setValue("pageIndex", 1)
                setFilterParams(nextFilterParams)
            }),
            {
                loading: "Fetching data...",
                success: "Data fetched successfully!",
                error: "Failed to fetch visa portals.",
            }
        )
    }

    const applyDatePreset = (preset: DatePreset) => {
        const today = new Date()
        const start = new Date(today)
        const end = new Date(today)

        if (preset === "yesterday") {
            start.setDate(start.getDate() - 1)
            end.setDate(end.getDate() - 1)
        } else if (preset === "7days") {
            start.setDate(start.getDate() - 6)
        } else if (preset === "month") {
            start.setDate(1)
        } else {
            start.setMonth(0, 1)
        }

        const startDate = adToBs(formatDate(start))
        const endDate = adToBs(formatDate(end))
        form.setValue("startDate", startDate, { shouldDirty: true })
        form.setValue("endDate", endDate, { shouldDirty: true })
        void onFilterSubmit({
            ...form.getValues(),
            startDate,
            endDate,
        })
    }

    // ============================================================
    // Clear Filters
    // ============================================================

    const onClearClick = () => {
        form.reset({
            name: "",
            countryId: "",
            universityId: "",
            startDate: "",
            endDate: "",
            pageSize: paginationParams.pageSize,
            pageIndex: 1,
            isPagination: true,
        })

        setPaginationParams((current) => ({
            ...current,
            pageIndex: 1,
        }))

        setFilterParams("")
    }

    // ============================================================
    // Render
    // ============================================================

    return (
        <>
            <Toaster position="top-right" />

            <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-[#353535] sm:p-6">
                {/* Header */}
                <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">


                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
                                All Visa Portals
                            </h1>

                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <ButtonElement
                            type="button"
                            text="Filter"
                            icon={<Filter size={14} />}
                            onClick={() =>
                                setOpenFilter((previous) => !previous)
                            }
                            className="!bg-emerald-600 hover:!bg-emerald-700 flex-1 justify-center sm:flex-none"
                        />

                        <ButtonElement
                            type="button"
                            text="Add Visa Portal"
                            icon={<Plus size={18} />}
                            onClick={() => setAddVisible(true)}
                            className="!font-semibold flex-1 justify-center sm:flex-none"
                        />
                    </div>
                </header>

                {/* Filters */}
                {openFilter && (
                    <div className="mx-4 mb-6 overflow-x-auto rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-[#353535]">
                        <form
                            onSubmit={form.handleSubmit(onFilterSubmit)}
                            className="flex w-max min-w-full flex-nowrap items-end gap-3"
                        >
                            <div className="flex shrink-0 flex-nowrap items-center gap-2">
                                <ButtonElement
                                    type="button"
                                    text="Yesterday"
                                    onClick={() => applyDatePreset("yesterday")}
                                    className="!bg-emerald-600 hover:!bg-emerald-700"
                                />
                                <ButtonElement
                                    type="button"
                                    text="7 Days"
                                    onClick={() => applyDatePreset("7days")}
                                    className="!bg-emerald-600 hover:!bg-emerald-700"
                                />
                                <ButtonElement
                                    type="button"
                                    text="This Month"
                                    onClick={() => applyDatePreset("month")}
                                    className="!bg-emerald-600 hover:!bg-emerald-700"
                                />
                                <ButtonElement
                                    type="button"
                                    text="This Year"
                                    onClick={() => applyDatePreset("year")}
                                    className="!bg-emerald-600 hover:!bg-emerald-700"
                                />
                            </div>

                            <div className="w-95 shrink-0">
                                <InputElement
                                    label="Name"
                                    form={form}
                                    name="name"
                                />
                            </div>

                            {/* <div className="w-52 shrink-0">
                                <AppCombobox
                                    value={countryId}
                                    name="countryId"
                                    label="Country"
                                    form={form}
                                    options={countries ?? []}
                                    selected={
                                        countries?.find(
                                            (country) =>
                                                country.id === countryId
                                        ) ?? null
                                    }
                                    onSelect={(country) => {
                                        form.setValue(
                                            "countryId",
                                            country?.id ?? "",
                                            { shouldDirty: true }
                                        )

                                        form.setValue("universityId", "", {
                                            shouldDirty: true,
                                        })
                                    }}
                                    getLabel={(country) => country?.name ?? ""}
                                    getValue={(country) => country?.id ?? ""}
                                />
                            </div>

                            <div className="w-56 shrink-0">
                                <AppCombobox
                                    value={universityId}
                                    name="universityId"
                                    label="University"
                                    form={form}
                                    options={universities ?? []}
                                    selected={
                                        universities?.find(
                                            (university) =>
                                                university.id === universityId
                                        ) ?? null
                                    }
                                    onSelect={(university) =>
                                        form.setValue(
                                            "universityId",
                                            university?.id ?? "",
                                            { shouldDirty: true }
                                        )
                                    }
                                    getLabel={(university) =>
                                        university?.name ?? ""
                                    }
                                    getValue={(university) =>
                                        university?.id ?? ""
                                    }
                                />
                            </div> */}

                            <div className=" ml-auto flex shrink-0 items-center gap-2">
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

                {/* Loading */}
                {isLoading ? (
                    <div className="mt-5 flex min-h-64 flex-col items-center justify-center gap-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-600 dark:border-gray-600 dark:border-t-emerald-400" />

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Loading visa portals...
                        </p>
                    </div>
                ) : error ? (
                    /* Error */
                    <div
                        role="alert"
                        className="mt-5 flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50/50 px-4 py-16 text-center dark:border-red-900 dark:bg-red-950/20"
                    >
                        <Globe2
                            size={28}
                            className="mb-3 text-red-500"
                        />

                        <h2 className="font-semibold text-gray-900 dark:text-white">
                            Unable to load visa portals
                        </h2>

                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Something went wrong. Please try again.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Cards Section */}


                        {/* Responsive Card Grid */}
                        {portals.length > 0 ? (
                            <div className="mt-8 grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                                {portals.map((portal) => (
                                    <VisaPortalCard
                                        key={portal.id}
                                        portal={portal}
                                        onEdit={setEditId}
                                        onDelete={setDeleteId}
                                    />
                                ))}
                            </div>
                        ) : (
                            /* Empty State */
                            <div className="mt-5 flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50/60 px-5 py-12 text-center dark:border-gray-600 dark:bg-[#303030]">
                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300">
                                    <Globe2 size={28} />
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    No visa portals found
                                </h3>

                                <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500 dark:text-gray-400">
                                    Try changing your filters or add a new
                                    visa portal to get started.
                                </p>

                                <div className="mt-5 flex flex-wrap justify-center gap-3">
                                    {filterParams && (
                                        <ButtonElement
                                            type="button"
                                            text="Clear Filters"
                                            icon={<X size={15} />}
                                            onClick={onClearClick}
                                            className="!bg-gray-500 hover:!bg-gray-600"
                                        />
                                    )}

                                    <ButtonElement
                                        type="button"
                                        text="Add Visa Portal"
                                        icon={<Plus size={17} />}
                                        onClick={() => setAddVisible(true)}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Pagination */}
                        {data && data.Items.length > 0 && (
                            <div className="mt-7 border-t border-gray-100 pt-5 dark:border-gray-700">
                                <Pagination
                                    form={form}
                                    pagination={{
                                        currentPage: data.PageIndex ?? 1,
                                        firstPage: data.FirstPage ?? 1,
                                        lastPage: data.LastPage ?? 1,
                                        nextPage: data.NextPage ?? 1,
                                        previousPage: data.PreviousPage ?? 1,
                                    }}
                                    handleSearch={handlePageChange}
                                />
                            </div>
                        )}
                    </>
                )}
            </section>

            {/* Add Modal */}
            <AddVisaPortal
                visible={addVisible}
                onClose={() => setAddVisible(false)}
            />

            {/* Edit Modal */}
            <EditVisaPortal
                visible={Boolean(editId)}
                visaPortalId={editId}
                onClose={() => setEditId(null)}
            />

            {/* Delete Confirmation */}
            <DeleteComponents
                visible={Boolean(deleteId)}
                id={deleteId ?? ""}
                onClose={() => setDeleteId(null)}
                onConfirm={async (id) => {
                    try {
                        await deleteVisaPortal.mutateAsync(id)
                    } catch (error) {
                        console.error(
                            "Failed to delete visa portal:",
                            error
                        )
                    }
                }}
                title="Delete Visa Portal"
                description="Are you sure you want to delete this visa portal? This action cannot be undone."
            />
        </>
    )
}

export default AllVisaPortalForm
