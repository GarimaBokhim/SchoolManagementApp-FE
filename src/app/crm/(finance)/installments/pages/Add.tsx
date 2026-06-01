"use client";
import { useForm } from "react-hook-form";
import { AddInstallmentPlanPayload } from "../types/IInstallments";
//import { SubjectValidator } from "../validators/index";
import AddInstallmentPlanForm from "../components/AddInstallmentPlanModel";

interface Props {
    visible: boolean;
    onClose?: () => void;
    invoiceId: string;
    applicantId: string;
    onSuccess?: () => void;
}
const AddInstallmentPlan = ({ visible, onClose, onSuccess, applicantId, invoiceId }: Props) => {
    const form = useForm<AddInstallmentPlanPayload>({
        defaultValues: {
            applicantId: "",
            numberOfInstallments: 0,
            invoiceId: ""

        },

        // resolver: yupResolver(SubjectValidator),
    });
    const handleOnClose = () => {
        if (onClose) onClose();
    };
    if (!visible) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-start md:items-center justify-center 
             bg-black/40 backdrop-blur-sm ml-12 md:ml-64 sm:ml-16 xs:ml-0"
        >
            <div
                className="bg-[#FBFBFB] dark:bg-[#27272a] 
               w-full max-w-[95vw] md:max-w-[85vw] lg:max-w-[75vw] xl:max-w-[70vw]
               max-h-[95vh] md:max-h-[92vh] h-full 
               rounded-lg overflow-auto p-6 md:p-8 shadow-lg"
            >
                <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"></button>
                <AddInstallmentPlanForm form={form} onClose={handleOnClose} onSuccess={onSuccess} invoiceId={invoiceId} applicantId={applicantId} />
            </div>
        </div>
    );
};
export default AddInstallmentPlan;
