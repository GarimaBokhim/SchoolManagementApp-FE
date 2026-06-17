'use client'
import { useRef } from 'react'
import { Printer, X, Building } from 'lucide-react'
import { useGetDueSlip, IDueSlipItem } from '../hooks'
import { useGetSchoolById } from '@/app/admin/Setup/School/hooks'
import { useState } from 'react'

type DueSlipModalProps = {
  classId: string
  className: string
  onClose: () => void
}

const DueSlipModal = ({ classId, className, onClose }: DueSlipModalProps) => {
  const { data: dueSlipData, isLoading } = useGetDueSlip(classId)
  const printRef = useRef<HTMLDivElement>(null)
  const [imageError, setImageError] = useState(false)
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])

  const schoolId =
    typeof window !== 'undefined'
      ? (() => {
          try {
            const storedUser = localStorage.getItem('userDetails')
            if (!storedUser) return null
            return JSON.parse(storedUser).schoolId ?? null
          } catch {
            return null
          }
        })()
      : null

  const { data: schoolDetail } = useGetSchoolById(schoolId || undefined)

  const getLogoUrl = () => {
    const imageUrl = schoolDetail?.imageUrl
    if (
      !imageUrl ||
      imageUrl === '-' ||
      imageUrl === 'string' ||
      imageUrl === ''
    )
      return null
    return `https://schoolapp.netraverselabs.com/${imageUrl}`
  }
  const schoolLogoUrl = getLogoUrl()

  // Checkbox logic
  const allStudentIds = dueSlipData?.Items?.map((_, idx) => String(idx)) ?? []
  const isAllSelected =
    selectedStudents.length === allStudentIds.length && allStudentIds.length > 0

  const toggleStudent = (id: string) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    setSelectedStudents(isAllSelected ? [] : allStudentIds)
  }

  const handlePrint = () => {
    if (selectedStudents.length === 0) {
      alert('Please select at least one student.')
      return
    }

    const printContents = printRef.current?.innerHTML
    if (!printContents) {
      alert('Content not found')
      return
    }

    const win = window.open('', '_blank', 'width=900,height=1000')

    if (!win) {
      alert('Popup blocked. Please allow popups for this site.')
      return
    }

    try {
      win.document.write(`
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <title>Due Slip - ${className}</title>
      <script src="https://cdn.tailwindcss.com"><\/script>
      <style>
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          background: white;
          margin: 0;
        }
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          body {
            background: white;
            margin: 0;
            padding: 0;
          }
        }
      </style>
    </head>
    <body>
      ${printContents}
      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 500);
        };
      <\/script>
    </body>
  </html>
      `)

      win.document.close()

      setTimeout(() => {
        if (win) {
          win.focus()
        }
      }, 100)
    } catch (error) {
      console.error('Print error:', error)
      alert('Error: ' + String(error))
    }
  }

  const selectedItems =
    dueSlipData?.Items?.filter((_, idx) =>
      selectedStudents.includes(String(idx))
    ) ?? []

  const totalAmount = selectedItems.reduce(
    (s, i) => s + (i.totalAmount ?? 0),
    0
  )
  const totalPaid = selectedItems.reduce((s, i) => s + (i.paidAmount ?? 0), 0)
  const totalDue = totalAmount - totalPaid

  return (
    <div className="fixed inset-0 ml-[16%] bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-[95vw] md:max-w-[800px] max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Due Slip Report</h2>
            <p className="text-sm text-gray-500">{className}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Printer size={16} />
              Print Selected
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 text-red-500 hover:text-red-700"
            >
              <X size={22} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 flex flex-col gap-4">
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">
              Loading due slip...
            </div>
          ) : !dueSlipData?.Items?.length ? (
            <div className="text-center py-12 text-gray-500 italic">
              No due slip data found.
            </div>
          ) : (
            <>
              {/* Select All */}
              <div className="flex items-center gap-2 mb-2 border-b pb-3">
                <input
                  type="checkbox"
                  className="w-5 h-5 cursor-pointer"
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                />
                <label
                  className="font-medium cursor-pointer"
                  onClick={toggleSelectAll}
                >
                  Select All
                </label>
              </div>

              {/* Student Slip List */}
              <div className="flex flex-col gap-6">
                {dueSlipData.Items.map((item: IDueSlipItem, idx: number) => {
                  const id = String(idx)
                  const due = item.totalAmount - item.paidAmount
                  return (
                    <div
                      key={idx}
                      className="flex items-start gap-4 border p-3 rounded-md bg-gray-50"
                    >
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        className="mt-4 w-5 h-5 cursor-pointer shrink-0"
                        checked={selectedStudents.includes(id)}
                        onChange={() => toggleStudent(id)}
                      />

                      {/* Slip Card */}
                      <div className="border border-gray-300 rounded-md overflow-hidden break-inside-avoid flex-1">
                        {/* Slip Header */}
                        <div className="flex items-center gap-4 px-5 py-4 border-b-2 border-gray-800">
                          <div className="w-16 h-16 border border-gray-300 rounded flex items-center justify-center overflow-hidden shrink-0 bg-gray-50">
                            {schoolLogoUrl && !imageError ? (
                              <img
                                src={schoolLogoUrl}
                                alt="School Logo"
                                className="w-full h-full object-contain p-1"
                                onError={() => setImageError(true)}
                              />
                            ) : (
                              <Building className="w-7 h-7 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 text-center">
                            <h1 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                              {schoolDetail?.name ?? 'School Name'}
                            </h1>
                            <p className="text-xs text-gray-500">
                              {schoolDetail?.address ?? '-'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {schoolDetail?.contactNumber ?? ''}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs font-bold text-white bg-gray-800 px-3 py-1 rounded uppercase tracking-wider">
                              Due Slip
                            </span>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date().toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {/* Student Info */}
                        <div className="grid grid-cols-2 gap-x-6 gap-y-1 px-5 py-3 bg-gray-50 border-b border-gray-200 text-sm">
                          <p>
                            <span className="text-gray-500 font-medium">
                              Student Name:{' '}
                            </span>
                            <span className="font-semibold text-gray-800">
                              {item.studentName || '-'}
                            </span>
                          </p>
                          <p>
                            <span className="text-gray-500 font-medium">
                              Class:{' '}
                            </span>
                            <span className="text-gray-800">{className}</span>
                          </p>
                          <p>
                            <span className="text-gray-500 font-medium">
                              Address:{' '}
                            </span>
                            <span className="text-gray-800">
                              {item.address || '-'}
                            </span>
                          </p>
                        </div>

                        {/* Fee Table */}
                        <table className="w-full text-sm border-collapse">
                          <thead>
                            <tr className="bg-gray-800 text-white text-xs uppercase tracking-wide">
                              <th className="px-4 py-2 text-left">
                                Description
                              </th>
                              <th className="px-4 py-2 text-right">
                                Amount (Rs.)
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-gray-100">
                              <td className="px-4 py-2 text-gray-700">
                                Total Fee Charged
                              </td>
                              <td className="px-4 py-2 text-right font-medium text-gray-800">
                                {item.totalAmount.toLocaleString()}
                              </td>
                            </tr>
                            <tr className="border-b border-gray-100">
                              <td className="px-4 py-2 text-gray-700">
                                Discount
                              </td>
                              <td className="px-4 py-2 text-right text-green-600 font-medium">
                                - {item.discount.toLocaleString()}
                              </td>
                            </tr>
                            <tr className="border-b border-gray-100">
                              <td className="px-4 py-2 text-gray-700">
                                Amount Paid
                              </td>
                              <td className="px-4 py-2 text-right text-green-600 font-medium">
                                - {item.paidAmount.toLocaleString()}
                              </td>
                            </tr>
                            <tr className="bg-gray-50">
                              <td className="px-4 py-3 font-bold text-gray-800 text-base">
                                Due Amount
                              </td>
                              <td
                                className={`px-4 py-3 text-right font-bold text-base ${due > 0 ? 'text-red-600' : 'text-green-600'}`}
                              >
                                Rs. {due.toLocaleString()}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Class Summary — only for selected items with more than 1 */}
              {selectedItems.length > 1 && (
                <div className="border border-gray-300 rounded-md overflow-hidden mt-2">
                  <div className="bg-gray-800 text-white px-5 py-2 text-sm font-semibold uppercase tracking-wide">
                    Class Summary — {className}
                  </div>
                  <div className="grid grid-cols-3 divide-x divide-gray-200">
                    <div className="p-4 text-center">
                      <p className="text-xs text-gray-500 mb-1">
                        Total Charged
                      </p>
                      <p className="text-lg font-bold text-gray-800">
                        Rs. {totalAmount.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-4 text-center">
                      <p className="text-xs text-gray-500 mb-1">Total Paid</p>
                      <p className="text-lg font-bold text-green-600">
                        Rs. {totalPaid.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-4 text-center">
                      <p className="text-xs text-gray-500 mb-1">Total Due</p>
                      <p
                        className={`text-lg font-bold ${totalDue > 0 ? 'text-red-600' : 'text-green-600'}`}
                      >
                        Rs. {totalDue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Hidden Print Area — only selected */}
        <div className="hidden">
          <div ref={printRef}>
            {selectedItems.map((item: IDueSlipItem, idx: number) => {
              const due = item.totalAmount - item.paidAmount
              return (
                <div key={idx} className="p-4 break-inside-avoid">
                  <div className="border border-gray-300 rounded-md overflow-hidden">
                    <div className="flex items-center gap-4 px-5 py-4 border-b-2 border-gray-800">
                      <div className="w-16 h-16 border border-gray-300 rounded flex items-center justify-center overflow-hidden shrink-0 bg-gray-50">
                        {schoolLogoUrl && !imageError ? (
                          <img
                            src={schoolLogoUrl}
                            alt="School Logo"
                            className="w-full h-full object-contain p-1"
                          />
                        ) : (
                          <Building className="w-7 h-7 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 text-center">
                        <h1 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                          {schoolDetail?.name ?? 'School Name'}
                        </h1>
                        <p className="text-xs text-gray-500">
                          {schoolDetail?.address ?? '-'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {schoolDetail?.contactNumber ?? ''}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-white bg-gray-800 px-3 py-1 rounded uppercase tracking-wider">
                          Due Slip
                        </span>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1 px-5 py-3 bg-gray-50 border-b border-gray-200 text-sm">
                      <p>
                        <span className="text-gray-500 font-medium">
                          Student Name:{' '}
                        </span>
                        <span className="font-semibold text-gray-800">
                          {item.studentName || '-'}
                        </span>
                      </p>
                      <p>
                        <span className="text-gray-500 font-medium">
                          Class:{' '}
                        </span>
                        <span className="text-gray-800">{className}</span>
                      </p>
                      <p>
                        <span className="text-gray-500 font-medium">
                          Address:{' '}
                        </span>
                        <span className="text-gray-800">
                          {item.address || '-'}
                        </span>
                      </p>
                    </div>
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-gray-800 text-white text-xs uppercase tracking-wide">
                          <th className="px-4 py-2 text-left">Description</th>
                          <th className="px-4 py-2 text-right">Amount (Rs.)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-100">
                          <td className="px-4 py-2 text-gray-700">
                            Total Fee Charged
                          </td>
                          <td className="px-4 py-2 text-right font-medium text-gray-800">
                            {item.totalAmount.toLocaleString()}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="px-4 py-2 text-gray-700">Discount</td>
                          <td className="px-4 py-2 text-right text-green-600 font-medium">
                            - {item.discount.toLocaleString()}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="px-4 py-2 text-gray-700">
                            Amount Paid
                          </td>
                          <td className="px-4 py-2 text-right text-green-600 font-medium">
                            - {item.paidAmount.toLocaleString()}
                          </td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="px-4 py-3 font-bold text-gray-800 text-base">
                            Due Amount
                          </td>
                          <td
                            className={`px-4 py-3 text-right font-bold text-base ${due > 0 ? 'text-red-600' : 'text-green-600'}`}
                          >
                            Rs. {due.toLocaleString()}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DueSlipModal
