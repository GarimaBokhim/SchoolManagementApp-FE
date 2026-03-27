import { useGetChartOfAccount } from '../hooks'
import { useGetSchoolById } from '@/app/admin/Setup/School/hooks'

const AllPrintChartOfAccountForm = () => {
  const { data: charts } = useGetChartOfAccount()
  const companyId = localStorage.getItem('companyId')
  const { data: company } = useGetSchoolById(companyId)

  const containerStyle = {
    backgroundColor: '#ffffff',
    fontFamily: 'Arial, sans-serif',
    color: '#000000',
    padding: '32px 48px',
  }

  const letterHeadStyle = {
    textAlign: 'center' as const,
    borderBottom: '2px solid #000',
    paddingBottom: '12px',
    marginBottom: '32px',
  }

  const companyNameStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: '4px',
  }

  const addressStyle = {
    fontSize: '14px',
    color: '#444',
    marginBottom: '4px',
  }

  const sectionStyle: React.CSSProperties = {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px',
    pageBreakInside: 'avoid',
  }

  const titleStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1e3a8a',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
  }

  const groupTitleStyle = {
    fontSize: '16px',
    fontWeight: '600',
    marginLeft: '12px',
    marginTop: '8px',
    color: '#333333',
    display: 'flex',
    justifyContent: 'space-between',
  }

  const ledgerStyle = {
    fontSize: '14px',
    marginLeft: '24px',
    color: '#444',
  }
  const ledgerTitleStyle = {
    display: 'flex',
    justifyContent: 'space-between',
  }
  const dateStyle = {
    position: 'absolute' as const,
    top: '0',
    right: '0',
    fontSize: '14px',
    color: '#555',
  }
  const today = new Date()
  const formattedDate = today.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
  return (
    <div style={containerStyle}>
      <div style={letterHeadStyle}>
        <div style={dateStyle}>Printed on: {formattedDate}</div>
        <div style={companyNameStyle}>{company?.name || 'Company Name'}</div>
        <div style={addressStyle}>{company?.address || 'Company Address'}</div>
        <div style={addressStyle}>
          Email: {company?.email || 'Company Email'} | Phone:
          {company?.contactNumber || 'Contact Number'}
        </div>
        <div style={addressStyle}>
          PAN No:{company?.pan || 'Company Pan No'}
        </div>
      </div>

      <h1 style={{ textAlign: 'center', marginBottom: '24px' }}>
        Chart of Accounts
      </h1>

      {charts ? (
        <div>
          {charts.map((item, index) => (
            <div key={index} style={sectionStyle}>
              <div style={titleStyle}>
                {item.name}{' '}
                <div>
                  {Math.abs(item.balance)}
                  {item.balance > 0 ? 'Dr' : 'Cr'}
                </div>
              </div>
              {item.ledgerGroupResponses.map((ledgerGroup, inx) => (
                <div key={inx}>
                  <div style={groupTitleStyle}>
                    {ledgerGroup.name}
                    <div>
                      {Math.abs(ledgerGroup.balance)}
                      {ledgerGroup.balance > 0 ? 'Dr' : 'Cr'}
                    </div>
                  </div>
                  {ledgerGroup.SubLedgerGroupResponses?.map(
                    (subLedgerGroup, i) => (
                      <div key={i} style={ledgerStyle}>
                        <div style={groupTitleStyle}>
                          {subLedgerGroup.name}
                          <div>
                            {Math.abs(subLedgerGroup.balance)}{' '}
                            {subLedgerGroup.balance > 0 ? 'Dr' : 'Cr'}
                          </div>
                        </div>
                        {subLedgerGroup?.ledgerResponses?.map((ledger, l) => (
                          <div key={l} style={ledgerStyle}>
                            <div style={ledgerTitleStyle}>
                              -{ledger.name}{' '}
                              <div>
                                {Math.abs(ledger.balance)}
                                {ledger.balance > 0 ? 'Dr' : 'Cr'}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: 'center', color: '#777' }}>Loading Data...</p>
      )}
    </div>
  )
}

export default AllPrintChartOfAccountForm
