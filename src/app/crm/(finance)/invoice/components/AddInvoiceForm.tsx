'use client'
import { useState } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import { AddInvoicePayload } from '../types/IInvoice'
import { SubmitHandler, useFieldArray, UseFormReturn } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { useAddInvoice, useGetAllApplicants } from "../hooks";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { AppCombobox } from "@/components/Input/ComboBox";

type Props = {
    form: UseFormReturn<AddInvoicePayload>;
    onClose: () => void;
};
const AddInvoiceForm = ({ form, onClose }: Props) => {
    const addInvoice = useAddInvoice();
    const { handleError, clearError } = useErrorHandler();
    const { data: allapplicant } = useGetAllApplicants();
    const [sellectedApplicantId, setSelectedApplicantId] = useState<string | null>("");

    const handleClose = () => {
        form.reset({
            applicantId: "",
            isInstallments: false,
            issueDate: "",
            dueDate: "",
            addInvoiceItemDTOs: [
                {
                    description: "",
                    amount: 0,
                    quantity: 0
                }
            ]
        });
        setSelectedApplicantId(null)
        onClose()
    };

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'addInvoiceItemDTOs',
    })

    const onSubmit: SubmitHandler<AddInvoicePayload> = async () => {
        clearError();
        const values = form.getValues();
        const applicantId = String(values.applicantId ?? "").trim();

        if (!applicantId) {
            Toast.error("Please select applicant");
            return;
        }

        const payload = {
            applicantId: values.applicantId,
            isInstallments: false,
            issueDate: values.issueDate,
            dueDate: values.dueDate,
            addInvoiceItemDTOs: (values.addInvoiceItemDTOs ?? []).map(item => ({
                description: item.description,
                amount: Number(item.amount),
                quantity: Number(item.quantity),
            })),
        };

        await addInvoice.mutateAsync(payload);
        handleClose();
        onClose();
    };
    return (
        <div className=" inset-0 flex items-center justify-center  w-full h-full">
            <div className="w-full  h-[100%] bg-[#ffffff] dark:bg-[#27272a] p-4 overflow-auto relative dark:text-white ">
                <fieldset className="">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
                            Add Invoice
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

                            <AppCombobox
                                value={sellectedApplicantId}
                                dropDownWidth="w-full"
                                dropdownPositionClass="absolute z-20"
                                label="Applicant"
                                name="applicantId"
                                form={form}
                                required
                                options={allapplicant || []}
                                selected={
                                    allapplicant?.find(
                                        (g) => g.id === sellectedApplicantId
                                    ) || null
                                }
                                onSelect={(group) => {
                                    if (group) {
                                        const id = group.id ?? "";

                                        setSelectedApplicantId(id || null);

                                        form.setValue("applicantId", id, {
                                            shouldValidate: true,
                                        });
                                    } else {
                                        setSelectedApplicantId(null);

                                        form.setValue("applicantId", "", {
                                            shouldValidate: true,
                                        });
                                    }
                                }}
                                getLabel={(g) => g?.fullName ?? ""}
                                getValue={(g) => g?.id ?? ""}
                            />

                            <InputElement
                                label="IssueDate"
                                form={form}
                                name="issueDate"
                                inputType="date"
                                placeholder="Enter IssueDate"
                                required
                            />

                            <InputElement
                                label="DueDate"
                                form={form}
                                name="dueDate"
                                inputType="date"
                                placeholder="Enter DueDate"
                                required
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
                                            name={`addInvoiceItemDTOs.${index}.description`}
                                        />

                                        <InputElement
                                            label="Quantity"
                                            form={form}
                                            name={`addInvoiceItemDTOs.${index}.quantity`}
                                            inputType="number"
                                        />

                                        <InputElement
                                            label="Amount"
                                            form={form}
                                            name={`addInvoiceItemDTOs.${index}.amount`}
                                            inputType="number"
                                        />
                                    </div>
                                </div>
                            ))}
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

export default AddInvoiceForm;
