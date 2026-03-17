'use client'

import { useForm, SubmitHandler } from 'react-hook-form'
import toast, { Toaster } from 'react-hot-toast'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import { InputElement } from '@/components/Input/InputElement'
import { useAddPaymentRecord } from '../hooks'
import { IPaymentRecord } from '../types/IStudentFee'
import useErrorHandler from '@/components/helpers/ErrorHandling'
import { useState, useRef, useCallback } from 'react'
import PaymentReceiptPrint from './printpaymentrecordindividually'
import { useReactToPrint } from 'react-to-print'

interface PaymentRecordFormProps {
  classid: string
  studentid: string
  onClose?: () => void
}

const PaymentRecordForm: React.FC<PaymentRecordFormProps> = ({
  studentid,
  classid,
  onClose,
}) => {
  const { handleError, clearError } = useErrorHandler()
  const { mutate: addPayment, isPending } = useAddPaymentRecord()

  const [printData, setPrintData] = useState<IPaymentRecord | null>(null)
  const componentRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  })

  const handleReadyToPrint = useCallback(() => {
    setTimeout(() => {
      handlePrint()
    }, 100)
  }, [handlePrint])

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
      onSuccess: () => {
        toast.success('Payment recorded successfully!')

        // ✅ trigger print flow
        setPrintData(data)

        form.reset({
          studentid,
          classid,
          amountPaid: 0,
          paymentDate: new Date().toISOString().split('T')[0],
          paymentMethod: 1,
          reference: '',
        })

        onClose?.()
      },
      onError: (error) => {
        toast.error(handleError(error) || 'Failed to record payment')
      },
    })
  }

  return (
    <>
      <Toaster position="top-right" />

      {/* FORM */}
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

      {/* PRINT AREA (hidden) */}
      {printData && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            opacity: 0,
            pointerEvents: 'none',
          }}
        >
          <div ref={componentRef}>
            <PaymentReceiptPrint
              data={printData}
              onReady={handleReadyToPrint}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default PaymentRecordForm
