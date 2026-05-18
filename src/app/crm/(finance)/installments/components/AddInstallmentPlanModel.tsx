'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { AddInstallmentPlanPayload } from '../types/IInstallments'
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { useAddInstallmentsPlan, useGetAllApplicants } from "../hooks";
import toast from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { AppCombobox } from "@/components/Input/ComboBox";

type Props = {
  form: UseFormReturn<AddInstallmentPlanPayload>;
  onClose: () => void;
};
const AddInstallmentPlanForm = ({ form, onClose }: Props) => {
  const addInstallmentPlan = useAddInstallmentsPlan();
  const { handleError, clearError } = useErrorHandler();
  const { data: allapplicant } = useGetAllApplicants();

  const [sellectedApplicantId, setSelectedApplicantId] = useState<string | null>("");
  const handleClose = () => {
    form.reset({
      applicantId: "",
      numberOfInstallments: 0

    });
    setSelectedApplicantId(null);
  };

  const onSubmit: SubmitHandler<AddInstallmentPlanPayload> = async (data) => {
    clearError();
    const applicantId = String(data.applicantId ?? "").trim();
    if (!applicantId) {
      Toast.error("Please select applicant");
      return;
    }
    try {
      await toast.promise(
        addInstallmentPlan.mutateAsync({
          applicantId,
          numberOfInstallments: data.numberOfInstallments
        }),
        {
          loading: "Adding InstallmentPlan...",
          success: "Successfully added InstallmentPlan",
        }
      );
      handleClose();
      onClose();
    } catch (error) {
      const errorMsg = handleError(error);
      Toast.error(errorMsg);
    }
  };
  return (
    <div className=" inset-0 flex items-center justify-center  w-full h-full">
      <div className="w-full  h-[100%] bg-[#ffffff] dark:bg-[#27272a] p-4 overflow-auto relative dark:text-white ">
        <fieldset className="">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
              Add InstallmentPlan
            </h1>
            <button
              type="button"
              onClick={() => {
                handleClose();
                onClose();
              }}
              className="text-red-400 text-2xl hover:text-red-500"
            >
              <X strokeWidth={3} />
            </button>
          </div>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">

              <InputElement
                label="Number Of installments"
                form={form}
                name="numberOfInstallments"
                placeholder="Enter numberOfInstallments"
                required
              />

              <AppCombobox
                value={sellectedApplicantId}
                dropDownWidth="w-full"
                dropdownPositionClass="absolute z-20"
                label="Applicant"
                name="applicantId"
                form={form}
                required
                options={allapplicant || []}
                selected={
                  allapplicant?.find(
                    (g) => g.id === sellectedApplicantId
                  ) || null
                }
                onSelect={(group) => {
                  if (group) {
                    const id = group.id ?? "";

                    setSelectedApplicantId(id || null);

                    form.setValue("applicantId", id, {
                      shouldValidate: true,
                    });
                  } else {
                    setSelectedApplicantId(null);

                    form.setValue("applicantId", "", {
                      shouldValidate: true,
                    });
                  }
                }}
                getLabel={(g) => g?.fullName ?? ""}
                getValue={(g) => g?.id ?? ""}
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

export default AddInstallmentPlanForm;
