'use client'

import { useRef, useState } from 'react'
import {
    AlertCircle,
    CalendarDays,
    ChevronRight,
    Filter,
    RotateCcw,
    Search,
    User,
    Wallet,
    Users,
    ReceiptText,
    ArrowUpRight,
} from 'lucide-react'

import { useForm } from 'react-hook-form'
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'

import Pagination from '@/components/Pagination'
import { ButtonElement } from '@/components/Buttons/ButtonElement'

import DateRangeFilter, {
    DateRangeFilterRef,
} from '@/components/DateFilter/FilterComponent'

import { useGetAllDueReports } from '../hooks'

import useErrorHandler from '@/components/helpers/ErrorHandling'
import { Toast } from '@/components/Toast/toast'
import DueDetailsModal from './DueDetailsModal'


interface FilterFormData {
    name: string
    startDate: string
    endDate: string
}

interface SearchParam {
    pageSize: number
    pageIndex: number
    isPagination: boolean
}


const formatCurrency = (amount: number | null | undefined) => {
    return new Intl.NumberFormat('en-NP', {
        style: 'currency',
        currency: 'NPR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount || 0)
}

const formatDate = (date: string | null | undefined) => {
    if (!date) {
        return '-'
    }

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) {
        return date
    }

    return parsedDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    })
}

const getDueDaysClass = (days: number | null | undefined) => {
    if (days === null || days === undefined) {
        return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
    }

    if (days >= 60) {
        return 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
    }

    if (days >= 30) {
        return 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400'
    }

    return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400'
}


interface SummaryCardProps {
    title: string
    value: string | number
    type: 'danger' | 'warning' | 'primary'
}

const SummaryCard = ({
    title,
    value,
    type,
}: SummaryCardProps) => {
    const styles = {
        danger: {
            wrapper:
                'border-red-200 dark:border-red-900/40 bg-white dark:bg-[#303236]',
            icon:
                'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
            value:
                'text-red-700 dark:text-red-400',
        },

        warning: {
            wrapper:
                'border-orange-200 dark:border-orange-900/40 bg-white dark:bg-[#303236]',
            icon:
                'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400',
            value:
                'text-orange-700 dark:text-orange-400',
        },

        primary: {
            wrapper:
                'border-blue-200 dark:border-blue-900/40 bg-white dark:bg-[#303236]',
            icon:
                'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
            value:
                'text-blue-700 dark:text-blue-400',
        },
    }

    const style = styles[type]

    return (
        <div
            className={`rounded-2xl border p-4 shadow-sm sm:p-5 ${style.wrapper}`}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        {title}
                    </p>

                    <p
                        className={`mt-2 truncate text-xl font-bold sm:text-2xl ${style.value}`}
                    >
                        {value}
                    </p>

                </div>


            </div>
        </div>
    )
}


