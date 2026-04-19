'use client'

import { useRef, useState } from 'react'
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
  const date =
    issuedDate ??
    new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  const handlePrint = () => {
    const printContent = certRef.current?.cloneNode(true) as HTMLElement
    if (!printContent) return

    const headerToRemove = printContent.querySelector('.print-hide')
    if (headerToRemove) headerToRemove.remove()

    const scaleWrapper = printContent.querySelector('.scale-wrapper') as HTMLElement | null
    if (scaleWrapper) {
      scaleWrapper.style.transform = 'none'
      scaleWrapper.style.transformOrigin = 'unset'
    }

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
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Cormorant+Garamond:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet" />
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { background: white; }
            @page { size: A4 landscape; margin: 0; }
            @media print {
              * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            }
            .cert-outer { width: 297mm; height: 210mm; overflow: hidden; }
          </style>
        </head>
        <body>
          <div class="cert-outer">${printContent.innerHTML}</div>
          <script>
            window.onload = () => {
              setTimeout(() => {
                window.print();
                setTimeout(() => { window.close(); }, 500);
              }, 300);
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
          if (document.body.contains(iframe)) document.body.removeChild(iframe)
        }, 100)
      }
    }, 500)
  }

  const A4_W = 1123
  const A4_H = 794
  const DISPLAY_W = 960
  const scale = DISPLAY_W / A4_W

  return (
    <div className="fixed inset-0 z-50 ml-13 md:ml-64 sm:ml-16 xs:ml-0 bg-black/40 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-[1020px] rounded-xl shadow-2xl p-4 my-4">
        {/* Modal header */}
        <div className="flex justify-between items-center mb-4 print-hide">
          <h2 className="text-xl font-semibold text-gray-800">Participation Certificate</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white
                         bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow"
            >
              <Download size={13} />
              Download / Print
            </button>
            <button onClick={onClose} className="text-red-500 hover:text-red-600">
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Scale wrapper */}
        <div
          style={{
            width: `${DISPLAY_W}px`,
            height: `${A4_H * scale}px`,
            margin: '0 auto',
            overflow: 'hidden',
          }}
        >
          <div
            ref={certRef}
            className="scale-wrapper"
            style={{
              width: `${A4_W}px`,
              height: `${A4_H}px`,
              transformOrigin: 'top left',
              transform: `scale(${scale})`,
            }}
          >
            <style>{`
              @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Cormorant+Garamond:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600&display=swap');

              .cert-a4 {
                width: ${A4_W}px;
                height: ${A4_H}px;
                font-family: 'Cormorant Garamond', serif;
                position: relative;
                display: flex;
                flex-direction: column;
                background: linear-gradient(135deg, #fffef7 0%, #fff9ef 100%);
                border: 2.5px solid #d4a373;
                border-radius: 4px;
                padding: 18px 28px 16px;
                box-sizing: border-box;
                overflow: hidden;
              }

              /* Double inner border lines */
              .cert-a4::before {
                content: '';
                position: absolute;
                top: 10px; left: 10px; right: 10px; bottom: 10px;
                border: 1px solid #e6ccb2;
                pointer-events: none;
                border-radius: 2px;
                z-index: 0;
              }

              .cert-a4::after {
                content: '';
                position: absolute;
                top: 15px; left: 15px; right: 15px; bottom: 15px;
                border: 1px solid #e6ccb2;
                pointer-events: none;
                border-radius: 2px;
                z-index: 0;
              }

              /* ── Watermark ── */
              .watermark {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                opacity: 0.1;
                z-index: 0;
                pointer-events: none;
              }

              .watermark img,
              .watermark svg {
                width: 380px;
                height: 380px;
                filter: grayscale(30%) sepia(20%);
              }

              .cert-content {
                position: relative;
                z-index: 1;
                flex: 1;
                display: flex;
                flex-direction: column;
                height: 100%;
              }

              /* ── Header — NO bottom border/divider ── */
              .cert-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 24px;
                padding-bottom: 14px;
                margin-bottom: 8px;
                /* border-bottom intentionally removed */
              }

              .logo-section {
                width: 88px;
                height: 88px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                background: #fffaf2;
                border-radius: 50%;
                padding: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.06);
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
                font-size: 26px;
                font-weight: 700;
                color: #78350f;
                letter-spacing: 3px;
                font-family: 'Playfair Display', serif;
                margin-bottom: 6px;
              }

              .school-address {
                font-size: 12px;
                color: #92400e;
                margin-bottom: 3px;
                font-family: 'Montserrat', sans-serif;
                letter-spacing: 0.5px;
              }

              .school-pan {
                font-size: 11px;
                color: #92400e;
                font-family: 'Montserrat', sans-serif;
              }

              /* ── Photo: simple square box, no rounded corners ── */
              .photo-placeholder {
                width: 88px;
                height: 88px;
                background: linear-gradient(145deg, #fdf8f0, #f5e6d3);
                border: 2px solid #d4a373;
                border-radius: 0;           /* square */
                flex-shrink: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #b45309;
                font-size: 10px;
                text-align: center;
              }

              /* ── Decorative line ── */
              .decorative-line {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 14px;
                margin: 8px 0;
              }

              .deco-line {
                width: 120px;
                height: 2px;
                background: linear-gradient(90deg, transparent, #b45309, #f59e0b, #b45309, transparent);
              }

              .diamond {
                width: 8px;
                height: 8px;
                background: #b45309;
                transform: rotate(45deg);
              }

              /* ── Body ── */
              .cert-body {
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
                flex: 1;
                justify-content: center;
                padding: 4px 0;
              }

              .cert-title {
                font-size: 15px;
                letter-spacing: 7px;
                color: #78350f;
                font-family: 'Montserrat', sans-serif;
                font-weight: 600;
                position: relative;
                display: inline-block;
                padding: 0 28px;
                margin-bottom: 10px;
              }

              .cert-title:before, .cert-title:after {
                content: '✦';
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                font-size: 13px;
                color: #d4a373;
              }

              .cert-title:before { left: 4px; }
              .cert-title:after  { right: 4px; }

              .student-name {
                font-size: 56px;
                font-style: italic;
                color: #78350f;
                font-weight: 700;
                font-family: 'Playfair Display', serif;
                letter-spacing: 2px;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.06);
                border-bottom: 2px dotted #e6ccb2;
                display: inline-block;
                padding: 0 24px 10px;
                margin-bottom: 12px;
                line-height: 1.1;
              }

              .cert-description {
                font-size: 17px;
                color: #78350f;
                line-height: 1.4;
                font-family: 'Cormorant Garamond', serif;
                font-style: italic;
                margin-bottom: 6px;
              }

              .activity-name {
                font-size: 28px;
                font-weight: 700;
                font-style: italic;
                color: #b45309;
                font-family: 'Playfair Display', serif;
                letter-spacing: 1px;
                display: inline-block;
                padding: 0 16px;
                margin-bottom: 10px;
              }

              .activity-name:before, .activity-name:after {
                content: '❧';
                font-size: 22px;
                color: #d4a373;
                position: relative;
                top: -3px;
              }

              .activity-name:before { margin-right: 12px; }
              .activity-name:after  { margin-left: 12px; }

              .award-badge {
                display: inline-block;
                background: linear-gradient(135deg, #d4a373, #fef3c7, #d4a373);
                color: #78350f;
                padding: 9px 48px;
                font-size: 16px;
                font-weight: 700;
                letter-spacing: 5px;
                font-family: 'Montserrat', sans-serif;
                border-radius: 40px;
                box-shadow: 0 4px 14px rgba(0,0,0,0.12);
                border: 1px solid #fffbeb;
              }

              /* ── Footer — 2 columns, NO divider, NO seal ── */
              .cert-footer {
                display: grid;
                grid-template-columns: 1fr 1fr;
                align-items: end;
                margin-top: 14px;
                padding-top: 14px;
                /* border-top intentionally removed */
                gap: 16px;
              }

              .signature-section,
              .date-section {
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
              }

              .sig-line,
              .date-line {
                width: 200px;
                height: 1px;
                background: #b45309;
                margin-bottom: 7px;
              }

              .footer-label {
                font-size: 10px;
                letter-spacing: 2.5px;
                color: #78350f;
                font-family: 'Montserrat', sans-serif;
                text-transform: uppercase;
              }

              .date-text {
                font-size: 13px;
                font-style: italic;
                color: #78350f;
                margin-bottom: 7px;
                font-family: 'Cormorant Garamond', serif;
              }
            `}</style>

            <div className="cert-a4">
              {/* Watermark */}
              <div className="watermark">
                {schoolLogoUrl && !imageError ? (
                  <img src={schoolLogoUrl} alt="" />
                ) : (
                  <Building size={380} color="#b45309" />
                )}
              </div>

              <div className="cert-content">
                {/* Header — no divider */}
                <div className="cert-header">
                  <div className="logo-section">
                    {schoolLogoUrl && !imageError ? (
                      <img
                        src={schoolLogoUrl}
                        alt="School Logo"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <Building size={60} color="#b45309" />
                    )}
                  </div>

                  <div className="school-info">
                    <div className="school-name">{SchoolData?.name ?? 'ELITE SPACE'}</div>
                    {SchoolData?.address && (
                      <div className="school-address">{SchoolData.address}</div>
                    )}
                    {SchoolData?.pan && (
                      <div className="school-pan">PAN: {SchoolData.pan}</div>
                    )}
                  </div>

                  {/* Simple square photo box */}
                  <div className="photo-placeholder">
                   
                  </div>
                </div>

                {/* Decorative Line */}
                <div className="decorative-line">
                  <div className="deco-line" />
                  <div className="diamond" />
                  <div className="deco-line" />
                </div>

                {/* Body */}
                <div className="cert-body">
                  <div className="cert-title">CERTIFICATE OF ACHIEVEMENT</div>
                  <div className="student-name">{studentName}</div>
                  <div className="cert-description">
                    In recognition of exemplary dedication and outstanding participation in
                  </div>
                  <div className="activity-name">{activityName}</div>
                  <div className="award-badge">{awardLabel}</div>
                </div>

                {/* Footer — 2 cols, no divider, no seal */}
                <div className="cert-footer">
                  <div className="signature-section">
                    <div className="sig-line" />
                    <div className="footer-label">Authorized Signature</div>
                  </div>

                  <div className="date-section">
                    <div className="date-text">{date}</div>
                    <div className="date-line" />
                    <div className="footer-label">Date of Issue</div>
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