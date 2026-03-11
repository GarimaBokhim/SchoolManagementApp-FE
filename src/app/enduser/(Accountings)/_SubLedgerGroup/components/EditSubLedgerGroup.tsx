/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { ISubLedgerGroup } from "../types/ISubLedgerGroup";
import { useEditSubLedgerGroup, useGetSubLedgerGroupById } from "../hooks";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { AppCombobox } from "@/components/Input/ComboBox";
import toast, { Toaster } from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { Toast } from "@/components/Toast/toast";
import { X } from "lucide-react";
import { useGetAllLedgerGroups } from "../../_LedgerGroup/hooks";
type Props = {
  form: UseFormReturn<ISubLedgerGroup>;
  SubLedgerGroupId: string;
  onClose: () => void;
};
const EditSubLedgerGroupForm = ({ form, onClose, SubLedgerGroupId }: Props) => {
  const editSubLedgerGroup = useEditSubLedgerGroup();
  const { data: LedgerGroup } = useGetAllLedgerGroups();
  const { data: SubLedgerGroupData } =
    useGetSubLedgerGroupById(SubLedgerGroupId);
  const [selectedLedgerGroup, setSelectedLedgerGroup] = useState("");
  const handleClose = () => {
    onClose();
  };
  const { handleError, clearError } = useErrorHandler();
  const onSubmit: SubmitHandler<ISubLedgerGroup> = async (data) => {
    clearError();
    form.reset();
    try {
      await toast.promise(
        editSubLedgerGroup.mutateAsync({
          id: SubLedgerGroupId,
          data: data,
        }),
        {
          loading: "Submitting data",
          success: "Successfully Updated SubLedgerGroup",
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
    if (SubLedgerGroupData) {
      form.reset({
        id: SubLedgerGroupData?.id ?? "",
        name: SubLedgerGroupData?.name ?? "",
        ledgerGroupId: SubLedgerGroupData?.ledgerGroupId ?? "",
      });
      if (SubLedgerGroupData?.ledgerGroupId) {
        setSelectedLedgerGroup(SubLedgerGroupData?.ledgerGroupId);
      }
    }
  }, [SubLedgerGroupData, form]);
  return (
    <>
      <Toaster position="top-right" />

      <div className="w-full h-full p-4 bg-white dark:bg-[#27272a] overflow-auto rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-50">
              Add Ledger
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
              Sub Ledger Group Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputElement
                label="Name"
                required
                form={form}
                name="name"
                placeholder="Enter ledger name"
              />

              <AppCombobox
                dropDownWidth="w-full"
                name="ledgerGroupId"
                dropdownPositionClass="absolute"
                label="Ledger Group"
                required
                options={LedgerGroup?.Items}
                form={form}
                value={selectedLedgerGroup}
                selected={
                  LedgerGroup?.Items.find(
                    (g) => g.id === selectedLedgerGroup
                  ) || null
                }
                onSelect={(group) => setSelectedLedgerGroup(group?.id || "")}
                getLabel={(g) => g?.name ?? ""}
                getValue={(g) => g?.id ?? ""}
                // renderOptionExtra={(g) => (
                //   <LedgerGroupName ledgerGroupId={g?.ledgerGroupId ?? ""} />
                // )}
              />
            </div>
          </section>
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

export default EditSubLedgerGroupForm;
