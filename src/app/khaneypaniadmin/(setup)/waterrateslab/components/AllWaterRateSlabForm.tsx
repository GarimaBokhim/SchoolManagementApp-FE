'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BookOpen, Edit, Eye, Filter, MoreVertical, Plus, RotateCcw, Trash } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Toaster } from 'react-hot-toast'
import Pagination from '@/components/Pagination'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import DeleteComponents from '@/components/DeleteComponent/DeleteComponents'
import { useDeleteWaterRateSlab, useGetAllWaterRateSlab } from '../hooks'
import {
    AddWaterRateSlabPayload,
    WaterRateSlabResponse,
} from '../types/IWaterRateSlab'
import AddWaterRateSlab from '../pages/Add'
import EditWaterRateSlab from '../pages/Edit'
import ViewWaterRateSlab from '../pages/View'

type ListFormValues = AddWaterRateSlabPayload & {
    pageSize: number
    pageIndex: number
    isPagination: boolean
}

interface ActionMenuProps {
    waterRateSlab: WaterRateSlabResponse
    onEdit: (slab: WaterRateSlabResponse) => void
    onDelete: (id: string) => void
    onView: (slab: WaterRateSlabResponse) => void
}

const ActionMenu = ({ waterRateSlab, onEdit, onDelete, onView }: ActionMenuProps) => {
    const [open, setOpen] = useState(false)
    const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({})
    const buttonRef = useRef<HTMLButtonElement>(null)
    const menuRef = useRef<HTMLDivElement>(null)

    const calculatePosition = useCallback(() => {
        if (!buttonRef.current) return
        const rect = buttonRef.current.getBoundingClientRect()
        const menuHeight = 128
        const menuWidth = 180
        const openUpward = window.innerHeight - rect.bottom < menuHeight + 8
        setMenuStyle({
            position: 'fixed',
            right: window.innerWidth - rect.right,
            top: openUpward ? rect.top - menuHeight - 4 : rect.bottom + 4,
            width: menuWidth,
            zIndex: 9999,
        })
    }, [])

    useEffect(() => {
        if (!open) return
        const handleOutsideClick = (event: MouseEvent) => {
            const target = event.target as Node
            if (!menuRef.current?.contains(target) && !buttonRef.current?.contains(target)) {
                setOpen(false)
            }
        }
        const updatePosition = () => calculatePosition()
        document.addEventListener('mousedown', handleOutsideClick)
        window.addEventListener('scroll', updatePosition, true)
        window.addEventListener('resize', updatePosition)
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick)
            window.removeEventListener('scroll', updatePosition, true)
            window.removeEventListener('resize', updatePosition)
        }
    }, [calculatePosition, open])

    const runAction = (action: (slab: WaterRateSlabResponse) => void) => {
        action(waterRateSlab)
        setOpen(false)
    }

    return (
        <div className="flex justify-center">
            <button
                ref={buttonRef}
                type="button"
                onClick={() => {
                    if (!open) calculatePosition()
                    setOpen((current) => !current)
                }}
                className="rounded-full p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Actions"
                aria-label={`Actions for ${waterRateSlab.name}`}
                aria-expanded={open}
            >
                <MoreVertical size={18} className="text-gray-600 dark:text-gray-300" />
            </button>
            {open && (
                <div
                    ref={menuRef}
                    style={menuStyle}
                    className="rounded-md border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
                >
                    <button
                        type="button"
                        onClick={() => runAction(onView)}
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                        <Eye size={14} /> View
                    </button>
                    <button
                        type="button"
                        onClick={() => runAction(onEdit)}
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                        <Edit size={14} /> Edit
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            onDelete(waterRateSlab.id)
                            setOpen(false)
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
                    >
                        <Trash size={14} /> Delete
                    </button>
                </div>
            )}
        </div>
    )
}

