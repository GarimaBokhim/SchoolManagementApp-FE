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

import { ConversionPayload } from "../types/IVisitors";
import { useConvertToApplicant, useGetAllCountry, useGetAllCourse, useGetAllInquiry, useGetAllUniversity } from "../hooks";
import { AppCombobox } from "@/components/Input/ComboBox";
import { useState } from "react";


type Props = {
    form: UseFormReturn<ConversionPayload>
    onClose: () => void;
    selectedLead: string;
    convertId: string
};

const ConvertToApplicantForm = ({ form, onClose, selectedLead, convertId }: Props) => {
    const convertLead = useConvertToApplicant();
    const { handleError, clearError } = useErrorHandler();

    const { data: country } = useGetAllCountry();
    const { data: university } = useGetAllUniversity();
    const { data: course } = useGetAllCourse();
    const { handleSubmit } = form;


    const handleClose = () => {
        form.reset({
            passportNo: "",
            countryId: "",
            universityId: "",
            courseId: ""
        });
        onClose()
    };


    const onSubmit: SubmitHandler<ConversionPayload> =
        async (data) => {
            clearError();
            const values = form.getValues();

            const payload = {
                passportNo: values.passportNo,
                countryId: values.countryId,
                universityId: values.universityId,
                courseId: values.courseId

            };

            await convertLead.mutateAsync(payload);
            handleClose();
            onClose();
        };


    const countryId = form.watch("countryId");
    const universityId = form.watch("universityId");
    const courseId = form.watch("courseId");
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm ml-[16%]">
            <div className="bg-white dark:bg-[#27272a] w-full max-w-5xl p-5 rounded-lg overflow-auto max-h-[90vh]">

                {/* HEADER */}
                <div className="flex justify-between mb-6">
                    <h1 className="text-xl font-semibold">Convert To Applicant</h1>
                    <button onClick={handleClose}>
                        <X />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className="grid grid-cols-3 gap-4">

                        <InputElement
                            label="PassportNo"
                            form={form}
                            name="passportNo"
                        />


                        <AppCombobox
                            value={countryId}
                            dropDownWidth="w-full"
                            dropdownPositionClass="absolute z-20"
                            label="Country"
                            name="countryId"
                            form={form}
                            required
                            options={country || []}
                            selected={
                                country?.find(
                                    (g) => g.id === countryId
                                ) || null
                            }
                            onSelect={(group) => {
                                const id = group?.id ?? "";

                                form.setValue("countryId", id, {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                });
                            }}
                            getLabel={(g) => g?.name ?? ""}
                            getValue={(g) => g?.id ?? ""}
                        />


                        <AppCombobox
                            value={courseId}
                            dropDownWidth="w-full"
                            dropdownPositionClass="absolute z-20"
                            label="Course"
                            name="courseId"
                            form={form}
                            required
                            options={course || []}
                            selected={
                                course?.find(
                                    (g) => g.id === courseId
                                ) || null
                            }
                            onSelect={(group) => {
                                const id = group?.id ?? "";

                                form.setValue("courseId", id, {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                });
                            }}
                            getLabel={(g) => g?.title ?? ""}
                            getValue={(g) => g?.id ?? ""}
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
                        <ButtonElement type="submit" text="Update Invoice" />
                    </div>

                </form>
            </div>
        </div>
    );
};

export default ConvertToApplicantForm;