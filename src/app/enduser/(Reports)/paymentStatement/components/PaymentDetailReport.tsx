'use client'

import { useEffect, useRef, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import React from 'react'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import toast, { Toaster } from 'react-hot-toast'
import useErrorHandler from '@/components/helpers/ErrorHandling'
import { Toast } from '@/components/Toast/toast'
import { Eye, Filter, RotateCcw, X } from 'lucide-react'
import DateRangeFilter, {
  DateRangeFilterRef,
} from '@/components/DateFilter/FilterComponent'
import Pagination from '@/components/Pagination'
import { useGetPaymentDetailReport } from '../hooks'
import { IPaymentDetailReport,IPaymentDetailReportFilter,IPaymentStatement } from '../types/IPaymentRecord'
import { useGetStudentById } from '@/app/enduser/(StudentManagement)/Student/hooks'
import { useGetPaymentStatements } from '../hooks'

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NP', {
    style: 'currency',
    currency: 'NPR',
    minimumFractionDigits: 0,
  }).format(amount)
}

const AmountCell = ({
  amount,
  highlight,
}: {
  amount: number
  highlight?: 'danger' | 'success' | 'warning' | 'default'
}) => {
  const colorMap = {
    danger: 'text-red-600 dark:text-red-400',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    default: 'text-gray-800 dark:text-white',
  }
  const color = colorMap[highlight ?? 'default']
  return <span className={`font-medium ${color}`}>{formatCurrency(amount)}</span>
}

// ── Statement Popup ──────────────────────────────────────────────────────────
interface StatementPopupProps {
  row: IPaymentDetailReport
  studentName: string
  onClose: () => void
}

