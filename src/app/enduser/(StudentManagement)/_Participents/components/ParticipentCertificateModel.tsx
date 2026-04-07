'use client'

import { useRef } from 'react'
import { X, Download, Award } from 'lucide-react'

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

  if (!visible) return null

  const awardLabel = AWARD_POSITION_LABELS[awardPosition] ?? `Position ${awardPosition}`
  const date = issuedDate ?? new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const handlePrint = () => {
    const printContent = certRef.current?.innerHTML
    if (!printContent) return
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`
      <html>
        <head>
          <title>Certificate - ${studentName}</title>
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:wght@300;400;600&display=swap" rel="stylesheet" />
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { background: #fff; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
            .cert-wrap { width: 800px; }
          </style>
        </head>
        <body>
          <div class="cert-wrap">${printContent}</div>
          <script>window.onload = () => { window.print(); window.close(); }</script>
        </body>
      </html>
    `)
    win.document.close()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center
                 bg-black/40 backdrop-blur-sm ml-12 md:ml-64 sm:ml-16 xs:ml-0"
      onClick={onClose}
    >
      <div
        className="bg-[#FBFBFB] dark:bg-[#27272a] w-full max-w-[95vw] md:max-w-[680px]
                   max-h-[95vh] rounded-lg overflow-auto p-6 md:p-8 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Award size={18} className="text-emerald-600" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Participation Certificate
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white
                         bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
            >
              <Download size={13} />
              Download / Print
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X size={18} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Certificate */}
        <div ref={certRef}>
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:wght@300;400;600&display=swap');

            .cert-root {
              font-family: 'Cormorant Garamond', serif;
              background: #fffef8;
              border: 1px solid #d6c89a;
              border-radius: 4px;
              position: relative;
              overflow: hidden;
              padding: 48px 52px;
              text-align: center;
              color: #2c2408;
            }

            /* Outer decorative border */
            .cert-root::before {
              content: '';
              position: absolute;
              inset: 10px;
              border: 1.5px solid #c9ae6e;
              border-radius: 2px;
              pointer-events: none;
            }

            /* Corner ornaments via box-shadow trick */
            .cert-root::after {
              content: '';
              position: absolute;
              inset: 16px;
              border: 0.5px solid #e0cfa0;
              border-radius: 1px;
              pointer-events: none;
            }

            .cert-watermark {
              position: absolute;
              inset: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              pointer-events: none;
              z-index: 0;
            }

            .cert-watermark svg {
              width: 320px;
              height: 320px;
              opacity: 0.035;
            }

            .cert-content {
              position: relative;
              z-index: 1;
            }

            .cert-org {
              font-family: 'Cormorant Garamond', serif;
              font-weight: 300;
              font-size: 11px;
              letter-spacing: 5px;
              text-transform: uppercase;
              color: #8a6e2a;
              margin-bottom: 6px;
            }

            .cert-title {
              font-family: 'Playfair Display', serif;
              font-size: 34px;
              font-weight: 700;
              color: #1a1200;
              line-height: 1.15;
              margin-bottom: 4px;
            }

            .cert-subtitle {
              font-family: 'Playfair Display', serif;
              font-size: 14px;
              font-style: italic;
              color: #8a6e2a;
              letter-spacing: 1px;
              margin-bottom: 28px;
            }

            .cert-divider {
              display: flex;
              align-items: center;
              gap: 12px;
              margin: 0 auto 24px;
              max-width: 360px;
            }

            .cert-divider-line {
              flex: 1;
              height: 1px;
              background: linear-gradient(to right, transparent, #c9ae6e, transparent);
            }

            .cert-divider-diamond {
              width: 6px;
              height: 6px;
              background: #c9ae6e;
              transform: rotate(45deg);
              flex-shrink: 0;
            }

            .cert-presented {
              font-size: 12px;
              letter-spacing: 3px;
              text-transform: uppercase;
              color: #7a6530;
              margin-bottom: 10px;
            }

            .cert-name {
              font-family: 'Playfair Display', serif;
              font-size: 30px;
              font-weight: 400;
              font-style: italic;
              color: #1a1200;
              margin-bottom: 18px;
              line-height: 1.2;
            }

            .cert-body {
              font-size: 14px;
              font-weight: 300;
              color: #4a3b12;
              line-height: 1.8;
              max-width: 440px;
              margin: 0 auto 18px;
            }

            .cert-activity {
              font-family: 'Playfair Display', serif;
              font-size: 17px;
              font-style: italic;
              color: #2c2408;
              font-weight: 400;
            }

            .cert-badge {
              display: inline-block;
              margin: 18px auto 24px;
              padding: 8px 28px;
              background: linear-gradient(135deg, #c9ae6e 0%, #f0d98a 50%, #c9ae6e 100%);
              border-radius: 2px;
              font-family: 'Cormorant Garamond', serif;
              font-size: 13px;
              font-weight: 600;
              letter-spacing: 3px;
              text-transform: uppercase;
              color: #1a1200;
            }

            .cert-footer {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              margin-top: 32px;
              padding-top: 20px;
              border-top: 0.5px solid #d6c89a;
            }

            .cert-sig-block {
              text-align: center;
              flex: 1;
            }

            .cert-sig-line {
              width: 130px;
              height: 1px;
              background: #c9ae6e;
              margin: 0 auto 6px;
            }

            .cert-sig-label {
              font-size: 10px;
              letter-spacing: 2px;
              text-transform: uppercase;
              color: #8a6e2a;
            }

            .cert-date-block {
              text-align: center;
              flex: 1;
            }

            .cert-date-value {
              font-family: 'Playfair Display', serif;
              font-size: 13px;
              font-style: italic;
              color: #2c2408;
              margin-bottom: 6px;
            }

            .cert-date-label {
              font-size: 10px;
              letter-spacing: 2px;
              text-transform: uppercase;
              color: #8a6e2a;
            }

            .cert-seal {
              width: 64px;
              height: 64px;
              flex-shrink: 0;
            }
          `}</style>

          <div className="cert-root">
            {/* Watermark */}
            <div className="cert-watermark">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" stroke="#8a6e2a" strokeWidth="1.5"/>
                <circle cx="50" cy="50" r="38" stroke="#8a6e2a" strokeWidth="0.5"/>
                <path d="M50 15 L53 38 L75 27 L60 45 L85 50 L60 55 L75 73 L53 62 L50 85 L47 62 L25 73 L40 55 L15 50 L40 45 L25 27 L47 38 Z" fill="#8a6e2a"/>
              </svg>
            </div>

            <div className="cert-content">
              <p className="cert-org">Certificate of Achievement</p>
              <h1 className="cert-title">Excellence Award</h1>
              <p className="cert-subtitle">In Recognition of Outstanding Participation</p>

              <div className="cert-divider">
                <div className="cert-divider-line" />
                <div className="cert-divider-diamond" />
                <div className="cert-divider-line" />
              </div>

              <p className="cert-presented">This Certificate is Proudly Presented to</p>
              <p className="cert-name">{studentName}</p>

              <p className="cert-body">
                In recognition of exemplary dedication and outstanding participation in
                <br />
                <span className="cert-activity">{activityName}</span>
              </p>

              <div className="cert-badge">{awardLabel}</div>

              <div className="cert-footer">
                <div className="cert-sig-block">
                  <div className="cert-sig-line" />
                  <p className="cert-sig-label">Authorized Signature</p>
                </div>

                {/* Seal SVG */}
                <svg className="cert-seal" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="40" cy="40" r="36" stroke="#c9ae6e" strokeWidth="1.5" fill="#fffef8"/>
                  <circle cx="40" cy="40" r="30" stroke="#c9ae6e" strokeWidth="0.5" fill="none"/>
                  {[...Array(16)].map((_, i) => {
                    const angle = (i * 360) / 16
                    const rad = (angle * Math.PI) / 180
                    const x1 = 40 + 31 * Math.cos(rad)
                    const y1 = 40 + 31 * Math.sin(rad)
                    const x2 = 40 + 35 * Math.cos(rad)
                    const y2 = 40 + 35 * Math.sin(rad)
                    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#c9ae6e" strokeWidth="1"/>
                  })}
                  <text x="40" y="36" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="5.5" fill="#8a6e2a" letterSpacing="1" fontWeight="600">OFFICIAL</text>
                  <text x="40" y="44" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="5.5" fill="#8a6e2a" letterSpacing="1" fontWeight="600">SEAL</text>
                </svg>

                <div className="cert-date-block">
                  <p className="cert-date-value">{date}</p>
                  <div className="cert-sig-line" style={{ margin: '0 auto 6px' }}/>
                  <p className="cert-date-label">Date of Issue</p>
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