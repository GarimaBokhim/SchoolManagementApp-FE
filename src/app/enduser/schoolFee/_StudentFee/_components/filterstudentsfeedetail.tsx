/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import toast, { Toaster } from 'react-hot-toast'
import { Filter, Printer, RotateCcw, X } from 'lucide-react'

import { ButtonElement } from '@/components/Buttons/ButtonElement'
import { InputElement } from '@/components/Input/InputElement'
import useErrorHandler from '@/components/helpers/ErrorHandling'

import {
  IFilterStudentFee,
  IPaymentRecord,
  Istudentfeesummary,
} from '../types/IStudentFee'
import { useGetStudentFeesummary } from '../hooks'
import { AppCombobox } from '@/components/Input/ComboBox'
import { useGetStudentByClass } from '@/app/enduser/(StudentManagement)/Student/hooks'
import { useGetAllClass } from '@/app/enduser/(Academics)/Class/hooks'
import PaymentReceiptPrint from './printpaymentrecordindividually'

interface ViewStudentFeeFormProps {
  studentId?: string
  classId?: string
}

const ViewStudentFeeForm = ({
  studentId,
  classId,
}: ViewStudentFeeFormProps) => {
  const { handleError, clearError } = useErrorHandler()

  const { data: allClasses } = useGetAllClass()

  const [selectedStudentId, setSelectedStudentId] = useState(studentId ?? '')
  const [selectedClassId, setSelectedClassId] = useState(classId ?? '')

  const { data: allStudents } = useGetStudentByClass(selectedClassId)
  const { data: allclasses } = useGetAllClass()
  const [params, setParams] = useState(() => {
    if (studentId && classId) {
      return `?studentId=${encodeURIComponent(studentId)}&classId=${encodeURIComponent(classId)}`
    } else if (classId) {
      return `?classId=${encodeURIComponent(classId)}`
    } else if (studentId) {
      return `?studentId=${encodeURIComponent(studentId)}`
    }
    return ''
  })

  const componentRef = useRef<HTMLDivElement>(null)
  const [printData, setPrintData] = useState<IPaymentRecord | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  const form = useForm<IFilterStudentFee>({
    defaultValues: {
      studentId: studentId ?? '',
      classId: classId ?? '',
      startDate: '',
      endDate: '',
    },
  })

  const { setValue } = form

  const {
    data: filteredStudentFee,
    refetch,
    isLoading,
  } = useGetStudentFeesummary(params)

  const handlePrintDirect = () => {
    if (!componentRef.current) {
      toast.error('No content to print')
      return
    }

    const printContent = componentRef.current.innerHTML
    const printWindow = window.open('', '', 'width=900,height=1000')

    if (!printWindow) {
      toast.error('Could not open print window. Please check popup settings.')
      return
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Payment Receipt</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              background: white;
              padding: 20px;
            }
            img {
              max-width: 100%;
              height: auto;
            }
            table {
              border-collapse: collapse;
              width: 100%;
            }
            table, td, th {
              border: 1px solid #000 !important;
            }
            td, th {
              padding: 4px 6px;
            }
            h3, div {
              margin: 0;
            }
            @media print {
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              body {
                margin: 0;
                padding: 10px;
              }
            }
          </style>
        </head>
        <body>
          ${printContent}
          <script>
            window.onload = function() {
              setTimeout(() => {
                window.print();
              }, 100);
            };
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  useEffect(() => {
    if (!studentId || !classId) return

    queueMicrotask(() => {
      setSelectedStudentId(studentId)
      setValue('studentId', studentId)
      setSelectedClassId(classId)
      setValue('classId', classId)

      const query = `?studentId=${encodeURIComponent(studentId)}&classId=${encodeURIComponent(classId)}`
      setParams(query)
    })

    refetch()
  }, [studentId, classId])

  const onSubmit: SubmitHandler<IFilterStudentFee> = async (formData) => {
    clearError()
    try {
      const queryParams = [
        formData.studentId && `studentId=${formData.studentId}`,
        formData.startDate && `startDate=${formData.startDate}`,
        formData.endDate && `endDate=${formData.endDate}`,
        formData.classId
          ? `classId=${formData.classId}`
          : classId
            ? `classId=${classId}`
            : '',
      ]
        .filter(Boolean)
        .join('&')

      const fullQuery = queryParams ? `?${queryParams}` : ''

      await toast.promise(
        (async () => {
          setParams(fullQuery)
          await refetch()
        })(),
        {
          loading: 'Fetching data...',
          success: 'Data fetched successfully!',
        }
      )
    } catch (error) {
      toast.error(handleError(error))
    }
  }

  const onClear = () => {
    form.reset({
      studentId: '',
      classId: classId ?? '',
      startDate: '',
      endDate: '',
    })
    setSelectedStudentId('')
    setSelectedClassId(classId ?? '')

    if (classId) {
      setParams(`?classId=${encodeURIComponent(classId)}`)
    } else {
      setParams('')
    }
    refetch()
  }

  const getPaymentMethodLabel = (value: number) => {
    switch (value) {
      case 0:
        return 'Cash'
      case 1:
        return 'Credit Card'
      case 2:
        return 'Debit Card'
      case 3:
        return 'Bank Transfer'
      case 4:
        return 'Mobile Payment'
      case 5:
        return 'Cheque'
      default:
        return 'Unknown'
    }
  }

  const handlePrint = (fee: Istudentfeesummary) => {
    const data: IPaymentRecord = {
      studentid: studentId ?? '',
      classid: classId ?? fee.classId,
      amountPaid: fee.paidAmount,
      paymentDate: fee.paymentDate || new Date().toISOString(),
      paymentMethod: fee.paymentMethod,
      reference: fee.reference || '-',
      receiptNumber: fee.receiptNumber || '-',
    }

    setPrintData(data)
    setShowPreview(true)
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="bg-white p-5 rounded-xl border shadow-sm mb-4 flex justify-center">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-start gap-3 w-full max-w-[900px] flex-wrap sm:flex-nowrap"
        >
          <div className="flex-none w-[250px]">
            <AppCombobox
              value={selectedStudentId}
              dropDownWidth="w-full"
              dropdownPositionClass="absolute"
              label="Student Name"
              name="studentId"
              form={form}
              options={allStudents?.Items ?? []}
              selected={
                allStudents?.Items?.find((s) => s.id === selectedStudentId) ??
                null
              }
              onSelect={(student) => {
                const id = student?.id ?? ''
                setSelectedStudentId(id)
                form.setValue('studentId', id)
                const query = id
                  ? `?studentId=${encodeURIComponent(id)}&classId=${encodeURIComponent(selectedClassId || classId || '')}`
                  : selectedClassId
                    ? `?classId=${encodeURIComponent(selectedClassId)}`
                    : classId
                      ? `?classId=${encodeURIComponent(classId)}`
                      : ''
                setParams(query)
                refetch()
              }}
              getLabel={(s) =>
                s
                  ? [s.firstName, s.middleName, s.lastName]
                      .filter(Boolean)
                      .join(' ')
                  : '-'
              }
              getValue={(s) => s?.id ?? ''}
              className="h-[42px]"
            />
          </div>

          <div className="flex-none w-[250px]">
            <AppCombobox
              value={selectedClassId}
              dropDownWidth="w-full"
              dropdownPositionClass="absolute"
              label="Class"
              name="classId"
              form={form}
              options={allclasses?.Items ?? []}
              selected={
                allclasses?.Items?.find((s) => s.id === selectedClassId) ?? null
              }
              onSelect={(cls) => {
                const id = cls?.id ?? ''
                setSelectedClassId(id)
                form.setValue('classId', id)
                const query = id
                  ? `?studentId=${encodeURIComponent(selectedStudentId)}&classId=${encodeURIComponent(id)}`
                  : selectedStudentId
                    ? `?studentId=${encodeURIComponent(selectedStudentId)}`
                    : ''
                setParams(query)
                refetch()
              }}
              getLabel={(s) => (s ? `${s.name}` : '-')}
              getValue={(s) => s?.id ?? ''}
              className="h-[42px]"
            />
          </div>

          <div className="flex-none w-[170px]">
            <InputElement
              label="Start Date"
              inputType="date"
              name="startDate"
              form={form}
              className="w-full h-[42px]"
            />
          </div>

          <div className="flex-none w-[170px]">
            <InputElement
              label="End Date"
              inputType="date"
              name="endDate"
              form={form}
              className="w-full h-[42px]"
            />
          </div>

          <div className="flex-none">
            <ButtonElement
              type="submit"
              text="Filter"
              icon={<Filter size={14} />}
              className="h-[42px] px-6 !bg-emerald-600 hover:!bg-emerald-700"
            />
          </div>

          <div className="flex-none">
            <ButtonElement
              type="button"
              text="Clear"
              icon={<RotateCcw size={14} />}
              onClick={onClear}
              className="h-[42px] px-6 !bg-gray-600 hover:!bg-gray-700"
            />
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3">S.N</th>
              <th className="px-4 py-3">Class</th>
              <th className="px-4 py-3">Paid Amount</th>
              <th className="px-4 py-3">Payment Method</th>
              <th className="px-4 py-3">Total Amount</th>
              <th className="px-4 py-3">Due Amount</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : filteredStudentFee?.Items?.length ? (
              filteredStudentFee.Items.map(
                (fee: Istudentfeesummary, index: number) => (
                  <tr key={index}>
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">
                      {allClasses?.Items?.find((c) => c.id === fee.classId)
                        ?.name ?? '-'}
                    </td>
                    <td className="px-4 py-3">{fee.paidAmount}</td>
                    <td className="px-4 py-3">
                      {getPaymentMethodLabel(fee.paymentMethod)}
                    </td>
                    <td className="px-4 py-3">{fee.totalAmount}</td>
                    <td className="px-4 py-3">{fee.dueAmount}</td>
                    <td className="px-4 py-3">
                      <ButtonElement
                        text=""
                        icon={<Printer size={14} />}
                        onClick={() => handlePrint(fee)}
                      />
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td colSpan={7} className="py-6 text-center text-gray-500">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Print Preview</h2>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 bg-gray-50">
              <div
                ref={componentRef}
                className="bg-white rounded border shadow-sm"
              >
                {printData && (
                  <PaymentReceiptPrint
                    data={printData}
                    onReady={() => console.log('Receipt ready for printing')}
                  />
                )}
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end gap-2">
              <ButtonElement
                type="button"
                text="Close"
                onClick={() => {
                  setShowPreview(false)
                  setPrintData(null)
                }}
                className="px-4 py-2 !bg-gray-500 hover:!bg-gray-600"
              />
              <ButtonElement
                type="button"
                text="Print"
                icon={<Printer size={14} />}
                onClick={handlePrintDirect}
                className="px-4 py-2 !bg-blue-600 hover:!bg-blue-700 text-white"
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ViewStudentFeeForm
