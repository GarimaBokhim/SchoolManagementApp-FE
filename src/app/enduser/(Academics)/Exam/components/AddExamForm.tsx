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
    <div className="inset-0 flex items-center justify-center w-full h-full">
      <div className="w-full h-full bg-white dark:bg-[#27272a] p-4 overflow-auto relative dark:text-white">
        <fieldset>
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold">Add Exam</h1>
            <button type="button" onClick={handleClose}>
              <X strokeWidth={3} />
            </button>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

              <InputElement
                label="Exam Name"
                form={form}
                name="name"
                placeholder="Enter Name"
                required
              />

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

              {/* ✅ Final Exam Checkbox */}
              <div className="flex items-center gap-2 mt-6">
                <input
                  type="checkbox"
                  {...form.register("isfinalExam")}
                />
                <label>Is Final Exam</label>
              </div>
            </div>

            {/* Subjects */}
            <div className="mt-6">
              <h2 className="font-semibold mb-2">Exam Subjects</h2>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-[2fr_1fr_1fr_auto] gap-3 mb-2"
                >
                  {/* Subject */}
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

                      form.setValue(
                        `examSubjects.${index}.subjectId`,
                        id,
                        { shouldValidate: true }
                      );

                      setSelectedSubjectIds((prev) => ({
                        ...prev,
                        [index]: id,
                      }));

                      form.setValue(
                        `examSubjects.${index}.fullMarks`,
                        Number(subject?.fullMarks || 100)
                      );
                    }}
                    getLabel={(s) => s?.subjectName ?? ""}
                    getValue={(s) => s?.id ?? ""}
                  />

                  {/* Full Marks */}
                  <InputElement
                    label="Full Marks"
                    form={form}
                    name={`examSubjects.${index}.fullMarks`}
                    type="number"
                    required
                  />

                  {/* Pass Marks */}
                  <InputElement
                    label="Pass Marks"
                    form={form}
                    name={`examSubjects.${index}.passMarks`}
                    type="number"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  append({
                    subjectId: "",
                    fullMarks: 0,
                    passMarks: 0,
                  })
                }
                className="mt-2 px-3 py-1 bg-teal-500 text-white rounded"
              >
                Add Subject
              </button>
            </div>

            {/* Submit */}
            <div className="flex justify-center mt-6">
              <ButtonElement type="submit" text="Submit" />
            </div>
          </form>
        </fieldset>
      </div>
    </div>
  );
};

export default AddExamForm;