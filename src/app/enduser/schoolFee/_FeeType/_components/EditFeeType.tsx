"use client";
import { useEffect } from "react";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { X } from "lucide-react";
import { IFeeType } from "../types/IFeeType";
import { useEditFeeType, useGetFeeTypeById } from "../hooks";
import toast from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";

type Props = {
  form: UseFormReturn<IFeeType>;
  feeTypeId: string;
  onClose: () => void;
};

const EditFeeTypeForm = ({ form, feeTypeId, onClose }: Props) => {
  const editFeeType = useEditFeeType();
  const { handleError, clearError } = useErrorHandler();
  const { data: feeTypeData } = useGetFeeTypeById(feeTypeId);

  useEffect(() => {
    if (feeTypeData) {
      form.reset({
        id: feeTypeData.id,
        name: feeTypeData.name,
        description: feeTypeData.description,
        nameOfMonths: feeTypeData.nameOfMonths,
      });
    }
  }, [feeTypeData, form]);

  const handleClose = () => {
    form.reset();
    onClose();
  };

 const onSubmit: SubmitHandler<IFeeType> = async (data) => {
  clearError();
  try {
    await toast.promise(
      editFeeType.mutateAsync({
        id: feeTypeId,
        data: {
          name: data.name,
          description: data.description,
          nameOfMonths: data.nameOfMonths,
        },
      }),
      {
        loading: "Updating FeeType...",
        success: "Successfully updated FeeType",
      }
    );
    handleClose();
  } catch (error: any) {
    console.log("Full error object:", error);         // 👈 add this
    console.log("Error response:", error?.response);  // 👈 and this
    const errorMsg = error?.response?.data?.[0] ?? error?.message ?? "Something went wrong";
    Toast.error(errorMsg);
  }
};
  return (
    <div className="inset-0 flex items-center justify-center w-full h-full">
      <div className="w-full h-[100%] bg-[#ffffff] dark:bg-[#27272a] p-4 overflow-auto relative dark:text-white">
        <fieldset className="space-y-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-50">
              Edit FeeType
            </h1>
            <button
              type="button"
              onClick={handleClose}
              className="text-red-400 text-3xl hover:text-red-500 transition-transform transform hover:scale-110"
            >
              <X strokeWidth={3} />
            </button>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-center">
              <InputElement
                label="Name"
                form={form}
                name="name"
                placeholder="Enter Name of FeeType"
                required
              />
              <InputElement
                label="Description"
                form={form}
                name="description"
                placeholder="Enter Description"
              />
            </div>
            <div className="flex justify-center mt-8">
              <ButtonElement
                type="submit"
                text="Update"
                className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg shadow-md transition-all"
              />
            </div>
          </form>
        </fieldset>
      </div>
    </div>
  );
};

export default EditFeeTypeForm;