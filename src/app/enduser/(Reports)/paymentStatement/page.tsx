"use client";

import LayoutWrapper from "@/components/Sidebar/ClientWrapper";

export default function PaymentReports() {
  return (
    <LayoutWrapper title="Payment Reports">
      <div className="min-h-full bg-gray-100 p-6 flex items-start justify-center font-sans">
        {/* Receipt Card */}
        <div className="max-w-5xl w-full bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
          {/* Header Section with Logo on Left Only */}
          <div className="relative text-center py-6 px-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-white">
            {/* Logo - Left Side */}
            <div className="absolute left-6 top-1/2 -translate-y-1/2">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">BPA</span>
              </div>
            </div>
            
            {/* Centered Content */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-wide">
                BHALUWA PUBLIC ACADEMY
              </h1>
              <p className="text-gray-600 mt-1">Kerabari-9, Bhaluwa</p>
              <p className="text-gray-500 text-sm">Phone: 9702939500</p>
            </div>
          </div>

          {/* Centered Title */}
          <div className="px-6 pt-6">
            <h2 className="text-xl font-bold text-gray-800 text-center border-b-2 border-indigo-500 pb-3 inline-block w-full">
              STATEMENT OF STUDENT ACCOUNTS (ACCRUAL BASIS)
            </h2>
          </div>

          {/* Student Info Grid */}
          <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <div className="flex">
              <span className="w-36 font-semibold text-gray-700">
                Name of the Student:
              </span>
              <span className="text-gray-800">Aayan Limbu</span>
            </div>
            <div className="flex">
              <span className="w-36 font-semibold text-gray-700">
                Academic Year:
              </span>
              <span className="text-gray-800">2079</span>
            </div>
            <div className="flex">
              <span className="w-36 font-semibold text-gray-700">
                Student ID:
              </span>
              <span className="text-gray-800">SBPAA127579</span>
            </div>
            <div className="flex">
              <span className="w-36 font-semibold text-gray-700">Roll No.:</span>
              <span className="text-gray-800">—</span>
            </div>
            <div className="flex">
              <span className="w-36 font-semibold text-gray-700">Grade:</span>
              <span className="text-gray-800">U.K.G</span>
            </div>
            <div className="flex">
              <span className="w-36 font-semibold text-gray-700">Section:</span>
              <span className="text-gray-800">U.K.G</span>
            </div>
            <div className="flex">
              <span className="w-36 font-semibold text-gray-700">Type:</span>
              <span className="text-gray-800">Regular Student</span>
            </div>
          </div>

          {/* Table Section */}
          <div className="px-6 pb-6 overflow-x-auto">
            <table className="min-w-full border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="border border-gray-200 px-3 py-2 text-left">
                    S.N.
                  </th>
                  <th className="border border-gray-200 px-3 py-2 text-left">
                    Particular
                  </th>
                  <th className="border border-gray-200 px-3 py-2 text-left">
                    Date
                  </th>
                  <th className="border border-gray-200 px-3 py-2 text-left">
                    Bill/Receipt No.
                  </th>
                  <th className="border border-gray-200 px-3 py-2 text-left">
                    Debit Amount (Rs.)
                  </th>
                  <th className="border border-gray-200 px-3 py-2 text-left">
                    Credit Amount (Rs.)
                  </th>
                  <th className="border border-gray-200 px-3 py-2 text-left">
                    Adjustment
                  </th>
                  <th className="border border-gray-200 px-3 py-2 text-left">
                    Balance Amount (Rs.)
                  </th>
                  <th className="border border-gray-200 px-3 py-2 text-left">
                    Remarks
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Data Row */}
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-3 py-2 text-center">
                    —
                  </td>
                  <td className="border border-gray-200 px-3 py-2">—</td>
                  <td className="border border-gray-200 px-3 py-2">—</td>
                  <td className="border border-gray-200 px-3 py-2">—</td>
                  <td className="border border-gray-200 px-3 py-2 text-right">
                    0.00
                  </td>
                  <td className="border border-gray-200 px-3 py-2 text-right">
                    0.00
                  </td>
                  <td className="border border-gray-200 px-3 py-2 text-right">
                    0.00
                  </td>
                  <td className="border border-gray-200 px-3 py-2 text-right">
                    0.00
                  </td>
                  <td className="border border-gray-200 px-3 py-2">—</td>
                </tr>
                {/* Total Row */}
                <tr className="bg-gray-50 font-semibold">
                  <td
                    colSpan={4}
                    className="border border-gray-200 px-3 py-2 text-right"
                  >
                    Total (Rs.)
                  </td>
                  <td className="border border-gray-200 px-3 py-2 text-right">
                    0.00
                  </td>
                  <td className="border border-gray-200 px-3 py-2 text-right">
                    0.00
                  </td>
                  <td className="border border-gray-200 px-3 py-2 text-right">
                    0.00
                  </td>
                  <td className="border border-gray-200 px-3 py-2 text-right">
                    0.00
                  </td>
                  <td className="border border-gray-200 px-3 py-2"></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Total Amount NIL */}
          <div className="px-6 pb-6 text-right">
            <p className="text-md font-bold text-gray-800">
              Total Amount: <span className="text-indigo-600">NIL</span>
            </p>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}