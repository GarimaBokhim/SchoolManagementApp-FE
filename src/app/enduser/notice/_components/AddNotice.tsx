"use client";

import { useEffect } from "react";
import { InputElement } from "@/components/Input/InputElement";
import TextEditor from "@/components/Input/TextEditor";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { X } from "lucide-react";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { INotice } from "../types/INotice";
import toast from "react-hot-toast";
import { Toast } from "@/components/Toast/toast";
import { useAddNotice, useUpdateNotice } from "../hooks";
import useErrorHandler from "@/components/helpers/ErrorHandling";

type Props = {
  onClose?: () => void;
  form: UseFormReturn<INotice>;
  noticeToEdit?: INotice | null;
};

const AddNoticeForm = ({ onClose, form, noticeToEdit }: Props) => {
  const addNotice = useAddNotice();
  const updateNotice = useUpdateNotice();
  const isEditing = !!noticeToEdit;
  const { handleError, clearError } = useErrorHandler();
  const { setValue, watch } = form;
  const details = watch("contentHtml");

  useEffect(() => {
    if (noticeToEdit) {
      form.reset({
        title: noticeToEdit.title,
        shortDescription: noticeToEdit.shortDescription,
        contentHtml: noticeToEdit.contentHtml,
        publishStatus: noticeToEdit.publishStatus,
      });
    } else {
      form.reset({
        title: "",
        shortDescription: "",
        contentHtml: "",
      });
    }
  }, [noticeToEdit]);

  const handleClose = () => {
    form.reset();
    if (onClose) onClose();
  };

  const onSubmit: SubmitHandler<INotice> = async (data) => {
    clearError();
    try {
      if (isEditing) {
        await toast.promise(
          updateNotice.mutateAsync({
            id: noticeToEdit.id as string,
            title: data.title,
            contentHtml: data.contentHtml,
            shortDescription: data.shortDescription,
          
          }),
          {
            loading: "Updating Notice...",
            success: "Notice updated successfully",
          }
        );
      } else {
        await toast.promise(addNotice.mutateAsync(data), {
          loading: "Adding Notice...",
          success: "Notice added successfully",
        });
      }
      handleClose();
    } catch (error) {
      const errorMsg = handleError(error);
      Toast.error(errorMsg);
    }
  };

  return (
    <div className="inset-0 flex items-center justify-center w-full h-full">
      <div className="w-full h-[100%] bg-[#ffffff] dark:bg-[#27272a] p-4 overflow-auto relative dark:text-white">
        <div className="flex justify-between items-center px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
          <h1 className="text-xl font-semibold">
            {isEditing ? "Edit Notice" : "Add Notice"}
          </h1>
          <button
            type="button"
            onClick={handleClose}
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
                placeholder="Notice title"
                required
              />
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <InputElement
                form={form}
                label="Short Description"
                name="shortDescription"
                placeholder="Notice short description"
                required
              />
            </div>
            <div className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 col-span-1 md:col-span-2 lg:col-span-3 shadow-inner">
              <label className="block mb-2 font-medium text-sm">Details</label>
              <TextEditor
                content={details}
                onChange={(content) => setValue("contentHtml", content)}
              />
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <ButtonElement
              type="submit"
              className="px-6 py-2"
              text={isEditing ? "Update" : "Submit"}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNoticeForm;