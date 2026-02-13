"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler, UseFormReturn } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { InputElement } from "@/components/Input/InputElement";
import { AppCombobox } from "@/components/Input/ComboBox";
import { useGetAllStudents } from "@/app/enduser/(StudentManagement)/Student/hooks";
import { Istudentaward } from "../types/Istudentaward";
import { useAddStudentAward } from "../hooks";
import { useGetAllTemplate } from "../../../CertificateTemplate/hooks";
import { useGetAllEvents } from "@/app/enduser/miscellaneous/Events/hooks";
import TextEditor from "@/components/Input/TextEditor";

interface props {
  form: UseFormReturn<Istudentaward>;
  visible: boolean;
  onClose: () => void;
}

const AddStudentAward = ({ visible, onClose, form }: props) => {
  const { data: allStudents } = useGetAllStudents();
  const { data: allTemplate } = useGetAllTemplate();
  const { data: allEvents } = useGetAllEvents();

  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const { handleSubmit, reset, setValue, watch } = form;
  const details = watch("contentHtml");
  const addAwardMutation = useAddStudentAward();

 const onSubmit: SubmitHandler<Istudentaward> = async (formData) => {
  try {
    await addAwardMutation.mutateAsync(formData);

    toast.success("Student award added successfully!", {
      duration: 2000,
    });

    reset();
    setSelectedStudentId(null);
    onClose();
  } catch (error: any) {
    toast.error(error.message || "Failed to add student award.", {
      duration: 2000,
    });
  }
};


  if (!visible) return null;

  return (
    <>
      

      <div className="fixed inset-0 ml-12 md:ml-64 sm:ml-16 bg-white bg-opacity-30 z-50 overflow-auto">

        <div className="bg-white dark:bg-[#353535] w-full h-full p-6 relative">
          <button
            className="absolute top-3 right-3 text-red-500 hover:text-red-700"
            onClick={onClose}
          >
            X
          </button>

          <h2 className="text-xl font-semibold mb-4">Add Student Award</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AppCombobox
              value={selectedStudentId}
              dropDownWidth="w-full"
              dropdownPositionClass="absolute"
              label="Student"
              name="studentId"
              form={form}
              required
              options={allStudents?.Items}
              selected={allStudents?.Items?.find(g => g.id === selectedStudentId) || null}
              onSelect={(group) => setSelectedStudentId(group?.id || null)}
              getLabel={(g) => g?.firstName ?? ""}
              getValue={(g) => g?.id ?? ""}
            />

            <InputElement
              label="Award Description"
              name="awardDescriptions"
              inputType="text"
              form={form}
              placeholder="Enter award details"
            />

            {/* Awarded Date */}
            <InputElement
              label="Awarded Date"
              name="awardedAt"
              inputType="date"
              form={form}
            />

            {/* Awarded By */}
            <InputElement
              label="Awarded By"
              name="awardedBy"
              inputType="text"
              form={form}
            />

            {/* Template ComboBox */}
            <AppCombobox
              value={selectedTemplateId}
              dropDownWidth="w-full"
              dropdownPositionClass="absolute"
              label="Template"
              name="certificateTemplateId"
              form={form}
              required
              options={allTemplate?.Items}
              selected={allTemplate?.Items?.find(g => g.id === selectedTemplateId) || null}
              onSelect={(group) => setSelectedTemplateId(group?.id || null)}
              getLabel={(g) => g?.templateName ?? ""}
              getValue={(g) => g?.id ?? ""}
            />

            {/* Events ComboBox */}
            <AppCombobox
              value={selectedEventId}
              dropDownWidth="w-full"
              dropdownPositionClass="absolute"
              label="Events"
              name="eventsId"
              form={form}
              required
              options={allEvents?.Items}
              selected={allEvents?.Items?.find(g => g.id === selectedEventId) || null}
              onSelect={(group) => setSelectedEventId(group?.id || null)}
              getLabel={(g) => g?.title ?? ""}
              getValue={(g) => g?.id ?? ""}
            />
            </div>

            {/* Text Editor */}
            <TextEditor
              content={details}
              onChange={(content) => setValue("contentHtml", content)}
            />

            {/* Buttons */}
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
