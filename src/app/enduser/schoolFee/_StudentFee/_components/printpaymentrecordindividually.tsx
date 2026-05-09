import { useEffect, useMemo } from 'react'
import { useGetAllSchool } from '@/app/admin/Setup/School/hooks'
import { useGetAllStudents } from '@/app/enduser/(StudentManagement)/Student/hooks'
import { useGetClassById } from '@/app/enduser/(Academics)/Class/hooks'
import { useGetStudentFeesummary } from '../hooks'
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

  const { data: feeSummary } = useGetStudentFeesummary(
    `?studentId=${data.studentid}&classId=${data.classid}`
  )

  const dueAmount = feeSummary?.Items?.[0]?.dueAmount
  const totalAmount = feeSummary?.Items?.[0]?.totalAmount
  // ── pull feeStructureDTOs from the summary ──
  const feeStructureDTOs = feeSummary?.Items?.[0]?.feeStructureDTOs ?? []

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

  const school = useMemo(() => {
    if (!schools?.Items?.length) return null
    return schools.Items.find((s) => s.id === schoolId) ?? schools.Items[0]
  }, [schools, schoolId])

  const isReady =
    schools?.Items?.length && students?.Items?.length && classData && feeSummary

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

  const getLogoUrl = () => {
    const raw = school?.imageUrl
    if (!raw || raw === '-' || raw === 'string' || raw === '') return ''
    return `https://schoolapp.netraverselabs.com/${raw}`
  }

  const receiptData = {
    schoolName: school?.name ?? '',
    schoolAddress: school?.address ?? '',
    schoolPan: school?.pan ?? '',
    schoolLogoUrl: getLogoUrl(),
    paymentDate: formattedPaymentDate,
    paymentMethod: paymentMethods[data.paymentMethod] ?? '-',
    studentName,
    className: classData?.name ?? '-',
    reference: data.reference ?? '-',
    amountPaid: data.amountPaid,
    totalAmount: totalAmount,
    dueAmount: dueAmount,
    receiptNumber: data.receiptNumber,
    feeStructureDTOs,   // ← passed to both copies
  }

  if (!isReady) return null

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
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
        <Receipt label="School Copy" showSeparator {...receiptData} />
        <Receipt label="Student Copy" {...receiptData} />
      </div>
    </div>
  )
}

export default PaymentReceiptPrint