"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { UpdateInvoicePayload } from "../types/IInvoice";
import EditInvoiceForm from "../components/EditInvoiceForm";
import { useInvoiceById } from "../hooks";

interface Props {
    visible: boolean;
    onClose: () => void;
    InvoiceId: string;
}

const EditInvoice = ({ visible, onClose, InvoiceId }: Props) => {
    const { data: InvoiceData } = useInvoiceById(InvoiceId);

    const form = useForm<UpdateInvoicePayload>({
        defaultValues: {
            id: "",
            applicantId: "",
            issueDate: "",
            dueDate: "",
            updateInvoiceItemDTOs: [
                {
                    id: "",
                    description: "",
                    amount: 0,
                    quantity: 0,
                },
            ],
        },
    });

    const { reset } = form;

    useEffect(() => {
        if (!InvoiceData) return;

        reset({
            id: InvoiceData.id ?? "",
            applicantId: InvoiceData.applicantId ?? "",
            issueDate: InvoiceData.issueDate ?? "",
            dueDate: InvoiceData.dueDate ?? "",

            updateInvoiceItemDTOs:
                InvoiceData.InvoiceItemsDTOs?.map((item: any) => ({
                    id: item.id ?? "",
                    description: item.description ?? "",
                    amount: item.amount ?? 0,
                    quantity: item.quantity ?? 0,
                })) ?? [],
        });
    }, [InvoiceData, reset]);

    if (!visible) return null;

    return (
        <EditInvoiceForm
            form={form}
            onClose={onClose}
            InvoiceId={InvoiceId}
        />
    );
};

export default EditInvoice;