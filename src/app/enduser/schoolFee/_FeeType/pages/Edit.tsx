"use client";
import { useForm } from "react-hook-form";
import EditFeeTypeForm from "../_components/EditFeeType";
import { IFeeType } from "../types/IFeeType";

interface Props {
  visible: boolean;
  feeTypeId: string;
  onClose?: () => void;
}

const EditFeeType = ({ visible, feeTypeId, onClose }: Props) => {
  const form = useForm<IFeeType>({
    defaultValues: {
      id: "",
      name: "",
      description: "",
      nameOfMonths: 0,
    },
  });

  const handleOnClose = () => {
    if (onClose) onClose();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center 
             bg-black/40 backdrop-blur-sm ml-12 md:ml-64 sm:ml-16 xs:ml-0">
      <div className="bg-[#FBFBFB] dark:bg-[#27272a] 
               w-full max-w-[95vw] md:max-w-[85vw] lg:max-w-[75vw] xl:max-w-[70vw]
               max-h-[95vh] md:max-h-[92vh] h-full 
               rounded-lg overflow-auto p-6 md:p-8 shadow-lg">
        <EditFeeTypeForm form={form} feeTypeId={feeTypeId} onClose={handleOnClose} />
      </div>
    </div>
  );
};

export default EditFeeType;