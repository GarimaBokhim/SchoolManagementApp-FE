"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { UpdateFollowUpPayload } from "../types/IFollowUp";
import EditFollowUpForm from "../components/EditFollowUpForm";
import { useFollowUpById } from "../hooks";

interface Props {
    visible: boolean;
    onClose: () => void;
    FollowUpId: string;
}

const EditFollowUp = ({ visible, onClose, FollowUpId }: Props) => {
    const { data: FollowUpDate } = useFollowUpById(FollowUpId);

    const form = useForm<UpdateFollowUpPayload>({
        defaultValues: {
            id: "",
            userId: "",
            startTime: "",
            endTime: "",
            followUpDate: "",
            notes: "",
            followUpStatus: 0,
            appointmentId: ""
        },
    });

    const { reset } = form;

    useEffect(() => {
        if (!FollowUpDate) return;

        reset({
            id: FollowUpDate.id ?? "",
            userId: FollowUpDate.userId ?? "",
            startTime: FollowUpDate.startTime ?? "",
            endTime: FollowUpDate.endTime ?? "",
            followUpDate: FollowUpDate.followUpDate ?? "",
            notes: FollowUpDate.notes ?? "",
            followUpStatus: FollowUpDate.followUpStatus ?? 0,
            appointmentId: FollowUpDate.appointmentId ?? ""

        });
    }, [FollowUpDate, reset]);

    if (!visible) return null;

    return (
        <EditFollowUpForm
            form={form}
            onClose={onClose}
            FollowUpId={FollowUpId}
        />
    );
};

export default EditFollowUp;