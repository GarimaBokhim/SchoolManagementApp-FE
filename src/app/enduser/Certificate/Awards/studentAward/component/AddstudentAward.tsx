"use client";

import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler, UseFormReturn } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { InputElement } from "@/components/Input/InputElement";
import { AppCombobox } from "@/components/Input/ComboBox";
import { useGetAllStudents } from "@/app/enduser/(StudentManagement)/Student/hooks";
import { Istudentaward } from "../types/Istudentaward";
import { useAddStudentAward } from "../hooks";


interface props {
  form: UseFormReturn<Istudentaward>;
  visible: boolean;
  onClose: () => void;
}

const AddStudentAward = ({ visible, onClose, form }: props) => {
  const { data: allStudents } = useGetAllStudents();
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const {
    handleSubmit,
    reset,
    setValue,
  } = form;

  const addAwardMutation = useAddStudentAward();

  const onSubmit: SubmitHandler<Istudentaward> = async (formData) => {
    try {
      await addAwardMutation.mutateAsync(formData);
      toast.success("Student award added successfully!");
      reset();
      setSelectedStudentId(null);
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to add student award.");
    }
  };

  if (!visible) return null;

  return (
    <>
      <Toaster position="top-right" />
     <div className="fixed inset-0 ml-12 md:ml-64 sm:ml-16 bg-white bg-opacity-30 z-50 flex items-center justify-center">
        <div className="bg-white dark:bg-[#353535] p-6 rounded-xl w-full max-w-lg shadow-lg relative overflow-visible">
          <button
            className="absolute top-3 right-3 text-red-500 hover:text-red-700"
            onClick={onClose}
          >
            X
          </button>

          <h2 className="text-xl font-semibold mb-4">Add Student Award</h2>

         <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
  <div className="relative z-50">
    <AppCombobox
      label="Select Student"
      name="studentId"
      form={form}
      value={selectedStudentId}
      options={allStudents?.Items ?? []}
      selected={
        allStudents?.Items?.find((s) => s.id === selectedStudentId) || null
      }
      onSelect={(student) => {
        const id = student?.id ?? "";
        setSelectedStudentId(id);
        setValue("studentId", id);
      }}
      getLabel={(s) => s?.firstName as string}
      getValue={(s) => s?.id as string}
    />
  </div>

  <InputElement
    label="Award Description"
    name="awardDescriptions"
    inputType="text"
    form={form}
    placeholder="Enter award details"
  />

  <InputElement
    label="Awarded Date"
    name="awardedAt"
    inputType="date"
    form={form}
  />

  <InputElement
    label="Awarded By"
    name="awardedBy"
    inputType="text"
    form={form}
  />
 <div className="flex justify-center gap-4 mt-4">

    <ButtonElement 
    type="submit" 
    text="Add Award" 
    className="!bg-emerald-600 hover:!bg-emerald-700" 
    /> 
  <ButtonElement 
  type="button" 
  text="Cancel" 
  onClick={onClose} 
  className="!bg-gray-500 hover:!bg-gray-600" 
  /> 
  </div>
</form>

        </div>
      </div>
    </>
  );
};


export default AddStudentAward;
