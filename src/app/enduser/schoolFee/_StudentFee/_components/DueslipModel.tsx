"use client";
import { useRef } from "react";
import { Printer, X } from "lucide-react";
import { useGetDueSlip, IDueSlipItem } from "../hooks";

type DueSlipModalProps = {
    classId: string;
    className: string;
    onClose: () => void;
};

const DueSlipModal = ({ classId, className, onClose }: DueSlipModalProps) => {
    const { data: dueSlipData, isLoading } = useGetDueSlip(classId);
    const printRef = useRef<HTMLDivElement>(null);

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
            body { font-family: Arial, sans-serif; padding: 24px; color: #111; }
            h1 { font-size: 20px; font-weight: bold; text-align: center; margin-bottom: 4px; }
            h2 { font-size: 14px; font-weight: normal; text-align: center; margin-bottom: 2px; color: #555; }
            .meta { text-align: center; font-size: 12px; color: #777; margin-bottom: 20px; }
            .divider { border-top: 2px solid #111; margin: 12px 0; }
            .divider-light { border-top: 1px solid #ddd; margin: 8px 0; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            thead tr { background: #f3f4f6; }
            th { padding: 8px 10px; text-align: left; font-weight: 600; border-bottom: 1px solid #ccc; }
            td { padding: 7px 10px; border-bottom: 1px solid #eee; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .summary { margin-top: 20px; display: flex; justify-content: flex-end; }
            .summary-box { border: 1px solid #ccc; padding: 12px 20px; font-size: 13px; min-width: 240px; }
            .summary-row { display: flex; justify-content: space-between; gap: 24px; margin-bottom: 6px; }
            .summary-row.total { font-weight: bold; border-top: 1px solid #ccc; padding-top: 6px; margin-top: 4px; }
            .badge-due { color: #dc2626; font-weight: 600; }
          </style>
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
        <div className="fixed inset-0 ml-[16%] bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-[#353535] w-full max-w-4xl max-h-[90vh] rounded-xl shadow-xl overflow-hidden flex flex-col">

                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Due Slip — <span className="text-blue-600">{className}</span>
                    </h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            <Printer size={15} />
                            Print
                        </button>
                        <button
                            onClick={onClose}
                            className="w-9 h-9 flex items-center justify-center text-red-500 hover:text-red-700 transition-colors"
                        >
                            <X size={22} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto flex-1 p-6">
                    {isLoading ? (
                        <div className="text-center py-12 text-gray-500">Loading due slip...</div>
                    ) : !dueSlipData?.Items?.length ? (
                        <div className="text-center py-12 text-gray-500 italic">No due slip data found for this class.</div>
                    ) : (
                        <div ref={printRef}>
                            {/* Printable Header */}
                            <h1>Fee Due Slip</h1>
                            <h2>{className}</h2>
                            <p className="meta">
                                Generated: {new Date().toLocaleDateString("en-US", {
                                    year: "numeric", month: "long", day: "numeric",
                                })}
                            </p>
                            <div className="divider" />

                            {/* Table */}
                            <table className="min-w-full">
                                <thead>
                                    <tr>
                                        <th className="text-center">S.N</th>
                                        <th>Student Name</th>
                                        <th>Address</th>
                                        <th className="text-right">Total Amount</th>
                                        <th className="text-right">Paid Amount</th>
                                        <th className="text-right">Due Amount</th>
                                        <th className="text-right">Discount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dueSlipData.Items.map((item: IDueSlipItem, idx: number) => {
                                        const due = item.totalAmount - item.paidAmount;
                                        return (
                                            <tr key={idx}>
                                                <td className="text-center">{idx + 1}</td>
                                                <td>{item.studentName || "-"}</td>
                                                <td>{item.address || "-"}</td>
                                                <td className="text-right">{item.totalAmount.toLocaleString()}</td>
                                                <td className="text-right">{item.paidAmount.toLocaleString()}</td>
                                                <td className="text-right">
                                                    <span className={due > 0 ? "badge-due" : ""}>
                                                        {due.toLocaleString()}
                                                    </span>
                                                </td>
                                                <td className="text-right">{item.discount.toLocaleString()}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            {/* Summary */}
                            <div className="summary">
                                <div className="summary-box">
                                    <div className="summary-row">
                                        <span>Total Amount:</span>
                                        <span>{totalAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="summary-row">
                                        <span>Total Paid:</span>
                                        <span>{totalPaid.toLocaleString()}</span>
                                    </div>
                                    <div className="summary-row total">
                                        <span>Total Due:</span>
                                        <span className="badge-due">{totalDue.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DueSlipModal;