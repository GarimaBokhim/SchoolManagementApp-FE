"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { UpdateInstallmentPaymentsPayload } from "../types/IInstallmentPayments";
import EditInstallmentPaymentsForm from "../components/EditInstallmentPaymentsForm";
import { useGetInstallmentPaymentsById } from "../hooks";

interface Props {
    visible: boolean;
    onClose: () => void;
    PaymentsId: string;
}

const EditInstallmentPayments = ({ visible, onClose, PaymentsId }: Props) => {
    const { data: InstallmentPayment } = useGetInstallmentPaymentsById(PaymentsId);

    const form = useForm<UpdateInstallmentPaymentsPayload>({
        defaultValues: {
            invoiceId: "",
            amount: 0,
            paymentDate: "",
            paymentMethod: 0
        },
    });


    const { reset } = form;

    useEffect(() => {
        if (InstallmentPayment) {
            form.reset({
                invoiceId: InstallmentPayment?.invoiceId ?? "",
                amount: InstallmentPayment?.amount ?? "",
                paymentDate: InstallmentPayment?.paymentDate ?? "",
                paymentMethod: InstallmentPayment?.paymentMethod ?? ""

            });
        }
    }, [InstallmentPayment, form]);

    if (!visible) return null;

    return (
        <EditInstallmentPaymentsForm
            form={form}
            onClose={onClose}
            PaymentsId={PaymentsId}
        />
    );
};

export default EditInstallmentPayments;