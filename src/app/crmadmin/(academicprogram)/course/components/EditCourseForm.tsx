"use client";
import {
    SubmitHandler,
    useFieldArray,
    UseFormReturn,
} from "react-hook-form";

import { Plus, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";

import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";

import useErrorHandler from "@/components/helpers/ErrorHandling";

import { UpdateCoursePayload } from "../types/ICourse";
import { useUpdateCourse, useGetAllUniversity } from "../hooks";
import { AppCombobox } from "@/components/Input/ComboBox";



type Props = {
    form: UseFormReturn<UpdateCoursePayload>
    onClose: () => void;
    CourseId: string;
};

const studyLevelType = [
    { id: 1, name: 'Bachelor' },
    { id: 2, name: 'Undergraduate' },
    { id: 3, name: 'Masters' },
    { id: 4, name: 'PhD' }
];

const EditCourseForm = ({ form, onClose, CourseId, }: Props) => {
    const editCourse = useUpdateCourse();
    const { handleError, clearError } = useErrorHandler();

    const { data: university } = useGetAllUniversity();
    const { handleSubmit } = form;


    const handleClose = () => {
        onClose();
    };


    const onSubmit: SubmitHandler<UpdateCoursePayload> =
        async (data) => {
            clearError();
            try {
                const promise = editCourse.mutateAsync({
                    id: CourseId,
                    payload: data,
                });

                await toast.promise(
                    promise,
                    {
                        loading: "Updating...",
                        success: (res: any) => res?.message,
                        error: (err: any) => err?.response?.data?.message,
                    }
                );

                handleClose();
            } catch (error) {
                const errorMsg = handleError(error);
                Toast.error(errorMsg);
            }
        };


    const universityId = form.watch("universityId");
    const studyLevel = form.watch("studyLevel") ?? 0;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm ml-[16%]">
            <div className="bg-white dark:bg-[#27272a] w-full max-w-5xl p-5 rounded-lg overflow-auto max-h-[90vh]">

                {/* HEADER */}
                <div className="flex justify-between mb-6">
                    <h1 className="text-xl font-semibold">Update Univversity</h1>
                    <button onClick={handleClose}>
                        <X />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>

                    {/* BASIC INFO */}
                    <div className="grid grid-cols-3 gap-4">


                        <InputElement
                            label="Title"
                            form={form}
                            name="title"
                            required
                        />

                        <AppCombobox
                            label="Payment Method"
                            dropdownPositionClass="absolute"
                            name="studyLevel"
                            form={form}
                            value={studyLevel}
                            options={studyLevelType}
                            selected={
                                studyLevelType.find((g) => g.id === studyLevel) ?? null
                            }
                            onSelect={(option) => {
                                const id = option?.id ?? 0;
                                form.setValue("studyLevel", id);
                            }}
                            getLabel={(o) => o?.name ?? ""}
                            getValue={(o) => o?.id ?? ""}
                        />

                        <InputElement
                            label="Currency"
                            form={form}
                            name="currency"
                            required
                        />

                        <InputElement
                            label="TuationFee"
                            form={form}
                            name="tuationFee"
                            required
                        />

                        <AppCombobox
                            value={universityId}
                            dropDownWidth="w-full"
                            dropdownPositionClass="absolute z-20"
                            label="University"
                            name="universityId"
                            form={form}
                            required
                            options={university || []}
                            selected={
                                university?.find(
                                    (g) => g.id === universityId
                                ) || null
                            }
                            onSelect={(group) => {
                                const id = group?.id ?? "";

                                form.setValue("universityId", id, {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                });
                            }}
                            getLabel={(g) => g?.name ?? ""}
                            getValue={(g) => g?.id ?? ""}
                        />
                    </div>


                    {/* SUBMIT */}
                    <div className="flex justify-center mt-6">
                        <ButtonElement type="submit" text="Update Course" />
                    </div>

                </form>
            </div>
        </div>
    );
};

export default EditCourseForm;