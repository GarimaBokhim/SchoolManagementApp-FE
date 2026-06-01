'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { AddPaymentsPayload } from '../types/IPayments'
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { useAddPayments } from "../hooks";
import toast from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { AppCombobox } from "@/components/Input/ComboBox";

type Props = {
    form: UseFormReturn<AddPaymentsPayload>;
    onClose: () => void;
    invoiceId: string;
    onSuccess?: () => void;
};

const AddPaymentsForms = ({ form, onClose, onSuccess, invoiceId }: Props) => {
    const addPayments = useAddPayments();
    const { handleError, clearError } = useErrorHandler();

    const [paymentMethod, setPaymentMethod] = useState<number | null>(null);

    // Optional: sync invoiceId into form (recommended)
    useEffect(() => {
        if (invoiceId) {
            form.setValue("invoiceId", invoiceId);
        }
    }, [invoiceId, form]);

    const handleClose = () => {
        form.reset({
            invoiceId: "",
            amount: 0,
            paymentDate: "",
            paymentMethod: 0
        });

        setPaymentMethod(null);
        onClose();
    };

    const onSubmit: SubmitHandler<AddPaymentsPayload> = async (data) => {
        clearError();

        const finalInvoiceId = String(invoiceId ?? "").trim();

        if (!finalInvoiceId) {
            Toast.error("Please select Invoice");
            return;
        }

        try {
            await toast.promise(
                addPayments.mutateAsync({
                    invoiceId: finalInvoiceId,
                    amount: data.amount,
                    paymentDate: data.paymentDate,
                    paymentMethod: data.paymentMethod
                }),
                {
                    loading: "Adding Payments...",
                    success: "Successfully added Payments",
                }
            );

            handleClose();
            onSuccess?.();

        } catch (error) {
            const errorMsg = handleError(error);
            Toast.error(errorMsg);
        }
    };

    return (
        <div className="inset-0 flex items-center justify-center w-full h-full">
            <div className="w-full h-[100%] bg-[#ffffff] dark:bg-[#27272a] p-4 overflow-auto relative dark:text-white">

                <fieldset>
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
                            Add Payments
                        </h1>

                        <button
                            type="button"
                            onClick={handleClose}
                            className="text-red-400 text-2xl hover:text-red-500"
                        >
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

                            <InputElement
                                label="Payment Date"
                                form={form}
                                name="paymentDate"
                                inputType="date"
                                required
                            />

                            <AppCombobox
                                label="Payment Method"
                                dropdownPositionClass="absolute"
                                name="paymentMethod"
                                form={form}
                                value={paymentMethod}
                                options={[
                                    { id: 0, name: 'Cash' },
                                    { id: 1, name: 'CreditCard' },
                                    { id: 2, name: 'DebitCard' },
                                    { id: 3, name: 'BankTransfer' },
                                    { id: 4, name: 'MobilePayment' },
                                    { id: 5, name: 'Check' },
                                ]}
                                dropDownWidth="w-full"
                                selected={
                                    [
                                        { id: 0, name: 'Cash' },
                                        { id: 1, name: 'CreditCard' },
                                        { id: 2, name: 'DebitCard' },
                                        { id: 3, name: 'BankTransfer' },
                                        { id: 4, name: 'MobilePayment' },
                                        { id: 5, name: 'Check' },
                                    ].find((g) => g.id === paymentMethod) || null
                                }
                                onSelect={(option) => {
                                    setPaymentMethod(option?.id ?? null);
                                    form.setValue('paymentMethod', option?.id ?? 0);
                                }}
                                getLabel={(o) => o?.name || ''}
                                getValue={(o) => o?.id ?? ''}
                            />

                        </div>

                        <div className="flex justify-center mt-6">
                            <ButtonElement type="submit" text="Submit" />
                        </div>
                    </form>

                </fieldset>
            </div>
        </div>
    );
};

export default AddPaymentsForms;