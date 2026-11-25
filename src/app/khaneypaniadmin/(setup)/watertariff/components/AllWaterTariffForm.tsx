'use client'

import { useMemo, useState } from 'react'
import { BookOpen, Filter, RotateCcw } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Toaster } from 'react-hot-toast'
import Pagination from '@/components/Pagination'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import { useGetAllWaterTariff } from '../hooks'

interface FilterFormData {
    name: string
}

interface SearchParam {
    pageSize: number
    pageIndex: number
    isPagination: boolean
}

const AllWaterTariffForm = () => {
    const [openFilter, setOpenFilter] = useState(false)
    const [params, setParams] = useState('')
    const [paginationParams, setPaginationParams] = useState({
        pageSize: 10,
        pageIndex: 1,
        isPagination: true,
    })
    const form = useForm<FilterFormData & SearchParam>({
        defaultValues: {
            name: '',
            ...paginationParams,
        },
    })

    const queryParams = useMemo(() => {
        const query = new URLSearchParams({
            pageSize: String(paginationParams.pageSize),
            pageIndex: String(paginationParams.pageIndex),
            IsPagination: String(paginationParams.isPagination),
        })
        return `?${query.toString()}${params}`
    }, [paginationParams, params])

    const { data, isLoading, error } = useGetAllWaterTariff(queryParams)

    const handlePageChange = (pageParams: SearchParam) => {
        setPaginationParams((current) => ({
            ...pageParams,
            pageSize: current.pageSize,
        }))
    }

    const onFilterSubmit = (values: FilterFormData) => {
        const name = values.name.trim()
        setParams(name ? `&name=${encodeURIComponent(name)}` : '')
        setPaginationParams((current) => ({ ...current, pageIndex: 1 }))
        form.setValue('pageIndex', 1)
    }

    const onClearClick = () => {
        setParams('')
        form.reset({
            name: '',
            ...paginationParams,
            pageIndex: 1,
        })
        setPaginationParams((current) => ({ ...current, pageIndex: 1 }))
    }

    if (error) {
        return (
            <div className="p-4 sm:p-6">
                <Toaster position="top-right" />
                <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-[#353535]">
                    <div className="py-16 text-center">
                        <BookOpen size={64} className="mx-auto mb-4 text-red-400" />
                        <h3 className="mb-2 text-xl font-medium text-gray-900 dark:text-white">
                            Error loading WaterTariff
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
                        <h1 className="text-xl font-semibold dark:text-white">All WaterTariff</h1>
                        <ButtonElement
                            type="button"
                            text="Filter"
                            icon={<Filter size={14} />}
                            onClick={() => setOpenFilter((current) => !current)}
                            className="!bg-emerald-600 hover:!bg-emerald-700"
                        />
                    </div>

                    {openFilter && (
                        <div className="mx-4 mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-[#353535]">
                            <form
                                onSubmit={form.handleSubmit(onFilterSubmit)}
                                className="flex flex-wrap items-end gap-4 md:gap-6"
                            >
                                <div className="min-w-[240px] flex-1">
                                    <label htmlFor="water-tariff-name" className="mb-1 block text-sm font-medium">
                                        Name
                                    </label>
                                    <input
                                        id="water-tariff-name"
                                        {...form.register('name')}
                                        placeholder="Filter by name"
                                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
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
                                        onClick={onClearClick}
                                        className="!bg-gray-500 hover:!bg-gray-600"
                                    />
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="px-4 pb-4">
                        <div className="w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-gray-50 font-semibold uppercase dark:bg-[#80878c]">
                                        <th className="px-4 py-3 text-left">S.N</th>
                                        <th className="px-4 py-3 text-left">Name</th>
                                        <th className="px-4 py-3 text-left">Effective From</th>
                                        <th className="px-4 py-3 text-left">Minimum Units</th>
                                        <th className="px-4 py-3 text-left">Minimum Charges</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(data?.Items ?? []).length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="p-4 text-center italic text-gray-500 dark:text-gray-400">
                                                No WaterTariff found.
                                            </td>
                                        </tr>
                                    ) : (
                                        data?.Items.map((tariff, index) => (
                                            <tr
                                                key={tariff.id}
                                                className="border-t border-gray-100 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-[#2a2b2e]"
                                            >
                                                <td className="px-4 py-3 text-gray-500">
                                                    {(paginationParams.pageIndex - 1) * paginationParams.pageSize + index + 1}
                                                </td>
                                                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">
                                                    {tariff.name}
                                                </td>
                                                <td className="px-4 py-3 text-gray-800 dark:text-gray-100">
                                                    {tariff.effectiveFrom}
                                                </td>
                                                <td className="px-4 py-3 text-gray-800 dark:text-gray-100">
                                                    {tariff.minUnits}
                                                </td>
                                                <td className="px-4 py-3 text-gray-800 dark:text-gray-100">
                                                    {tariff.minCharges}
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
                            handleSearch={handlePageChange}
                        />
                    </div>
                )}
            </div>
        </>
    )
}

export default AllWaterTariffForm
