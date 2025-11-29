"use client";

import { SubmitHandler, UseFormReturn, useFieldArray } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { X } from "lucide-react";
import { IExamResult } from "../types/IExamResults";
import { useAddExamResult } from "../hooks";
import toast from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { AppCombobox } from "@/components/Input/ComboBox";
import { useState } from "react";
import { useGetAllExams } from "../../Exam/hooks";
import { useGetStudentByClass } from "@/app/enduser/(StudentManagement)/Student/hooks";
import { useGetSubjectByClassId } from "../../Subject/hooks";

type Props = {
  form: UseFormReturn<IExamResult>;
  onClose: () => void;
};

const AddExamResultForm = ({ form, onClose }: Props) => {
  const addExamResult = useAddExamResult();
  const { handleError, clearError } = useErrorHandler();

  const { control } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "marksObtained",
  });

  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<{
    [key: number]: string | null;
  }>({});
  const [selectedClassId, setSelectedClassId] = useState<string | undefined>(
    ""
  );
  const { data: allExam } = useGetAllExams();
  const { data: allStudents } = useGetStudentByClass(selectedClassId || "");
  const { data: allSubject } = useGetSubjectByClassId(selectedClassId || "");
  const handleClose = () => {
    form.reset();
    setSelectedClassId("");
    onClose();
  };

  const onSubmit: SubmitHandler<IExamResult> = async (data) => {
    clearError();
    try {
      await toast.promise(addExamResult.mutateAsync(data), {
        loading: "Adding ExamResult...",
        success: "Successfully added ExamResult",
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
              Add ExamResult
            </h1>

            <button
              type="button"
              onClick={handleClose}
              className="text-red-400 text-2xl hover:text-red-500"
            >
              <X strokeWidth={3} />
            </button>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AppCombobox
                dropDownWidth="w-[25rem]"
                label="Exam"
                name="examId"
                form={form}
                dropdownPositionClass="absolute"
                value={selectedExamId}
                options={allExam?.Items ?? []}
                selected={
                  allExam?.Items?.find((e) => e.id === selectedExamId) || null
                }
                onSelect={(exam) => {
                  const id = exam?.id ?? "";
                  setSelectedExamId(id);
                  setSelectedClassId(exam?.classId);
                  form.setValue("examId", id);
                }}
                getLabel={(e) => e?.name ?? ""}
                getValue={(e) => e?.id ?? ""}
              />
              <AppCombobox
                dropDownWidth="w-[25rem]"
                label="Student Name"
                name="studentId"
                form={form}
                dropdownPositionClass="absolute"
                value={selectedStudentId}
                options={allStudents?.Items ?? []}
                selected={
                  allStudents?.Items.find((s) => s.id === selectedStudentId) ||
                  null
                }
                onSelect={(student) => {
                  const id = student?.id ?? "";
                  setSelectedStudentId(id);
                  form.setValue("studentId", id);
                }}
                getLabel={(s) => s?.firstName ?? ""}
                getValue={(s) => s?.id ?? ""}
              />
              <InputElement
                label="Remark"
                form={form}
                name="remarks"
                type="string"
                placeholder="Enter remark"
              />
            </div>
            <div className="mt-10">
              <h2 className="text-lg font-semibold mb-3">Subject Marks</h2>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md mb-4 relative"
                >
                  <AppCombobox
                    dropDownWidth="w-[25rem]"
                    label="Subject"
                    name={`marksObtained.${index}.subjectId`}
                    form={form}
                    dropdownPositionClass="absolute"
                    value={selectedSubjectIds[index] ?? ""}
                    options={allSubject ?? []}
                    selected={
                      allSubject?.find(
                        (subj) => subj.id === selectedSubjectIds[index]
                      ) || null
                    }
                    onSelect={(subject) => {
                      const id = subject?.id ?? "";
                      form.setValue(`marksObtained.${index}.subjectId`, id, {
                        shouldValidate: true,
                      });
                      setSelectedSubjectIds((prev) => ({
                        ...prev,
                        [index]: id,
                      }));
                    }}
                    getLabel={(s) => s?.subjectName ?? ""}
                    getValue={(s) => s?.id ?? ""}
                  />

                  <InputElement
                    label="Marks Obtained"
                    form={form}
                    name={`marksObtained.${index}.marksObtained`}
                    type="number"
                    placeholder="Enter marks"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      remove(index);
                      setSelectedSubjectIds((prev) => {
                        const updated = { ...prev };
                        delete updated[index];
                        return updated;
                      });
                    }}
                    className="absolute right-2 top-2 text-red-400 hover:text-red-600"
                  >
                    <X />
                  </button>
                </div>
              ))}
              <ButtonElement
                type="button"
                text="Add Subject"
                onClick={() =>
                  append({
                    subjectId: "",
                    marksObtained: 0,
                  })
                }
              />
            </div>
            <div className="flex justify-center mt-6">
              <ButtonElement type="submit" text="Submit" />
            </div>
          </form>
        </fieldset>
      </div>
    </div>
  );
};

export default AddExamResultForm;
