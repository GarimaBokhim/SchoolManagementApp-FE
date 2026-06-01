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

import { UpdateInstallmentPlanPayload, } from "../types/IInstallments";

import { useUpdateInstallmentPlan, } from "../hooks";


type Props = {
    form: UseFormReturn<UpdateInstallmentPlanPayload>;
    onClose: () => void;
    InstallmentPlanId: string;
};

const EditInstallmentPlanForm = ({ form, onClose, InstallmentPlanId }: Props) => {
    const editInstallmentPlan = useUpdateInstallmentPlan();

    const { handleError, clearError } = useErrorHandler();

    const handleClose = () => {
        onClose();
    };


    const onSubmit: SubmitHandler<UpdateInstallmentPlanPayload> = async (data) => {
        clearError();

        console.log("New Testing", data)

        if (!InstallmentPlanId) {
            Toast.error("Invalid Installment Plan ID");
            return;
        }

        try {
            const promise = editInstallmentPlan.mutateAsync({
                id: InstallmentPlanId,
                payload: data,
            });

            await toast.promise(promise, {
                loading: "Updating...",
                success: (res: any) => res?.message,
                error: (err: any) => err?.response?.data?.message,
            });

            form.reset(); // optional but recommended
            handleClose();

        } catch (error) {
            Toast.error(handleError(error));
        }
    };


    return (
        <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-black/40 backdrop-blur-sm ml-12 md:ml-64 sm:ml-16 xs:ml-0">
            <div className="bg-[#FBFBFB] dark:bg-[#27272a] w-full max-w-[95vw] md:max-w-[85vw] lg:max-w-[75vw] xl:max-w-[70vw] max-h-[95vh] md:max-h-[92vh] h-full rounded-lg overflow-auto p-6 md:p-8 shadow-lg">

                <fieldset>
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
                            Update InstallmentPlan
                        </h1>

                        <button type="button" onClick={handleClose}>
                            <X strokeWidth={3} />
                        </button>
                    </div>

                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                            <InputElement
                                label="Number Of installments"
                                form={form}
                                name="numberOfInstallments"
                                placeholder="Enter numberOfInstallments"
                                required
                            />


                        </div>

                        <div className="flex justify-center mt-6">
                            <ButtonElement
                                type="submit"
                                text="Update InstallmentPlan"
                            />
                        </div>
                    </form>
                </fieldset>
            </div>
        </div>
    );
};

export default EditInstallmentPlanForm;