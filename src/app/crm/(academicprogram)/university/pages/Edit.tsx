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
    const {
        data: UniversityData,
        isLoading,
        error,
    } = useUniversityById(UniversityId);

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

    if (isLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 ml-12 md:ml-64 sm:ml-16">
                <div className="rounded-lg bg-white p-6 dark:bg-[#27272a]">
                    Loading university...
                </div>
            </div>
        );
    }

    if (error || !UniversityData) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 ml-12 md:ml-64 sm:ml-16">
                <div className="rounded-lg bg-white p-6 dark:bg-[#27272a]">
                    <p className="mb-4">Unable to load university details.</p>
                    <button type="button" onClick={onClose} className="text-blue-600">
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <EditUniversityForm
            form={form}
            onClose={onClose}
            UniversityId={UniversityId}
        />
    );
};

export default EditUniversity;