import { useEffect, useMemo, useRef } from 'react'
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
  const contentRef = useRef<HTMLDivElement>(null)
  const { data: schools } = useGetAllSchool()
  const { data: students } = useGetAllStudents('?IsPagination=false')
  const { data: classData } = useGetClassById(data.classid)
  const { data: feeSummary } = useGetStudentFeesummary(
    `?studentId=${data.studentid}&classId=${data.classid}`
  )

  const matchedSummary =
    feeSummary?.Items?.find(
      (item) => item.receiptNumber === data.receiptNumber
    ) ?? feeSummary?.Items?.[0]

  const dueAmount = matchedSummary?.dueAmount
  const totalAmount = matchedSummary?.totalAmount
  const feeStructure = matchedSummary?.FeeStructureForFeeSummaryDTOs ?? []

  const schoolId = useMemo(() => {
    try {
      const storedUser = localStorage.getItem('userDetails')
      if (!storedUser) return ''
      return JSON.parse(storedUser)?.schoolId ?? ''
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
      const timeout = setTimeout(() => {
        console.log('Component content is ready, calling onReady')
        onReady?.()
      }, 200)
      return () => clearTimeout(timeout)
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
    return `http://khaneypaniapp.runasp.net/${raw}`
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
    totalAmount,
    dueAmount,
    receiptNumber: data.receiptNumber,
    feeStructure,
  }

  if (!isReady) return null

  return (
    <div
      ref={contentRef}
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '16px',
        background: 'white',
        WebkitPrintColorAdjust: 'exact',
        printColorAdjust: 'exact',
      }}
    >
      <div
        style={{
          width: '700px',
          border: '1px solid #000',
          padding: '10px',
          fontSize: '12px',
          fontFamily: 'Arial, sans-serif',
          background: '#fff',
          WebkitPrintColorAdjust: 'exact',
          printColorAdjust: 'exact',
        }}
      >
        <Receipt label="School Copy" showSeparator {...receiptData} />
        <Receipt label="Student Copy" {...receiptData} />
      </div>
    </div>
  )
}

export default PaymentReceiptPrint
