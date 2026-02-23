/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { ILedgerGroup } from "../types/ILedgerGroup";
import { useEditLedgerGroup, useGetLedgerGroupById } from "../hooks";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { AppCombobox } from "@/components/Input/ComboBox";
import toast, { Toaster } from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { Toast } from "@/components/Toast/toast";
import { X } from "lucide-react";
import { useGetAllMaster } from "../../_Master/hooks";
type Props = {
  form: UseFormReturn<ILedgerGroup>;
  LedgerGroupId: string;
  onClose: () => void;
};
const EditLedgerGroupForm = ({ form, onClose, LedgerGroupId }: Props) => {
  const editLedgerGroup = useEditLedgerGroup();
  const { data: Masters } = useGetAllMaster();
  const { data: LedgerGroupData } = useGetLedgerGroupById(LedgerGroupId);
  const [selectedMasterId, setSelectedMasterId] = useState("");
  const handleClose = () => {
    onClose();
    setSelectedMasterId("");
  };
  const { handleError, clearError } = useErrorHandler();
  const onSubmit: SubmitHandler<ILedgerGroup> = async (data) => {
    clearError();
    form.reset();
    try {
      await toast.promise(
        editLedgerGroup.mutateAsync({
          id: LedgerGroupId,
          data: data,
        }),
        {
          loading: "Submitting data",
          success: "Successfully Updated LedgerGroup",
        }
      );
      handleClose();
    } catch (error: AxiosError | unknown) {
      if (error instanceof AxiosError) {
        console.log("Error Response:", error.response);
      }
      const errorMsg = handleError(error);
      Toast.error(errorMsg);
    }
  };
  useEffect(() => {
    if (LedgerGroupData) {
      form.reset({
        id: LedgerGroupData?.id ?? "",
        name: LedgerGroupData?.name ?? "",
        masterId: LedgerGroupData?.masterId ?? "",
      });
      if (LedgerGroupData?.masterId) {
        setSelectedMasterId(LedgerGroupData?.masterId);
      }
    }
  }, [LedgerGroupData, form]);
  return (
    <>
      <Toaster position="top-right" />

      <div className="w-full h-full p-4 bg-white dark:bg-[#27272a] overflow-auto rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          {/* HEADER */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-50">
              Add LedgerGroup
            </h1>
            <button
              type="button"
              onClick={handleClose}
              className="text-red-400 text-3xl hover:text-red-500 transition-transform transform hover:scale-110"
            >
              <X strokeWidth={3} />
            </button>
          </div>

          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-100 border-b pb-2">
              LedgerGroup Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex pt-1 flex-col">
                <InputElement
                  required
                  label="Name"
                  layout="column"
                  form={form}
                  name="name"
                  placeholder="Enter LedgerGroup name"
                />
              </div>
              <AppCombobox
                dropDownWidth="w-full"
                dropdownPositionClass="absolute"
                label="Master"
                required
                name="masterId"
                options={Masters?.Items}
                value={selectedMasterId}
                selected={
                  Masters?.Items.find((g) => g.id === selectedMasterId) || null
                }
                onSelect={(group) => {
                  if (group) {
                    setSelectedMasterId(group.id || "");
                  } else {
                    setSelectedMasterId("");
                  }
                }}
                getLabel={(g) => g?.Name ?? ""}
                getValue={(g) => g?.id ?? ""}
              />
            </div>
          </section>

          {/* SUBMIT BUTTON */}
          <div className="flex justify-center pt-10">
            <ButtonElement
              type="submit"
              text="Submit"
              className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg shadow-md"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default EditLedgerGroupForm;
