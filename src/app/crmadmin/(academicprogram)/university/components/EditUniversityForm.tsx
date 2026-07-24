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

import { UpdateUniversityPayload } from "../types/IUniversity";
import { useUpdateUniversity, useGetAllCountry } from "../hooks";
import { AppCombobox } from "@/components/Input/ComboBox";



type Props = {
    form: UseFormReturn<UpdateUniversityPayload>
    onClose: () => void;
    UniversityId: string;
};

const EditUniversityForm = ({ form, onClose, UniversityId, }: Props) => {
    const editUniversity = useUpdateUniversity();
    const { handleError, clearError } = useErrorHandler();

    const { data: country } = useGetAllCountry();
    const { handleSubmit } = form;


    const handleClose = () => {
        onClose();
    };


    const onSubmit: SubmitHandler<UpdateUniversityPayload> =
        async (data) => {
            clearError();
            try {
                const promise = editUniversity.mutateAsync({
                    id: UniversityId,
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


    const countryId = form.watch("countryId");
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
                            label="Name"
                            form={form}
                            name="name"
                            required
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

                        <InputElement
                            label="UniversityAddress"
                            form={form}
                            name="universityAddress"
                            required
                        />

                        <InputElement
                            label="Descriptions"
                            form={form}
                            name="descriptions"
                            required
                        />

                        <InputElement
                            label="Website"
                            form={form}
                            name="website"
                            required
                        />

                        <InputElement
                            label="GlobalRanking"
                            form={form}
                            name="globalRanking"
                            inputType="number"
                            required
                        />

                    </div>


                    {/* SUBMIT */}
                    <div className="flex justify-center mt-6">
                        <ButtonElement type="submit" text="Update University" />
                    </div>

                </form>
            </div>
        </div>
    );
};

export default EditUniversityForm;