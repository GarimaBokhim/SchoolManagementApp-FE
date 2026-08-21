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
import { useAddWaterIncome, useGetWaterIncomeSources } from "../../hooks/useFinance";
import { AddWaterIncomePayload } from "../../types/finance.types";

export default function AddIncomePage() {
    const router = useRouter();
    const { handleError, clearError } = useErrorHandler();
    const addIncome = useAddWaterIncome();
    const { data: incomeSources } = useGetWaterIncomeSources();
    const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
    const [selectedMethod, setSelectedMethod] = useState<number | null>(null);

    const form = useForm<AddWaterIncomePayload>({
        defaultValues: { incomeDate: "", waterincomeSourceId: "", amount: 0, paymentMethods: 0, description: "" },
    });

    const onSubmit = async (data: AddWaterIncomePayload) => {
        clearError();
        try {
            await addIncome.mutateAsync(data);
            router.push("/elitekhaneypani/finance/income");
        } catch (error) {
            Toast.error(handleError(error));
        }
    };

    return (
        <div className="p-4 pb-24 space-y-4">
            <MobilePageHeader title="Add Income" />

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <AppCombobox
                    label="Income Source"
                    name="waterincomeSourceId"
                    form={form}
                    required
                    value={selectedSourceId}
                    options={incomeSources || []}
                    selected={incomeSources?.find((s) => s.id === selectedSourceId) || undefined}
                    onSelect={(source) => {
                        const id = source?.id ?? "";
                        setSelectedSourceId(id || null);
                        form.setValue("waterincomeSourceId", id, { shouldValidate: true });
                    }}
                    getLabel={(s) => s?.name ?? ""}
                    getValue={(s) => s?.id ?? ""}
                />

                <InputElement label="Income Date" form={form} name="incomeDate" inputType="date" required />
                <InputElement label="Amount" form={form} name="amount" inputType="number" required />

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

                <InputElement label="Description" form={form} name="description" placeholder="Optional notes" />

                <ButtonElement type="submit" text="Save Income" isLoading={addIncome.isPending} className="w-full py-3 rounded-xl" />
            </form>
        </div>
    );
}
