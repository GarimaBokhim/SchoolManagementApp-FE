"use client";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";

import { X } from "lucide-react";
import { IFeeStructure, NameOfMonthsEnum } from "../types/IFeeStructure";
import { useAddFeeStructure } from "../hooks";
import toast from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { AppCombobox } from "@/components/Input/ComboBox";
import { useState } from "react";
import { useGetAllClass } from "@/app/enduser/(Academics)/Class/hooks";
import { useGetAllFeeTypes } from "../../_FeeType/hooks";

type Props = {
  form: UseFormReturn<IFeeStructure>;
  onClose: () => void;
};
const AddFeeStructureForm = ({ form, onClose }: Props) => {
  const addFeeStructure = useAddFeeStructure();
  const { handleError, clearError } = useErrorHandler();
  const { data: allClass } = useGetAllClass();
  const { data: allFeeType } = useGetAllFeeTypes();
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedFeeType, setSelectedFeeType] = useState("");
    const [months, setMonths] = useState(0);
  const handleClose = () => {
    form.reset();
    onClose();
  };
  const onSubmit: SubmitHandler<IFeeStructure> = async (data) => {
    clearError();
    const payload = {
      ...data,
      amount: Number(data.amount),
    };

    try {
      await toast.promise(addFeeStructure.mutateAsync(payload), {
        loading: "Adding FeeStructure...",
        success: "Successfully added FeeStructure",
      });
      handleClose();
    } catch (error) {
      const errorMsg = handleError(error);
      Toast.error(errorMsg);
    }
  };
  return (
    <div className=" inset-0 flex items-center justify-center  w-full h-full">
      <div className="w-full  h-[100%] bg-[#ffffff] dark:bg-[#27272a] p-4 overflow-auto relative dark:text-white ">
        <fieldset className="space-y-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-50">
              Add FeeStructure
            </h1>
            <button
              type="button"
              onClick={onClose}
              className="text-red-400 text-3xl hover:text-red-500 transition-transform transform hover:scale-110"
            >
              <X strokeWidth={4} />
            </button>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
              <AppCombobox
                value={selectedClassId}
                dropDownWidth="w-full"
                dropdownPositionClass="absolute"
                label="Class"
                name="classId"
                form={form}
                required
                options={allClass?.Items}
                selected={
                  allClass?.Items?.find((g) => g.id === selectedClassId) || null
                }
                onSelect={(group) => {
                  setSelectedClassId(group?.id ?? "");
                }}
                getLabel={(g) => g?.name ?? ""}
                getValue={(g) => g?.id ?? ""}
              />
              <AppCombobox
                value={selectedFeeType}
                dropDownWidth="w-full"
                dropdownPositionClass="absolute"
                label="Fee Type"
                name="feeTypeId"
                form={form}
                required
                options={allFeeType?.Items}
                selected={
                  allFeeType?.Items?.find((g) => g.id === selectedFeeType) ||
                  null
                }
                onSelect={(group) => {
                  setSelectedFeeType(group?.id ?? "");
                }}
                getLabel={(g) => {
                  if (!g) return "";

                  const monthName =
                    typeof g.nameOfMonths === "number"
                      ? NameOfMonthsEnum[g.nameOfMonths]
                      : "";

                  return `${g.name ?? ""} - ${monthName}`;
                }}

                getValue={(g) => g?.id ?? ""}
              />
              <InputElement
                label="Amount"
                form={form}
                name="amount"
                inputType="number"
                required
                placeholder="Enter amount"
              />
                <AppCombobox
                label="Months"
                dropdownPositionClass="absolute"
                name="nameOfMonths"
                form={form}
                value={months}
                options={[
                  { id: 1, name: "Baisakh" },
                  { id: 2, name: "Jestha" },
                  { id: 3, name: "Ashadh" },
                  { id: 4, name: "Shrawan" },
                  { id: 5, name: "Bhadra" },
                  { id: 6, name: "Ashwin" },
                  { id: 7, name: "Kartik" },
                  { id: 8, name: "Mangsir" },
                  { id: 9, name: "Poush" },
                  { id: 10, name: "Magh" },
                  { id: 11, name: "Falgun" },
                  { id: 12, name: "Chaitra" },
                ]}
                dropDownWidth="w-full"
                selected={
                  [
                    { id: 1, name: "Baisakh" },
                    { id: 2, name: "Jestha" },
                    { id: 3, name: "Ashadh" },
                    { id: 4, name: "Shrawan" },
                    { id: 5, name: "Bhadra" },
                    { id: 6, name: "Ashwin" },
                    { id: 7, name: "Kartik" },
                    { id: 8, name: "Mangsir" },
                    { id: 9, name: "Poush" },
                    { id: 10, name: "Magh" },
                    { id: 11, name: "Falgun" },
                    { id: 12, name: "Chaitra" },
                  ].find((g) => g.id === months) || null
                }
                onSelect={(option) => setMonths(option?.id ?? 0)}
                getLabel={(o) => o?.name || ""}
                getValue={(o) => o?.id ?? ""}
              />
            </div>
            <div className="flex justify-center mt-8">
              <ButtonElement
                type="submit"
                text="Submit"
                className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg shadow-md transition-all"
              />
            </div>
          </form>
        </fieldset>
      </div>
    </div>
  );
};

export default AddFeeStructureForm;
