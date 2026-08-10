'use client'

import { useState } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import { AddWaterBillingRulePayload } from '../types/IWaterBillingRule'
import { Controller, SubmitHandler, UseFormReturn, useFieldArray } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { useAddWaterBillingRule } from "../hooks";
import toast from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { AppCombobox } from "@/components/Input/ComboBox";
import TextEditor from '@/components/Input/TextEditor';
import { useGetAllRoles } from "@/app/SuperAdmin/accessControl/roles/hooks";

type Props = {
    form: UseFormReturn<AddWaterBillingRulePayload>;
    onClose: () => void;
};
const AddWaterBillingRuleForm = ({ form, onClose }: Props) => {
    const addWaterBillingRule = useAddWaterBillingRule();
    const { handleError, clearError } = useErrorHandler();

    const { data: rolesResponse } = useGetAllRoles();

    const roles = (rolesResponse?.Items ?? []).map(role => ({
        id: role.Id,
        name: role.Name,
    }));


    const [selectedRoleId, setSelectedRoleId] = useState<string>("");
    const [genderStatus, setGenderStatus] = useState<number | null>(null);


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
            await addWaterBillingRule.mutateAsync({
                waterTarifPlanId: data.waterTarifPlanId,
                effectiveFrom: data.effectiveFrom,
                effectiveTo: data.effectiveTo

            });

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
                            Add WaterBillingRule
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
                            {/* <AppCombobox
                                value={selectedRoleId}
                                dropDownWidth="w-full"
                                dropdownPositionClass="absolute z-20"
                                label="Role"
                                name=""
                                form={form}
                                required
                                options={roles}
                                selected={
                                    roles.find((role) => role.id === selectedRoleId) ?? null
                                }
                                onSelect={(role) => {
                                    const roleId = role?.id ?? "";

                                    console.log("SELECTED ROLE:", roleId);

                                    setSelectedRoleId(roleId);

                                    form.setValue(
                                        "rolesId",
                                        roleId ? [roleId] : [],
                                        {
                                            shouldDirty: true,
                                            shouldTouch: true,
                                            shouldValidate: true,
                                        }
                                    );
                                }}
                                getLabel={(role) => role?.name ?? ""}
                                getValue={(role) => role?.id ?? ""}
                            /> */}

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
                            <ButtonElement type="submit" text={"Submit"} />
                        </div>
                    </form>
                </fieldset>
            </div>
        </div >
    );
};

export default AddWaterBillingRuleForm;
