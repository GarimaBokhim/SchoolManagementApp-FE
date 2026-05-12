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
import { useFilterClassByDate } from "../../Class/hooks";
import { useGetSubjectByClassId } from "../../Subject/hooks";

type Props = {
  form: UseFormReturn<IExam>;
  onClose: () => void;
};

const AddExamForm = ({ form, onClose }: Props) => {
  const addExam = useAddExam();
  const { handleError, clearError } = useErrorHandler();
  const { data: allClass } = useFilterClassByDate("?IsPagination=false");

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
      examDate: "" as any,
      isfinalExam: false,
      classId: "",
      schoolId: "",
      examSubjects: [],
    });
    onClose();
  };

  const onSubmit: SubmitHandler<IExam> = async (data) => {
    clearError();

    const formattedData = {
      name: data.name,
      examDate: data.examDate
        ? new Date(data.examDate).toISOString()
        : new Date().toISOString(),
      isfinalExam: data.isfinalExam || false,
      classId: data.classId,
      schoolId: data.schoolId,
      examSubjects: (data.examSubjects ?? []).map((s) => ({
        subjectId: s.subjectId,
        passMarksPr: Number(s.passMarksPr),
        fullMarksPr: Number(s.fullMarksPr),
        passMarksTh: Number(s.passMarksTh),
        fullMarksTh: Number(s.fullMarksTh),
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

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="overflow-visible"
        >
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-visible">
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
              isExpiryDate={true}
              required
            />

            <div className="relative z-0">
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
                  setSelectedSubjectIds({});
                }}
                getLabel={(e) => e?.name ?? ""}
                getValue={(e) => e?.id ?? ""}
                dropdownPositionClass="absolute top-full left-0 right-0 mt-1 z-50"
              />
            </div>
          </div>

          {/* Subjects Section */}
          <div className="relative mt-6 z-0">
            <h2 className="font-semibold mb-2">Exam Subjects</h2>

            {fields.length === 0 && (
              <p className="text-sm text-gray-400 dark:text-gray-500 mb-3">
                No subjects added yet. Click "+ Add Subject" to begin.
              </p>
            )}

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="border border-gray-200 dark:border-zinc-600 rounded-lg p-4 mb-3"
              >
                {/* Subject header + remove */}
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Subject {index + 1}
                  </p>
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

                {/* Subject combobox + 4 mark fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                  <div className="relative z-0">
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
                      }}
                      getLabel={(s) => s?.subjectName ?? ""}
                      getValue={(s) => s?.id ?? ""}
                      dropdownPositionClass="absolute top-full left-0 right-0 mt-1 z-50"
                    />
                  </div>

                  <InputElement
                    label="Full Marks (Practical)"
                    form={form}
                    name={`examSubjects.${index}.fullMarksPr`}
                    type="number"
                    placeholder="0"
                    required
                  />

                  <InputElement
                    label="Pass Marks (Practical)"
                    form={form}
                    name={`examSubjects.${index}.passMarksPr`}
                    type="number"
                    placeholder="0"
                    required
                  />

                  <InputElement
                    label="Full Marks (Theory)"
                    form={form}
                    name={`examSubjects.${index}.fullMarksTh`}
                    type="number"
                    placeholder="0"
                    required
                  />

                  <InputElement
                    label="Pass Marks (Theory)"
                    form={form}
                    name={`examSubjects.${index}.passMarksTh`}
                    type="number"
                    placeholder="0"
                    required
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                append({
                  subjectId: "",
                  fullMarksPr: 0,
                  passMarksPr: 0,
                  fullMarksTh: 0,
                  passMarksTh: 0,
                })
              }
              className="mt-2 px-3 py-1 bg-teal-500 text-white rounded hover:bg-teal-600"
            >
              + Add Subject
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