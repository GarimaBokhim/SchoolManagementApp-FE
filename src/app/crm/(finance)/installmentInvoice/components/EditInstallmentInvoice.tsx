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

import { UpdateInstallmentInvoicePayload } from "../types/IInstallmentInvoice";
import { useUpdateInstallmentInvoice, useGetAllApplicants } from "../hooks";
import { AppCombobox } from "@/components/Input/ComboBox";



type Props = {
    form: UseFormReturn<UpdateInstallmentInvoicePayload>
    onClose: () => void;
    InvoiceId: string;
};

const EditInstallmentInvoiceForm = ({ form, onClose, InvoiceId, }: Props) => {
    const editInstallmentInvoice = useUpdateInstallmentInvoice();
    const { handleError, clearError } = useErrorHandler();

    const { data: allapplicant } = useGetAllApplicants();
    const { handleSubmit } = form;


    const {
        fields,
        append,
        remove,
    } = useFieldArray({
        control: form.control,
        name: "updateInvoiceItemDTOs",
    });

    const handleClose = () => {
        onClose();
    };




    const onSubmit: SubmitHandler<UpdateInstallmentInvoicePayload> =
        async (data) => {
            clearError();
            try {
                const promise = editInstallmentInvoice.mutateAsync({
                    id: InvoiceId,
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
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm ml-[16%]">
            <div className="bg-white dark:bg-[#27272a] w-full max-w-5xl p-5 rounded-lg overflow-auto max-h-[90vh]">

                {/* HEADER */}
                <div className="flex justify-between mb-6">
                    <h1 className="text-xl font-semibold">Update Installment Invoice</h1>
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
                            options={allapplicant || []}
                            selected={
                                allapplicant?.find(
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

                        <InputElement
                            label="Issue Date"
                            form={form}
                            name="issuedDate"
                            inputType="date"
                        />

                        <InputElement
                            label="Due Date"
                            form={form}
                            name="dueDate"
                            inputType="date"
                        />
                    </div>

                    {/* ITEMS */}
                    <div className="mt-8">
                        <h2 className="font-semibold mb-4">Invoice Items</h2>

                        {fields.length === 0 && (
                            <button
                                type="button"
                                onClick={() =>
                                    append({
                                        id: "",
                                        description: "",
                                        quantity: 0,
                                        amount: 0,
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
                                                    description: "",
                                                    quantity: 0,
                                                    amount: 0,
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
                                        name={`updateInvoiceItemDTOs.${index}.description`}
                                    />

                                    <InputElement
                                        label="Quantity"
                                        form={form}
                                        name={`updateInvoiceItemDTOs.${index}.quantity`}
                                        inputType="number"
                                    />

                                    <InputElement
                                        label="Amount"
                                        form={form}
                                        name={`updateInvoiceItemDTOs.${index}.amount`}
                                        inputType="number"
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

export default EditInstallmentInvoiceForm;