const AllDueReportsForm = () => {
    const { handleError, clearError } = useErrorHandler()

    const [openFilter, setOpenFilter] = useState(false)

    const [paginationParams, setPaginationParams] = useState({
        pageSize: 10,
        pageIndex: 1,
        isPagination: true,
    })

    const [params, setParams] = useState('')

    const formRef = useRef<DateRangeFilterRef>(null)


    const form = useForm<FilterFormData>({
        defaultValues: {
            name: '',
            startDate: '',
            endDate: '',
        },
    })


    const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`

    const fullQuery = query + (params || '')

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
    } = useGetAllDueReports(fullQuery)

    const dueReports = data?.dueReports?.Items ?? []

    // API returns pagination directly under dueReports
    const pagination = data?.dueReports

    const handlePageChange = (params: SearchParam) => {
        setPaginationParams({
            pageSize:
                params.pageSize ||
                paginationParams.pageSize,

            pageIndex:
                params.pageIndex || 1,

            isPagination:
                params.isPagination,
        })
    }


    const [selectedHouseHoldId, setSelectedHouseHoldId] =
        useState<string | null>(null)

    const [dueDetailsModalOpen, setDueDetailsModalOpen] =
        useState(false)

    const handleConsumerClick = (houseHoldsId: string) => {
        setSelectedHouseHoldId(houseHoldsId)
        setDueDetailsModalOpen(true)
    }



    const onFilterSubmit = async (
        formData: FilterFormData
    ) => {
        clearError()

        try {
            const queryParams = [
                formData.name
                    ? `name=${encodeURIComponent(
                        formData.name
                    )}`
                    : null,

                formData.startDate
                    ? `startDate=${encodeURIComponent(
                        formData.startDate
                    )}`
                    : null,

                formData.endDate
                    ? `endDate=${encodeURIComponent(
                        formData.endDate
                    )}`
                    : null,
            ]
                .filter(Boolean)
                .join('&')

            const newParams = queryParams
                ? `&${queryParams}`
                : ''

            setParams(newParams)

            setPaginationParams((previous) => ({
                ...previous,
                pageIndex: 1,
            }))

            toast.success(
                'Due report filter applied.'
            )
        } catch (error) {
            const errorMsg = handleError(error)

            Toast.error(errorMsg)

            console.error(
                'Error during due report filtering:',
                error
            )
        }
    }


    const onClearClick = () => {
        setParams('')

        formRef.current?.handleClear()

        form.reset({
            name: '',
            startDate: '',
            endDate: '',
        })

        setPaginationParams((previous) => ({
            ...previous,
            pageIndex: 1,
        }))
    }


    if (isError || error) {
        return (
            <div className="p-4 sm:p-6">
                <Toaster position="top-right" />

                <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-[#353535]">
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500 dark:bg-red-500/10">
                            <AlertCircle size={30} />
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Unable to load due reports
                        </h3>

                        <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
                            Something went wrong while
                            loading the outstanding consumer
                            report.
                        </p>

                        <button
                            type="button"
                            onClick={() => refetch()}
                            className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        )
    }


    if (isLoading) {
        return (
            <div className="p-4 sm:p-6">
                <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-[#353535]">
                    <div className="flex h-72 items-center justify-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-600 dark:border-gray-700 dark:border-t-emerald-400" />

                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Loading due reports...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }


    return (
        <>
            <Toaster position="top-right" />

            <div className="p-2 sm:p-3">
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-[#353535]">


                    <div className="border-b border-gray-200 px-4 dark:border-gray-700">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">



                            {/* Header */}
                            <div className="flex w-full justify-between p-3 px-4 pt-4 items-center">
                                <h1 className="text-xl font-semibold dark:text-white">All Due Reports</h1>
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
                                    {/* <AppCombobox
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
                                            /> */}
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

                    <div className="grid grid-cols-1 gap-4 border-b border-gray-200 p-4 dark:border-gray-700 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">

                        <SummaryCard
                            title="Total Outstanding"
                            value={formatCurrency(
                                data?.totalOutsandingAMount ??
                                0
                            )}

                            type="danger"
                        />

                        <SummaryCard
                            title="Consumers With Due"
                            value={
                                data?.totalConsumer ?? 0
                            }

                            type="primary"
                        />

                        <SummaryCard
                            title="Outstanding Bills"
                            value={
                                data?.totalOutStandingBillCount ??
                                0
                            }

                            type="warning"
                        />
                    </div>


                    <div className="p-4 sm:p-6">

                        {dueReports.length === 0 ? (

                            <div className="rounded-2xl border border-dashed border-gray-300 py-20 text-center dark:border-gray-700">



                                <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                                    No outstanding bills
                                </h3>

                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    No consumers currently
                                    have outstanding dues.
                                </p>
                            </div>

                        ) : (

                            <>


                                <div className="hidden overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 md:block">

                                    <div className="overflow-x-auto">

                                        <table className="min-w-[1100px] w-full text-sm">

                                            <thead>
                                                <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-[#303236]">

                                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                                        S.N
                                                    </th>

                                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                                        Consumer
                                                    </th>

                                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                                        Consumer ID
                                                    </th>

                                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                                        Meter No.
                                                    </th>

                                                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                                        Due Bills
                                                    </th>

                                                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                                        Outstanding
                                                    </th>

                                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                                        Oldest Bill
                                                    </th>

                                                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                                        Due Days
                                                    </th>

                                                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                                        Action
                                                    </th>

                                                </tr>
                                            </thead>

                                            <tbody>

                                                {dueReports.map(
                                                    (
                                                        dueReport,
                                                        index
                                                    ) => (
                                                        <tr
                                                            key={`${dueReport.houseHoldsId}-${dueReport.meterNumber}`}
                                                            className="border-b border-gray-100 transition hover:bg-gray-50 dark:border-gray-700/70 dark:hover:bg-[#2d2f33]"
                                                        >

                                                            {/* S.N */}

                                                            <td className="px-4 py-4 text-gray-500 dark:text-gray-400">
                                                                {(paginationParams.pageIndex -
                                                                    1) *
                                                                    paginationParams.pageSize +
                                                                    index +
                                                                    1}
                                                            </td>

                                                            {/* CONSUMER */}

                                                            <td className="px-4 py-3">
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleConsumerClick(dueReport.houseHoldsId)
                                                                    }
                                                                    className="group inline-flex items-center gap-1.5 font-medium text-gray-800 hover:text-emerald-600 dark:text-gray-100 dark:hover:text-emerald-400"
                                                                >
                                                                    <span>{dueReport.consumerName}</span>

                                                                    <ArrowUpRight
                                                                        size={15}
                                                                        className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                                                    />
                                                                </button>
                                                            </td>

                                                            <td className="px-4 py-4 font-medium text-gray-700 dark:text-gray-300">
                                                                {
                                                                    dueReport.consumerId
                                                                }
                                                            </td>

                                                            <td className="px-4 py-4 font-medium text-gray-700 dark:text-gray-300">
                                                                {
                                                                    dueReport.meterNumber
                                                                }
                                                            </td>

                                                            <td className="px-4 py-4 text-center">

                                                                <span >
                                                                    {
                                                                        dueReport.outStandingBillCount
                                                                    }
                                                                </span>

                                                            </td>


                                                            <td className="px-4 py-4 text-right">

                                                                <span className="font-bold text-red-600 dark:text-red-400">
                                                                    {formatCurrency(
                                                                        dueReport.outStandingBillAmount
                                                                    )}
                                                                </span>

                                                            </td>
                                                            <td className="whitespace-nowrap px-4 py-4">

                                                                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">

                                                                    <span>
                                                                        {formatDate(
                                                                            dueReport.olderstBillDate
                                                                        )}
                                                                    </span>

                                                                </div>

                                                            </td>


                                                            <td className="px-4 py-4 text-center">

                                                                <span
                                                                    className={`inline-flex px-2.5 py-1 text-xs font-semibold ${getDueDaysClass(
                                                                        dueReport.oldersDueDays
                                                                    )}`}
                                                                >
                                                                    {dueReport.oldersDueDays !==
                                                                        null &&
                                                                        dueReport.oldersDueDays !==
                                                                        undefined
                                                                        ? `${dueReport.oldersDueDays} days`
                                                                        : '-'}
                                                                </span>

                                                            </td>

                                                            {/* ACTION */}

                                                            <td className="px-4 py-4 text-center">

                                                                <button
                                                                    type="button"
                                                                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
                                                                >
                                                                    View

                                                                    <ChevronRight
                                                                        size={
                                                                            14
                                                                        }
                                                                    />
                                                                </button>

                                                            </td>

                                                        </tr>
                                                    )
                                                )}

                                            </tbody>

                                        </table>

                                    </div>

                                </div>


                                <div className="space-y-3 md:hidden">

                                    {dueReports.map(
                                        (dueReport) => (
                                            <div
                                                key={`${dueReport.houseHoldsId}-${dueReport.meterNumber}`}
                                                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-[#303236]"
                                            >

                                                <div className="flex items-start justify-between gap-3">

                                                    <div className="flex items-center gap-3">

                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                                                            <User
                                                                size={
                                                                    18
                                                                }
                                                            />
                                                        </div>

                                                        <div>

                                                            <p className="font-bold text-gray-900 dark:text-white">
                                                                {
                                                                    dueReport.consumerName
                                                                }
                                                            </p>

                                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                {
                                                                    dueReport.consumerId
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>

                                                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                                        {
                                                            dueReport.meterNumber
                                                        }
                                                    </span>

                                                </div>

                                                <div className="mt-4 grid grid-cols-2 gap-2">

                                                    {/* Outstanding */}

                                                    <div className="rounded-lg bg-red-50 p-3 dark:bg-red-500/5">

                                                        <p className="text-[10px] font-medium uppercase text-red-600 dark:text-red-400">
                                                            Outstanding
                                                        </p>

                                                        <p className="mt-1 text-sm font-bold text-red-700 dark:text-red-400">
                                                            {formatCurrency(
                                                                dueReport.outStandingBillAmount
                                                            )}
                                                        </p>

                                                    </div>

                                                    {/* Bills */}

                                                    <div className="rounded-lg bg-orange-50 p-3 dark:bg-orange-500/5">

                                                        <p className="text-[10px] font-medium uppercase text-orange-600 dark:text-orange-400">
                                                            Due Bills
                                                        </p>

                                                        <p className="mt-1 text-sm font-bold text-orange-700 dark:text-orange-400">
                                                            {
                                                                dueReport.outStandingBillCount
                                                            }
                                                        </p>

                                                    </div>

                                                    {/* Oldest */}

                                                    <div className="rounded-lg bg-gray-50 p-3 dark:bg-[#292b2f]">

                                                        <p className="text-[10px] font-medium uppercase text-gray-500">
                                                            Oldest Bill
                                                        </p>

                                                        <p className="mt-1 text-xs font-bold text-gray-800 dark:text-gray-200">
                                                            {formatDate(
                                                                dueReport.olderstBillDate
                                                            )}
                                                        </p>

                                                    </div>

                                                    {/* Due Days */}

                                                    <div className="rounded-lg bg-gray-50 p-3 dark:bg-[#292b2f]">

                                                        <p className="text-[10px] font-medium uppercase text-gray-500">
                                                            Due Days
                                                        </p>

                                                        <span
                                                            className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${getDueDaysClass(
                                                                dueReport.oldersDueDays
                                                            )}`}
                                                        >
                                                            {dueReport.oldersDueDays !==
                                                                null &&
                                                                dueReport.oldersDueDays !==
                                                                undefined
                                                                ? `${dueReport.oldersDueDays} days`
                                                                : '-'}
                                                        </span>

                                                    </div>

                                                </div>

                                                <button
                                                    type="button"
                                                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                                                >
                                                    View Details

                                                    <ChevronRight
                                                        size={16}
                                                    />
                                                </button>

                                            </div>
                                        )
                                    )}

                                </div>

                            </>
                        )}

                    </div>
                </div>


                {pagination &&
                    dueReports.length > 0 && (
                        <div className="mt-4">

                            <Pagination
                                form={form}
                                pagination={{
                                    currentPage:
                                        pagination.PageIndex ?? undefined,

                                    firstPage:
                                        pagination.FirstPage ?? undefined,

                                    lastPage:
                                        pagination.LastPage ?? undefined,

                                    nextPage:
                                        pagination.NextPage ?? undefined,

                                    previousPage:
                                        pagination.PreviousPage ?? undefined,
                                }}
                                handleSearch={
                                    handlePageChange
                                }
                            />

                        </div>
                    )}


            </div>


            <DueDetailsModal
                houseHoldId={selectedHouseHoldId}
                open={dueDetailsModalOpen}
                onClose={() => {
                    setDueDetailsModalOpen(false)
                    setSelectedHouseHoldId(null)
                }}
            />
        </>
    )
}

export default AllDueReportsForm