"use client";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";

import { X } from "lucide-react";
import { ISchoolItem } from "../types/ISchoolItem";
import { useAddSchoolItem } from "../hooks";
import toast from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { AppCombobox } from "@/components/Input/ComboBox";
import { useState } from "react";
import { useGetAllContributors } from "../../_Contributor/hooks";
import { useGetAllFiscalYear } from "@/app/admin/Setup/School/hooks";
type Props = {
  form: UseFormReturn<ISchoolItem>;
  onClose: () => void;
};
const AddSchoolItemForm = ({ form, onClose }: Props) => {
  const addSchoolItem = useAddSchoolItem();
  const [selectedContributorId, setSelectedContributorId] = useState("");
  const [selectedFiscalYear, setSelectedFiscalYear] = useState("");
  const { data: allFiscalYear } = useGetAllFiscalYear();
  const [itemStatus, setItemStatus] = useState(0);
  const [itemCondition, setItemCondition] = useState(0);
  const [unit, setUnit] = useState(0);
  const { data: allContributor } = useGetAllContributors();
  const { handleError, clearError } = useErrorHandler();
  const handleClose = () => {
    onClose();
    form.reset();
  };
  const onSubmit: SubmitHandler<ISchoolItem> = async (data) => {
    clearError();
    try {
      await toast.promise(addSchoolItem.mutateAsync(data), {
        loading: "Adding SchoolItem...",
        success: "Successfully added SchoolItem",
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
              Add SchoolItem
            </h1>
            <button
              type="button"
              onClick={onClose}
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
                placeholder="Enter Name of SchoolItem"
                required
              />
              <InputElement
                label="Received Date"
                form={form}
                name="receivedDate"
                inputType="date"
              />
              <AppCombobox
                value={selectedContributorId}
                dropDownWidth="w-full"
                dropdownPositionClass="absolute"
                label="Contributor"
                name="contributorId"
                form={form}
                required
                options={allContributor?.Items}
                selected={
                  allContributor?.Items?.find(
                    (g) => g.id === selectedContributorId
                  ) || null
                }
                onSelect={(group) => setSelectedContributorId(group?.id ?? "")}
                getLabel={(g) => g?.name ?? ""}
                getValue={(g) => g?.id ?? ""}
              />
              <AppCombobox
                label="Item Status"
                dropdownPositionClass="absolute"
                name="itemStatus"
                form={form}
                value={itemStatus}
                options={[
                  { id: 1, name: "Available" },
                  { id: 2, name: "Damaged" },
                  { id: 3, name: "Replaced" },
                  { id: 4, name: "Lost" },
                  { id: 5, name: "Disposed" },
                ]}
                dropDownWidth="w-full"
                selected={
                  [
                    { id: 1, name: "Available" },
                    { id: 2, name: "Damaged" },
                    { id: 3, name: "Replaced" },
                    { id: 4, name: "Lost" },
                    { id: 5, name: "Disposed" },
                  ].find((g) => g.id === itemStatus) || null
                }
                onSelect={(option) => setItemStatus(option?.id ?? 0)}
                getLabel={(o) => o?.name || ""}
                getValue={(o) => o?.id ?? ""}
              />
              <AppCombobox
                label="Item Condition"
                dropdownPositionClass="absolute"
                name="itemCondition"
                form={form}
                value={itemCondition}
                options={[
                  { id: 1, name: "New" },
                  { id: 2, name: "Good" },
                  { id: 3, name: "Fair" },
                  { id: 4, name: "Poor" },
                ]}
                dropDownWidth="w-full"
                selected={
                  [
                    { id: 1, name: "New" },
                    { id: 2, name: "Good" },
                    { id: 3, name: "Fair" },
                    { id: 4, name: "Poor" },
                  ].find((g) => g.id === itemCondition) || null
                }
                onSelect={(option) => setItemCondition(option?.id ?? 0)}
                getLabel={(o) => o?.name || ""}
                getValue={(o) => o?.id ?? ""}
              />
              <InputElement
                label="Estimated Value"
                form={form}
                name="estimatedValue"
                placeholder="Enter the estimated value of goods"
                inputType="number"
                required
              />
              <InputElement
                label="Quantity"
                form={form}
                name="quantity"
                placeholder="Enter the Quantity of the goods"
                inputType="number"
                required
              />
              <AppCombobox
                label="Unit"
                dropdownPositionClass="absolute"
                name="unitType"
                form={form}
                value={unit}
                options={[
                  { id: 1, name: "टुक्रा / Piece" },
                  { id: 2, name: "सेट / Set" },
                  { id: 3, name: "बाकस / Box" },
                  { id: 4, name: "प्याकेट / Packet" },
                  { id: 5, name: "बन्डल / Bundle" },
                  { id: 6, name: "दर्जनौं / Dozen" },
                  { id: 7, name: "किलोग्राम / Kg" },
                  { id: 8, name: "ग्राम / G" },
                  { id: 9, name: "मिलिग्राम / MG" },
                  { id: 10, name: "टोन / Ton" },
                  { id: 11, name: "क्विन्टल / Quintal" },
                  { id: 12, name: "लिटर[ / Litre" },
                  { id: 13, name: "मिलिलिटर / Ml" },
                  { id: 14, name: "क्यान / Can" },
                  { id: 15, name: "बोतल / Bottle" },
                  { id: 16, name: "जार / Jar" },
                  { id: 17, name: "ड्रम / Drum" },
                ]}
                dropDownWidth="w-full"
                selected={
                  [
                    { id: 1, name: "टुक्रा / Piece" },
                    { id: 2, name: "सेट / Set" },
                    { id: 3, name: "बाकस / Box" },
                    { id: 4, name: "प्याकेट / Packet" },
                    { id: 5, name: "बन्डल / Bundle" },
                    { id: 6, name: "दर्जनौं / Dozen" },
                    { id: 7, name: "किलोग्राम / Kg" },
                    { id: 8, name: "ग्राम / G" },
                    { id: 9, name: "मिलिग्राम / MG" },
                    { id: 10, name: "टोन / Ton" },
                    { id: 11, name: "क्विन्टल / Quintal" },
                    { id: 12, name: "लिटर[ / Litre" },
                    { id: 13, name: "मिलिलिटर / Ml" },
                    { id: 14, name: "क्यान / Can" },
                    { id: 15, name: "बोतल / Bottle" },
                    { id: 16, name: "जार / Jar" },
                    { id: 17, name: "ड्रम / Drum" },
                  ].find((g) => g.id === unit) || null
                }
                onSelect={(option) => setUnit(option?.id ?? 0)}
                getLabel={(o) => o?.name || ""}
                getValue={(o) => o?.id ?? ""}
              />
              <AppCombobox
                value={selectedFiscalYear}
                dropDownWidth="w-full"
                dropdownPositionClass="absolute"
                label="Fiscal Year"
                name="fiscalYearId"
                form={form}
                required
                options={allFiscalYear?.Items}
                selected={
                  allFiscalYear?.Items?.find(
                    (g) => g.Id === selectedFiscalYear
                  ) || null
                }
                onSelect={(group) => setSelectedFiscalYear(group?.Id ?? "")}
                getLabel={(g) => g?.FyName ?? ""}
                getValue={(g) => g?.Id ?? ""}
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

export default AddSchoolItemForm;
