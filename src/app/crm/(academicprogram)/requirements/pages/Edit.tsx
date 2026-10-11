"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { RequirementsFormPayload } from "../types/IRequirements";
import AddRequirementsForm from "../components/AddRequirementsForm";
import { useRequirementsById } from "../hooks";

interface Props {
    visible: boolean;
    onClose: () => void;
    RequirementsId: string;
}

const EditRequirements = ({ visible, onClose, RequirementsId }: Props) => {
    const {
        data: requirements,
        isLoading,
        error,
    } = useRequirementsById(RequirementsId);

    const form = useForm<RequirementsFormPayload>({
        defaultValues: {
            title: "",
            descriptions: "",
            universityId: "",
            countryId: "",
            courseId: "",
            documentsCheckListDTOs: [
                { id: "", documenteTypeId: "", isRequired: false },
            ],
        },
    });

    const { reset } = form;

    useEffect(() => {
        if (!requirements) return;

        reset({
            title: requirements.title ?? "",
            descriptions: requirements.descriptions ?? "",
            universityId: requirements.universityId ?? "",
            countryId: requirements.countryId ?? "",
            courseId: requirements.courseId ?? "",
            documentsCheckListDTOs:
                requirements.DocumentsCheckListDTOs?.map((item) => ({
                    id: item.id ?? "",
                    documenteTypeId: item.documenteTypeId ?? "",
                    isRequired: item.isRequired ?? false,
                })) ?? [],
        });
    }, [requirements, reset]);

    if (!visible) return null;

    if (isLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 ml-12 md:ml-64 sm:ml-16">
                <div className="rounded-lg bg-white p-6 dark:bg-[#27272a]">
                    Loading requirements...
                </div>
            </div>
        );
    }

    if (error || !requirements) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 ml-12 md:ml-64 sm:ml-16">
                <div className="rounded-lg bg-white p-6 dark:bg-[#27272a]">
                    <p className="mb-4">Unable to load requirements details.</p>
                    <button type="button" onClick={onClose} className="text-blue-600">
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-black/40 backdrop-blur-sm ml-12 md:ml-64 sm:ml-16">
            <div className="bg-[#FBFBFB] dark:bg-[#27272a] w-full max-w-[95vw] md:max-w-[85vw] lg:max-w-[75vw] xl:max-w-[70vw] max-h-[95vh] md:max-h-[92vh] h-full rounded-lg overflow-auto p-6 md:p-8 shadow-lg">
                <AddRequirementsForm
                    form={form}
                    onClose={onClose}
                    requirementsId={RequirementsId}
                />
            </div>
        </div>
    );
};

export default EditRequirements;
