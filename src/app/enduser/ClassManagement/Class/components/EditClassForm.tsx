"use client";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { useEffect } from "react";
import { X } from "lucide-react";
import { IClass } from "../types/IClass";
import { useEditClass, useGetClassById } from "../hooks";
import toast from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
type Props = {
  form: UseFormReturn<IClass>;
  onClose: () => void;
  ClassId: string;
};
const EditClassForm = ({ form, onClose, ClassId }: Props) => {
  const editClass = useEditClass();
  const { handleError, clearError } = useErrorHandler();
  const { data: ClassData } = useGetClassById(ClassId);
  const handleClose = () => {
    form.reset();
  };
  useEffect(() => {
    if (ClassData) {
      form.reset({
        name: ClassData?.name ?? "",
      });
    }
  }, [ClassData]);
  const onSubmit: SubmitHandler<IClass> = async (data) => {
    clearError();

    try {
      clearError();
      await toast.promise(
        editClass.mutateAsync({
          id: ClassId,
          data: data,
        }),
        {
          loading: "Submitting Data",
          success: "Successfully Edited Income",
        }
      );
      handleClose();
    } catch (error) {
      const errorMsg = handleError(error);
      Toast.error(errorMsg);
    }
  };
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
        <fieldset className="">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
              Update Class
            </h1>
            <button
              type="button"
              onClick={onClose}
              className="text-red-400 text-2xl hover:text-red-500 "
            >
              <X strokeWidth={3} />
            </button>
          </div>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
              <InputElement
                label="Class Name"
                form={form}
                name="name"
                placeholder="Enter Name"
                required
              />
            </div>
            <div className="flex justify-center mt-6">
              <ButtonElement type="submit" text={"Submit"} />
            </div>
          </form>
        </fieldset>
      </div>
    </div>
  );
};

export default EditClassForm;
