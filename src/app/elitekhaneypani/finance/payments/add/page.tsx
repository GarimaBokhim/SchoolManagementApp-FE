"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { AppCombobox } from "@/components/Input/ComboBox";
import { Toast } from "@/components/Toast/toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { MobilePageHeader } from "../../../components/MobilePageHeader";
import { paymentMethodOptions } from "../../../utils/format";
import { useAddWaterPayment, useGetHouseholdsForFinance } from "../../hooks/useFinance";
import { AddWaterPaymentPayload } from "../../types/finance.types";

export default function AddPaymentPage() {
    const router = useRouter();
    const { handleError, clearError } = useErrorHandler();
    const addPayment = useAddWaterPayment();
    const { data: households } = useGetHouseholdsForFinance();
    const [selectedHouseholdId, setSelectedHouseholdId] = useState<string | null>(null);
    const [selectedMethod, setSelectedMethod] = useState<number | null>(null);

    const form = useForm<AddWaterPaymentPayload>({
        defaultValues: { houseHoldId: "", paymentDate: "", paidAmount: 0, paymentMethods: 0 },
    });

    const onSubmit = async (data: AddWaterPaymentPayload) => {
        clearError();
        try {
            await addPayment.mutateAsync(data);
            router.push("/elitekhaneypani/finance/payments");
        } catch (error) {
            Toast.error(handleError(error));
        }
    };

    return (
        <div className="p-4 pb-24 space-y-4">
            <MobilePageHeader title="Add Payment" />

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <AppCombobox
                    label="Household"
                    name="houseHoldId"
                    form={form}
                    required
                    value={selectedHouseholdId}
                    options={households || []}
                    selected={households?.find((h) => h.id === selectedHouseholdId) || undefined}
                    onSelect={(household) => {
                        const id = household?.id ?? "";
                        setSelectedHouseholdId(id || null);
                        form.setValue("houseHoldId", id, { shouldValidate: true });
                    }}
                    getLabel={(h) => h?.consumerName ?? ""}
                    getValue={(h) => h?.id ?? ""}
                />

                <InputElement label="Payment Date" form={form} name="paymentDate" inputType="date" required />
                <InputElement label="Paid Amount" form={form} name="paidAmount" inputType="number" required />

                <AppCombobox
                    label="Payment Method"
                    name="paymentMethods"
                    form={form}
                    required
                    value={selectedMethod}
                    options={paymentMethodOptions}
                    selected={paymentMethodOptions.find((m) => m.id === selectedMethod) || undefined}
                    onSelect={(method) => {
                        const id = method?.id ?? 0;
                        setSelectedMethod(id || null);
                        form.setValue("paymentMethods", id, { shouldValidate: true });
                    }}
                    getLabel={(m) => m?.name ?? ""}
                    getValue={(m) => m?.id ?? 0}
                />

                <ButtonElement type="submit" text="Save Payment" isLoading={addPayment.isPending} className="w-full py-3 rounded-xl" />
            </form>
        </div>
    );
}
