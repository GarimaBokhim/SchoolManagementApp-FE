'use client'

import { useRef, useState, useEffect } from 'react'
import { X, Download, Building } from 'lucide-react'
import { useGetSchoolById } from '@/app/admin/Setup/School/hooks'

const AWARD_POSITION_LABELS: Record<number, string> = {
  1: 'First Place',
  2: 'Second Place',
  3: 'Third Place',
  4: 'Runner Up',
  5: 'Honorable Mention',
  6: 'Gold Standard',
  7: 'Creative Excellence',
  8: 'Best Team Leader',
  9: 'Active Participant',
  10: 'Outstanding Efforts',
}

interface CertificateModalProps {
  visible: boolean
  onClose: () => void
  studentName: string
  activityName: string
  awardPosition: number
  issuedDate?: string
}

const CertificateModal = ({
  visible,
  onClose,
  studentName,
  activityName,
  awardPosition,
  issuedDate,
}: CertificateModalProps) => {
  const certRef = useRef<HTMLDivElement>(null)
  const [imageError, setImageError] = useState(false)

  let schoolId = ''
  const storedUser = localStorage.getItem('userDetails')
  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser)
      schoolId = parsedUser.schoolId
    } catch (error) {
      console.error('Failed to parse user details:', error)
    }
  }

  const { data: SchoolData } = useGetSchoolById(schoolId)

  const getImageUrl = () => {
    if (!SchoolData?.imageUrl) return null
    const imageUrl = SchoolData.imageUrl
    if (imageUrl === '-' || imageUrl === 'string' || imageUrl === '') return null
    return `https://schoolapp.netraverselabs.com/${imageUrl}`
  }

  const schoolLogoUrl = getImageUrl()

  if (!visible) return null

  const awardLabel = AWARD_POSITION_LABELS[awardPosition] ?? `Position ${awardPosition}`
  const date = issuedDate ?? new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const handlePrint = () => {
    const printContent = certRef.current?.cloneNode(true) as HTMLElement
    if (!printContent) return

    // Remove the header (buttons section) from print content
    const headerToRemove = printContent.querySelector('.print-hide')
    if (headerToRemove) {
      headerToRemove.remove()
    }

    // Create an iframe for printing (hidden)
    const iframe = document.createElement('iframe')
    iframe.style.position = 'absolute'
    iframe.style.width = '0'
    iframe.style.height = '0'
    iframe.style.border = 'none'
    document.body.appendChild(iframe)

    const iframeDoc = iframe.contentWindow?.document
    if (!iframeDoc) {
      alert('Unable to open print dialog')
      document.body.removeChild(iframe)
      return
    }

    iframeDoc.open()
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Certificate - ${studentName}</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:wght@300;400;600&display=swap" rel="stylesheet" />
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              background: white;
              font-family: 'Cormorant Garamond', serif;
              margin: 0;
              padding: 0;
            }
            
            @page {
              size: A4;
              margin: 0;
            }
            
            @media print {
              body {
                margin: 0;
                padding: 0;
              }
              
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            }
            
            .certificate-container {
              width: 210mm;
              min-height: 297mm;
              margin: 0 auto;
              background: white;
              position: relative;
              page-break-after: avoid;
              page-break-inside: avoid;
            }
            
            /* Ensure content fits within A4 */
            @media print {
              .certificate-container {
                width: 100%;
                min-height: 100%;
              }
            }
          </style>
        </head>
        <body>
          <div class="certificate-container">
            ${printContent.outerHTML}
          </div>
          <script>
            window.onload = () => {
              setTimeout(() => {
                window.print();
                setTimeout(() => {
                  window.close();
                }, 500);
              }, 200);
            };
          <\/script>
        </body>
      </html>
    `)
    iframeDoc.close()

    const checkPrintDialog = setInterval(() => {
      if (!iframe.contentWindow || iframe.contentWindow.closed) {
        clearInterval(checkPrintDialog)
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe)
          }
        }, 100)
      }
    }, 500)
  }

  return (
    <div className="fixed inset-0 z-50 ml-13 md:ml-64 sm:ml-16 xs:ml-0 bg-black/40 backdrop-blur-sm items-center justify-center p-2 flex flex-col">
      <div className="bg-white w-full sm:w-[90%] max-w-[900px] rounded-md p-4 shadow-xl overflow-auto max-h-[90vh]">
        {/* Modal header — excluded from print */}
        <div className="flex justify-between items-center mb-4 print-hide">
          <h2 className="text-xl font-semibold">Participation Certificate</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white
                         bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
            >
              <Download size={13} />
              Download / Print
            </button>
            <button onClick={onClose} className="text-red-500 text-xl">
              <X />
            </button>
          </div>
        </div>

        {/* Certificate body - A4 sized */}
        <div
          ref={certRef}
          className="bg-white mx-auto"
          style={{
            width: '210mm',
            minHeight: '297mm',
            padding: '15mm 20mm',
            position: 'relative',
            boxSizing: 'border-box'
          }}
        >
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:wght@300;400;600&display=swap');
            
            .cert-a4 {
              font-family: 'Cormorant Garamond', serif;
              height: 100%;
              position: relative;
              display: flex;
              flex-direction: column;
            }
            
            .watermark {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              opacity: 0.05;
              z-index: 0;
              pointer-events: none;
            }
            
            .watermark svg {
              width: 300px;
              height: 300px;
            }
            
            .cert-content {
              position: relative;
              z-index: 1;
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            }
            
            /* Header Section */
            .cert-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 30px;
              gap: 20px;
            }
            
            .logo-section {
              width: 100px;
              height: 100px;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-shrink: 0;
            }
            
            .logo-section img {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
            
            .school-info {
              text-align: center;
              flex: 1;
            }
            
            .school-name {
              font-size: 20px;
              font-weight: 700;
              color: #78350f;
              letter-spacing: 2px;
              margin-bottom: 8px;
            }
            
            .school-address {
              font-size: 12px;
              color: #92400e;
              margin-bottom: 4px;
            }
            
            .school-pan {
              font-size: 11px;
              color: #92400e;
            }
            
            .photo-placeholder {
              width: 100px;
              height: 100px;
              border: 2px solid #d4a373;
              background: #fefaf5;
              flex-shrink: 0;
            }
            
            /* Decorative Line */
            .decorative-line {
              display: flex;
              justify-content: center;
              align-items: center;
              gap: 15px;
              margin: 20px 0;
            }
            
            .line {
              width: 80px;
              height: 1px;
              background: #b45309;
            }
            
            .diamond {
              width: 6px;
              height: 6px;
              background: #b45309;
              transform: rotate(45deg);
            }
            
            /* Main Content */
            .cert-body {
              text-align: center;
              margin: 40px 0;
            }
            
            .cert-title {
              font-size: 14px;
              letter-spacing: 3px;
              color: #78350f;
              margin-bottom: 20px;
            }
            
            .student-name {
              font-size: 42px;
              font-style: italic;
              color: #78350f;
              margin: 20px 0;
              font-weight: 600;
            }
            
            .cert-description {
              font-size: 16px;
              color: #78350f;
              line-height: 1.6;
              margin: 20px 0;
            }
            
            .activity-name {
              font-size: 20px;
              font-weight: 700;
              font-style: italic;
              color: #78350f;
              margin: 10px 0;
            }
            
            .award-badge {
              display: inline-block;
              background: linear-gradient(135deg, #d97706, #f59e0b, #d97706);
              color: white;
              padding: 8px 30px;
              font-size: 14px;
              font-weight: 600;
              letter-spacing: 2px;
              margin: 30px 0;
              text-transform: uppercase;
            }
            
            /* Footer Section */
            .cert-footer {
              display: flex;
              justify-content: space-between;
              margin-top: 50px;
              padding-top: 30px;
              border-top: 1px solid #d4a373;
            }
            
            .signature-section {
              text-align: center;
              flex: 1;
            }
            
            .signature-line {
              width: 150px;
              height: 1px;
              background: #b45309;
              margin: 0 auto 10px auto;
            }
            
            .signature-label {
              font-size: 11px;
              letter-spacing: 1px;
              color: #78350f;
            }
            
            .date-section {
              text-align: center;
              flex: 1;
            }
            
            .date-text {
              font-size: 14px;
              font-style: italic;
              color: #78350f;
              margin-bottom: 10px;
            }
            
            .date-line {
              width: 120px;
              height: 1px;
              background: #b45309;
              margin: 0 auto 10px auto;
            }
            
            .date-label {
              font-size: 11px;
              letter-spacing: 1px;
              color: #78350f;
            }
            
            @media print {
              .cert-a4 {
                padding: 0;
              }
              
              .student-name {
                font-size: 38px;
              }
            }
          `}</style>

          <div className="cert-a4">
            {/* Watermark */}
            <div className="watermark">
              {schoolLogoUrl && !imageError ? (
                <img src={schoolLogoUrl} alt="" style={{ width: '300px', opacity: 0.3 }} />
              ) : (
                <Building size={300} className="text-amber-600" />
              )}
            </div>

            <div className="cert-content">
              {/* Header */}
              <div className="cert-header">
                <div className="logo-section">
                  {schoolLogoUrl && !imageError ? (
                    <img src={schoolLogoUrl} alt="School Logo" onError={() => setImageError(true)} />
                  ) : (
                    <Building size={80} className="text-amber-600" />
                  )}
                </div>
                
                <div className="school-info">
                  <div className="school-name">{SchoolData?.name ?? 'SCHOOL NAME'}</div>
                  {SchoolData?.address && <div className="school-address">{SchoolData.address}</div>}
                  {SchoolData?.pan && <div className="school-pan">PAN: {SchoolData.pan}</div>}
                </div>
                
                <div className="photo-placeholder"></div>
              </div>

              {/* Decorative Line */}
              <div className="decorative-line">
                <div className="line"></div>
                <div className="diamond"></div>
                <div className="line"></div>
              </div>

              {/* Body */}
              <div className="cert-body">
                <div className="cert-title">THIS CERTIFICATE IS PROUDLY PRESENTED TO</div>
                
                <div className="student-name">{studentName}</div>
                
                <div className="cert-description">
                  In recognition of exemplary dedication and outstanding participation in
                </div>
                
                <div className="activity-name">{activityName}</div>
                
                <div className="award-badge">{awardLabel}</div>
              </div>

              {/* Footer */}
              <div className="cert-footer">
                <div className="signature-section">
                  <div className="signature-line"></div>
                  <div className="signature-label">AUTHORIZED SIGNATURE</div>
                </div>
                
                <div className="date-section">
                  <div className="date-text">{date}</div>
                  <div className="date-line"></div>
                  <div className="date-label">DATE OF ISSUE</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CertificateModal