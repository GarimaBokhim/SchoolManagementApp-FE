'use client'
import { useState } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import { AddAnnouncementPayload } from '../types/IAnnouncement'
import { SubmitHandler, useFieldArray, UseFormReturn } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { useAddAnnouncement } from "../hooks";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { AppCombobox } from "@/components/Input/ComboBox";
import TextEditor from '@/components/Input/TextEditor';

type Props = {
    form: UseFormReturn<AddAnnouncementPayload>;
    onClose: () => void;
};
const AddAnnouncementForm = ({ form, onClose }: Props) => {
    const addAnnouncement = useAddAnnouncement();
    const { setValue, watch } = form;
    const details = watch("description");

    const priorityOptions = [
        { id: 1, name: "Low" },
        { id: 2, name: "Medium" },
        { id: 3, name: "High" },
        { id: 4, name: "Critical" }
    ];

    const handleClose = () => {
        form.reset({
            title: "",
            description: "",
            announcementPriority: 0

        });
        onClose()
    };


    const onSubmit: SubmitHandler<AddAnnouncementPayload> = async () => {
        const values = form.getValues();

        const payload = {
            title: values.title,
            description: values.description,
            announcementPriority: values.announcementPriority
        };

        await addAnnouncement.mutateAsync(payload);
        handleClose();
        onClose();
    };
    return (
        <div className=" inset-0 flex items-center justify-center  w-full h-full">
            <div className="w-full  h-[100%] bg-[#ffffff] dark:bg-[#27272a] p-4 overflow-auto relative dark:text-white ">
                <fieldset className="">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
                            Add Announcement
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
                                label="Title"
                                form={form}
                                name="title"
                                required
                            />

                            <AppCombobox
                                label="Announcement Priority"
                                name="announcementPriority"
                                value={form.watch("announcementPriority")}
                                dropDownWidth="w-full"
                                dropdownPositionClass="absolute z-20"
                                options={priorityOptions}
                                selected={
                                    priorityOptions.find(
                                        x => x.id === form.watch("announcementPriority")
                                    ) ?? null
                                }
                                onSelect={(option) =>
                                    form.setValue("announcementPriority", option?.id ?? 0, {
                                        shouldDirty: true,
                                        shouldValidate: true,
                                    })
                                }
                                getLabel={(option) => option?.name ?? ""}
                                getValue={(option) => option?.id ?? ""}
                            />



                            <div className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 col-span-1 md:col-span-2 lg:col-span-3 shadow-inner">
                                <label className="block mb-2 font-medium text-sm">
                                    Descriptions
                                </label>
                                <TextEditor
                                    content={details}
                                    onChange={(content) => setValue("description", content)}
                                />
                            </div>





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

export default AddAnnouncementForm;
