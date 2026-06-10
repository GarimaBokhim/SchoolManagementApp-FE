'use client'
import { useState } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import { AddFollowUpPayload } from '../types/IAppointment'
import { SubmitHandler, useFieldArray, UseFormReturn } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { useAddFollowUp } from "../hooks";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { AppCombobox } from "@/components/Input/ComboBox";

type Props = {
    form: UseFormReturn<AddFollowUpPayload>;
    onClose: () => void;
    AppointmentId: string
    UserId: string
};
const AddFollowUpForm = ({ form, onClose, AppointmentId, UserId }: Props) => {
    const addFollowUp = useAddFollowUp();
    const { handleError, clearError } = useErrorHandler();


    const [followUpStatus, setFollowUpStatus] = useState<number | null>(null);

    const handleClose = () => {
        form.reset({
            userId: "",
            startTime: "",
            endTime: "",
            followUpDate: "",
            notes: "",
            followUpStatus: 0,
            appointmentId: ""
        });
        onClose()
    };


    const onSubmit: SubmitHandler<AddFollowUpPayload> = async () => {
        clearError();
        const values = form.getValues();

        const payload = {
            userId: UserId,
            startTime: values.startTime,
            endTime: values.endTime,
            followUpDate: values.followUpDate,
            notes: values.notes,
            followUpStatus: values.followUpStatus,
            appointmentId: AppointmentId

        };

        await addFollowUp.mutateAsync(payload);
        handleClose();
        onClose();
    };
    return (
        <div className=" inset-0 flex items-center justify-center  w-full h-full">
            <div className="w-full  h-[100%] bg-[#ffffff] dark:bg-[#27272a] p-4 overflow-auto relative dark:text-white ">
                <fieldset className="">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
                            Add FollowUp
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
                                label="StartTime"
                                form={form}
                                name="startTime"
                                inputType="time"
                                required
                            />

                            <InputElement
                                label="EndTime"
                                form={form}
                                name="endTime"
                                inputType="time"
                                required
                            />

                            <InputElement
                                label="FollowUpDate"
                                form={form}
                                name="followUpDate"
                                inputType="date"
                                required
                            />


                        </div>


                        <InputElement
                            label="Notes"
                            form={form}
                            name="notes"
                            required
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





                        <div className="flex justify-center mt-6">
                            <ButtonElement type="submit" text={"Submit"} />
                        </div>
                    </form>
                </fieldset>
            </div>
        </div>
    );
};

export default AddFollowUpForm;
