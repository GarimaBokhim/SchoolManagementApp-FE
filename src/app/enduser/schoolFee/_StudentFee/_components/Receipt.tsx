import {
  useGetAllStudents,
  useGetStudentById,
} from '@/app/enduser/(StudentManagement)/Student/hooks'

type ReceiptProps = {
  label?: string
  showSeparator?: boolean
  schoolName?: string
  paymentDate?: string
  paymentMethod?: string
  studentName?: string
  className?: string
  reference?: string
  amountPaid?: number | string
}

const Receipt = ({
  label = '',
  showSeparator = false,
  schoolName = '',
  paymentDate = '',
  paymentMethod = '',
  className = '',
  reference = '',
  amountPaid = '',
}: ReceiptProps) => {
  const { data } = useGetAllStudents()
  const { data: allstudent } = useGetStudentById(data?.items?.[0]?.id || '')
  console.log('allstudent', allstudent)
  return (
    <div
      style={{
        borderBottom: showSeparator ? '2px dashed #000' : 'none',
        paddingBottom: '15px',
        marginBottom: '15px',
        pageBreakInside: 'avoid',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          borderBottom: '1px solid #000',
          paddingBottom: '6px',
          marginBottom: '8px',
        }}
      >
        <h3 style={{ margin: 0 }}>{schoolName}</h3>
        <div>STUDENT PAYMENT RECEIPT ({label})</div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '4px',
        }}
      >
        <span>
          Date: <b>{paymentDate}</b>
        </span>
        <span>
          Method: <b>{paymentMethod}</b>
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '6px',
        }}
      >
        <span>
          Student:{' '}
          <b>
            {allstudent?.firstName} {allstudent?.middleName}{' '}
            {allstudent?.lastName}
          </b>
        </span>
        <span>
          Class: <b>{className}</b>
        </span>
      </div>

      <div style={{ marginBottom: '6px' }}>
        Reference: <b>{reference || '-'}</b>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <td style={{ border: '1px solid #000', padding: '4px' }}>
              Amount Paid
            </td>
            <td style={{ border: '1px solid #000', padding: '4px' }}>
              <b>{amountPaid}</b>
            </td>
          </tr>
        </tbody>
      </table>

      <div
        style={{
          marginTop: '30px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>Cashier Signature</span>
        <span>Authorized By</span>
      </div>
    </div>
  )
}

export default Receipt
