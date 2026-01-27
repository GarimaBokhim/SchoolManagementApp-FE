"use client";

import { InputElement } from "@/components/Input/InputElement";
import TextEditor from "@/components/Input/TextEditor";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { X } from "lucide-react";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { INotice } from "../types/INotice";
import toast from "react-hot-toast";
import { Toast } from "@/components/Toast/toast";
import { useAddNotice } from "../hooks";
import useErrorHandler from "@/components/helpers/ErrorHandling";
type Props = {
  onClose?: () => void;
  form: UseFormReturn<INotice>;
};

const AddNoticeForm = ({ onClose, form }: Props) => {
  const addNotice = useAddNotice();
  const { handleError, clearError } = useErrorHandler();
  const { setValue, watch } = form;
  const details = watch("contentHtml");
  const handleClose = () => {
    form.reset();
    if(onClose)onClose()
  };
  const onSubmit: SubmitHandler<INotice> = async (data) => {
    clearError();
    try {
      await toast.promise(addNotice.mutateAsync(data), {
        loading: "Adding Parent...",
        success: "Successfully added Parent",
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
        <div className="flex justify-between items-center px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
          <h1 className="text-xl font-semibold">Add Notice</h1>

          <button
            type="button"
            onClick={onClose}
            className="text-neutral-500 hover:text-red-500 transition"
          >
            <X strokeWidth={2.5} size={24} />
          </button>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <InputElement
                form={form}
                label="Title"
                name="title"
                placeholder="Course title"
                required
              />
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-1 ">
              <InputElement
                form={form}
                label="Short Description"
                name="shortDescription"
                placeholder="Course ShortDescription"
                required
              />
            </div>
            <div className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 col-span-1 md:col-span-2 lg:col-span-3 shadow-inner ">
              <label className="block mb-2 font-medium text-sm">Details</label>
              <TextEditor
                content={details}
                onChange={(content) => setValue("contentHtml", content)}
              />
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <ButtonElement type="submit" className="px-6 py-2" text="Submit" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNoticeForm;
