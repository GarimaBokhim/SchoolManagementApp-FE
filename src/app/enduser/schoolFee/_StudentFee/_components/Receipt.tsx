import { IFeeStructureItem } from '../types/IStudentFee'

type ReceiptProps = {
  label?: string
  showSeparator?: boolean
  schoolName?: string
  schoolAddress?: string
  schoolPan?: string
  schoolLogoUrl?: string
  paymentDate?: string
  paymentMethod?: string
  studentName?: string
  className?: string
  reference?: string
  amountPaid?: number | string
  dueAmount?: number | string
  totalAmount?: number | string
  receiptNumber?: string
  feeStructure?: IFeeStructureItem[]  // ✅ new
}

const Receipt = ({
  label = '',
  showSeparator = false,
  schoolName = '',
  schoolAddress = '',
  schoolPan = '',
  schoolLogoUrl = '',
  paymentDate = '',
  paymentMethod = '',
  studentName = '',
  className = '',
  reference = '',
  amountPaid = '',
  dueAmount = '',
  totalAmount = '',
  receiptNumber = '',
  feeStructure = [],  // ✅ new
}: ReceiptProps) => {

  const feeSubtotal = feeStructure.reduce((sum, f) => sum + f.totalAmount, 0)

  const cellStyle: React.CSSProperties = {
    border: '1px solid #000',
    padding: '3px 6px',
  }

  const headerCellStyle: React.CSSProperties = {
    ...cellStyle,
    background: '#f3f3f3',
    fontWeight: 'bold',
  }

  return (
    <div
      style={{
        borderBottom: showSeparator ? '2px dashed #000' : 'none',
        paddingBottom: '15px',
        marginBottom: '15px',
        pageBreakInside: 'avoid',
        position: 'relative',
      }}
    >
      {/* Watermark logo */}
      {schoolLogoUrl && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          <img
            src={schoolLogoUrl}
            alt=""
            style={{ width: '180px', height: '180px', objectFit: 'contain', opacity: 0.07 }}
          />
        </div>
      )}

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div
          style={{
            textAlign: 'center',
            borderBottom: '1px solid #000',
            paddingBottom: '6px',
            marginBottom: '8px',
            position: 'relative',
          }}
        >
          {schoolLogoUrl && (
            <img
              src={schoolLogoUrl}
              alt="school logo"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '44px',
                height: '44px',
                objectFit: 'contain',
              }}
            />
          )}
          <h3 style={{ margin: 0 }}>{schoolName}</h3>
          {schoolAddress && (
            <div style={{ fontSize: '11px', color: '#444', marginBottom: '1px' }}>
              {schoolAddress}
            </div>
          )}
          {schoolPan && (
            <div style={{ fontSize: '11px', color: '#444' }}>
              PAN: <b>{schoolPan}</b>
            </div>
          )}
          <div>STUDENT PAYMENT RECEIPT ({label})</div>
        </div>

        {/* Receipt Number */}
        <div style={{ marginBottom: '4px' }}>
          Receipt No: <b>{receiptNumber || 'N/A'}</b>
        </div>

        {/* Date and Method */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span>Date: <b>{paymentDate}</b></span>
          <span>Method: <b>{paymentMethod}</b></span>
        </div>

        {/* Student and Class */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span>Student: <b>{studentName || '-'}</b></span>
          <span>Class: <b>{className}</b></span>
        </div>

        {/* Reference */}
        <div style={{ marginBottom: '8px' }}>
          Reference: <b>{reference || '-'}</b>
        </div>

        {/* ✅ Fee Breakdown Table */}
        {feeStructure.length > 0 && (
          <div style={{ marginBottom: '10px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
              <thead>
                <tr>
                  <th style={headerCellStyle}>Fee Type</th>
                  <th style={{ ...headerCellStyle, textAlign: 'right' }}>Amount</th>
                  <th style={{ ...headerCellStyle, textAlign: 'right' }}>Times</th>
                  <th style={{ ...headerCellStyle, textAlign: 'right' }}>Discount</th>
                  <th style={{ ...headerCellStyle, textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {feeStructure.map((fee, index) => (
                  <tr key={index}>
                    <td style={cellStyle}>{fee.feeTypeName}</td>
                    <td style={{ ...cellStyle, textAlign: 'right' }}>{fee.amount}</td>
                    <td style={{ ...cellStyle, textAlign: 'right' }}>{fee.times}</td>
                    <td style={{ ...cellStyle, textAlign: 'right' }}>{fee.discountAmount}</td>
                    <td style={{ ...cellStyle, textAlign: 'right' }}>{fee.totalAmount}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td
                    colSpan={4}
                    style={{ ...cellStyle, textAlign: 'right', fontWeight: 'bold' }}
                  >
                    Subtotal
                  </td>
                  <td style={{ ...cellStyle, textAlign: 'right', fontWeight: 'bold' }}>
                    {feeSubtotal.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* Amount Summary Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #000', padding: '4px' }}>Total Amount</td>
              <td style={{ border: '1px solid #000', padding: '4px' }}>
                <b>{totalAmount !== '' && totalAmount !== undefined ? totalAmount : 'N/A'}</b>
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #000', padding: '4px' }}>Amount Paid</td>
              <td style={{ border: '1px solid #000', padding: '4px' }}>
                <b>{amountPaid}</b>
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #000', padding: '4px' }}>Due Amount</td>
              <td style={{ border: '1px solid #000', padding: '4px' }}>
                <b>{dueAmount !== '' && dueAmount !== undefined ? dueAmount : 'N/A'}</b>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Signatures */}
        <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between' }}>
          <span>Cashier Signature</span>
          <span>Authorized By</span>
        </div>

      </div>
    </div>
  )
}

export default Receipt