const StatementPopup = ({ row, studentName, onClose }: StatementPopupProps) => {
  const studentId = row.studentName // API returns studentId in the studentName field
  const { data: statementsData, isLoading } = useGetPaymentStatements(studentId)

  const statements = statementsData?.Items ?? []

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return '—'
    }
  }

  // Compute totals from real statement rows
  const totals = statements.reduce(
    (acc, s) => ({
      debit: acc.debit + s.debitAmount,
      credit: acc.credit + s.creditAmount,
      adjustment: acc.adjustment + s.adjustment,
      balance: acc.balance + s.balance,
    }),
    { debit: 0, credit: 0, adjustment: 0, balance: 0 }
  )

  const netDue = totals.debit - totals.credit + totals.adjustment

  return (
    <div
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-black/40 backdrop-blur-sm ml-12 md:ml-64 sm:ml-16 xs:ml-0"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-5xl mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X size={20} className="text-gray-500" />
        </button>

        <div className="min-h-full bg-gray-100 p-6 flex items-start justify-center font-sans">
          <div className="max-w-5xl w-full bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
            {/* Header */}
            <div className="relative text-center py-6 px-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-white">
              <div className="absolute left-6 top-1/2 -translate-y-1/2">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">BPA</span>
                </div>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-wide">
                  BHALUWA PUBLIC ACADEMY
                </h1>
                <p className="text-gray-600 mt-1">Kerabari-9, Bhaluwa</p>
                <p className="text-gray-500 text-sm">Phone: 9702939500</p>
              </div>
            </div>

            {/* Title */}
            <div className="px-6 pt-6">
              <h2 className="text-xl font-bold text-gray-800 text-center border-b-2 border-indigo-500 pb-3 inline-block w-full">
                STATEMENT OF STUDENT ACCOUNTS (ACCRUAL BASIS)
              </h2>
            </div>

            {/* Student Info */}
            <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
              <div className="flex">
                <span className="w-36 font-semibold text-gray-700">Name of the Student:</span>
                <span className="text-gray-800">{studentName || '—'}</span>
              </div>
              <div className="flex">
                <span className="w-36 font-semibold text-gray-700">Academic Year:</span>
                <span className="text-gray-800">—</span>
              </div>
              <div className="flex">
                <span className="w-36 font-semibold text-gray-700">Roll No.:</span>
                <span className="text-gray-800">—</span>
              </div>
              <div className="flex">
                <span className="w-36 font-semibold text-gray-700">Grade:</span>
                <span className="text-gray-800">—</span>
              </div>
              <div className="flex">
                <span className="w-36 font-semibold text-gray-700">Section:</span>
                <span className="text-gray-800">—</span>
              </div>
              <div className="flex">
                <span className="w-36 font-semibold text-gray-700">Type:</span>
                <span className="text-gray-800">Regular Student</span>
              </div>
            </div>

            {/* Table */}
            <div className="px-6 pb-6 overflow-x-auto">
              {isLoading ? (
                <div className="py-10 text-center text-gray-400 animate-pulse">
                  Loading statement...
                </div>
              ) : (
                <table className="min-w-full border border-gray-200 text-sm">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700">
                      <th className="border border-gray-200 px-3 py-2 text-left">S.N.</th>
                      <th className="border border-gray-200 px-3 py-2 text-left">Particular</th>
                      <th className="border border-gray-200 px-3 py-2 text-left">Date</th>
                      <th className="border border-gray-200 px-3 py-2 text-left">Bill/Receipt No.</th>
                      <th className="border border-gray-200 px-3 py-2 text-right">Debit Amount (Rs.)</th>
                      <th className="border border-gray-200 px-3 py-2 text-right">Credit Amount (Rs.)</th>
                      <th className="border border-gray-200 px-3 py-2 text-right">Adjustment</th>
                      <th className="border border-gray-200 px-3 py-2 text-right">Balance Amount (Rs.)</th>
                      <th className="border border-gray-200 px-3 py-2 text-left">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statements.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="border border-gray-200 px-3 py-6 text-center text-gray-400 italic">
                          No statement records found.
                        </td>
                      </tr>
                    ) : (
                      statements.map((s: IPaymentStatement, idx: number) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="border border-gray-200 px-3 py-2 text-center">{idx + 1}</td>
                          <td className="border border-gray-200 px-3 py-2">{s.remarks || '—'}</td>
                          <td className="border border-gray-200 px-3 py-2 whitespace-nowrap">{formatDate(s.date)}</td>
                          <td className="border border-gray-200 px-3 py-2">{s.receiptNumber || '—'}</td>
                          <td className="border border-gray-200 px-3 py-2 text-right">
                            {s.debitAmount > 0 ? s.debitAmount.toFixed(2) : '—'}
                          </td>
                          <td className="border border-gray-200 px-3 py-2 text-right text-green-700">
                            {s.creditAmount > 0 ? s.creditAmount.toFixed(2) : '—'}
                          </td>
                          <td className="border border-gray-200 px-3 py-2 text-right">
                            {s.adjustment !== 0 ? s.adjustment.toFixed(2) : '—'}
                          </td>
                          <td className="border border-gray-200 px-3 py-2 text-right">
                            {s.balance.toFixed(2)}
                          </td>
                          <td className="border border-gray-200 px-3 py-2">{s.remarks || '—'}</td>
                        </tr>
                      ))
                    )}
                    {/* Totals row */}
                    {statements.length > 0 && (
                      <tr className="bg-gray-50 font-semibold">
                        <td colSpan={4} className="border border-gray-200 px-3 py-2 text-right">
                          Total (Rs.)
                        </td>
                        <td className="border border-gray-200 px-3 py-2 text-right">
                          {totals.debit.toFixed(2)}
                        </td>
                        <td className="border border-gray-200 px-3 py-2 text-right text-green-700">
                          {totals.credit.toFixed(2)}
                        </td>
                        <td className="border border-gray-200 px-3 py-2 text-right">
                          {totals.adjustment.toFixed(2)}
                        </td>
                        <td className="border border-gray-200 px-3 py-2 text-right">
                          {totals.balance.toFixed(2)}
                        </td>
                        <td className="border border-gray-200 px-3 py-2" />
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {/* Net Due */}
            {!isLoading && statements.length > 0 && (
              <div className="px-6 pb-6 text-right">
                <p className="text-md font-bold text-gray-800">
                  Total Amount:{' '}
                  <span className="text-indigo-600">
                    {netDue === 0 ? 'NIL' : `Rs. ${netDue.toFixed(2)}`}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Student name resolver used both in table cell and popup ───────────────────
const useStudentName = (studentId: string) => {
  const { data, isLoading } = useGetStudentById(studentId)
  const name = data
    ? [data.firstName, data.middleName, data.lastName].filter(Boolean).join(' ')
    : ''
  return { name, isLoading }
}

// ── Table row with its own name resolution ────────────────────────────────────
interface RowProps {
  row: IPaymentDetailReport
  index: number
  pageIndex: number
  pageSize: number
  onView: (row: IPaymentDetailReport, name: string) => void
}

const PaymentRow = ({ row, index, pageIndex, pageSize, onView }: RowProps) => {
  const { name, isLoading } = useStudentName(row.studentName)

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-600 text-gray-700 dark:text-gray-100">
      <td className="px-4 py-3 whitespace-nowrap">
        {(pageIndex - 1) * pageSize + index + 1}
      </td>
      <td className="px-4 py-3 whitespace-nowrap font-medium">
        {isLoading ? (
          <span className="inline-block w-28 h-3.5 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
        ) : (
          name || row.studentName
        )}
      </td>
      <td className="px-4 py-3 text-right whitespace-nowrap">
        <AmountCell amount={row.totalAmount} highlight="default" />
      </td>
      <td className="px-4 py-3 text-right whitespace-nowrap">
        <AmountCell amount={row.paidAmount} highlight="success" />
      </td>
      <td className="px-4 py-3 text-right whitespace-nowrap">
        <AmountCell amount={row.discountAmount} highlight="warning" />
      </td>
      <td className="px-4 py-3 text-right whitespace-nowrap">
        <AmountCell
          amount={row.dueAmount}
          highlight={row.dueAmount < 0 ? 'success' : row.dueAmount > 0 ? 'danger' : 'default'}
        />
      </td>
      <td className="px-4 py-3 text-center whitespace-nowrap">
        <button
          onClick={() => onView(row, name)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 transition-colors text-xs font-medium"
        >
          <Eye size={14} />
          View
        </button>
      </td>
    </tr>
  )
}

const PaymentDetailReportForm = () => {
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

  const handleSearch = (params: SearchParam) => {
    params.pageSize = paginationParams.pageSize
    setPaginationParams(params)
  }

  const [openFilter, setOpenFilter] = useState(true)
  const [params, setParams] = useState('')
  const [selectedRow, setSelectedRow] = useState<{ row: IPaymentDetailReport; name: string } | null>(null)
  const { handleError, clearError } = useErrorHandler()
  const formRef = useRef<DateRangeFilterRef>(null)

  const form = useForm<IPaymentDetailReportFilter>({
    defaultValues: {
      startDate: '',
      endDate: '',
    },
  })

  const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`
  const fullQuery = params ? query + params : ''

  const {
    data: reportData,
    refetch,
    isLoading,
  } = useGetPaymentDetailReport(fullQuery || undefined)

  useEffect(() => {
    if (params) refetch()
  }, [paginationParams, refetch])

  const onSubmit: SubmitHandler<IPaymentDetailReportFilter> = async (formData) => {
    clearError()
    try {
      const queryParams = [
        formData.startDate
          ? `startDate=${encodeURIComponent(formData.startDate)}`
          : null,
        formData.endDate
          ? `endDate=${encodeURIComponent(formData.endDate)}`
          : null,
      ]
        .filter(Boolean)
        .join('&')

      const builtParams = queryParams ? `&${queryParams}` : ''

      await toast.promise(
        (async () => {
          setParams(builtParams)
          await refetch()
        })(),
        {
          loading: 'Fetching report...',
          success: 'Report loaded successfully!',
        }
      )
    } catch (error) {
      const errorMsg = handleError(error)
      Toast.error(errorMsg)
      console.error('Error during form submission:', error)
    }
  }

  const onClearClick = () => {
    setParams('')
    formRef.current?.handleClear()
    form.reset()
  }

  const items = reportData?.Items ?? []

  // Totals for footer row only
  const totals = items.reduce(
    (acc, row) => ({
      totalAmount: acc.totalAmount + row.totalAmount,
      paidAmount: acc.paidAmount + row.paidAmount,
      discountAmount: acc.discountAmount + row.discountAmount,
      dueAmount: acc.dueAmount + row.dueAmount,
    }),
    { totalAmount: 0, paidAmount: 0, discountAmount: 0, dueAmount: 0 }
  )

  return (
    <>
      <Toaster />
      <div className="p-4 sm:p-6">
        <div className="bg-white dark:bg-[#353535] border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="flex w-full justify-between p-3 px-4 pt-4 items-center">
            <h1 className="text-xl font-semibold">Payment Detail Report</h1>
            <div className="flex flex-wrap gap-2 justify-end">
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
            <div className="bg-white dark:bg-[#2c2c2c] p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6 mx-4">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col lg:flex-row lg:flex-wrap gap-4"
              >
                <DateRangeFilter
                  ref={formRef}
                  form={form}
                  onSubmit={onSubmit}
                  setParams={setParams}
                />
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
          <div className="overflow-x-auto bg-white dark:bg-[#353535] border border-gray-200 dark:border-gray-700 rounded-xl mx-4 mb-4">
            <table className="min-w-full text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#80878c] text-gray-700 dark:text-white uppercase font-semibold border-b border-gray-200">
                  <th className="px-4 py-3 text-left w-16">S.N</th>
                  <th className="px-4 py-3 text-left w-48">Student Name</th>
                  <th className="px-4 py-3 text-right w-36">Total Amount</th>
                  <th className="px-4 py-3 text-right w-36">Paid Amount</th>
                  <th className="px-4 py-3 text-right w-36">Discount</th>
                  <th className="px-4 py-3 text-right w-36">Due Amount</th>
                  <th className="px-4 py-3 text-center w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-gray-500 dark:text-gray-300">
                      Loading report...
                    </td>
                  </tr>
                ) : !params ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-400 italic">
                      Please select a date range and click Filter to load the report.
                    </td>
                  </tr>
                ) : items.length > 0 ? (
                  items.map((row: IPaymentDetailReport, index: number) => (
                    <PaymentRow
                      key={`${row.studentName}-${index}`}
                      row={row}
                      index={index}
                      pageIndex={paginationParams.pageIndex}
                      pageSize={paginationParams.pageSize}
                      onView={(r, name) => setSelectedRow({ row: r, name })}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500 italic">
                      No payment records found for the selected date range.
                    </td>
                  </tr>
                )}
              </tbody>

              {/* Table footer totals row */}
              {items.length > 0 && (
                <tfoot>
                  <tr className="bg-gray-100 dark:bg-gray-700 font-semibold text-gray-800 dark:text-white border-t-2 border-gray-300 dark:border-gray-500">
                    <td className="px-4 py-3" colSpan={2}>
                      Total ({items.length} students)
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {formatCurrency(totals.totalAmount)}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap text-green-600 dark:text-green-400">
                      {formatCurrency(totals.paidAmount)}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap text-yellow-600 dark:text-yellow-400">
                      {formatCurrency(totals.discountAmount)}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap text-red-600 dark:text-red-400">
                      {formatCurrency(totals.dueAmount)}
                    </td>
                    <td className="px-4 py-3" />
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>

        {/* Pagination */}
        {reportData && items.length > 0 && (
          <div className="mt-4">
            <Pagination
              form={form}
              pagination={{
                currentPage: reportData?.PageIndex ?? 1,
                firstPage: reportData?.FirstPage ?? 1,
                lastPage: reportData?.LastPage ?? 1,
                nextPage: reportData?.NextPage ?? 1,
                previousPage: reportData?.PreviousPage ?? 1,
              }}
              handleSearch={handleSearch}
            />
          </div>
        )}
      </div>

      {/* Statement Popup */}
      {selectedRow && (
        <StatementPopup
          row={selectedRow.row}
          studentName={selectedRow.name}
          onClose={() => setSelectedRow(null)}
        />
      )}
    </>
  )
}

export default PaymentDetailReportForm