import { useForm } from "react-hook-form";
import { UpdatePaymentsPayload } from "../types/IPayments";
import { useGetPaymentsById } from "../hooks";
import { useEffect } from "react";
import EditPaymentsForm from "../components/EditPaymentsForm";

interface Props {
    visible: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    PaymentsId: string;
}

const EditPayments = ({ visible, onClose, onSuccess, PaymentsId }: Props) => {
    const { data: paymentsData } = useGetPaymentsById(PaymentsId);

    const form = useForm<UpdatePaymentsPayload>({
        defaultValues: {
            applicantId: "",
            amount: 0,
            paymentDate: "",
            paymentMethod: 0
        },
    });

    // Reset form when StudentData changes
    useEffect(() => {
        if (paymentsData) {
            form.reset({
                applicantId: paymentsData?.applicantId ?? "",
                amount: paymentsData?.amount ?? "",
                paymentDate: paymentsData?.paymentDate ?? "",
                paymentMethod: paymentsData?.paymentMethod ?? ""

            });
        }
    }, [paymentsData, form]);

    if (!visible) return null;

    return (
        <EditPaymentsForm
            form={form}
            onClose={onClose}
            onSuccess={onSuccess}
            PaymentsId={PaymentsId} />
    );
};

export default EditPayments;