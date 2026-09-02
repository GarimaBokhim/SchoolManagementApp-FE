'use client'
import React from 'react'
import { X } from 'lucide-react'
import { useGetAllDistrict, useGetAllProvince } from '@/components/common/hooks'
import { useGenerateCertificateByStudent } from '../hooks'
import { useGetStudentById } from '@/app/enduser/(StudentManagement)/Student/hooks'
import { buildBackendAssetUrl } from '@/utils/backendUrl'

interface Props {
  studentId: string
  onClose: () => void
  examId: string
}

const SchoolCertificate: React.FC<Props> = ({ studentId, examId, onClose }) => {
  const { data: allProvince } = useGetAllProvince()
  const { data: allDistrict } = useGetAllDistrict()
  const { data: StudentData } = useGetStudentById(studentId)
  const { data: certificateData } = useGenerateCertificateByStudent(
    studentId,
    examId
  )
  const handlePrint = () => {
    const content = document.getElementById('certificate')?.innerHTML
    if (!content) return

    const printWindow = window.open('', '', 'width=1200,height=900')
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Certificate</title>
          <style>
            *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

            body {
              font-family: 'Times New Roman', Times, serif;
              color: #333;
              line-height: 1.6;
            }

            /* Tailwind utilities used in the certificate */
            .flex { display: flex; }
            .items-start { align-items: flex-start; }
            .items-center { align-items: center; }
            .justify-between { justify-content: space-between; }
            .justify-center { justify-content: center; }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .text-justify { text-align: justify; }
            .italic { font-style: italic; }
            .font-bold { font-weight: 700; }
            .font-semibold { font-weight: 600; }
            .font-medium { font-weight: 500; }
            .w-full { width: 100%; }
            .w-28 { width: 7rem; }
            .h-auto { height: auto; }
            .relative { position: relative; }
            .overflow-hidden { overflow: hidden; }
            .border-2 { border: 2px solid; }
            .border-black { border-color: #000; }
            .border-gray-400 { border-color: #9ca3af; }
            .gap-8 { gap: 2rem; }
            .mb-2 { margin-bottom: 0.5rem; }
            .mb-6 { margin-bottom: 1.5rem; }
            .mb-20 { margin-bottom: 5rem; }
            .mt-1 { margin-top: 0.25rem; }
            .mt-3 { margin-top: 0.75rem; }
            .pt-1 { padding-top: 0.25rem; }
            .pt-2 { padding-top: 0.5rem; }
            .pb-4 { padding-bottom: 1rem; }
            .px-5 { padding-left: 1.25rem; padding-right: 1.25rem; }
            .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
            .p-12 { padding: 3rem; }
            .px-18 { padding-left: 4.5rem; padding-right: 4.5rem; }
            .rounded-3xl { border-radius: 1.5rem; }
            .text-xs { font-size: 0.75rem; }
            .text-sm { font-size: 0.875rem; }
            .text-md { font-size: 1rem; }
            .text-4xl { font-size: 2.25rem; }
            .text-7xl { font-size: 4.5rem; }
            .text-white { color: #fff; }
            .text-gray-700 { color: #374151; }
            .text-blue-800 { color: #1e40af; }
            .text-blue-900 { color: #1e3a8a; }
            .bg-white { background-color: #fff; }
            .bg-red-800 { background-color: #991b1b; }
            .flex-1 { flex: 1 1 0%; }
            .w-1\\/3 { width: 33.333%; }
            .leading-relaxed { line-height: 1.625; }
            .shadow-xl { box-shadow: 0 20px 25px -5px rgba(0,0,0,.1),0 8px 10px -6px rgba(0,0,0,.1); }

            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.onload = () => {
      printWindow.focus()
      printWindow.print()
      printWindow.close()
    }
  }
  return (
    <div
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center
             bg-black/40 backdrop-blur-sm ml-12 md:ml-64 sm:ml-16 xs:ml-0"
    >
      <div
        className="bg-[#FBFBFB] dark:bg-[#27272a]
               w-full max-w-[95vw] md:max-w-[85vw] lg:max-w-[75vw] xl:max-w-[70vw]
 h-full
               rounded-lg overflow-auto md:p-8 shadow-lg"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
            Print Certificate
          </h1>
          <button
            type="button"
            onClick={onClose}
            className="text-red-400 text-2xl hover:text-red-500 "
          >
            <X strokeWidth={3} />
          </button>
        </div>
        <div
          id="certificate"
          className="shadow-xl font-[Times_New_Roman] h-[794px] w-[1123px] mx-auto p-12 px-18 bg-white print:w-[794px] print:h-[1123px]"
          style={{
            backgroundImage: "url('/assets/border.png')",
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 100%',
          }}
        >
          <header className=" pb-4 mb-2">
            <div className="flex items-start ">
              <div className="w-28 mt-6">
                <img
                  src="/assets/logo.png"
                  alt="Logo"
                  className="w-full h-auto"
                />
              </div>

              <div className="flex ml-[-13%] w-full">
                <div className="w-full">
                  <div className=" text-sm text-blue-900 font-medium  ">
                    <div className="text-right text-xs text-gray-700">
                      <p>WhatsApp: 98XXXXXXXX</p>
                      <p>email@example.com</p>
                    </div>
                  </div>

                  <div className="text-center text-blue-800">
                    <h2 className="text-7xl font-bold ">Ekta Academy</h2>
                    <p className="text-md mt-1 font-semibold">
                      Damak-04, Jhapa, Koshi Province, Nepal
                    </p>
                    <p className="text-md mt-1 font-semibold">
                      (Estd: 2053 BS)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="flex items-start mb-6 justify-between">
            <p className="mt-[1.7rem] font-semibold">
              <strong>S. No.:</strong> 1567
            </p>
            <h1 className="bg-red-800 px-5 py-4 text-white text-center text-4xl font-bold rounded-3xl">
              CHARACTER CERTIFICATE
            </h1>
            <div className="w-[120px] h-[130px] border-2 mt-[-2.5rem] border-black flex items-center justify-center relative overflow-hidden">
              {StudentData?.studentImg && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={buildBackendAssetUrl(StudentData.studentImg) ?? undefined}
                  alt="Student Image"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}
            </div>
          </div>

          <div className="flex gap-8 mb-6 items-start">
            <div className="flex-1 text-[16px] leading-relaxed">
              <p className="text-justify my-3">
                This is to certify that Ms.{' '}
                <strong>{certificateData?.fullName}</strong>, daughter of Mr.{' '}
                <strong>{certificateData?.parentsName}</strong>, inhabitant of{' '}
                <strong>
                  {
                    allProvince?.Items.find(
                      (i) => i.Id === Number(certificateData?.provinceId)
                    )?.provinceNameInEnglish
                  }
                </strong>{' '}
                Province,
                <strong>
                  {' '}
                  {
                    allDistrict?.Items.find(
                      (i) => i.Id === Number(certificateData?.districtId)
                    )?.districtNameInEnglish
                  }
                </strong>{' '}
                district, <strong>{certificateData?.wardNumber}</strong>, was a
                bonafide student of this college. She passed{' '}
                <strong>{certificateData?.certificateProgram || 'SEE'}</strong>{' '}
                Examinations in the year{' '}
                <strong>{`${certificateData?.yearOfCompletion}`}</strong> and
                secured <strong>{certificateData?.percentage}%</strong> with{' '}
                <strong>{certificateData?.division}</strong> division. Her
                conduct while at college was commendable. As per our record, her
                date of birth is{' '}
                <strong>{`${certificateData?.dateOfBirth}`}</strong> B.S. (
                <strong>{`${certificateData?.dateOfBirth}`}</strong> A.D.).We
                hold no information against her character.
              </p>

              <p className="italic mt-3 text-start">
                We extend our best wishes for her future endeavors and success
                in life.
              </p>
            </div>
          </div>

          <footer className=" border-gray-400 pt-2">
            <div className="text-sm mb-20">
              <div>
                <strong>SLC Symbol No.:</strong> {certificateData?.symbolNumber}
              </div>
              <div>
                <strong>SLC Registration No.:</strong>{' '}
                {certificateData?.registrationNumber}
              </div>
              <div>
                <strong>Date of Issue:</strong>{' '}
                {`${certificateData?.dateOfIssue}`}
              </div>
            </div>

            <div className="flex justify-between text-center ">
              <div className="w-1/3 pt-1 font-semibold">Issuing Staff</div>
              <div className="w-1/3  pt-1 font-semibold">College Seal</div>
              <div className="w-1/3 pt-1 font-semibold">Campus Chief</div>
            </div>
          </footer>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-700 text-white rounded"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  )
}

export default SchoolCertificate