const AllWaterRateSlabForm = () => {
    const [showFilter, setShowFilter] = useState(false)
    const [showAdd, setShowAdd] = useState(false)
    const [selectedSlab, setSelectedSlab] = useState<WaterRateSlabResponse | null>(null)
    const [viewSlab, setViewSlab] = useState<WaterRateSlabResponse | null>(null)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [filterName, setFilterName] = useState('')
    const [pagination, setPagination] = useState({
        pageSize: 10,
        pageIndex: 1,
        isPagination: true,
    })
    const form = useForm<ListFormValues>({
        defaultValues: { name: '', ...pagination },
    })

    const queryParams = useMemo(() => {
        const search = new URLSearchParams({
            pageSize: String(pagination.pageSize),
            pageIndex: String(pagination.pageIndex),
            IsPagination: String(pagination.isPagination),
        })
        if (filterName) search.set('name', filterName)
        return `?${search.toString()}`
    }, [filterName, pagination])

    const { data, isLoading, error } = useGetAllWaterRateSlab(queryParams)
    const deleteWaterRateSlab = useDeleteWaterRateSlab()
    const slabs = data?.Items ?? []

    const handleSearch = (values: ListFormValues) => {
        setPagination({
            pageSize: pagination.pageSize,
            pageIndex: values.pageIndex || 1,
            isPagination: values.isPagination ?? true,
        })
    }

    const applyFilter = (values: ListFormValues) => {
        setFilterName(values.name.trim())
        setPagination((current) => ({ ...current, pageIndex: 1 }))
        form.setValue('pageIndex', 1)
    }

    const clearFilter = () => {
        form.reset({ name: '', ...pagination, pageIndex: 1 })
        setFilterName('')
        setPagination((current) => ({ ...current, pageIndex: 1 }))
    }

    const handleEdit = (slab: WaterRateSlabResponse) => {
        setSelectedSlab(slab)
    }

    const closeEdit = () => setSelectedSlab(null)

    const confirmDelete = async (id: string) => {
        await deleteWaterRateSlab.mutateAsync(id)
        setDeleteId(null)
    }

    if (error) {
        return (
            <div className="p-4 sm:p-6">
                <Toaster position="top-right" />
                <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-[#353535]">
                    <div className="py-16 text-center">
                        <BookOpen size={64} className="mx-auto mb-4 text-red-400" />
                        <h3 className="mb-2 text-xl font-medium text-gray-900 dark:text-white">
                            Error loading Water Rate Slabs
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            {error instanceof Error ? error.message : 'Please try again later.'}
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="p-4 sm:p-6">
                <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-[#353535]">
                    <div className="flex h-64 items-center justify-center">
                        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-emerald-600" />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <Toaster position="top-right" />
            <div className="p-4 sm:p-6">
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-[#353535]">
                    <div className="flex w-full items-center justify-between p-3 px-4 pt-4">
                        <h1 className="text-xl font-semibold dark:text-white">All Water Rate Slabs</h1>
                        <div className="flex items-center space-x-3">
                            <ButtonElement
                                type="button"
                                text="Filter"
                                icon={<Filter size={14} />}
                                onClick={() => setShowFilter((open) => !open)}
                                className="!bg-emerald-600 hover:!bg-emerald-700"
                            />
                            <ButtonElement
                                icon={<Plus size={18} />}
                                type="button"
                                text="Add Water Rate Slab"
                                onClick={() => setShowAdd(true)}
                                className="!font-semibold"
                            />
                        </div>
                    </div>

                    {showFilter && (
                        <form
                            onSubmit={form.handleSubmit(applyFilter)}
                            className="mx-4 mb-6 flex flex-wrap items-end gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-[#353535]"
                        >
                            <div className="min-w-[240px] flex-1">
                                <label htmlFor="water-rate-slab-name" className="mb-1 block text-sm font-medium">
                                    Name
                                </label>
                                <input
                                    id="water-rate-slab-name"
                                    {...form.register('name')}
                                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
                                    placeholder="Filter by name"
                                />
                            </div>
                            <div className="flex gap-2">
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
                                    onClick={clearFilter}
                                    className="!bg-gray-500 hover:!bg-gray-600"
                                />
                            </div>
                        </form>
                    )}

                    <div className="px-4 pb-4">
                        <div className="w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-gray-50 font-semibold uppercase dark:bg-[#80878c]">
                                        <th className="px-4 py-3 text-left">S.N</th>
                                        <th className="px-4 py-3 text-left">Name</th>
                                        <th className="px-4 py-3 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {slabs.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="p-4 text-center italic text-gray-500 dark:text-gray-400">
                                                No water rate slabs found.
                                            </td>
                                        </tr>
                                    ) : (
                                        slabs.map((slab, index) => (
                                            <tr
                                                key={slab.id}
                                                className="border-t border-gray-100 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-[#2a2b2e]"
                                            >
                                                <td className="px-4 py-3 text-gray-500">
                                                    {(pagination.pageIndex - 1) * pagination.pageSize + index + 1}
                                                </td>
                                                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">
                                                    {slab.name}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <ActionMenu
                                                        waterRateSlab={slab}
                                                        onEdit={handleEdit}
                                                        onDelete={setDeleteId}
                                                        onView={setViewSlab}
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

                {data && data.Items.length > 0 && (
                    <div className="mt-4">
                        <Pagination
                            form={form}
                            pagination={{
                                currentPage: data.PageIndex ?? 1,
                                firstPage: data.FirstPage ?? 1,
                                lastPage: data.LastPage ?? 1,
                                nextPage: data.NextPage ?? undefined,
                                previousPage: data.PreviousPage ?? undefined,
                            }}
                            handleSearch={handleSearch}
                        />
                    </div>
                )}
            </div>

            <AddWaterRateSlab visible={showAdd} onClose={() => setShowAdd(false)} />
            <EditWaterRateSlab
                visible={selectedSlab !== null}
                waterRateSlab={selectedSlab}
                onClose={closeEdit}
            />
            <ViewWaterRateSlab waterRateSlab={viewSlab} onClose={() => setViewSlab(null)} />
            <DeleteComponents
                visible={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={confirmDelete}
                id={deleteId ?? ''}
                title="Delete Water Rate Slab"
                description="Are you sure you want to delete this water rate slab?"
            />
        </>
    )
}

export default AllWaterRateSlabForm
