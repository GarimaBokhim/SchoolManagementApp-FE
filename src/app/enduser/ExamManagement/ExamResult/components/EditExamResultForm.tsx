"use client";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { IExamResult } from "../types/IExamResults";
import { useEditExamResult, useGetExamResultById } from "../hooks";
import toast from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { AppCombobox } from "@/components/Input/ComboBox";
import { useGetAllExams } from "../../Exam/hooks";
import { useGetAllSchool } from "@/app/admin/Setup/School/hooks";
import { useGetAllStudents } from "@/app/enduser/StudentManagement/Student/hooks";
type Props = {
  form: UseFormReturn<IExamResult>;
  onClose: () => void;
  ExamResultId: string;
};
const EditExamResultForm = ({ form, onClose, ExamResultId }: Props) => {
  const editExamResult = useEditExamResult();
  const { handleError, clearError } = useErrorHandler();
  const { data: ExamResultData } = useGetExamResultById(ExamResultId);
  const handleClose = () => {
    form.reset();
  };
  const { watch, setValue } = form;
  const isChecked = watch("isActive", false);
  const handleCheckBoxChange = () => {
    setValue("isActive", !isChecked);
  };
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);
  const { data: allExam } = useGetAllExams();
  const { data: allSchool } = useGetAllSchool();
  const { data: allStudents } = useGetAllStudents();
  useEffect(() => {
    if (ExamResultData) {
      form.reset({
        examId: ExamResultData?.examId ?? "",
        studentId: ExamResultData?.studentId ?? "",
        subjectId: ExamResultData?.subjectId ?? "",
        marksObtained: ExamResultData?.marksObtained ?? 0,
        grade: ExamResultData?.grade ?? "",
        remarks: ExamResultData?.remarks ?? "",
        isActive: ExamResultData?.isActive ?? true,
        schoolId: ExamResultData?.examId ?? "",
      });
      setSelectedExamId(ExamResultData?.examId);
      setSelectedSchoolId(ExamResultData?.schoolId);
      setSelectedStudentId(ExamResultData?.studentId);
    }
  }, [ExamResultData]);
  const onSubmit: SubmitHandler<IExamResult> = async (data) => {
    clearError();

    try {
      clearError();
      await toast.promise(
        editExamResult.mutateAsync({
          id: ExamResultId,
          data: data,
        }),
        {
          loading: "Submitting Data",
          success: "Successfully Edited Income",
        }
      );
      handleClose();
    } catch (error) {
      const errorMsg = handleError(error);
      Toast.error(errorMsg);
    }
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center 
             bg-black/40 backdrop-blur-sm ml-12 md:ml-64 sm:ml-16 xs:ml-0"
    >
      <div
        className="bg-[#FBFBFB] dark:bg-[#27272a] 
               w-full max-w-[95vw] md:max-w-[85vw] lg:max-w-[75vw] xl:max-w-[70vw]
               max-h-[95vh] md:max-h-[92vh] h-full 
               rounded-lg overflow-auto p-6 md:p-8 shadow-lg"
      >
        <fieldset className="">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
              Update ExamResult
            </h1>
            <button
              type="button"
              onClick={onClose}
              className="text-red-400 text-2xl hover:text-red-500 "
            >
              <X strokeWidth={3} />
            </button>
          </div>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
              <AppCombobox
                value={selectedExamId}
                dropDownWidth="w-full"
                dropdownPositionClass="absolute"
                label="Exam"
                name="examId"
                form={form}
                required
                options={allExam?.Items}
                selected={
                  allExam?.Items?.find((g) => g.id === selectedExamId) || null
                }
                onSelect={(group) => {
                  if (group) {
                    setSelectedExamId(group.id || null);
                  } else {
                    setSelectedExamId(null);
                  }
                }}
                getLabel={(g) => g?.name ?? ""}
                getValue={(g) => g?.id ?? ""}
              />
              <AppCombobox
                value={selectedStudentId}
                dropDownWidth="w-full"
                dropdownPositionClass="absolute"
                label="Exam"
                name="examId"
                form={form}
                required
                options={allStudents?.Items}
                selected={
                  allStudents?.Items?.find((g) => g.id === selectedStudentId) ||
                  null
                }
                onSelect={(group) => {
                  if (group) {
                    setSelectedStudentId(group.id || null);
                  } else {
                    setSelectedStudentId(null);
                  }
                }}
                getLabel={(g) => g?.firstName ?? ""}
                getValue={(g) => g?.id ?? ""}
              />
              <AppCombobox
                value={selectedSchoolId}
                dropDownWidth="w-full"
                dropdownPositionClass="absolute"
                label="Exam"
                name="examId"
                form={form}
                required
                options={allSchool?.Items}
                selected={
                  allSchool?.Items?.find((g) => g.id === selectedSchoolId) ||
                  null
                }
                onSelect={(group) => {
                  if (group) {
                    setSelectedSchoolId(group.id || null);
                  } else {
                    setSelectedSchoolId(null);
                  }
                }}
                getLabel={(g) => g?.name ?? ""}
                getValue={(g) => g?.id ?? ""}
              />
              <InputElement
                label="Subject Id"
                form={form}
                name="subjectId"
                type="string"
                placeholder="Enter subjectId"
              />
              <InputElement
                label="Mark Obtained"
                form={form}
                name="marksObtained"
                type="number"
                placeholder="Enter Mark Obtained"
              />
              <InputElement
                label="Grade"
                form={form}
                name="grade"
                type="string"
                placeholder="Enter Grade"
              />
              <InputElement
                label="Remark"
                form={form}
                name="remark"
                type="string"
                placeholder="Enter Remark"
              />
              <div className="mb-6 relative flex items-center">
                <label className="pl-2 test-slate-500 pr-2">
                  {"Is Active"}
                </label>
                <InputElement
                  layout="row"
                  form={form}
                  checked={isChecked}
                  onChange={handleCheckBoxChange}
                  name="isActive"
                  inputTypeCheckBox="checkbox"
                  customStyle="!border-0 after:!content-none"
                />
              </div>
            </div>
            <div className="flex justify-center mt-6">
              <ButtonElement type="submit" text={"Submit"} />
            </div>
          </form>
        </fieldset>
      </div>
    </div>
  );
};

export default EditExamResultForm;
