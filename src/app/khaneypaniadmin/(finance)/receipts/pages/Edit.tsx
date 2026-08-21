"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { AppCombobox } from "@/components/Input/ComboBox";
import { InputElement } from "@/components/Input/InputElement";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { Toast } from "@/components/Toast/toast";
import { useGetAllWaterBilling, useUpdateWaterReceipt } from "../hooks";
import { UpdateWaterReceiptPayload, WaterReceiptResponse } from "../types/IWaterReceipts";

interface Props {
    visible: boolean;
    onClose: () => void;
    waterReceipt: WaterReceiptResponse | null;
}

const paymentMethods = [
    { id: 1, name: "Cash" },
    { id: 2, name: "CreditCard" },
    { id: 3, name: "DebitCard" },
    { id: 4, name: "BankTransfer" },
    { id: 5, name: "MobilePayment" },
    { id: 6, name: "Check" },
];

const EditWaterReceipt = ({ visible, onClose, waterReceipt }: Props) => {
    const { handleError, clearError } = useErrorHandler();
    const updateWaterReceipt = useUpdateWaterReceipt();
    const { data: waterBillings = [] } = useGetAllWaterBilling();
    const form = useForm<UpdateWaterReceiptPayload>();
    const [selectedBillingId, setSelectedBillingId] = useState<string>("");
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number | null>(null);

    useEffect(() => {
        if (!waterReceipt) return;

        form.reset({
            id: waterReceipt.id,
            waterBillingId: waterReceipt.waterBillingId,
            receiptDate: waterReceipt.receiptDate,
            paymentMethods: waterReceipt.paymentMethods,
        });
        setSelectedBillingId(waterReceipt.waterBillingId);
        setSelectedPaymentMethod(waterReceipt.paymentMethods);
    }, [form, waterReceipt]);

    if (!visible || !waterReceipt) return null;

    const onSubmit = async (payload: UpdateWaterReceiptPayload) => {
        clearError();

        try {
            await updateWaterReceipt.mutateAsync({
                id: waterReceipt.id,
                payload: { ...payload, id: waterReceipt.id },
            });
            onClose();
        } catch (error) {
            Toast.error(handleError(error));
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-8 backdrop-blur-sm md:items-center md:pt-0">
            <div className="w-full max-w-3xl rounded-lg bg-[#FBFBFB] p-6 shadow-lg dark:bg-[#27272a] md:p-8">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">Edit Water Receipt</h1>
                    <button type="button" onClick={onClose} className="text-red-400 hover:text-red-500" aria-label="Close edit receipt form">
                        <X strokeWidth={3} />
                    </button>
                </div>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
                        <AppCombobox
                            value={selectedBillingId}
                            dropDownWidth="w-full"
                            dropdownPositionClass="absolute z-20"
                            label="Water Billing"
                            name="waterBillingId"
                            form={form}
                            required
                            options={waterBillings}
                            selected={waterBillings.find((billing) => billing.id === selectedBillingId) ?? null}
                            onSelect={(billing) => {
                                const id = billing?.id ?? "";
                                setSelectedBillingId(id);
                                form.setValue("waterBillingId", id, { shouldValidate: true });
                            }}
                            getLabel={(billing) => billing?.name ?? ""}
                            getValue={(billing) => billing?.id ?? ""}
                        />
                        <InputElement label="Receipt Date" form={form} name="receiptDate" inputType="date" />
                        <AppCombobox
                            value={selectedPaymentMethod}
                            dropDownWidth="w-full"
                            dropdownPositionClass="absolute z-20"
                            label="Payment Method"
                            name="paymentMethods"
                            form={form}
                            required
                            options={paymentMethods}
                            selected={paymentMethods.find((method) => method.id === selectedPaymentMethod) ?? null}
                            onSelect={(method) => {
                                const id = method?.id ?? 0;
                                setSelectedPaymentMethod(id || null);
                                form.setValue("paymentMethods", id, { shouldValidate: true });
                            }}
                            getLabel={(method) => method?.name ?? ""}
                            getValue={(method) => method?.id ?? ""}
                        />
                    </div>
                    <div className="mt-6 flex justify-center">
                        <ButtonElement type="submit" text="Update" />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditWaterReceipt;