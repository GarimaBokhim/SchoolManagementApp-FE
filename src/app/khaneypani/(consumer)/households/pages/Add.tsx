"use client";
import { useForm } from "react-hook-form";
import { AddHouseHoldsPayload } from "../types/IHouseHolds";
//import { SubjectValidator } from "../validators/index";
import AddHouseHoldsForm from "../components/AddHouseHoldsForm";

interface Props {
    visible: boolean;
    onClose?: () => void;
}
const AddHouseHoldses = ({ visible, onClose }: Props) => {
    const form = useForm<AddHouseHoldsPayload>({
        defaultValues: {
            consumerId: '',
            consumerName: '',
            meterNumber: '',
            familyMember: 0,
            contactNumber: '',
            email: '',
            provinceId: 0,
            districtId: 0,
            municipalityId: 0,
            vdcId: 0,
            wardnumber: 0,
            tole: '',
            registrationDate: ''

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
                <AddHouseHoldsForm form={form} onClose={handleOnClose} />
            </div>
        </div>
    );
};
export default AddHouseHoldses;
