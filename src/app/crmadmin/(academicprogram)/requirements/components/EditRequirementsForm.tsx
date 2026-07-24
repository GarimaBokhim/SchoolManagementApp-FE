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

import { UpdateRequirementsPayload } from "../types/IRequirements";
import { useUpdateRequirements, useGetAllCountry } from "../hooks";
import { AppCombobox } from "@/components/Input/ComboBox";



type Props = {
    form: UseFormReturn<UpdateRequirementsPayload>
    onClose: () => void;
    RequirementsId: string;
};

const EditRequirementsForm = ({ form, onClose, RequirementsId }: Props) => {
    const editRequirements = useUpdateRequirements();
    const { handleError, clearError } = useErrorHandler();


    const { data: allCountry } = useGetAllCountry();
    const { handleSubmit } = form;


    const {
        fields,
        append,
        remove,
    } = useFieldArray({
        control: form.control,
        name: "updatedocumentsCheckListDTOs",
    });

    const handleClose = () => {
        onClose();
    };




    const onSubmit: SubmitHandler<UpdateRequirementsPayload> =
        async (data) => {
            clearError();
            try {
                const promise = editRequirements.mutateAsync({
                    id: RequirementsId,
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


    const courseId = form.watch("courseId");
    const countryId = form.watch("countryId");
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm ml-[16%]">
            <div className="bg-white dark:bg-[#27272a] w-full max-w-5xl p-5 rounded-lg overflow-auto max-h-[90vh]">

                {/* HEADER */}
                <div className="flex justify-between mb-6">
                    <h1 className="text-xl font-semibold">Update Invoice</h1>
                    <button onClick={handleClose}>
                        <X />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>



                    {/* BASIC INFO */}
                    <div className="grid grid-cols-3 gap-4">

                        <InputElement
                            label="Descriptions"
                            form={form}
                            name="descriptions"
                        />

                        <AppCombobox
                            value={countryId}
                            dropDownWidth="w-full"
                            dropdownPositionClass="absolute z-20"
                            label="Country"
                            name="countryId"
                            form={form}
                            required
                            options={allCountry || []}
                            selected={
                                allCountry?.find(
                                    (g) => g.id === courseId
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


                        {/* <AppCombobox
                            value={courseId}
                            dropDownWidth="w-full"
                            dropdownPositionClass="absolute z-20"
                            label="Course"
                            name="courseId"
                            form={form}
                            required
                            options={allCourse || []}
                            selected={
                                allCourse?.find(
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
                            getLabel={(g) => g?.name ?? ""}
                            getValue={(g) => g?.id ?? ""}
                        /> */}


                    </div>

                    {/* ITEMS */}
                    <div className="mt-8">
                        <h2 className="font-semibold mb-4">Requirements Items</h2>

                        {fields.length === 0 && (
                            <button
                                type="button"
                                onClick={() =>
                                    append({
                                        id: "",
                                        documenteTypeId: ""
                                    })
                                }
                                className="px-4 py-2 bg-black text-white rounded"
                            >
                                Add Item
                            </button>
                        )}

                        {fields.map((field, index) => (
                            <div
                                key={field.id}
                                className="border p-4 rounded mb-4"
                            >
                                <div className="flex justify-between mb-2">
                                    <span>Item {index + 1}</span>

                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                append({
                                                    id: "",
                                                    documenteTypeId: ""
                                                })
                                            }
                                        >
                                            <Plus />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                        >
                                            <Trash2 />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <InputElement
                                        label="Description"
                                        form={form}
                                        name={`documentsCheckListDTOs.${index}.documenteTypeId`}
                                    />
                                </div>
                            </div>
                        ))}
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

export default EditRequirementsForm;