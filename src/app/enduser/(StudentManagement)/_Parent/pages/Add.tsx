"use client";
import { useForm } from "react-hook-form";
import { IParent } from "../types/IParents";
import AddParentForm from "../components/AddParentForm";

interface Props {
  visible: boolean;
  onClose?: () => void;
  onSuccess?: (parent: IParent) => void;
}
const AddParent = ({ visible, onClose, onSuccess }: Props) => {
  const form = useForm<IParent>({
    defaultValues: {
      id: "",
      fullName: "",
      parentType: 0,
      email: "",
      phoneNumber: "",
      imageUrl: "",
      address: "",
    },

    // resolver: yupResolver(ParentValidator),
  });
  const handleOnClose = () => {
    if (onClose) onClose();
  };
  const handleOnSuccess = (parent: IParent) => {
    onSuccess?.(parent);
    handleOnClose();
  };
  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start md:items-center justify-center
             bg-black/40 backdrop-blur-sm ml-12 md:ml-64 sm:ml-16 xs:ml-0"
    >
      <div
        className="bg-[#FBFBFB] dark:bg-[#27272a] 
               w-full max-w-[95vw] md:max-w-[85vw] lg:max-w-[75vw] xl:max-w-[70vw]
               max-h-[95vh] md:max-h-[92vh] h-full 
               rounded-lg overflow-auto p-6 md:p-8 shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-parent-title"
      >
        <AddParentForm
          form={form}
          onClose={handleOnClose}
          onSuccess={handleOnSuccess}
        />
      </div>
    </div>
  );
};
export default AddParent;
