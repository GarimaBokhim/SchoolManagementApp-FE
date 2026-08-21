'use client'

import { useState } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import { AddWaterBillingSetUpPayload, WaterBillingSetUpResponse } from '../types/IWaterBillingSetup'
import { Controller, SubmitHandler, UseFormReturn, useFieldArray } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { useAddWaterBillingSetUp, useUpdateWaterBillingSetUp } from "../hooks";
import toast from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { AppCombobox } from "@/components/Input/ComboBox";
import TextEditor from '@/components/Input/TextEditor';
import { useGetAllRoles } from "@/app/SuperAdmin/accessControl/roles/hooks";

type Props = {
    form: UseFormReturn<AddWaterBillingSetUpPayload>;
    onClose: () => void;
    waterBillingSetUp?: WaterBillingSetUpResponse | null;
};
const AddWaterBillingSetUpForm = ({ form, onClose, waterBillingSetUp }: Props) => {
    const addWaterBillingSetUp = useAddWaterBillingSetUp();
    const updateWaterBillingSetUp = useUpdateWaterBillingSetUp();
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
            name: "",
            description: "",
            isDefault: true
        });
        onClose?.();
    };




    const onSubmit: SubmitHandler<AddWaterBillingSetUpPayload> = async (data) => {
        clearError();

        try {
            const payload = {
                name: data.name,
                description: data.description,
                isDefault: data.isDefault
            };

            if (waterBillingSetUp) {
                await updateWaterBillingSetUp.mutateAsync({
                    id: waterBillingSetUp.id,
                    payload: { id: waterBillingSetUp.id, ...payload },
                });
            } else {
                await addWaterBillingSetUp.mutateAsync(payload);
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
                            {waterBillingSetUp ? "Edit WaterBillingSetUp" : "Add WaterBillingSetUp"}
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
                            <InputElement
                                label="Name"
                                form={form}
                                name="name"
                                placeholder="Enter Name"
                            />

                            <InputElement
                                label="Description"
                                form={form}
                                name="description"

                                placeholder="Enter Description"
                            />

                            <Controller
                                control={form.control}
                                name="isDefault"
                                render={({ field }) => (
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium text-gray-700">
                                            Default
                                        </label>

                                        <button
                                            type="button"
                                            onClick={() => field.onChange(!field.value)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${field.value ? "bg-blue-600" : "bg-gray-300"
                                                }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${field.value ? "translate-x-6" : "translate-x-1"
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                )}
                            />

                        </div>

                        <div className="flex justify-center mt-6">
                            <ButtonElement
                                type="submit"
                                text={waterBillingSetUp ? "Update" : "Submit"}
                            />
                        </div>
                    </form>
                </fieldset>
            </div>
        </div >
    );
};

export default AddWaterBillingSetUpForm;
