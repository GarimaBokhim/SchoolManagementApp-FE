"use client";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { IModules, IAppName } from "../types/IModules";
import { useAddModule, useGetAppNames } from "../hooks";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { AxiosError } from "axios";
import { InputElement } from "@/components/Input/InputElement";
import { AppCombobox } from "@/components/Input/ComboBox";
import { X } from "lucide-react";
import { useState } from "react";

type Props = {
  form: UseFormReturn<IModules>;
  onClose: () => void;
};

const AddModuleForm = ({ form, onClose }: Props) => {
  const addModule = useAddModule();
  const { data: appNames, isLoading: appNamesLoading } = useGetAppNames();
  const [selectedApp, setSelectedApp] = useState<IAppName | null>(null);

  const onSubmit: SubmitHandler<IModules> = async (data) => {
    try {
      await addModule.mutateAsync(data);
      Toast.success("Module added successfully!");
      onClose();
    } catch (error: AxiosError | unknown) {
      if (error instanceof AxiosError) {
        Toast.error(error.response?.data || "Failed to add module");
      } else {
        Toast.error("Failed to add module: " + error);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/30 backdrop-blur-sm z-50">
      <div className="w-full max-w-md mx-4">
        <fieldset className="bg-white dark:bg-[#353535] rounded-xl shadow-xl p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
              Add Module
            </h1>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <X size={24} strokeWidth={3} color="red" />
            </button>
          </div>

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

            <AppCombobox<IAppName>
              label="Application"
              required
              name="appId"
              form={form}
              options={appNames ?? []}
              selected={selectedApp ?? undefined}
              disabled={appNamesLoading}
              placeholder={
                appNamesLoading ? "Loading apps..." : "Search application..."
              }
              getLabel={(app) => app.Name}
              getValue={(app) => app.Id}
              onSelect={(app) => {
                setSelectedApp(app);
                form.setValue("appId", app ? app.Id : "", {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }}
            />

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

            <div className="flex justify-center mt-4">
              <ButtonElement
                type="submit"
                text="Submit"
                isLoading={addModule.isPending}
              />
            </div>
          </form>
        </fieldset>
      </div>
    </div>
  );
};

export default AddModuleForm;