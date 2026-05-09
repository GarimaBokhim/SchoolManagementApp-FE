"use client";
import { useRef } from "react";
import { Printer, X } from "lucide-react";
import { useGetDueSlip, IDueSlipItem } from "../hooks";
import { useGetSchoolById } from "@/app/admin/Setup/School/hooks";

type DueSlipModalProps = {
    classId: string;
    className: string;
    onClose: () => void;
};

const DueSlipModal = ({ classId, className, onClose }: DueSlipModalProps) => {
    const { data: dueSlipData, isLoading } = useGetDueSlip(classId);
    const printRef = useRef<HTMLDivElement>(null);

    // Get school details from localStorage (similar to admit card)
    const schoolId = typeof window !== 'undefined' ? (() => {
        try {
            const storedUser = localStorage.getItem('userDetails');
            if (!storedUser) return null;
            return JSON.parse(storedUser).schoolId ?? null;
        } catch {
            return null;
        }
    })() : null;

    const { data: schoolDetail } = useGetSchoolById(schoolId || undefined);

    const handlePrint = () => {
        const printContents = printRef.current?.innerHTML;
        if (!printContents) return;
        const win = window.open("", "_blank");
        if (!win) return;
        win.document.write(`
      <html>
        <head>
          <title>Due Slip - ${className}</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: Arial, sans-serif; background: #f0f0f0; padding: 20px; }
            .print-container { max-width: 1000px; margin: 0 auto; }
            @media print {
              body { background: white; padding: 0; }
              .no-print { display: none; }
            }
          </style>
          <link rel="stylesheet" href="${window.location.origin}/globals.css" />
        </head>
        <body>${printContents}</body>
      </html>
    `);
        win.document.close();
        win.focus();
        win.print();
        win.close();
    };

    const totalAmount = dueSlipData?.Items?.reduce((s, i) => s + (i.totalAmount ?? 0), 0) ?? 0;
    const totalPaid = dueSlipData?.Items?.reduce((s, i) => s + (i.paidAmount ?? 0), 0) ?? 0;
    const totalDue = totalAmount - totalPaid;

    return (
        <div className="fixed inset-0 ml-[16%] bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-[95vw] md:max-w-[85vw] lg:max-w-[80vw] xl:max-w-[75vw] max-h-[90vh] overflow-auto">

                {/* Modal Header */}
                <div className="sticky top-0 bg-white z-10 flex justify-between items-center px-6 py-4 border-b border-gray-200">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Due Slip Report</h2>
                        <p className="text-sm text-gray-500">{className}</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            <Printer size={16} />
                            Print Report
                        </button>
                        <button
                            onClick={onClose}
                            className="px-3 py-2 text-red-500 hover:text-red-700 transition-colors"
                        >
                            <X size={22} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="text-center py-12 text-gray-500">Loading due slip...</div>
                    ) : !dueSlipData?.Items?.length ? (
                        <div className="text-center py-12 text-gray-500 italic">No due slip data found for this class.</div>
                    ) : (
                        <div ref={printRef} className="print-container">
                            {dueSlipData.Items.map((item: IDueSlipItem, idx: number) => {
                                const due = item.totalAmount - item.paidAmount;
                                return (
                                    <div key={idx} className="mb-6 break-inside-avoid">
                                        {/* Individual Due Slip Card */}
                                        <div className="bg-white border border-gray-300 rounded-md shadow-sm overflow-hidden">

                                            {/* Header Section */}
                                            <div className="bg-blue-900 text-white px-6 py-4">
                                                <div className="text-center">
                                                    <h1 className="text-xl font-extrabold text-yellow-400">
                                                        {schoolDetail?.name ?? 'School Name'}
                                                    </h1>
                                                    <p className="text-xs mt-1">{schoolDetail?.address ?? '-'}</p>
                                                    <p className="text-xs">{schoolDetail?.contactNumber ?? '-'}</p>
                                                    <div className="mt-2 pt-2 border-t border-blue-700">
                                                        <p className="text-sm font-semibold">FEE DUE SLIP</p>
                                                        <p className="text-xs opacity-90">{className}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Body Section with Side Label */}
                                            <div className="flex">
                                                {/* Side Label */}
                                                <div className="w-10 bg-blue-900 text-yellow-400 flex items-center justify-center">
                                                    <span className="[writing-mode:vertical-lr] [text-orientation:mixed] text-xs font-bold tracking-wider">
                                                        DUE DETAILS
                                                    </span>
                                                </div>

                                                {/* Main Content */}
                                                <div className="flex-1 p-6">
                                                    <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                                                        <div>
                                                            <b className="text-gray-700">Student Name:</b>{' '}
                                                            <span className="text-gray-900">{item.studentName || '-'}</span>
                                                        </div>
                                                        <div>
                                                            <b className="text-gray-700">Address:</b>{' '}
                                                            <span className="text-gray-900">{item.address || '-'}</span>
                                                        </div>
                                                        <div>
                                                            <b className="text-gray-700">Total Amount:</b>{' '}
                                                            <span className="text-gray-900 font-semibold">
                                                                Rs. {item.totalAmount.toLocaleString()}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <b className="text-gray-700">Paid Amount:</b>{' '}
                                                            <span className="text-green-600 font-semibold">
                                                                Rs. {item.paidAmount.toLocaleString()}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <b className="text-gray-700">Due Amount:</b>{' '}
                                                            <span className={`font-semibold ${due > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                                Rs. {due.toLocaleString()}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <b className="text-gray-700">Discount:</b>{' '}
                                                            <span className="text-gray-900">Rs. {item.discount.toLocaleString()}</span>
                                                        </div>
                                                    </div>

                                                    {/* Footer with date */}
                                                    <div className="mt-6 pt-4 border-t border-gray-200">
                                                        <div className="flex justify-between text-xs">
                                                            <span className="text-gray-500">
                                                                Generated: {new Date().toLocaleDateString()}
                                                            </span>
                                                            <span className="text-gray-500 font-semibold">
                                                                Authorized Signature
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Summary Section */}
                            {dueSlipData.Items.length > 1 && (
                                <div className="mt-8 bg-gray-50 border border-gray-200 rounded-md overflow-hidden">
                                    <div className="bg-gray-100 px-6 py-3 border-b border-gray-200">
                                        <h3 className="font-semibold text-gray-800">Class Summary</h3>
                                    </div>
                                    <div className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                                                <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                                                <p className="text-xl font-bold text-gray-800">
                                                    Rs. {totalAmount.toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                                                <p className="text-sm text-gray-500 mb-1">Total Paid</p>
                                                <p className="text-xl font-bold text-green-600">
                                                    Rs. {totalPaid.toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                                                <p className="text-sm text-gray-500 mb-1">Total Due</p>
                                                <p className={`text-xl font-bold ${totalDue > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                    Rs. {totalDue.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DueSlipModal;