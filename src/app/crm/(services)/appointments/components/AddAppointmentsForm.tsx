'use client'
import { useState } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import { AddAppointmentPayload } from '../types/IAppointment'
import { SubmitHandler, useFieldArray, UseFormReturn } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { useAddAppointment, useGetAllCouncellor, useGetAllLead } from "../hooks";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { AppCombobox } from "@/components/Input/ComboBox";

type Props = {
    form: UseFormReturn<AddAppointmentPayload>;
    onClose: () => void;
};
const AddInvoiceForm = ({ form, onClose }: Props) => {
    const addAppointment = useAddAppointment();
    const { handleError, clearError } = useErrorHandler();
    const { data: lead } = useGetAllLead();
    const { data: counselor } = useGetAllCouncellor();
    const [sellectedLeadId, setSelectedLeadId] = useState<string | null>("");
    const [sellectedCounselorId, setSelectedCounselorId] = useState<string | null>("");


    const [appointmentStatus, setAppointmentStatus] = useState<number | null>(null);

    const handleClose = () => {
        form.reset({
            leadId: "",
            appointmentDate: "",
            counselorId: "",
            notes: "",
            appointmentStatus: 0

        });
        setSelectedLeadId(null)
        setSelectedCounselorId(null)
        onClose()
    };


    const onSubmit: SubmitHandler<AddAppointmentPayload> = async () => {
        clearError();
        const values = form.getValues();

        const payload = {
            leadId: values.leadId,
            appointmentDate: values.appointmentDate,
            counselorId: values.counselorId,
            notes: values.notes,
            appointmentStatus: values.appointmentStatus
        };

        await addAppointment.mutateAsync(payload);
        handleClose();
        onClose();
    };
    return (
        <div className=" inset-0 flex items-center justify-center  w-full h-full">
            <div className="w-full  h-[100%] bg-[#ffffff] dark:bg-[#27272a] p-4 overflow-auto relative dark:text-white ">
                <fieldset className="">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
                            Add Appointments
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
                                value={sellectedLeadId}
                                dropDownWidth="w-full"
                                dropdownPositionClass="absolute z-20"
                                label="Lead"
                                name="leadId"
                                form={form}
                                required
                                options={lead || []}
                                selected={
                                    lead?.find(
                                        (g) => g.id === sellectedLeadId
                                    ) || null
                                }
                                onSelect={(group) => {
                                    if (group) {
                                        const id = group.id ?? "";

                                        setSelectedLeadId(id || null);

                                        form.setValue("leadId", id, {
                                            shouldValidate: true,
                                        });
                                    } else {
                                        setSelectedLeadId(null);

                                        form.setValue("leadId", "", {
                                            shouldValidate: true,
                                        });
                                    }
                                }}
                                getLabel={(g) => g?.fullName ?? ""}
                                getValue={(g) => g?.id ?? ""}
                            />

                            <InputElement
                                label="AppointmentDate"
                                form={form}
                                name="appointmentDate"
                                inputType="date"
                                required
                            />


                            <AppCombobox
                                value={sellectedCounselorId}
                                dropDownWidth="w-full"
                                dropdownPositionClass="absolute z-20"
                                label="Counselor"
                                name="counselorId"
                                form={form}
                                required
                                options={counselor || []}
                                selected={
                                    counselor?.find(
                                        (g) => g.id === sellectedCounselorId
                                    ) || null
                                }
                                onSelect={(group) => {
                                    if (group) {
                                        const id = group.id ?? "";

                                        setSelectedCounselorId(id || null);

                                        form.setValue("counselorId", id, {
                                            shouldValidate: true,
                                        });
                                    } else {
                                        setSelectedCounselorId(null);

                                        form.setValue("counselorId", "", {
                                            shouldValidate: true,
                                        });
                                    }
                                }}
                                getLabel={(g) => g?.fullName ?? ""}
                                getValue={(g) => g?.id ?? ""}
                            />

                        </div>


                        <InputElement
                            label="Notes"
                            form={form}
                            name="notes"
                            required
                        />


                        <AppCombobox
                            label="Appointment Status"
                            dropdownPositionClass="absolute"
                            name="appointmentStatus"
                            form={form}
                            value={appointmentStatus}
                            options={[
                                { id: 1, name: 'Scheduled' },
                                { id: 2, name: 'Completed' },
                                { id: 3, name: 'Cancelled' },
                                { id: 4, name: 'NoShow' }
                            ]}
                            dropDownWidth="w-full"
                            selected={
                                [
                                    { id: 1, name: 'Scheduled' },
                                    { id: 2, name: 'Completed' },
                                    { id: 3, name: 'Cancelled' },
                                    { id: 4, name: 'NoShow' }
                                ].find((g) => g.id === appointmentStatus) || null
                            }
                            onSelect={(option) => {
                                setAppointmentStatus(option?.id ?? null);
                                form.setValue('appointmentStatus', option?.id ?? 0);
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

export default AddInvoiceForm;
