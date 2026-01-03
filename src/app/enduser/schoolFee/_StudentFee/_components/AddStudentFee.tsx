"use client";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";

import { X } from "lucide-react";
import { IStudentFee } from "../types/IStudentFee";
import { useAddStudentFee } from "../hooks";
import toast from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { AppCombobox } from "@/components/Input/ComboBox";
import { useState } from "react";
import { useGetAllStudents } from "@/app/enduser/(StudentManagement)/Student/hooks";
import { useGetAllFeeStructure } from "../../_FeeStructure/hooks";
import { IFeeStructure } from "../../_FeeStructure/types/IFeeStructure";
import { useGetAllFeeTypes } from "../../_FeeType/hooks";
import { useGetAllClass } from "@/app/enduser/(Academics)/Class/hooks";
type Props = {
  form: UseFormReturn<IStudentFee>;
  onClose: () => void;
};
const AddStudentFeeForm = ({ form, onClose }: Props) => {
  const addStudentFee = useAddStudentFee();
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedFeeStructure, setSelectedFeeStructure] =
    useState<IFeeStructure>();
  const [selectedFeeStructureId, setSelectedFeeStructureId] = useState("");
  const { data: allStudent } = useGetAllStudents();
  const { data: allFeeStructure } = useGetAllFeeStructure();
  const {data:allfeetype} = useGetAllFeeTypes();
  const {data:allclassname}=useGetAllClass();

  const { handleError, clearError } = useErrorHandler();
  const handleClose = () => {
    onClose();
    form.reset();
  };
  const onSubmit: SubmitHandler<IStudentFee> = async (data) => {
    clearError();
    try {
      await toast.promise(addStudentFee.mutateAsync(data), {
        loading: "Adding StudentFee...",
        success: "Successfully added StudentFee",
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
              Add StudentFee
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
                value={selectedStudentId}
                dropDownWidth="w-full"
                dropdownPositionClass="absolute"
                label="Student"
                name="studentId"
                form={form}
                required
                options={allStudent?.Items}
                selected={
                  allStudent?.Items?.find((g) => g.id === selectedStudentId) ||
                  null
                }
                onSelect={(group) => setSelectedStudentId(group?.id ?? "")}
                getLabel={(g) => g?.firstName ?? ""}
                getValue={(g) => g?.id ?? ""}
              />
            <AppCombobox
                    value={selectedFeeStructureId}
                    dropDownWidth="w-full"
                    dropdownPositionClass="absolute"
                    label="Fee Structure"
                    name="feeStructureId"
                    form={form}
                    required
                    options={allFeeStructure?.Items}
                    selected={
                      allFeeStructure?.Items?.find(
                        (g) => g.id === selectedFeeStructureId
                      ) || null
                    }
                    onSelect={(group) => {
                      setSelectedFeeStructureId(group?.id ?? "");
                      if (group) setSelectedFeeStructure(group);
                    }}
                    getLabel={(g) => {
                      if (!g) return "-";

                      const feeTypeName = allfeetype?.Items?.find(
                        (f) => f.id === g.feeTypeId
                      )?.name ?? "-";
                      const classIdname = allclassname?.Items?.find(
                        (f) => f.id === g.classId
                      )?.name ?? "-";
                      

                      return `${feeTypeName} (${classIdname}) - rs${g.amount ?? 0}`;
                    }}
                    getValue={(g) => g?.id ?? ""}
                  />
              <InputElement
                label="Discount"
                form={form}
                name="discount"
                placeholder="Enter Discount"
                inputType="number"
              />
              <InputElement
                label="Total Amount"
                form={form}
                value={selectedFeeStructure?.amount}
                name="totalAmount"
                placeholder="Enter the Total Amount"
                inputType="number"
                required
              />
              <InputElement
                label="Paid Amount"
                form={form}
                name="paidAmount"
                placeholder="Enter the Paid Amount"
                inputType="number"
                required
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

export default AddStudentFeeForm;
