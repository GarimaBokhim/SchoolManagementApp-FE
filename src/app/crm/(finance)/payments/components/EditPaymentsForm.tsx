"use client";

import { useEffect, useState } from "react";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { adToBs, bsToAd } from "@sbmdkl/nepali-date-converter";
import { useDate } from "@/context/auth/PrimaryDateContext";

import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { AppCombobox } from "@/components/Input/ComboBox";

import useErrorHandler from "@/components/helpers/ErrorHandling";

import {
    UpdatePaymentsPayload,
} from "../types/IPayments";

import {
    useEditPayments,
    useGetPaymentsById,
} from "../hooks";

type ApplicantType = {
    id: string;
    fullName: string;
};

type Props = {
    form: UseFormReturn<UpdatePaymentsPayload>;
    onClose: () => void;
    onSuccess?: () => void;
    PaymentsId: string;
    allapplicant?: ApplicantType[];
};

const paymentMethods = [
    { id: 0, name: "Cash" },
    { id: 1, name: "CreditCard" },
    { id: 2, name: "DebitCard" },
    { id: 3, name: "BankTransfer" },
    { id: 4, name: "MobilePayment" },
    { id: 5, name: "Check" },
];

const EditPaymentsForm = ({
    form,
    onClose,
    onSuccess,
    PaymentsId,
    allapplicant = [],
}: Props) => {
    const editPayments = useEditPayments();

    const { handleError, clearError } = useErrorHandler();
    const { isPrimaryBS } = useDate();

    const { data: PaymentsData } = useGetPaymentsById(PaymentsId);

    const [paymentMethod, setPaymentMethod] = useState<number | null>(null);
    const [selectedApplicantId, setSelectedApplicantId] = useState<string | null>(null);

    const handleClose = () => {
        form.reset();
        setPaymentMethod(null);
        setSelectedApplicantId(null);
        onClose();
    };

    // =========================
    // ✅ FIXED DATE MAPPING (WORKING VERSION)
    // =========================
    useEffect(() => {
        if (!PaymentsData) return;

        const applicantId = PaymentsData?.applicantId ?? "";
        const method = Number(PaymentsData?.paymentMethod ?? 0);

        let rawDate = PaymentsData?.paymentDate ?? "";
        rawDate = rawDate.split("T")[0]; // remove time

        let finalDate = rawDate;

        // 🔥 If backend accidentally sends BS → convert to AD
        const year = Number(rawDate.split("-")[0]);

        if (year >= 2000 && year <= 2090) {
            try {
                finalDate = bsToAd(rawDate);
            } catch {
                finalDate = rawDate;
            }
        }

        form.reset({
            applicantId,
            amount: Number(PaymentsData?.amount ?? 0),

            // ✅ IMPORTANT: ALWAYS AD for input type="date"
            paymentDate: finalDate,

            paymentMethod: method,
        });

        setSelectedApplicantId(applicantId);
        setPaymentMethod(method);
    }, [PaymentsData, form]);

    const onSubmit: SubmitHandler<UpdatePaymentsPayload> = async (data) => {
        clearError();

        try {
            let finalDate = data.paymentDate;

            // BS → AD only before API submit
            if (isPrimaryBS && finalDate) {
                try {
                    finalDate = bsToAd(finalDate);
                } catch {
                    finalDate = data.paymentDate;
                }
            }

            await editPayments.mutateAsync({
                id: PaymentsId,
                data: {
                    applicantId: String(data.applicantId ?? ""),
                    amount: Number(data.amount ?? 0),
                    paymentDate: finalDate,
                    paymentMethod: Number(data.paymentMethod ?? 0),
                },
            });

            Toast.success("Payments updated successfully");

            handleClose();
            onSuccess?.();
        } catch (error) {
            Toast.error(handleError(error));
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-black/40 backdrop-blur-sm ml-12 md:ml-64 sm:ml-16 xs:ml-0">
            <div className="bg-[#FBFBFB] dark:bg-[#27272a] w-full max-w-[95vw] md:max-w-[85vw] lg:max-w-[75vw] xl:max-w-[70vw] max-h-[95vh] md:max-h-[92vh] h-full rounded-lg overflow-auto p-6 md:p-8 shadow-lg">

                <fieldset>
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
                            Update Payments
                        </h1>

                        <button type="button" onClick={handleClose}>
                            <X strokeWidth={3} />
                        </button>
                    </div>

                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                            <InputElement
                                label="Amount"
                                form={form}
                                name="amount"
                                placeholder="Enter amount"
                                required
                            />

                            {/* ✅ FIXED DATE INPUT */}
                            <InputElement
                                label="Payment Date"
                                form={form}
                                name="paymentDate"
                                inputType="date"
                                placeholder="YYYY-MM-DD"
                                required
                            />

                            <AppCombobox
                                label="Payment Method"
                                name="paymentMethod"
                                form={form}
                                value={paymentMethod}
                                options={paymentMethods}
                                selected={
                                    paymentMethods.find((g) => g.id === paymentMethod) || null
                                }
                                onSelect={(option) => {
                                    const id = option?.id ?? 0;
                                    setPaymentMethod(id);
                                    form.setValue("paymentMethod", id);
                                }}
                                getLabel={(o) => o?.name ?? ""}
                                getValue={(o) => o?.id ?? ""}
                            />

                            <AppCombobox
                                label="Applicant"
                                name="applicantId"
                                form={form}
                                value={selectedApplicantId}
                                options={allapplicant}
                                selected={
                                    allapplicant.find((g) => g.id === selectedApplicantId) || null
                                }
                                onSelect={(group) => {
                                    const id = group?.id ?? "";
                                    setSelectedApplicantId(id);
                                    form.setValue("applicantId", id);
                                }}
                                getLabel={(g) => g?.fullName ?? ""}
                                getValue={(g) => g?.id ?? ""}
                            />
                        </div>

                        <div className="flex justify-center mt-6">
                            <ButtonElement
                                type="submit"
                                text={editPayments.isPending ? "Updating..." : "Update Payments"}
                            />
                        </div>
                    </form>
                </fieldset>
            </div>
        </div>
    );
};

export default EditPaymentsForm;