import ReactDOMServer from 'react-dom/server'
import Receipt from '@/app/enduser/schoolFee/_StudentFee/_components/Receipt'
import { IFeeStructureItem } from '@/app/enduser/schoolFee/_StudentFee/types/IStudentFee'

type ReceiptData = {
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

export function printReceipt(data: ReceiptData) {
  const markup = ReactDOMServer.renderToStaticMarkup(Receipt(data))

  const printWindow = window.open('', '_blank', 'width=800,height=900')
  if (!printWindow) {
    alert('Please allow popups to print the receipt')
    return
  }

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Payment Receipt</title>
        <style>
          * { box-sizing: border-box; }
          body { font-family: Arial, sans-serif; font-size: 13px; color: #000; margin: 0; padding: 20px; }
          table { border-collapse: collapse; }
          @media print {
            @page { margin: 15mm; }
          }
        </style>
      </head>
      <body>
        ${markup}
      </body>
    </html>
  `

  printWindow.document.open()
  printWindow.document.write(html)
  printWindow.document.close()

  printWindow.onload = () => {
    printWindow.focus()
    printWindow.print()
    setTimeout(() => printWindow.close(), 500)
  }
}
