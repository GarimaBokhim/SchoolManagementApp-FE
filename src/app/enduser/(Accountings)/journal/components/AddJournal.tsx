"use client";
import {
  SubmitHandler,
  useFieldArray,
  UseFormReturn,
  useWatch,
} from "react-hook-form";
import { useAddJournal, useGetJournalRefByCompany } from "../hooks";
import { InputElement } from "@/components/Input/InputElement";
import { X } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { AppCombobox } from "@/components/Input/ComboBox";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import toast, { Toaster } from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { Toast } from "@/components/Toast/toast";
import { IJournal } from "../types/IJournal";
import { AxiosError } from "axios";
import { useGetAllLedgers } from "../../ledger/hooks";
import { useGetAllSubLedgerGroups } from "../../_SubLedgerGroup/hooks";
import { LedgerBalance } from "../../ledger/components/GetBalance";
type Props = {
  form: UseFormReturn<IJournal>;
  onClose: () => void;
};

const AddJournalForm = ({ form, onClose }: Props) => {
  const addJournal = useAddJournal();
  const { handleError, clearError } = useErrorHandler();
  const journalEntries =
    useWatch({
      control: form.control,
      name: "journalEntries",
    }) || [];
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "journalEntries",
    rules: { minLength: 2 },
  });
  const companyId = localStorage.getItem("schoolId");
  const { data: journalStatus } = useGetJournalRefByCompany(companyId);
  const { data: allLedgers } = useGetAllLedgers();
  const [nextSelectedLedger, setNextSelectedLedger] = useState("Debit");
  const { data: allSubLedgersGroup } = useGetAllSubLedgerGroups();
  const [selectedLedgerId, setSelectedLedgerId] = useState<{
    [key: number]: string;
  }>({});
  const onSubmit: SubmitHandler<IJournal> = async (data) => {
    clearError();
    const sanitizedData = {
      ...data,
      journalEntries: data.journalEntries!.map((entry) => ({
        ...entry,
        debitAmount: entry.debitAmount || 0,
        creditAmount: entry.creditAmount || 0,
      })),
      createdAt: new Date().toISOString(),
    };

    try {
      await toast.promise(addJournal.mutateAsync(sanitizedData), {
        loading: "Submitting Data",
        success: "Successfully Added Journal",
      });

      form.reset();
      onClose();
    } catch (error: AxiosError | unknown) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data || "Journal creation failed");
      }
      const errorMsg = handleError(error);
      Toast.error(errorMsg);
    }
  };
  useEffect(() => {
    if (fields.length === 2) {
      form.setValue("journalEntries.0.type", "Debit");
      form.setValue("journalEntries.1.type", "Credit");
    }
  }, [fields.length, form]);

  const handleTypeChange = (index: number, selectedType: string) => {
    form.setValue(`journalEntries.${index}.type`, selectedType);
    setNextSelectedLedger(selectedType === "Credit" ? "Debit" : "Credit");
  };

  const addJournalEntries = () => {
    append({
      ledgerId: "",
      debitAmount: 0,
      creditAmount: 0,
      type: nextSelectedLedger,
    });
    setNextSelectedLedger((prev) => (prev === "Debit" ? "Credit" : "Debit"));
  };
  const totalDebit = journalEntries.reduce(
    (sum, entry) => sum + Number(entry.debitAmount || 0),
    0
  );
  const totalCredit = journalEntries.reduce(
    (sum, entry) => sum + Number(entry.creditAmount || 0),
    0
  );

  const removeJournalEntriesField = (index: number) => {
    if (fields.length <= 2) {
      Toast.error("You must maintain at least two journal entries");
      return;
    }
    remove(index);
  };

  const handleSelectLedger = (index: number, ledgerId: string) => {
    form.setValue(`journalEntries.${index}.ledgerId`, ledgerId);
  };

  return (
    <>
      <Toaster position="top-right" />

      <div className="w-full h-full p-4 bg-white dark:bg-[#27272a] overflow-auto rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <fieldset className="h-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-lg font-semibold">{"Add Journal"}</h1>
              <button
                type="button"
                onClick={onClose}
                className="text-red-400 text-2xl hover:text-red-500"
              >
                <X strokeWidth={3} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {journalStatus?.journalReferences === 0 && (
                <InputElement
                  label="Reference Number"
                  form={form}
                  name="referenceNumber"
                  placeholder="Enter Reference Number"
                />
              )}

              <InputElement
                label="Transaction Date"
                form={form}
                name="transactionDate"
                inputType="date"
                placeholder="Enter Transaction Date"
              />
            </div>

            <h2 className="text-md font-semibold mt-6 mb-4">
              {"Journal Entry Details"}
            </h2>
            <div className="overflow-auto max-h-[28rem] mb-3 pt-4 space-y-4">
              {fields.map((item, index) => (
                <div
                  key={item.id}
                  className="flex flex-col md:flex-row gap-4 items-start"
                >
                  <div className="w-full md:w-[25%]" tabIndex={-1}>
                    {allLedgers && (
                      <AppCombobox
                        dropDownWidth="md:w-[12%]"
                        dropdownPositionClass="fixed"
                        label="Ledger"
                        required
                        options={allLedgers.Items}
                        value={selectedLedgerId[index]}
                        name="ledgerId"
                        selected={
                          allLedgers.Items.find(
                            (g) => g.id === selectedLedgerId[index]
                          ) || null
                        }
                        onSelect={(group) => {
                          const id = group?.id ?? "";
                          setSelectedLedgerId((prev) => ({
                            ...prev,
                            [index]: id,
                          }));
                          handleSelectLedger(index, id);
                        }}
                        getLabel={(g) => g?.name ?? ""}
                        getValue={(g) => g?.id ?? ""}
                        renderOptionExtra={(g) => (
                          <span className={` text-sm dark-text-white `}>
                            {
                              allSubLedgersGroup?.Items?.find(
                                (i) => i.id === g?.subledgerGroupId
                              )?.name
                            }
                          </span>
                        )}
                      />
                    )}

                    {selectedLedgerId && (
                      <LedgerBalance ledgerId={selectedLedgerId[index]} />
                    )}
                  </div>

                  {/* Type and Amounts */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-[75%]">
                    <select
                      value={journalEntries[index]?.type || ""}
                      onChange={(e) => handleTypeChange(index, e.target.value)}
                      className="h-11 mt-1 border rounded dark:bg-[#303135] px-2"
                    >
                      <option value="">{"Select Type"}</option>
                      <option value="Credit">{"Credit"}</option>
                      <option value="Debit">{"Debit"}</option>
                    </select>

                    <InputElement
                      label="Credit Amount"
                      layout="column"
                      inputType="number"
                      form={form}
                      value={
                        journalEntries[index]?.type === "Credit" &&
                        journalEntries[index]?.creditAmount !== 0
                          ? journalEntries[index]?.creditAmount
                          : ""
                      }
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        form.setValue(
                          `journalEntries.${index}.creditAmount`,
                          Number(e.target.value)
                        )
                      }
                      name={`journalEntries.${index}.creditAmount`}
                      placeholder="Credit Amount"
                      disabled={journalEntries[index]?.type !== "Credit"}
                    />

                    <InputElement
                      label="Debit Amount"
                      layout="column"
                      inputType="number"
                      form={form}
                      value={
                        journalEntries[index]?.type === "Debit" &&
                        journalEntries[index]?.debitAmount !== 0
                          ? journalEntries[index]?.debitAmount
                          : ""
                      }
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        form.setValue(
                          `journalEntries.${index}.debitAmount`,
                          Number(e.target.value)
                        )
                      }
                      name={`journalEntries.${index}.debitAmount`}
                      placeholder="Debit Amount"
                      disabled={journalEntries[index]?.type !== "Debit"}
                    />
                  </div>
                  {fields.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeJournalEntriesField(index)}
                      className="text-red-500 mt-2 md:mt-0"
                    >
                      {"Remove"}
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addJournalEntries}
              className="text-teal-500 mt-2"
            >
              {"Add Entry"}
            </button>

            <div className="mt-3 flex flex-col sm:flex-row justify-between w-full px-2 sm:px-4 text-sm sm:text-base">
              <span className="font-semibold">
                {"Total Debit"}: {totalDebit}
              </span>
              <span className="font-semibold">
                {"Total Credit"}: {totalCredit}
              </span>
            </div>
            <div className="mt-4">
              <InputElement
                label="Narration"
                form={form}
                name="description"
                placeholder="Enter Description"
              />
            </div>

            <div className="flex justify-center mt-6">
              <ButtonElement
                disabled={totalDebit !== totalCredit}
                type="submit"
                text="Submit"
              />
            </div>
          </fieldset>
        </form>
      </div>
    </>
  );
};

export default AddJournalForm;
