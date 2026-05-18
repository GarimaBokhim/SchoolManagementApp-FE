'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { AddInvoicePayload } from '../types/IInvoice'
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { useAddInvoice, useGetAllApplicants } from "../hooks";
import toast from "react-hot-toast";
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
            paidAmount: 0,
            issueDate: "",
            dueDate: ""

        });
        setSelectedApplicantId(null);
    };

    const onSubmit: SubmitHandler<AddInvoicePayload> = async (data) => {
        clearError();
        const applicantId = String(data.applicantId ?? "").trim();
        if (!applicantId) {
            Toast.error("Please select applicant");
            return;
        }
        try {
            await addInvoice.mutateAsync({
                applicantId,
                paidAmount: data.paidAmount,
                issueDate: data.issueDate,
                dueDate: data.dueDate,
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

                            <InputElement
                                label="Paid Amount"
                                form={form}
                                name="paidAmount"
                                placeholder="Enter PaidAmount"
                                required
                            />

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
