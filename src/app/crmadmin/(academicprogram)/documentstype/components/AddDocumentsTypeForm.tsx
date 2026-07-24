'use client'
import { useState } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import { AddDocumentsTypePayload } from '../types/IDocumentsType'
import { SubmitHandler, useFieldArray, UseFormReturn } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { AppCombobox } from "@/components/Input/ComboBox";
import { useAddDocumentsType } from '../hooks';

type Props = {
    form: UseFormReturn<AddDocumentsTypePayload>;
    onClose: () => void;
};
const AddDocumentsTypeForm = ({ form, onClose }: Props) => {
    const addDocumentsType = useAddDocumentsType();

    const handleClose = () => {
        form.reset({
            name: ""

        });
        onClose()
    };


    const onSubmit: SubmitHandler<AddDocumentsTypePayload> = async () => {
        const values = form.getValues();

        const payload = {
            name: values.name
        };

        await addDocumentsType.mutateAsync(payload);
        handleClose();
        onClose();
    };
    return (
        <div className=" inset-0 flex items-center justify-center  w-full h-full">
            <div className="w-full  h-[100%] bg-[#ffffff] dark:bg-[#27272a] p-4 overflow-auto relative dark:text-white ">
                <fieldset className="">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
                            Add DocumentsType
                        </h1>
                        <button
                            type="button"
                            onClick={() => {
                                handleClose();
                                onClose();
                            }}
                            className="text-red-400 text-2xl hover:text-red-500"
                        >
                            <X strokeWidth={3} />
                        </button>
                    </div>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">

                            <InputElement
                                label="Name"
                                form={form}
                                name="name"
                                required
                            />

                        </div>

                        <div className="flex justify-center mt-6">
                            <ButtonElement type="submit" text={"Submit"} />
                        </div>
                    </form>
                </fieldset>
            </div>
        </div>
    );
};

export default AddDocumentsTypeForm;
