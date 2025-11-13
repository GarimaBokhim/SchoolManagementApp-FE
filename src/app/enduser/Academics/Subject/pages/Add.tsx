"use client";
import { useForm } from "react-hook-form";
import { ISubject } from "../types/ISubjects";
import { yupResolver } from "@hookform/resolvers/yup";
// import { SubjectValidator } from "../validators/index";
import AddSubjectForm from "../components/AddSubjectForm";

interface Props {
  visible: boolean;
  onClose?: () => void;
}
const AddSubject = ({ visible, onClose }: Props) => {
  const form = useForm<ISubject>({
    defaultValues: {
      id: "",
      name: "",
      code: "",
      creditHours: 0,
      description: "",
      classId: "",
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
        <AddSubjectForm form={form} onClose={handleOnClose} />
      </div>
    </div>
  );
};
export default AddSubject;
