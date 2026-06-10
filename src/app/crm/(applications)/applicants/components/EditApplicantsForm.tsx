"use client";
import {
    SubmitHandler,
    useFieldArray,
    UseFormReturn,
} from "react-hook-form";

import { Plus, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";

import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";

import useErrorHandler from "@/components/helpers/ErrorHandling";

import { UpdateApplicantPayload } from "../types/IApplicants";
import { useUpdateApplicants } from "../hooks";
import { AppCombobox } from "@/components/Input/ComboBox";
import { useState } from "react";



type Props = {
    form: UseFormReturn<UpdateApplicantPayload>
    onClose: () => void;
    ApplicantsId: string;
};

const EditApplicantsForm = ({ form, onClose, ApplicantsId, }: Props) => {
    const editApplicants = useUpdateApplicants();
    const { handleError, clearError } = useErrorHandler();

    const [ApplicantsStatus, setApplicantsStatus] = useState<number | null>(null);

    const { handleSubmit } = form;


    const handleClose = () => {
        onClose();
    };


    const onSubmit: SubmitHandler<UpdateApplicantPayload> =
        async (data) => {
            clearError();
            try {
                const promise = editApplicants.mutateAsync({
                    id: ApplicantsId,
                    payload: data,
                });

                await toast.promise(
                    promise,
                    {
                        loading: "Updating...",
                        success: (res: any) => res?.message,
                        error: (err: any) => err?.response?.data?.message,
                    }
                );

                handleClose();
            } catch (error) {
                const errorMsg = handleError(error);
                Toast.error(errorMsg);
            }
        };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm ml-[16%]">
            <div className="bg-white dark:bg-[#27272a] w-full max-w-5xl p-5 rounded-lg overflow-auto max-h-[90vh]">

                {/* HEADER */}
                <div className="flex justify-between mb-6">
                    <h1 className="text-xl font-semibold">Update Applicants</h1>
                    <button onClick={handleClose}>
                        <X />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>

                    {/* BASIC INFO */}
                    <div className="grid grid-cols-3 gap-4">


                        <InputElement
                            label="PassportNo"
                            form={form}
                            name="passportNo"
                        />

                        <InputElement
                            label="EndTime"
                            form={form}
                            name="endTime"
                            inputType="time"
                        />

                        <InputElement
                            label="ApplicantsDate"
                            form={form}
                            name="ApplicantsDate"
                            inputType="date"
                        />


                        {/* <AppCombobox
                            value={appointmentId}
                            dropDownWidth="w-full"
                            dropdownPositionClass="absolute z-20"
                            label="Counselor"
                            name="counselorId"
                            form={form}
                            required
                            options={appointment || []}
                            selected={
                                appointment?.find(
                                    (g) => g.id === appointmentId
                                ) || null
                            }
                            onSelect={(group) => {
                                const id = group?.id ?? "";

                                form.setValue("appointmentId", id, {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                });
                            }}
                            getLabel={(g) =>
                                `${g?.counselorName ?? ""}${g?.appointmentDate ? ` (${g.appointmentDate})` : ""}`
                            }
                            getValue={(g) => g?.id ?? ""}
                        /> */}
                    </div>


                    {/* SUBMIT */}
                    <div className="flex justify-center mt-6">
                        <ButtonElement type="submit" text="Update Invoice" />
                    </div>

                </form>
            </div>
        </div>
    );
};

export default EditApplicantsForm;