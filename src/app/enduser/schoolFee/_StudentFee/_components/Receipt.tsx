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
  feeStructure?: IFeeStructureItem[]
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
  feeStructure = [],
}: ReceiptProps) => {
  const feeSubtotal = feeStructure.reduce((sum, f) => sum + f.totalAmount, 0)

  const containerStyle: React.CSSProperties = {
    fontFamily: 'Arial, Helvetica, sans-serif',
    color: '#1a1a1a',
    borderBottom: showSeparator ? '2px dashed #999' : 'none',
    paddingBottom: '18px',
    marginBottom: '18px',
    pageBreakInside: 'avoid',
    position: 'relative',
    maxWidth: '780px',
    margin: '0 auto 18px auto',
  }

  const outerBorderStyle: React.CSSProperties = {
    border: '1px solid #c9ccd1',
    borderRadius: '10px',
    padding: '24px 28px',
    position: 'relative',
    overflow: 'hidden',
    background: '#ffffff',
  }

  const watermarkStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    zIndex: 0,
  }

  const contentWrapperStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 1,
  }

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    borderBottom: '1px solid #dcdfe4',
    paddingBottom: '14px',
    marginBottom: '16px',
  }

  const logoStyle: React.CSSProperties = {
    width: '64px',
    height: '64px',
    objectFit: 'contain',
    marginBottom: '8px',
  }

  const schoolNameStyle: React.CSSProperties = {
    margin: 0,
    fontSize: '22px',
    fontWeight: 800,
    letterSpacing: '0.3px',
    color: '#111827',
  }

  const schoolAddressStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#555',
    marginTop: '4px',
  }

  const schoolPanStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#555',
    marginTop: '2px',
  }

  const badgeRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '12px',
  }

  const badgeStyle: React.CSSProperties = {
    display: 'inline-block',
    background: '#0b3d91',
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '0.6px',
    padding: '6px 16px',
    borderRadius: '999px',
    textTransform: 'uppercase',
  }

  const labelTextStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#666',
    fontStyle: 'italic',
  }

  const infoSectionStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    columnGap: '24px',
    rowGap: '8px',
    marginBottom: '18px',
    fontSize: '13px',
    background: '#f8f9fb',
    border: '1px solid #eceef1',
    borderRadius: '8px',
    padding: '14px 18px',
  }

  const infoRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
  }

  const infoLabelStyle: React.CSSProperties = {
    color: '#666',
  }

  const infoValueStyle: React.CSSProperties = {
    fontWeight: 700,
    color: '#111827',
    textAlign: 'right',
  }

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 700,
    color: '#0b3d91',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
  }

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '12px',
    marginBottom: '18px',
    border: '1px solid #d6d9de',
    borderRadius: '6px',
    overflow: 'hidden',
  }

  const theadCellStyle: React.CSSProperties = {
    background: '#0b3d91',
    color: '#ffffff',
    padding: '9px 10px',
    fontWeight: 700,
    textAlign: 'left',
    border: '1px solid #0b3d91',
  }

  const theadCellRightStyle: React.CSSProperties = {
    ...theadCellStyle,
    textAlign: 'right',
  }

  const bodyCellStyle: React.CSSProperties = {
    padding: '8px 10px',
    border: '1px solid #e3e5e9',
  }

  const bodyCellRightStyle: React.CSSProperties = {
    ...bodyCellStyle,
    textAlign: 'right',
  }

  const zebraStyle: React.CSSProperties = {
    background: '#f5f7fa',
  }

  const subtotalLabelCellStyle: React.CSSProperties = {
    padding: '9px 10px',
    border: '1px solid #e3e5e9',
    textAlign: 'right',
    fontWeight: 700,
    background: '#eef1f5',
  }

  const subtotalValueCellStyle: React.CSSProperties = {
    padding: '9px 10px',
    border: '1px solid #e3e5e9',
    textAlign: 'right',
    fontWeight: 700,
    background: '#eef1f5',
  }

  const summaryWrapperStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '24px',
  }

  const summaryBoxStyle: React.CSSProperties = {
    width: '280px',
    border: '1px solid #d6d9de',
    borderRadius: '8px',
    overflow: 'hidden',
  }

  const summaryRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '9px 14px',
    fontSize: '13px',
    borderBottom: '1px solid #e3e5e9',
  }

  const summaryRowHighlightStyle: React.CSSProperties = {
    ...summaryRowStyle,
    background: '#eaf3ea',
  }

  const summaryLabelStyle: React.CSSProperties = {
    color: '#444',
  }

  const summaryValueStyle: React.CSSProperties = {
    fontWeight: 800,
    color: '#111827',
  }

  const footerStyle: React.CSSProperties = {
    marginTop: '36px',
  }

  const signatureRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '28px',
  }

  const signatureBlockStyle: React.CSSProperties = {
    textAlign: 'center',
    width: '160px',
  }

  const signatureLineStyle: React.CSSProperties = {
    borderTop: '1px solid #999',
    marginBottom: '6px',
    paddingTop: '4px',
    fontSize: '11px',
    color: '#444',
  }

  const noteStyle: React.CSSProperties = {
    textAlign: 'center',
    fontSize: '11px',
    color: '#888',
    lineHeight: 1.6,
  }

  return (
    <div style={containerStyle}>
      <div style={outerBorderStyle}>
        {schoolLogoUrl && (
          <div style={watermarkStyle}>
            <img
              src={schoolLogoUrl}
              alt=""
              style={{
                width: '220px',
                height: '220px',
                objectFit: 'contain',
                opacity: 0.06,
              }}
            />
          </div>
        )}

        <div style={contentWrapperStyle}>
          <div style={headerStyle}>
            {schoolLogoUrl && (
              <img src={schoolLogoUrl} alt="school logo" style={logoStyle} />
            )}
            <h1 style={schoolNameStyle}>{schoolName}</h1>
            {schoolAddress && (
              <div style={schoolAddressStyle}>{schoolAddress}</div>
            )}
            {schoolPan && (
              <div style={schoolPanStyle}>
                PAN: <b>{schoolPan}</b>
              </div>
            )}
            <div style={badgeRowStyle}>
              <span style={badgeStyle}>Student Payment Receipt</span>
              {label && <span style={labelTextStyle}>({label})</span>}
            </div>
          </div>

          <div style={infoSectionStyle}>
            {/*<div style={infoRowStyle}>
              <span style={infoLabelStyle}>Receipt No:</span>
              <span style={infoValueStyle}>{receiptNumber || 'N/A'}</span>
            </div>*/}
            <div style={infoRowStyle}>
              <span style={infoLabelStyle}>Date:</span>
              <span style={infoValueStyle}>{paymentDate}</span>
            </div>
            <div style={infoRowStyle}>
              <span style={infoLabelStyle}>Student:</span>
              <span style={infoValueStyle}>{studentName || '-'}</span>
            </div>
            <div style={infoRowStyle}>
              <span style={infoLabelStyle}>Class:</span>
              <span style={infoValueStyle}>{className}</span>
            </div>
            <div style={infoRowStyle}>
              <span style={infoLabelStyle}>Payment Method:</span>
              <span style={infoValueStyle}>{paymentMethod}</span>
            </div>
            <div style={infoRowStyle}>
              <span style={infoLabelStyle}>Reference:</span>
              <span style={infoValueStyle}>{reference || '-'}</span>
            </div>
          </div>

          {feeStructure.length > 0 && (
            <div>
              <div style={sectionTitleStyle}>Fee Breakdown</div>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={theadCellStyle}>Fee Type</th>
                    <th style={theadCellRightStyle}>Amount</th>
                    <th style={theadCellRightStyle}>Times</th>
                    <th style={theadCellRightStyle}>Discount</th>
                    <th style={theadCellRightStyle}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {feeStructure.map((fee, index) => (
                    <tr
                      key={index}
                      style={index % 2 === 1 ? zebraStyle : undefined}
                    >
                      <td style={bodyCellStyle}>{fee.feeTypeName}</td>
                      <td style={bodyCellRightStyle}>{fee.amount}</td>
                      <td style={bodyCellRightStyle}>{fee.times}</td>
                      <td style={bodyCellRightStyle}>{fee.discountAmount}</td>
                      <td style={bodyCellRightStyle}>{fee.totalAmount}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={4} style={subtotalLabelCellStyle}>
                      Subtotal
                    </td>
                    <td style={subtotalValueCellStyle}>
                      {feeSubtotal.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          <div style={summaryWrapperStyle}>
            <div style={summaryBoxStyle}>
              <div style={summaryRowStyle}>
                <span style={summaryLabelStyle}>Total Amount</span>
                <span style={summaryValueStyle}>
                  {totalAmount !== '' && totalAmount !== undefined
                    ? totalAmount
                    : 'N/A'}
                </span>
              </div>
              <div style={summaryRowHighlightStyle}>
                <span style={summaryLabelStyle}>Amount Paid</span>
                <span style={summaryValueStyle}>{amountPaid}</span>
              </div>
              <div style={{ ...summaryRowStyle, borderBottom: 'none' }}>
                <span style={summaryLabelStyle}>Due Amount</span>
                <span style={summaryValueStyle}>
                  {dueAmount !== '' && dueAmount !== undefined
                    ? dueAmount
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div style={footerStyle}>
            <div style={signatureRowStyle}>
              <div style={signatureBlockStyle}>
                <div style={signatureLineStyle}>Cashier Signature</div>
              </div>
              <div style={signatureBlockStyle}>
                <div style={signatureLineStyle}>Authorized Signature</div>
              </div>
            </div>
            <div style={noteStyle}>
              <div>Thank you for your payment.</div>
              <div>This is a computer generated receipt.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Receipt
