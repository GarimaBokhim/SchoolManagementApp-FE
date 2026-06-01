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
} from "../hooks";


type Props = {
    form: UseFormReturn<UpdatePaymentsPayload>;
    onClose: () => void;
    PaymentsId: string;
};

const paymentMethods = [
    { id: 0, name: "Cash" },
    { id: 1, name: "CreditCard" },
    { id: 2, name: "DebitCard" },
    { id: 3, name: "BankTransfer" },
    { id: 4, name: "MobilePayment" },
    { id: 5, name: "Check" },
];

const EditPaymentsForm = ({ form, onClose, PaymentsId }: Props) => {
    const editPayments = useEditPayments();

    const { handleError, clearError } = useErrorHandler();


    const handleClose = () => {
        onClose();
    };



    const onSubmit: SubmitHandler<UpdatePaymentsPayload> = async (data) => {
        clearError();


        try {
            const promise = editPayments.mutateAsync({
                id: PaymentsId,
                payload: data,
            });

            await toast.promise(
                promise,
                {
                    loading: "Updating...",
                    success: (res: any) => res?.message,
                    error: (err: any) => err?.response?.data?.message,
                }
            );

            handleClose();

        } catch (error) {
            Toast.error(handleError(error));
        }
    };

    const paymentMethod = form.watch("paymentMethod") ?? 0;

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
                                    paymentMethods.find((g) => g.id === paymentMethod) ?? null
                                }
                                onSelect={(option) => {
                                    const id = option?.id ?? 0;
                                    form.setValue("paymentMethod", id);
                                }}
                                getLabel={(o) => o?.name ?? ""}
                                getValue={(o) => o?.id ?? ""}
                            />


                        </div>

                        <div className="flex justify-center mt-6">
                            <ButtonElement
                                type="submit"
                                text="Update Payments"
                            />
                        </div>
                    </form>
                </fieldset>
            </div>
        </div>
    );
};

export default EditPaymentsForm;