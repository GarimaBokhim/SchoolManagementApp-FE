"use client";

import { SubmitHandler, UseFormReturn, useFieldArray } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { X } from "lucide-react";
import { IExam } from "../types/IExams";
import { useAddExam } from "../hooks";
import toast from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { AppCombobox } from "@/components/Input/ComboBox";
import { useState } from "react";
import { useGetAllClass } from "../../Class/hooks";
import { useGetSubjectByClassId } from "../../Subject/hooks";

type Props = {
  form: UseFormReturn<IExam>;
  onClose: () => void;
};

const AddExamForm = ({ form, onClose }: Props) => {
  const addExam = useAddExam();
  const { handleError, clearError } = useErrorHandler();
  const { data: allClass } = useGetAllClass();

  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<{
    [key: number]: string;
  }>({});

  const { data: allSubjects } = useGetSubjectByClassId(selectedClass);

  const { fields, append, remove } = useFieldArray({
    name: "examSubjects",
    control: form.control,
  });

  const isFinalExam = form.watch("isfinalExam");

  const handleClose = () => {
    form.reset({
      name: "",
      examDate: undefined,
      isfinalExam: false,
      classId: "",
      examSubjects: [],
    });
    onClose();
  };

  const onSubmit: SubmitHandler<IExam> = async (data) => {
    clearError();

    const formattedData = {
      name: data.name,
      examDate: new Date(data.examDate).toISOString(),
      isfinalExam: data.isfinalExam,
      classId: data.classId,
      examSubjects: (data.examSubjects ?? []).map((s) => ({
        subjectId: s.subjectId,
        fullMarks: Number(s.fullMarks),
        passMarks: Number(s.passMarks),
      })),
    };

    try {
      await toast.promise(addExam.mutateAsync(formattedData as any), {
        loading: "Adding Exam...",
        success: "Successfully added Exam",
      });

      handleClose();
    } catch (error) {
      const errorMsg = handleError(error);
      Toast.error(errorMsg);
    }
  };

  return (
    <div className="w-full relative dark:text-white">
      <fieldset>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold">Add Exam</h1>
          <button type="button" onClick={handleClose}>
            <X strokeWidth={3} />
          </button>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Basic Info — FIX 1: items-start prevents the toggle from shifting when the combobox dropdown opens */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">

            <InputElement
              label="Exam Name"
              form={form}
              name="name"
              placeholder="Enter Name"
              required
            />

            {/* FIX 2: Remove isExpiryDate prop and do NOT pass a defaultValue so the field starts empty */}
            <InputElement
              label="Exam Date"
              form={form}
              name="examDate"
              inputType="date"
              required
            />

            <AppCombobox
              label="Class"
              name="classId"
              form={form}
              value={selectedClass}
              options={allClass?.Items ?? []}
              selected={
                allClass?.Items?.find((e) => e.id === selectedClass) || null
              }
              onSelect={(cls) => {
                const id = cls?.id ?? "";
                setSelectedClass(id);
                form.setValue("classId", id);
                form.setValue("examSubjects", []);
              }}
              getLabel={(e) => e?.name ?? ""}
              getValue={(e) => e?.id ?? ""}
            />

            {/* Toggle — stays aligned because of items-start on the grid */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Is Final Exam</label>
              <div className="h-10 flex items-center">
                <button
                  type="button"
                  onClick={() => form.setValue("isfinalExam", !isFinalExam)}
                  className={`relative inline-flex items-center w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                    isFinalExam ? "bg-teal-500" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ${
                      isFinalExam ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="ml-2 text-sm">
                  {isFinalExam ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>

          {/* Subjects */}
          <div className="mt-6">
            <h2 className="font-semibold mb-2">Exam Subjects</h2>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-[2fr_1fr_1fr_auto] gap-3 mb-2 items-start"
              >
                <AppCombobox
                  label="Subject"
                  name={`examSubjects.${index}.subjectId`}
                  form={form}
                  value={selectedSubjectIds[index] ?? ""}
                  options={(allSubjects ?? []).filter((subj) => {
                    const selectedIds = Object.values(selectedSubjectIds);
                    return (
                      subj.id === selectedSubjectIds[index] ||
                      !selectedIds.includes(subj.id)
                    );
                  })}
                  selected={
                    allSubjects?.find(
                      (s) => s.id === selectedSubjectIds[index]
                    ) || null
                  }
                  onSelect={(subject) => {
                    const id = subject?.id ?? "";
                    form.setValue(`examSubjects.${index}.subjectId`, id, {
                      shouldValidate: true,
                    });
                    setSelectedSubjectIds((prev) => ({ ...prev, [index]: id }));
                    form.setValue(
                      `examSubjects.${index}.fullMarks`,
                      Number(subject?.fullMarks || 100)
                    );
                  }}
                  getLabel={(s) => s?.subjectName ?? ""}
                  getValue={(s) => s?.id ?? ""}
                />

                <InputElement
                  label="Full Marks"
                  form={form}
                  name={`examSubjects.${index}.fullMarks`}
                  type="number"
                  required
                />

                <InputElement
                  label="Pass Marks"
                  form={form}
                  name={`examSubjects.${index}.passMarks`}
                  type="number"
                  required
                />

                <div className="flex items-end pb-1">
                  <button
                    type="button"
                    onClick={() => {
                      remove(index);
                      setSelectedSubjectIds((prev) => {
                        const updated: { [key: number]: string } = {};
                        Object.entries(prev).forEach(([k, v]) => {
                          const ki = Number(k);
                          if (ki < index) updated[ki] = v;
                          else if (ki > index) updated[ki - 1] = v;
                        });
                        return updated;
                      });
                    }}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                append({ subjectId: "", fullMarks: 0, passMarks: 0 })
              }
              className="mt-2 px-3 py-1 bg-teal-500 text-white rounded hover:bg-teal-600"
            >
              Add Subject
            </button>
          </div>

          {/* Submit */}
          <div className="flex flex-col items-center mt-6 gap-2">
            <ButtonElement
              type="button"
              text="Submit"
              onClick={() =>
                form.handleSubmit(onSubmit, (errors) => {
                  console.error("Form validation errors:", errors);
                  Toast.error("Please fill in all required fields.");
                })()
              }
            />
            {Object.keys(form.formState.errors).length > 0 && (
              <p className="text-xs text-red-500">
                {Object.entries(form.formState.errors).map(
                  ([key, val]: any) => (
                    <span key={key} className="block">
                      {key}: {val?.message || "Required"}
                    </span>
                  )
                )}
              </p>
            )}
          </div>
        </form>
      </fieldset>
    </div>
  );
};

export default AddExamForm;