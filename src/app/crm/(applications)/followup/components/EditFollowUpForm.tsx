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

import { UpdateFollowUpPayload } from "../types/IFollowUp";
import { useUpdateFollowUp, useGetAllUserProfile, useGetAllAppointments } from "../hooks";
import { AppCombobox } from "@/components/Input/ComboBox";
import { useState } from "react";



type Props = {
    form: UseFormReturn<UpdateFollowUpPayload>
    onClose: () => void;
    FollowUpId: string;
};

const EditFollowUpForm = ({ form, onClose, FollowUpId, }: Props) => {
    const editFollowUp = useUpdateFollowUp();
    const { handleError, clearError } = useErrorHandler();

    const [followUpStatus, setFollowUpStatus] = useState<number | null>(null);

    const { data: userprofile } = useGetAllUserProfile();
    const { data: appointment } = useGetAllAppointments();
    const { handleSubmit } = form;


    const handleClose = () => {
        onClose();
    };


    const onSubmit: SubmitHandler<UpdateFollowUpPayload> =
        async (data) => {
            clearError();
            try {
                const promise = editFollowUp.mutateAsync({
                    id: FollowUpId,
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


    const userId = form.watch("userId");
    const appointmentId = form.watch("appointmentId");
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm ml-[16%]">
            <div className="bg-white dark:bg-[#27272a] w-full max-w-5xl p-5 rounded-lg overflow-auto max-h-[90vh]">

                {/* HEADER */}
                <div className="flex justify-between mb-6">
                    <h1 className="text-xl font-semibold">Update FollowUp</h1>
                    <button onClick={handleClose}>
                        <X />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>

                    {/* BASIC INFO */}
                    <div className="grid grid-cols-3 gap-4">


                        <AppCombobox
                            value={userId}
                            dropDownWidth="w-full"
                            dropdownPositionClass="absolute z-20"
                            label="Applicant"
                            name="applicantId"
                            form={form}
                            required
                            options={userprofile || []}
                            selected={
                                userprofile?.find(
                                    (g) => g.id === userId
                                ) || null
                            }
                            onSelect={(group) => {
                                const id = group?.id ?? "";

                                form.setValue("userId", id, {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                });
                            }}
                            getLabel={(g) => g?.fullName ?? ""}
                            getValue={(g) => g?.id ?? ""}
                        />

                        <InputElement
                            label="StartTime"
                            form={form}
                            name="startTime"
                            inputType="time"
                        />

                        <InputElement
                            label="EndTime"
                            form={form}
                            name="endTime"
                            inputType="time"
                        />

                        <InputElement
                            label="FollowUpDate"
                            form={form}
                            name="followUpDate"
                            inputType="date"
                        />


                        <AppCombobox
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
                        />
                    </div>


                    <InputElement
                        label="Notes"
                        form={form}
                        name="notes"
                    />


                    <AppCombobox
                        label="Status"
                        dropdownPositionClass="absolute"
                        name="followUpStatus"
                        form={form}
                        value={followUpStatus}
                        options={[
                            { id: 1, name: 'Scheduled' },
                            { id: 2, name: 'Completed' },
                            { id: 3, name: 'Missed' }
                        ]}
                        dropDownWidth="w-full"
                        selected={
                            [
                                { id: 1, name: 'Scheduled' },
                                { id: 2, name: 'Completed' },
                                { id: 3, name: 'Missed' }
                            ].find((g) => g.id === followUpStatus) || null
                        }
                        onSelect={(option) => {
                            setFollowUpStatus(option?.id ?? null);
                            form.setValue('followUpStatus', option?.id ?? 0);
                        }}
                        getLabel={(o) => o?.name || ''}
                        getValue={(o) => o?.id ?? ''}
                    />


                    {/* SUBMIT */}
                    <div className="flex justify-center mt-6">
                        <ButtonElement type="submit" text="Update Invoice" />
                    </div>

                </form>
            </div>
        </div>
    );
};

export default EditFollowUpForm;