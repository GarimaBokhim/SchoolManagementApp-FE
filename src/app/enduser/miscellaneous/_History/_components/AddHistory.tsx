"use client";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";

import { X } from "lucide-react";
import { IHistory } from "../types/IHistory";
import { useAddHistory } from "../hooks";
import toast from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { AppCombobox } from "@/components/Input/ComboBox";
import { useGetAllSchoolItems } from "../../_SchoolItem/hooks";
import { useEffect, useState } from "react";
import { ISchoolItem } from "../../_SchoolItem/types/ISchoolItem";
type Props = {
  form: UseFormReturn<IHistory>;
  onClose: () => void;
};
const AddHistoryForm = ({ form, onClose }: Props) => {
  const addHistory = useAddHistory();
  const { handleError, clearError } = useErrorHandler();
  const { data: allSchoolItem } = useGetAllSchoolItems();
  const [selectedSchoolItemId, setSelectedSchoolItemId] = useState("");
  const [prevItemStatus, setPrevItemStatus] = useState(0);
  const [currentStatus, setCurrentStatus] = useState(0);
  const [selectedSchoolItem, setSelectedSchoolItem] = useState<ISchoolItem>();
  useEffect(() => {
    if (selectedSchoolItem) {
      console.log(selectedSchoolItem);
      setPrevItemStatus(selectedSchoolItem.itemStatus);
    }
  }, [selectedSchoolItem]);
  const handleClose = () => {
    form.reset();
    onClose();
  };
  const onSubmit: SubmitHandler<IHistory> = async (data) => {
    clearError();
    try {
      await toast.promise(addHistory.mutateAsync(data), {
        loading: "Adding History...",
        success: "Successfully added History",
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
              Add History
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
              <AppCombobox
                value={selectedSchoolItemId}
                dropDownWidth="w-full"
                dropdownPositionClass="absolute"
                label="School Item"
                name="schoolItemId"
                form={form}
                required
                options={allSchoolItem?.Items}
                selected={
                  allSchoolItem?.Items?.find(
                    (g) => g.id === selectedSchoolItemId
                  ) || null
                }
                onSelect={(group) => {
                  setSelectedSchoolItemId(group?.id ?? "");
                  if (group) setSelectedSchoolItem(group);
                }}
                getLabel={(g) => g?.name ?? ""}
                getValue={(g) => g?.id ?? ""}
              />
              <AppCombobox
                label="Previous Item Status"
                dropdownPositionClass="absolute"
                name="previousStatus"
                readOnly
                form={form}
                value={prevItemStatus}
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
                  ].find((g) => g.id === prevItemStatus) || null
                }
                onSelect={(option) => setPrevItemStatus(option?.id ?? 0)}
                getLabel={(o) => o?.name || ""}
                getValue={(o) => o?.id ?? ""}
              />
              <AppCombobox
                label="Current Item Status"
                dropdownPositionClass="absolute"
                name="currentStatus"
                form={form}
                value={currentStatus}
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
                  ].find((g) => g.id === currentStatus) || null
                }
                onSelect={(option) => setCurrentStatus(option?.id ?? 0)}
                getLabel={(o) => o?.name || ""}
                getValue={(o) => o?.id ?? ""}
              />
              <InputElement
                label="Remarks"
                form={form}
                name="remarks"
                required
                placeholder="Enter Remarks"
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

export default AddHistoryForm;
