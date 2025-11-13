"use client";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { ITemplate } from "../types/ITemplate";
import { useEditTemplate, useGetTemplateById } from "../hooks";
import toast from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
type Props = {
  form: UseFormReturn<ITemplate>;
  onClose: () => void;
  TemplateId: string;
};
const EditTemplateForm = ({ form, onClose, TemplateId }: Props) => {
  const editTemplate = useEditTemplate();
  const { handleError, clearError } = useErrorHandler();
  const { data: TemplateData } = useGetTemplateById(TemplateId);
  const handleClose = () => {
    form.reset();
  };

  useEffect(() => {
    if (TemplateData) {
      form.reset({
        templateName: TemplateData?.templateName ?? "",
        templateType: TemplateData?.templateType ?? "",
        htmlTemplate: TemplateData?.htmlTemplate ?? "",
        templateVersion: TemplateData?.templateVersion ?? "",
      });
    }
  }, [TemplateData]);
  const onSubmit: SubmitHandler<ITemplate> = async (data) => {
    clearError();

    try {
      clearError();
      await toast.promise(
        editTemplate.mutateAsync({
          id: TemplateId,
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
              Update Template
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
                label="Template Name"
                form={form}
                name="templateName"
                placeholder="Enter Template Name"
                required
              />
              <InputElement
                label="Template Type"
                form={form}
                name="templateType"
                placeholder="Enter Template Type"
                required
              />
              <InputElement
                label="html Template"
                form={form}
                name="htmlTemplate"
                placeholder="Enter Html Template"
                required
              />
              <InputElement
                label="Template Version"
                form={form}
                name="templateVersion"
                placeholder="Enter Template Version"
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

export default EditTemplateForm;
