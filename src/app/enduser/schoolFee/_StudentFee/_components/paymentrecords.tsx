'use client'

import { useForm, SubmitHandler } from 'react-hook-form'
import toast, { Toaster } from 'react-hot-toast'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import { InputElement } from '@/components/Input/InputElement'
import { useAddPaymentRecord } from '../hooks'
import { IPaymentRecord } from '../types/IStudentFee'
import useErrorHandler from '@/components/helpers/ErrorHandling'
import { useState } from 'react'
import PaymentReceiptPrint from './printpaymentrecordindividually'
import { Printer } from 'lucide-react'
import { printReceipt } from '@/utils/printReceipt.ts'
import { useGetSchoolById } from '@/app/crmadmin/Setup/School/hooks'
import { useGetClassById } from '@/app/enduser/(Academics)/Class/hooks'
import { useGetAllStudents } from '@/app/teacher/Students/Student/hooks'

const PAYMENT_METHOD_OPTIONS = [
  { label: 'Cash', value: 0 },
  { label: 'Credit Card', value: 1 },
  { label: 'Debit Card', value: 2 },
  { label: 'Bank Transfer', value: 3 },
  { label: 'Mobile Payment', value: 4 },
  { label: 'Cheque', value: 5 },
]

const getPaymentMethodLabel = (value: number): string =>
  PAYMENT_METHOD_OPTIONS.find((p) => p.value === value)?.label ?? String(value)

interface PaymentRecordFormProps {
  classid: string
  studentid: string
  totalAmount?: number
  dueAmount?: number
  onClose?: () => void
}

const PaymentRecordForm: React.FC<PaymentRecordFormProps> = ({
  studentid,
  classid,
  onClose,
  dueAmount,
  totalAmount,
}) => {
  const { data: classData } = useGetClassById(classid)

  const { data: allStudent } = useGetAllStudents('?IsPagination=false')
  const { handleError, clearError } = useErrorHandler()
  const { mutate: addPayment, isPending } = useAddPaymentRecord()

  const storedUser = localStorage.getItem('userDetails')
  let schoolId = ''
  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser)
      schoolId = parsedUser.schoolId
    } catch (error) {
      console.error('Failed to parse user details:', error)
    }
  }
  const { data: SchoolData } = useGetSchoolById(schoolId)

  const getStudentName = (studentId: string): string => {
    const student = allStudent?.Items?.find(
      (i) => i.id != null && String(i.id) === String(studentId)
    )
    if (!student) return '-'
    return [student.firstName, student.middleName, student.lastName]
      .filter(Boolean)
      .join(' ')
  }

  const [printData, setPrintData] = useState<IPaymentRecord | null>(null)
  const [showPrintOption, setShowPrintOption] = useState(false)

  const form = useForm<IPaymentRecord>({
    defaultValues: {
      studentid,
      classid,
      amountPaid: 0,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: 1,
      reference: '',
    },
  })

  const onSubmit: SubmitHandler<IPaymentRecord> = (data) => {
    clearError()

    if (data.amountPaid <= 0) {
      toast.error('Amount must be greater than zero')
      return
    }

    addPayment(data, {
      onSuccess: (response) => {
        toast.success('Payment recorded successfully!')
        setPrintData(response)
        setShowPrintOption(true)

        form.reset({
          studentid,
          classid,
          amountPaid: 0,
          paymentDate: new Date().toISOString().split('T')[0],
          paymentMethod: 1,
          reference: '',
        })
      },
      onError: (error) => {
        toast.error(handleError(error) || 'Failed to record payment')
      },
    })
  }

  const handlePrint = () => {
    if (!printData) return

    printReceipt({
      schoolName: SchoolData?.name,
      schoolAddress: SchoolData?.address,
      schoolPan: SchoolData?.pan,
      schoolLogoUrl: '/assets/nepal.png',
      paymentDate: printData.paymentDate,
      paymentMethod: getPaymentMethodLabel(printData.paymentMethod),
      studentName: getStudentName(studentid),
      className: classData?.name,
      reference: printData.reference,
      amountPaid: printData.amountPaid,
      dueAmount: dueAmount,
      totalAmount: totalAmount,
      receiptNumber: printData.receiptNumber,
      // feeStructure: printData.feeStructure,
    })
  }

  if (showPrintOption && printData) {
    return (
      <>
        <Toaster position="top-right" />

        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 no-print">
          <div className="w-full max-w-md bg-white rounded-2xl border shadow-lg p-8 flex flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-800">
                Payment Recorded!
              </h2>
              <p className="text-sm text-gray-500">
                Would you like to print the receipt?
              </p>
            </div>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => {
                  setShowPrintOption(false)
                  setPrintData(null)
                  onClose?.()
                }}
                className="flex-1 cursor-pointer px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Skip
              </button>
              <button
                onClick={handlePrint}
                className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
              >
                <Printer size={15} />
                Print Receipt
              </button>
            </div>
          </div>
        </div>
        <div className="print-section">
          <PaymentReceiptPrint data={printData} onReady={() => {}} />
        </div>
      </>
    )
  }

  return (
    <>
      <Toaster position="top-right" />

      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 no-print">
        <div className="w-full max-w-md bg-white rounded-2xl border shadow-lg">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">
              Add Payment Record
            </h2>
          </div>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="px-6 py-6 flex flex-col gap-4"
          >
            <InputElement
              label="Payment Date *"
              inputType="date"
              name="paymentDate"
              form={form}
              required
            />
            <input type="hidden" {...form.register('classid')} />
            <InputElement
              label="Amount *"
              inputType="number"
              name="amountPaid"
              form={form}
              required
            />

            <select
              {...form.register('paymentMethod', { valueAsNumber: true })}
              className="h-[42px] px-3 border rounded-md"
            >
              <option value={0}>Cash</option>
              <option value={1}>Credit Card</option>
              <option value={2}>Debit Card</option>
              <option value={3}>Bank Transfer</option>
              <option value={4}>Mobile Payment</option>
              <option value={5}>Cheque</option>
            </select>

            <InputElement
              label="Reference"
              inputType="text"
              name="reference"
              form={form}
            />

            <ButtonElement
              type="submit"
              text={isPending ? 'Adding...' : 'Add Payment'}
              disabled={isPending}
            />
          </form>
        </div>
      </div>
    </>
  )
}

export default PaymentRecordForm
