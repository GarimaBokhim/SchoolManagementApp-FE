import { useForm } from "react-hook-form";
import { UpdateInstallmentPlanPayload } from "../types/IInstallments";
import { useGetInstallmentPlanById } from "../hooks";
import { useEffect } from "react";
import EditInstallmentPlanForm from "../components/EditInstallmentPlanForm";

interface Props {
    visible: boolean;
    onClose: () => void;
    InstallmentPlanId: string;
}

const EditInstallmentPlan = ({ visible, onClose, InstallmentPlanId }: Props) => {
    const { data: installmentPlanData } = useGetInstallmentPlanById(InstallmentPlanId);

    const form = useForm<UpdateInstallmentPlanPayload>({
        defaultValues: {
            numberOfInstallments: 0,
            invoiceId: ""
        },
    });

    const { reset } = form;

    useEffect(() => {
        if (installmentPlanData) {
            form.reset({
                numberOfInstallments: installmentPlanData.numberOfInstallments ?? 0,
                invoiceId: installmentPlanData?.invoiceId ?? "",

            });
        }
    }, [installmentPlanData, reset, form]);

    if (!visible) return null;

    return (
        <EditInstallmentPlanForm
            form={form}
            onClose={onClose}
            InstallmentPlanId={InstallmentPlanId} />
    );
};

export default EditInstallmentPlan;