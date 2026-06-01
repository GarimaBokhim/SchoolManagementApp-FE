"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { UpdateRequirementsPayload } from "../types/IRequirements";
import EditRequirementsForm from "../components/EditRequirementsForm";
import { useRequirementsById } from "../hooks";

interface Props {
    visible: boolean;
    onClose: () => void;
    RequirementsId: string;
}

const EditRequirements = ({ visible, onClose, RequirementsId }: Props) => {
    const { data: RequirementsData } = useRequirementsById(RequirementsId);

    const form = useForm<UpdateRequirementsPayload>({
        defaultValues: {
            id: "",
            descriptions: "",
            countryId: "",
            courseId: "",
            updatedocumentsCheckListDTOs: [
                {
                    id: "",
                    documenteTypeId: ""
                },
            ],
        },
    });

    const { reset } = form;

    useEffect(() => {
        if (!RequirementsData) return;

        reset({
            id: RequirementsData.id ?? "",
            descriptions: RequirementsData.descriptions ?? "",
            countryId: RequirementsData.countryId ?? "",
            courseId: RequirementsData.courseId ?? "",

            updatedocumentsCheckListDTOs:
                RequirementsData.DocumentsCheckListDTOs?.map((item: any) => ({
                    id: item.id ?? "",
                    documenteTypeId: item.documenteTypeId ?? "",
                    isRequired: item.isRequired ?? 0
                })) ?? [],
        });
    }, [RequirementsData, reset, form]);

    if (!visible) return null;

    return (
        <EditRequirementsForm
            form={form}
            onClose={onClose}
            RequirementsId={RequirementsId}
        />
    );
};

export default EditRequirements;