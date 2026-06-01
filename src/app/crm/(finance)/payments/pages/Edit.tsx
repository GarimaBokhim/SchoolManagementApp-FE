import { useForm } from "react-hook-form";
import { UpdatePaymentsPayload } from "../types/IPayments";
import { useGetPaymentsById } from "../hooks";
import { useEffect } from "react";
import EditPaymentsForm from "../components/EditPaymentsForm";

interface Props {
    visible: boolean;
    onClose: () => void;
    PaymentsId: string;
}

const EditPayments = ({ visible, onClose, PaymentsId }: Props) => {
    const { data: paymentsData } = useGetPaymentsById(PaymentsId);

    const form = useForm<UpdatePaymentsPayload>({
        defaultValues: {
            invoiceId: "",
            amount: 0,
            paymentDate: "",
            paymentMethod: 0
        },
    });

    const { reset } = form;

    useEffect(() => {
        if (paymentsData) {
            form.reset({
                invoiceId: paymentsData?.invoiceId ?? "",
                amount: paymentsData?.amount ?? "",
                paymentDate: paymentsData?.paymentDate ?? "",
                paymentMethod: paymentsData?.paymentMethod ?? ""

            });
        }
    }, [paymentsData, reset]);

    if (!visible) return null;

    return (
        <EditPaymentsForm
            form={form}
            onClose={onClose}
            PaymentsId={PaymentsId} />
    );
};

export default EditPayments;