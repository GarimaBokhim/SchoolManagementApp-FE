"use client";
import { useForm } from "react-hook-form";
import EditSchoolItemForm from "../_components/EditSchoolItem";
import { ISchoolItem } from "../types/ISchoolItem";

interface Props {
  visible: boolean;
  schoolItemId: string;
  onClose?: () => void;
}

const EditSchoolItem = ({ visible, schoolItemId, onClose }: Props) => {
  const form = useForm<ISchoolItem>({
    defaultValues: {
      id: "",
      name: "",
      contributorId: "",
      itemStatus: 0,
      itemCondition: 0,
      receivedDate: new Date(),
      estimatedValue: 0,
      quantity: 0,
      unitType: 0,
      fiscalYearId: "",
    },
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
        <EditSchoolItemForm
          form={form}
          schoolItemId={schoolItemId}
          onClose={handleOnClose}
        />
      </div>
    </div>
  );
};

export default EditSchoolItem;
