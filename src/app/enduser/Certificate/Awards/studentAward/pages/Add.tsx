"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import AddStudentAward from "../component/AddstudentAward";
import { Istudentaward } from "../types/Istudentaward";

interface props {
  onClose?: () => void;
}
const Add = ({  onClose }: props) => {
  const form = useForm<Istudentaward>({
    defaultValues: {
      id: "",
      studentId: "",
      awardedAt: new Date().toISOString().split("T")[0],
      awardedBy: "",
      awardDescriptions: "",
      schoolId: "",
      createdBy: "",
      createdAt: "",
      modifiedBy: "",
      modifiedAt: "",
      isActive: false,
    },
  });
   const handleOnClose = () => {
    if (onClose) onClose();
  };


  return (
    <>
      <Toaster position="top-right" />
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Add student Award</h1>
        <div className="bg-white  p-6 rounded-xl shadow-md">
          <AddStudentAward form={form} visible={true} onClose={handleOnClose} />
        </div>
      </div>
    </>
  );
};

export default Add;
