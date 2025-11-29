"use client";

import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { X } from "lucide-react";
import { IExamSeat } from "../types/IExamSeat";
import { useAddExamSeat } from "../hooks";
import toast from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { AppCombobox } from "@/components/Input/ComboBox";
import { useState } from "react";
import { useGetAllExams } from "../../Exam/hooks";
import { useGetAllStudents } from "@/app/enduser/(StudentManagement)/Student/hooks";

type Props = {
  form: UseFormReturn<IExamSeat>;
  onClose: () => void;
};

const AddExamSeatForm = ({ form, onClose }: Props) => {
  const addExamSeat = useAddExamSeat();
  const { handleError, clearError } = useErrorHandler();
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );
  const { data: allExam } = useGetAllExams();
  const { data: allStudents } = useGetAllStudents();

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const onSubmit: SubmitHandler<IExamSeat> = async (data) => {
    clearError();
    try {
      await toast.promise(addExamSeat.mutateAsync(data), {
        loading: "Adding ExamSeat...",
        success: "Successfully added ExamSeat",
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
              Add ExamSeat
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
                dropdownPositionClass="fixed"
                value={selectedExamId}
                options={allExam?.Items ?? []}
                selected={
                  allExam?.Items?.find((e) => e.id === selectedExamId) || null
                }
                onSelect={(exam) => {
                  const id = exam?.id ?? "";
                  setSelectedExamId(id);
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
                dropdownPositionClass="fixed"
                value={selectedStudentId}
                options={allStudents?.Items ?? []}
                selected={
                  allStudents?.Items?.find((s) => s.id === selectedStudentId) ||
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

              {/* Remarks */}
              <InputElement
                label="Remark"
                form={form}
                name="remarks"
                type="string"
                placeholder="Enter remark"
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

export default AddExamSeatForm;
