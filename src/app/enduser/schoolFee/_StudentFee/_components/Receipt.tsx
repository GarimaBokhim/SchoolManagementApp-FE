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
}: ReceiptProps) => {
  
  return (
    <div
      style={{
        borderBottom: showSeparator ? '2px dashed #000' : 'none',
        paddingBottom: '15px',
        marginBottom: '15px',
        pageBreakInside: 'avoid',
        position: 'relative',          // + needed for watermark
      }}
    >
      {/* + Watermark logo behind content */}
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

      {/* + z-index wrapper so content sits above watermark */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            textAlign: 'center',
            borderBottom: '1px solid #000',
            paddingBottom: '6px',
            marginBottom: '8px',
            position: 'relative',      // + for logo positioning
          }}
        >
          {/* + Logo top-left */}
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
          {/* + Address and PAN below school name */}
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
            Student: <b>{studentName || '-'}</b>  
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
    </div>
  )
}

export default Receipt