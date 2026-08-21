"use client";
import { useForm } from "react-hook-form";
import { AddWaterIncomePayload, WaterIncomeResponse } from "../types/IWaterIncome";
import AddWaterIncomeForm from "../components/AddWaterIncomeForm";

interface Props {
    visible: boolean;
    onClose?: () => void;
    waterIncome?: WaterIncomeResponse | null;
}
const AddWaterIncome = ({ visible, onClose, waterIncome }: Props) => {
    const form = useForm<AddWaterIncomePayload>({
        defaultValues: {
            incomeDate: waterIncome?.incomeDate ?? "",
            waterincomeSourceId: waterIncome?.waterincomeSourceId ?? "",
            amount: waterIncome?.amount ?? 0,
            paymentMethods: waterIncome?.paymentMethods ?? 0,
            description: waterIncome?.description ?? "",


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
                <AddWaterIncomeForm
                    form={form}
                    onClose={handleOnClose}
                    waterIncome={waterIncome}
                />
            </div>
        </div>
    );
};
export default AddWaterIncome;
