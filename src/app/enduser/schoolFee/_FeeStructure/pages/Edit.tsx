"use client";
import { useForm } from "react-hook-form";
import UpdateFeeStructureForm from "../_components/UpdateFeeStructure";
import { IFeeStructure } from "../types/IFeeStructure";
import { useGetFeeStructureById } from "../hooks";

interface Props {
  visible: boolean;
  onClose: () => void;
  feeStructure: IFeeStructure | null;
}

const UpdateFeeStructure = ({ visible, onClose, feeStructure }: Props) => {
  const form = useForm<IFeeStructure>({
    defaultValues: {
      id: "",
      classId: "",
      feeCategoryId: "",
      feeStructureDTOs: [],
    },
  });

  // Fetch the full record by ID so we get feeStructureDTOs (the list API omits them)
  const { data: fullRecord, isLoading } = useGetFeeStructureById(
    feeStructure?.id
  );

  if (!visible || !feeStructure) return null;

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
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            Loading fee structure details...
          </div>
        ) : (
          <UpdateFeeStructureForm
            form={form}
            onClose={onClose}
            feeStructureId={feeStructure.id!}
            initialData={fullRecord ?? feeStructure}
          />
        )}
      </div>
    </div>
  );
};

export default UpdateFeeStructure;