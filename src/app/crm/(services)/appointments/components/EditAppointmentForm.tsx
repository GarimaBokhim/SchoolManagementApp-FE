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

import { UpdateAppointmentPayload } from "../types/IAppointment";
import { useUpdateAppointment, useGetAllLead, useGetAllCouncellor } from "../hooks";
import { AppCombobox } from "@/components/Input/ComboBox";



type Props = {
    form: UseFormReturn<UpdateAppointmentPayload>
    onClose: () => void;
    AppointmentId: string;
};

const EditAppointmentForm = ({ form, onClose, AppointmentId, }: Props) => {
    const editAppointment = useUpdateAppointment();
    const { handleError, clearError } = useErrorHandler();

    const { data: lead } = useGetAllLead();
    const { data: councellor } = useGetAllCouncellor();
    const { handleSubmit } = form;


    const handleClose = () => {
        onClose();
    };




    const onSubmit: SubmitHandler<UpdateAppointmentPayload> =
        async (data) => {
            clearError();
            try {
                const promise = editAppointment.mutateAsync({
                    id: AppointmentId,
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


    const leadId = form.watch("leadId");
    const counselorId = form.watch("counselorId");
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm ml-[16%]">
            <div className="bg-white dark:bg-[#27272a] w-full max-w-5xl p-5 rounded-lg overflow-auto max-h-[90vh]">

                {/* HEADER */}
                <div className="flex justify-between mb-6">
                    <h1 className="text-xl font-semibold">Update Appointment</h1>
                    <button onClick={handleClose}>
                        <X />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>

                    {/* BASIC INFO */}
                    <div className="grid grid-cols-3 gap-4">


                        <AppCombobox
                            value={leadId}
                            dropDownWidth="w-full"
                            dropdownPositionClass="absolute z-20"
                            label="Applicant"
                            name="applicantId"
                            form={form}
                            required
                            options={lead || []}
                            selected={
                                lead?.find(
                                    (g) => g.id === leadId
                                ) || null
                            }
                            onSelect={(group) => {
                                const id = group?.id ?? "";

                                form.setValue("leadId", id, {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                });
                            }}
                            getLabel={(g) => g?.fullName ?? ""}
                            getValue={(g) => g?.id ?? ""}
                        />

                        <InputElement
                            label="AppointmentDate"
                            form={form}
                            name="appointmentDate"
                            inputType="date"
                        />


                        <AppCombobox
                            value={counselorId}
                            dropDownWidth="w-full"
                            dropdownPositionClass="absolute z-20"
                            label="Counselor"
                            name="counselorId"
                            form={form}
                            required
                            options={councellor || []}
                            selected={
                                councellor?.find(
                                    (g) => g.id === counselorId
                                ) || null
                            }
                            onSelect={(group) => {
                                const id = group?.id ?? "";

                                form.setValue("counselorId", id, {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                });
                            }}
                            getLabel={(g) => g?.fullName ?? ""}
                            getValue={(g) => g?.id ?? ""}
                        />
                    </div>


                    <InputElement
                        label="Notes"
                        form={form}
                        name="notes"
                    />


                    <InputElement
                        label="AppointmentStatus"
                        form={form}
                        name="notes"
                    />

                    {/* SUBMIT */}
                    <div className="flex justify-center mt-6">
                        <ButtonElement type="submit" text="Update Appointment" />
                    </div>

                </form>
            </div>
        </div>
    );
};

export default EditAppointmentForm;