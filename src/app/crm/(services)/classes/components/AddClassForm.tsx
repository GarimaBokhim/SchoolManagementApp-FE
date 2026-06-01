'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { AddClassPayload } from '../types/IClass'
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { useAddClass, useGetAllClass } from "../hooks";
import toast from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { AppCombobox } from "@/components/Input/ComboBox";

type Props = {
    form: UseFormReturn<AddClassPayload>;
    onClose: () => void;
};
const AddClassForm = ({ form, onClose }: Props) => {
    const addClass = useAddClass();
    const { handleError, clearError } = useErrorHandler();

    const [englishProficiency, setEnglishProficiency] = useState<number | null>(null);

    const handleClose = () => {
        form.reset({
            name: "",
            startTime: "",
            endTime: "",
            batch: "",
            englishProficiency: 0

        });
    };

    const onSubmit: SubmitHandler<AddClassPayload> = async (data) => {
        clearError();
        try {
            await addClass.mutateAsync({
                name: data.name,
                startTime: data.startTime,
                endTime: data.endTime,
                batch: data.batch,
                englishProficiency: data.englishProficiency
            })

            handleClose()
            onClose()
        } catch (error) {
            Toast.error(handleError(error))
        }
    };
    return (
        <div className=" inset-0 flex items-center justify-center  w-full h-full">
            <div className="w-full  h-[100%] bg-[#ffffff] dark:bg-[#27272a] p-4 overflow-auto relative dark:text-white ">
                <fieldset className="">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
                            Add Class
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
                                placeholder="Enter Name"
                                required
                            />


                            <InputElement
                                label="StartTime"
                                form={form}
                                name="startTime"
                                inputType="time"
                                placeholder="Enter Start Time"
                                required
                            />

                            <InputElement
                                label="EndTime"
                                form={form}
                                name="endTime"
                                inputType="time"
                                placeholder="Enter End Time"
                                required
                            />


                            <InputElement
                                label="Batch"
                                form={form}
                                name="batch"
                                placeholder="Enter Batch"
                                required
                            />


                            <AppCombobox
                                label="Payment Method"
                                dropdownPositionClass="absolute"
                                name="englishProficiency"
                                form={form}
                                value={englishProficiency}
                                options={[
                                    { id: 0, name: 'IELTS' },
                                    { id: 1, name: 'TOEFL' },
                                    { id: 2, name: 'PTE' },
                                    { id: 3, name: 'DET' },
                                    { id: 4, name: 'TOEIC' },
                                    { id: 5, name: 'CELPIP' },
                                    { id: 5, name: 'OET' },
                                    { id: 5, name: 'FCE' },
                                    { id: 5, name: 'CAE' },
                                    { id: 5, name: 'CPE' },
                                ]}
                                dropDownWidth="w-full"
                                selected={
                                    [
                                        { id: 0, name: 'IELTS' },
                                        { id: 1, name: 'TOEFL' },
                                        { id: 2, name: 'PTE' },
                                        { id: 3, name: 'DET' },
                                        { id: 4, name: 'TOEIC' },
                                        { id: 5, name: 'CELPIP' },
                                        { id: 5, name: 'OET' },
                                        { id: 5, name: 'FCE' },
                                        { id: 5, name: 'CAE' },
                                        { id: 5, name: 'CPE' },
                                    ].find((g) => g.id === englishProficiency) || null
                                }
                                onSelect={(option) => {
                                    setEnglishProficiency(option?.id ?? null);
                                    form.setValue('englishProficiency', option?.id ?? 0);
                                }}
                                getLabel={(o) => o?.name || ''}
                                getValue={(o) => o?.id ?? ''}
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

export default AddClassForm;
