"use client";

import { useEffect, useRef, useState } from "react";
import {
    X,
    Printer,
    Receipt,
    User,
    MapPin,
    Phone,
    CreditCard,
    Gauge,
    CalendarDays,
    Loader2,
    Droplets,
} from "lucide-react";

import { useAddWaterReceipts } from "../hooks";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { Toast } from "@/components/Toast/toast";
import { AddReceiptResponse } from "../types/IWaterPayments";

type Props = {
    waterPaymentId?: string;
    onClose: () => void;
};

const DisplayReceiptForm = ({
    waterPaymentId,
    onClose,
}: Props) => {
    const addWaterReceipts = useAddWaterReceipts();

    const { handleError, clearError } =
        useErrorHandler();

    const [receipt, setReceipt] =
        useState<AddReceiptResponse | null>(null);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const loadedId =
        useRef<string | null>(null);

    useEffect(() => {
        if (!waterPaymentId) {
            setReceipt(null);
            setError(null);
            loadedId.current = null;
            return;
        }

        if (
            loadedId.current === waterPaymentId
        ) {
            return;
        }

        loadedId.current = waterPaymentId;

        const loadReceipt = async () => {
            try {
                setLoading(true);
                setError(null);

                clearError();

                console.log(
                    "Loading receipt for payment:",
                    waterPaymentId
                );

                const response =
                    await addWaterReceipts.mutateAsync({
                        waterPaymentId:
                            waterPaymentId,
                    });

                console.log(
                    "Receipt API response:",
                    response
                );

                const data =
                    response?.Data ?? response;

                console.log(
                    "Receipt data:",
                    data
                );

                let receiptData: any = null;

                if (Array.isArray(data)) {
                    receiptData =
                        data[0] ?? null;
                } else if (
                    Array.isArray(data?.Items)
                ) {
                    receiptData =
                        data.Items[0] ?? null;
                } else {
                    receiptData = data;
                }

                console.log(
                    "Final receipt data:",
                    receiptData
                );

                if (!receiptData) {
                    throw new Error(
                        "Receipt data not found."
                    );
                }

                setReceipt(
                    receiptData as AddReceiptResponse
                );
            } catch (err) {
                console.error(
                    "Failed to load receipt:",
                    err
                );

                loadedId.current = null;

                const errorMessage =
                    handleError(err) ||
                    "Failed to load receipt.";

                setError(errorMessage);

                Toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        loadReceipt();

    }, [
        waterPaymentId,
        addWaterReceipts,
        clearError,
        handleError,
    ]);

    const handleClose = () => {
        setReceipt(null);
        setError(null);
        setLoading(false);
        loadedId.current = null;

        onClose();
    };

    const handlePrint = () => {
        if (!receipt) {
            Toast.error("Receipt data is not available.");
            return;
        }

        const formatPrintAmount = (amount?: number | null) => {
            return new Intl.NumberFormat("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(amount ?? 0);
        };

        const status = getStatus(receipt.BillStatus);

        const printWindow = window.open(
            "",
            "_blank",
            "width=400,height=800"
        );

        if (!printWindow) {
            Toast.error(
                "Unable to open print window. Please allow popups."
            );
            return;
        }

        printWindow.document.open();

        printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8" />

            <title>Water Receipt - ${receipt.BillNumber ?? ""}</title>

            <style>
                @page {
                    size: 80mm auto;
                    margin: 0;
                }

                * {
                    box-sizing: border-box;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }

                html,
                body {
                    width: 80mm;
                    min-width: 80mm;
                    max-width: 80mm;
                    margin: 0;
                    padding: 0;
                    background: #ffffff;
                }

                body {
                    font-family: Arial, Helvetica, sans-serif;
                    color: #000000;
                    font-size: 11px;
                    line-height: 1.4;
                }

                .receipt {
                    width: 80mm;
                    max-width: 80mm;
                    padding: 4mm;
                    margin: 0;
                    background: #ffffff;
                }

                .center {
                    text-align: center;
                }

                .header {
                    padding-bottom: 12px;
                    border-bottom: 1px dashed #555;
                }

                .logo {
                    width: 42px;
                    height: 42px;
                    margin: 0 auto 8px auto;
                    border: 2px solid #000;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    font-weight: bold;
                }

                .office-name {
                    font-size: 17px;
                    font-weight: 800;
                    margin: 0;
                }

                .receipt-title {
                    font-size: 11px;
                    font-weight: 700;
                    margin-top: 3px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .section {
                    padding: 10px 0;
                    border-bottom: 1px dashed #777;
                }

                .section-title {
                    font-size: 11px;
                    font-weight: 800;
                    text-transform: uppercase;
                    margin-bottom: 7px;
                }

                .row {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 8px;
                    margin: 4px 0;
                }

                .label {
                    color: #333;
                    font-weight: 500;
                }

                .value {
                    text-align: right;
                    font-weight: 700;
                    word-break: break-word;
                }

                .consumer-row {
                    margin: 6px 0;
                }

                .consumer-label {
                    font-size: 9px;
                    color: #555;
                    text-transform: uppercase;
                }

                .consumer-value {
                    font-size: 11px;
                    font-weight: 700;
                    word-break: break-word;
                }

                .meter-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 5px;
                }

                .meter-table th {
                    border-bottom: 1px solid #555;
                    padding: 5px 2px;
                    font-size: 9px;
                    text-align: center;
                }

                .meter-table td {
                    padding: 6px 2px;
                    text-align: center;
                    font-weight: 700;
                }

                .amount-row {
                    display: flex;
                    justify-content: space-between;
                    margin: 6px 0;
                    gap: 10px;
                }

                .amount {
                    font-weight: 700;
                    text-align: right;
                }

                .total-row {
                    border-top: 1px dashed #555;
                    margin-top: 8px;
                    padding-top: 8px;
                    display: flex;
                    justify-content: space-between;
                    font-weight: 800;
                    font-size: 13px;
                }

                .outstanding {
                    font-size: 15px;
                    font-weight: 900;
                }

                .status {
                    text-align: center;
                    margin: 12px 0;
                    padding: 6px;
                    border: 1px solid #000;
                    font-size: 11px;
                    font-weight: 800;
                    text-transform: uppercase;
                }

                .footer {
                    text-align: center;
                    border-top: 1px dashed #555;
                    padding-top: 10px;
                    margin-top: 8px;
                }

                .footer-main {
                    font-size: 10px;
                    font-weight: 700;
                }

                .footer-small {
                    margin-top: 4px;
                    font-size: 9px;
                }

                .computer-generated {
                    margin-top: 10px;
                    padding-top: 7px;
                    border-top: 1px dashed #777;
                    font-size: 8px;
                }

                @media print {
                    html,
                    body {
                        width: 80mm !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }

                    .receipt {
                        width: 80mm !important;
                        max-width: 80mm !important;
                        margin: 0 !important;
                    }
                }
            </style>
        </head>

        <body>

            <div class="receipt">

                <!-- HEADER -->
                <div class="header center">

                    <div class="logo">
                        💧
                    </div>

                    <h1 class="office-name">
                        KHANEY PANI OFFICE
                    </h1>

                    <div class="receipt-title">
                        Water Bill / Receipt
                    </div>

                </div>


                <!-- BILL INFORMATION -->
                <div class="section">

                    <div class="row">
                        <span class="label">
                            Bill Number
                        </span>

                        <span class="value">
                            ${receipt.BillNumber ?? "-"}
                        </span>
                    </div>

                    <div class="row">
                        <span class="label">
                            Bill Date
                        </span>

                        <span class="value">
                            ${receipt.BillDate ?? "-"}
                        </span>
                    </div>

                </div>


                <!-- CONSUMER INFORMATION -->
                <div class="section">

                    <div class="section-title">
                        Consumer Information
                    </div>

                    <div class="consumer-row">
                        <div class="consumer-label">
                            Consumer Name
                        </div>

                        <div class="consumer-value">
                            ${receipt.ConsumerName ?? "-"}
                        </div>
                    </div>

                    <div class="consumer-row">
                        <div class="consumer-label">
                            Consumer ID
                        </div>

                        <div class="consumer-value">
                            ${receipt.ConsumerId ?? "-"}
                        </div>
                    </div>

                    <div class="consumer-row">
                        <div class="consumer-label">
                            Household ID
                        </div>

                        <div class="consumer-value">
                            ${receipt.HouseholdId ?? "-"}
                        </div>
                    </div>

                    <div class="consumer-row">
                        <div class="consumer-label">
                            Contact Number
                        </div>

                        <div class="consumer-value">
                            ${receipt.ContactNumber ?? "-"}
                        </div>
                    </div>

                    <div class="consumer-row">
                        <div class="consumer-label">
                            Address
                        </div>

                        <div class="consumer-value">
                            ${receipt.Address ?? "-"}
                        </div>
                    </div>

                </div>


                <!-- METER READING -->
                <div class="section">

                    <div class="section-title">
                        Meter Reading
                    </div>

                    <table class="meter-table">

                        <thead>
                            <tr>
                                <th>Previous</th>
                                <th>Current</th>
                                <th>Consumption</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>

                                <td>
                                    ${receipt.PreviousReading ?? "-"}
                                </td>

                                <td>
                                    ${receipt.CurrentReading ?? "-"}
                                </td>

                                <td>
                                    ${receipt.Consumption ?? 0}
                                </td>

                            </tr>
                        </tbody>

                    </table>

                    <div class="center" style="margin-top: 5px;">
                        Consumption: 
                        <strong>
                            ${receipt.Consumption ?? 0} Units
                        </strong>
                    </div>

                </div>


                <!-- PAYMENT -->
                <div class="section">

                    <div class="section-title">
                        Payment Summary
                    </div>

                    <div class="amount-row">
                        <span>
                            Water Charge
                        </span>

                        <span class="amount">
                            Rs. ${formatPrintAmount(
            receipt.TotalAmount
        )}
                        </span>
                    </div>

                    <div class="amount-row">
                        <span>
                            Paid Amount
                        </span>

                        <span class="amount">
                            Rs. ${formatPrintAmount(
            receipt.PaidAmount
        )}
                        </span>
                    </div>

                    <div class="total-row">

                        <span>
                            Outstanding
                        </span>

                        <span class="outstanding">
                            Rs. ${formatPrintAmount(
            receipt.OutstandingAmount
        )}
                        </span>

                    </div>

                </div>


                <!-- STATUS -->
                <div class="status">
                    ${status}
                </div>


                <!-- FOOTER -->
                <div class="footer">

                    <div class="footer-main">
                        Created:
                        ${receipt.CreatedAt ?? "-"}
                    </div>

                    <div class="footer-main" style="margin-top: 8px;">
                        Please keep this receipt for your records.
                    </div>

                    <div class="footer-small">
                        Thank you for using our water service.
                    </div>

                    <div class="computer-generated">
                        KHANEY PANI OFFICE
                        <br />
                        Computer generated receipt
                    </div>

                </div>

            </div>

        </body>
        </html>
    `);

        printWindow.document.close();

        printWindow.focus();

        setTimeout(() => {
            printWindow.print();

            setTimeout(() => {
                printWindow.close();
            }, 500);
        }, 500);
    };

    const formatAmount = (
        amount?: number
    ) => {
        return new Intl.NumberFormat(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        ).format(amount ?? 0);
    };

    const getStatus = (status?: string | number | null) => {
        if (status === null || status === undefined) {
            return "UNPAID";
        }

        return String(status).toUpperCase();
    };

    const isPaid =
        getStatus(
            receipt?.BillStatus
        ) === "PAID";

    return (
        <div className="relative flex max-h-[95vh] w-full flex-col overflow-hidden">

            {/* HEADER */}
            <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-zinc-700 dark:bg-zinc-900">

                <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                        <Receipt size={22} />
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                            Water Bill Receipt
                        </h2>

                        <p className="text-xs text-gray-500">
                            View and print water payment receipt
                        </p>
                    </div>

                </div>

                <div className="flex items-center gap-2">

                    <button
                        type="button"
                        onClick={handlePrint}
                        disabled={!receipt || loading}
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Printer size={17} />
                        Print
                    </button>

                    <button
                        type="button"
                        onClick={handleClose}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600"
                    >
                        <X size={21} />
                    </button>

                </div>
            </div>

            {/* BODY */}
            <div className="flex-1 overflow-y-auto bg-gray-100 p-5 dark:bg-zinc-950">

                {/* LOADING */}
                {loading && (
                    <div className="flex min-h-[500px] flex-col items-center justify-center gap-3">

                        <Loader2
                            size={38}
                            className="animate-spin text-blue-600"
                        />

                        <p className="text-sm text-gray-500">
                            Loading receipt...
                        </p>

                    </div>
                )}

                {/* ERROR */}
                {!loading && error && (
                    <div className="flex min-h-[400px] items-center justify-center">

                        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-5 text-center text-red-600">
                            {error}
                        </div>

                    </div>
                )}

                {/* NO RECEIPT */}
                {!loading &&
                    !error &&
                    !receipt && (
                        <div className="flex min-h-[400px] items-center justify-center">

                            <div className="rounded-xl border border-gray-200 bg-white px-6 py-5 text-center text-gray-500">
                                Receipt not found.
                            </div>

                        </div>
                    )}

                {/* RECEIPT */}
                {!loading &&
                    !error &&
                    receipt && (
                        <div
                            id="water-receipt"
                            className="mx-auto w-full max-w-[760px] overflow-hidden rounded-xl bg-white text-gray-900 shadow-xl"
                        >

                            {/* RECEIPT HEADER */}
                            <div className="border-b border-gray-200 px-8 py-7 text-center">

                                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white">
                                    <Droplets size={32} />
                                </div>

                                <h1 className="text-2xl font-extrabold tracking-wide">
                                    KHANEY PANI OFFICE
                                </h1>

                                <p className="mt-1 text-sm font-semibold uppercase tracking-[0.25em] text-gray-500">
                                    Water Bill / Receipt
                                </p>

                            </div>

                            {/* BILL INFORMATION */}
                            <div className="grid grid-cols-2 gap-4 border-b border-gray-200 px-8 py-5">

                                <div>
                                    <p className="text-xs font-medium uppercase text-gray-400">
                                        Bill Number
                                    </p>

                                    <p className="mt-1 text-sm font-bold">
                                        {receipt.BillNumber || "-"}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-xs font-medium uppercase text-gray-400">
                                        Bill Date
                                    </p>

                                    <p className="mt-1 text-sm font-bold">
                                        {receipt.BillDate || "-"}
                                    </p>
                                </div>

                            </div>

                            {/* CONSUMER */}
                            <div className="px-8 py-6">

                                <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-700">
                                    Consumer Information
                                </h3>

                                <div className="grid grid-cols-1 gap-4 rounded-xl border border-gray-200 bg-gray-50 p-5 sm:grid-cols-2">

                                    <InfoItem
                                        icon={<User size={16} />}
                                        label="Consumer Name"
                                        value={receipt.ConsumerName}
                                    />

                                    <InfoItem
                                        icon={<CreditCard size={16} />}
                                        label="Consumer ID"
                                        value={receipt.ConsumerId}
                                    />

                                    <InfoItem
                                        icon={<Receipt size={16} />}
                                        label="Household ID"
                                        value={receipt.HouseholdId}
                                    />

                                    <InfoItem
                                        icon={<Phone size={16} />}
                                        label="Contact Number"
                                        value={receipt.ContactNumber}
                                    />

                                    <div className="sm:col-span-2">
                                        <InfoItem
                                            icon={<MapPin size={16} />}
                                            label="Address"
                                            value={receipt.Address}
                                        />
                                    </div>

                                </div>

                            </div>

                            {/* METER */}
                            <div className="px-8">

                                <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-700">
                                    Meter Reading
                                </h3>

                                <div className="overflow-hidden rounded-xl border border-gray-200">

                                    <div className="grid grid-cols-3 bg-gray-100 px-5 py-3 text-xs font-bold uppercase text-gray-500">
                                        <span>Previous</span>
                                        <span>Current</span>
                                        <span>Consumption</span>
                                    </div>

                                    <div className="grid grid-cols-3 px-5 py-5">

                                        <div className="flex items-center gap-2">
                                            <Gauge size={16} className="text-gray-400" />
                                            <span className="font-semibold">
                                                {receipt.PreviousReading ?? "-"}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Gauge size={16} className="text-gray-400" />
                                            <span className="font-semibold">
                                                {receipt.CurrentReading ?? "-"}
                                            </span>
                                        </div>

                                        <div>
                                            <span className="font-bold text-blue-600">
                                                {receipt.Consumption ?? 0} Units
                                            </span>
                                        </div>

                                    </div>

                                </div>

                            </div>

                            {/* PAYMENT */}
                            <div className="px-8 py-6">

                                <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-700">
                                    Payment Summary
                                </h3>

                                <div className="rounded-xl border border-gray-200 p-5">

                                    <AmountRow
                                        label="Water Charge"
                                        amount={receipt.TotalAmount}
                                    />

                                    <AmountRow
                                        label="Paid Amount"
                                        amount={receipt.PaidAmount}
                                    />

                                    <div className="my-4 border-t border-dashed border-gray-300" />

                                    <div className="flex items-center justify-between">

                                        <span className="text-base font-bold">
                                            Outstanding Amount
                                        </span>

                                        <span className="text-xl font-extrabold text-red-600">
                                            Rs. {formatAmount(
                                                receipt.OutstandingAmount
                                            )}
                                        </span>

                                    </div>

                                </div>

                            </div>

                            {/* STATUS */}
                            <div className="flex justify-center px-8">

                                <span
                                    className={
                                        isPaid
                                            ? "rounded-full bg-green-100 px-6 py-2 text-xs font-bold uppercase tracking-wider text-green-700"
                                            : "rounded-full bg-red-100 px-6 py-2 text-xs font-bold uppercase tracking-wider text-red-700"
                                    }
                                >
                                    {getStatus(
                                        receipt.BillStatus
                                    )}
                                </span>

                            </div>

                            {/* FOOTER */}
                            <div className="mt-7 border-t border-dashed border-gray-300 px-8 py-7 text-center">

                                <div className="mb-3 flex items-center justify-center gap-2 text-gray-500">

                                    <CalendarDays size={15} />

                                    <span className="text-xs">
                                        Created:{" "}
                                        {receipt.CreatedAt || "-"}
                                    </span>

                                </div>

                                <p className="text-sm font-semibold text-gray-700">
                                    Please keep this receipt for your records.
                                </p>

                                <p className="mt-2 text-xs text-gray-400">
                                    Thank you for using our water service.
                                </p>

                                <div className="mt-5 border-t border-dashed border-gray-300 pt-4 text-[10px] text-gray-400">
                                    KHANEY PANI OFFICE
                                    <br />
                                    Computer generated receipt
                                </div>

                            </div>

                        </div>
                    )}

            </div>

        </div>
    );
};

type InfoItemProps = {
    icon: React.ReactNode;
    label: string;
    value?: string | number | null;
};

const InfoItem = ({
    icon,
    label,
    value,
}: InfoItemProps) => {
    return (
        <div className="flex items-start gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
                {icon}
            </div>

            <div className="min-w-0">

                <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                    {label}
                </p>

                <p className="mt-1 break-words text-sm font-semibold text-gray-800">
                    {value ?? "-"}
                </p>

            </div>

        </div>
    );
};

type AmountRowProps = {
    label: string;
    amount?: number | null;
};

const AmountRow = ({
    label,
    amount,
}: AmountRowProps) => {
    return (
        <div className="flex items-center justify-between py-1.5 text-sm">

            <span className="text-gray-600">
                {label}
            </span>

            <span className="font-semibold text-gray-900">
                Rs.{" "}
                {new Intl.NumberFormat("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(amount ?? 0)}
            </span>

        </div>
    );
};

export default DisplayReceiptForm;