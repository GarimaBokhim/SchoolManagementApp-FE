'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { AddWaterBillingRulePayload, WaterBillingRuleResponse } from '../types/IWaterBillingRule'
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { useAddWaterBillingRule, useGetAllWaterTariffPlan, useUpdateWaterBillingRule } from "../hooks";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { AppCombobox } from "@/components/Input/ComboBox";

type Props = {
    form: UseFormReturn<AddWaterBillingRulePayload>;
    onClose: () => void;
    waterBillingRule?: WaterBillingRuleResponse | null;
};
const AddWaterBillingRuleForm = ({ form, onClose, waterBillingRule }: Props) => {
    const addWaterBillingRule = useAddWaterBillingRule();
    const updateWaterBillingRule = useUpdateWaterBillingRule();
    const { handleError, clearError } = useErrorHandler();
    const { data: allWaterTariffPlan } = useGetAllWaterTariffPlan();

    const [selectedWaterTariffPlanId, setSelectedWaterTariffPlanId] = useState<string | null>(
        waterBillingRule?.waterTarifPlanId ?? form.getValues('waterTarifPlanId') ?? null
    );


    const handleClose = () => {
        form.reset({
            waterTarifPlanId: "",
            effectiveFrom: "",
            effectiveTo: ""

        });
        onClose?.();
    };




    const onSubmit: SubmitHandler<AddWaterBillingRulePayload> = async (data) => {
        clearError();

        try {
            const payload = {
                waterTarifPlanId: data.waterTarifPlanId,
                effectiveFrom: data.effectiveFrom,
                effectiveTo: data.effectiveTo
            };

            if (waterBillingRule) {
                await updateWaterBillingRule.mutateAsync({
                    id: waterBillingRule.id,
                    payload: { id: waterBillingRule.id, ...payload },
                });
            } else {
                await addWaterBillingRule.mutateAsync(payload);
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
                            {waterBillingRule ? "Edit WaterBillingRule" : "Add WaterBillingRule"}
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
                                value={selectedWaterTariffPlanId}
                                dropDownWidth="w-full"
                                dropdownPositionClass="absolute z-20"
                                label="Water Tariff Plan"
                                name="waterTarifPlanId"
                                form={form}
                                required
                                options={allWaterTariffPlan || []}
                                selected={
                                    allWaterTariffPlan?.find((g) => g.id === selectedWaterTariffPlanId) || null
                                }
                                onSelect={(group) => {
                                    const id = group?.id ?? ''

                                    setSelectedWaterTariffPlanId(id || null)

                                    form.setValue('waterTarifPlanId', id, {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                    })
                                }}
                                getLabel={(g) => g?.name ?? ''}
                                getValue={(g) => g?.id ?? ''}
                            />

                            <InputElement
                                label="EffectiveFrom"
                                form={form}
                                name="effectiveFrom"
                                inputType="date"
                                placeholder="Enter Date"
                            />

                            <InputElement
                                label="EffectiveTo"
                                form={form}
                                name="effectiveTo"
                                inputType="date"
                                placeholder="Enter Date"
                            />




                        </div>

                        <div className="flex justify-center mt-6">
                            <ButtonElement
                                type="submit"
                                text={waterBillingRule ? "Update" : "Submit"}
                            />
                        </div>
                    </form>
                </fieldset>
            </div>
        </div >
    );
};

export default AddWaterBillingRuleForm;
