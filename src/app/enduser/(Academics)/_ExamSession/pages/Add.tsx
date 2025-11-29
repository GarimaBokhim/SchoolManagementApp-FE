import { useForm } from "react-hook-form";
import { IExamSession } from "../types/IExamSession";
import AddExamSessionForm from "../components/AddExamSessionForm";

interface Props {
  visible: boolean;
  onClose?: () => void;
}
const AddExamSession = ({ visible, onClose }: Props) => {
  const form = useForm<IExamSession>({
    defaultValues: {
      id: "",
      name: "",
      examDate: new Date(),
      examHallDTOs: [],
    },

    // resolver: yupResolver(ExamSessionValidator),
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
        <AddExamSessionForm form={form} onClose={handleOnClose} />
      </div>
    </div>
  );
};
export default AddExamSession;
