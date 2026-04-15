"use client";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import UpdateFeeStructureForm from "../_components/UpdateFeeStructure";
import { IFeeStructure } from "../types/IFeeStructure";

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

  // Reset form when feeStructure changes
  useEffect(() => {
    if (feeStructure) {
      form.reset({
        id: feeStructure.id,
        classId: feeStructure.classId,
        feeCategoryId: feeStructure.feeCategoryId,
        feeStructureDTOs: feeStructure.feeStructureDTOs,
      });
    }
  }, [feeStructure, form]);

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
        <UpdateFeeStructureForm
          form={form}
          onClose={onClose}
          feeStructureId={feeStructure.id!}
          initialData={feeStructure}
        />
      </div>
    </div>
  );
};

export default UpdateFeeStructure;