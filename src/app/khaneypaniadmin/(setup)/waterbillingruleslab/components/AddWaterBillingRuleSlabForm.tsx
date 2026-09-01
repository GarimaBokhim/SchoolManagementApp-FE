'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { AddWaterBillingRuleSlabPayload, WaterBillingRuleSlabResponse } from '../types/IWaterBillingRuleSlab'
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { useAddWaterBillingRuleSlab, useUpdateWaterBillingRuleSlab } from "../hooks";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { AppCombobox } from "@/components/Input/ComboBox";
import { useGetAllWaterBillingRule } from '@/app/khaneypaniadmin/(setup)/waterbillingrule/hooks';

type Props = {
    form: UseFormReturn<AddWaterBillingRuleSlabPayload>;
    onClose: () => void;
    waterBillingRuleSlab?: WaterBillingRuleSlabResponse | null;
};
const AddWaterBillingRuleSlabForm = ({ form, onClose, waterBillingRuleSlab }: Props) => {
    const addWaterBillingRuleSlab = useAddWaterBillingRuleSlab();
    const updateWaterBillingRuleSlab = useUpdateWaterBillingRuleSlab();
    const { handleError, clearError } = useErrorHandler();
    const { data: billingRules } = useGetAllWaterBillingRule();

    const [selectedBillingRuleId, setSelectedBillingRuleId] = useState<string | null>(
        waterBillingRuleSlab?.billingRuleId ?? form.getValues('billingRuleId') ?? null
    );


    const handleClose = () => {
        form.reset({
            billingRuleId: "",
            fromUnit: 0,
            toUnit: 0,
            ratePerUnit: 0

        });
        onClose?.();
    };




    const onSubmit: SubmitHandler<AddWaterBillingRuleSlabPayload> = async (data) => {
        clearError();

        try {
            const payload = {
                billingRuleId: data.billingRuleId,
                fromUnit: data.fromUnit,
                toUnit: data.toUnit,
                ratePerUnit: data.ratePerUnit
            };

            if (waterBillingRuleSlab) {
                await updateWaterBillingRuleSlab.mutateAsync({
                    id: waterBillingRuleSlab.id,
                    payload: { id: waterBillingRuleSlab.id, ...payload },
                });
            } else {
                await addWaterBillingRuleSlab.mutateAsync(payload);
            }

            handleClose();
            onClose();
        } catch (error) {
            Toast.error(handleError(error));
        }
    };
    return (
        <div className=" inset-0 flex items-center justify-center  w-full h-full">
            <div className="w-full  h-[100%] bg-[#ffffff] dark:bg-[#27272a] p-4 overflow-auto relative dark:text-white ">
                <fieldset className="">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
                            {waterBillingRuleSlab ? "Edit WaterBillingRuleSlab" : "Add WaterBillingRuleSlab"}
                        </h1>
                        <button
                            type="button"
                            onClick={() => {
                                handleClose();
                                onClose();
                            }}
                            className="text-red-400 text-2xl hover:text-red-500"
                        >
                            <X strokeWidth={3} />
                        </button>
                    </div>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                            <AppCombobox
                                value={selectedBillingRuleId}
                                dropDownWidth="w-full"
                                dropdownPositionClass="absolute z-20"
                                label="Water Billing Rule"
                                name="billingRuleId"
                                form={form}
                                required
                                options={billingRules?.Items ?? []}
                                selected={
                                    billingRules?.Items?.find((g) => g.id === selectedBillingRuleId) || null
                                }
                                onSelect={(group) => {
                                    const id = group?.id ?? ''

                                    setSelectedBillingRuleId(id || null)

                                    form.setValue('billingRuleId', id, {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                    })
                                }}
                                getLabel={(g) => {
                                    const planName = g?.waterTarifPlanName || 'Water Tariff Plan';
                                    const from = g?.effectiveFrom || '';
                                    const to = g?.effectiveTo || '';

                                    if (from && to) return `${planName} (${from} - ${to})`;
                                    if (planName) return planName;
                                    return 'Select billing rule';
                                }}
                                getValue={(g) => g?.id ?? ''}
                            />

                            <InputElement
                                label="FromUnit"
                                form={form}
                                name="fromUnit"
                                inputType="number"
                                placeholder="Enter From Unit"
                            />

                            <InputElement
                                label="ToUnit"
                                form={form}
                                name="toUnit"
                                inputType="number"
                                placeholder="Enter ToUnit"
                            />

                            <InputElement
                                label="Rate Per Unit"
                                form={form}
                                name="ratePerUnit"
                                inputType="number"
                                placeholder="Enter Rate Per Unit"
                            />




                        </div>

                        <div className="flex justify-center mt-6">
                            <ButtonElement
                                type="submit"
                                text={waterBillingRuleSlab ? "Update" : "Submit"}
                            />
                        </div>
                    </form>
                </fieldset>
            </div>
        </div >
    );
};

export default AddWaterBillingRuleSlabForm;
