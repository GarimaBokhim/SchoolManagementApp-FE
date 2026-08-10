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

import { UpdateAnnouncementPayload } from "../types/IAnnouncement";
import { useAnnouncementById, useUpdateAnnouncement } from "../hooks";
import TextEditor from "@/components/Input/TextEditor";
import { AppCombobox } from "@/components/Input/ComboBox";



type Props = {
    form: UseFormReturn<UpdateAnnouncementPayload>
    onClose: () => void;
    AnnouncementId: string;
};

const EditAnnouncementForm = ({ form, onClose, AnnouncementId, }: Props) => {
    const editAnnouncement = useUpdateAnnouncement();



    const { handleError, clearError } = useErrorHandler();
    const { handleSubmit } = form;
    const { setValue, watch } = form;
    const details = watch("description");

    const priorityOptions = [
        { id: 1, name: "Low" },
        { id: 2, name: "Medium" },
        { id: 3, name: "High" },
        { id: 4, name: "Critical" }
    ];


    const handleClose = () => {
        onClose();
    };




    const onSubmit: SubmitHandler<UpdateAnnouncementPayload> =
        async (data) => {
            clearError();
            try {
                const promise = editAnnouncement.mutateAsync({
                    id: AnnouncementId,
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


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm ml-[16%]">
            <div className="bg-white dark:bg-[#27272a] w-full max-w-5xl p-5 rounded-lg overflow-auto max-h-[90vh]">

                {/* HEADER */}
                <div className="flex justify-between mb-6">
                    <h1 className="text-xl font-semibold">Update Announcement</h1>
                    <button onClick={handleClose}>
                        <X />
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
            </div>
        </div>
    );
};

export default EditAnnouncementForm;