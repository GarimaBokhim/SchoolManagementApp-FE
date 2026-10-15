"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import AddVisaRequirementForm from "../components/AddVisaRequirementsForm";
import { useVisaRequirementById } from "../hooks";
import { AddVisaRequirementPayload } from "../types/IVisaRequirements";

interface Props {
    visible: boolean;
    onClose: () => void;
    VisaRequirementsId: string;
}

const EditVisaRequirements = ({ visible, onClose, VisaRequirementsId }: Props) => {
    const {
        data: visaRequirements,
        isLoading,
        error,
    } = useVisaRequirementById(VisaRequirementsId);

    const form = useForm<AddVisaRequirementPayload>({
        defaultValues: {
            countryId: "",
            universityId: "",
            courseId: "",
            visaRequirementsDetailsDTOs: [
                { id: "", step: 1, visaStatusId: "", visaRequirementStatus: 0 },
            ],
        },
    });

    const { reset } = form;

    useEffect(() => {
        if (!visaRequirements) return;

        reset({
            countryId: visaRequirements.countryId ?? "",
            universityId: visaRequirements.universityId ?? "",
            courseId: visaRequirements.courseId ?? "",
            visaRequirementsDetailsDTOs:
                visaRequirements.visaRequirementsDetailsDTOs
                    ?.slice()
                    .sort((a, b) => a.step - b.step)
                    .map((item) => ({
                    id: item.id,
                    step: item.step,
                    visaStatusId: item.visaStatusId,
                    visaRequirementStatus: item.visaRequirementStatus ?? 0,
                })) ?? [],
        });
    }, [visaRequirements, reset]);

    if (!visible) return null;

    if (isLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 ml-12 md:ml-64 sm:ml-16">
                <div className="rounded-lg bg-white p-6 dark:bg-[#27272a]">
                    Loading visa requirements...
                </div>
            </div>
        );
    }

    if (error || !visaRequirements) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 ml-12 md:ml-64 sm:ml-16">
                <div className="rounded-lg bg-white p-6 dark:bg-[#27272a]">
                    <p className="mb-4">Unable to load visa requirement details.</p>
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
                <AddVisaRequirementForm
                    form={form}
                    onClose={onClose}
                    visaRequirementId={VisaRequirementsId}
                />
            </div>
        </div>
    );
};

export default EditVisaRequirements;