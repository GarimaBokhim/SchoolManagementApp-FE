type FeeStructureDTO = {
  feeTypeId?: string
  feeTypeName?: string
  amount?: number
  discountAmount?: number
  times?: number
  totalAmount?: number
  feePaidType?: number
}

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
  feeStructureDTOs?: FeeStructureDTO[]
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
  feeStructureDTOs = [],
}: ReceiptProps) => {
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
      {/* Watermark logo behind content */}
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

      {/* z-index wrapper so content sits above watermark */}
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
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '4px',
          }}
        >
          <span>Date: <b>{paymentDate}</b></span>
          <span>Method: <b>{paymentMethod}</b></span>
        </div>

        {/* Student and Class */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '6px',
          }}
        >
          <span>Student: <b>{studentName || '-'}</b></span>
          <span>Class: <b>{className}</b></span>
        </div>

        {/* Reference */}
        <div style={{ marginBottom: '6px' }}>
          Reference: <b>{reference || '-'}</b>
        </div>

        {/* ── Fee Breakdown Table ─────────────────────────────── */}
        {feeStructureDTOs && feeStructureDTOs.length > 0 && (
          <div style={{ marginBottom: '8px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px', fontSize: '11px' }}>
              Fee Breakdown
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f0f0f0' }}>
                  <th style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'left' }}>Fee Type</th>
                  <th style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'right' }}>Amount</th>
                  <th style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>Times</th>
                  <th style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'right' }}>Discount</th>
                  <th style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {feeStructureDTOs.map((fee, idx) => (
                  <tr key={fee.feeTypeId ?? idx}>
                    <td style={{ border: '1px solid #000', padding: '3px 5px' }}>
                      {fee.feeTypeName || '-'}
                    </td>
                    <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'right' }}>
                      {fee.amount !== undefined ? fee.amount.toLocaleString() : '-'}
                    </td>
                    <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>
                      {fee.times !== undefined ? fee.times : '-'}
                    </td>
                    <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'right' }}>
                      {fee.discountAmount !== undefined ? fee.discountAmount.toLocaleString() : '-'}
                    </td>
                    <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'right' }}>
                      <b>{fee.totalAmount !== undefined ? fee.totalAmount.toLocaleString() : '-'}</b>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* ── End Fee Breakdown Table ─────────────────────────── */}

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
    </div>
  )
}

export default Receipt