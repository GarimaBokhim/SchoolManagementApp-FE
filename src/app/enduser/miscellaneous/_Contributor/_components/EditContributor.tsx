"use client";
import { useEffect } from "react";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { X } from "lucide-react";
import { IContributor } from "../types/IContributor";
import { useEditContributor, useGetContributorById } from "../hooks";
import toast from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";

type Props = {
  form: UseFormReturn<IContributor>;
  contributorId: string;
  onClose: () => void;
};

const EditContributorForm = ({ form, contributorId, onClose }: Props) => {
  const editContributor = useEditContributor();
  const { handleError, clearError } = useErrorHandler();
  const { data: contributorData } = useGetContributorById(contributorId);

  useEffect(() => {
    if (contributorData) {
      form.reset({
        id: contributorData.id,
        name: contributorData.name,
        organization: contributorData.organization,
        contactNumber: contributorData.contactNumber,
        email: contributorData.email,
      });
    }
  }, [contributorData, form]);

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const onSubmit: SubmitHandler<IContributor> = async (data) => {
    clearError();
    try {
      await toast.promise(
        editContributor.mutateAsync({
          id: contributorId,
          data: {
            name: data.name,
            organization: data.organization,
            contactNumber: data.contactNumber,
            email: data.email,
          },
        }),
        {
          loading: "Updating Contributor...",
          success: "Successfully updated Contributor",
        }
      );
      handleClose();
    } catch (error) {
      const errorMsg = handleError(error);
      Toast.error(errorMsg);
    }
  };

  return (
    <div className="inset-0 flex items-center justify-center w-full h-full">
      <div className="w-full h-[100%] bg-[#ffffff] dark:bg-[#27272a] p-4 overflow-auto relative dark:text-white">
        <fieldset className="space-y-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-50">
              Edit Contributor
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
              <InputElement
                label="Name"
                form={form}
                name="name"
                placeholder="Enter Name of Contributor"
                required
              />
              <InputElement
                label="Email"
                form={form}
                name="email"
                type="email"
                placeholder="Enter Email"
              />
              <InputElement
                label="Contact Number"
                form={form}
                name="contactNumber"
                required
                placeholder="Enter Contact Number"
              />
              <InputElement
                label="Organization Name"
                form={form}
                name="organization"
                required
                placeholder="Enter Organization Name"
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

export default EditContributorForm;
