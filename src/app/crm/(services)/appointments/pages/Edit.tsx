"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { UpdateAppointmentPayload } from "../types/IAppointment";
import EditAppointmentForm from "../components/EditAppointmentForm";
import { useAppointentById } from "../hooks";

interface Props {
    visible: boolean;
    onClose: () => void;
    AppointmentId: string;
}

const EditAppointment = ({ visible, onClose, AppointmentId }: Props) => {
    const { data: AppointmentDate } = useAppointentById(AppointmentId);

    const form = useForm<UpdateAppointmentPayload>({
        defaultValues: {
            id: "",
            leadId: "",
            appointmentDate: "",
            counselorId: "",
            notes: "",
            appointmentStatus: 0
        },
    });

    const { reset } = form;

    useEffect(() => {
        if (!AppointmentDate) return;

        reset({
            id: AppointmentDate.id ?? "",
            leadId: AppointmentDate.leadId ?? "",
            appointmentDate: AppointmentDate.appointmentDate ?? "",
            counselorId: AppointmentDate.counselorId ?? "",
            notes: AppointmentDate.notes ?? "",
            appointmentStatus: AppointmentDate.appointmentStatus ?? 0,

        });
    }, [AppointmentDate, reset]);

    if (!visible) return null;

    return (
        <EditAppointmentForm
            form={form}
            onClose={onClose}
            AppointmentId={AppointmentId}
        />
    );
};

export default EditAppointment;