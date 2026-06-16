'use client'
import { X } from 'lucide-react'
import { useGetSchoolById } from '@/app/admin/Setup/School/hooks'
import { useRef, useEffect } from 'react'

import { INotice } from '../types/INotice'

interface Props {
  notice: INotice
  onClose: () => void
}

const GenerateNotice: React.FC<Props> = ({ notice, onClose }) => {
  const storedUser = localStorage.getItem('userDetails')
  let schoolId = ''
  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser)
      schoolId = parsedUser.schoolId
    } catch (error) {
      console.error('Failed to parse user details:', error)
    }
  }

  const { data: SchoolData } = useGetSchoolById(schoolId)
  const modalRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = (e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose()
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handlePrint = () => {
    const content = document.getElementById('notice')?.innerHTML
    if (!content) return

    const printWindow = window.open('', '', 'width=900,height=1000')
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Notice</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }

            body {
              font-family: system-ui, -apple-system, sans-serif;
              line-height: 1.6;
              color: #333;
            }

            .clip-path-diagonal {
              clip-path: polygon(0 0, 100% 0, 70% 100%, 0% 100%);
            }

            /* Header Styling */
            .bg-sky-900 {
              background-color: #075985 !important;
              color: white !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            .bg-sky-800 {
              background-color: #0c4a6e !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            .text-white {
              color: white !important;
            }

            .text-gray-800 {
              color: #1f2937 !important;
            }

            .text-gray-700 {
              color: #374151 !important;
            }

            .text-gray-600 {
              color: #4b5563 !important;
            }

            .bg-white {
              background-color: white !important;
            }

            @media print {
              body {
                margin: 0;
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          ${content}
          <script>
            window.onload = function() {
              setTimeout(() => window.print(), 500);
            };
          </script>
        </body>
      </html>
    `)

    printWindow.document.close()
  }
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm items-center justify-center p-2 flex flex-col">
      <div
        ref={modalRef}
        className="bg-white w-full sm:w-[90%] max-w-[900px] rounded-md p-4 shadow-xl overflow-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Print Notice</h2>{' '}
          <button onClick={onClose} className="text-red-500 text-xl">
            <X />{' '}
          </button>{' '}
        </div>
        <div
          id="notice"
          className="bg-white mx-auto shadow-lg"
          style={{ width: '210mm', minHeight: '297mm' }}
        >
          {/* Header */}
          <div className="relative bg-sky-900 text-white px-6 py-8">
            <div className="absolute inset-y-0 left-0 w-24 bg-sky-800 clip-path-diagonal" />
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <p className="text-sm">{SchoolData?.address}</p>
                <p className="text-sm">{SchoolData?.email}</p>
                <p className="text-sm">{SchoolData?.contactNumber}</p>
              </div>
              <div className="text-right">
                <h1 className="text-xl font-semibold">{SchoolData?.name}</h1>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-10 py-8 text-gray-800">
            <h2 className="text-2xl font-bold text-center mb-6">
              {notice.title || 'School Notice'}
            </h2>

            <div
              className="prose max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: notice.contentHtml }}
            />

            {/* Footer */}
            <div className="mt-16 flex justify-between text-sm text-gray-600">
              <span>Generated on: {new Date().toLocaleDateString()}</span>
              <span className="font-medium">Authorized Signature</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-700 text-white rounded"
          >
            Print Notice
          </button>
        </div>
      </div>
    </div>
  )
}

export default GenerateNotice
