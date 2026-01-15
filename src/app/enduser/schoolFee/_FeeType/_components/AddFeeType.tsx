"use client";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";

import { X } from "lucide-react";
import { IFeeType } from "../types/IFeeType";
import { useAddFeeType } from "../hooks";
import toast from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { AppCombobox } from "@/components/Input/ComboBox";
import { useState } from "react";
type Props = {
  form: UseFormReturn<IFeeType>;
  onClose: () => void;
};
const AddFeeTypeForm = ({ form, onClose }: Props) => {
  const addFeeType = useAddFeeType();
  const { handleError, clearError } = useErrorHandler();
  // const [months, setMonths] = useState(0);
  const handleClose = () => {
    form.reset();
    onClose();
  };
  const onSubmit: SubmitHandler<IFeeType> = async (data) => {
    clearError();
    try {
      await toast.promise(addFeeType.mutateAsync(data), {
        loading: "Adding FeeType...",
        success: "Successfully added FeeType",
      });
      handleClose();
    } catch (error) {
      const errorMsg = handleError(error);
      Toast.error(errorMsg);
    }
  };

  return (
    <div className=" inset-0 flex items-center justify-center  w-full h-full">
      <div className="w-full  h-[100%] bg-[#ffffff] dark:bg-[#27272a] p-4 overflow-auto relative dark:text-white ">
        <fieldset className="space-y-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-50">
              Add FeeType
            </h1>
            <button
              type="button"
              onClick={onClose}
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
                text="Submit"
                className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg shadow-md transition-all"
              />
            </div>
          </form>
        </fieldset>
      </div>
    </div>
  );
};

export default AddFeeTypeForm;
