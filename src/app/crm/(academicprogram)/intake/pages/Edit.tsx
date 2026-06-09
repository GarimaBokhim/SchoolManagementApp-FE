"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { UpdateIntakePayload } from "../types/IIntake";
import EditIntakeForm from "../components/EditIntakeForm";
import { useIntakeById } from "../hooks";

interface Props {
    visible: boolean;
    onClose: () => void;
    IntakeId: string;
}

const EditIntake = ({ visible, onClose, IntakeId }: Props) => {
    const { data: IntakeData } = useIntakeById(IntakeId);

    const form = useForm<UpdateIntakePayload>({
        defaultValues: {
            id: "",
            month: 0,
            deadline: "",
            isOpen: true,
            countryId: "",
            universityId: "",
            courseId: ""
        },
    });

    const { reset } = form;

    useEffect(() => {
        if (!IntakeData) return;

        reset({
            id: IntakeData.id ?? "",
            month: IntakeData.month ?? 0,
            deadline: IntakeData.deadline ?? "",
            isOpen: IntakeData.isOpen ?? true,
            countryId: IntakeData.country ?? "",
            universityId: IntakeData.universityId ?? "",
            courseId: IntakeData.courseId ?? ""

        });
    }, [IntakeData, reset]);

    if (!visible) return null;

    return (
        <EditIntakeForm
            form={form}
            onClose={onClose}
            IntakeId={IntakeId}
        />
    );
};

export default EditIntake;