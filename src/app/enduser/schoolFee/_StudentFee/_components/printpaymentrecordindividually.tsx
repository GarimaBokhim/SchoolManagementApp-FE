import { useEffect, useMemo } from 'react'
import { useGetAllSchool } from '@/app/admin/Setup/School/hooks'
import { useGetAllStudents } from '@/app/enduser/(StudentManagement)/Student/hooks'
import { useGetClassById } from '@/app/enduser/(Academics)/Class/hooks'
import { IPaymentRecord } from '../types/IStudentFee'
import Receipt from './Receipt'

type Props = {
  data: IPaymentRecord
  onReady?: () => void
}

const paymentMethods: Record<number, string> = {
  0: 'Cash',
  1: 'Credit Card',
  2: 'Debit Card',
  3: 'Bank Transfer',
  4: 'Mobile Payment',
  5: 'Cheque',
}

const PaymentReceiptPrint = ({ data, onReady }: Props) => {
  const { data: schools } = useGetAllSchool()
  const { data: students } = useGetAllStudents()
  const { data: classData } = useGetClassById(data.classid)

  const isReady = schools?.Items?.length && students?.Items?.length && classData

  useEffect(() => {
    if (isReady) {
      onReady?.()
    }
  }, [isReady, onReady])

  const schoolName = schools?.Items?.[0]?.name ?? ''

  const studentName = useMemo(() => {
    return (
      students?.Items?.find((s) => s.id === data.studentid)?.firstName ?? '-'
    )
  }, [students, data.studentid])

  const receiptData = {
    schoolName,
    paymentDate: data.paymentDate,
    paymentMethod: paymentMethods[data.paymentMethod] ?? '-',
    studentName,
    className: classData?.name ?? '-',
    reference: data.reference ?? '-',
    amountPaid: data.amountPaid,
  }

  if (!isReady) return null // ⛔ prevent premature render

  return (
    <div
      style={{
        width: '700px',
        border: '1px solid #000',
        padding: '10px',
        fontSize: '12px',
        fontFamily: 'Arial, sans-serif',
        background: '#fff',
      }}
    >
      <Receipt label="First Installment" showSeparator {...receiptData} />
      <Receipt label="Second Installment" {...receiptData} />
    </div>
  )
}

export default PaymentReceiptPrint
