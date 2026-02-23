"use client";

import React, { useState } from "react";
import {  SubmitHandler, UseFormReturn } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { InputElement } from "@/components/Input/InputElement";

import { useAddSchoolAward } from "../hooks";
import { ISchoolAward } from "../types/Ischoolaward";


interface props {
  form: UseFormReturn<ISchoolAward>;
  visible: boolean;
  onClose: () => void;
}

const AddschoolAward = ({ visible, onClose, form }: props) => {
  const {
    handleSubmit,
    reset,
  } = form;

  const addAwardMutation = useAddSchoolAward();

  const onSubmit: SubmitHandler<ISchoolAward> = async (formData) => {
    try {
      await addAwardMutation.mutateAsync(formData);
      toast.success("Student award added successfully!");
      reset();
      onClose();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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


export default AddschoolAward;
