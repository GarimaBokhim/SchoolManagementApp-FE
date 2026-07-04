'use client'

import React, { useState, useRef } from 'react'
import { Printer, X } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import StudentIDCard from './printstudentcard'

export const PrintIDCardButton = ({ StudentId }: { StudentId: string }) => {
  const [showModal, setShowModal] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleDirectPrint = () => {
    if (!cardRef.current) {
      toast.error('Card not loaded')
      return
    }

    const cardHTML = cardRef.current.innerHTML
    if (!cardHTML) {
      toast.error('Card content empty')
      return
    }

    const printWindow = window.open('', '', 'width=800,height=600')
    if (!printWindow) {
      toast.error('Could not open print window')
      return
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Student ID Card</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body {
              margin: 0;
              padding: 20px;
              background: white;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            @media print {
              body {
                padding: 0;
                margin: 0;
              }
            }
          </style>
        </head>
        <body>
          ${cardHTML}
          <script>
            window.onload = function() {
              setTimeout(() => window.print(), 200);
            };
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  return (
    <>
      <Toaster position="top-right" />

      <ButtonElement
        icon={<Printer size={18} />}
        type="button"
        text=""
        onClick={() => setShowModal(true)}
        className="!text-xs !bg-purple-500 hover:!bg-purple-600 py-[0.6rem] px-2 pl-3"
      />

      {showModal && (
        <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Print Student ID Card</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 bg-gray-50 flex justify-center overflow-auto">
              <div ref={cardRef}>
                <StudentIDCard StudentId={StudentId} />
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition"
              >
                Close
              </button>
              <button
                onClick={handleDirectPrint}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition"
              >
                <Printer size={16} />
                Print
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
