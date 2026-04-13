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

    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert('Please allow pop-ups to print the certificate')
      return
    }

    const styles = document.querySelectorAll('link[rel="stylesheet"], style')
    let stylesHTML = ''
    styles.forEach((style) => {
      if (style.tagName === 'LINK') {
        const link = style as HTMLLinkElement
        stylesHTML += `<link href="${link.href}" rel="stylesheet">`
      } else if (style.tagName === 'STYLE') {
        stylesHTML += style.outerHTML
      }
    })

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Certificate - ${studentName}</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:wght@300;400;600&display=swap" rel="stylesheet" />
          ${stylesHTML}
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              background: #fff;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              font-family: 'Cormorant Garamond', serif;
              padding: 20px;
            }
            
            @media print {
              @page {
                size: A4 portrait;
                margin: 0;
              }
              
              body {
                margin: 0;
                padding: 0;
                background: white;
              }
              
              .no-print {
                display: none !important;
              }
              
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            }
            
            .certificate-wrapper {
              max-width: 900px;
              width: 100%;
              margin: 0 auto;
              background: white;
              box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            }
          </style>
        </head>
        <body>
          <div class="certificate-wrapper">
            ${printContent.outerHTML}
          </div>
          <script>
            // Auto-trigger print after everything loads
            window.onload = () => {
              setTimeout(() => {
                window.print();
                setTimeout(() => {
                  window.close();
                }, 500);
              }, 500);
            };
          <\/script>
        </body>
      </html>
    `)

    printWindow.document.close()
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

        {/* Certificate body */}
        <div
          ref={certRef}
          className="bg-white mx-auto text-amber-800 p-4 sm:p-8"
          style={{ backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%' }}
        >
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:wght@300;400;600&display=swap');

            .certificate-inner {
              font-family: 'Cormorant Garamond', serif;
              position: relative;
            }

            .certificate-watermark {
              position: absolute;
              inset: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              pointer-events: none;
              z-index: 0;
              opacity: 0.07;
            }

            .certificate-watermark img {
              width: min(200px, 30%);
              height: auto;
            }

            .certificate-content {
              position: relative;
              z-index: 1;
            }

            /* Header row: school info left, logo right */
            .cert-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 8px;
            }

            .cert-school-info {
              display: flex;
              flex-direction: column;
              gap: 2px;
            }

            .cert-logo-box {
              width: min(80px, 15vw);
              height: min(80px, 15vw);
              flex-shrink: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              overflow: hidden;
              background: white;
            }

            .cert-logo-box img {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
          `}</style>

          <div className="certificate-inner">
            {/* Watermark */}
            <div className="certificate-watermark">
              {schoolLogoUrl && !imageError ? (
                <img src={schoolLogoUrl} alt="" onError={() => setImageError(true)} />
              ) : (
                <Building size={150} className="text-amber-600" />
              )}
            </div>

            <div className="certificate-content">
              {/* Header: school info (left) + logo (right) */}
              <div className="cert-header">
                <div className="cert-school-info">
                  <p className="text-base font-semibold text-amber-900 uppercase tracking-wide">
                    {SchoolData?.name ?? 'School Name'}
                  </p>
                  {SchoolData?.address && (
                    <p className="text-xs text-amber-700">{SchoolData.address}</p>
                  )}
                  {SchoolData?.pan && (
                    <p className="text-xs text-amber-700">PAN: {SchoolData.pan}</p>
                  )}
                </div>

                <div className="cert-logo-box">
                  {schoolLogoUrl && !imageError ? (
                    <img
                      src={schoolLogoUrl}
                      alt="School Logo"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <Building className="w-12 h-12 text-amber-600" />
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-amber-300 mb-6" />

              {/* Main certificate content — centred */}
              <div className="text-center">
                <h1 className="text-3xl sm:text-4xl font-bold text-amber-900">
                  Excellence Award
                </h1>
                <p className="text-sm italic text-amber-700 mt-1">
                  In Recognition of Outstanding Participation
                </p>

                <div className="flex items-center justify-center gap-4 my-6">
                  <div className="w-20 h-px bg-amber-600" />
                  <div className="w-2 h-2 bg-amber-600 rotate-45" />
                  <div className="w-20 h-px bg-amber-600" />
                </div>

                <p className="text-xs uppercase tracking-wider text-amber-700">
                  This Certificate is Proudly Presented to
                </p>
                <p className="text-2xl sm:text-3xl italic font-serif text-amber-900 mt-2 mb-4">
                  {studentName}
                </p>

                <p className="text-sm text-amber-800 max-w-md mx-auto leading-relaxed">
                  In recognition of exemplary dedication and outstanding participation in
                  <br />
                  <span className="text-base italic font-semibold">{activityName}</span>
                </p>

                <div className="inline-block mt-6 mb-8 px-6 py-2 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 text-white text-sm uppercase tracking-wider">
                  {awardLabel}
                </div>

                <div className="flex flex-col sm:flex-row justify-between mt-10 pt-4 border-t border-amber-300 gap-6 sm:gap-0">
                  <div className="text-center">
                    <div className="w-32 h-px bg-amber-600 mx-auto mb-2" />
                    <p className="text-xs uppercase tracking-wider">Authorized Signature</p>
                  </div>

                  <div className="text-center">
                    <p className="text-sm italic">{date}</p>
                    <div className="w-32 h-px bg-amber-600 mx-auto my-2" />
                    <p className="text-xs uppercase tracking-wider">Date of Issue</p>
                  </div>
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