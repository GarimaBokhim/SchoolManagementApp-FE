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
import { useAddWaterExpense, useGetExpenseCategories } from "../../hooks/useFinance";
import { AddWaterExpensePayload } from "../../types/finance.types";

export default function AddExpensePage() {
    const router = useRouter();
    const { handleError, clearError } = useErrorHandler();
    const addExpense = useAddWaterExpense();
    const { data: expenseCategories } = useGetExpenseCategories();
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [selectedMethod, setSelectedMethod] = useState<number | null>(null);

    const form = useForm<AddWaterExpensePayload>({
        defaultValues: { expenseDate: "", expenseCategoryId: "", amount: 0, paymentMethod: 0, venderName: "", description: "" },
    });

    const onSubmit = async (data: AddWaterExpensePayload) => {
        clearError();
        try {
            await addExpense.mutateAsync(data);
            router.push("/elitekhaneypani/finance/expenses");
        } catch (error) {
            Toast.error(handleError(error));
        }
    };

    return (
        <div className="p-4 pb-24 space-y-4">
            <MobilePageHeader title="Add Expense" />

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <AppCombobox
                    label="Expense Category"
                    name="expenseCategoryId"
                    form={form}
                    required
                    value={selectedCategoryId}
                    options={expenseCategories || []}
                    selected={expenseCategories?.find((c) => c.id === selectedCategoryId) || undefined}
                    onSelect={(category) => {
                        const id = category?.id ?? "";
                        setSelectedCategoryId(id || null);
                        form.setValue("expenseCategoryId", id, { shouldValidate: true });
                    }}
                    getLabel={(c) => c?.name ?? ""}
                    getValue={(c) => c?.id ?? ""}
                />

                <InputElement label="Expense Date" form={form} name="expenseDate" inputType="date" required />
                <InputElement label="Amount" form={form} name="amount" inputType="number" required />
                <InputElement label="Vendor Name" form={form} name="venderName" placeholder="Enter vendor name" />

                <AppCombobox
                    label="Payment Method"
                    name="paymentMethod"
                    form={form}
                    required
                    value={selectedMethod}
                    options={paymentMethodOptions}
                    selected={paymentMethodOptions.find((m) => m.id === selectedMethod) || undefined}
                    onSelect={(method) => {
                        const id = method?.id ?? 0;
                        setSelectedMethod(id || null);
                        form.setValue("paymentMethod", id, { shouldValidate: true });
                    }}
                    getLabel={(m) => m?.name ?? ""}
                    getValue={(m) => m?.id ?? 0}
                />

                <InputElement label="Description" form={form} name="description" placeholder="Optional notes" />

                <ButtonElement type="submit" text="Save Expense" isLoading={addExpense.isPending} className="w-full py-3 rounded-xl" />
            </form>
        </div>
    );
}
