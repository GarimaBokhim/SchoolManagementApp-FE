"use client";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { useEditModule, useGetModulesById } from "../hooks";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { X } from "lucide-react";

// ✅ FORM TYPE (camelCase)
type ModuleFormValues = {
  name: string;
  description: string;
  targetUrl: string;
  iconUrl: string;
  rank: string;
  appId: string;
  isActive: boolean;
};

type Props = {
  form: UseFormReturn<ModuleFormValues>;
  moduleId: string;
  onClose: () => void;
};

const EditModuleForm = ({ form, onClose, moduleId }: Props) => {
  const editModule = useEditModule();
  const { data: moduleData } = useGetModulesById(moduleId);

  // ✅ SUBMIT (transform to API format)
  const onSubmit: SubmitHandler<ModuleFormValues> = async (data) => {
    try {
      const moduleRequest = {
        name: data.name,
        description: data.description,
        targetUrl: data.targetUrl,
        isActive: data.isActive,
        iconUrl: data.iconUrl,
        rank: data.rank,
        appId: data.appId,
      };

      await editModule.mutateAsync({
        id: moduleId,
        data: moduleRequest,
      });

      Toast.success("Successfully Updated Module");
      onClose();
    } catch (error: AxiosError | unknown) {
      if (error instanceof AxiosError) {
        Toast.error(error.response?.data || "Update failed");
      } else {
        Toast.error("Failed to update module");
      }
    }
  };

  // ✅ MAP API → FORM
  useEffect(() => {
    if (moduleData) {
      form.reset({
        name: moduleData.Name ?? "",
        description: moduleData.Description ?? "",
        targetUrl: moduleData.TargetUrl ?? "",
        iconUrl: moduleData.IconUrl ?? "",
        rank: moduleData.Rank ?? "",
        appId: moduleData.AppId ?? "",
        isActive: moduleData.IsActive ?? false,
      });
    }
  }, [moduleData, form]);

  return (
    <div className="fixed inset-0 z-50 ml-13 md:ml-64 sm:ml-16 xs:ml-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-2">
      <div className="w-full max-w-md">
        <fieldset className="bg-white dark:bg-[#353535] rounded-xl shadow-xl p-6 border border-gray-200">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
              Update Module
            </h1>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <X size={24} strokeWidth={3} color="red" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            <InputElement
              label="Name"
              layout="column"
              form={form}
              name="name"
              placeholder="Enter module name"
            />

            <InputElement
              label="Description"
              layout="column"
              form={form}
              name="description"
              placeholder="Enter description"
            />

            <InputElement
              label="Target URL"
              layout="column"
              form={form}
              name="targetUrl"
              placeholder="Enter target URL"
            />

            <InputElement
              label="Icon URL"
              layout="column"
              form={form}
              name="iconUrl"
              placeholder="Enter icon URL"
            />

            <InputElement
              label="Rank"
              layout="column"
              form={form}
              name="rank"
              placeholder="Enter rank"
            />

            {/* Checkbox */}
            <div className="flex items-center space-x-2">
              <InputElement
                label=""
                layout="column"
                form={form}
                inputTypeCheckBox="checkbox"
                name="isActive"
                customStyle="!border-0 after:!content-none"
              />
              <p className="ml-4">Is Active</p>
            </div>

            {/* Submit */}
            <div className="flex justify-center mt-4">
              <ButtonElement type="submit" text="Update" />
            </div>

          </form>
        </fieldset>
      </div>
    </div>
  );
};

export default EditModuleForm;