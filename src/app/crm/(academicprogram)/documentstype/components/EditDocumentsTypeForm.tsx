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

import { UpdateDocumentsTypePayload } from "../types/IDocumentsType";
import { useUpdateDocumentsType } from "../hooks";



type Props = {
    form: UseFormReturn<UpdateDocumentsTypePayload>
    onClose: () => void;
    DocumentsTypeId: string;
};

const EditDocumentsTypeForm = ({ form, onClose, DocumentsTypeId, }: Props) => {
    const editDocumentsType = useUpdateDocumentsType();
    const { handleError, clearError } = useErrorHandler();
    const { handleSubmit } = form;


    const handleClose = () => {
        onClose();
    };




    const onSubmit: SubmitHandler<UpdateDocumentsTypePayload> =
        async (data) => {
            clearError();
            try {
                const promise = editDocumentsType.mutateAsync({
                    id: DocumentsTypeId,
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
                    <h1 className="text-xl font-semibold">Update DocumentsType</h1>
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
                        />


                    </div>


                    {/* SUBMIT */}
                    <div className="flex justify-center mt-6">
                        <ButtonElement type="submit" text="Update DocumentsType" />
                    </div>

                </form>
            </div>
        </div>
    );
};

export default EditDocumentsTypeForm;