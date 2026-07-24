"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { UpdateUniversityPayload } from "../types/IUniversity";
import EditUniversityForm from "../components/EditUniversityForm";
import { useUniversityById } from "../hooks";

interface Props {
    visible: boolean;
    onClose: () => void;
    UniversityId: string;
}

const EditUniversity = ({ visible, onClose, UniversityId }: Props) => {
    const { data: UniversityData } = useUniversityById(UniversityId);

    const form = useForm<UpdateUniversityPayload>({
        defaultValues: {
            id: "",
            name: "",
            countryId: "",
            universityAddress: "",
            descriptions: "",
            website: "",
            globalRanking: 0
        },
    });

    const { reset } = form;

    useEffect(() => {
        if (!UniversityData) return;

        reset({
            id: UniversityData.id ?? "",
            name: UniversityData.name ?? "",
            countryId: UniversityData.countryId ?? "",
            universityAddress: UniversityData.universityAddress ?? "",
            descriptions: UniversityData.descriptions ?? "",
            website: UniversityData.website ?? "",
            globalRanking: UniversityData.globalRanking ?? 0

        });
    }, [UniversityData, reset]);

    if (!visible) return null;

    return (
        <EditUniversityForm
            form={form}
            onClose={onClose}
            UniversityId={UniversityId}
        />
    );
};

export default EditUniversity;