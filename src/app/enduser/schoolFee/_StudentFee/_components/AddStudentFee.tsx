/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { X } from "lucide-react";
import { IStudentFee } from "../types/IStudentFee";
import { useAddStudentFee } from "../hooks";
import toast from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { AppCombobox } from "@/components/Input/ComboBox";
import { useState, useEffect } from "react";
import { useGetAllStudents } from "@/app/enduser/(StudentManagement)/Student/hooks";
import {  useGetAllFeeStructure, useGetFeeStructureByClassId } from "../../_FeeStructure/hooks";
import { IFeeStructure } from "../../_FeeStructure/types/IFeeStructure";
import { useGetAllFeeTypes } from "../../_FeeType/hooks";
import { useGetAllClass } from "@/app/enduser/(Academics)/Class/hooks";

type Props = {
  form: UseFormReturn<IStudentFee>;
  onClose: () => void;
};

const AddStudentFeeForm = ({ form, onClose }: Props) => {
  const addStudentFee = useAddStudentFee();
  const { handleError, clearError } = useErrorHandler();

  const { data: allStudents } = useGetAllStudents();
  const { data: allClasses } = useGetAllClass();
  const { data: allFeeTypes } = useGetAllFeeTypes();
  const { data: allFeeStructure } = useGetAllFeeStructure();
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedFeeStructureId, setSelectedFeeStructureId] = useState("");
  const [selectedFeeStructure, setSelectedFeeStructure] = useState<IFeeStructure | undefined>(undefined);

const { data: feeStructuresByClass } = useGetFeeStructureByClassId(selectedClassId);

 const handleClose = () => {
  form.reset();
  setSelectedStudentId("");
  setSelectedClassId("");
  setSelectedFeeStructureId("");
  onClose();
};

useEffect(() => {
  const student = allStudents?.Items?.find(s => s.id === selectedStudentId);
  if (student) {
    setSelectedClassId(student.classId ?? "");
    setSelectedFeeStructureId(""); 
  }
}, [selectedStudentId, allStudents]);

useEffect(() => {
  form.setValue("classId", selectedClassId);
}, [selectedClassId, form]);


  const onSubmit: SubmitHandler<IStudentFee> = async (data) => {
    clearError();
    try {
      await toast.promise(addStudentFee.mutateAsync(data), {
        loading: "Adding Student Fee...",
        success: "Successfully added Student Fee",
      });
      handleClose();
    } catch (error) {
      const errorMsg = handleError(error);
      toast.error(errorMsg);
    }
  };

  return (
    <div className="inset-0 flex items-center justify-center w-full h-full">
      <div className="w-full max-w-4xl h-[100%] bg-white dark:bg-[#27272a] p-4 overflow-auto relative dark:text-white">
        <fieldset className="space-y-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-50">Add Student Fee</h1>
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
                options={allStudents?.Items}
                selected={allStudents?.Items?.find(s => s.id === selectedStudentId) || null}
                onSelect={(s) => setSelectedStudentId(s?.id ?? "")}
                getLabel={(s) => {
                  const className = allClasses?.Items?.find(c => c.id === s?.classId)?.name ?? "";
                  return `${s?.firstName ?? ""} - (${className})`;
                }}
                getValue={(s) => s?.id ?? ""}
              />

              <InputElement
                label="Class"
                inputType="text"
                form={form}
                name="classDisplay"
                value={allClasses?.Items?.find(c => c.id === selectedClassId)?.name ?? ""}
                disabled
              />

              <input
                type="hidden"
                {...form.register("classId")}
                value={selectedClassId}
              />
             <AppCombobox
              value={selectedFeeStructureId}
              dropDownWidth="w-full"
              dropdownPositionClass="absolute"
              label="Fee Structure"
              name="feeStructureId"
              form={form}
              required
              options={feeStructuresByClass?.Items ?? []}
              selected={
                feeStructuresByClass?.Items?.find(f => f.id === selectedFeeStructureId) ?? null
              }
              onSelect={(f) => {
                const id = f?.id?.toString() ?? "";
                setSelectedFeeStructureId(id);
                form.setValue("feeStructureId", id); 
              }}
              getLabel={(f) => {
                const feeType = allFeeTypes?.Items?.find(t => t?.id === f?.feeTypeId);

                return `${feeType?.name ?? ""} - ${f?.amount ?? ""}`;
              }}
              getValue={(f) => f?.id ?? ""}
            />


              <InputElement
                label="Discount (%)"
                form={form}
                name="discountPercentage"
                placeholder="Enter Discount Percentage"
                inputType="number"
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
