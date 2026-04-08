'use client'

import { useRef, useState } from 'react'
import { X, Download, Award, Building } from 'lucide-react'
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

  // Get schoolId from localStorage
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

  // Build the logo URL
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
            @media print {
              @page { size: A4 portrait; margin: 0 !important; }
              body { margin: 0; padding: 0; }
              body * { visibility: hidden; }
              #certificate, #certificate * { visibility: visible; }
              #certificate { position: absolute; top: 0; left: 0; width: 210mm; height: 297mm; padding: 20mm; }
              * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            }
          </style>
        </head>
        <body>
          <div id="certificate">${printContent}</div>
          <script>window.onload = () => { window.print(); window.close(); }<\/script>
        </body>
      </html>
    `)
    win.document.close()
  }

  return (
    <div className="fixed inset-0 z-50 ml-13 md:ml-64 sm:ml-16 xs:ml-0 bg-black/40 backdrop-blur-sm items-center justify-center p-2 flex flex-col">
      <div
        ref={certRef}
        className="bg-white w-full sm:w-[90%] max-w-[900px] rounded-md p-4 shadow-xl overflow-none"
      >
        <div className="flex justify-between items-center mb-4">
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
        
        <div
          id="certificate-content"
          className="bg-white shadow-2xl mx-auto border-2 text-amber-800 p-4 sm:p-6"
          style={{ backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%' }}
        >
          <div className="border-4 border-amber-600 p-3 sm:p-5">
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
              
              .cert-logo-box {
                position: absolute;
                left: 0;
                top: 0;
                width: min(80px, 15vw);
                height: min(80px, 15vw);
                border: 2px solid #d97706;
                border-radius: 4px;
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
                padding: 4px;
              }
              
              @media (max-width: 640px) {
                .cert-logo-box {
                  position: relative;
                  margin: 0 auto 16px;
                }
              }
            `}</style>
            
            <div className="certificate-inner">
              {/* Watermark */}
              <div className="certificate-watermark">
                {schoolLogoUrl && !imageError ? (
                  <img
                    src={schoolLogoUrl}
                    alt=""
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <Building size={150} className="text-amber-600" />
                )}
              </div>
              
              {/* School Logo Box */}
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
              
              <div className="certificate-content text-center pt-8 sm:pt-0">
                <p className="text-sm uppercase tracking-wider text-amber-700 mb-2">
                  {SchoolData?.name ?? 'School Name'}
                </p>
                
                <h1 className="text-3xl sm:text-4xl font-bold text-amber-900 mt-4">
                  Excellence Award
                </h1>
                <p className="text-sm italic text-amber-700 mt-1">
                  In Recognition of Outstanding Participation
                </p>
                
                <div className="flex items-center justify-center gap-4 my-6">
                  <div className="w-20 h-px bg-amber-600"></div>
                  <div className="w-2 h-2 bg-amber-600 rotate-45"></div>
                  <div className="w-20 h-px bg-amber-600"></div>
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
                    <div className="w-32 h-px bg-amber-600 mx-auto mb-2"></div>
                    <p className="text-xs uppercase tracking-wider">Authorized Signature</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm italic">{date}</p>
                    <div className="w-32 h-px bg-amber-600 mx-auto my-2"></div>
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