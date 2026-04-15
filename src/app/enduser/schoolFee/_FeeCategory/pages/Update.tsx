"use client";

import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { IFeeCategory } from "../types/IFeeCatory";
import UpdateFeeCategoryForm from "../components/UpdateFeeCategory";


type Props = {
  visible: boolean;
  onClose: () => void;
  feeCategory: IFeeCategory | null;
};

const UpdateFeeCategory = ({ visible, onClose, feeCategory }: Props) => {
  const form = useForm<IFeeCategory>({
    defaultValues: {
      name: "",
      description: "",
      fyId: "",
      isActive: true,
    },
  });

  // Reset form when feeCategory changes
  useEffect(() => {
    if (feeCategory) {
      form.reset({
        name: feeCategory.name,
        description: feeCategory.description,
        fyId: feeCategory.fyId || "",
        isActive: feeCategory.isActive ?? true,
      });
    }
  }, [feeCategory, form]);

  if (!visible || !feeCategory) return null;

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
        <UpdateFeeCategoryForm 
          form={form} 
          onClose={onClose} 
          feeCategoryId={feeCategory.id!} 
        />
      </div>
    </div>
  );
};

export default UpdateFeeCategory;