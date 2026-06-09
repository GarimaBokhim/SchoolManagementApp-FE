"use client";
import { useForm } from "react-hook-form";
import { AddInquiryPayload } from "../types/IVisitors";
//import { SubjectValidator } from "../validators/index";
import AddLeadForm from "../components/AddInquiryForm";
import AddInquiryForm from "../components/AddInquiryForm";

interface Props {
    visible: boolean;
    onClose?: () => void;
}
const AddInquiry = ({ visible, onClose }: Props) => {
    const form = useForm<AddInquiryPayload>({
        defaultValues: {
            fullName: "",
            email: "",
            dateOfBirth: "",
            gender: 0,
            contactNumber: "",
            permanentAddress: "",

            educationLevel: 0,
            englishProficiency: 0,
            bandScore: 0,
            languageRemarks: "",

            skillOrTrainingName: "",
            institutionName: "",
            trainingRemarks: "",
            trainingStartDate: "",
            trainingEndDate: "",

            completionYear: "",
            currentGpa: "",
            previousAcademicQualification: "",
            source: "",
            feedBackOrSuggestion: "",

            countries: []
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
                <AddInquiryForm form={form} onClose={handleOnClose} />
            </div>
        </div>
    );
};
export default AddInquiry;
