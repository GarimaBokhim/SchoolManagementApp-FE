"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { UpdateCounselorPayload } from "../types/ICounselor";
import EditCounselorForm from "../components/EditCounselorForm";
import { useCounselorById } from "../hooks";

interface Props {
    visible: boolean;
    onClose: () => void;
    CounselorId: string;
}

const EditCounselor = ({ visible, onClose, CounselorId }: Props) => {
    const { data: CounselorData } = useCounselorById(CounselorId);

    const form = useForm<UpdateCounselorPayload>({
        defaultValues: {
            id: "",
            fullName: "",
            email: "",
            contactNumber: ""
        },
    });

    const { reset } = form;

    useEffect(() => {
        if (!CounselorData) return;

        reset({
            id: CounselorData.id ?? "",
            fullName: CounselorData.fullName ?? "",
            email: CounselorData.email ?? "",
            contactNumber: CounselorData.contactNumber ?? "",


        });
    }, [CounselorData, reset]);

    if (!visible) return null;

    return (
        <EditAppointmentForm
            form={form}
            onClose={onClose}
            AppointmentId={AppointmentId}
        />
    );
};

export default EditCounselor;