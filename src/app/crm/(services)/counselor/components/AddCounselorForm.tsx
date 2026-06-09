'use client'
import { useState } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import { AddCounselorPayload } from '../types/ICounselor'
import { SubmitHandler, useFieldArray, UseFormReturn } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { useAddCounselor } from "../hooks";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { AppCombobox } from "@/components/Input/ComboBox";

type Props = {
    form: UseFormReturn<AddCounselorPayload>;
    onClose: () => void;
};
const AddCounselorForm = ({ form, onClose }: Props) => {
    const addCounselor = useAddCounselor();

    const handleClose = () => {
        form.reset({
            fullName: "",
            email: "",
            contactNumber: ""

        });
        onClose()
    };


    const onSubmit: SubmitHandler<AddCounselorPayload> = async () => {
        const values = form.getValues();

        const payload = {
            fullName: values.fullName,
            email: values.email,
            contactNumber: values.contactNumber
        };

        await addCounselor.mutateAsync(payload);
        handleClose();
        onClose();
    };
    return (
        <div className=" inset-0 flex items-center justify-center  w-full h-full">
            <div className="w-full  h-[100%] bg-[#ffffff] dark:bg-[#27272a] p-4 overflow-auto relative dark:text-white ">
                <fieldset className="">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
                            Add Counselor
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
                                label="FullName"
                                form={form}
                                name="fullName"
                                required
                            />

                            <InputElement
                                label="Email"
                                form={form}
                                name="email"
                                required
                            />

                            <InputElement
                                label="ContactNumber"
                                form={form}
                                name="contactNumber"
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

export default AddCounselorForm;
