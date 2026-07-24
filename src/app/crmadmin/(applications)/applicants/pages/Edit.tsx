"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { UpdateApplicantPayload } from "../types/IApplicants";
import EditApplicantsForm from "../components/EditApplicantsForm";
import { useApplicantsById } from "../hooks";

interface Props {
    visible: boolean;
    onClose: () => void;
    ApplicantsId: string;
}

const EditApplicants = ({ visible, onClose, ApplicantsId }: Props) => {
    const { data: ApplicantsData } = useApplicantsById(ApplicantsId);

    const form = useForm<UpdateApplicantPayload>({
        defaultValues: {
            id: "",
            userId: "",
            passportNo: "",
            countryId: "",
            universityId: "",
            courseId: ""
        },
    });

    const { reset } = form;

    useEffect(() => {
        if (!ApplicantsData) return;

        reset({
            id: ApplicantsData.id ?? "",
            userId: ApplicantsData.userId ?? "",
            passportNo: ApplicantsData.passportNo ?? "",
            countryId: ApplicantsData.countryId ?? "",
            universityId: ApplicantsData.universityId ?? "",
            courseId: ApplicantsData.courseId ?? "",

        });
    }, [ApplicantsData, reset]);

    if (!visible) return null;

    return (
        <EditApplicantsForm
            form={form}
            onClose={onClose}
            ApplicantsId={ApplicantsId}
        />
    );
};

export default EditApplicants;