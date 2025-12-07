"use client";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { ILedgers } from "../types/ILedgers";
import { useEditLedger, useGetLedgerById } from "../hooks";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { AppCombobox } from "@/components/Input/ComboBox";
import toast, { Toaster } from "react-hot-toast";
import { useGetAllSubLedgerGroups } from "../../_SubLedgerGroup/hooks";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { Toast } from "@/components/Toast/toast";
import { ChevronDown, X } from "lucide-react";
type Props = {
  form: UseFormReturn<ILedgers>;
  ledgerId: string;
  onClose: () => void;
};
const EditLedgerForm = ({ form, onClose, ledgerId }: Props) => {
  const editLedger = useEditLedger();
  const { data: SubLedgerGroup } = useGetAllSubLedgerGroups();
  const { data: ledgerData } = useGetLedgerById(ledgerId);
  const [openExtension, setOpenExtension] = useState(false);
  const [selectedSubLedgerGroupId, setSelectedSubLedgerGroupId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [balanceType, setBalanceType] = useState("Dr");
  const handleClose = () => {
    onClose();
    setOpenExtension(false);
    setSelectedSubLedgerGroupId("");
  };
  const { handleError, clearError } = useErrorHandler();
  useEffect(() => {
    const openGroupIds = [
      "dff66bb4-11e6-4e5f-8bb9-f00c01b90284",
      "f5c2cba4-e4c7-496a-9f07-f2060c426e06",
    ];
    setOpenExtension(openGroupIds.includes(selectedSubLedgerGroupId));
  }, [selectedSubLedgerGroupId]);
  const onSubmit: SubmitHandler<ILedgers> = async (data) => {
    clearError();
    form.reset();
    if (balanceType === "Cr" && data.openingBalance) {
      data.openingBalance = -Math.abs(Number(data.openingBalance));
    } else if (balanceType === "Dr" && data.openingBalance) {
      data.openingBalance = Math.abs(Number(data.openingBalance));
    }
    try {
      await toast.promise(
        editLedger.mutateAsync({
          id: ledgerId,
          data: data,
        }),
        {
          loading: "Submitting data",
          success: "Successfully Updated Ledger",
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
    if (ledgerData) {
      form.reset({
        id: ledgerData?.id ?? "",
        name: ledgerData?.name ?? "",
        address: ledgerData?.address ?? "",
        panNo: ledgerData?.panNo ?? "",
        phoneNumber: ledgerData?.phoneNumber ?? "",
        maxCreditPeriod: ledgerData?.maxCreditPeriod ?? "",
        maxDuePeriod: ledgerData?.maxDuePeriod ?? "",
        subledgerGroupId: ledgerData?.subledgerGroupId ?? "",
        openingBalance: Math.abs(Number(ledgerData.openingBalance)) ?? null,
      });
      if (ledgerData?.subledgerGroupId) {
        setSelectedSubLedgerGroupId(ledgerData?.subledgerGroupId);
      }
      if (ledgerData?.openingBalance) {
        if (ledgerData?.openingBalance >= 0) setBalanceType("Dr");
        if (ledgerData?.openingBalance < 0) setBalanceType("Cr");
      }
    }
  }, [ledgerData, form]);
  return (
    <>
      <Toaster position="top-right" />

      <div className="w-full h-full p-4 bg-white dark:bg-[#27272a] overflow-auto rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          {/* HEADER */}
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
              Ledger Details
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
                name="subledgerGroupId"
                dropdownPositionClass="absolute"
                label="Sub Ledger Group"
                required
                options={SubLedgerGroup?.Items}
                form={form}
                value={selectedSubLedgerGroupId}
                selected={
                  SubLedgerGroup?.Items.find(
                    (g) => g.id === selectedSubLedgerGroupId
                  ) || null
                }
                onSelect={(group) =>
                  setSelectedSubLedgerGroupId(group?.id || "")
                }
                getLabel={(g) => g?.name ?? ""}
                getValue={(g) => g?.id ?? ""}
                // renderOptionExtra={(g) => (
                //   <LedgerGroupName ledgerGroupId={g?.ledgerGroupId ?? ""} />
                // )}
              />
            </div>
          </section>

          {/* EXTRA FIELDS */}
          {openExtension && (
            <section className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-100 border-b pb-2">
                Additional Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputElement
                  label="Address"
                  form={form}
                  name="address"
                  placeholder="Enter address"
                />
                <InputElement
                  label="PAN No"
                  form={form}
                  name="panNo"
                  placeholder="Enter PAN number"
                />
                <InputElement
                  label="Phone Number"
                  form={form}
                  name="phoneNumber"
                  placeholder="Enter phone number"
                />
                <InputElement
                  label="Max Credit Period"
                  form={form}
                  name="maxCreditPeriod"
                  placeholder="Max credit period"
                />
                <InputElement
                  label="Max Due Period"
                  form={form}
                  name="maxDuePeriod"
                  placeholder="Max due period"
                />
              </div>
            </section>
          )}

          {/* OPENING BALANCE */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-100 border-b pb-2">
              Opening Balance
            </h2>

            <div className="relative w-full">
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center border rounded-lg px-4 py-3 bg-white dark:bg-gray-800 shadow-sm"
              >
                <span className="font-medium">Opening Balance Type</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {isOpen && (
                <div className="mt-2 p-4 bg-white dark:bg-gray-800 border rounded-lg shadow-lg space-y-6">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={balanceType === "Cr"}
                      onChange={(e) =>
                        setBalanceType(e.target.checked ? "Cr" : "Dr")
                      }
                      className="sr-only peer"
                    />

                    <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 peer-checked:bg-teal-500 rounded-full transition-all" />
                    <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 peer-checked:translate-x-6" />

                    <span className="ml-4 font-semibold text-gray-700 dark:text-gray-100">
                      {balanceType}
                    </span>
                  </label>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputElement
                      disabled={balanceType === "Cr"}
                      readOnly={balanceType === "Cr"}
                      label="Debit Balance"
                      inputType="number"
                      form={form}
                      name={
                        balanceType === "Dr"
                          ? "openingBalance"
                          : "ClosingDemoBalance"
                      }
                      placeholder="Debit opening balance"
                    />

                    <InputElement
                      disabled={balanceType === "Dr"}
                      readOnly={balanceType === "Dr"}
                      label="Credit Balance"
                      inputType="number"
                      form={form}
                      name={
                        balanceType === "Cr"
                          ? "openingBalance"
                          : "ClosingDemoBalance"
                      }
                      placeholder="Credit opening balance"
                    />
                  </div>
                </div>
              )}
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

export default EditLedgerForm;
