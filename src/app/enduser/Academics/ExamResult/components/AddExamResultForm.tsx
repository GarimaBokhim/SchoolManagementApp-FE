"use client";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
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
import { useGetAllSchool } from "@/app/admin/Setup/School/hooks";
import { useGetAllStudents } from "@/app/enduser/StudentManagement/Student/hooks";
import { useGetAllSubjects } from "../../Subject/hooks";
type Props = {
  form: UseFormReturn<IExamResult>;
  onClose: () => void;
};
const AddExamResultForm = ({ form, onClose }: Props) => {
  const addExamResult = useAddExamResult();
  const { handleError, clearError } = useErrorHandler();
  const handleClose = () => {
    form.reset();
  };
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(
    null
  );
  const { data: allExam } = useGetAllExams();
  const { data: allSchool } = useGetAllSchool();
  const { data: allSubject } = useGetAllSubjects();
  const { data: allStudents } = useGetAllStudents();
  const { watch, setValue } = form;
  const isChecked = watch("isActive", false);
  const handleCheckBoxChange = () => {
    setValue("isActive", !isChecked);
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
    <div className=" inset-0 flex items-center justify-center  w-full h-full">
      <div className="w-full  h-[100%] bg-[#ffffff] dark:bg-[#27272a] p-4 overflow-auto relative dark:text-white ">
        <fieldset className="">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
              Add ExamResult
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
                label="Student"
                name="studentId"
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
                label="School"
                name="schoolId"
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
              <AppCombobox
                value={selectedSubjectId}
                dropDownWidth="w-full"
                dropdownPositionClass="absolute"
                label="Subject"
                name="subjectId"
                form={form}
                required
                options={allSubject?.Items}
                selected={
                  allSubject?.Items?.find((g) => g.Id === selectedSubjectId) ||
                  null
                }
                onSelect={(group) => {
                  if (group) {
                    setSelectedSubjectId(group.Id || null);
                  } else {
                    setSelectedSubjectId(null);
                  }
                }}
                getLabel={(g) => g?.name ?? ""}
                getValue={(g) => g?.Id ?? ""}
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

export default AddExamResultForm;
