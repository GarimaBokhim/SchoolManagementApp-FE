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

import { UpdateDocumentsPayload } from "../types/IDocuments";
import { useUpdateDocuments, useGetAllApplicants, useGetAllDocType } from "../hooks";
import { AppCombobox } from "@/components/Input/ComboBox";



type Props = {
    form: UseFormReturn<UpdateDocumentsPayload>
    onClose: () => void;
    DocumentsId: string;
};

const EditDocumentsForm = ({ form, onClose, DocumentsId }: Props) => {
    const editDocuments = useUpdateDocuments();
    const { handleError, clearError } = useErrorHandler();

    const { data: docType } = useGetAllDocType();
    const { data: applicant } = useGetAllApplicants();
    const { handleSubmit } = form;


    const {
        fields,
        append,
        remove,
    } = useFieldArray({
        control: form.control,
        name: "documentsByIdDTOs",
    });

    const handleClose = () => {
        onClose();
    };

    const documentsStatusType = [
        { id: 1, name: 'Pending' },
        { id: 2, name: 'Approved' },
        { id: 3, name: 'Rejected' },
        { id: 4, name: 'ActionRequired' }
    ];




    const onSubmit: SubmitHandler<UpdateDocumentsPayload> =
        async (data) => {
            clearError();
            try {
                const promise = editDocuments.mutateAsync({
                    id: DocumentsId,
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


    const applicantId = form.watch("applicantId");
    // const docFile = form.watch("docFile");
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-lg">
            <div className="bg-white dark:bg-[#27272a] w-full max-w-5xl p-5 rounded-lg overflow-auto max-h-[90vh]">

                {/* HEADER */}
                <div className="flex justify-between mb-6">
                    <h1 className="text-xl font-semibold">Update Documents</h1>
                    <button onClick={handleClose}>
                        <X />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>



                    {/* BASIC INFO */}
                    <div className="grid grid-cols-3 gap-4">

                        <AppCombobox
                            value={applicantId}
                            dropDownWidth="w-full"
                            dropdownPositionClass="absolute z-20"
                            label="Applicant"
                            name="applicantId"
                            form={form}
                            required
                            options={applicant || []}
                            selected={
                                applicant?.find(
                                    (g) => g.id === applicantId
                                ) || null
                            }
                            onSelect={(group) => {
                                const id = group?.id ?? "";

                                form.setValue("applicantId", id, {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                });
                            }}
                            getLabel={(g) => g?.fullName ?? ""}
                            getValue={(g) => g?.id ?? ""}
                        />

                    </div>

                    {/* ITEMS */}
                    <div className="mt-8">
                        <h2 className="font-semibold mb-4">Document Items</h2>

                        {fields.length === 0 && (
                            <button
                                type="button"
                                onClick={() =>
                                    append({
                                        documentTypeId: "",
                                        documentStatus: 0,
                                        documentsUrl: "",
                                        docFile: null
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
                                <div className="flex justify-between items-center mb-3">
                                    <span className="font-medium">
                                        Item {index + 1}
                                    </span>

                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                append({
                                                    documentTypeId: "",
                                                    documentStatus: 0,
                                                    documentsUrl: "",
                                                    docFile: null
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

                                <div className="flex items-center gap-3 w-full">

                                    {/* Document Type */}
                                    <div className="w-60 shrink-0">
                                        <AppCombobox
                                            value={form.watch(`documentsByIdDTOs.${index}.documentTypeId`)}
                                            dropDownWidth="w-full"
                                            dropdownPositionClass="absolute z-20"
                                            label="Document Type"
                                            name={`documentsByIdDTOs.${index}.documentTypeId`}
                                            form={form}
                                            required
                                            options={docType || []}
                                            selected={
                                                docType?.find(
                                                    (item) =>
                                                        item.id === form.watch(`documentsByIdDTOs.${index}.documentTypeId`)
                                                ) || null
                                            }
                                            onSelect={(item) => {
                                                form.setValue(
                                                    `documentsByIdDTOs.${index}.documentTypeId`,
                                                    item?.id ?? "",
                                                    {
                                                        shouldValidate: true,
                                                        shouldDirty: true,
                                                    }
                                                );
                                            }}
                                            getLabel={(item) => item?.name ?? ""}
                                            getValue={(item) => item?.id ?? ""}
                                        />
                                    </div>

                                    {/* File Input */}
                                    <div className="w-70 shrink-0">
                                        <input
                                            type="file"
                                            className="border rounded-lg p-2 w-full text-sm"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0] ?? null;

                                                form.setValue(
                                                    `documentsByIdDTOs.${index}.docFile`,
                                                    file,
                                                    {
                                                        shouldValidate: true,
                                                        shouldDirty: true,
                                                    }
                                                );
                                            }}
                                        />
                                    </div>

                                    {/* Image Preview */}
                                    {form.watch(`documentsByIdDTOs.${index}.documentsUrl`) && (
                                        <div className="shrink-0">
                                            <img
                                                src={`${process.env.NEXT_PUBLIC_API_URL}/${form.watch(
                                                    `documentsByIdDTOs.${index}.documentsUrl`
                                                )}`}
                                                alt="document"
                                                className="w-20 h-20 object-cover rounded-full border border-gray-300 shadow-sm"
                                            />
                                        </div>
                                    )}

                                    <div className="w-60 shrink-0">
                                        <AppCombobox
                                            value={form.watch(`documentsByIdDTOs.${index}.documentStatus`)}
                                            dropDownWidth="w-full"
                                            dropdownPositionClass="absolute z-20"
                                            label="Document Status"
                                            name={`documentsByIdDTOs.${index}.documentStatus`}
                                            form={form}
                                            required
                                            options={documentsStatusType}
                                            selected={
                                                documentsStatusType?.find(
                                                    (item) =>
                                                        item.id === form.watch(`documentsByIdDTOs.${index}.documentStatus`)
                                                ) || null
                                            }
                                            onSelect={(item) => {
                                                form.setValue(
                                                    `documentsByIdDTOs.${index}.documentStatus`,
                                                    item?.id ?? 0,
                                                    {
                                                        shouldValidate: true,
                                                        shouldDirty: true,
                                                    }
                                                );
                                            }}
                                            getLabel={(item) => item?.name ?? ""}
                                            getValue={(item) => item?.id ?? ""}
                                        />
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>

                    {/* SUBMIT */}
                    <div className="flex justify-center mt-6">
                        <ButtonElement type="submit" text="Update Documents" />
                    </div>

                </form>
            </div>
        </div>
    );
};

export default EditDocumentsForm;