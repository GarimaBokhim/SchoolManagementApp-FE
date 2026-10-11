"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { UpdateIntakePayload } from "../types/IIntake";
import AddIntakeForm from "../components/AddIntakeForm";
import { useIntakeById } from "../hooks";

interface Props {
    visible: boolean;
    onClose: () => void;
    IntakeId: string;
}

const EditIntake = ({ visible, onClose, IntakeId }: Props) => {
    const {
        data: intake,
        isLoading,
        error,
    } = useIntakeById(IntakeId);

    const form = useForm<UpdateIntakePayload>({
        defaultValues: {
            id: "",
            intakeName: "",
            month: 0,
            deadline: "",
            isOpen: true,
            countryId: "",
            universityId: "",
            courseId: "",
        },
    });

    useEffect(() => {
        if (!intake) return;

        form.reset({
            id: intake.id ?? "",
            intakeName: intake.intakeName ?? "",
            month: intake.month ?? 0,
            deadline: intake.deadline?.split("T")[0] ?? "",
            isOpen: intake.isOpen ?? true,
            countryId: intake.countryId ?? "",
            universityId: intake.universityId ?? "",
            courseId: intake.courseId ?? "",
        });
    }, [intake, form]);

    if (!visible) return null;

    if (isLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 ml-12 md:ml-64 sm:ml-16">
                <div className="rounded-lg bg-white p-6 dark:bg-[#27272a]">
                    Loading intake...
                </div>
            </div>
        );
    }

    if (error || !intake) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 ml-12 md:ml-64 sm:ml-16">
                <div className="rounded-lg bg-white p-6 dark:bg-[#27272a]">
                    <p className="mb-4">Unable to load intake details.</p>
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
                <AddIntakeForm
                    form={form}
                    onClose={onClose}
                    intakeId={IntakeId}
                />
            </div>
        </div>
    );
};

export default EditIntake;
