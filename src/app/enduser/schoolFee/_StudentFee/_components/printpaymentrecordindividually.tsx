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
  const { data: students } = useGetAllStudents('?IsPagination=false')
  const { data: classData } = useGetClassById(data.classid)


  const schoolId = useMemo(() => {
    try {
      const storedUser = localStorage.getItem('userDetails')
      if (!storedUser) return ''
      const parsedUser = JSON.parse(storedUser)
      return parsedUser.schoolId ?? ''
    } catch {
      return ''
    }
  }, [])

  // Match school by id instead of always picking the first one
  const schoolName = useMemo(() => {
    if (!schools?.Items?.length) return ''
    const matched = schools.Items.find((s) => s.id === schoolId)
    return matched?.name ?? schools.Items[0]?.name ?? ''
  }, [schools, schoolId])

  const isReady = schools?.Items?.length && students?.Items?.length && classData

  useEffect(() => {
    if (isReady) {
      onReady?.()
    }
  }, [isReady, onReady])

  const studentName = useMemo(() => {
    const student = students?.Items?.find((s) => s.id === data.studentid)
    if (!student) return '-'
    return [student.firstName, student.middleName, student.lastName]
      .filter(Boolean)
      .join(' ')
  }, [students, data.studentid])

  const formattedPaymentDate = data.paymentDate
    ? new Date(data.paymentDate).toISOString().split('T')[0]
    : '-'

  const receiptData = {
    schoolName,
    paymentDate: formattedPaymentDate,
    paymentMethod: paymentMethods[data.paymentMethod] ?? '-',
    studentName,
    className: classData?.name ?? '-',
    reference: data.reference ?? '-',
    amountPaid: data.amountPaid,
  }

  if (!isReady) return null

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
      {/* School copy */}
      <Receipt label="School Copy" showSeparator {...receiptData} />

      {/* Student copy */}
      <Receipt label="Student Copy" {...receiptData} />
    </div>
  )
}

export default PaymentReceiptPrint